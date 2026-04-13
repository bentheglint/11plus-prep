import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// Report errors to the Worker for monitoring (fire-and-forget)
function reportError(error, context = {}) {
  if (!API_URL) return;
  try {
    const payload = {
      message: error?.message || String(error),
      stack: error?.stack?.substring(0, 2000),
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      user: localStorage.getItem('current-user') || 'unknown',
      ...context,
    };
    // Fire-and-forget — don't block the UI
    fetch(`${API_URL}/api/error-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {}); // Silently ignore network failures
  } catch { /* never throw from error reporting */ }
}

// Global uncaught error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    reportError(event.error || event.message, { source: 'window.onerror' });
  });
  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason, { source: 'unhandledrejection' });
  });
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
    reportError(error, {
      source: 'ErrorBoundary',
      componentStack: errorInfo?.componentStack?.substring(0, 1000),
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-500 mb-6">
              Sorry about that! The app ran into a problem. Your progress is saved — try reloading.
            </p>
            <div className="flex gap-3">
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 rounded-xl font-bold text-slate-800 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Go Home
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-slate-500 cursor-pointer">Technical details</summary>
                <pre className="mt-2 text-xs text-red-500 bg-red-50 rounded-lg p-3 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
