# Social Schema Design — Phase 0 Pre-work

**Status:** Design only — no UI, no endpoints, no React code
**Created:** 13 April 2026
**For:** Phase 3 (Social Layer)

## Purpose

Define the data model for social features now so GDPR CASCADE delete paths
are in place before economy and progression data is built on top. The
`social_preferences` table was created in migration 0002.

## Visibility Rules

### Visible between children (in study groups)
- PP total (effort, not ability)
- Weekly PP earned
- Avatar / character appearance
- Evolution tier (Novice/Apprentice/Journeyman/Master)
- Display name

### Private (never shared between children)
- Individual question scores and accuracy percentages
- Time spent per question or per session
- Question results (which questions were right/wrong)
- Topic performance data
- Leitner queue / spaced repetition state
- Practice session details

### Parent-only (visible to the parent account)
- All child data (full access)
- Social controls (approve/deny invites, toggle social on/off)
- Group membership approval state

## CASCADE Delete Paths

When an account is deleted (GDPR right-to-erasure):
```
DELETE accounts WHERE id = ?
  → CASCADE to children
    → CASCADE to all child data tables:
      - quiz_results, mock_test_results, question_results
      - lesson_history, practice_sessions, seen_questions
      - achievements, seen_tips
      - topic_performance, leitner_queue
      - streaks, prep_points, preferences
      - processed_operations
      - social_preferences ← created in Phase 0
      - (Phase 3) study_groups, group_members, weekly_leaderboard
      - (Phase 3) gifts, coop_challenges, coop_contributions
```

All existing tables already have `ON DELETE CASCADE` from `children(id)`.
The `social_preferences` table created in 0002 follows the same pattern.

## Phase 3 Tables (to be created when needed)

These are sketched here for reference. Actual migration SQL will be written
when Phase 3 begins.

```sql
-- Study groups
study_groups (
  id TEXT PK,
  name TEXT,
  created_by TEXT FK → accounts(id),
  invite_code TEXT UNIQUE,
  max_members INTEGER DEFAULT 10,
  created_at TEXT
)

-- Group membership
group_members (
  group_id TEXT FK → study_groups(id) ON DELETE CASCADE,
  child_id TEXT FK → children(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',  -- 'owner' | 'member'
  parent_approved_at TEXT,
  joined_at TEXT,
  PK(group_id, child_id)
)

-- Weekly leaderboard (reset Monday)
weekly_leaderboard (
  child_id TEXT FK → children(id) ON DELETE CASCADE,
  group_id TEXT FK → study_groups(id) ON DELETE CASCADE,
  week_start TEXT,  -- Monday date ISO
  pp_earned INTEGER DEFAULT 0,
  PK(child_id, group_id, week_start)
)

-- Preset gifts
gifts (
  id INTEGER PK AUTOINCREMENT,
  from_child TEXT FK → children(id) ON DELETE CASCADE,
  to_child TEXT FK → children(id) ON DELETE CASCADE,
  gift_type TEXT,  -- 'encouragement' | 'high-five' | 'star'
  created_at TEXT
)

-- Co-op challenges
coop_challenges (
  id TEXT PK,
  group_id TEXT FK → study_groups(id) ON DELETE CASCADE,
  description TEXT,
  target_questions INTEGER,
  current_progress INTEGER DEFAULT 0,
  reward_pp INTEGER,
  starts_at TEXT,
  ends_at TEXT,
  completed_at TEXT
)

-- Co-op contributions
coop_contributions (
  challenge_id TEXT FK → coop_challenges(id) ON DELETE CASCADE,
  child_id TEXT FK → children(id) ON DELETE CASCADE,
  questions_contributed INTEGER DEFAULT 0,
  PK(challenge_id, child_id)
)
```

## Compliance Notes (for Phase 3 implementation)

- DPIA must be completed before social features go live
- Privacy policy must be updated with child-friendly language
- All social features opt-in by default (UK Children's Code)
- No free-text communication between children (preset messages only)
- Right to deletion tested: verify CASCADE on all new tables
- Parental email confirmation required for group membership
