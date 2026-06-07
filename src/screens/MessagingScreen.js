import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, MessageCircle, ChevronRight } from 'lucide-react';
import MessageThread from '../components/MessageThread';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

async function apiFetch(path, getToken) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

async function openConversation(tutorId, childId, getToken) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/tutor/conversations/${childId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data.conversation;
}

// ── Conversation list row ──
function ConvRow({ conv, isTutor, onOpen }) {
  const name = isTutor ? conv.child_name : conv.tutor_name;
  const unread = conv.unread_count > 0;
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 w-full text-left hover:border-[#A29BFE] transition-colors"
    >
      <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
        {name?.[0] || '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm text-slate-800 truncate ${unread ? 'font-bold' : 'font-medium'}`}>{name}</p>
          {unread && <span className="w-2 h-2 rounded-full bg-[#7C3AED] flex-shrink-0" />}
        </div>
        {conv.last_message && (
          <p className="text-xs text-slate-400 truncate">{conv.last_message}</p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
    </button>
  );
}

// ── Tutor messaging — accessed from TutorDashboardScreen ──
export function TutorMessagingScreen({ getToken, onBack, initialChild }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConv, setOpenConv] = useState(null); // { id, childName, parentName }

  const load = useCallback(async () => {
    if (!getToken) { setLoading(false); return; }
    try {
      const data = await apiFetch('/api/tutor/conversations', getToken);
      setConversations(data.conversations || []);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  // When opened from a "Message" action, land directly in that child's thread.
  // openConversation is an upsert, so this works even before any messages
  // exist. Failure falls back to the inbox list silently.
  useEffect(() => {
    if (!initialChild?.id || !getToken) return;
    let cancelled = false;
    openConversation(null, initialChild.id, getToken)
      .then(conv => {
        if (!cancelled && conv) {
          setOpenConv({ id: conv.id, childName: initialChild.name, parentName: initialChild.parentName || '' });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
    // Run once on mount only — initialChild is fixed for this screen instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (openConv) {
    return (
      <div className="flex flex-col h-screen app-bg">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 print:hidden flex-shrink-0">
          <button onClick={() => { setOpenConv(null); load(); }} className="p-1 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 truncate">{openConv.childName}</p>
            {openConv.parentName ? (
              <p className="text-xs text-slate-400">via {openConv.parentName}</p>
            ) : null}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <MessageThread
            messagesPath={`/api/tutor/conversations/${openConv.id}/messages`}
            myRole="tutor"
            getToken={getToken}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg min-h-screen p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-bold text-xl text-slate-800">Messages</h1>
        </div>

        {loading && <p className="text-center text-slate-400 py-8">Loading…</p>}
        {!loading && conversations.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No conversations yet</p>
            <p className="text-sm mt-1">Open a pupil's detail view and click "Message" to start.</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {conversations.map(conv => (
            <ConvRow
              key={conv.id}
              conv={conv}
              isTutor={true}
              onOpen={() => setOpenConv({ id: conv.id, childName: conv.child_name, parentName: conv.parent_name })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Parent messaging — accessed from parent dashboard ──
export function ParentMessagingScreen({ activeChildId, getToken, onBack }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConv, setOpenConv] = useState(null);

  const load = useCallback(async () => {
    if (!activeChildId || !getToken) { setLoading(false); return; }
    try {
      const data = await apiFetch(`/api/parent/conversations?child_id=${activeChildId}`, getToken);
      setConversations(data.conversations || []);
    } finally {
      setLoading(false);
    }
  }, [activeChildId, getToken]);

  useEffect(() => { load(); }, [load]);

  if (openConv) {
    return (
      <div className="flex flex-col h-screen app-bg">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <button onClick={() => { setOpenConv(null); load(); }} className="p-1 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <p className="font-bold text-slate-800">{openConv.tutorName}</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <MessageThread
            messagesPath={`/api/parent/conversations/${openConv.id}/messages`}
            myRole="parent"
            getToken={getToken}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg min-h-screen p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-bold text-xl text-slate-800">Messages</h1>
        </div>
        {loading && <p className="text-center text-slate-400 py-8">Loading…</p>}
        {!loading && conversations.length === 0 && (
          <p className="text-center text-slate-400 py-8">No messages yet.</p>
        )}
        <div className="flex flex-col gap-2">
          {conversations.map(conv => (
            <ConvRow
              key={conv.id}
              conv={conv}
              isTutor={false}
              onOpen={() => setOpenConv({ id: conv.id, tutorName: conv.tutor_name })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
