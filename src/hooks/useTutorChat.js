import { useCallback, useRef, useState } from 'react';

// useTutorChat — owns the tutor chat state for both live-quiz and review flows.
//
// Conversations are scoped by an opaque "key" (the live quiz uses a single
// fixed key like 'live'; the review flow keys by question index). The hook
// stores a separate message history per key and tracks pending requests per
// key so late-arriving responses can never land in the wrong conversation
// after the user navigates between questions.
//
// The system prompt is built by the caller (passed as `buildSystemPrompt`)
// so live-quiz "no spoilers" mode and review-mode "explain freely" mode can
// share this hook without the hook knowing about quiz semantics.
export function useTutorChat({ apiUrl, buildSystemPrompt, errorMessage, getToken } = {}) {
  const [showTutorChat, setShowTutorChat] = useState(false);
  const [currentKey, setCurrentKey] = useState('default');
  const [chatByKey, setChatByKey] = useState(() => new Map());
  const [thinkingByKey, setThinkingByKey] = useState(() => new Map());
  const [userMessage, setUserMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Race-safety: pendingByKey tracks the newest in-flight requestId for each
  // key. When a response arrives, we only apply it if its requestId still
  // matches — otherwise it's a stale reply and we discard it.
  const pendingByKey = useRef(new Map());
  const autoSentKeys = useRef(new Set());
  const recognitionRef = useRef(null);

  const chatMessages = chatByKey.get(currentKey) || [];
  const isAiThinking = thinkingByKey.get(currentKey) || false;

  const setMessagesForKey = useCallback((key, updater) => {
    setChatByKey(prev => {
      const next = new Map(prev);
      const current = next.get(key) || [];
      next.set(key, typeof updater === 'function' ? updater(current) : updater);
      return next;
    });
  }, []);

  const setThinkingForKey = useCallback((key, value) => {
    setThinkingByKey(prev => {
      const next = new Map(prev);
      next.set(key, value);
      return next;
    });
  }, []);

  // Send a message tied to a specific key. Captures the key and requestId at
  // call time so late responses can only land in the originating conversation
  // and only if no newer request for that key has superseded them.
  const sendForKey = useCallback(async (key, content) => {
    if (!apiUrl) {
      setMessagesForKey(key, prev => [...prev, { role: 'user', content }, {
        role: 'assistant',
        content: 'Tutor is not configured. Please try again later.',
      }]);
      return;
    }

    const requestId = Math.random().toString(36).slice(2);
    pendingByKey.current.set(key, requestId);

    const messagesAtSend = chatByKey.get(key) || [];
    const newMessages = [...messagesAtSend, { role: 'user', content }];
    setMessagesForKey(key, newMessages);
    setThinkingForKey(key, true);

    try {
      const systemPrompt = buildSystemPrompt
        ? buildSystemPrompt({ key, messages: newMessages })
        : '';

      // Attach the auth token if a getToken function was provided.
      const headers = { 'Content-Type': 'application/json' };
      if (getToken) {
        try {
          const token = await getToken();
          if (token) headers['Authorization'] = `Bearer ${token}`;
        } catch { /* proceed without auth — server will 401 */ }
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ system: systemPrompt, messages: newMessages }),
      });
      const data = await response.json();

      // Race guard: if a newer request for this key has been issued, this
      // response is stale — discard it without touching state.
      if (pendingByKey.current.get(key) !== requestId) return;

      if (response.status === 429 && data.friendly) {
        throw new Error('__quota__');
      }
      if (data.error) throw new Error(data.error);
      const aiResponse = data.content?.find(item => item.type === 'text')?.text
        || "I'm here to help! Could you ask that in a different way?";

      setMessagesForKey(key, prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      if (pendingByKey.current.get(key) !== requestId) return;
      const isQuotaExhausted = err.message === '__quota__';
      setMessagesForKey(key, prev => [...prev, {
        role: 'assistant',
        content: isQuotaExhausted
          ? "You've used up today's tutor questions — come back tomorrow!"
          : (errorMessage || "Oops! I had trouble connecting. Could you try asking again?"),
      }]);
    } finally {
      if (pendingByKey.current.get(key) === requestId) {
        setThinkingForKey(key, false);
        pendingByKey.current.delete(key);
      }
    }
  }, [apiUrl, buildSystemPrompt, chatByKey, errorMessage, getToken, setMessagesForKey, setThinkingForKey]);

  const sendMessage = useCallback(async () => {
    const text = userMessage.trim();
    if (!text || isAiThinking) return;
    setUserMessage('');
    await sendForKey(currentKey, text);
  }, [userMessage, isAiThinking, currentKey, sendForKey]);

  // Idempotent per key — sends the prompt only the first time it's called for
  // a given key. Subsequent calls (e.g. user navigates back to a question
  // they've already auto-chatted on) do nothing.
  const autoSendIfNew = useCallback((key, prompt) => {
    if (autoSentKeys.current.has(key)) return;
    autoSentKeys.current.add(key);
    sendForKey(key, prompt);
  }, [sendForKey]);

  const setKey = useCallback((key) => setCurrentKey(key), []);

  // Open the chat panel. If `seedMessage` is provided and the keyed conversation
  // is empty, drop in a single welcome/system message (used by the live flow
  // to show "Hi! I'm your AI tutor…" on first open).
  const openChat = useCallback((opts = {}) => {
    const { key, seedMessage } = opts;
    const targetKey = key !== undefined ? key : currentKey;
    if (key !== undefined) setCurrentKey(key);
    setShowTutorChat(true);
    if (seedMessage) {
      setMessagesForKey(targetKey, prev => (prev.length === 0 ? [seedMessage] : prev));
    }
  }, [currentKey, setMessagesForKey]);

  const closeChat = useCallback(() => setShowTutorChat(false), []);

  // Wipe ALL conversations + auto-send tracking. Used by the live flow when
  // moving between quizzes (reset) and not used by the review flow (which
  // resets via unmount).
  const clearChat = useCallback(() => {
    setChatByKey(new Map());
    setThinkingByKey(new Map());
    pendingByKey.current = new Map();
    autoSentKeys.current = new Set();
    setShowTutorChat(false);
    setUserMessage('');
  }, []);

  // Speech-to-text — feeds transcripts into the userMessage box.
  const toggleListening = useCallback(() => {
    const SpeechRecognition = typeof window !== 'undefined'
      && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserMessage(prev => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  return {
    showTutorChat,
    openChat,
    closeChat,
    clearChat,
    currentKey,
    setKey,
    chatMessages,
    isAiThinking,
    userMessage,
    setUserMessage,
    isListening,
    toggleListening,
    sendMessage,
    autoSendIfNew,
  };
}
