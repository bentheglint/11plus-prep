import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

async function apiFetch(path, getToken, options = {}) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

function ChildRow({ child, isActive, isOnly, onEdit, onDelete, onSelect }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${isActive ? 'border-[#7C3AED] bg-[#F8F7FF]' : 'border-gray-200 bg-white'}`}>
      <button
        onClick={onSelect}
        className="flex-1 flex items-center gap-3 text-left"
      >
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: '#7C3AED' }}
        >
          {child.display_name[0]}
        </span>
        <div>
          <p className="font-bold text-slate-800">{child.display_name}</p>
          {isActive && <p className="text-xs text-[#7C3AED]">Active</p>}
        </div>
      </button>
      <button onClick={onEdit} className="p-2 text-slate-400 hover:text-[#7C3AED] transition-colors">
        <Edit2 className="w-4 h-4" />
      </button>
      {!isOnly && (
        <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function AddChildModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { setError('Please enter a name'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(name.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg text-slate-800">Add another child</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Child's name</label>
        <input
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-4"
          placeholder="e.g. Sam"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Adding…' : 'Add child'}
        </button>
      </div>
    </div>
  );
}

function EditChildModal({ child, onSave, onClose }) {
  const [name, setName] = useState(child.display_name);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { setError('Please enter a name'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(child.id, name.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg text-slate-800">Edit name</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Child's name</label>
        <input
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-4"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function ChildrenScreen({ childrenList, activeChildId, getToken, onBack, onSwitchChild, onChildrenUpdated }) {
  const [children, setChildren] = useState(childrenList);
  const [showAdd, setShowAdd] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const handleAdd = async (displayName) => {
    const data = await apiFetch('/api/children', getToken, {
      method: 'POST',
      body: JSON.stringify({ displayName }),
    });
    const updated = [...children, data.child];
    setChildren(updated);
    onChildrenUpdated(updated);
    onSwitchChild(data.child.id);
    setShowAdd(false);
  };

  const handleEdit = async (childId, displayName) => {
    const data = await apiFetch(`/api/children/${childId}`, getToken, {
      method: 'PATCH',
      body: JSON.stringify({ displayName }),
    });
    const updated = children.map(c => c.id === childId ? data.child : c);
    setChildren(updated);
    onChildrenUpdated(updated);
    setEditingChild(null);
  };

  const handleDelete = async (childId) => {
    setError(null);
    try {
      await apiFetch(`/api/children/${childId}`, getToken, { method: 'DELETE' });
      const updated = children.filter(c => c.id !== childId);
      setChildren(updated);
      onChildrenUpdated(updated);
      if (activeChildId === childId) {
        onSwitchChild(updated[0].id);
      }
    } catch (err) {
      setError(err.message);
    }
    setDeletingId(null);
  };

  return (
    <div className="app-bg min-h-screen p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-bold text-xl text-slate-800">Children</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6">
          {children.map(child => (
            <ChildRow
              key={child.id}
              child={child}
              isActive={child.id === activeChildId}
              isOnly={children.length === 1}
              onSelect={() => { onSwitchChild(child.id); onBack(); }}
              onEdit={() => setEditingChild(child)}
              onDelete={() => setDeletingId(child.id)}
            />
          ))}
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#A29BFE] text-[#7C3AED] font-bold rounded-xl hover:bg-[#F8F7FF] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add another child
        </button>

        {showAdd && <AddChildModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
        {editingChild && <EditChildModal child={editingChild} onSave={handleEdit} onClose={() => setEditingChild(null)} />}

        {deletingId && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setDeletingId(null)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
              <h2 className="font-heading font-bold text-lg text-slate-800 mb-2">Remove this child?</h2>
              <p className="text-sm text-slate-500 mb-6">All their progress and quiz history will be permanently deleted.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingId(null)} className="flex-1 py-3 border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deletingId)} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors">Remove</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
