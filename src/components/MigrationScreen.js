import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Upload, CheckCircle, Database, ArrowRight, AlertCircle } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// ── Scan localStorage for existing data ──
// Checks both prefixed (user:Name:key) and legacy unprefixed (key) formats

function scanLocalStorage() {
  const found = {
    source: null,       // 'prefixed' | 'legacy' | null
    userName: null,      // the username found in prefixed keys
    data: {},            // key → parsed data
    summary: {},         // key → count/description
  };

  // 1. Check for prefixed keys (user:Name:quiz-history)
  const prefixedPattern = /^user:(.+?):quiz-history$/;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const match = key.match(prefixedPattern);
    if (match) {
      const userName = match[1];
      // Skip dev/testing users
      if (['Ben', 'Jacqui', 'Lauren', 'Daisy'].includes(userName)) continue;

      found.source = 'prefixed';
      found.userName = userName;

      // Load all data for this user
      const keysToLoad = [
        'quiz-history', 'topic-performance', 'seen-questions',
        'mock-test-history', 'lesson-history', 'question-results',
        'practice-log', 'leitner-queue', 'streaks', 'prep-points',
        'achievements', 'seen-tips', 'last-session-date',
      ];

      keysToLoad.forEach(k => {
        try {
          const raw = localStorage.getItem(`user:${userName}:${k}`);
          if (raw) found.data[k] = JSON.parse(raw);
        } catch { /* skip unparseable */ }
      });
      break;
    }
  }

  // 2. If no prefixed found, check for legacy unprefixed keys
  if (!found.source) {
    const legacyData = {};
    ['quiz-history', 'topic-performance', 'seen-questions',
     'mock-test-history', 'lesson-history'].forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) legacyData[k] = JSON.parse(raw);
      } catch { /* skip */ }
    });

    if (Object.keys(legacyData).length > 0) {
      found.source = 'legacy';
      found.data = legacyData;
    }
  }

  // 3. If we also find ALL users' data (e.g. Ben searching for Evie's data),
  //    scan for any prefixed user that has quiz history
  if (!found.source) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const match = key.match(prefixedPattern);
      if (match) {
        const userName = match[1];
        found.source = 'prefixed';
        found.userName = userName;

        const keysToLoad = [
          'quiz-history', 'topic-performance', 'seen-questions',
          'mock-test-history', 'lesson-history', 'question-results',
          'practice-log', 'leitner-queue', 'streaks', 'prep-points',
          'achievements', 'seen-tips', 'last-session-date',
        ];

        keysToLoad.forEach(k => {
          try {
            const raw = localStorage.getItem(`user:${userName}:${k}`);
            if (raw) found.data[k] = JSON.parse(raw);
          } catch { /* skip */ }
        });
        break;
      }
    }
  }

  // Build summary
  if (found.data['quiz-history']) {
    const qh = found.data['quiz-history'];
    found.summary.quizzes = Array.isArray(qh) ? qh.length : 0;
  }
  if (found.data['mock-test-history']) {
    const mh = found.data['mock-test-history'];
    found.summary.mockTests = Array.isArray(mh) ? mh.length : 0;
  }
  if (found.data['question-results']) {
    const qr = found.data['question-results'];
    found.summary.questionAttempts = Array.isArray(qr) ? qr.length : 0;
  }
  if (found.data['lesson-history']) {
    const lh = found.data['lesson-history'];
    found.summary.lessons = typeof lh === 'object' ? Object.keys(lh).length : 0;
  }
  if (found.data['streaks']) {
    const s = found.data['streaks'];
    found.summary.streak = s.currentStreak || 0;
    found.summary.longestStreak = s.longestStreak || 0;
  }
  if (found.data['achievements']) {
    const a = found.data['achievements'];
    found.summary.achievements = Array.isArray(a) ? a.length : 0;
  }
  if (found.data['prep-points']) {
    const pp = found.data['prep-points'];
    found.summary.prepPoints = pp.total || 0;
  }

  found.hasData = Object.keys(found.data).length > 0 &&
    (found.summary.quizzes > 0 || found.summary.lessons > 0 || found.summary.questionAttempts > 0);

  return found;
}

// ── Migration Screen Component ──

export default function MigrationScreen({ childName, onComplete, onSkip }) {
  const { getToken } = useAuth();
  const [scan, setScan] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mismatchConfirmed, setMismatchConfirmed] = useState(false);

  // Check if the found data belongs to a different child
  const hasNameMismatch = scan?.userName && scan.userName.toLowerCase() !== childName?.toLowerCase();

  // Scan on mount
  useEffect(() => {
    const found = scanLocalStorage();
    setScan(found);

    // If no data found, skip immediately
    if (!found.hasData) {
      onSkip();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImport = async () => {
    if (!scan?.hasData) return;

    try {
      setIsImporting(true);
      setError(null);

      const token = await getToken();

      // Build the migration payload matching the API's expected format
      const payload = {
        quizHistory: scan.data['quiz-history'] || [],
        mockTestHistory: scan.data['mock-test-history'] || [],
        questionResults: scan.data['question-results'] || [],
        lessonHistory: scan.data['lesson-history'] || {},
        topicPerformance: scan.data['topic-performance'] || {},
        leitnerQueue: scan.data['leitner-queue'] || [],
        practiceLog: scan.data['practice-log'] || [],
        seenQuestions: scan.data['seen-questions'] || {},
        streaks: scan.data['streaks'] || null,
        prepPoints: scan.data['prep-points'] || null,
        achievements: scan.data['achievements'] || [],
        seenTips: scan.data['seen-tips'] || [],
        lastSessionDate: scan.data['last-session-date'] || null,
        _source: `localStorage-${scan.source}`,
      };

      const res = await fetch(`${API_URL}/api/data/migrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Migration failed');
      }

      // Also seed localStorage with the child's new prefixed keys
      // so useUserData picks it up immediately
      const prefix = `user:${childName}:`;
      Object.entries(scan.data).forEach(([key, value]) => {
        if (value != null) {
          localStorage.setItem(prefix + key, JSON.stringify(value));
        }
      });

      // Mark localStorage migration complete (don't re-prompt)
      localStorage.setItem(`migration-complete:${childName}`, 'true');

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  // Still scanning
  if (!scan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center">
        <div className="animate-pulse text-[#6C5CE7] font-heading font-bold text-xl">
          Checking for existing data...
        </div>
      </div>
    );
  }

  // Import complete — show summary
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">
            Data Imported!
          </h1>
          <p className="text-slate-500 mb-4">
            {childName}'s progress has been imported to their new account.
          </p>

          <div className="bg-[#F8F7FF] rounded-xl p-4 mb-6 text-left">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {scan.summary.quizzes > 0 && (
                <div><span className="font-bold text-[#6C5CE7]">{scan.summary.quizzes}</span> quizzes</div>
              )}
              {scan.summary.mockTests > 0 && (
                <div><span className="font-bold text-[#6C5CE7]">{scan.summary.mockTests}</span> mock tests</div>
              )}
              {scan.summary.lessons > 0 && (
                <div><span className="font-bold text-[#6C5CE7]">{scan.summary.lessons}</span> lessons</div>
              )}
              {scan.summary.questionAttempts > 0 && (
                <div><span className="font-bold text-[#6C5CE7]">{scan.summary.questionAttempts}</span> questions</div>
              )}
              {scan.summary.streak > 0 && (
                <div><span className="font-bold text-[#6C5CE7]">{scan.summary.streak}</span> day streak</div>
              )}
              {scan.summary.achievements > 0 && (
                <div><span className="font-bold text-[#6C5CE7]">{scan.summary.achievements}</span> achievements</div>
              )}
              {scan.summary.prepPoints > 0 && (
                <div><span className="font-bold text-[#6C5CE7]">{scan.summary.prepPoints}</span> prep points</div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            {result.itemsImported} items imported. Your original data is still saved on this device as a backup.
          </p>

          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors"
          >
            Start Learning
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Show migration prompt
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#F0EDFF] rounded-full flex items-center justify-center">
          <Database className="w-8 h-8 text-[#6C5CE7]" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2 text-center">
          We found existing progress!
        </h1>
        <p className="text-slate-500 text-center mb-6">
          {scan.userName ? `${scan.userName}'s` : 'Your'} learning data is saved on this device.
          Import it to {childName}'s new account?
        </p>

        {/* Summary of what was found */}
        <div className="bg-[#F8F7FF] rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {scan.summary.quizzes > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00B894] flex-shrink-0" />
                <span><strong>{scan.summary.quizzes}</strong> quizzes completed</span>
              </div>
            )}
            {scan.summary.mockTests > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00B894] flex-shrink-0" />
                <span><strong>{scan.summary.mockTests}</strong> mock tests</span>
              </div>
            )}
            {scan.summary.lessons > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00B894] flex-shrink-0" />
                <span><strong>{scan.summary.lessons}</strong> lessons done</span>
              </div>
            )}
            {scan.summary.questionAttempts > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00B894] flex-shrink-0" />
                <span><strong>{scan.summary.questionAttempts}</strong> questions answered</span>
              </div>
            )}
            {scan.summary.streak > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00B894] flex-shrink-0" />
                <span><strong>{scan.summary.streak}</strong>-day streak</span>
              </div>
            )}
            {scan.summary.prepPoints > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00B894] flex-shrink-0" />
                <span><strong>{scan.summary.prepPoints}</strong> prep points</span>
              </div>
            )}
          </div>
        </div>

        {hasNameMismatch && !mismatchConfirmed && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-2 text-amber-700 text-sm mb-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Different name detected</p>
                <p>This data belongs to <strong>{scan.userName}</strong>, but you're setting up an account for <strong>{childName}</strong>. Only import if this is the same child.</p>
              </div>
            </div>
            <button
              onClick={() => setMismatchConfirmed(true)}
              className="w-full py-2 rounded-lg text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors"
            >
              Yes, this is {childName}'s data
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl p-3 mb-4 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={isImporting || (hasNameMismatch && !mismatchConfirmed)}
          className={`w-full py-3 rounded-xl font-bold text-white mb-3 transition-colors flex items-center justify-center gap-2 ${
            isImporting || (hasNameMismatch && !mismatchConfirmed) ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#6C5CE7] hover:bg-[#5A4BD1]'
          }`}
        >
          <Upload className="w-4 h-4" />
          {isImporting ? 'Importing...' : 'Import My Data'}
        </button>

        <button
          onClick={onSkip}
          className="w-full py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          Skip — start fresh
        </button>

        <p className="text-xs text-slate-500 text-center mt-4">
          Your original data stays on this device as a backup.
        </p>
      </div>
    </div>
  );
}
