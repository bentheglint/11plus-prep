import React, { useState, useEffect } from 'react';
import { GraduationCap, MessageCircle, Trash2, X, ChevronRight } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

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

export default function TutorManagementCard({ activeChildId, getToken, onOpenMessages }) {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeChildId || !getToken) { setLoading(false); return; }
    apiFetch(`/api/parent/tutors?child_id=${activeChildId}`, getToken)
      .then(d => { setTutors(d.tutors || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeChildId, getToken]);

  const handleRemove = async (tutorId) => {
    setError(null);
    try {
      await apiFetch(`/api/parent/tutors/${tutorId}?child_id=${activeChildId}`, getToken, { method: 'DELETE' });
      setTutors(prev => prev.filter(t => t.id !== tutorId));
    } catch (err) {
      setError(err.message);
    }
    setRemovingId(null);
  };

  if (loading || tutors.length === 0) return null;

  return (
    <div className="mb-4 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <GraduationCap className="w-4 h-4 text-[#7C3AED]" />
        <h2 className="text-sm font-bold text-slate-700 flex-1">Linked Tutors</h2>
      </div>

      {error && (
        <div className="mx-4 mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {tutors.map(tutor => (
          <div key={tutor.id} className="flex items-center gap-3 px-4 py-3">
            {tutor.photo_url ? (
              <img src={tutor.photo_url} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                {tutor.display_name[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{tutor.display_name}</p>
              {tutor.bio && <p className="text-xs text-slate-400 truncate">{tutor.bio}</p>}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {onOpenMessages && (
                <button
                  onClick={() => onOpenMessages(tutor.id)}
                  className="p-2 text-slate-400 hover:text-[#7C3AED] transition-colors"
                  title="Message tutor"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setRemovingId(tutor.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove tutor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {removingId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setRemovingId(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading font-bold text-lg text-slate-800 mb-2">Remove this tutor?</h2>
            <p className="text-sm text-slate-500 mb-6">
              This will end their access to your child's data. Their private notes and messages will be deleted.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRemovingId(null)} className="flex-1 py-3 border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleRemove(removingId)} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
