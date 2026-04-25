import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Loader } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;
const POLL_INTERVAL = 30_000; // 30 seconds

async function apiFetch(path, getToken, options = {}) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

function normaliseDate(d) {
  if (!d) return null;
  return d.includes('T') ? d : d.replace(' ', 'T') + 'Z';
}

// ── Single message bubble ──
function Bubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
          isMine
            ? 'bg-[#7C3AED] text-white rounded-br-sm'
            : 'bg-white border border-gray-200 text-slate-800 rounded-bl-sm shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.body}</p>
        <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-slate-400'}`}>
          {new Date(normaliseDate(message.created_at)).toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit',
          })}
          {message.read_at && isMine && <span className="ml-1">·  read</span>}
        </p>
      </div>
    </div>
  );
}

// ── Date divider ──
function DateDivider({ date }) {
  return (
    <div className="flex items-center gap-2 my-3">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-slate-400 whitespace-nowrap">
        {new Date(normaliseDate(date)).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ── Main component ──
// messagesPath: GET/POST path for messages
// myRole: 'tutor' | 'parent' — determines which bubbles are "mine"
export default function MessageThread({ messagesPath, myRole, getToken, label }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await apiFetch(messagesPath, getToken);
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [messagesPath, getToken]);

  // Initial load + poll
  useEffect(() => {
    loadMessages();
    pollRef.current = setInterval(loadMessages, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [loadMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!draft.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const data = await apiFetch(messagesPath, getToken, {
        method: 'POST',
        body: JSON.stringify({ body: draft.trim() }),
      });
      setMessages(prev => [...prev, data.message]);
      setDraft('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date for dividers
  let lastDate = null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {label && (
        <div className="px-4 py-2 border-b border-gray-100 text-sm font-bold text-slate-700 bg-white">
          {label}
        </div>
      )}

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-[#F8F7FF]">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-5 h-5 text-[#7C3AED] animate-spin" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-center text-sm text-slate-400 mt-8">
            No messages yet. Send the first one.
          </p>
        )}
        {messages.map((msg, i) => {
          const msgDate = normaliseDate(msg.created_at)?.slice(0, 10);
          const showDivider = msgDate && msgDate !== lastDate;
          lastDate = msgDate;
          return (
            <div key={msg.id || i}>
              {showDivider && <DateDivider date={msg.created_at} />}
              <Bubble message={msg} isMine={msg.sender_type === myRole} />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="px-4 py-1 text-xs text-red-500 bg-red-50 border-t border-red-100">{error}</p>
      )}

      {/* Compose bar */}
      <div className="flex items-end gap-2 px-3 py-2.5 bg-white border-t border-gray-200">
        <textarea
          className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] max-h-24"
          rows={1}
          placeholder="Write a message…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:opacity-50 transition-colors flex-shrink-0"
        >
          {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
