import React, { useState } from 'react';
import { useClerk, useAuth, useUser } from '@clerk/clerk-react';
import { LogOut, Download, Trash2, X, User, ChevronDown } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

function AccountMenu({ currentUser }) {
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const parentEmail = user?.primaryEmailAddress?.emailAddress || '';

  // Export data as JSON download
  const handleExport = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/data/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '11plus-data-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed. Please try again.');
    }
    setShowMenu(false);
  };

  // Delete account and all data — fail-closed: only clear local data if server confirms deletion
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server returned ${res.status}`);
      }

      // Server confirmed deletion — now safe to clear local data
      const prefix = `user:${currentUser}:`;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) localStorage.removeItem(key);
      });
      localStorage.removeItem('current-user');
      // Sign out of Clerk
      await signOut();
    } catch (err) {
      alert(`Delete failed: ${err.message}. Your account has not been deleted. Please try again.`);
      setIsDeleting(false);
    }
  };

  const color = '#6C5CE7';

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-gray-200 hover:border-[#A29BFE] hover:shadow-md transition-all"
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: color }}
        >
          {currentUser ? currentUser[0] : '?'}
        </span>
        <span className="text-sm font-bold text-slate-800 hidden sm:inline">
          {currentUser || 'Account'}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-xl border border-gray-200 w-64 overflow-hidden">
            {/* User info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-bold text-slate-800">{currentUser}'s Account</p>
              <p className="text-xs text-slate-500">{parentEmail}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-800 hover:bg-[#F8F7FF] transition-colors"
              >
                <Download className="w-4 h-4 text-[#6C5CE7]" />
                Export Data
              </button>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-800 hover:bg-[#F8F7FF] transition-colors"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                Sign Out
              </button>
              <button
                onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-lg text-slate-800">Delete Account?</h2>
              <button onClick={() => setShowDeleteConfirm(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              This will <strong className="text-red-500">permanently delete</strong> {currentUser}'s account and all learning data.
              This cannot be undone.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              You may want to <button onClick={handleExport} className="text-[#6C5CE7] underline">export your data</button> first.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-slate-800 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountMenu;
