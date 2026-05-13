#!/usr/bin/env python3
"""Recovery inventory — per-source per-table per-child row count + latest timestamp.

Read-only. Compares:
  - SQL snapshot (post-wipe, post-home-PC-remigration, pre-freeze)
  - Home PC export
  - Work PC export
  - iPad export
For Ben and Evie only.
"""

import json
import re
import sys
from pathlib import Path
from collections import defaultdict

BASE = Path(r"C:\Users\Ben Jackson")
RECOVERY = BASE / "Documents" / "My Brain" / "Recovery"
SNAPSHOT = BASE / "Projects" / "11plus-prep" / "backups" / "d1-snapshot-2026-04-27-pre-freeze.sql"

CHILD = {
    "Ben":  "b495e022-dffe-44eb-a3b2-36b419003311",
    "Evie": "0aa8fb45-b9a7-40d7-8df2-b739546aeffa",
}

# D1 cache key inside each export → table mapping
CACHE_KEYS = [
    "quizResults", "questionResults", "mockTestResults", "topicPerformance",
    "leitnerQueue", "lessonHistory", "seenQuestions", "practiceSessions",
    "achievements", "seenTips", "streaks", "prepPoints", "preferences",
]

# Legacy localStorage keys
LEGACY_MAP = {
    "quiz-history":       "quizResults_legacy",
    "question-results":   "questionResults_legacy",
    "practice-log":       "practiceSessions_legacy",
    "topic-performance":  "topicPerformance_legacy",
    "leitner-queue":      "leitnerQueue_legacy",
    "seen-questions":     "seenQuestions_legacy",
    "seen-tips":          "seenTips_legacy",
    "prep-points":        "prepPoints_legacy",
    "last-session-date":  "lastSessionDate_legacy",
    "testing-coverage":   "testingCoverage_legacy",
    "achievements":       "achievements_legacy",
    "streaks":            "streaks_legacy",
    "lesson-history":     "lessonHistory_legacy",
}


def latest_ts(rows, *fields):
    """Return latest timestamp string from rows across the given field names."""
    if not rows:
        return None
    best = None
    for r in rows:
        if not isinstance(r, dict):
            continue
        for f in fields:
            v = r.get(f)
            if v and isinstance(v, str):
                if best is None or v > best:
                    best = v
    return best


def count_rows(v):
    """Best-effort row count for a localStorage value."""
    if v is None:
        return 0
    if isinstance(v, list):
        return len(v)
    if isinstance(v, dict):
        # streaks/prepPoints/preferences are scalar dicts — count as 1 if non-empty
        return 1 if v else 0
    return 0


def inventory_export(path: Path, child_name: str):
    """Inventory one device export JSON for a given child."""
    data = json.loads(path.read_text(encoding="utf-8"))
    storage = data.get("localStorage") or data.get("storage") or data
    out = {}

    # d1-cache:<Name>
    cache_key = f"d1-cache:{child_name}"
    cache_raw = storage.get(cache_key)
    cache = {}
    if cache_raw:
        try:
            cache = json.loads(cache_raw) if isinstance(cache_raw, str) else cache_raw
        except json.JSONDecodeError:
            cache = {}

    for k in CACHE_KEYS:
        v = cache.get(k)
        n = count_rows(v)
        ts = None
        if isinstance(v, list):
            ts = latest_ts(v, "completed_at", "completedAt", "answered_at",
                           "answeredAt", "viewed_at", "viewedAt", "created_at",
                           "createdAt", "earned_at", "earnedAt", "started_at",
                           "startedAt")
        elif isinstance(v, dict):
            ts = (v.get("last_quiz_date") or v.get("lastQuizDate")
                  or v.get("today_date") or v.get("todayDate")
                  or v.get("last_session_date") or v.get("lastSessionDate"))
        out[k] = (n, ts)

    # cache migration metadata
    mig = cache.get("migration") if isinstance(cache, dict) else None
    out["_cache_migrated_at"] = (None, mig.get("migrated_at") if mig else None)
    out["_cache_items_imported"] = (mig.get("items_imported") if mig else 0, None)

    # legacy keys: user:<Name>:<key>
    for legacy_k, label in LEGACY_MAP.items():
        full = f"user:{child_name}:{legacy_k}"
        raw = storage.get(full)
        if raw is None:
            out[label] = (0, None)
            continue
        try:
            v = json.loads(raw) if isinstance(raw, str) else raw
        except json.JSONDecodeError:
            out[label] = (-1, None)
            continue
        n = count_rows(v)
        ts = None
        if isinstance(v, list):
            ts = latest_ts(v, "completedAt", "answeredAt", "viewedAt",
                           "createdAt", "earnedAt", "startedAt", "date")
        elif isinstance(v, dict):
            ts = (v.get("lastQuizDate") or v.get("todayDate")
                  or v.get("lastSessionDate"))
            if not ts and legacy_k == "last-session-date":
                ts = v if isinstance(v, str) else None
        elif isinstance(v, str):
            ts = v
            n = 1
        out[label] = (n, ts)

    return out


def inventory_snapshot():
    """Parse the SQL snapshot and tally per-child rows + latest ts per table."""
    text = SNAPSHOT.read_text(encoding="utf-8", errors="replace")
    # Each table → {child_id: (count, latest_ts)}
    per_table = defaultdict(lambda: defaultdict(lambda: [0, None]))

    # Map table → ts column name we care about (None = no ts column)
    TS_COL = {
        "quiz_results": "completed_at",
        "mock_test_results": "completed_at",
        "question_results": "answered_at",
        "lesson_history": "viewed_at",
        "practice_sessions": "started_at",
        "seen_questions": "first_seen_at",
        "achievements": "earned_at",
        "seen_tips": "shown_at",
        "topic_performance": "updated_at",
        "leitner_queue": "next_review",
        "streaks": "last_quiz_date",
        "prep_points": "today_date",
        "preferences": "last_session_date",
    }

    insert_re = re.compile(r'^INSERT INTO "([^"]+)"\s*\(([^)]+)\)\s*VALUES\((.*)\);\s*$')
    for line in text.splitlines():
        m = insert_re.match(line)
        if not m:
            continue
        table, cols_str, vals_str = m.group(1), m.group(2), m.group(3)
        cols = [c.strip().strip('"') for c in cols_str.split(",")]

        # Find child_id position
        if "child_id" not in cols:
            continue
        ci = cols.index("child_id")

        # Tokenise values respecting single-quoted strings
        toks = []
        cur, in_str, esc = "", False, False
        for ch in vals_str:
            if in_str:
                cur += ch
                if ch == "'" and not esc:
                    if cur.endswith("''"):
                        esc = True
                        continue
                    in_str = False
                else:
                    esc = False
            else:
                if ch == "'":
                    in_str = True
                    cur += ch
                elif ch == ",":
                    toks.append(cur.strip())
                    cur = ""
                else:
                    cur += ch
        toks.append(cur.strip())

        if ci >= len(toks):
            continue
        child_raw = toks[ci].strip("'")
        if child_raw not in (CHILD["Ben"], CHILD["Evie"]):
            continue

        per_table[table][child_raw][0] += 1

        ts_col = TS_COL.get(table)
        if ts_col and ts_col in cols:
            ti = cols.index(ts_col)
            if ti < len(toks):
                ts = toks[ti].strip("'")
                if ts and ts != "NULL":
                    cur_best = per_table[table][child_raw][1]
                    if cur_best is None or ts > cur_best:
                        per_table[table][child_raw][1] = ts

    return per_table


# --- Run ---
print(f"\n{'='*78}\nRECOVERY INVENTORY — {len([p for p in RECOVERY.glob('*.json')])} JSON files\n{'='*78}\n")

home = inventory_export(RECOVERY / "prepstep-export-home-pc-2026-04-28.json", "Ben")
work = inventory_export(RECOVERY / "prepstep-export-work-pc-2026-04-28.json", "Ben")
ipad = inventory_export(RECOVERY / "prepstep-export-evies-ipad-2026-04-28.json", "Evie")
snap = inventory_snapshot()

# Print Ben matrix
def matrix(child_name, exports):
    cid = CHILD[child_name]
    print(f"\n--- {child_name.upper()}  (child_id {cid[:8]}...) ---")
    print(f"{'Source':<22}", end="")
    for label, _ in exports:
        print(f"{label:<22}", end="")
    print(f"{'D1 snapshot':<22}")

    # D1 cache entries
    print("\n[d1-cache fields]")
    for k in CACHE_KEYS:
        print(f"  {k:<20}", end="")
        for _, exp in exports:
            n, ts = exp.get(k, (0, None))
            ts_short = (ts[:16] if ts else "—")
            print(f"{n:>4}  {ts_short:<14}", end="  ")
        # Map cache field → snapshot table
        snap_table_map = {
            "quizResults": "quiz_results",
            "questionResults": "question_results",
            "mockTestResults": "mock_test_results",
            "topicPerformance": "topic_performance",
            "leitnerQueue": "leitner_queue",
            "lessonHistory": "lesson_history",
            "seenQuestions": "seen_questions",
            "practiceSessions": "practice_sessions",
            "achievements": "achievements",
            "seenTips": "seen_tips",
            "streaks": "streaks",
            "prepPoints": "prep_points",
            "preferences": "preferences",
        }
        st = snap_table_map.get(k)
        if st:
            n, ts = snap[st][cid]
            ts_short = (ts[:16] if ts else "—")
            print(f"{n:>4}  {ts_short:<14}", end="")
        print()

    # Migration metadata
    print(f"\n  cache migration ts:")
    for label, exp in exports:
        ts = exp.get("_cache_migrated_at", (None, None))[1]
        items = exp.get("_cache_items_imported", (0, None))[0]
        print(f"    {label}: migrated_at={ts}  items_imported={items}")

    # Legacy keys
    print("\n[legacy localStorage]")
    for k in sorted(LEGACY_MAP.values()):
        print(f"  {k:<26}", end="")
        for _, exp in exports:
            n, ts = exp.get(k, (0, None))
            ts_short = (ts[:16] if ts else "—")
            print(f"{n:>4}  {ts_short:<14}", end="  ")
        print()


matrix("Ben", [("home PC", home), ("work PC", work)])
matrix("Evie", [("iPad", ipad)])

print("\n\n=== KEY TIMESTAMPS ===")
print(f"Wipe time:                 2026-04-27 19:29:57")
print(f"Home PC re-migration:      2026-04-27 19:40:34 (post-wipe)")
print(f"Evie iPad re-migration:    2026-04-27 20:09:51 (post-wipe)")
print(f"Snapshot taken (pre-freeze, but POST-wipe-and-remigration):")
print(f"  -> snapshot reflects the post-wipe state PLUS home-PC's re-migrated rows")
print()
