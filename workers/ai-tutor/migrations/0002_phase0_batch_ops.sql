-- Phase 0: Batch operations support + social schema placeholder
-- Created: 13 April 2026
-- Additive migration — zero impact on running app

PRAGMA foreign_keys = ON;

-- ── BATCH OPERATION DEDUPLICATION ──

-- Tracks processed operation UUIDs for idempotent batch writes.
-- Each UUID is written atomically alongside its data in the same db.batch() call.
-- 7-day TTL enforced by lazy cleanup on each batch request.
CREATE TABLE processed_operations (
  operation_uuid TEXT PRIMARY KEY,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_processed_ops_child ON processed_operations(child_id, created_at);
CREATE INDEX idx_processed_ops_created ON processed_operations(created_at);

-- ── SOCIAL PREFERENCES (Phase 3 schema, created empty) ──

-- Created now so GDPR CASCADE delete paths are in place from the start.
-- No UI, no endpoints, no React code — just the empty table.
-- All social features opt-in by default (UK Children's Code).
CREATE TABLE social_preferences (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  social_enabled INTEGER NOT NULL DEFAULT 0,
  display_name_visible INTEGER NOT NULL DEFAULT 1,
  pp_visible INTEGER NOT NULL DEFAULT 1,
  avatar_visible INTEGER NOT NULL DEFAULT 1,
  tier_visible INTEGER NOT NULL DEFAULT 1,
  parent_approved_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
