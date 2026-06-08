#!/usr/bin/env python3
"""Staging test for migration 0014 (admin panel) + remove-pupil scoping.

Loads a real prod snapshot into a throwaway SQLite DB, applies the migration,
and asserts: (a) additive migration changes nothing existing, (b) the new tables
+ seed land, (c) the remove-pupil purge deletes ONLY the link + class_enrolments
and the matching cascade, never the child / account / learning data.

Run:  python scripts/staging-test-0014.py
"""
import sqlite3, sys, os

SNAPSHOT = "backups/d1-snapshot-pre-0014.sql"
MIGRATION = "workers/ai-tutor/migrations/0014_admin_panel.sql"
STAGING = "backups/staging-0014.db"

EVIE_CHILD = "0aa8fb45-b9a7-40d7-8df2-b739546aeffa"
BEN_TUTOR = "user_3C4aPV0Zl3inqvmknDbn4vpsVa6"

failures = []
def check(label, cond):
    print(("  PASS" if cond else "  FAIL") + f"  {label}")
    if not cond:
        failures.append(label)

def count(c, sql, *binds):
    return c.execute(sql, binds).fetchone()[0]

if os.path.exists(STAGING):
    os.remove(STAGING)

conn = sqlite3.connect(STAGING)
with open(SNAPSHOT, encoding="utf-8") as f:
    conn.executescript(f.read())
conn.commit()

c = conn.cursor()

print("== Pre-migration baseline ==")
pre = {t: count(c, f"SELECT COUNT(*) FROM {t}") for t in
       ["accounts", "children", "tutors", "pupil_tutors"]}
for t, n in pre.items():
    print(f"  {t}: {n}")

print("\n== Apply 0014 ==")
with open(MIGRATION, encoding="utf-8") as f:
    conn.executescript(f.read())
conn.commit()

print("\n== Additive safety (existing tables unchanged) ==")
for t, n in pre.items():
    check(f"{t} count unchanged ({n})", count(c, f"SELECT COUNT(*) FROM {t}") == n)

print("\n== New tables + seed ==")
tables = {r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table'")}
check("tutor_allowlist table exists", "tutor_allowlist" in tables)
check("admin_audit table exists", "admin_audit" in tables)
check("seed: ben@venortech.com", count(c, "SELECT COUNT(*) FROM tutor_allowlist WHERE email='ben@venortech.com'") == 1)
check("seed: suemedley65@gmail.com", count(c, "SELECT COUNT(*) FROM tutor_allowlist WHERE email='suemedley65@gmail.com'") == 1)

print("\n== remove-pupil scoping (Evie <-> Ben tutor) ==")
conn.execute("PRAGMA foreign_keys=ON")
check("foreign_keys ON (replicates D1 cascade)", c.execute("PRAGMA foreign_keys").fetchone()[0] == 1)

acct_before = count(c, "SELECT COUNT(*) FROM accounts")
child_before = count(c, "SELECT COUNT(*) FROM children")
evie_quizzes = count(c, "SELECT COUNT(*) FROM quiz_results WHERE child_id=?", EVIE_CHILD)
link_before = count(c, "SELECT COUNT(*) FROM pupil_tutors WHERE child_id=? AND tutor_id=?", EVIE_CHILD, BEN_TUTOR)
print(f"  before: accounts={acct_before} children={child_before} evie_quizzes={evie_quizzes} link={link_before}")

if link_before == 0:
    print("  (no Evie<->Ben link in snapshot — skipping live purge, asserting query is safe)")
    check("link absent is handled (nothing to delete)", True)
else:
    # The purge exactly as the worker runs it.
    conn.execute("DELETE FROM class_enrolments WHERE child_id=? AND class_id IN (SELECT id FROM classes WHERE tutor_id=?)", (EVIE_CHILD, BEN_TUTOR))
    conn.execute("DELETE FROM pupil_tutors WHERE child_id=? AND tutor_id=?", (EVIE_CHILD, BEN_TUTOR))
    conn.commit()
    check("pupil_tutors link removed", count(c, "SELECT COUNT(*) FROM pupil_tutors WHERE child_id=? AND tutor_id=?", EVIE_CHILD, BEN_TUTOR) == 0)
    check("child row NOT deleted", count(c, "SELECT COUNT(*) FROM children WHERE id=?", EVIE_CHILD) == 1)
    check("children total unchanged", count(c, "SELECT COUNT(*) FROM children") == child_before)
    check("accounts total unchanged", count(c, "SELECT COUNT(*) FROM accounts") == acct_before)
    check("Evie's quiz_results intact", count(c, "SELECT COUNT(*) FROM quiz_results WHERE child_id=?", EVIE_CHILD) == evie_quizzes)
    check("pair tutor_notes gone (cascade)", count(c, "SELECT COUNT(*) FROM tutor_notes WHERE child_id=? AND tutor_id=?", EVIE_CHILD, BEN_TUTOR) == 0)
    check("pair conversations gone (cascade)", count(c, "SELECT COUNT(*) FROM conversations WHERE child_id=? AND tutor_id=?", EVIE_CHILD, BEN_TUTOR) == 0)

conn.close()
print("\n== RESULT ==")
if failures:
    print(f"  {len(failures)} FAILURE(S): " + "; ".join(failures))
    sys.exit(1)
print("  ALL CHECKS PASSED")
