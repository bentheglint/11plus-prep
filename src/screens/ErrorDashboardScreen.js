import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, AlertTriangle, RefreshCw, Trash2, Filter } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// ErrorDashboardScreen — dev-only surface for runtime errors reported
// from the ErrorBoundary. Accessed via ?view=errors.
//
// Why: errors fired to /api/error-report previously only hit the Worker's
// console.error — nobody read them. This screen reads the last 50 from
// KV so Ben/Jacqui can spot crashes their users hit without having to
// tell anyone.
export default function ErrorDashboardScreen({ onBack }) {
  const [errors, setErrors] = useState(null);
  const [userFilter, setUserFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const load = () => {
    if (!API_URL) return;
    setLoading(true);
    fetch(`${API_URL}/errors`)
      .then(r => r.json())
      .then(data => setErrors(Array.isArray(data) ? data : []))
      .catch(() => setErrors([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const users = useMemo(() => {
    if (!errors) return [];
    return [...new Set(errors.map(e => e.user || 'unknown'))].sort();
  }, [errors]);

  const filtered = useMemo(() => {
    if (!errors) return [];
    const list = userFilter === 'all' ? errors : errors.filter(e => (e.user || 'unknown') === userFilter);
    return [...list].reverse(); // newest first
  }, [errors, userFilter]);

  const handleClear = async () => {
    if (!window.confirm('Clear all recorded errors?')) return;
    await fetch(`${API_URL}/errors/clear`, { method: 'POST' });
    load();
  };

  return (
    <div className="app-bg p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-4 flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-3xl font-extrabold text-slate-800">Error Reports</h1>
            <p className="text-sm text-gray-500">Last 50 runtime errors from across all users</p>
          </div>
          <button
            onClick={load}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>

        {/* Filter */}
        {users.length > 1 && (
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm"
            >
              <option value="all">All users ({errors?.length || 0})</option>
              {users.map(u => (
                <option key={u} value={u}>
                  {u} ({errors?.filter(e => (e.user || 'unknown') === u).length})
                </option>
              ))}
            </select>
          </div>
        )}

        {errors === null ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-3 bg-emerald-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-slate-700 font-medium">No errors recorded</p>
            <p className="text-sm text-gray-500 mt-1">
              {userFilter === 'all' ? 'The app is behaving itself.' : `Nothing from ${userFilter}.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((err) => (
              <div key={err.id || err.timestamp} className="card-elevated p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-slate-800 break-all">{err.message || '(no message)'}</span>
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        {err.user || 'unknown'}
                      </span>
                      {err.source && (
                        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                          {err.source}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {err.timestamp ? new Date(err.timestamp).toLocaleString('en-GB') : ''}
                      {err.url && <span className="ml-2 text-gray-400">· {err.url}</span>}
                    </div>
                    {err.stack && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                          Stack trace
                        </summary>
                        <pre className="mt-2 text-xs text-gray-600 bg-gray-50 rounded p-2 overflow-auto max-h-48 whitespace-pre-wrap">
                          {err.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
