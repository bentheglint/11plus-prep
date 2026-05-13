#!/usr/bin/env python3
"""Local staging test for the recovery merge.

1. Build a fresh SQLite DB from the pre-freeze snapshot SQL (= reproduce
   D1's exact pre-freeze state, including all 6 children's data).
2. Capture row counts BEFORE the merge for every child in every affected
   table (so we can prove other children are untouched).
3. Apply recovery-output/merge-ben-evie.sql in a single transaction.
4. Capture row counts AFTER the merge.
5. Verify:
   - Ben+Evie row counts match the merge plan exactly
   - Other children (Jacqui, Test, Ella, Viv) row counts are UNCHANGED
   - Scalar tables (streaks/prep_points/preferences) for Ben+Evie hold
     the expected values (13-day streak, 16,200 PP, etc).
6. Print a clear PASS/FAIL summary.
"""

import sqlite3
import sys
from pathlib import Path

PROJECT = Path(r"C:\Users\Ben Jackson\Projects\11plus-prep")
SNAPSHOT = PROJECT / "backups" / "d1-snapshot-2026-04-27-pre-freeze.sql"
MERGE_SQL = PROJECT / "recovery-output" / "merge-ben-evie.sql"
DB_PATH = PROJECT / "recovery-output" / "staging-test.db"

CHILDREN = {
    "Ben":     "b495e022-dffe-44eb-a3b2-36b419003311",
    "Evie":    "0aa8fb45-b9a7-40d7-8df2-b739546aeffa",
    "Jacqui":  "c2718a5c-0301-4300-9a10-5b5d29b4a386",
    "Test":    "de7de003-dc3e-4ebe-bfd1-df6e4cedb1b0",
    "Ella":    "618ecc1d-8c9e-467a-9873-dc7da1c1039b",
    "Viv":     "0478472c-9b84-4cd8-b3ca-12456d0d8c0c",
}

TABLES = [
    "quiz_results", "question_results", "achievements", "topic_performance",
    "practice_sessions", "seen_tips", "lesson_history", "leitner_queue",
    "seen_questions", "streaks", "prep_points", "preferences",
]

EXPECTED = {
    "Ben":  {"quiz_results": 72, "question_results": 648, "achievements": 17,
             "topic_performance": 20, "practice_sessions": 17, "seen_tips": 107,
             "lesson_history": 2, "leitner_queue": 3, "seen_questions": 0,
             "streaks": 1, "prep_points": 1, "preferences": 1},
    "Evie": {"quiz_results": 60, "question_results": 388, "achievements": 11,
             "topic_performance": 29, "practice_sessions": 21, "seen_tips": 108,
             "lesson_history": 25, "leitner_queue": 62, "seen_questions": 0,
             "streaks": 1, "prep_points": 1, "preferences": 1},
}


def reset_db():
    if DB_PATH.exists():
        DB_PATH.unlink()
    return sqlite3.connect(DB_PATH)


def execute_script(conn, sql_text, label):
    """Run a multi-statement SQL script. Falls back to executescript when
    the file is one big block (the snapshot)."""
    try:
        conn.executescript(sql_text)
    except sqlite3.Error as e:
        print(f"FAIL: {label}: {e}")
        sys.exit(1)


def count_rows(conn, table, child_id):
    cur = conn.execute(f"SELECT COUNT(*) FROM {table} WHERE child_id = ?", (child_id,))
    return cur.fetchone()[0]


def all_children_counts(conn, table):
    return {name: count_rows(conn, table, cid) for name, cid in CHILDREN.items()}


def main():
    print(f"Snapshot:   {SNAPSHOT}")
    print(f"Merge SQL:  {MERGE_SQL}")
    print(f"Test DB:    {DB_PATH}")
    print()

    if not SNAPSHOT.exists():
        print("FAIL: snapshot file missing")
        sys.exit(1)
    if not MERGE_SQL.exists():
        print("FAIL: merge SQL missing — run build-merge-sql.py first")
        sys.exit(1)

    print("=== STEP 1: Build fresh SQLite from pre-freeze snapshot ===")
    conn = reset_db()
    snapshot_text = SNAPSHOT.read_text(encoding="utf-8", errors="replace")
    execute_script(conn, snapshot_text, "snapshot")
    conn.commit()
    print("  loaded.")

    print()
    print("=== STEP 2: BEFORE row counts (per child × per table) ===")
    print(f"  {'table':<22}", end="")
    for n in CHILDREN: print(f"{n:>9}", end="")
    print()
    before = {}
    for t in TABLES:
        before[t] = all_children_counts(conn, t)
        print(f"  {t:<22}", end="")
        for n in CHILDREN: print(f"{before[t][n]:>9}", end="")
        print()

    print()
    print("=== STEP 3: Apply merge SQL ===")
    merge_text = MERGE_SQL.read_text(encoding="utf-8")
    execute_script(conn, merge_text, "merge SQL")
    conn.commit()
    print("  applied.")

    print()
    print("=== STEP 4: AFTER row counts ===")
    print(f"  {'table':<22}", end="")
    for n in CHILDREN: print(f"{n:>9}", end="")
    print()
    after = {}
    for t in TABLES:
        after[t] = all_children_counts(conn, t)
        print(f"  {t:<22}", end="")
        for n in CHILDREN: print(f"{after[t][n]:>9}", end="")
        print()

    print()
    print("=== STEP 5: Verification ===")
    failures = []

    # Ben + Evie expected counts
    for child in ("Ben", "Evie"):
        for t in TABLES:
            actual = after[t][child]
            expected = EXPECTED[child][t]
            mark = "PASS" if actual == expected else "FAIL"
            if actual != expected:
                failures.append(f"{child} {t}: expected {expected}, got {actual}")
            print(f"  [{mark}] {child:<5} {t:<22} expected={expected:>4}  actual={actual:>4}")

    print()
    # Other children must be UNCHANGED
    for child in ("Jacqui", "Test", "Ella", "Viv"):
        for t in TABLES:
            if before[t][child] != after[t][child]:
                failures.append(f"{child} {t}: BEFORE={before[t][child]} AFTER={after[t][child]} (should be unchanged!)")
                print(f"  [FAIL] {child:<7} {t:<22} BEFORE={before[t][child]} AFTER={after[t][child]}")
    if not any(c in fr for fr in failures for c in ("Jacqui", "Test", "Ella", "Viv")):
        print("  [PASS] All other children's data is UNCHANGED across all 12 tables")

    print()
    # Scalar value verification
    print("=== STEP 6: Scalar value spot-checks ===")
    spot_checks = [
        ("Ben streak", "SELECT current_streak, longest_streak, last_quiz_date FROM streaks WHERE child_id = ?",
         CHILDREN["Ben"], (13, 13, "2026-04-27")),
        ("Ben prep_points", "SELECT total, level, today_pp, today_date FROM prep_points WHERE child_id = ?",
         CHILDREN["Ben"], (16200, 18, 1485, "2026-04-27")),
        ("Ben preferences", "SELECT last_session_date FROM preferences WHERE child_id = ?",
         CHILDREN["Ben"], ("2026-04-27T15:17:26.283Z",)),
        ("Evie streak", "SELECT current_streak, longest_streak, last_quiz_date FROM streaks WHERE child_id = ?",
         CHILDREN["Evie"], (2, 7, "2026-04-25")),
        ("Evie prep_points", "SELECT total, level, today_pp, today_date FROM prep_points WHERE child_id = ?",
         CHILDREN["Evie"], (11970, 15, 405, "2026-04-25")),
        ("Evie preferences", "SELECT last_session_date FROM preferences WHERE child_id = ?",
         CHILDREN["Evie"], ("2026-04-27T16:35:23.625Z",)),
    ]
    for label, query, child_id, expected in spot_checks:
        row = conn.execute(query, (child_id,)).fetchone()
        ok = (row == expected)
        mark = "PASS" if ok else "FAIL"
        print(f"  [{mark}] {label:<22} expected={expected}  actual={row}")
        if not ok:
            failures.append(f"{label}: expected {expected}, got {row}")

    # Foreign-key integrity check
    print()
    print("=== STEP 7: FK integrity ===")
    conn.execute("PRAGMA foreign_keys = ON;")
    fk_violations = list(conn.execute("PRAGMA foreign_key_check;"))
    if fk_violations:
        print(f"  [FAIL] {len(fk_violations)} FK violations after merge:")
        for v in fk_violations[:5]:
            print(f"    {v}")
        failures.append(f"{len(fk_violations)} FK violations")
    else:
        print("  [PASS] no FK violations")

    # Natural-key uniqueness check (relevant for Fix C UNIQUE INDEX migration)
    print()
    print("=== STEP 7b: Natural-key dedup (replay protection precondition) ===")
    quiz_dups = list(conn.execute("""
        SELECT child_id, session_id, topic_key, subject, COUNT(*) AS n
        FROM quiz_results
        WHERE session_id IS NOT NULL
        GROUP BY child_id, session_id, topic_key, subject
        HAVING n > 1
    """))
    qr_dups = list(conn.execute("""
        SELECT child_id, question_id, session_id, topic_key, COUNT(*) AS n
        FROM question_results
        WHERE session_id IS NOT NULL
        GROUP BY child_id, question_id, session_id, topic_key
        HAVING n > 1
    """))
    if quiz_dups:
        print(f"  [FAIL] quiz_results: {len(quiz_dups)} duplicate-key groups would block UNIQUE INDEX")
        failures.append(f"quiz_results has {len(quiz_dups)} natural-key duplicates")
    else:
        print("  [PASS] quiz_results: no natural-key duplicates (with session_id)")
    if qr_dups:
        print(f"  [FAIL] question_results: {len(qr_dups)} duplicate-key groups would block UNIQUE INDEX")
        failures.append(f"question_results has {len(qr_dups)} natural-key duplicates")
    else:
        print("  [PASS] question_results: no natural-key duplicates (with session_id)")

    # Latest quiz timestamps for fun
    print()
    print("=== STEP 8: Latest activity per child ===")
    for name, cid in CHILDREN.items():
        cur = conn.execute("SELECT MAX(completed_at) FROM quiz_results WHERE child_id = ?", (cid,))
        row = cur.fetchone()[0]
        cur2 = conn.execute("SELECT COUNT(*) FROM quiz_results WHERE child_id = ?", (cid,))
        n = cur2.fetchone()[0]
        print(f"  {name:<7} {n:>4} quizzes, latest = {row}")

    conn.close()

    print()
    print("=" * 60)
    if failures:
        print(f"FAIL — {len(failures)} issue(s):")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    else:
        print("ALL CHECKS PASS")
        print()
        print("Merge SQL is safe to apply to production D1.")


if __name__ == "__main__":
    main()
