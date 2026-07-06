// ── Assignment Routes ──
// POST   /api/tutor/assignments             — Create assignment + expand recipients
// GET    /api/tutor/assignments             — List with completion stats
// GET    /api/tutor/assignments/:id         — Detail with per-pupil recipient rows
// DELETE /api/tutor/assignments/:id         — Delete (cascades items + recipients)
// POST   /api/tutor/assignments/:id/clear-late/:childId — Tutor clears late flag
//
// Parent-facing:
// GET    /api/pupil/assignments             — Child's active assignment items (for homework card)
// POST   /api/pupil/assignments/:id/start   — Mark recipient in_progress
// POST   /api/pupil/assignments/:id/complete — Mark recipient completed + score

import { json } from '../helpers.js';
import { quizSubjectForTopic } from './batch.js';
import { loadEntitlement, pupilPlanMarker } from '../lib/entitlementGate.js';
import { resolveEntitlements } from '../lib/entitlements.js';

// Build the plain account row resolveEntitlements() expects from a joined
// query's flat columns. Shared by every batch-resolution site in this file
// (GET :id recipients, POST create eligibility) so the two never drift.
function acctRowFromJoin(row) {
  return {
    id: row.account_id,
    created_at: row.account_created_at,
    is_comped: row.is_comped,
    comp_source: row.comp_source,
    subscription_status: row.subscription_status,
    subscription_current_period_end: row.subscription_current_period_end,
  };
}

// ── Tutor assignment routes ──────────────────────────────────────────────────

async function requireTutor(db, userId) {
  const t = await db.prepare('SELECT id FROM tutors WHERE id = ?').bind(userId).first();
  return t ? t.id : null;
}

async function expandRecipients(db, assignment, items, childIds) {
  // childIds is the ELIGIBLE set, already resolved (and entitlement-filtered)
  // by the caller before any row was written — see the POST handler below.
  if (!childIds || childIds.length === 0) return 0;

  // Insert one recipient row per (child × item)
  const stmts = [];
  const assignedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  for (const childId of childIds) {
    for (const item of items) {
      const id = crypto.randomUUID();
      stmts.push(
        db.prepare(
          `INSERT OR IGNORE INTO assignment_recipients
           (id, assignment_id, assignment_item_id, child_id, tutor_id, assigned_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(id, assignment.id, item.id, childId, assignment.tutor_id, assignedAt)
      );
    }
  }

  if (stmts.length > 0) await db.batch(stmts);
  return childIds.length;
}

export async function handleAssignmentRoutes(request, env, userId, path) {
  const db = env.DB;

  // ── Tutor-facing routes ──────────────────────────────────────────────────

  if (path.startsWith('/api/tutor/assignments')) {
    const tutorId = await requireTutor(db, userId);
    if (!tutorId) return json({ error: 'No tutor profile found' }, 403);

    // POST /api/tutor/assignments — create + expand
    if (path === '/api/tutor/assignments' && request.method === 'POST') {
      const { title, dueDate, targetClassId, targetChildId, items } = await request.json();

      if (!dueDate) return json({ error: 'Missing dueDate' }, 400);
      if (!targetClassId && !targetChildId) return json({ error: 'Must specify targetClassId or targetChildId' }, 400);
      if (targetClassId && targetChildId) return json({ error: 'Specify only one target' }, 400);
      if (!Array.isArray(items) || items.length === 0) return json({ error: 'items must be a non-empty array' }, 400);

      for (const item of items) {
        if (!item.itemType || !item.itemRef) return json({ error: 'Each item requires itemType and itemRef' }, 400);
        if (!['topic', 'custom_quiz', 'mock', 'lesson'].includes(item.itemType)) {
          return json({ error: `Invalid itemType: ${item.itemType}` }, 400);
        }
      }

      // Verify target ownership
      if (targetClassId) {
        const cls = await db.prepare('SELECT id FROM classes WHERE id = ? AND tutor_id = ?').bind(targetClassId, tutorId).first();
        if (!cls) return json({ error: 'Class not found or not owned by this tutor' }, 404);
      }
      if (targetChildId) {
        const link = await db.prepare('SELECT 1 FROM pupil_tutors WHERE child_id = ? AND tutor_id = ?').bind(targetChildId, tutorId).first();
        if (!link) return json({ error: 'Child not on roster' }, 404);
      }

      // Resolve the recipient set — WITH each pupil's billing columns, in ONE
      // query — BEFORE writing anything. Focused Learning homework is a
      // paid-tier feature (§11-C-8/9): a free pupil must never be assigned
      // it, and we must never create an orphan assignment with zero
      // recipients if every candidate turns out to be free. Batch (pure)
      // resolution — no per-pupil DB read (avoids N+1 for a class target).
      let recipientRows;
      if (targetClassId) {
        const { results } = await db.prepare(`
          SELECT c.id AS child_id, c.display_name AS child_name,
                 acc.id AS account_id, acc.created_at AS account_created_at,
                 acc.is_comped, acc.comp_source, acc.subscription_status,
                 acc.subscription_current_period_end
          FROM class_enrolments ce
          JOIN children c ON c.id = ce.child_id
          JOIN accounts acc ON acc.id = c.account_id
          WHERE ce.class_id = ?
        `).bind(targetClassId).all();
        recipientRows = results;
      } else {
        const row = await db.prepare(`
          SELECT c.id AS child_id, c.display_name AS child_name,
                 acc.id AS account_id, acc.created_at AS account_created_at,
                 acc.is_comped, acc.comp_source, acc.subscription_status,
                 acc.subscription_current_period_end
          FROM children c
          JOIN accounts acc ON acc.id = c.account_id
          WHERE c.id = ?
        `).bind(targetChildId).first();
        recipientRows = row ? [row] : [];
      }

      // No candidates at all (e.g. an empty class) is a distinct case from
      // "everyone's on the free plan" — don't mislabel it as the latter.
      if (recipientRows.length === 0) {
        return json({ error: 'No pupils to assign to', code: 'empty_target' }, 422);
      }

      const entitlementNow = new Date();
      const eligibleChildIds = [];
      const skipped = [];
      for (const row of recipientRows) {
        const marker = pupilPlanMarker(resolveEntitlements(acctRowFromJoin(row), { now: entitlementNow }));
        if (marker.focusedLearningLocked) {
          skipped.push({ childId: row.child_id, childName: row.child_name, pupilPlan: marker.pupilPlan });
        } else {
          eligibleChildIds.push(row.child_id);
        }
      }

      if (eligibleChildIds.length === 0) {
        return json({
          error: 'All selected pupils are on the free plan',
          code: 'no_eligible_recipients',
          skipped,
        }, 422);
      }

      const assignmentId = crypto.randomUUID();
      const createdAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

      await db.prepare(
        `INSERT INTO assignments (id, tutor_id, target_class_id, target_child_id, title, due_date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(assignmentId, tutorId, targetClassId || null, targetChildId || null, title?.trim() || null, dueDate, createdAt).run();

      // Insert items
      const itemRows = items.map(item => ({ id: crypto.randomUUID(), assignment_id: assignmentId, ...item }));
      const itemStmts = itemRows.map(item =>
        db.prepare('INSERT INTO assignment_items (id, assignment_id, item_type, item_ref, subject) VALUES (?, ?, ?, ?, ?)')
          // Derive a missing subject for topic items — a NULL subject hid the
          // assignment from the child's homepage banner (legacy bug, 11 Jun 2026).
          .bind(item.id, assignmentId, item.itemType, item.itemRef,
            item.subject || (item.itemType === 'topic' ? quizSubjectForTopic(item.itemRef) : null))
      );
      await db.batch(itemStmts);

      // Recipients ONLY for the eligible (non-free) pupils — a skipped free
      // pupil gets no assignment_recipients row at all, so no locked
      // homework can ever dangle in front of them.
      const assignment = { id: assignmentId, tutor_id: tutorId, target_class_id: targetClassId || null, target_child_id: targetChildId || null };
      const recipientCount = await expandRecipients(db, assignment, itemRows, eligibleChildIds);

      const result = await db.prepare('SELECT * FROM assignments WHERE id = ?').bind(assignmentId).first();
      return json({ ok: true, assignment: result, recipientCount, skipped }, 201);
    }

    // GET /api/tutor/assignments — list with stats
    if (path === '/api/tutor/assignments' && request.method === 'GET') {
      const { results: assignments } = await db.prepare(`
        SELECT a.*,
               COUNT(DISTINCT ai.id) AS item_count,
               COUNT(DISTINCT CASE WHEN ar.status = 'completed' THEN ar.id END) AS completed_count,
               COUNT(DISTINCT ar.id) AS total_recipients
        FROM assignments a
        LEFT JOIN assignment_items ai ON ai.assignment_id = a.id
        LEFT JOIN assignment_recipients ar ON ar.assignment_id = a.id
        WHERE a.tutor_id = ?
        GROUP BY a.id
        ORDER BY a.due_date DESC
      `).bind(tutorId).all();

      return json({ assignments });
    }

    const assignMatch = path.match(/^\/api\/tutor\/assignments\/([^/]+)$/);
    const clearLateMatch = path.match(/^\/api\/tutor\/assignments\/([^/]+)\/clear-late\/([^/]+)$/);

    if (clearLateMatch) {
      const [, assignmentId, childId] = clearLateMatch;
      if (request.method !== 'POST') return null;

      // Verify ownership
      const a = await db.prepare('SELECT id FROM assignments WHERE id = ? AND tutor_id = ?').bind(assignmentId, tutorId).first();
      if (!a) return json({ error: 'Assignment not found' }, 404);

      const result = await db.prepare(`
        UPDATE assignment_recipients
        SET status = 'cleared', cleared_at = datetime('now')
        WHERE assignment_id = ? AND child_id = ? AND status = 'late'
      `).bind(assignmentId, childId).run();

      return json({ ok: true, cleared: result.meta.changes });
    }

    if (assignMatch) {
      const assignmentId = assignMatch[1];
      const a = await db.prepare('SELECT * FROM assignments WHERE id = ? AND tutor_id = ?').bind(assignmentId, tutorId).first();
      if (!a) return json({ error: 'Assignment not found' }, 404);

      // GET — detail with per-pupil recipient rows
      if (request.method === 'GET') {
        const { results: items } = await db.prepare(
          'SELECT * FROM assignment_items WHERE assignment_id = ? ORDER BY created_at ASC'
        ).bind(assignmentId).all();

        // ar.* includes question_results — the deep per-question blob —
        // for EVERY recipient. A free pupil's deep data must never leak to
        // their tutor (N3), so pull each recipient's billing columns in the
        // SAME query (no N+1) and strip both the blob and the billing
        // columns themselves before the row leaves this route.
        const { results: recipients } = await db.prepare(`
          SELECT ar.*, c.display_name AS child_name,
                 acc.id AS account_id, acc.created_at AS account_created_at,
                 acc.is_comped, acc.comp_source, acc.subscription_status,
                 acc.subscription_current_period_end
          FROM assignment_recipients ar
          JOIN children c ON c.id = ar.child_id
          JOIN accounts acc ON acc.id = c.account_id
          WHERE ar.assignment_id = ?
          ORDER BY c.display_name ASC
        `).bind(assignmentId).all();

        const entitlementNow = new Date();
        const mappedRecipients = recipients.map(r => {
          const marker = pupilPlanMarker(resolveEntitlements(acctRowFromJoin(r), { now: entitlementNow }));
          const {
            account_id, account_created_at, is_comped, comp_source,
            subscription_status, subscription_current_period_end,
            question_results, ...basic
          } = r;
          return {
            ...basic,
            ...(marker.deepProgressLocked ? {} : { question_results }),
            pupilPlan: marker.pupilPlan,
            deepProgressLocked: marker.deepProgressLocked,
          };
        });

        return json({ assignment: a, items, recipients: mappedRecipients });
      }

      // DELETE
      if (request.method === 'DELETE') {
        await db.prepare('DELETE FROM assignments WHERE id = ?').bind(assignmentId).run();
        return json({ ok: true });
      }
    }
  }

  // ── Parent-facing routes ─────────────────────────────────────────────────

  if (path.startsWith('/api/pupil/assignments')) {
    // GET /api/pupil/assignments?child_id=xxx — child's assignments
    if (path === '/api/pupil/assignments' && request.method === 'GET') {
      const url = new URL(request.url);
      const childId = url.searchParams.get('child_id');
      if (!childId) return json({ error: 'Missing child_id' }, 400);

      // Verify this parent owns the child
      const child = await db.prepare('SELECT id FROM children WHERE id = ? AND account_id = ?').bind(childId, userId).first();
      if (!child) return json({ error: 'Child not found' }, 404);

      const { results: recipients } = await db.prepare(`
        SELECT ar.*,
               ai.item_type, ai.item_ref, ai.subject,
               a.title AS assignment_title, a.due_date,
               t.display_name AS tutor_name
        FROM assignment_recipients ar
        JOIN assignment_items ai ON ai.id = ar.assignment_item_id
        JOIN assignments a ON a.id = ar.assignment_id
        JOIN tutors t ON t.id = ar.tutor_id
        WHERE ar.child_id = ?
          AND ar.status NOT IN ('cancelled')
        ORDER BY a.due_date ASC, ai.created_at ASC
      `).bind(childId).all();

      // A free pupil cannot do Focused Learning homework, so their list must
      // never dangle a locked item in front of them (child-first — never
      // show, never let them tap through to a refusal). Resolve the
      // CALLER's (parent's) own entitlement once — no per-item DB read —
      // and hide the whole list rather than flagging individual items:
      // every entitlement is false on the free plan, so blocking on the
      // free-plan marker is correct for topic/mock/lesson/custom_quiz alike.
      const entitlement = await loadEntitlement(db, userId);
      const marker = pupilPlanMarker(entitlement);
      const visibleRecipients = marker.focusedLearningLocked ? [] : recipients;

      return json({ recipients: visibleRecipients });
    }

    const recipientMatch = path.match(/^\/api\/pupil\/assignments\/([^/]+)\/(start|complete)$/);
    if (recipientMatch) {
      const [, recipientId, action] = recipientMatch;
      if (request.method !== 'POST') return null;

      // Fetch recipient and verify child belongs to this parent
      const rec = await db.prepare(`
        SELECT ar.*, c.account_id
        FROM assignment_recipients ar
        JOIN children c ON c.id = ar.child_id
        WHERE ar.id = ?
      `).bind(recipientId).first();

      if (!rec) return json({ error: 'Assignment item not found' }, 404);
      if (rec.account_id !== userId) return json({ error: 'Forbidden' }, 403);

      // Defense-in-depth: a pupil who was eligible when this was assigned
      // may have since dropped to the free plan. Refuse to record progress
      // on Focused homework rather than trusting the assignment's mere
      // existence as proof of current entitlement.
      const entitlement = await loadEntitlement(db, userId);
      const marker = pupilPlanMarker(entitlement);
      if (marker.focusedLearningLocked) {
        return json({ error: 'Upgrade required', code: 'upgrade_required', upgradeRequired: true }, 403);
      }

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      if (action === 'start') {
        await db.prepare(`
          UPDATE assignment_recipients
          SET status = 'in_progress', started_at = ?
          WHERE id = ? AND status = 'assigned'
        `).bind(now, recipientId).run();
      }

      if (action === 'complete') {
        const { score, questionResults } = await request.json().catch(() => ({}));
        await db.prepare(`
          UPDATE assignment_recipients
          SET status = 'completed', completed_at = ?, score = ?, question_results = ?
          WHERE id = ? AND status IN ('assigned', 'in_progress', 'late')
        `).bind(now, score ?? null, questionResults ? JSON.stringify(questionResults) : null, recipientId).run();
      }

      const updated = await db.prepare('SELECT * FROM assignment_recipients WHERE id = ?').bind(recipientId).first();
      return json({ ok: true, recipient: updated });
    }
  }

  return null;
}

// ── Late-flag scheduled job ──────────────────────────────────────────────────
// Called from the existing scheduled handler in email.js.
// Flips 'assigned' and 'in_progress' recipients to 'late' when due_date has passed.

export async function runLateFlagJob(db) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const result = await db.prepare(`
    UPDATE assignment_recipients
    SET status = 'late'
    WHERE status IN ('assigned', 'in_progress')
      AND assignment_id IN (
        SELECT id FROM assignments WHERE due_date < ?
      )
  `).bind(now).run();

  console.log(`[late-flag job] Flagged ${result.meta.changes} recipient(s) as late`);
  return result.meta.changes;
}
