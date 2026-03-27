import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Pencil } from 'lucide-react';

// Dev Review Panel — floating overlay for live feedback
// Notes are saved to a JSON file on disk via /api/dev-review
// so both the browser AND Claude can read/write the same notes.
// Reads current app context from window.__devReviewContext

async function fetchNotes() {
  try {
    const res = await fetch('/api/dev-review');
    return await res.json();
  } catch {
    return [];
  }
}

async function saveNotes(notes) {
  try {
    await fetch('/api/dev-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notes)
    });
  } catch (e) {
    console.warn('Dev Review save failed:', e.message);
  }
}

export default function DevReviewPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [justSaved, setJustSaved] = useState(false);
  const [context, setContext] = useState({ view: 'home' });

  const refreshNotes = useCallback(async () => {
    const stored = await fetchNotes();
    setNotes(stored);
  }, []);

  // Poll context every 500ms, notes every 2s
  useEffect(() => {
    const contextInterval = setInterval(() => {
      setContext(window.__devReviewContext || { view: 'home' });
    }, 500);
    const notesInterval = setInterval(refreshNotes, 2000);
    refreshNotes(); // initial load
    return () => {
      clearInterval(contextInterval);
      clearInterval(notesInterval);
    };
  }, [refreshNotes]);

  const contextLabel = [
    context.view,
    context.subject,
    context.topic,
    context.subConcept,
    context.screenType
  ].filter(Boolean).join(' \u203A ');

  const handleSubmit = async () => {
    if (!note.trim()) return;
    const newNote = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...context,
      note: note.trim(),
      status: 'pending'
    };
    const updated = [...notes, newNote];
    setNotes(updated);
    setNote('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
    await saveNotes(updated);
  };

  const handleClearFixed = async () => {
    const remaining = notes.filter(n => n.status === 'pending');
    setNotes(remaining);
    await saveNotes(remaining);
  };

  const handleDelete = async (id) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    await saveNotes(remaining);
  };

  const pendingCount = notes.filter(n => n.status === 'pending').length;
  const fixedCount = notes.filter(n => n.status === 'fixed').length;

  if (process.env.NODE_ENV !== 'development') return null;

  const panel = (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999 }}
        className="w-12 h-12 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center"
        title="Dev Review"
      >
        {pendingCount > 0 ? (
          <span className="text-sm font-bold">{pendingCount}</span>
        ) : (
          <Pencil className="w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', bottom: '80px', right: '16px', zIndex: 9999, width: '340px' }} className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-orange-500 text-white px-4 py-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">Dev Review</span>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
            </div>
            <div className="text-xs opacity-80 mt-0.5 truncate">
              {contextLabel || 'home'}
            </div>
          </div>

          {notes.length > 0 && (
            <div className="max-h-48 overflow-y-auto border-b border-gray-100">
              {[...notes].reverse().map(n => (
                <div key={n.id} className={`px-3 py-2 text-xs border-b border-gray-50 ${
                  n.status === 'fixed' ? 'bg-green-50' :
                  n.status === 'wontfix' ? 'bg-gray-50' : 'bg-orange-50'
                }`}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`font-bold uppercase tracking-wide text-[10px] ${
                      n.status === 'fixed' ? 'text-green-600' :
                      n.status === 'wontfix' ? 'text-gray-500' : 'text-orange-600'
                    }`}>{n.status}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-[10px]">
                        {[n.topic, n.screenType].filter(Boolean).join(' \u203A ')}
                      </span>
                      {n.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(n.id)}
                          className="text-gray-400 hover:text-red-500 text-[10px] font-bold leading-none"
                          title="Delete this note"
                        >&times;</button>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-700">{n.note}</div>
                  {n.response && (
                    <div className="text-blue-600 mt-1 italic">Claude: {n.response}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="p-3">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What needs fixing on this screen?"
              className="w-full p-2 border border-gray-200 rounded-lg text-sm resize-none focus:border-orange-400 focus:outline-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="flex justify-between items-center mt-2">
              {justSaved ? (
                <span className="text-green-600 text-xs font-medium">Saved!</span>
              ) : (
                <span className="text-gray-400 text-xs">Enter to send</span>
              )}
              <button
                onClick={handleSubmit}
                disabled={!note.trim()}
                className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg disabled:bg-gray-300 hover:bg-orange-600 transition-colors"
              >
                Send
              </button>
            </div>
          </div>

          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>
              {pendingCount} pending{fixedCount > 0 ? `, ${fixedCount} fixed` : ''}
            </span>
            {fixedCount > 0 && (
              <button onClick={handleClearFixed} className="text-orange-500 hover:text-orange-700 font-medium">
                Clear fixed
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );

  return ReactDOM.createPortal(panel, document.body);
}
