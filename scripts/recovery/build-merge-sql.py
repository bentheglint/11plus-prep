#!/usr/bin/env python3
"""Build the recovery merge SQL for Ben + Evie.

Reads:
  - backups/d1-snapshot-2026-04-27-pre-freeze.sql
  - Recovery/prepstep-export-work-pc-2026-04-28.json     (Ben primary)
  - Recovery/prepstep-export-evies-ipad-2026-04-28.json  (Evie scalars + question_results)

Emits:
  - recovery-output/merge-ben-evie.sql   (single transaction, idempotent for Ben+Evie)
  - recovery-output/merge-summary.txt    (row counts)

Per-table merge plan (derived from inventory + overlap analysis):

Ben:
  quiz_results       UNION(work PC, snapshot)         — work PC fresher, snapshot has 1 unique
  question_results   work PC                          — strict superset, real timestamps
  achievements       work PC                          — snapshot wiped
  topic_performance  snapshot                         — superset of work PC (placeholder data)
  practice_sessions  work PC (UNION by session_date)  — work PC has all snapshot rows + 3 more
  seen_tips          work PC (UNION by tip_id)        — superset
  lesson_history     work PC                          — snapshot empty
  leitner_queue      snapshot                         — work PC empty
  seen_questions     snapshot                         — placeholder
  streaks/prep_points/preferences  work PC            — snapshot wiped (migration null bug)

Evie:
  quiz_results       snapshot                         — real timestamps preserved
  question_results   iPad legacy                      — real timestamps; cache+snapshot clobbered
  achievements       snapshot                         — clobbered timestamps but only option
  topic_performance  snapshot                         — full set
  practice_sessions  iPad legacy (UNION via snapshot) — legacy has 1 extra row
  seen_tips          snapshot                         — full set
  lesson_history     snapshot                         — full set
  leitner_queue      iPad legacy                      — 68 rows vs cache's 9 (truncated)
  seen_questions     snapshot                         — placeholder
  streaks/prep_points/preferences  iPad legacy        — cache+snapshot have null (migration bug)

Placeholder rows (question_id=0, topic_key='') are DROPPED.
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime
from collections import defaultdict

BASE = Path(r"C:\Users\Ben Jackson")
RECOVERY = BASE / "Documents" / "My Brain" / "Recovery"
PROJECT = BASE / "Projects" / "11plus-prep"
SNAPSHOT = PROJECT / "backups" / "d1-snapshot-2026-04-27-pre-freeze.sql"
OUT_DIR = PROJECT / "recovery-output"
OUT_SQL = OUT_DIR / "merge-ben-evie.sql"
OUT_SUMMARY = OUT_DIR / "merge-summary.txt"

CHILD = {
    "Ben":  "b495e022-dffe-44eb-a3b2-36b419003311",
    "Evie": "0aa8fb45-b9a7-40d7-8df2-b739546aeffa",
}

# Used wherever the source has no real created_at/updated_at (NOT NULL columns
# in D1). All other timestamps in the merge use the source's real values.
RECOVERY_TS = "2026-04-29 12:00:00"

# ===== Snapshot SQL parser =====

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


def tokenize_values(v):
    toks, cur, in_str, i = [], "", False, 0
    while i < len(v):
        ch = v[i]
        if in_str:
            cur += ch
            if ch == "'":
                if i + 1 < len(v) and v[i + 1] == "'":
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
    rows = defaultdict(list)
    rx = re.compile(r'^INSERT INTO "([^"]+)"\s*\(([^)]+)\)\s*VALUES\((.*)\);\s*$')
    for line in text.splitlines():
        m = rx.match(line)
        if not m:
            continue
        table = m.group(1)
        cols = [c.strip().strip('"') for c in m.group(2).split(",")]
        toks = tokenize_values(m.group(3))
        if len(toks) == len(cols):
            rows[table].append({cols[i]: parse_value(toks[i]) for i in range(len(cols))})
    return rows


# ===== Source loaders =====

def load_export(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))["localStorage"]


def cache(ls, name):
    raw = ls.get(f"d1-cache:{name}")
    return json.loads(raw) if raw else {}


def legacy(ls, name, key):
    raw = ls.get(f"user:{name}:{key}")
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw


# ===== Filter junk =====

def is_placeholder(r):
    """Drop junk rows: post-wipe migration placeholder rows (qid=0, topic=''),
    and any row with null question_id (8 such rows in Evie's iPad leitner_queue
    legacy export are clearly garbage)."""
    qid = r.get("question_id")
    tk = r.get("topic_key", None)
    if qid is None:
        return True
    if qid == 0 and (tk is None or tk == ""):
        return True
    return False


# ===== SQL emitter =====

def sql_value(v):
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "1" if v else "0"
    if isinstance(v, (int, float)):
        return str(v)
    s = str(v).replace("'", "''")
    return f"'{s}'"


def insert_stmt(table, cols, row):
    vals = ", ".join(sql_value(row.get(c)) for c in cols)
    cols_s = ", ".join(cols)
    return f'INSERT INTO {table} ({cols_s}) VALUES ({vals});'


# ===== Per-table merge logic =====

def legacy_quiz_history_row(r, child_id):
    """Convert a legacy `user:X:quiz-history` row (camelCase, with sessionId)
    to D1 quiz_results shape. Preserves session_id which the migration handler
    dropped when re-migrating from legacy to D1 post-wipe."""
    return {
        "child_id": child_id,
        "topic_key": r.get("topic"),
        "subject": r.get("subject"),
        "score": r.get("score"),
        "total": r.get("total"),
        "time_seconds": r.get("timeSeconds"),
        "quiz_mode": r.get("mode"),
        "completed_at": r.get("date"),
        "session_id": r.get("sessionId"),
    }


def build_quiz_results(ben_id, evie_id, snap, work, ipad):
    """Combine all sources, prefer rows that have session_id (for replay-protection
    UNIQUE index). For each child, pick rows by natural key — preferring the
    source with session_id populated.

    Sources:
      Ben:  work PC d1-cache (pre-wipe, has session_ids)
            home PC legacy   (has session_ids — recovers ones snapshot lost)
            snapshot         (post-wipe migration; lost session_ids)
      Evie: iPad d1-cache    (post-wipe, lost session_ids)
            iPad legacy      (has session_ids — preferred)
            snapshot         (same as cache)
    """
    cols = ["child_id", "topic_key", "subject", "score", "total",
            "time_seconds", "quiz_mode", "completed_at", "session_id"]

    def normalize_cache(r, child_id):
        return {c: (child_id if c == "child_id" else r.get(c)) for c in cols}

    def union_key(r):
        """Cross-source UNION key. Prefer (session_id, topic, subject) when
        session_id is set — that's the true natural key. Fall back to
        normalised completed_at when session_id is missing (older rows)."""
        sid = r.get("session_id")
        if sid is not None:
            return ("sid", sid, r.get("topic_key"), r.get("subject"))
        ts = (r.get("completed_at") or "").replace("T", " ").replace("Z", "")
        if "." in ts:
            ts = ts.split(".")[0]
        return ("ts", ts, r.get("topic_key"), r.get("subject"))

    def dedupe_natural_key(rows):
        """Within a source, collapse rows with the same (session_id, topic_key,
        subject) to a single row. Keeps the first occurrence."""
        seen = {}
        out = []
        for r in rows:
            sid = r.get("session_id")
            if sid is None:
                out.append(r)  # can't dedupe NULL-sid rows
                continue
            k = (sid, r.get("topic_key"), r.get("subject"))
            if k not in seen:
                seen[k] = True
                out.append(r)
        return out

    def normalise_ts(s):
        if not s:
            return ""
        s = str(s).replace("T", " ").replace("Z", "")
        if "." in s:
            s = s.split(".")[0]
        return s

    def merge_preferring_session_id(*sources):
        """UNION sources by union_key. When the same key exists in multiple
        sources, prefer the one with a non-null session_id.

        Two-phase: phase 1 collects by union_key; phase 2 drops ts-only
        entries whose (ts, topic, subj) matches a sid-bearing row's
        completed_at — those are the same logical quiz, just with the sid
        field nulled by the post-wipe migration."""
        chosen = {}
        for src_rows in sources:
            for r in src_rows:
                k = union_key(r)
                existing = chosen.get(k)
                if existing is None:
                    chosen[k] = r
                elif existing.get("session_id") is None and r.get("session_id") is not None:
                    chosen[k] = r

        # Phase 2: any ts-only entry whose ts matches a sid-bearing row → drop.
        sid_ts_set = set()
        for r in chosen.values():
            if r.get("session_id") is not None:
                sid_ts_set.add((normalise_ts(r.get("completed_at")),
                                r.get("topic_key"), r.get("subject")))

        kept = []
        for k, r in chosen.items():
            if r.get("session_id") is None:
                if (normalise_ts(r.get("completed_at")),
                    r.get("topic_key"), r.get("subject")) in sid_ts_set:
                    continue  # drop — duplicate of a sid-bearing row
            kept.append(r)
        return kept

    # ── Ben ──
    work_rows = dedupe_natural_key(
        [normalize_cache(r, ben_id) for r in cache(work, "Ben").get("quizResults", [])]
    )
    home_legacy_rows = dedupe_natural_key([
        legacy_quiz_history_row(r, ben_id)
        for r in (legacy(_HOME_EXPORT, "Ben", "quiz-history") or [])
    ])
    snap_rows = dedupe_natural_key(
        [normalize_cache(r, ben_id) for r in snap["quiz_results"] if r["child_id"] == ben_id]
    )
    ben_rows = merge_preferring_session_id(work_rows, home_legacy_rows, snap_rows)

    # ── Evie ──
    ipad_legacy_rows = dedupe_natural_key([
        legacy_quiz_history_row(r, evie_id)
        for r in (legacy(ipad, "Evie", "quiz-history") or [])
    ])
    ipad_cache_rows = dedupe_natural_key(
        [normalize_cache(r, evie_id) for r in cache(ipad, "Evie").get("quizResults", [])]
    )
    snap_evie_rows = dedupe_natural_key(
        [normalize_cache(r, evie_id) for r in snap["quiz_results"] if r["child_id"] == evie_id]
    )
    evie_rows = merge_preferring_session_id(ipad_legacy_rows, ipad_cache_rows, snap_evie_rows)

    return cols, ben_rows, evie_rows


def build_question_results(ben_id, evie_id, snap, work, ipad):
    """Ben: work PC d1-cache (preserves real timestamps).
       Evie: iPad legacy (preserves real timestamps; cache + snapshot have all
             rows clobbered to migration time)."""
    cols = ["child_id", "question_id", "topic_key", "subject", "is_correct",
            "time_ms", "difficulty", "attempted_at", "session_id", "selected_answer"]

    def normalize_cache(r, child_id):
        out = {c: r.get(c) for c in cols}
        out["child_id"] = child_id
        return out

    def normalize_legacy(r, child_id):
        return {
            "child_id": child_id,
            "question_id": r.get("questionId"),
            "topic_key": r.get("topicKey"),
            "subject": r.get("subject"),
            "is_correct": 1 if r.get("correct") else 0,
            "time_ms": r.get("timeSpentMs"),
            "difficulty": r.get("difficulty"),
            "attempted_at": r.get("date"),
            "session_id": r.get("sessionId"),
            "selected_answer": (str(r.get("selectedAnswer"))
                                if r.get("selectedAnswer") is not None else None),
        }

    def dedupe_natural_key(normalised, source):
        """Dedupe by (question_id, session_id, topic_key). Pre-existing bug
        sometimes triple-submitted question results — keep the row whose id
        is lowest (first inserted)."""
        pairs = list(zip(normalised, source))
        # Use cache rows' D1 id; for legacy rows the local id will sort fine too.
        pairs.sort(key=lambda p: p[1].get("id") or 0)
        seen = {}
        for n, src in pairs:
            sid = n.get("session_id") or src.get("session_id") or src.get("sessionId")
            if sid is None:
                # No session_id — keep all (can't safely dedupe)
                seen[("nosid", id(src))] = n
                continue
            k = (n.get("question_id"), sid, n.get("topic_key"))
            seen.setdefault(k, n)
        return list(seen.values())

    ben_src = [r for r in cache(work, "Ben").get("questionResults", [])
               if not is_placeholder(r)]
    ben_normalised = [normalize_cache(r, ben_id) for r in ben_src]
    ben_rows = dedupe_natural_key(ben_normalised, ben_src)

    legacy_qr = legacy(ipad, "Evie", "question-results") or []
    evie_src = [r for r in legacy_qr if r.get("questionId") not in (None, 0) or
                (r.get("topicKey") not in (None, ""))]
    evie_normalised = [normalize_legacy(r, evie_id) for r in evie_src]
    # Filter placeholders post-conversion too
    pairs = [(n, s) for n, s in zip(evie_normalised, evie_src) if not is_placeholder(n)]
    if pairs:
        evie_normalised = [n for n, _ in pairs]
        evie_src = [s for _, s in pairs]
    else:
        evie_normalised = []
        evie_src = []
    evie_rows = dedupe_natural_key(evie_normalised, evie_src)

    return cols, ben_rows, evie_rows


def build_achievements(ben_id, evie_id, snap, work, ipad):
    """Ben: work PC d1-cache (real unlocked_at).
       Evie: snapshot (legacy is just a list of ids — no unlocked_at to recover)."""
    cols = ["child_id", "achievement_id", "unlocked_at", "seen"]

    ben_cache = cache(work, "Ben").get("achievements", [])
    ben_rows = [{"child_id": ben_id,
                 "achievement_id": r["achievement_id"],
                 "unlocked_at": r["unlocked_at"],
                 "seen": r.get("seen", 0)}
                for r in ben_cache]

    evie_rows = [{"child_id": evie_id,
                  "achievement_id": r["achievement_id"],
                  "unlocked_at": r["unlocked_at"],
                  "seen": r.get("seen", 0)}
                 for r in snap["achievements"] if r["child_id"] == evie_id]

    return cols, ben_rows, evie_rows


def build_topic_performance(ben_id, evie_id, snap, work, ipad):
    """Both children: snapshot wins (fuller). Data is JSON-stringified."""
    cols = ["child_id", "topic_key", "subject", "data", "version", "updated_at"]

    def from_snap(r):
        data = r["data"]
        if not isinstance(data, str):
            data = json.dumps(data)
        return {**r, "data": data}

    ben_rows = [from_snap(r) for r in snap["topic_performance"] if r["child_id"] == ben_id]
    evie_rows = [from_snap(r) for r in snap["topic_performance"] if r["child_id"] == evie_id]
    return cols, ben_rows, evie_rows


def build_practice_sessions(ben_id, evie_id, snap, work, ipad):
    """Ben: work PC cache (UNION over snapshot by session_date).
       Evie: iPad legacy (UNION over snapshot by session_date).
    UNIQUE(child_id, session_date) — dedupe by session_date, keep first.
    The `data` column is JSON-stringified."""
    cols = ["child_id", "session_date", "data", "created_at"]

    def cache_to_row(r, child_id):
        data = r.get("data")
        if not isinstance(data, str):
            data = json.dumps(data)
        return {"child_id": child_id,
                "session_date": r["session_date"],
                "data": data,
                "created_at": r.get("created_at") or RECOVERY_TS}

    def legacy_to_row(r, child_id):
        # legacy practice-log items are flat dicts with `date` etc
        data = json.dumps(r)
        # Use the row's own lastUpdated if present, else the session_date
        # (created_at must be NOT NULL).
        return {"child_id": child_id,
                "session_date": r["date"],
                "data": data,
                "created_at": r.get("lastUpdated") or r.get("date") or RECOVERY_TS}

    def snap_to_row(r):
        # snap row already has session_date + JSON string in data
        return {c: r.get(c) for c in cols}

    # Ben: work PC primary, fill from snapshot
    by_date = {}
    for r in cache(work, "Ben").get("practiceSessions", []):
        row = cache_to_row(r, ben_id)
        by_date[row["session_date"]] = row
    for r in snap["practice_sessions"]:
        if r["child_id"] != ben_id:
            continue
        row = snap_to_row(r)
        by_date.setdefault(row["session_date"], row)
    ben_rows = list(by_date.values())

    # Evie: iPad legacy primary, fill from snapshot
    by_date = {}
    for r in (legacy(ipad, "Evie", "practice-log") or []):
        row = legacy_to_row(r, evie_id)
        by_date[row["session_date"]] = row
    for r in snap["practice_sessions"]:
        if r["child_id"] != evie_id:
            continue
        row = snap_to_row(r)
        by_date.setdefault(row["session_date"], row)
    evie_rows = list(by_date.values())

    return cols, ben_rows, evie_rows


def build_seen_tips(ben_id, evie_id, snap, work, ipad):
    """Ben: work PC cache (superset). Evie: snapshot (full set)."""
    cols = ["child_id", "tip_id", "last_seen_date"]

    def cache_to_row(r, cid):
        return {"child_id": cid, "tip_id": r["tip_id"], "last_seen_date": r["last_seen_date"]}

    seen = {}
    for r in cache(work, "Ben").get("seenTips", []):
        seen[r["tip_id"]] = cache_to_row(r, ben_id)
    for r in snap["seen_tips"]:
        if r["child_id"] != ben_id:
            continue
        seen.setdefault(r["tip_id"], {c: r.get(c) for c in cols})
    ben_rows = list(seen.values())

    evie_rows = [{c: r.get(c) for c in cols} for r in snap["seen_tips"] if r["child_id"] == evie_id]

    return cols, ben_rows, evie_rows


def build_lesson_history(ben_id, evie_id, snap, work, ipad):
    """Ben: work PC. Evie: snapshot."""
    cols = ["child_id", "lesson_id", "completed_at"]

    ben_rows = [{"child_id": ben_id,
                 "lesson_id": r["lesson_id"],
                 "completed_at": r["completed_at"]}
                for r in cache(work, "Ben").get("lessonHistory", [])]

    evie_rows = [{c: r.get(c) for c in cols}
                 for r in snap["lesson_history"] if r["child_id"] == evie_id]

    return cols, ben_rows, evie_rows


def build_leitner_queue(ben_id, evie_id, snap, work, ipad):
    """Ben: snapshot (work PC empty). Evie: iPad legacy (68 vs cache's 9)."""
    cols = ["child_id", "question_id", "topic_key", "subject", "level",
            "last_reviewed", "next_review", "times_correct", "times_incorrect"]

    ben_rows = [{c: r.get(c) for c in cols}
                for r in snap["leitner_queue"]
                if r["child_id"] == ben_id and not is_placeholder(r)]

    legacy_lq = legacy(ipad, "Evie", "leitner-queue") or []
    evie_rows = [{**{c: r.get(c) for c in cols}, "child_id": evie_id}
                 for r in legacy_lq if not is_placeholder(r)]

    # Dedupe by PK in case of any collisions
    def dedupe(rows):
        seen = {}
        for r in rows:
            seen[(r["child_id"], r["question_id"], r["topic_key"])] = r
        return list(seen.values())

    return cols, dedupe(ben_rows), dedupe(evie_rows)


def build_seen_questions(ben_id, evie_id, snap, work, ipad):
    """Just preserve snapshot rows (excluding placeholders). Cache version
    has same data."""
    cols = ["child_id", "question_id", "topic_key", "subject", "first_seen_at"]
    ben_rows = [{c: r.get(c) for c in cols}
                for r in snap["seen_questions"]
                if r["child_id"] == ben_id and not is_placeholder(r)]
    evie_rows = [{c: r.get(c) for c in cols}
                 for r in snap["seen_questions"]
                 if r["child_id"] == evie_id and not is_placeholder(r)]
    return cols, ben_rows, evie_rows


def build_streaks(ben_id, evie_id, snap, work, ipad):
    """Ben: work PC (snapshot has none). Evie: iPad legacy (cache nulled)."""
    cols = ["child_id", "current_streak", "longest_streak", "last_quiz_date",
            "streak_history", "version", "updated_at"]

    s_ben = cache(work, "Ben").get("streaks") or {}
    ben_rows = [{
        "child_id": ben_id,
        "current_streak": s_ben.get("current_streak", 0),
        "longest_streak": s_ben.get("longest_streak", 0),
        "last_quiz_date": s_ben.get("last_quiz_date"),
        "streak_history": json.dumps(s_ben.get("streak_history") or []),
        "version": s_ben.get("version", 1),
        "updated_at": RECOVERY_TS,
    }] if s_ben else []

    s_evie = legacy(ipad, "Evie", "streaks") or {}
    evie_rows = [{
        "child_id": evie_id,
        "current_streak": s_evie.get("currentStreak", 0),
        "longest_streak": s_evie.get("longestStreak", 0),
        "last_quiz_date": s_evie.get("lastQuizDate"),
        "streak_history": json.dumps(s_evie.get("streakHistory") or []),
        "version": s_evie.get("version", 1),
        "updated_at": RECOVERY_TS,
    }] if s_evie else []

    return cols, ben_rows, evie_rows


def build_prep_points(ben_id, evie_id, snap, work, ipad):
    cols = ["child_id", "total", "level", "today_pp", "today_date", "version", "updated_at"]

    p_ben = cache(work, "Ben").get("prepPoints") or {}
    ben_rows = [{
        "child_id": ben_id,
        "total": p_ben.get("total", 0),
        "level": p_ben.get("level", 1),
        "today_pp": p_ben.get("today_pp", 0),
        "today_date": p_ben.get("today_date"),
        "version": p_ben.get("version", 1),
        "updated_at": RECOVERY_TS,
    }] if p_ben else []

    p_evie = legacy(ipad, "Evie", "prep-points") or {}
    evie_rows = [{
        "child_id": evie_id,
        "total": p_evie.get("total", 0),
        "level": p_evie.get("level", 1),
        "today_pp": p_evie.get("todayPP", 0),
        "today_date": p_evie.get("todayDate"),
        "version": p_evie.get("version", 1),
        "updated_at": RECOVERY_TS,
    }] if p_evie else []

    return cols, ben_rows, evie_rows


def build_preferences(ben_id, evie_id, snap, work, ipad):
    cols = ["child_id", "last_session_date", "version", "updated_at"]

    p_ben = cache(work, "Ben").get("preferences") or {}
    ben_rows = [{
        "child_id": ben_id,
        "last_session_date": p_ben.get("last_session_date"),
        "version": p_ben.get("version", 1),
        "updated_at": RECOVERY_TS,
    }] if p_ben else []

    lsd_evie = legacy(ipad, "Evie", "last-session-date")
    evie_rows = [{
        "child_id": evie_id,
        "last_session_date": lsd_evie,
        "version": 1,
        "updated_at": RECOVERY_TS,
    }] if lsd_evie else []

    return cols, ben_rows, evie_rows


# ===== Build SQL =====

TABLES = [
    ("quiz_results",       build_quiz_results),
    ("question_results",   build_question_results),
    ("achievements",       build_achievements),
    ("topic_performance",  build_topic_performance),
    ("practice_sessions",  build_practice_sessions),
    ("seen_tips",          build_seen_tips),
    ("lesson_history",     build_lesson_history),
    ("leitner_queue",      build_leitner_queue),
    ("seen_questions",     build_seen_questions),
    ("streaks",            build_streaks),
    ("prep_points",        build_prep_points),
    ("preferences",        build_preferences),
]


def main():
    OUT_DIR.mkdir(exist_ok=True)
    snap = parse_snapshot()
    work = load_export(RECOVERY / "prepstep-export-work-pc-2026-04-28.json")
    home = load_export(RECOVERY / "prepstep-export-home-pc-2026-04-28.json")
    ipad = load_export(RECOVERY / "prepstep-export-evies-ipad-2026-04-28.json")
    # Inject home into builder closures via a module-level global. Cleaner than
    # threading it through every builder signature when only quiz_results uses it.
    global _HOME_EXPORT
    _HOME_EXPORT = home

    ben_id, evie_id = CHILD["Ben"], CHILD["Evie"]

    sql = []
    sql.append(f"-- PrepStep recovery merge — generated {datetime.now().isoformat(timespec='seconds')}")
    sql.append(f"-- Children: Ben ({ben_id})  +  Evie ({evie_id})")
    sql.append("-- This file is idempotent for Ben+Evie: it deletes their existing rows then re-inserts the merged set.")
    sql.append("-- Other children's data is untouched.")
    sql.append("--")
    sql.append("-- Apply via:  wrangler d1 execute 11plus-user-data --remote --file=...")
    sql.append("-- D1 wraps the file as a single atomic transaction automatically — we do NOT")
    sql.append("-- emit explicit BEGIN/COMMIT (D1 rejects them).")
    sql.append("")

    summary_rows = []

    for table, builder in TABLES:
        cols, ben_rows, evie_rows = builder(ben_id, evie_id, snap, work, ipad)

        sql.append(f"-- ===== {table} =====")
        sql.append(f"DELETE FROM {table} WHERE child_id IN ('{ben_id}', '{evie_id}');")
        for r in ben_rows:
            sql.append(insert_stmt(table, cols, r))
        for r in evie_rows:
            sql.append(insert_stmt(table, cols, r))
        sql.append("")

        summary_rows.append((table, len(ben_rows), len(evie_rows)))

    sql.append("-- end of merge")
    sql.append("")

    OUT_SQL.write_text("\n".join(sql), encoding="utf-8")

    summary_lines = [
        f"Merge SQL: {OUT_SQL}",
        f"Generated: {datetime.now().isoformat(timespec='seconds')}",
        "",
        f"{'Table':<22}{'Ben':>8}{'Evie':>8}",
        "-" * 38,
    ]
    total_ben, total_evie = 0, 0
    for table, nb, ne in summary_rows:
        summary_lines.append(f"{table:<22}{nb:>8}{ne:>8}")
        total_ben += nb
        total_evie += ne
    summary_lines.append("-" * 38)
    summary_lines.append(f"{'TOTAL ROWS':<22}{total_ben:>8}{total_evie:>8}")
    summary = "\n".join(summary_lines)

    OUT_SUMMARY.write_text(summary, encoding="utf-8")
    print(summary)
    print()
    print(f"Wrote {OUT_SQL} ({OUT_SQL.stat().st_size:,} bytes, {sum(1 for _ in open(OUT_SQL, encoding='utf-8')):,} lines)")


if __name__ == "__main__":
    main()
