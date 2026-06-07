import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, ChevronRight } from 'lucide-react';
import { topicLabel, subjectLabel } from '../utils/topicCatalogue';

function lastActiveLabel(daysInactive) {
  if (daysInactive === null) return 'Never practised';
  if (daysInactive === 0) return 'Active today';
  if (daysInactive === 1) return 'Yesterday';
  return `${daysInactive} days ago`;
}

function formatDueDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function accuracyColour(pct) {
  if (pct >= 70) return 'text-green-600';
  if (pct >= 50) return 'text-amber-600';
  return 'text-red-600';
}

// Row with a main tap target plus an optional inline action. The action is a
// SIBLING button, not a nested one — nested buttons are invalid HTML.
function PupilActionRow({ dot, title, meta, metaClass, onOpen, action }) {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center gap-3 flex-1 min-w-0 text-left group"
      >
        {dot && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-[#7C3AED] transition-colors">{title}</p>
          <p className={`text-xs mt-0.5 ${metaClass || 'text-slate-500'}`}>{meta}</p>
        </div>
      </button>
      {action}
      <button type="button" onClick={onOpen} aria-label={`Open ${title}`} className="flex-shrink-0">
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </button>
    </div>
  );
}

function MessageButton({ pupil, onMessageChild }) {
  return (
    <button
      type="button"
      onClick={() => onMessageChild({ id: pupil.id, name: pupil.display_name, parentName: pupil.parent_name })}
      className="flex items-center gap-1 text-xs font-medium text-[#7C3AED] hover:bg-[#F8F7FF] px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0"
      aria-label={`Message ${pupil.display_name}'s parent`}
    >
      <MessageCircle className="w-3.5 h-3.5" />
      Message
    </button>
  );
}

// ── Activity detail ──
function ActivityDetail({ roster, onOpenPupil, onMessageChild }) {
  // Same definition of "active" as the pulse: any activity in the last 7 days
  const active = roster.filter(p => p.days_inactive !== null && p.days_inactive <= 7);
  const inactive = roster.filter(p => p.days_inactive === null || p.days_inactive > 7);

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
          Not practised this week
        </p>
        {inactive.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className="text-sm text-green-600 font-medium">Everyone has practised this week ✓</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {inactive.map(pupil => (
              <PupilActionRow
                key={pupil.id}
                dot="bg-amber-400"
                title={pupil.display_name}
                meta={lastActiveLabel(pupil.days_inactive)}
                metaClass="text-amber-600 font-medium"
                onOpen={() => onOpenPupil(pupil)}
                action={<MessageButton pupil={pupil} onMessageChild={onMessageChild} />}
              />
            ))}
          </div>
        )}
      </div>

      {active.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Active this week
          </p>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {active.map(pupil => (
              <PupilActionRow
                key={pupil.id}
                dot={pupil.days_inactive === 0 ? 'bg-green-400' : 'bg-slate-200'}
                title={pupil.display_name}
                meta={`${lastActiveLabel(pupil.days_inactive)}${
                  pupil.quizzes_this_week > 0
                    ? ` · ${pupil.quizzes_this_week} ${pupil.quizzes_this_week === 1 ? 'quiz' : 'quizzes'} this week`
                    : ' · No quizzes'
                }`}
                onOpen={() => onOpenPupil(pupil)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Accuracy detail ──
function AccuracyDetail({ roster, onOpenPupil }) {
  const withQuizzes = roster
    .filter(p => p.accuracy_this_week !== null)
    .slice()
    .sort((a, b) => a.accuracy_this_week - b.accuracy_this_week);
  const noQuizzes = roster.filter(p => p.accuracy_this_week === null);

  return (
    <div>
      {withQuizzes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
          <p className="text-sm text-slate-500">No quizzes completed this week yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
          {withQuizzes.map(pupil => (
            <button
              key={pupil.id}
              type="button"
              onClick={() => onOpenPupil(pupil)}
              className="w-full flex items-center gap-3 p-4 text-left border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{pupil.display_name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {pupil.quizzes_this_week} {pupil.quizzes_this_week === 1 ? 'quiz' : 'quizzes'} this week
                </p>
              </div>
              <span className={`text-lg font-bold flex-shrink-0 ${accuracyColour(pupil.accuracy_this_week)}`}>
                {pupil.accuracy_this_week}%
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {noQuizzes.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
            No quizzes this week
          </p>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {noQuizzes.map(pupil => (
              <button
                key={pupil.id}
                type="button"
                onClick={() => onOpenPupil(pupil)}
                className="w-full flex items-center gap-3 p-4 text-left border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{pupil.display_name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{lastActiveLabel(pupil.days_inactive)}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-4 px-1 leading-relaxed">
        The headline figure is the average of each pupil's own accuracy, so a pupil with 1 quiz counts as much as one with 20.
      </p>
    </div>
  );
}

// ── Overdue detail ──
function OverdueDetail({ pulse, roster, onViewAssignmentDetail, onMessageChild }) {
  const overdue = pulse?.overdue || [];
  const rosterById = Object.fromEntries(roster.map(p => [p.id, p]));

  if (overdue.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
        <p className="text-sm text-green-600 font-medium">All up to date ✓</p>
        <p className="text-xs text-slate-400 mt-1">No overdue assignments at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {overdue.map((row, idx) => {
        const rosterPupil = rosterById[row.child_id];
        return (
          <div key={`${row.assignment_id}-${row.child_id}-${idx}`} className="flex items-center gap-3 p-4 border-b border-slate-100 last:border-b-0">
            <button
              type="button"
              onClick={() => onViewAssignmentDetail(row.assignment_id)}
              className="flex-1 min-w-0 text-left group"
            >
              <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-[#7C3AED] transition-colors">
                {row.assignment_title || 'Practice assignment'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{row.child_name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">Due {formatDueDate(row.due_date)}</span>
                {row.days_overdue !== null && (
                  <span className="text-xs font-medium text-red-600">
                    {row.days_overdue} {row.days_overdue === 1 ? 'day' : 'days'} overdue
                  </span>
                )}
              </div>
            </button>
            {rosterPupil && <MessageButton pupil={rosterPupil} onMessageChild={onMessageChild} />}
            <button
              type="button"
              onClick={() => onViewAssignmentDetail(row.assignment_id)}
              aria-label={`Open ${row.assignment_title || 'assignment'}`}
              className="flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Weak spot detail ──
function WeakspotDetail({ pulse, roster, onAssignTopic }) {
  const [expandedIdx, setExpandedIdx] = useState(0);
  const topics = pulse?.weak_topics || [];
  const rosterById = Object.fromEntries(roster.map(p => [p.id, p]));

  if (topics.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
        <p className="text-sm text-slate-500 leading-relaxed">
          Not enough data yet — needs at least 2 pupils with 2+ quizzes on the same topic.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {topics.map((topic, idx) => {
        const isExpanded = expandedIdx === idx;
        const label = topicLabel(topic.topic_key);

        return (
          <div key={topic.topic_key} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedIdx(isExpanded ? -1 : idx)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
              aria-expanded={isExpanded}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-800 text-sm">{label}</p>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex-shrink-0">
                    {subjectLabel(topic.subject)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {topic.pupil_count} {topic.pupil_count === 1 ? 'pupil' : 'pupils'}
                </p>
              </div>
              <span className={`text-lg font-bold flex-shrink-0 ${accuracyColour(topic.accuracy)}`}>
                {topic.accuracy}%
              </span>
              <ChevronRight className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>

            {isExpanded && (
              <div className="border-t border-slate-100">
                {(topic.pupils || []).map(p => {
                  const rosterPupil = rosterById[p.child_id];
                  return (
                    <div
                      key={p.child_id}
                      className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">
                          {rosterPupil?.display_name || 'Former pupil'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {p.quiz_count} {p.quiz_count === 1 ? 'quiz' : 'quizzes'}
                        </p>
                      </div>
                      <span className={`text-sm font-bold flex-shrink-0 ${accuracyColour(p.accuracy)}`}>
                        {p.accuracy}%
                      </span>
                    </div>
                  );
                })}

                <div className="p-3 bg-slate-50/60">
                  <button
                    type="button"
                    onClick={() => onAssignTopic({
                      subject: topic.subject,
                      topicKey: topic.topic_key,
                      title: `${label} practice`,
                    })}
                    className="w-full py-2 rounded-xl text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#5A4BD1] transition-colors"
                  >
                    Assign practice
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main export ──
export default function TutorPulseDetail({
  detailKey,
  pulse,
  roster,
  panelMode,
  onBack,
  onOpenPupil,
  onViewAssignmentDetail,
  onMessageChild,
  onAssignTopic,
}) {
  const config = {
    activity: {
      title: 'Active this week',
      subtitle: `${pulse?.active_this_week ?? 0} of ${pulse?.total_pupils ?? 0} pupils practised in the last 7 days`,
    },
    accuracy: {
      title: 'Avg accuracy per pupil',
      subtitle: "This week's quizzes",
    },
    overdue: {
      title: 'Overdue assignments',
      subtitle: pulse?.overdue?.length
        ? `${pulse.overdue.length} ${pulse.overdue.length === 1 ? 'assignment needs' : 'assignments need'} attention`
        : 'All up to date',
    },
    weakspot: {
      title: 'Group weak spots',
      subtitle: 'Lowest-accuracy topics across your group (last 30 days)',
    },
  }[detailKey] || { title: '', subtitle: '' };

  const wrapperClass = panelMode
    ? 'h-full flex flex-col bg-[#FAF9FF]'
    : 'app-bg min-h-screen flex flex-col';

  return (
    <div className={wrapperClass}>
      <div className={`flex items-start gap-3 px-4 py-4 bg-white border-b border-slate-100 flex-shrink-0 ${panelMode ? '' : 'pt-5'}`}>
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 mt-0.5"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <h1 className="font-heading font-bold text-slate-800 text-base leading-tight">{config.title}</h1>
          {config.subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{config.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {detailKey === 'activity' && (
          <ActivityDetail
            roster={roster || []}
            onOpenPupil={onOpenPupil}
            onMessageChild={onMessageChild}
          />
        )}
        {detailKey === 'accuracy' && (
          <AccuracyDetail roster={roster || []} onOpenPupil={onOpenPupil} />
        )}
        {detailKey === 'overdue' && (
          <OverdueDetail
            pulse={pulse}
            roster={roster || []}
            onViewAssignmentDetail={onViewAssignmentDetail}
            onMessageChild={onMessageChild}
          />
        )}
        {detailKey === 'weakspot' && (
          <WeakspotDetail
            pulse={pulse}
            roster={roster || []}
            onAssignTopic={onAssignTopic}
          />
        )}
      </div>
    </div>
  );
}
