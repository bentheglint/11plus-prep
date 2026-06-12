import React, { useState, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

const YEAR_OPTIONS = [
  { value: '', label: 'Year (optional)' },
  { value: '3', label: 'Year 3' },
  { value: '4', label: 'Year 4' },
  { value: '5', label: 'Year 5' },
  { value: '6', label: 'Year 6' },
  { value: '7', label: 'Year 7' },
  { value: '8', label: 'Year 8' },
];

function validateEmail(raw) {
  if (typeof raw !== 'string') return false;
  const e = raw.trim().toLowerCase();
  if (e.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

function validateName(raw) {
  const s = (raw || '').trim();
  return s.length >= 1 && s.length <= 30;
}

function validateYear(raw) {
  if (!raw || raw === '') return true; // optional
  const n = Number(raw);
  return Number.isInteger(n) && n >= 3 && n <= 8;
}

function rowIsValid(row) {
  return validateEmail(row.email) && validateName(row.name) && validateYear(row.year);
}

function emptyRow() {
  return { email: '', name: '', year: '' };
}

// Parse pasted spreadsheet text → array of rows + skipped lines
function parsePaste(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  const rows = [];
  const skipped = [];

  for (const line of lines) {
    // Support tab or comma separation
    const parts = line.includes('\t')
      ? line.split('\t').map(p => p.trim())
      : line.split(',').map(p => p.trim());

    const [rawEmail, rawName, rawYear] = parts;
    const email = (rawEmail || '').toLowerCase().trim();

    // Skip header rows: if the email field fails basic validation, treat as header/skip
    if (!validateEmail(email)) {
      skipped.push(line);
      continue;
    }

    rows.push({
      email,
      name: (rawName || '').trim(),
      year: (rawYear || '').trim(),
    });
  }

  return { rows, skipped };
}

// ── Single row editor ──
function InviteRow({ row, index, errors, onChange, onRemove, showRemove }) {
  const emailErr = errors?.email;
  const nameErr = errors?.name;
  const yearErr = errors?.year;

  return (
    <div className={`flex flex-col sm:flex-row gap-2 p-3 rounded-xl border ${
      (emailErr || nameErr || yearErr) ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-white'
    }`}>
      <div className="flex-1 min-w-0">
        <input
          type="email"
          placeholder="parent@example.com"
          value={row.email}
          onChange={e => onChange(index, 'email', e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] ${
            emailErr ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          aria-label={`Parent email for row ${index + 1}`}
          aria-invalid={!!emailErr}
        />
        {emailErr && <p className="text-xs text-red-600 mt-1" role="alert">{emailErr}</p>}
      </div>
      <div className="flex-1 min-w-0">
        <input
          type="text"
          placeholder="Child's first name"
          value={row.name}
          maxLength={30}
          onChange={e => onChange(index, 'name', e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] ${
            nameErr ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          aria-label={`Child name for row ${index + 1}`}
          aria-invalid={!!nameErr}
        />
        {nameErr && <p className="text-xs text-red-600 mt-1" role="alert">{nameErr}</p>}
      </div>
      <div className="flex gap-2 items-start">
        <select
          value={row.year}
          onChange={e => onChange(index, 'year', e.target.value)}
          className={`border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] ${
            yearErr ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          aria-label={`Year group for row ${index + 1}`}
        >
          {YEAR_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors flex-shrink-0"
            aria-label={`Remove row ${index + 1}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Summary after successful submission ──
function SuccessSummary({ created, alreadyInvited, status, onBack }) {
  const needsReview = status === 'needs_review';
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-slate-800">
              {created} {created === 1 ? 'invitation' : 'invitations'} created
            </h2>
            <p className="text-sm text-slate-500">
              {needsReview ? 'Awaiting PrepStep approval' : 'Emails will be sent shortly'}
            </p>
          </div>
        </div>

        {needsReview && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 mb-4">
            This batch needs PrepStep approval before any emails go out — you'll see each invite as 'Awaiting approval' until then.
          </div>
        )}

        {alreadyInvited.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-700 mb-2">
              {alreadyInvited.length} already invited (not re-sent)
            </p>
            <ul className="space-y-1">
              {alreadyInvited.map((item, i) => (
                <li key={i} className="text-xs text-slate-500">
                  {item.childName} — {item.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full py-3 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] transition-colors"
      >
        Back to dashboard
      </button>
    </div>
  );
}

// ── Main screen ──
export default function BulkInviteScreen({ getToken, onBack }) {
  const [rows, setRows] = useState([emptyRow()]);
  const [rowErrors, setRowErrors] = useState({}); // index → { email?, name?, year? }
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null); // { created, alreadyInvited, status }

  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [pasteSkipped, setPasteSkipped] = useState([]);
  const [showPasteSkipped, setShowPasteSkipped] = useState(false);

  // Validate all rows client-side, returning errors map
  const validateRows = useCallback((rs) => {
    const errs = {};
    rs.forEach((row, i) => {
      const e = {};
      if (!validateEmail(row.email)) e.email = 'Enter a valid email address';
      if (!validateName(row.name)) {
        e.name = row.name.trim() === '' ? 'Child\'s name is required' : 'Name must be 30 characters or fewer';
      }
      if (!validateYear(row.year)) e.year = 'Year must be 3–8';
      if (Object.keys(e).length > 0) errs[i] = e;
    });
    return errs;
  }, []);

  const allValid = Object.keys(validateRows(rows)).length === 0 && rows.length > 0;

  const handleChange = (index, field, value) => {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
    // Clear that row's error for that field on change
    setRowErrors(prev => {
      if (!prev[index]) return prev;
      const updated = { ...prev[index] };
      delete updated[field];
      const next = { ...prev };
      if (Object.keys(updated).length === 0) delete next[index];
      else next[index] = updated;
      return next;
    });
  };

  const handleAddRow = () => {
    if (rows.length >= 100) return;
    setRows(prev => [...prev, emptyRow()]);
  };

  const handleRemove = (index) => {
    setRows(prev => prev.filter((_, i) => i !== index));
    setRowErrors(prev => {
      const next = {};
      Object.keys(prev).forEach(k => {
        const ki = Number(k);
        if (ki < index) next[ki] = prev[k];
        else if (ki > index) next[ki - 1] = prev[k];
      });
      return next;
    });
  };

  const handleParsePaste = () => {
    const { rows: parsed, skipped } = parsePaste(pasteText);
    if (parsed.length === 0 && skipped.length > 0) {
      setSubmitError('No valid rows found in the pasted text. Check the format: email, name, year (year is optional).');
      return;
    }
    if (parsed.length + rows.filter(r => r.email || r.name).length > 100) {
      setSubmitError('Maximum 100 rows allowed.');
      return;
    }
    // Replace any existing empty rows then append parsed
    const nonEmpty = rows.filter(r => r.email.trim() || r.name.trim());
    const combined = [...nonEmpty, ...parsed].slice(0, 100);
    setRows(combined.length > 0 ? combined : [emptyRow()]);
    setPasteSkipped(skipped);
    setSubmitError(null);
    setPasteMode(false);
    setPasteText('');
  };

  const handleSubmit = async () => {
    const errs = validateRows(rows);
    if (Object.keys(errs).length > 0) {
      setRowErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/tutor/bulk-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pupils: rows.map(r => ({
            email: r.email.trim().toLowerCase(),
            childName: r.name.trim(),
            ...(r.year ? { yearGroup: Number(r.year) } : {}),
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setSubmitError(data.error || 'Daily invite limit reached. Try again tomorrow.');
        return;
      }

      if (res.status === 400 && data.rowErrors) {
        // Map server row errors back onto local rows
        const newErrs = {};
        data.rowErrors.forEach(({ index, error }) => {
          newErrs[index] = { email: error }; // server row errors attach to the email field
        });
        setRowErrors(newErrs);
        setSubmitError('Some rows have errors — please correct them and try again.');
        return;
      }

      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess({
        created: data.created,
        alreadyInvited: data.alreadyInvited || [],
        status: data.status,
      });
    } catch {
      setSubmitError('Couldn\'t reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="app-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <div className="flex items-center gap-3 p-4 pt-5">
            <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-heading font-bold text-slate-800 text-lg">Invite pupils</h1>
          </div>
          <div className="px-0">
            <SuccessSummary
              created={success.created}
              alreadyInvited={success.alreadyInvited}
              status={success.status}
              onBack={onBack}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pt-5">
          <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-bold text-slate-800 text-lg">Invite pupils</h1>
        </div>

        <div className="space-y-4">
          {/* Toggle between row editor and paste mode */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPasteMode(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                !pasteMode
                  ? 'bg-[#7C3AED] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#7C3AED]'
              }`}
            >
              Add rows
            </button>
            <button
              type="button"
              onClick={() => setPasteMode(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                pasteMode
                  ? 'bg-[#7C3AED] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#7C3AED]'
              }`}
            >
              Paste a list instead
            </button>
          </div>

          {/* Paste mode */}
          {pasteMode && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-sm text-slate-600 mb-2">
                Paste rows from a spreadsheet. One row per line, formatted as:{' '}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">email, child name, year</code>{' '}
                (year is optional). Comma or tab-separated.
              </p>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder={`parent@example.com, Evie, 5\nparent2@example.com, James`}
                rows={6}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-3"
              />
              <button
                type="button"
                onClick={handleParsePaste}
                disabled={!pasteText.trim()}
                className="px-4 py-2 bg-[#7C3AED] text-white text-sm font-bold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50 transition-colors"
              >
                Parse and review
              </button>
            </div>
          )}

          {/* Skipped rows notice */}
          {pasteSkipped.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <button
                type="button"
                className="flex items-center justify-between w-full text-sm font-medium text-amber-800"
                onClick={() => setShowPasteSkipped(v => !v)}
                aria-expanded={showPasteSkipped}
              >
                <span>{pasteSkipped.length} row{pasteSkipped.length === 1 ? '' : 's'} skipped (invalid email — likely a header)</span>
                {showPasteSkipped ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showPasteSkipped && (
                <ul className="mt-2 space-y-1">
                  {pasteSkipped.map((line, i) => (
                    <li key={i} className="text-xs text-amber-700 font-mono">{line}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Row editor */}
          {!pasteMode && (
            <div className="space-y-2">
              {/* Column labels */}
              <div className="hidden sm:flex gap-2 px-3 text-xs font-medium text-slate-400 uppercase tracking-wide">
                <div className="flex-1">Parent email</div>
                <div className="flex-1">Child's name</div>
                <div className="w-32">Year</div>
                {rows.length > 1 && <div className="w-8" />}
              </div>

              {rows.map((row, i) => (
                <InviteRow
                  key={i}
                  row={row}
                  index={i}
                  errors={rowErrors[i]}
                  onChange={handleChange}
                  onRemove={handleRemove}
                  showRemove={rows.length > 1}
                />
              ))}

              {rows.length < 100 && (
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center gap-2 text-sm font-medium text-[#7C3AED] hover:text-[#5A4BD1] py-2"
                >
                  <Plus className="w-4 h-4" />
                  Add another row
                </button>
              )}

              {rows.length >= 100 && (
                <p className="text-xs text-slate-400">Maximum 100 rows reached.</p>
              )}
            </div>
          )}

          {/* Error */}
          {submitError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit */}
          {!pasteMode && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allValid || submitting}
              className="w-full py-3.5 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Sending invitations…' : `Send ${rows.length} ${rows.length === 1 ? 'invitation' : 'invitations'}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
