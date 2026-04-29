#!/usr/bin/env python3
"""Local test for the worker SQL changes (Fixes A, B, C).

Exercises the exact SQL strings emitted by batch.js and mutable.js against
a SQLite copy of production. Verifies the meta.changes semantics that the
worker depends on.

Tests:
  Fix A — topic-performance CAS:
    * upsert NEW row at version 1 -> changes=1
    * upsert match version=N -> changes=1, row updated, version=N+1
    * upsert stale version=N-1 -> changes=0, row unchanged

  Fix B — streaks/PP/prefs CAS:
    * UPDATE matching version -> changes=1, version incremented
    * UPDATE stale version -> changes=0, no change

  Fix C — quiz_results / question_results INSERT OR IGNORE:
    * INSERT new row -> changes=1
    * INSERT same (child_id, session_id, topic_key, subject) -> changes=0 (silently ignored)
    * INSERT row with NULL session_id -> changes=1 always (partial index excludes NULLs)
"""

import os
import sqlite3
import sys
from pathlib import Path

PROJECT = Path(r"C:\Users\Ben Jackson\Projects\11plus-prep")
SNAPSHOT = PROJECT / "backups" / "d1-snapshot-2026-04-27-pre-freeze.sql"
MIGRATION = PROJECT / "workers" / "ai-tutor" / "migrations" / "0007_replay_protection.sql"
MERGE_SQL = PROJECT / "recovery-output" / "merge-ben-evie.sql"
DB_PATH = PROJECT / "recovery-output" / "worker-test.db"

BEN = "b495e022-dffe-44eb-a3b2-36b419003311"
EVIE = "0aa8fb45-b9a7-40d7-8df2-b739546aeffa"


def setup_db():
    """Build a fresh SQLite DB matching production state after merge + migration."""
    if DB_PATH.exists():
        DB_PATH.unlink()
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SNAPSHOT.read_text(encoding="utf-8", errors="replace"))
    conn.executescript(MERGE_SQL.read_text(encoding="utf-8"))
    conn.executescript(MIGRATION.read_text(encoding="utf-8"))
    conn.commit()
    return conn


def assert_eq(label, actual, expected):
    ok = actual == expected
    mark = "PASS" if ok else "FAIL"
    print(f"  [{mark}] {label}: expected {expected!r}, got {actual!r}")
    return ok


def test_fix_c_quiz_insert_or_ignore(conn):
    print("\n--- Fix C: quiz_results INSERT OR IGNORE ---")
    failures = []

    # Pick an existing Ben quiz row (with session_id) to simulate a stale replay
    row = conn.execute(
        "SELECT topic_key, subject, score, total, session_id FROM quiz_results "
        "WHERE child_id = ? AND session_id IS NOT NULL LIMIT 1", (BEN,)
    ).fetchone()
    topic_key, subject, score, total, session_id = row

    before = conn.execute("SELECT COUNT(*) FROM quiz_results WHERE child_id = ?", (BEN,)).fetchone()[0]

    # Simulate a stale device replay: same (child_id, session_id, topic_key, subject)
    cur = conn.execute(
        "INSERT OR IGNORE INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode, session_id) "
        "VALUES (?, ?, ?, ?, ?, NULL, NULL, ?)",
        (BEN, topic_key, subject, score, total, session_id)
    )
    if not assert_eq("replay duplicate is ignored (changes==0)", cur.rowcount, 0): failures.append(1)
    after = conn.execute("SELECT COUNT(*) FROM quiz_results WHERE child_id = ?", (BEN,)).fetchone()[0]
    if not assert_eq("row count unchanged", after, before): failures.append(1)

    # New session_id should INSERT successfully
    cur = conn.execute(
        "INSERT OR IGNORE INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode, session_id) "
        "VALUES (?, ?, ?, ?, ?, NULL, NULL, ?)",
        (BEN, topic_key, subject, score, total, 9999999999999)
    )
    if not assert_eq("genuinely-new row inserts (changes==1)", cur.rowcount, 1): failures.append(1)

    # NULL session_id always inserts (partial index excludes NULLs)
    before = conn.execute("SELECT COUNT(*) FROM quiz_results WHERE child_id = ? AND session_id IS NULL", (BEN,)).fetchone()[0]
    cur1 = conn.execute(
        "INSERT OR IGNORE INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode, session_id) "
        "VALUES (?, 'percentages', 'maths', 5, 10, NULL, NULL, NULL)", (BEN,)
    )
    cur2 = conn.execute(
        "INSERT OR IGNORE INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode, session_id) "
        "VALUES (?, 'percentages', 'maths', 5, 10, NULL, NULL, NULL)", (BEN,)
    )
    if not assert_eq("NULL session_id inserts twice freely", cur1.rowcount + cur2.rowcount, 2): failures.append(1)

    conn.rollback()
    return failures


def test_fix_c_question_insert_or_ignore(conn):
    print("\n--- Fix C: question_results INSERT OR IGNORE ---")
    failures = []
    row = conn.execute(
        "SELECT question_id, topic_key, subject, session_id FROM question_results "
        "WHERE child_id = ? AND session_id IS NOT NULL LIMIT 1", (BEN,)
    ).fetchone()
    qid, topic_key, subject, session_id = row

    before = conn.execute("SELECT COUNT(*) FROM question_results WHERE child_id = ?", (BEN,)).fetchone()[0]
    cur = conn.execute(
        "INSERT OR IGNORE INTO question_results (child_id, question_id, topic_key, subject, is_correct, time_ms, difficulty, session_id, selected_answer) "
        "VALUES (?, ?, ?, ?, 1, NULL, NULL, ?, NULL)",
        (BEN, qid, topic_key, subject, session_id)
    )
    if not assert_eq("replay duplicate is ignored (changes==0)", cur.rowcount, 0): failures.append(1)
    after = conn.execute("SELECT COUNT(*) FROM question_results WHERE child_id = ?", (BEN,)).fetchone()[0]
    if not assert_eq("row count unchanged", after, before): failures.append(1)
    conn.rollback()
    return failures


def test_fix_a_topic_performance_cas(conn):
    print("\n--- Fix A: topic_performance atomic CAS ---")
    failures = []

    # Find an existing topic_performance row
    row = conn.execute(
        "SELECT topic_key, subject, version FROM topic_performance WHERE child_id = ? LIMIT 1",
        (BEN,)
    ).fetchone()
    topic_key, subject, current_version = row

    # Test 1: matching version -> updates, version increments
    cur = conn.execute(
        """INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
           VALUES (?, ?, ?, ?, 1)
           ON CONFLICT(child_id, topic_key, subject) DO UPDATE SET
             data = excluded.data,
             version = topic_performance.version + 1,
             updated_at = datetime('now')
           WHERE topic_performance.version = ?""",
        (BEN, topic_key, subject, '{"correct":99,"total":100}', current_version)
    )
    if not assert_eq("CAS hit (matching version) -> changes=1", cur.rowcount, 1): failures.append(1)
    new_v = conn.execute("SELECT version FROM topic_performance WHERE child_id=? AND topic_key=? AND subject=?",
                         (BEN, topic_key, subject)).fetchone()[0]
    if not assert_eq("version incremented", new_v, current_version + 1): failures.append(1)

    # Test 2: stale version -> changes=0
    cur = conn.execute(
        """INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
           VALUES (?, ?, ?, ?, 1)
           ON CONFLICT(child_id, topic_key, subject) DO UPDATE SET
             data = excluded.data,
             version = topic_performance.version + 1,
             updated_at = datetime('now')
           WHERE topic_performance.version = ?""",
        (BEN, topic_key, subject, '{"correct":1,"total":1}', current_version)  # stale version
    )
    if not assert_eq("CAS miss (stale version) -> changes=0", cur.rowcount, 0): failures.append(1)
    after = conn.execute("SELECT version FROM topic_performance WHERE child_id=? AND topic_key=? AND subject=?",
                         (BEN, topic_key, subject)).fetchone()[0]
    if not assert_eq("version unchanged after stale CAS", after, new_v): failures.append(1)

    # Test 3: brand new (topic_key, subject) -> INSERT path, changes=1
    cur = conn.execute(
        """INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
           VALUES (?, ?, ?, ?, 1)
           ON CONFLICT(child_id, topic_key, subject) DO UPDATE SET
             data = excluded.data,
             version = topic_performance.version + 1,
             updated_at = datetime('now')
           WHERE topic_performance.version = ?""",
        (BEN, "fresh-topic", "maths", '{"correct":3,"total":5}', 1)
    )
    if not assert_eq("INSERT new row -> changes=1", cur.rowcount, 1): failures.append(1)

    conn.rollback()
    return failures


def test_fix_b_streaks_cas(conn):
    print("\n--- Fix B: streaks atomic CAS ---")
    failures = []
    row = conn.execute("SELECT version FROM streaks WHERE child_id = ?", (BEN,)).fetchone()
    current_v = row[0]

    # Matching version -> update succeeds
    cur = conn.execute(
        """UPDATE streaks SET current_streak = ?, longest_streak = ?, last_quiz_date = ?,
                                streak_history = ?, version = version + 1, updated_at = datetime('now')
           WHERE child_id = ? AND version = ?""",
        (14, 14, '2026-04-29', '[]', BEN, current_v)
    )
    if not assert_eq("CAS hit -> changes=1", cur.rowcount, 1): failures.append(1)
    new_v = conn.execute("SELECT version FROM streaks WHERE child_id = ?", (BEN,)).fetchone()[0]
    if not assert_eq("version incremented", new_v, current_v + 1): failures.append(1)

    # Stale version -> no change
    cur = conn.execute(
        """UPDATE streaks SET current_streak = ?, longest_streak = ?, last_quiz_date = ?,
                                streak_history = ?, version = version + 1, updated_at = datetime('now')
           WHERE child_id = ? AND version = ?""",
        (99, 99, '1999-01-01', '[]', BEN, current_v)  # stale
    )
    if not assert_eq("CAS miss (stale) -> changes=0", cur.rowcount, 0): failures.append(1)
    after = conn.execute("SELECT current_streak FROM streaks WHERE child_id = ?", (BEN,)).fetchone()[0]
    if not assert_eq("data unchanged after stale CAS", after, 14): failures.append(1)

    conn.rollback()
    return failures


def test_fix_b_prep_points_cas(conn):
    print("\n--- Fix B: prep_points atomic CAS ---")
    failures = []
    current_v = conn.execute("SELECT version FROM prep_points WHERE child_id = ?", (BEN,)).fetchone()[0]

    cur = conn.execute(
        """UPDATE prep_points SET total = ?, level = ?, today_pp = ?, today_date = ?,
                                    version = version + 1, updated_at = datetime('now')
           WHERE child_id = ? AND version = ?""",
        (16500, 18, 300, '2026-04-29', BEN, current_v)
    )
    if not assert_eq("CAS hit -> changes=1", cur.rowcount, 1): failures.append(1)

    cur = conn.execute(
        """UPDATE prep_points SET total = ?, level = ?, today_pp = ?, today_date = ?,
                                    version = version + 1, updated_at = datetime('now')
           WHERE child_id = ? AND version = ?""",
        (99999, 99, 0, '2099-01-01', BEN, current_v)  # stale
    )
    if not assert_eq("CAS miss (stale) -> changes=0", cur.rowcount, 0): failures.append(1)

    conn.rollback()
    return failures


def test_fix_b_preferences_cas(conn):
    print("\n--- Fix B: preferences atomic CAS ---")
    failures = []
    current_v = conn.execute("SELECT version FROM preferences WHERE child_id = ?", (BEN,)).fetchone()[0]

    cur = conn.execute(
        """UPDATE preferences SET last_session_date = ?, version = version + 1, updated_at = datetime('now')
           WHERE child_id = ? AND version = ?""",
        ('2026-04-29T17:00:00Z', BEN, current_v)
    )
    if not assert_eq("CAS hit -> changes=1", cur.rowcount, 1): failures.append(1)

    cur = conn.execute(
        """UPDATE preferences SET last_session_date = ?, version = version + 1, updated_at = datetime('now')
           WHERE child_id = ? AND version = ?""",
        ('1999-01-01', BEN, current_v)  # stale
    )
    if not assert_eq("CAS miss (stale) -> changes=0", cur.rowcount, 0): failures.append(1)

    conn.rollback()
    return failures


def main():
    print(f"DB: {DB_PATH}")
    conn = setup_db()
    all_failures = []
    all_failures += test_fix_c_quiz_insert_or_ignore(conn)
    all_failures += test_fix_c_question_insert_or_ignore(conn)
    all_failures += test_fix_a_topic_performance_cas(conn)
    all_failures += test_fix_b_streaks_cas(conn)
    all_failures += test_fix_b_prep_points_cas(conn)
    all_failures += test_fix_b_preferences_cas(conn)
    conn.close()

    print()
    print("=" * 60)
    if all_failures:
        print(f"FAIL — {len(all_failures)} assertion(s)")
        sys.exit(1)
    else:
        print("ALL FIX TESTS PASS")


if __name__ == "__main__":
    main()
