#!/usr/bin/env python3
"""Row-level source comparison — identify exactly which rows are unique to
each source per table per child. Read-only.

For each (child, table), we build dicts keyed by NATURAL KEY (not the
auto-increment id, which differs across sources because D1 was wiped + re-populated).

Output:
  - rows in source A only
  - rows in source B only
  - rows in both (and any value conflicts)
  - merged total (the size of the merged table after restore)
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

# ----- Natural key functions -----
# All return a hashable key tuple from a normalised row dict.

def normalize_ts(s):
    """Strip 'Z', spaces vs T, microseconds — for tolerant timestamp matching."""
    if s is None:
        return None
    s = str(s).strip()
    s = s.replace("T", " ").replace("Z", "")
    if "." in s:
        s = s.split(".")[0]
    return s

def nk_quiz_results(r):
    return ("quiz", normalize_ts(r.get("completed_at") or r.get("date")),
            r.get("topic_key") or r.get("topic"),
            r.get("subject"))

def nk_question_results(r):
    return ("qr",
            r.get("question_id") if "question_id" in r else r.get("questionId"),
            r.get("topic_key") or r.get("topicKey"),
            r.get("subject"),
            normalize_ts(r.get("attempted_at") or r.get("date")))

def nk_achievements(r):
    return ("ach", r.get("achievement_id") or r)

def nk_topic_performance(r):
    return ("tp", r.get("topic_key"), r.get("subject"))

def nk_practice_sessions(r):
    # snapshot row has session_date column; cache row has session_date too
    return ("ps", r.get("session_date") or (r.get("data", {}) or {}).get("date"))

def nk_seen_tips(r):
    return ("st", r.get("tip_id"))

def nk_lesson_history(r):
    return ("lh", r.get("lesson_id"))

def nk_leitner_queue(r):
    return ("lq",
            r.get("question_id") if "question_id" in r else r.get("questionId"),
            r.get("topic_key") or r.get("topicKey"))

def nk_seen_questions(r):
    return ("sq",
            r.get("question_id") if "question_id" in r else r.get("questionId"),
            r.get("topic_key") or r.get("topicKey"))

# ----- Snapshot SQL parser -----

def parse_value(s):
    s = s.strip()
    if s == "NULL":
        return None
    if s.startswith("'") and s.endswith("'"):
        return s[1:-1].replace("''", "'")
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return s

def tokenize_values(vals_str):
    toks, cur, in_str = [], "", False
    i = 0
    while i < len(vals_str):
        ch = vals_str[i]
        if in_str:
            cur += ch
            if ch == "'":
                # check for escaped ''
                if i + 1 < len(vals_str) and vals_str[i + 1] == "'":
                    cur += "'"
                    i += 2
                    continue
                in_str = False
        else:
            if ch == "'":
                in_str = True
                cur += ch
            elif ch == ",":
                toks.append(cur)
                cur = ""
            else:
                cur += ch
        i += 1
    toks.append(cur)
    return toks

def parse_snapshot():
    text = SNAPSHOT.read_text(encoding="utf-8", errors="replace")
    rows_by_table = defaultdict(list)
    insert_re = re.compile(r'^INSERT INTO "([^"]+)"\s*\(([^)]+)\)\s*VALUES\((.*)\);\s*$')
    for line in text.splitlines():
        m = insert_re.match(line)
        if not m:
            continue
        table = m.group(1)
        cols = [c.strip().strip('"') for c in m.group(2).split(",")]
        toks = tokenize_values(m.group(3))
        if len(toks) != len(cols):
            continue
        row = {cols[i]: parse_value(toks[i]) for i in range(len(cols))}
        rows_by_table[table].append(row)
    return rows_by_table


# ----- Source extraction -----

def load_export(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))["localStorage"]

def cache_rows(ls, child_name, key):
    """Get rows from d1-cache for given child (D1 schema, snake_case)."""
    cache_raw = ls.get(f"d1-cache:{child_name}")
    if not cache_raw:
        return []
    cache = json.loads(cache_raw)
    val = cache.get(key)
    if isinstance(val, list):
        return val
    return []

def cache_scalar(ls, child_name, key):
    cache_raw = ls.get(f"d1-cache:{child_name}")
    if not cache_raw:
        return None
    cache = json.loads(cache_raw)
    return cache.get(key)

def legacy_value(ls, child_name, key, parse_json=True):
    raw = ls.get(f"user:{child_name}:{key}")
    if raw is None:
        return None
    if not parse_json:
        return raw
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw

def legacy_quiz_history_to_d1_shape(items, child_id):
    """quiz-history (legacy camelCase) → quiz_results (D1 snake_case)."""
    out = []
    for r in items:
        out.append({
            "child_id": child_id,
            "topic_key": r.get("topic"),
            "subject": r.get("subject"),
            "score": r.get("score"),
            "total": r.get("total"),
            "completed_at": r.get("date"),
            "session_id": r.get("sessionId"),
            "time_seconds": r.get("timeSeconds"),
            "quiz_mode": r.get("mode"),
        })
    return out

def legacy_question_results_to_d1_shape(items, child_id):
    out = []
    for r in items:
        out.append({
            "child_id": child_id,
            "question_id": r.get("questionId"),
            "topic_key": r.get("topicKey"),
            "subject": r.get("subject"),
            "is_correct": 1 if r.get("correct") else 0,
            "time_ms": r.get("timeSpentMs"),
            "difficulty": r.get("difficulty"),
            "attempted_at": r.get("date"),
            "session_id": r.get("sessionId"),
            "selected_answer": r.get("selectedAnswer"),
        })
    return out

def legacy_practice_log_to_d1_shape(items, child_id):
    """practice-log is a flat list of session dicts; cache + D1 wrap them in
    {session_date, data:{...}}."""
    out = []
    for r in items:
        date = r.get("date")
        out.append({
            "child_id": child_id,
            "session_date": date,
            "data": r,  # keep nested structure
        })
    return out

def legacy_streaks_to_d1_shape(obj, child_id):
    if not obj:
        return None
    return {
        "child_id": child_id,
        "current_streak": obj.get("currentStreak"),
        "longest_streak": obj.get("longestStreak"),
        "last_quiz_date": obj.get("lastQuizDate"),
        "streak_history": obj.get("streakHistory") or [],
        "version": obj.get("version", 1),
    }

def legacy_prepPoints_to_d1_shape(obj, child_id):
    if not obj:
        return None
    return {
        "child_id": child_id,
        "total": obj.get("total"),
        "level": obj.get("level"),
        "today_pp": obj.get("todayPP"),
        "today_date": obj.get("todayDate"),
        "version": obj.get("version", 1),
    }

def legacy_achievements_to_d1_shape(items, child_id):
    """legacy achievements is a list of strings; D1 has rows with achievement_id."""
    if not items:
        return []
    return [{"child_id": child_id, "achievement_id": a} for a in items]

def legacy_lessonHistory_to_d1_shape(obj, child_id):
    """legacy lesson-history shape varies. Inspect."""
    if not obj:
        return []
    if isinstance(obj, dict):
        return [{"child_id": child_id, "lesson_id": k, "completed_at": v}
                for k, v in obj.items()]
    if isinstance(obj, list):
        return [{"child_id": child_id, **r} for r in obj]
    return []

# ----- Comparator -----

def compare(label, rows_a, rows_b, key_fn, name_a="A", name_b="B"):
    """Compare two row sets by natural key. Return (only_a, only_b, both, conflicts)."""
    a_map = {key_fn(r): r for r in rows_a}
    b_map = {key_fn(r): r for r in rows_b}
    only_a = a_map.keys() - b_map.keys()
    only_b = b_map.keys() - a_map.keys()
    both = a_map.keys() & b_map.keys()
    print(f"\n  {label}:")
    print(f"    {name_a:<14} rows: {len(a_map):>5}")
    print(f"    {name_b:<14} rows: {len(b_map):>5}")
    print(f"    in both:         {len(both):>5}")
    print(f"    only in {name_a}: {len(only_a):>5}")
    print(f"    only in {name_b}: {len(only_b):>5}")
    print(f"    union (merged):  {len(a_map | b_map):>5}")
    return only_a, only_b, both, a_map, b_map


# ===== Run =====

snap = parse_snapshot()
home = load_export(RECOVERY / "prepstep-export-home-pc-2026-04-28.json")
work = load_export(RECOVERY / "prepstep-export-work-pc-2026-04-28.json")
ipad = load_export(RECOVERY / "prepstep-export-evies-ipad-2026-04-28.json")

# ----- BEN -----
print("=" * 78)
print("  BEN  —  D1 SNAPSHOT  vs  WORK PC d1-cache")
print("=" * 78)

ben_id = CHILD["Ben"]

snap_ben = lambda t: [r for r in snap.get(t, []) if r.get("child_id") == ben_id]

compare("quiz_results",
        snap_ben("quiz_results"),
        cache_rows(work, "Ben", "quizResults"),
        nk_quiz_results, "snapshot", "work PC")

compare("question_results",
        snap_ben("question_results"),
        cache_rows(work, "Ben", "questionResults"),
        nk_question_results, "snapshot", "work PC")

compare("achievements",
        snap_ben("achievements"),
        cache_rows(work, "Ben", "achievements"),
        nk_achievements, "snapshot", "work PC")

compare("topic_performance",
        snap_ben("topic_performance"),
        cache_rows(work, "Ben", "topicPerformance"),
        nk_topic_performance, "snapshot", "work PC")

compare("practice_sessions",
        snap_ben("practice_sessions"),
        cache_rows(work, "Ben", "practiceSessions"),
        nk_practice_sessions, "snapshot", "work PC")

compare("seen_tips",
        snap_ben("seen_tips"),
        cache_rows(work, "Ben", "seenTips"),
        nk_seen_tips, "snapshot", "work PC")

compare("lesson_history",
        snap_ben("lesson_history"),
        cache_rows(work, "Ben", "lessonHistory"),
        nk_lesson_history, "snapshot", "work PC")

compare("leitner_queue",
        snap_ben("leitner_queue"),
        cache_rows(work, "Ben", "leitnerQueue"),
        nk_leitner_queue, "snapshot", "work PC")

compare("seen_questions",
        snap_ben("seen_questions"),
        cache_rows(work, "Ben", "seenQuestions"),
        nk_seen_questions, "snapshot", "work PC")

# Scalar tables for Ben
print("\n  STREAKS:")
print(f"    snapshot: (no rows for Ben — wiped)")
print(f"    work PC:  {json.dumps(cache_scalar(work, 'Ben', 'streaks'))[:200]}")
print("\n  PREP_POINTS:")
print(f"    snapshot: (no rows for Ben — wiped)")
print(f"    work PC:  {json.dumps(cache_scalar(work, 'Ben', 'prepPoints'))[:200]}")
print("\n  PREFERENCES:")
print(f"    snapshot: (no rows for Ben — wiped)")
print(f"    work PC:  {json.dumps(cache_scalar(work, 'Ben', 'preferences'))[:200]}")


# ----- EVIE -----
print()
print("=" * 78)
print("  EVIE  —  iPad d1-cache  vs  iPad legacy localStorage")
print("=" * 78)

evie_id = CHILD["Evie"]

# Convert legacy keys to D1 shape for fair comparison
legacy_quizzes  = legacy_quiz_history_to_d1_shape(legacy_value(ipad, "Evie", "quiz-history") or [], evie_id)
legacy_qresults = legacy_question_results_to_d1_shape(legacy_value(ipad, "Evie", "question-results") or [], evie_id)
legacy_practice = legacy_practice_log_to_d1_shape(legacy_value(ipad, "Evie", "practice-log") or [], evie_id)
legacy_leitner  = [{"child_id": evie_id, **r} for r in (legacy_value(ipad, "Evie", "leitner-queue") or [])]
legacy_ach      = legacy_achievements_to_d1_shape(legacy_value(ipad, "Evie", "achievements") or [], evie_id)
legacy_tips     = []  # seen-tips legacy structure not yet inspected; will check separately

compare("quiz_results",
        cache_rows(ipad, "Evie", "quizResults"),
        legacy_quizzes,
        nk_quiz_results, "iPad cache", "iPad legacy")

compare("question_results",
        cache_rows(ipad, "Evie", "questionResults"),
        legacy_qresults,
        nk_question_results, "iPad cache", "iPad legacy")

compare("practice_sessions",
        cache_rows(ipad, "Evie", "practiceSessions"),
        legacy_practice,
        nk_practice_sessions, "iPad cache", "iPad legacy")

compare("achievements",
        cache_rows(ipad, "Evie", "achievements"),
        legacy_ach,
        nk_achievements, "iPad cache", "iPad legacy")

compare("leitner_queue",
        cache_rows(ipad, "Evie", "leitnerQueue"),
        legacy_leitner,
        nk_leitner_queue, "iPad cache", "iPad legacy")

# Scalar Evie tables
print("\n  STREAKS:")
print(f"    iPad cache:  {json.dumps(cache_scalar(ipad, 'Evie', 'streaks'))[:200]}")
print(f"    iPad legacy: {json.dumps(legacy_streaks_to_d1_shape(legacy_value(ipad, 'Evie', 'streaks'), evie_id))[:200]}")
print("\n  PREP_POINTS:")
print(f"    iPad cache:  {json.dumps(cache_scalar(ipad, 'Evie', 'prepPoints'))[:200]}")
print(f"    iPad legacy: {json.dumps(legacy_prepPoints_to_d1_shape(legacy_value(ipad, 'Evie', 'prep-points'), evie_id))[:200]}")
print("\n  PREFERENCES:")
print(f"    iPad cache:  {json.dumps(cache_scalar(ipad, 'Evie', 'preferences'))[:200]}")
print(f"    iPad legacy lastSessionDate: {legacy_value(ipad, 'Evie', 'last-session-date', parse_json=False)}")

print()
print("=" * 78)
print("  CROSS-CHECK: snapshot Evie  vs  iPad legacy Evie")
print("=" * 78)
snap_evie = lambda t: [r for r in snap.get(t, []) if r.get("child_id") == evie_id]

compare("quiz_results", snap_evie("quiz_results"), legacy_quizzes,
        nk_quiz_results, "snapshot", "iPad legacy")
compare("achievements", snap_evie("achievements"), legacy_ach,
        nk_achievements, "snapshot", "iPad legacy")
compare("practice_sessions", snap_evie("practice_sessions"), legacy_practice,
        nk_practice_sessions, "snapshot", "iPad legacy")
