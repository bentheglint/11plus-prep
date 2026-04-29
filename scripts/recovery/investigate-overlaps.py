#!/usr/bin/env python3
"""Investigate the suspicious zero-overlap on question_results."""

import json, re
from pathlib import Path
from collections import Counter

BASE = Path(r"C:\Users\Ben Jackson")
RECOVERY = BASE / "Documents" / "My Brain" / "Recovery"
SNAPSHOT = BASE / "Projects" / "11plus-prep" / "backups" / "d1-snapshot-2026-04-27-pre-freeze.sql"
BEN, EVIE = "b495e022-dffe-44eb-a3b2-36b419003311", "0aa8fb45-b9a7-40d7-8df2-b739546aeffa"

def load_export(p): return json.loads(Path(p).read_text(encoding="utf-8"))["localStorage"]
def cache_rows(ls, name, key):
    raw = ls.get(f"d1-cache:{name}")
    return json.loads(raw).get(key, []) if raw else []
def legacy(ls, name, key):
    raw = ls.get(f"user:{name}:{key}")
    return json.loads(raw) if raw else None

def parse_value(s):
    s = s.strip()
    if s == "NULL": return None
    if s.startswith("'") and s.endswith("'"): return s[1:-1].replace("''", "'")
    try: return int(s)
    except:
        try: return float(s)
        except: return s

def tokenize(v):
    toks, cur, in_str, i = [], "", False, 0
    while i < len(v):
        ch = v[i]
        if in_str:
            cur += ch
            if ch == "'":
                if i+1 < len(v) and v[i+1] == "'": cur += "'"; i += 2; continue
                in_str = False
        else:
            if ch == "'": in_str = True; cur += ch
            elif ch == ",": toks.append(cur); cur = ""
            else: cur += ch
        i += 1
    toks.append(cur)
    return toks

def parse_snapshot_table(table):
    text = SNAPSHOT.read_text(encoding="utf-8", errors="replace")
    rows = []
    rx = re.compile(r'^INSERT INTO "([^"]+)"\s*\(([^)]+)\)\s*VALUES\((.*)\);\s*$')
    for line in text.splitlines():
        m = rx.match(line)
        if not m or m.group(1) != table: continue
        cols = [c.strip().strip('"') for c in m.group(2).split(",")]
        toks = tokenize(m.group(3))
        if len(toks) == len(cols):
            rows.append({cols[i]: parse_value(toks[i]) for i in range(len(cols))})
    return rows

home = load_export(RECOVERY / "prepstep-export-home-pc-2026-04-28.json")
work = load_export(RECOVERY / "prepstep-export-work-pc-2026-04-28.json")
ipad = load_export(RECOVERY / "prepstep-export-evies-ipad-2026-04-28.json")

snap_qr = parse_snapshot_table("question_results")
snap_qr_ben = [r for r in snap_qr if r["child_id"] == BEN]
snap_qr_evie = [r for r in snap_qr if r["child_id"] == EVIE]
snap_qr_count_ben = len(snap_qr_ben)
snap_qr_count_evie = len(snap_qr_evie)

print(f"=== Snapshot question_results: Ben={snap_qr_count_ben}, Evie={snap_qr_count_evie}")
print()

# Distinct attempted_at values in snapshot vs work PC
print("=== Snapshot question_results attempted_at values for Ben (top 5 most common) ===")
ts_ben = Counter(r["attempted_at"] for r in snap_qr_ben)
for ts, n in ts_ben.most_common(5):
    print(f"  {n:>4}× {ts}")
print()

work_qr = cache_rows(work, "Ben", "questionResults")
print(f"=== Work PC question_results for Ben: {len(work_qr)} rows ===")
ts_work = Counter(r["attempted_at"] for r in work_qr)
print("Top 5 attempted_at values:")
for ts, n in ts_work.most_common(5):
    print(f"  {n:>4}× {ts}")

# Compare without timestamps
def key_no_ts(r):
    return (r["question_id"], r.get("topic_key"), r.get("subject"))

snap_keys = Counter(key_no_ts(r) for r in snap_qr_ben)
work_keys = Counter(key_no_ts(r) for r in work_qr)

snap_set = set(snap_keys.keys())
work_set = set(work_keys.keys())
print(f"\n=== Ben question_results matched by (question_id, topic_key, subject) ignoring timestamps ===")
print(f"  distinct keys in snapshot:  {len(snap_set)}")
print(f"  distinct keys in work PC:   {len(work_set)}")
print(f"  in both:                    {len(snap_set & work_set)}")
print(f"  only in snapshot:           {len(snap_set - work_set)}")
print(f"  only in work PC:            {len(work_set - snap_set)}")

# Total attempts (sum of counts)
total_snap_attempts = sum(snap_keys.values())
total_work_attempts = sum(work_keys.values())
print(f"\n  total attempts in snapshot: {total_snap_attempts}")
print(f"  total attempts in work PC:  {total_work_attempts}")

# For overlapping keys, who has more attempts?
overlap = snap_set & work_set
work_more = sum(1 for k in overlap if work_keys[k] > snap_keys[k])
snap_more = sum(1 for k in overlap if snap_keys[k] > work_keys[k])
equal = sum(1 for k in overlap if snap_keys[k] == work_keys[k])
print(f"\n  for overlapping keys: work PC has more attempts on {work_more}, snapshot more on {snap_more}, equal on {equal}")

# Sample mismatches
samples = [k for k in overlap if work_keys[k] != snap_keys[k]][:5]
print(f"  example mismatches:")
for k in samples:
    print(f"    {k}: snap={snap_keys[k]}, work={work_keys[k]}")

# === Same analysis for Evie iPad cache vs legacy ===
print("\n" + "=" * 70)
print("EVIE: iPad cache  vs  iPad legacy question_results")
print("=" * 70)

cache_qr = cache_rows(ipad, "Evie", "questionResults")
legacy_qr = legacy(ipad, "Evie", "question-results") or []
print(f"  iPad cache rows:  {len(cache_qr)}")
print(f"  iPad legacy rows: {len(legacy_qr)}")

cache_ts_evie = Counter(r["attempted_at"] for r in cache_qr)
print("\nCache top 3 attempted_at values:")
for ts, n in cache_ts_evie.most_common(3):
    print(f"  {n:>4}× {ts}")

legacy_ts_evie = Counter(r.get("date") for r in legacy_qr)
print("\nLegacy top 3 'date' values:")
for ts, n in legacy_ts_evie.most_common(3):
    print(f"  {n:>4}× {ts}")

cache_keys = Counter((r["question_id"], r.get("topic_key"), r.get("subject")) for r in cache_qr)
legacy_keys = Counter((r["questionId"], r.get("topicKey"), r.get("subject")) for r in legacy_qr)
cache_set = set(cache_keys.keys())
legacy_set = set(legacy_keys.keys())
print(f"\nMatched by (question_id, topic_key, subject):")
print(f"  distinct keys in cache:  {len(cache_set)}")
print(f"  distinct keys in legacy: {len(legacy_set)}")
print(f"  in both:                 {len(cache_set & legacy_set)}")
print(f"  only cache:              {len(cache_set - legacy_set)}")
print(f"  only legacy:             {len(legacy_set - cache_set)}")

total_cache = sum(cache_keys.values())
total_legacy = sum(legacy_keys.values())
print(f"\n  total attempts in cache:  {total_cache}")
print(f"  total attempts in legacy: {total_legacy}")
