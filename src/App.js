import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, viewTransition } from './components/Motion';
import { BookOpen, Calculator, Brain, Home, ChevronRight, CheckCircle, XCircle, RotateCcw, BarChart3, Calendar, Target, MessageSquare, GraduationCap, Star, Trophy, ThumbsUp, Zap, Crown, Rocket, Wrench, MessageCircle, ArrowLeft, Award, Layers, Mic, MicOff } from 'lucide-react';
import MicroLessonScreen from './microLessons/MicroLessonScreen';
import SpeedReviewPanel from './SpeedReviewPanel';
import { lessonBank } from './microLessons/lessonData';
import {
  FunctionMachine, CuboidDiagram, SDTTriangle, AngleDiagram,
  AngleDisplay, QuadShape, ParallelLines, ExteriorAngle, RegularPolygon,
  BarChart, PieChart, LineGraph, TwoWayTable, RectangleDiagram,
  TriangleAreaDiagram, ParallelogramDiagram, LShapeDiagram,
  NumberLine, BarModel, GridModel, PathBorderDiagram, PlaceValueChart,
  ClockFace, ThermometerDiagram, BuildingDiagram,
  RectangleComparison, RectangleGrid, DotPattern, CuboidComparison
} from './microLessons/visuals';
import ResultsScreen from './screens/ResultsScreen';
import ProgressScreen from './screens/ProgressScreen';
import QuizDetailScreen from './screens/QuizDetailScreen';
import AllActivityScreen from './screens/AllActivityScreen';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import LearningModeScreen from './screens/LearningModeScreen';
import TopicsScreen from './screens/TopicsScreen';
import TopicDrillDown from './screens/TopicDrillDown';
import StudyToolkitScreen from './screens/StudyToolkitScreen';
import MockTestScreen from './screens/MockTestScreen';
import MockTestResultsScreen from './screens/MockTestResultsScreen';
import ErrorDashboardScreen from './screens/ErrorDashboardScreen';
import FeatureFlagsScreen from './screens/FeatureFlagsScreen';
import useMockTest from './hooks/useMockTest';
import useD1Data from './hooks/useD1Data';
import useAchievements from './hooks/useAchievements';
import AchievementModal from './components/AchievementModal';
import { topicNames } from './components/RecommendationCard';
import useMastery from './hooks/useMastery';
import useStreaksAndPP from './hooks/useStreaksAndPP';
// Question data for maths/English/VR is lazy-loaded by AppLoader and passed
// in as the `loadedData` prop — keeps each subject's ~1–2 MB payload out of
// the main bundle. Tests still import these modules directly (synchronous).
import allTips from './data/studyTips';
import { selectPostQuestionTip, selectPreQuizTip } from './utils/tipSelection';
import { selectWeightedTopics } from './utils/spacedRepetition';
import { getAdaptiveDifficulty } from './utils/adaptiveDifficulty';
import { checkAnswerCorrectness, shouldShowPostQuestionTip, recordQuizResults as recordQuizResultsOrch, saveMockTestResults } from './utils/quizOrchestration';
import { getQuizSaveKey, buildQuizSaveState, isQuizExpired, parseAndValidateQuiz } from './utils/quizPersistence';
import { isTutorAllowlisted } from './utils/tutorAllowlist';
import useLeitner from './hooks/useLeitner';
import useTestingCoverage from './hooks/useTestingCoverage';
import TestingDashboard, { FlagModal, TestingResultsSummary } from './TestingMode';
import { getDueQuestions } from './utils/leitnerSchedule';
import PreQuizTipCard from './components/PreQuizTipCard';
import WelcomeBackScreen from './components/WelcomeBackScreen';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import { setCurrentView as setErrorBoundaryView } from './components/ErrorBoundary';
import MistakesScreen from './screens/MistakesScreen';
import ChildrenScreen from './screens/ChildrenScreen';
import JoinScreen from './screens/JoinScreen';
import TutorSignupScreen from './screens/TutorSignupScreen';
import TutorDashboardScreen from './screens/TutorDashboardScreen';
import { ParentMessagingScreen } from './screens/MessagingScreen';
import { selectWelcomeBackTip } from './utils/tipSelection';

// Visual component map for rendering diagrams on quiz question screens
const quizVisualComponents = {
  FunctionMachine, CuboidDiagram, SDTTriangle, AngleDiagram,
  AngleDisplay, QuadShape, ParallelLines, ExteriorAngle, RegularPolygon,
  BarChart, PieChart, LineGraph, TwoWayTable, RectangleDiagram,
  TriangleAreaDiagram, ParallelogramDiagram, LShapeDiagram,
  NumberLine, BarModel, GridModel, PathBorderDiagram, PlaceValueChart,
  ClockFace, ThermometerDiagram, BuildingDiagram,
  RectangleComparison, RectangleGrid, DotPattern, CuboidComparison
};

function App({ currentUser: authUser, getToken, loadedData, activeChildId: initialChildId, childrenList: initialChildrenList, userEmail }) {
  // Destructure the lazy-loaded question data into the same names the rest
  // of this file used to import statically. Keeps every downstream reference
  // to mathsData/englishData/vrData working without further edits.
  const { maths: mathsData, english: englishData, verbalreasoning: vrData } = loadedData;

  // Subject map with icons — memoised on loadedData so hooks downstream get
  // a stable reference between renders.
  const questionData = useMemo(() => ({
    maths: { ...mathsData, icon: Calculator },
    english: { ...englishData, icon: BookOpen },
    verbalreasoning: { ...vrData, icon: Brain },
  }), [mathsData, englishData, vrData]);

  // In auth mode, currentUser comes from Clerk/D1 via AuthGate prop.
  // Fall back to localStorage for dev/testing (when rendered without AuthGate).
  const [currentUser, setCurrentUser] = useState(() => {
    return authUser || localStorage.getItem('current-user') || '';
  });

  // Sync currentUser when authUser prop changes (Clerk login/logout).
  // Codex BLOCKER: explicit logout must clear currentUser, otherwise hooks
  // keep operating against the previous child's data until the next login.
  useEffect(() => {
    if (authUser && authUser !== currentUser) {
      setCurrentUser(authUser);
      localStorage.setItem('current-user', authUser);
    } else if (authUser === null && currentUser) {
      setCurrentUser('');
      localStorage.removeItem('current-user');
    }
  }, [authUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Active child state — persisted to localStorage so it survives reloads.
  // On mount: use prop value (from AuthGate) as the source of truth.
  // Falls back to stored value or the first child if prop isn't available.
  const [activeChildId, setActiveChildIdState] = useState(() => {
    return initialChildId || localStorage.getItem('active-child-id') || null;
  });
  const [childrenList, setChildrenList] = useState(() => initialChildrenList || []);

  // Sync when AuthGate provides fresh data (login / page reload)
  useEffect(() => {
    if (initialChildId && initialChildId !== activeChildId) {
      setActiveChildIdState(initialChildId);
      localStorage.setItem('active-child-id', initialChildId);
    }
  }, [initialChildId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialChildrenList?.length) setChildrenList(initialChildrenList);
  }, [initialChildrenList]); // eslint-disable-line react-hooks/exhaustive-deps

  const setActiveChildId = (childId) => {
    setActiveChildIdState(childId);
    localStorage.setItem('active-child-id', childId);
    // When switching children, bump back to home so we don't show stale data
    setCurrentView('home');
  };

  // Per-user data isolation — all progress data keyed by user name
  const userData = useD1Data(currentUser, getToken, activeChildId);
  const { quizHistory, topicPerformance, seenQuestions, lessonHistory, questionResults, practiceLog } = userData;

  // Mastery scoring engine (computed from question results)
  const mastery = useMastery(questionResults, practiceLog, userData.mockTestHistory);

  // Leitner spaced repetition queue
  const leitner = useLeitner(userData.leitnerQueue, userData.saveLeitnerQueue);

  // Testing coverage (Ben + Jacqui only — loaded lazily, empty for other users)
  const testingCoverage = useTestingCoverage(currentUser);

  // Streaks and Prep Points
  const streaksAndPP = useStreaksAndPP(
    userData.streakData, userData.prepPointsData,
    userData.saveStreakData, userData.savePrepPoints
  );

  // Achievements
  const achievements = useAchievements(
    userData.achievements, userData.saveAchievements,
    quizHistory, questionResults, userData.streakData,
    userData.mockTestHistory, mastery.getTopicMastery
  );
  const [pendingAchievement, setPendingAchievement] = useState(null);

  const mockTest = useMockTest();
  const mockResultsSaved = React.useRef(false);
  // Detect /join/<tutorCode> path on mount — also check sessionStorage so the
  // code survives Clerk's sign-in redirect (which lands on /, not /join/<code>).
  const [joinTutorCode, setJoinTutorCode] = useState(() => {
    const pathMatch = window.location.pathname.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
    if (pathMatch) return pathMatch[1].toUpperCase();
    try { return sessionStorage.getItem('pending-join-code') || null; } catch { return null; }
  });

  const [currentView, setCurrentView] = useState(() => {
    const pathMatch = window.location.pathname.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
    if (pathMatch) return 'join';
    try { if (sessionStorage.getItem('pending-join-code')) return 'join'; } catch {};
    // Dev preview bypass — ?preview=tutor or ?preview=tutorDashboard
    const previewParam = process.env.NODE_ENV === 'development'
      && new URLSearchParams(window.location.search).get('preview');
    if (previewParam === 'tutor') return 'tutorSignup';
    if (previewParam === 'tutorDashboard' || previewParam === 'tutorEmpty') return 'tutorDashboard';
    return 'home';
  });

  // Keep error boundary view context in sync for Sentry error reports
  React.useEffect(() => { setErrorBoundaryView(currentView); }, [currentView]);

  // Scroll to top whenever the view changes — otherwise new screens land
  // wherever the previous screen's scroll position was (flagged 15 Apr 2026
  // during Phase 10 walkthrough: Quiz Detail opened mid-page).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedPair, setSelectedPair] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showTutorChat, setShowTutorChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef(null);
  const questionStartTime = React.useRef(Date.now());
  const pausedTimeMs = React.useRef(0);        // accumulated pause time for current question
  const pauseStartTime = React.useRef(null);    // when the current pause began
  const [savedTimerSecs, setSavedTimerSecs] = useState(0); // visible timer value saved before lesson
  const quizSessionId = React.useRef(Date.now());
  // Resume timer when AI tutor chat closes
  const prevShowTutorChat = React.useRef(false);
  React.useEffect(() => {
    if (prevShowTutorChat.current && !showTutorChat && pauseStartTime.current) {
      pausedTimeMs.current += Date.now() - pauseStartTime.current;
      pauseStartTime.current = null;
    }
    prevShowTutorChat.current = showTutorChat;
  }, [showTutorChat]);
  // Re-entry guard for quiz completion — prevents duplicate quiz_results rows
  // when handleNextQuestion fires twice (rapid double-click, StrictMode remount,
  // any async re-entry). Codex Fix E.
  const isSubmittingRef = React.useRef(false);
  // Post-question tip state (Oracle: show tip ~every 3rd wrong answer)
  const wrongAnswerCount = React.useRef(0);
  const sessionShownTipIds = React.useRef(new Set());
  const [postQuestionTip, setPostQuestionTip] = useState(null);
  // Pre-quiz tip state (Oracle: brief tip before quiz starts)
  const [preQuizTip, setPreQuizTip] = useState(null);
  const [showPreQuizTip, setShowPreQuizTip] = useState(false);
  // Welcome Back state (Oracle: spaced resurfacing after 2+ days away)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [welcomeBackTip, setWelcomeBackTip] = useState(null);
  const welcomeBackChecked = React.useRef(false);
  // Lesson Browser state (Oracle: standalone lesson access from Study Toolkit)
  const [returnToToolkit, setReturnToToolkit] = useState(false);
  const toolkitLessonsViewed = React.useRef(0);
  const [quizMode, setQuizMode] = useState(null);
  // Resume prompt — shown when user selects a Focused topic that already has
  // a mid-quiz save. `pendingTopic` holds { topic, subject } if the user
  // chooses "Start Fresh" and we need to proceed with the original selection.
  const [resumePrompt, setResumePrompt] = useState(null); // { savedState, pendingTopic } | null
  const [returnToSpeedReview, setReturnToSpeedReview] = useState(false);
  const [returnToTestingMode, setReturnToTestingMode] = useState(false);
  const [testingSessionFlags, setTestingSessionFlags] = useState([]);
  const [speedReviewTab, setSpeedReviewTab] = useState('lessons');
  const [speedReviewMapTopic, setSpeedReviewMapTopic] = useState('');
  const [speedReviewScrollY, setSpeedReviewScrollY] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [questionFeedback, setQuestionFeedback] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [forcedLessonResult, setForcedLessonResult] = useState(null);
  const [lessonFromQuiz, setLessonFromQuiz] = useState(null);
  const [showDidItHelp, setShowDidItHelp] = useState(false);
  const [drillDownTopic, setDrillDownTopic] = useState(null); // { subject, topicKey }
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Quiz Detail View — selected row from Recent Activity
  const [quizDetailReturnTo, setQuizDetailReturnTo] = useState('progress'); // 'progress' | 'allActivity' | 'results'
  const [lastCompletedQuiz, setLastCompletedQuiz] = useState(null); // post-quiz review entry
  const [activeAssignment, setActiveAssignment] = useState(null); // { recipientId, topic, subject } when child launches an assigned topic
  const [questionMappings, setQuestionMappings] = useState({});
  const [testedSubConcepts, setTestedSubConcepts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(currentUser ? `user:${currentUser}:tested-subconcepts` : 'tested-subconcepts')) || {}; } catch { return {}; }
  });

  // ── Per-user state isolation on switch/logout ──
  // Codex BLOCKER (child-safety): useD1Data resets its own hook state when
  // currentUser changes, but App.js keeps all navigation + quiz + review
  // state in local component state. If Ben switches from Evie mid-quiz or
  // on Quiz Detail, without this reset the new user would briefly see the
  // previous child's screen content. Bounce every transition to Home with
  // a clean slate.
  const prevCurrentUser = React.useRef(currentUser);
  useEffect(() => {
    if (prevCurrentUser.current === currentUser) return;
    prevCurrentUser.current = currentUser;

    // Navigation
    setCurrentView('home');
    setSelectedSubject(null);
    setSelectedTopic(null);
    setDrillDownTopic(null);
    setSelectedQuiz(null);

    // Mid-quiz state
    setQuizMode(null);
    setQuizQuestions([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setQuestionFeedback([]);
    setSavedTimerSecs(0);

    // Tips / chat / overlays
    setShowTutorChat(false);
    setChatMessages([]);
    setUserMessage('');
    setShowFeedbackForm(false);
    setFeedbackText('');
    setPreQuizTip(null);
    setShowPreQuizTip(false);
    setPostQuestionTip(null);
    setShowWelcomeBack(false);
    setWelcomeBackTip(null);
    setForcedLessonResult(null);
    setLessonFromQuiz(null);
    setShowDidItHelp(false);
    setPendingAchievement(null);

    // Refs
    isSubmittingRef.current = false;
    quizSessionId.current = Date.now();
    questionStartTime.current = Date.now();
    pausedTimeMs.current = 0;
    pauseStartTime.current = null;
    wrongAnswerCount.current = 0;
    sessionShownTipIds.current = new Set();
    welcomeBackChecked.current = false;
    mockResultsSaved.current = false;
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check achievements when results are shown — state is fully updated by then
  const prevResultsKey = React.useRef(null);
  React.useEffect(() => {
    const isResults = currentView === 'results' || (currentView === 'mockTest' && mockTest.mockTestComplete);
    const resultsKey = isResults ? `${currentView}-${quizHistory.length}-${userData.mockTestHistory.length}` : null;
    if (isResults && resultsKey !== prevResultsKey.current) {
      prevResultsKey.current = resultsKey;
      const newAchievements = achievements.checkAchievements();
      if (newAchievements.length > 0) {
        setPendingAchievement(newAchievements[0]);
      }
    }
  }, [currentView, mockTest.mockTestComplete, achievements, quizHistory.length, userData.mockTestHistory.length]);

  // ── Quiz State Persistence ──
  // Save quiz progress so children can resume if they leave mid-quiz
  const quizSaveKey = getQuizSaveKey(currentUser);

  // Save active quiz state whenever it changes so the child can pick up
  // where they left off. The save is surfaced via the resume prompt when
  // they re-select the same topic (handleTopicSelect). Deliberately does
  // NOT auto-restore on mount — refresh takes the child back to Home, and
  // the prompt handles resume. Explicit clears happen on quiz completion
  // (see handleNextQuestion) and on "Start Fresh" from the resume prompt.
  useEffect(() => {
    if (!quizSaveKey) return;
    if (quizMode === 'testing') return; // Don't persist testing quizzes
    if (currentView === 'quiz' && quizQuestions.length > 0) {
      const saveState = buildQuizSaveState({
        currentView, selectedSubject, selectedTopic, quizMode,
        quizQuestions, currentQuestionIndex, answers,
        selectedAnswer, selectedPair, showFeedback,
        sessionId: quizSessionId.current,
      });
      localStorage.setItem(quizSaveKey, JSON.stringify(saveState));
    }
  }, [quizSaveKey, currentView, quizQuestions, currentQuestionIndex, answers, selectedAnswer, selectedPair, showFeedback, selectedSubject, selectedTopic, quizMode]);

  // Keep Dev Review panel context updated
  useEffect(() => {
    window.__devReviewContext = {
      view: currentView,
      subject: selectedSubject || undefined,
      topic: selectedTopic || undefined,
    };
  }, [currentView, selectedSubject, selectedTopic]);

  // Persist currentUser to localStorage
  const handleSetCurrentUser = (name) => {
    setCurrentUser(name);
    localStorage.setItem('current-user', name);
  };

  // Google Sheets feedback URL
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyBB5Tr6HhscQS2MhDLgM59ybWqsVhi0TOK44Z4sZCDXcmeKnnGTSchjEChau_DLA1eMA/exec';

  // Fire-and-forget POST to Google Sheet
  const submitToGoogleSheet = async (data) => {
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.warn('Google Sheet submission failed:', e.message);
    }
  };

  // Question feedback (not per-user — shared dev data)
  useEffect(() => {
    const savedFeedback = localStorage.getItem('question-feedback');
    if (savedFeedback) {
      setQuestionFeedback(JSON.parse(savedFeedback));
    }
    // Load question-to-lesson mapping files for "Find Me a Lesson" feature
    Promise.all([
      fetch('/maths-question-lesson-map.json').then(r => r.ok ? r.json() : {}).catch(() => ({})),
      fetch('/english-question-lesson-map.json').then(r => r.ok ? r.json() : {}).catch(() => ({})),
      fetch('/vr-question-lesson-map.json').then(r => r.ok ? r.json() : {}).catch(() => ({})),
    ]).then(([maths, english, vr]) => {
      setQuestionMappings({ maths, english, vr });
    });
  }, []);

  // Welcome Back: check if 2+ days since last session
  useEffect(() => {
    if (!currentUser || welcomeBackChecked.current) return;
    welcomeBackChecked.current = true;

    const lastDate = userData.lastSessionDate;
    if (!lastDate) {
      // First ever session — just set the date, no welcome back
      userData.saveLastSessionDate(new Date().toISOString());
      return;
    }
    const daysSince = (Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 2) {
      userData.saveLastSessionDate(new Date().toISOString());
      return;
    }
    // 2+ days away: find a tip to resurface
    const tip = selectWelcomeBackTip(allTips, userData.seenTips, topicPerformance);
    if (tip) {
      setWelcomeBackTip(tip);
      setShowWelcomeBack(true);
    } else {
      userData.saveLastSessionDate(new Date().toISOString());
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveQuizResult = (subject, topic, score, total) => {
    const newResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      subject,
      topic,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      sessionId: quizSessionId.current, // correlates this quiz with its question_results rows
    };
    userData.saveQuizResult(newResult);
    // Cache for ResultsScreen → QuizDetailScreen review jump
    setLastCompletedQuiz(newResult);
  };

  // Find the lesson that teaches a given question, callable from anywhere
  // that has the question + topicKey (live quiz uses this via handleFindLesson;
  // review uses it via handleReviewFindLesson, no quiz round-trip).
  const navigateToLessonFor = (question, topicKey) => {
    if (!question || !topicKey) return false;
    const englishTopics = ['spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar', 'comprehension'];
    const vrTopics = ['hiddenWords', 'letterCodes', 'letterMove', 'letterPairSeries', 'letterSums', 'logicAndLanguage', 'missingLettersWords', 'numberSeries', 'numberWordCodes', 'oddTwoOut', 'sharedLetter', 'verbalAnalogies', 'wordCodeAnalogies', 'compoundWords', 'antonyms', 'synonyms', 'balanceEquations'];
    let mappingSource = 'maths';
    if (englishTopics.includes(topicKey)) mappingSource = 'english';
    if (vrTopics.includes(topicKey)) mappingSource = 'vr';

    const topicMappings = questionMappings[mappingSource]?.[topicKey];
    if (!topicMappings) return false;
    const entries = Array.isArray(topicMappings) ? topicMappings : Object.values(topicMappings);
    const mapping = entries.find(e => e.questionId === question.id);
    if (!mapping || !mapping.subConceptId) return false;

    const topicLessons = lessonBank[topicKey];
    if (!topicLessons) return false;
    const allSubConcepts = topicLessons.subConcepts || [];
    const subConcept = allSubConcepts.find(sc => sc.id === mapping.subConceptId);
    if (!subConcept || !subConcept.lessons || subConcept.lessons.length === 0) return false;

    const teachingLesson = subConcept.lessons.find(l => l.templateType === 'step-by-step') || subConcept.lessons[0];
    if (!teachingLesson || !teachingLesson.variableSets || teachingLesson.variableSets.length === 0) return false;

    const varSet = teachingLesson.variableSets[Math.floor(Math.random() * teachingLesson.variableSets.length)];
    const interactVarSet = teachingLesson.variableSets.length > 1
      ? teachingLesson.variableSets.find(v => v !== varSet) || varSet
      : varSet;

    setForcedLessonResult({
      lesson: teachingLesson,
      variables: varSet,
      interactVariables: interactVarSet,
      subConceptId: mapping.subConceptId,
      subConceptName: subConcept.name || mapping.subConceptId,
      topicName: topicLessons.name || topicKey,
    });
    setCurrentView('lesson');
    return true;
  };

  // Called from ResultsScreen "Review questions" button.
  const handleReviewQuiz = () => {
    if (!lastCompletedQuiz) return;
    setSelectedQuiz(lastCompletedQuiz);
    setQuizDetailReturnTo('results');
    setCurrentView('quizDetail');
  };

  // Find Me a Lesson from inside the review screen — no quiz round-trip,
  // user can use Back to return.
  const handleReviewFindLesson = (question, topicKey) => {
    navigateToLessonFor(question, topicKey);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setCurrentView('learningMode');
  };

  const selectChallengeQuestions = () => {
    const topics = questionData[selectedSubject].topics;
    // Only pick from exam-ready topics
    const eligibleKeys = Object.keys(topics).filter(key => {
      const m = mastery.getTopicMastery(key);
      return m.band === 'exam-ready' || m.band === 'excelling';
    });
    const topicKeys = shuffleArray(eligibleKeys).slice(0, 10);
    const selected = [];
    topicKeys.forEach(key => {
      const question = pickQuestionAtDifficulty(topics[key].questions, seenQuestions[key] || [], 3);
      selected.push({ question, topicKey: key, topicName: topics[key].name });
    });
    return shuffleArray(selected);
  };

  const handleChallengeMode = () => {
    const selected = selectChallengeQuestions();
    if (selected.length === 0) return;
    setQuizQuestions(selected);
    setQuizMode('challenge');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSavedTimerSecs(0);
    questionStartTime.current = Date.now(); pausedTimeMs.current = 0; pauseStartTime.current = null;    quizSessionId.current = Date.now();
    wrongAnswerCount.current = 0;
    sessionShownTipIds.current = new Set();
    setPostQuestionTip(null);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
    setCurrentView('quiz');
  };

  const handleStartDaily = () => {
    const selected = selectDailyQuestions();
    setQuizQuestions(selected);
    setQuizMode('daily');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSavedTimerSecs(0);
    questionStartTime.current = Date.now(); pausedTimeMs.current = 0; pauseStartTime.current = null;    quizSessionId.current = Date.now();
    wrongAnswerCount.current = 0;
    sessionShownTipIds.current = new Set();
    setPostQuestionTip(null);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
    // Pre-quiz tip for Daily: general strategy tip
    const tip = selectPreQuizTip('daily', null, allTips, userData.seenTips);
    setPreQuizTip(tip);
    setShowPreQuizTip(!!tip);
    setCurrentView('quiz');
  };

  // Begin a fresh Focused quiz — the original body of handleTopicSelect
  // before the resume-prompt check was added.
  const beginFocusedQuiz = (topic, activeSubject) => {
    setSelectedTopic(topic);
    const selected = selectFocusedQuestions(topic, activeSubject);
    setQuizQuestions(selected);
    setQuizMode('focused');
    setCurrentQuestionIndex(0);
    setSavedTimerSecs(0);
    setAnswers([]);
    questionStartTime.current = Date.now(); pausedTimeMs.current = 0; pauseStartTime.current = null;
    quizSessionId.current = Date.now();
    wrongAnswerCount.current = 0;
    sessionShownTipIds.current = new Set();
    setPostQuestionTip(null);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
    setForcedLessonResult(null);

    if (activeSubject === 'maths' || activeSubject === 'english' || activeSubject === 'verbalreasoning') {
      setCurrentView('lesson');
    } else {
      setCurrentView('quiz');
    }
  };

  const handleTopicSelect = (topic, subject) => {
    const activeSubject = subject || selectedSubject;
    // If there's an in-progress Focused quiz for this exact topic+subject,
    // prompt before overwriting. Different topic / mode silently overwrites
    // (handleTopicSelect starts a new save).
    if (quizSaveKey) {
      const saved = parseAndValidateQuiz(localStorage.getItem(quizSaveKey));
      if (saved && saved.quizMode === 'focused'
          && saved.selectedTopic === topic
          && saved.selectedSubject === activeSubject) {
        setResumePrompt({ savedState: saved, pendingTopic: { topic, subject: activeSubject } });
        return;
      }
    }
    beginFocusedQuiz(topic, activeSubject);
  };

  // Restore a saved quiz straight back into the quiz view.
  const resumeSavedQuiz = (savedState) => {
    setSelectedSubject(savedState.selectedSubject);
    setSelectedTopic(savedState.selectedTopic);
    setQuizMode(savedState.quizMode);
    setQuizQuestions(savedState.quizQuestions);
    setCurrentQuestionIndex(savedState.currentQuestionIndex);
    setAnswers(savedState.answers);
    setSelectedAnswer(savedState.selectedAnswer);
    setSelectedPair(savedState.selectedPair);
    setShowFeedback(savedState.showFeedback);
    quizSessionId.current = savedState.sessionId;
    questionStartTime.current = Date.now();
    pausedTimeMs.current = 0;
    pauseStartTime.current = null;
    setCurrentView('quiz');
    setResumePrompt(null);
  };

  const startFreshFromPrompt = () => {
    if (quizSaveKey) localStorage.removeItem(quizSaveKey);
    const pending = resumePrompt?.pendingTopic;
    setResumePrompt(null);
    if (pending) beginFocusedQuiz(pending.topic, pending.subject);
  };

  const handleAnswerSelect = (optionIndex) => {
    if (showFeedback) return;
    setSelectedAnswer(optionIndex);
  };

  // For 'select-two' questions: toggle selection of an option (max 2)
  const handleSelectTwoToggle = (idx) => {
    if (showFeedback) return;
    setSelectedPair(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (prev.length >= 2) return prev;
      return [...prev, idx];
    });
  };

  // For 'pick-from-sets' questions: select one from a specific set
  const handlePickFromSet = (setName, idx) => {
    if (showFeedback) return;
    setSelectedPair(prev => {
      const newPair = [...prev];
      if (setName === 'A') newPair[0] = idx;
      else newPair[1] = idx;
      return newPair;
    });
  };

  const handleCheckAnswer = () => {
    const currentQ = quizQuestions[currentQuestionIndex];
    const currentQuestion = currentQ.question;

    // For dual-answer types, check selectedPair instead of selectedAnswer
    if (currentQuestion.questionType === 'select-two' || currentQuestion.questionType === 'pick-from-sets') {
      if (currentQuestion.questionType === 'select-two' && selectedPair.length !== 2) return;
      if (currentQuestion.questionType === 'pick-from-sets' && (selectedPair[0] === undefined || selectedPair[1] === undefined)) return;
    } else {
      if (selectedAnswer === null) return;
    }

    setShowFeedback(true);

    const isCorrect = checkAnswerCorrectness(currentQuestion, selectedAnswer, selectedPair);

    // Subtract time spent in lessons/tutor so children aren't penalised for learning
    if (pauseStartTime.current) {
      pausedTimeMs.current += Date.now() - pauseStartTime.current;
      pauseStartTime.current = null;
    }
    const rawTimeMs = Date.now() - questionStartTime.current - pausedTimeMs.current;
    const timeSpentMs = rawTimeMs > 300000 ? 0 : Math.max(0, rawTimeMs); // Cap at 5 mins
    setAnswers([...answers, {
      questionId: currentQuestion.id,
      correct: isCorrect,
      timeSpentMs,
      difficulty: currentQuestion.difficulty || 2,
      // Capture raw selection for Quiz Detail View (normalised downstream per question type)
      selectedAnswer,
      selectedPair: [...selectedPair],
    }]);

    // Testing mode: skip tips, adaptive difficulty, and Leitner — just record the answer
    if (quizMode === 'testing') return;

    // Post-question tip: show ~every 3rd wrong answer
    if (!isCorrect) {
      wrongAnswerCount.current += 1;
      if (shouldShowPostQuestionTip(wrongAnswerCount.current)) {
        const tip = selectPostQuestionTip(currentQ.topicKey, allTips, sessionShownTipIds.current, userData.seenTips);
        if (tip) {
          sessionShownTipIds.current.add(tip.id);
          setPostQuestionTip(tip);
        } else {
          setPostQuestionTip(null);
        }
      } else {
        setPostQuestionTip(null);
      }
    } else {
      setPostQuestionTip(null);
    }

    // Adaptive difficulty: swap next question to match performance (skip for mock tests)
    if (quizMode === 'daily' || quizMode === 'focused') {
      const nextIdx = currentQuestionIndex + 1;
      if (nextIdx < quizQuestions.length) {
        const recentResults = [...answers, { correct: isCorrect, difficulty: currentQuestion.difficulty || 2 }]
          .map(a => ({ correct: a.correct, difficulty: a.difficulty || 2 }));
        const currentDiff = currentQuestion.difficulty || 2;
        const targetDiff = getAdaptiveDifficulty(recentResults, currentDiff);

        // Only swap if target differs from what's already queued
        const nextQ = quizQuestions[nextIdx];
        const nextDiff = nextQ.question.difficulty || 2;
        if (targetDiff !== nextDiff) {
          const topicKey = nextQ.topicKey;
          const topicQuestions = questionData[selectedSubject]?.topics?.[topicKey]?.questions ||
            englishData?.topics?.[topicKey]?.questions ||
            vrData?.topics?.[topicKey]?.questions || [];
          const currentQuizIds = quizQuestions.map(q => q.question.id);
          const replacement = pickQuestionAtDifficulty(topicQuestions, seenQuestions[topicKey] || [], targetDiff, currentQuizIds);
          if (replacement && replacement.id !== nextQ.question.id) {
            const updated = [...quizQuestions];
            updated[nextIdx] = { ...nextQ, question: replacement };
            setQuizQuestions(updated);
          }
        }
      }
    }

    // Leitner queue: add wrong answers, promote correct ones
    if (quizMode === 'daily' || quizMode === 'focused') {
      if (!isCorrect) {
        leitner.addToQueue(currentQuestion.id, currentQ.topicKey, selectedSubject);
      } else if (leitner.isInQueue(currentQuestion.id, currentQ.topicKey)) {
        leitner.promoteQuestion(currentQuestion.id, currentQ.topicKey);
      }
    }
  };

  const handleNextQuestion = async () => {
    // Reset timer for next question
    questionStartTime.current = Date.now(); pausedTimeMs.current = 0; pauseStartTime.current = null;    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setSelectedPair([]);
      setShowFeedback(false);
      setShowTutorChat(false);
      setChatMessages([]);
      setShowFeedbackForm(false);
      setFeedbackText('');
    } else {
      // Testing mode: mark questions as tested, skip all normal progress recording
      if (quizMode === 'testing') {
        quizQuestions.forEach(q => testingCoverage.markQuestionTested(q.topicKey, q.question.id));
        // Single-question view (from flagged issues): go back to dashboard
        if (returnToTestingMode) {
          setReturnToTestingMode(false);
          setCurrentView('testingMode');
        } else {
          setCurrentView('testingResults');
        }
        return;
      }
      // If viewing a single question from Speed Review, go back instead of showing results
      if (returnToSpeedReview) {
        setCurrentView('speedReview');
        setReturnToSpeedReview(false);
        window.scrollTo(0, speedReviewScrollY);
        return;
      }
      // Re-entry guard (Codex Fix E): prevents duplicate quiz_results when
      // handleNextQuestion fires twice (rapid double-click, StrictMode remount,
      // or any async re-entry between the first call's saves and its setCurrentView).
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      try {
        const correctCount = answers.filter(a => a.correct).length;
        markQuestionsAsSeen(quizQuestions);
        updateTopicPerformance(quizQuestions, answers);
        // Atomic batch: per-question rows, quiz row, streak, PP, practice session, last-session-date
        // all commit together or not at all.
        userData.startBatch();
        try {
          recordQuizResults(quizQuestions, answers);
          // Codex Fix B: store slug in quiz_results.topic_key (not the display
          // name) so the column aligns with question_results.topic_key.
          const topicLabel = quizMode === 'daily' ? 'daily-learning' : quizQuestions[0].topicKey;
          saveQuizResult(selectedSubject, topicLabel, correctCount, quizQuestions.length);
          userData.saveLastSessionDate(new Date().toISOString());
        } finally {
          await userData.endBatch();
        }
        // Quiz finished — drop the in-progress save so a later reload
        // doesn't auto-restore the completed quiz.
        if (quizSaveKey) localStorage.removeItem(quizSaveKey);

        // Auto-complete assigned topic if this quiz matches an active assignment
        if (activeAssignment && quizMode === 'focused' && activeAssignment.topic === quizQuestions[0]?.topicKey) {
          const questionResults = answers.map((a, i) => ({
            questionId: quizQuestions[i]?.question?.id,
            correct: a.correct,
            selectedIndex: a.selectedIndex,
          }));
          getToken().then(token =>
            fetch(`${process.env.REACT_APP_TUTOR_API_URL}/api/pupil/assignments/${activeAssignment.recipientId}/complete`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ score: quizQuestions.length > 0 ? Math.round((correctCount / quizQuestions.length) * 100) : 0, questionResults }),
            })
          ).catch(() => {});
          setActiveAssignment(null);
        }

        setCurrentView('results');
      } finally {
        isSubmittingRef.current = false;
      }
    }
  };

  const handleDismissPreQuizTip = () => {
    if (preQuizTip) userData.markTipSeen(preQuizTip.id);
    setShowPreQuizTip(false);
    setPreQuizTip(null);
  };

  const handleRetry = () => {
    // Generate fresh questions for a new session
    if (quizMode === 'daily') {
      setQuizQuestions(selectDailyQuestions());
    } else if (quizMode === 'focused' && selectedTopic) {
      setQuizQuestions(selectFocusedQuestions(selectedTopic));
    }
    setCurrentQuestionIndex(0);
    setAnswers([]);
    wrongAnswerCount.current = 0;
    sessionShownTipIds.current = new Set();
    setPostQuestionTip(null);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
    setCurrentView('quiz');
  };

  const handleHome = () => {
    setCurrentView('home');
    setSelectedSubject(null);
    setSelectedTopic(null);
    setQuizMode(null);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
  };

  const submitQuestionFeedback = () => {
    if (!feedbackText.trim()) return;
    const currentQ = quizQuestions[currentQuestionIndex];
    const now = new Date().toISOString();
    const entry = {
      id: Date.now(),
      date: now,
      submitter: currentUser || 'Unknown',
      topicKey: currentQ.topicKey,
      topicName: currentQ.topicName,
      questionId: currentQ.question.id,
      questionText: currentQ.question.question,
      feedback: feedbackText.trim()
    };
    const updated = [...questionFeedback, entry];
    setQuestionFeedback(updated);
    localStorage.setItem('question-feedback', JSON.stringify(updated));
    // Fire-and-forget Netlify POST
    submitToGoogleSheet({
      submitter: currentUser || 'Unknown',
      type: 'question',
      topicKey: currentQ.topicKey,
      topicName: currentQ.topicName,
      questionId: String(currentQ.question.id),
      questionText: currentQ.question.question,
      feedback: feedbackText.trim(),
      date: now
    });
    setFeedbackText('');
    setShowFeedbackForm(false);
  };

  // "Find Me a Lesson" — look up the question's mapped lesson and launch it
  // Launch a lesson from the Study Toolkit lesson browser
  const handleToolkitLessonLaunch = (topicKey, subConceptId, lesson) => {
    // Build forced lesson result similar to handleFindLesson
    const topicLessons = lessonBank[topicKey];
    if (!topicLessons) return;

    const subConcept = topicLessons.subConcepts.find(sc => sc.id === subConceptId);
    if (!subConcept || !lesson) return;

    // Pick variable sets
    const variableSets = lesson.variableSets || [];
    const mainIdx = Math.floor(Math.random() * variableSets.length);
    let interactIdx = mainIdx;
    if (variableSets.length > 1) {
      do { interactIdx = Math.floor(Math.random() * variableSets.length); } while (interactIdx === mainIdx);
    }

    setForcedLessonResult({
      lesson,
      variables: variableSets[mainIdx],
      interactVariables: variableSets[interactIdx],
      subConceptId,
      topicName: topicLessons.name,
    });
    setSelectedTopic(topicKey);
    setReturnToToolkit(true);
    toolkitLessonsViewed.current += 1;
    setCurrentView('lesson');
  };

  const handleFindLesson = () => {
    // Pause the question timer — don't penalise children for using learning tools
    pauseStartTime.current = Date.now();
    const currentQ = quizQuestions[currentQuestionIndex];
    const topicKey = currentQ.topicKey || selectedTopic;
    const questionId = currentQ.question.id;

    // Determine which mapping file to use
    const englishTopics = ['spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar', 'comprehension'];
    const vrTopics = ['hiddenWords', 'letterCodes', 'letterMove', 'letterPairSeries', 'letterSums', 'logicAndLanguage', 'missingLettersWords', 'numberSeries', 'numberWordCodes', 'oddTwoOut', 'sharedLetter', 'verbalAnalogies', 'wordCodeAnalogies', 'compoundWords', 'antonyms', 'synonyms', 'balanceEquations'];
    let mappingSource = 'maths';
    if (englishTopics.includes(topicKey)) mappingSource = 'english';
    if (vrTopics.includes(topicKey)) mappingSource = 'vr';

    const topicMappings = questionMappings[mappingSource]?.[topicKey];
    if (!topicMappings) return;

    // Find the mapping entry for this question ID
    const entries = Array.isArray(topicMappings) ? topicMappings : Object.values(topicMappings);
    const mapping = entries.find(e => e.questionId === questionId);
    if (!mapping || !mapping.subConceptId) return;

    // Find the lesson in lessonBank
    const topicLessons = lessonBank[topicKey];
    if (!topicLessons) return;

    // Search both master lessonBank and testSubConceptBank for the sub-concept
    const allSubConcepts = topicLessons.subConcepts || [];
    const subConcept = allSubConcepts.find(sc => sc.id === mapping.subConceptId);
    if (!subConcept || !subConcept.lessons || subConcept.lessons.length === 0) return;

    // Pick the teaching lesson (step-by-step, which is usually lesson A / index 0)
    const teachingLesson = subConcept.lessons.find(l => l.templateType === 'step-by-step') || subConcept.lessons[0];
    if (!teachingLesson || !teachingLesson.variableSets || teachingLesson.variableSets.length === 0) return;

    // Pick variable sets
    const varSet = teachingLesson.variableSets[Math.floor(Math.random() * teachingLesson.variableSets.length)];
    const interactVarSet = teachingLesson.variableSets.length > 1
      ? teachingLesson.variableSets.find(v => v !== varSet) || varSet
      : varSet;

    // Save quiz state so we can return
    setLessonFromQuiz({
      topicKey,
      questionId,
      subConceptId: mapping.subConceptId,
      subConceptName: subConcept.name || mapping.subConceptId,
    });

    // Launch the lesson via forcedLessonResult
    setForcedLessonResult({
      lesson: teachingLesson,
      variables: varSet,
      interactVariables: interactVarSet,
      subConceptId: mapping.subConceptId,
      subConceptName: subConcept.name || mapping.subConceptId,
      topicName: topicLessons.name || topicKey,
    });

    setCurrentView('lesson');
  };

  const handleAskTutor = () => {
    // Pause the question timer — don't penalise children for using learning tools
    if (!pauseStartTime.current) pauseStartTime.current = Date.now();
    setShowTutorChat(true);
    if (chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: "Hi! I'm your AI tutor. 😊 I'm here to help you understand this question better. What part would you like me to explain more?"
      }]);
    }
  };

  // Speech-to-text — works for AI Tutor chat and Report Issue form
  const toggleListening = (targetSetter) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const setter = targetSetter || setUserMessage;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setter(prev => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  const speechSupported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isAiThinking) return;

    const currentQuestion = quizQuestions[currentQuestionIndex].question;
    
    const newUserMessage = { role: 'user', content: userMessage };
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setUserMessage('');
    setIsAiThinking(true);

    try {
      const tutorApiUrl = process.env.REACT_APP_TUTOR_API_URL;
      if (!tutorApiUrl) {
        throw new Error('Tutor API URL not configured');
      }

      // Build question context — handle both standard (options/correct) and VR (setA/setB/correctPair) formats
      let questionContext;
      if (currentQuestion.options) {
        const optionsList = currentQuestion.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join(', ');
        const correctAns = `${String.fromCharCode(65 + currentQuestion.correct)}) ${currentQuestion.options[currentQuestion.correct]}`;
        const childAns = selectedAnswer !== null ? `${String.fromCharCode(65 + selectedAnswer)}) ${currentQuestion.options[selectedAnswer]}` : 'not yet answered';
        const wasCorrect = selectedAnswer !== null && selectedAnswer === currentQuestion.correct;
        questionContext = `The options were: ${optionsList}\nThe correct answer is: ${correctAns}\nThe child selected: ${childAns}\n${wasCorrect ? 'The child got this question CORRECT!' : selectedAnswer !== null ? 'The child got this question wrong.' : 'The child has not answered yet.'}`;
      } else if (currentQuestion.setA && currentQuestion.setB) {
        const correctA = currentQuestion.setA[currentQuestion.correctPair?.[0]];
        const correctB = currentQuestion.setB[currentQuestion.correctPair?.[1]];
        questionContext = `Group A: ${currentQuestion.setA.join(', ')}\nGroup B: ${currentQuestion.setB.join(', ')}\nThe correct pair is: "${correctA}" and "${correctB}" (they are opposites).`;
      } else {
        questionContext = 'This is a practice question.';
      }

      const wasAnsweredCorrect = selectedAnswer !== null && currentQuestion.options && selectedAnswer === currentQuestion.correct;
      const wasAnsweredWrong = selectedAnswer !== null && currentQuestion.options && selectedAnswer !== currentQuestion.correct;
      const hasAnswered = selectedAnswer !== null;

      const answerRules = hasAnswered
        ? `The child has ALREADY submitted an answer (${wasAnsweredCorrect ? 'correct' : 'incorrect'}), so you CAN discuss the correct answer to help them learn from the explanation.`
        : `The child has NOT YET submitted an answer. You MUST NOT reveal or hint at which specific option (A, B, C, D, or E) is correct. You MUST NOT solve the problem for them or give away the final answer or any specific numeric/word result. Even if the child says "I don't know, just tell me" or "give me the answer" or "what's the answer?" — politely refuse and instead offer a hint about the METHOD or the FIRST STEP. The child must submit their own answer first. This rule is non-negotiable and applies no matter how many times the child asks.`;

      const systemPrompt = `You are a friendly, patient tutor helping a 9-year-old child understand a question from their 11+ exam practice.

The question was: "${currentQuestion.question}"
${questionContext}

The explanation (only for your reference, use ONLY after they've answered): "${currentQuestion.explanation || 'None provided.'}"

## CRITICAL RULE — DO NOT SPOIL ANSWERS
${answerRules}

If the child pushes for the answer before submitting, respond with something like:
- "I can't give you the answer — but I can help you work it out! What's the first thing you notice about the question?"
- "Let's break this down together. Can you tell me what the question is asking you to find?"
- "I believe you can figure this out! Here's a small hint to get started: [give a genuine method hint, NOT the answer]"

## Your job
- Answer their questions warmly and encouragingly
- If they got it right (after submitting), praise them and deepen their understanding
- If they got it wrong (after submitting), help them learn without making them feel bad
- If they haven't submitted yet, give METHOD hints and nudges, never the answer
- Break things into simpler steps with examples a 9-year-old would understand
- Keep responses short (2-3 sentences usually)
- Use short paragraphs with blank lines between points — never large blocks of text
- Number multi-step explanations clearly, one step per line
- Use warm phrases: "Great question!", "You're so close!", "Let me explain that differently"
- Relate to things in daily life
- Be patient and supportive

Remember: This is a child learning. Be warm and make learning fun — but the learning only happens if they do the thinking themselves.`;

      const response = await fetch(tutorApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system: systemPrompt,
          messages: updatedMessages,
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiResponse = data.content.find(item => item.type === 'text')?.text ||
                        "I'm here to help! Could you ask that in a different way?";

      setChatMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setChatMessages([...updatedMessages, {
        role: 'assistant',
        content: "Oops! I had trouble connecting. Could you try asking again?"
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // --- Question Selection Functions ---

  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const pickQuestionAtDifficulty = (questions, seenIds, targetDifficulty, excludeIds = []) => {
    // Filter out broken questions and any already in the current quiz
    const valid = questions.filter(q =>
      !(q.questionType === 'passage' && !q.passage) && !excludeIds.includes(q.id)
    );
    // Try to find an unseen question at the target difficulty
    let pool = valid.filter(q => q.difficulty === targetDifficulty && !seenIds.includes(q.id));
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    // Fallback: any unseen question
    pool = valid.filter(q => !seenIds.includes(q.id));
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    // All seen: pick any at target difficulty
    pool = valid.filter(q => q.difficulty === targetDifficulty);
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    // Last resort: any valid question
    return valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : questions[0];
  };

  const selectDailyQuestions = () => {
    const topics = questionData[selectedSubject].topics;
    const selected = [];
    const updatedSeen = { ...seenQuestions };
    const usedQuestionIds = new Set();

    // Leitner: fill up to 3 slots with due review questions
    const dueEntries = getDueQuestions(userData.leitnerQueue, selectedSubject, 3);
    dueEntries.forEach(entry => {
      const topicQuestions = topics[entry.topicKey]?.questions || [];
      const question = topicQuestions.find(q => q.id === entry.questionId);
      if (question && !usedQuestionIds.has(`${entry.topicKey}-${question.id}`)) {
        selected.push({ question, topicKey: entry.topicKey, topicName: topics[entry.topicKey]?.name || entry.topicKey });
        usedQuestionIds.add(`${entry.topicKey}-${question.id}`);
      }
    });

    // Fill remaining slots with mastery-weighted topic selection
    const remainingCount = 10 - selected.length;
    const topicKeys = selectWeightedTopics(Object.keys(topics), mastery, remainingCount + 3); // pick extras in case of overlap
    const diffTargets = shuffleArray([1,1,1, 2,2,2,2, 3,3,3]);

    let filled = 0;
    for (let i = 0; i < topicKeys.length && filled < remainingCount; i++) {
      const key = topicKeys[i];
      const topicQuestions = topics[key].questions;
      const seenIds = updatedSeen[key] || [];
      const unseenCount = topicQuestions.filter(q => !seenIds.includes(q.id)).length;
      if (unseenCount < 1) {
        updatedSeen[key] = [];
      }
      const question = pickQuestionAtDifficulty(topicQuestions, updatedSeen[key] || [], diffTargets[filled] || 2);
      if (!usedQuestionIds.has(`${key}-${question.id}`)) {
        selected.push({ question, topicKey: key, topicName: topics[key].name });
        usedQuestionIds.add(`${key}-${question.id}`);
        filled++;
      }
    }

    // Ensure we always return exactly 10 questions
    if (selected.length < 10) {
      const allTopicKeys = Object.keys(topics);
      for (const key of shuffleArray(allTopicKeys)) {
        if (selected.length >= 10) break;
        const topicQuestions = topics[key].questions;
        const question = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
        if (!usedQuestionIds.has(`${key}-${question.id}`)) {
          selected.push({ question, topicKey: key, topicName: topics[key].name });
          usedQuestionIds.add(`${key}-${question.id}`);
        }
      }
    }

    return shuffleArray(selected).slice(0, 10);
  };

  const selectFocusedQuestions = (topicKey, subject) => {
    const activeSubject = subject || selectedSubject;
    const topics = questionData[activeSubject].topics;
    const topicQuestions = topics[topicKey].questions;
    const topicName = topics[topicKey].name;
    const updatedSeen = { ...seenQuestions };
    let seenIds = updatedSeen[topicKey] || [];

    // Passage-based comprehension: select by passage groups
    const hasPassages = topicQuestions.some(q => q.passageId);
    if (hasPassages) {
      // Group questions by passageId
      const passageGroups = {};
      topicQuestions.forEach(q => {
        if (!passageGroups[q.passageId]) passageGroups[q.passageId] = [];
        passageGroups[q.passageId].push(q);
      });
      const passageIds = Object.keys(passageGroups);
      // Pick passages until we have ~10 questions
      const shuffledPassages = shuffleArray([...passageIds]);
      const selected = [];
      for (const pid of shuffledPassages) {
        if (selected.length >= 10) break;
        passageGroups[pid].forEach(q => {
          selected.push({ question: q, topicKey, topicName });
        });
      }
      // Return in passage order (don't shuffle — questions follow the passage)
      return selected.slice(0, 10);
    }

    // Reset if fewer than 10 unseen remain
    const unseenCount = topicQuestions.filter(q => !seenIds.includes(q.id)).length;
    if (unseenCount < 10) {
      updatedSeen[topicKey] = [];
      seenIds = [];
    }

    // Difficulty targets: 3 easy, 4 medium, 3 hard
    const diffTargets = [1,1,1, 2,2,2,2, 3,3,3];
    const selected = [];
    const usedIds = [];

    diffTargets.forEach(diff => {
      let pool = topicQuestions.filter(q => q.difficulty === diff && !seenIds.includes(q.id) && !usedIds.includes(q.id));
      if (pool.length === 0) {
        pool = topicQuestions.filter(q => !seenIds.includes(q.id) && !usedIds.includes(q.id));
      }
      if (pool.length === 0) {
        pool = topicQuestions.filter(q => !usedIds.includes(q.id));
      }
      if (pool.length > 0) {
        const question = pool[Math.floor(Math.random() * pool.length)];
        selected.push({ question, topicKey, topicName });
        usedIds.push(question.id);
      }
    });

    return shuffleArray(selected);
  };

  // ── Testing Mode question selection ──
  // Random selection, prioritising untested questions. No adaptive difficulty.
  const selectTestingQuestions = (topicKey, subject) => {
    const activeSubject = subject || selectedSubject;
    const topics = questionData[activeSubject]?.topics;
    if (!topics || !topics[topicKey]) return [];
    const topicQuestions = topics[topicKey].questions;
    const topicName = topics[topicKey].name;
    const testedIds = testingCoverage.data.questions[topicKey]?.tested || [];

    // Prefer untested questions; backfill from all if <10 untested remain
    let pool = topicQuestions.filter(q => !testedIds.includes(q.id));
    if (pool.length < 10) {
      const extra = topicQuestions.filter(q => testedIds.includes(q.id));
      pool = [...pool, ...shuffleArray(extra)];
    }
    return shuffleArray(pool).slice(0, 10).map(q => ({ question: q, topicKey, topicName }));
  };

  const handleStartTestingQuiz = (topicKey, subject) => {
    const questions = selectTestingQuestions(topicKey, subject);
    if (questions.length === 0) return;
    setSelectedSubject(subject);
    setSelectedTopic(topicKey);
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setAnswers([]);
    setShowTutorChat(false);
    setChatMessages([]);
    setTestingSessionFlags([]);
    setQuizMode('testing');
    setCurrentView('quiz');
    quizSessionId.current = Date.now();
    questionStartTime.current = Date.now();
    pausedTimeMs.current = 0;
    pauseStartTime.current = null;
    wrongAnswerCount.current = 0;
  };

  const markQuestionsAsSeen = (questions) => {
    const updatedSeen = { ...seenQuestions };
    questions.forEach(({ question, topicKey }) => {
      if (!updatedSeen[topicKey]) updatedSeen[topicKey] = [];
      if (!updatedSeen[topicKey].includes(question.id)) {
        updatedSeen[topicKey].push(question.id);
      }
    });
    userData.saveSeenQuestions(updatedSeen);
  };

  const updateTopicPerformance = (sessionQuestions, sessionAnswers) => {
    const updated = { ...topicPerformance };
    sessionQuestions.forEach((q, i) => {
      const key = q.topicKey;
      if (!updated[key]) updated[key] = { correct: 0, total: 0 };
      updated[key].total += 1;
      if (sessionAnswers[i]?.correct) updated[key].correct += 1;
    });
    userData.saveTopicPerformance(updated);
  };

  // Save per-question results and update streaks/PP after quiz completion.
  // NOTE: Caller (handleNextQuestion) opens/closes the batch. This function
  // only enqueues — it does NOT manage batch lifecycle. This ensures the
  // quiz row + per-question rows commit atomically.
  const recordQuizResults = (sessionQuestions, sessionAnswers) => {
    recordQuizResultsOrch(sessionQuestions, sessionAnswers, {
      userData, streaksAndPP, selectedSubject, quizMode,
      selectedTopic, topicPerformance, sessionId: quizSessionId.current,
    });
  };

  // ── Dev Navigation ──
  // Direct URL access to any view for fast visual QA:
  //   ?view=home | progress | progress-parent | topicDrillDown&subject=maths&topic=fractions
  //   ?preview=anglesshapes&q=65 (existing question preview)
  const urlParams = new URLSearchParams(window.location.search);
  const urlViewParam = urlParams.get('view');
  const devNavDone = React.useRef(false);
  useEffect(() => {
    if (devNavDone.current || !urlViewParam) return;
    devNavDone.current = true;
    const urlSubject = urlParams.get('subject');
    const urlTopic = urlParams.get('topic');
    if (urlViewParam === 'progress' || urlViewParam === 'progress-parent') {
      setCurrentView('progress');
    } else if (urlViewParam === 'topicDrillDown' && urlSubject && urlTopic) {
      setDrillDownTopic({ subject: urlSubject, topicKey: urlTopic });
      setCurrentView('topicDrillDown');
    } else if (urlViewParam === 'learningMode' && urlSubject) {
      setSelectedSubject(urlSubject);
      setCurrentView('learningMode');
    } else if (urlViewParam === 'home') {
      setCurrentView('home');
    } else if (urlViewParam === 'errors') {
      setCurrentView('errors');
    } else if (urlViewParam === 'flags') {
      setCurrentView('flags');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const previewTopic = urlParams.get('preview');
  const previewQId = parseInt(urlParams.get('q'), 10);
  if (previewTopic && previewQId) {
    // Find the question across all subjects
    let found = null;
    let subjectName = urlParams.get('subject') || 'auto';
    const allSources = [
      { data: questionData.maths?.topics, label: 'Maths' },
      { data: englishData.topics, label: 'English' },
      { data: vrData.topics, label: 'VR' },
    ];
    for (const src of allSources) {
      if (src.data?.[previewTopic]) {
        const q = src.data[previewTopic].questions.find(q => q.id === previewQId);
        if (q) { found = q; subjectName = src.label; break; }
      }
    }
    if (found) {
      const Comp = found.visual ? quizVisualComponents[found.visual.component] : null;
      return (
        <div className="app-bg p-6 min-h-screen">
          <div className="max-w-2xl mx-auto">
            <div className="text-xs text-slate-500 mb-2">{subjectName} › {previewTopic} › Q{previewQId} (D{found.difficulty})</div>
            <div className="card-elevated p-6">
              {/* Alphabet line for letter code questions in preview mode */}
              {(previewTopic === 'letterCodes' || previewTopic === 'letterPairSeries' || previewTopic === 'letterSums' || found.questionType === 'letter-codes') && (
                <div className="mb-4 px-2 py-3 bg-gradient-to-r from-[#EDE8FF] to-[#DFF6FF] border border-[#A29BFE]/30 rounded-xl text-center">
                  <div className="text-[9px] text-[#7C3AED] mb-1.5 font-bold uppercase tracking-widest">
                    {previewTopic === 'letterCodes' || found.questionType === 'letter-codes'
                      ? 'Work out the pattern from the example, then apply it to the new word'
                      : 'Use this alphabet to help you'}
                  </div>
                  <div className="flex justify-center">
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => (
                      <div key={letter} className="flex flex-col items-center" style={{width: 'calc(100% / 26)'}}>
                        <span className={`text-xs sm:text-sm font-mono font-bold py-0.5 rounded ${i % 5 === 4 ? 'text-[#7C3AED]' : 'text-slate-800'}`}>{letter}</span>
                        <span className={`text-[7px] sm:text-[8px] font-mono ${i % 5 === 4 ? 'text-[#7C3AED] font-bold' : 'text-gray-400'}`}>{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Visual component */}
              {Comp && (
                <div className="mb-6 p-4 rounded-xl bg-white border border-gray-200">
                  <Comp {...found.visual.props} />
                </div>
              )}
              {/* SVG image fallback */}
              {found.image && !found.visual && (
                <div className="mb-6 flex justify-center">
                  <img src={`/images/questions/${found.image}`} alt="diagram" className="max-w-full rounded-lg border-2 border-gray-200" style={{ maxHeight: 400 }} />
                </div>
              )}
              {/* Error-spotting segments */}
              {found.questionType === 'error-spotting' && found.segments && (
                <div className="mb-6 grid grid-cols-2 gap-3">
                  {found.segments.map((seg, i) => (
                    <div key={i} className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-center">
                      <span className="block text-xs font-bold text-[#7C3AED] mb-1">Section {String.fromCharCode(65+i)}</span>
                      <span className="text-gray-900 text-sm font-medium">{seg}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Question text */}
              <h3 className="text-xl font-heading font-bold text-slate-800 mb-4 whitespace-pre-line">{found.question}</h3>
              {/* Options */}
              {found.options && (
                <div className="space-y-2">
                  {found.options.map((opt, i) => (
                    <div key={i} className={`p-3 rounded-lg border-2 flex items-center gap-3 ${i === found.correct ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i === found.correct ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{String.fromCharCode(65+i)}</span>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
              {/* Pick-from-sets */}
              {found.setA && (
                <div className="space-y-3">
                  <div><span className="text-sm font-bold text-[#7C3AED]">Group A:</span> {found.setA.map((w,i) => <span key={i} className={`inline-block mx-1 px-2 py-1 rounded ${i===found.correctPair?.[0] ? 'bg-green-100 font-bold' : 'bg-gray-100'}`}>{w}</span>)}</div>
                  <div><span className="text-sm font-bold text-indigo-700">Group B:</span> {found.setB.map((w,i) => <span key={i} className={`inline-block mx-1 px-2 py-1 rounded ${i===found.correctPair?.[1] ? 'bg-green-100 font-bold' : 'bg-gray-100'}`}>{w}</span>)}</div>
                </div>
              )}
              {/* Explanation */}
              {found.explanation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-200">{found.explanation}</div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="app-bg p-6 min-h-screen"><div className="max-w-2xl mx-auto card-elevated p-6 text-center"><h2 className="text-xl font-bold text-red-500">Question not found</h2><p className="text-gray-600 mt-2">preview={previewTopic} q={previewQId}</p></div></div>;
    }
  }

  // ── View key for AnimatePresence transitions ──
  const viewKey = currentView === 'quiz' && showDidItHelp && lessonFromQuiz ? 'quiz-help'
    : currentView === 'quiz' && showPreQuizTip && preQuizTip ? 'quiz-tip'
    : currentView === 'mockTest' && mockTest.mockTestComplete ? 'mockTest-results'
    : currentView === 'home' && showWelcomeBack && welcomeBackTip ? 'welcomeBack'
    : currentView;

  // ── Render the current view ──
  function renderView() {

  if (currentView === 'speedReview') {
    return <SpeedReviewPanel
      onBack={() => setCurrentView('home')}
      questionData={questionData}
      englishData={englishData}
      vrData={vrData}
      activeTab={speedReviewTab}
      setActiveTab={setSpeedReviewTab}
      mapTopic={speedReviewMapTopic}
      setMapTopic={setSpeedReviewMapTopic}
      initialScrollY={speedReviewScrollY}
      onViewLesson={(topicKey, sc, lesson) => {
        setSpeedReviewScrollY(window.scrollY);
        const vars = lesson.variableSets?.[0] || {};
        const interactVars = lesson.variableSets?.length > 1 ? lesson.variableSets[1] : vars;
        const topicName = lessonBank[topicKey]?.name || topicKey;
        setSelectedTopic(topicKey);
        // Determine subject for the topic
        const englishTopics = ['spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar', 'comprehension', 'antonyms', 'synonyms'];
        const vrTopics = ['hiddenWords', 'letterCodes', 'letterMove', 'letterPairSeries', 'letterSums', 'logicAndLanguage', 'missingLettersWords', 'numberSeries', 'numberWordCodes', 'oddTwoOut', 'sharedLetter', 'verbalAnalogies', 'wordCodeAnalogies', 'compoundWords', 'balanceEquations'];
        if (englishTopics.includes(topicKey)) setSelectedSubject('english');
        else if (vrTopics.includes(topicKey)) setSelectedSubject('verbalreasoning');
        else setSelectedSubject('maths');
        setForcedLessonResult({
          lesson,
          variables: vars,
          interactVariables: interactVars,
          subConceptId: sc.id,
          subConceptName: sc.name,
          topicName,
        });
        setReturnToSpeedReview(true);
        setCurrentView('lesson');
      }}
      onViewQuestion={(topic, questionId) => {
        setSpeedReviewScrollY(window.scrollY);
        // Jump to quiz view showing this specific question
        const topicKey = topic;
        // Find the subject for this topic
        const englishTopics = ['spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar', 'comprehension'];
        const vrTopics = ['hiddenWords', 'letterCodes', 'letterMove', 'letterPairSeries', 'letterSums', 'logicAndLanguage', 'missingLettersWords', 'numberSeries', 'numberWordCodes', 'oddTwoOut', 'sharedLetter', 'verbalAnalogies', 'wordCodeAnalogies', 'compoundWords', 'antonyms', 'synonyms', 'balanceEquations'];
        let subject = 'maths';
        if (englishTopics.includes(topicKey)) subject = 'english';
        if (vrTopics.includes(topicKey)) subject = 'verbalreasoning';

        // Get questions for this topic
        let allQuestions;
        if (subject === 'english') allQuestions = englishData.topics?.[topicKey]?.questions || englishData[topicKey]?.questions || [];
        else if (subject === 'verbalreasoning') allQuestions = vrData.topics?.[topicKey]?.questions || vrData[topicKey]?.questions || [];
        else allQuestions = questionData.maths?.topics?.[topicKey]?.questions || [];

        // Find the question and wrap in quiz format
        const targetQ = allQuestions.find(q => q.id === questionId);
        if (!targetQ) return;

        const topicName = subject === 'english' ? (englishData.topics?.[topicKey]?.name || englishData[topicKey]?.name)
          : subject === 'verbalreasoning' ? (vrData.topics?.[topicKey]?.name || vrData[topicKey]?.name)
          : questionData.maths?.topics?.[topicKey]?.name || topicKey;

        setSelectedSubject(subject);
        setSelectedTopic(topicKey);
        setQuizMode('focused');
        setQuizQuestions([{ question: targetQ, topicKey, topicName }]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setSelectedPair([]);
        setShowFeedback(false);
        setShowTutorChat(false);
        setChatMessages([]);
        setAnswers([]);
        setReturnToSpeedReview(true);
        setCurrentView('quiz');
      }}
    />;
  }

  if (currentView === 'testingMode') {
    return (
      <TestingDashboard
        questionData={questionData}
        lessonBank={lessonBank}
        testingCoverage={testingCoverage}
        onStartTestingQuiz={handleStartTestingQuiz}
        onStartTestingLesson={(topicKey, subConcept) => {
          // Determine subject from questionData keys
          const subject = Object.entries(questionData).find(
            ([, sd]) => sd.topics && sd.topics[topicKey]
          )?.[0] || 'maths';
          setSelectedSubject(subject);
          setSelectedTopic(topicKey);
          setReturnToTestingMode(true);
          const teachLesson = subConcept.lessons?.[0];
          setForcedLessonResult({
            lesson: teachLesson,
            variables: teachLesson?.variableSets?.[0] || {},
            interactVariables: teachLesson?.variableSets?.length > 1
              ? teachLesson.variableSets[1]
              : teachLesson?.variableSets?.[0] || {},
            subConceptId: subConcept.id || topicKey,
            subConceptName: subConcept.name || topicKey,
            topicName: lessonBank[topicKey]?.name || topicKey,
          });
          setCurrentView('lesson');
        }}
        onViewLesson={(topicKey, subConceptId, lessonId) => {
          const topicLessons = lessonBank[topicKey];
          if (!topicLessons) return;
          const subConcept = topicLessons.subConcepts?.find(sc => sc.id === subConceptId);
          if (!subConcept) return;
          const lesson = (lessonId && subConcept.lessons?.find(l => l.id === lessonId))
            || subConcept.lessons?.[0];
          if (!lesson) return;
          const subject = Object.entries(questionData).find(
            ([, sd]) => sd.topics && sd.topics[topicKey]
          )?.[0] || 'maths';
          setSelectedSubject(subject);
          setSelectedTopic(topicKey);
          setReturnToTestingMode(true);
          setForcedLessonResult({
            lesson,
            variables: lesson.variableSets?.[0] || {},
            interactVariables: lesson.variableSets?.length > 1
              ? lesson.variableSets[1]
              : lesson.variableSets?.[0] || {},
            subConceptId: subConcept.id || topicKey,
            subConceptName: subConcept.name || topicKey,
            topicName: lessonBank[topicKey]?.name || topicKey,
          });
          setCurrentView('lesson');
        }}
        onViewQuestion={(topicKey, subject, questionId) => {
          // Look up the real subject key — flag data may have topicKey as subject
          const validSubjects = ['maths', 'english', 'verbalreasoning'];
          const sub = (subject && validSubjects.includes(subject)) ? subject
            : Object.entries(questionData).find(([, sd]) => sd.topics && sd.topics[topicKey])?.[0] || 'maths';
          const allQuestions = questionData[sub]?.topics?.[topicKey]?.questions || [];
          const targetQ = allQuestions.find(q => q.id === questionId);
          if (!targetQ) return;
          const topicName = questionData[sub]?.topics?.[topicKey]?.name || topicKey;
          setSelectedSubject(sub);
          setSelectedTopic(topicKey);
          setQuizQuestions([{ question: targetQ, topicKey, topicName }]);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setSelectedPair([]);
          setShowFeedback(false);
          setShowTutorChat(false);
          setChatMessages([]);
          setAnswers([]);
          setQuizMode('testing');
          setReturnToTestingMode(true);
          setCurrentView('quiz');
        }}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'testingResults') {
    return (
      <TestingResultsSummary
        quizQuestions={quizQuestions}
        answers={answers}
        sessionFlags={testingSessionFlags}
        testingCoverage={testingCoverage}
        onContinueTopic={() => handleStartTestingQuiz(selectedTopic, selectedSubject)}
        onBackToDashboard={() => setCurrentView('testingMode')}
      />
    );
  }

  // Welcome Back interstitial (spaced resurfacing)
  if (currentView === 'home' && showWelcomeBack && welcomeBackTip) {
    return (
      <WelcomeBackScreen
        tip={welcomeBackTip}
        onDismiss={() => {
          userData.markTipSeen(welcomeBackTip.id);
          userData.saveLastSessionDate(new Date().toISOString());
          setShowWelcomeBack(false);
          setWelcomeBackTip(null);
        }}
      />
    );
  }

  if (currentView === 'children') {
    return (
      <ChildrenScreen
        childrenList={childrenList}
        activeChildId={activeChildId}
        getToken={getToken}
        onBack={() => setCurrentView('home')}
        onSwitchChild={setActiveChildId}
        onChildrenUpdated={setChildrenList}
      />
    );
  }

  if (currentView === 'join') {
    return (
      <JoinScreen
        tutorCode={joinTutorCode}
        childrenList={childrenList}
        getToken={getToken}
        onJoined={(childId) => {
          // Clear the join path from the URL and any saved join code, then go home
          window.history.replaceState({}, '', '/');
          try { sessionStorage.removeItem('pending-join-code'); } catch {}
          setActiveChildId(childId);
          setCurrentView('home');
        }}
        onBack={() => {
          window.history.replaceState({}, '', '/');
          setCurrentView('home');
        }}
      />
    );
  }

  if (currentView === 'tutorSignup') {
    return (
      <TutorSignupScreen
        getToken={getToken}
        onBack={() => setCurrentView('home')}
        onOpenDashboard={() => setCurrentView('tutorDashboard')}
      />
    );
  }

  if (currentView === 'tutorDashboard') {
    return (
      <TutorDashboardScreen
        getToken={getToken}
        onBack={() => setCurrentView('tutorSignup')}
      />
    );
  }

  if (currentView === 'parentMessages') {
    return (
      <ParentMessagingScreen
        activeChildId={activeChildId}
        getToken={getToken}
        onBack={() => setCurrentView('progress')}
      />
    );
  }

  if (currentView === 'errors') {
    return <ErrorDashboardScreen onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'flags') {
    return <FeatureFlagsScreen onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'home') {
    return (
      <HomeScreen
        currentUser={currentUser}
        onSetCurrentUser={handleSetCurrentUser}
        onSubjectSelect={handleSubjectSelect}
        onViewProgress={() => setCurrentView('progress')}
        onViewMistakes={() => setCurrentView('mistakes')}
        onSpeedReview={() => setCurrentView('speedReview')}
        onTestingMode={() => setCurrentView('testingMode')}
        onStartTopic={(subject, topicKey) => {
          setSelectedSubject(subject);
          handleTopicSelect(topicKey, subject);
        }}
        onStartAssignment={(subject, topicKey, recipientId) => {
          setActiveAssignment({ recipientId, topic: topicKey, subject });
          setSelectedSubject(subject);
          handleTopicSelect(topicKey, subject);
        }}
        getToken={getToken}
        mastery={mastery}
        streaksAndPP={streaksAndPP}
        childrenList={childrenList}
        activeChildId={activeChildId}
        onSwitchChild={setActiveChildId}
        onManageChildren={() => setCurrentView('children')}
        onTutorSignup={isTutorAllowlisted(userEmail) ? () => setCurrentView('tutorSignup') : null}
      />
    );
  }

  if (currentView === 'learningMode') {
    return (
      <LearningModeScreen
        subjectName={questionData[selectedSubject]?.name}
        subjectKey={selectedSubject}
        mastery={mastery}
        onStartDaily={handleStartDaily}
        onFocusedLearning={() => setCurrentView('topics')}
        onMockTest={() => {
          mockResultsSaved.current = false;
          mockTest.startMockTest(selectedSubject, questionData, englishData, vrData);
          setCurrentView('mockTest');
        }}
        onChallengeMode={handleChallengeMode}
        onStudyToolkit={() => setCurrentView('studyToolkit')}
        onBack={handleHome}
      />
    );
  }

  if (currentView === 'studyToolkit') {
    return (
      <StudyToolkitScreen
        subject={selectedSubject}
        tips={allTips}
        seenTips={userData.seenTipIds}
        onMarkSeen={userData.markTipSeen}
        topicPerformance={topicPerformance}
        lessonBank={lessonBank}
        lessonHistory={lessonHistory}
        onLaunchLesson={handleToolkitLessonLaunch}
        toolkitLessonsViewed={toolkitLessonsViewed.current}
        onStartQuiz={() => setCurrentView('topics')}
        onBack={() => {
          toolkitLessonsViewed.current = 0;
          setCurrentView('learningMode');
        }}
        onHome={handleHome}
      />
    );
  }

  if (currentView === 'topics') {
    return (
      <TopicsScreen
        subject={questionData[selectedSubject]}
        topicPerformance={topicPerformance}
        onTopicSelect={handleTopicSelect}
        onBack={() => setCurrentView('learningMode')}
        onHome={handleHome}
      />
    );
  }

  if (currentView === 'mockTest' && !mockTest.mockTestComplete) {
    return (
      <MockTestScreen
        subject={mockTest.mockTestSubject}
        questions={mockTest.mockTestQuestions}
        answers={mockTest.mockTestAnswers}
        currentIndex={mockTest.mockTestCurrentIndex}
        sectionBreaks={mockTest.mockTestSectionBreaks}
        passage={mockTest.mockTestPassage}
        timeLimit={mockTest.mockTestTimeLimit}
        quizVisualComponents={quizVisualComponents}
        flags={mockTest.mockTestFlags}
        onAnswer={mockTest.answerQuestion}
        onToggleFlag={mockTest.toggleFlag}
        onGoTo={mockTest.goToQuestion}
        onSubmit={mockTest.submitTest}
        onBack={() => {
          mockTest.endMockTest();
          setCurrentView('learningMode');
        }}
      />
    );
  }

  if (currentView === 'mockTest' && mockTest.mockTestComplete) {
    // Save mock test per-question results to progress tracking (once)
    const results = mockTest.getResults();
    if (results && !mockResultsSaved.current) {
      mockResultsSaved.current = true;
      userData.startBatch();
      saveMockTestResults(
        mockTest.mockTestQuestions,
        mockTest.mockTestAnswers,
        { mockTestSubject: mockTest.mockTestSubject, mockTestQuestionTimes: mockTest.mockTestQuestionTimes },
        results,
        { userData, streaksAndPP }
      );
      userData.endBatch();
    }

    return (
      <MockTestResultsScreen
        results={results}
        onTryAgain={() => {
          mockResultsSaved.current = false;
          mockTest.startMockTest(selectedSubject, questionData, englishData, vrData);
        }}
        onHome={() => {
          mockResultsSaved.current = false;
          mockTest.endMockTest();
          handleHome();
        }}
      />
    );
  }

  if (currentView === 'lesson') {
    return (
      <MicroLessonScreen
        topicKey={selectedTopic}
        topicPerformance={topicPerformance}
        lessonHistory={lessonHistory}
        currentUser={currentUser}
        onSheetSubmit={submitToGoogleSheet}
        forcedLessonResult={forcedLessonResult}
        isTestingMode={returnToTestingMode}
        onFlagLesson={(flagData) => {
          testingCoverage.flagLesson(flagData.topicKey, flagData.subConceptId, flagData.screenIndex, flagData.category, flagData.note);
          const workerUrl = process.env.REACT_APP_TUTOR_API_URL;
          if (workerUrl) fetch(`${workerUrl}/flags`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ submitter: currentUser, type: 'lesson', ...flagData })
          }).catch(() => {});
        }}
        backLabel={returnToTestingMode ? "Back to Testing Dashboard" : returnToToolkit ? "Back to Study Toolkit" : returnToSpeedReview ? "Back to Speed Review" : "Back to Topics"}
        onComplete={(lessonRecord) => {
          // Testing mode: mark tested, skip normal lesson history, return to dashboard
          if (returnToTestingMode) {
            if (lessonRecord) {
              testingCoverage.markLessonTested(selectedTopic, lessonRecord.subConcept);
              testingCoverage.recordSession({ questionsChecked: 0, lessonsChecked: 1, issuesFlagged: 0 });
            }
            setForcedLessonResult(null);
            setReturnToTestingMode(false);
            setCurrentView('testingMode');
            return;
          }
          if (lessonRecord) {
            const updated = { ...lessonHistory };
            if (!updated[selectedTopic]) updated[selectedTopic] = {};
            if (!updated[selectedTopic].shown) updated[selectedTopic].shown = [];
            updated[selectedTopic].shown.push(lessonRecord);
            updated[selectedTopic].lastSubConcept = lessonRecord.subConcept;
            updated[selectedTopic].lastTemplateType = lessonRecord.templateType;
            userData.saveLessonHistory(updated);
          }
          setForcedLessonResult(null);
          // If launched from quiz "Find Me a Lesson", show "Did that help?" screen
          if (lessonFromQuiz) {
            // Resume question timer — add paused duration to accumulator
            if (pauseStartTime.current) {
              pausedTimeMs.current += Date.now() - pauseStartTime.current;
              pauseStartTime.current = null;
            }
            setShowDidItHelp(true);
            setCurrentView('quiz');
          } else if (returnToToolkit) {
            setReturnToToolkit(false);
            setCurrentView('studyToolkit');
          } else if (returnToSpeedReview) {
            setReturnToSpeedReview(false);
            setCurrentView('speedReview');
          } else {
            // Pre-quiz tip for Focused Learning: topic-specific tip
            const tip = selectPreQuizTip('focused', selectedTopic, allTips, userData.seenTips);
            setPreQuizTip(tip);
            setShowPreQuizTip(!!tip);
            setCurrentView('quiz');
          }
        }}
        onBack={() => {
          setForcedLessonResult(null);
          if (returnToTestingMode) {
            setReturnToTestingMode(false);
            setCurrentView('testingMode');
          } else if (returnToToolkit) {
            setReturnToToolkit(false);
            setCurrentView('studyToolkit');
          } else if (returnToSpeedReview) {
            setReturnToSpeedReview(false);
            setCurrentView('speedReview');
          } else {
            setCurrentView('topics');
          }
        }}
      />
    );
  }

  if (currentView === 'quiz' && showDidItHelp && lessonFromQuiz) {
    return (
      <div className="app-bg p-4 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto card-elevated p-8 text-center">
          {showDidItHelp === 'feedback' ? (
            // Step 2: feedback + AI Tutor CTA
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EDE8FF] flex items-center justify-center">
                <Brain className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <h2 className="text-xl font-heading font-bold text-slate-800 mb-2">No worries — we can help!</h2>
              <p className="text-gray-600 mb-4">What didn't make sense? This helps us improve the lessons.</p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="e.g. I didn't understand the second step..."
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#7C3AED] text-sm resize-none mb-4"
                rows={3}
              />
              <div className="bg-[#EDE8FF] rounded-xl p-4 mb-4 text-left">
                <p className="text-sm font-bold text-[#7C3AED] mb-1">Your AI Tutor can explain this differently!</p>
                <p className="text-sm text-slate-500">They'll look at the specific question you're stuck on and break it down step by step, just for you.</p>
              </div>
              {/* Submit feedback + open AI Tutor */}
              <button
                onClick={() => {
                  if (feedbackText.trim()) {
                    submitToGoogleSheet({
                      type: 'lesson-not-helpful',
                      submitter: currentUser || 'Unknown',
                      topicKey: lessonFromQuiz.topicKey,
                      questionId: String(lessonFromQuiz.questionId),
                      subConceptId: lessonFromQuiz.subConceptId,
                      subConceptName: lessonFromQuiz.subConceptName,
                      feedback: feedbackText.trim(),
                      date: new Date().toISOString(),
                    });
                  }
                  setShowDidItHelp(false);
                  setLessonFromQuiz(null);
                  setFeedbackText('');
                  setShowTutorChat(true);
                  setChatMessages([{
                    role: 'assistant',
                    content: "The lesson didn't quite click? No worries — I'm here to help! 😊 Let me try explaining this question in a different way. What part are you finding tricky?"
                  }]);
                }}
                className="w-full px-6 py-3 bg-[#7C3AED] hover:bg-[#5A4BD1] text-white font-bold rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Talk to AI Tutor
              </button>

              {/* Submit feedback only (no tutor) */}
              <button
                onClick={() => {
                  if (feedbackText.trim()) {
                    submitToGoogleSheet({
                      type: 'lesson-not-helpful',
                      submitter: currentUser || 'Unknown',
                      topicKey: lessonFromQuiz.topicKey,
                      questionId: String(lessonFromQuiz.questionId),
                      subConceptId: lessonFromQuiz.subConceptId,
                      subConceptName: lessonFromQuiz.subConceptName,
                      feedback: feedbackText.trim(),
                      date: new Date().toISOString(),
                    });
                  }
                  setShowDidItHelp(false);
                  setLessonFromQuiz(null);
                  setFeedbackText('');
                }}
                className="w-full mt-2 px-6 py-3 bg-[#22C55E] hover:bg-[#00A381] text-white font-bold rounded-xl transition-colors"
              >
                {feedbackText.trim() ? 'Submit Feedback' : 'Go Back to Question'}
              </button>
            </>
          ) : (
            // Step 1: Did it help?
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EDE8FF] flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-slate-800 mb-2">Did that lesson help?</h2>
              <p className="text-gray-600 mb-6">We showed you the <strong>{lessonFromQuiz.subConceptName}</strong> lesson. Did it help you understand the question better?</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDidItHelp(false);
                    setLessonFromQuiz(null);
                  }}
                  className="px-8 py-3 bg-[#22C55E] hover:bg-[#00A381] text-white font-bold rounded-xl text-lg transition-colors"
                >
                  Yes, it helped!
                </button>
                <button
                  onClick={() => setShowDidItHelp('feedback')}
                  className="px-8 py-3 bg-[#FF6B6B] hover:bg-[#E55A5A] text-white font-bold rounded-xl text-lg transition-colors"
                >
                  Not really
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Pre-quiz tip interstitial (after lesson, before quiz starts)
  if (currentView === 'quiz' && showPreQuizTip && preQuizTip) {
    return <PreQuizTipCard tip={preQuizTip} onDismiss={handleDismissPreQuizTip} />;
  }

  if (currentView === 'quiz') {
    return (
      <QuizScreen
        quizQuestions={quizQuestions}
        currentQuestionIndex={currentQuestionIndex}
        quizMode={quizMode}
        selectedTopic={selectedTopic}
        selectedAnswer={selectedAnswer}
        selectedPair={selectedPair}
        showFeedback={showFeedback}
        returnToSpeedReview={returnToSpeedReview}
        showTutorChat={showTutorChat}
        chatMessages={chatMessages}
        userMessage={userMessage}
        isAiThinking={isAiThinking}
        isListening={isListening}
        showFeedbackForm={showFeedbackForm}
        feedbackText={feedbackText}
        currentUser={currentUser}
        speechSupported={speechSupported}
        quizVisualComponents={quizVisualComponents}
        postQuestionTip={postQuestionTip}
        isTestingMode={quizMode === 'testing'}
        onFlagQuestion={(flagData) => {
          const flagWithSubject = { ...flagData, subject: selectedSubject };
          testingCoverage.flagQuestion(flagData.topicKey, flagData.questionId, flagData.category, flagData.note);
          setTestingSessionFlags(prev => [...prev, flagWithSubject]);
          const workerUrl = process.env.REACT_APP_TUTOR_API_URL;
          if (workerUrl) fetch(`${workerUrl}/flags`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ submitter: currentUser, type: 'question', ...flagWithSubject })
          }).catch(() => {});
        }}
        onAnswerSelect={handleAnswerSelect}
        onSelectTwoToggle={handleSelectTwoToggle}
        onPickFromSet={handlePickFromSet}
        onCheckAnswer={handleCheckAnswer}
        onNextQuestion={handleNextQuestion}
        onFindLesson={handleFindLesson}
        onAskTutor={handleAskTutor}
        timerPaused={currentView !== 'quiz'}
        timerStartFrom={savedTimerSecs}
        onTimerTick={(secs) => setSavedTimerSecs(secs)}
        onSendMessage={handleSendMessage}
        onUserMessageChange={setUserMessage}
        onToggleListening={(target) => toggleListening(target === 'feedback' ? setFeedbackText : setUserMessage)}
        onFeedbackTextChange={setFeedbackText}
        onSubmitFeedback={submitQuestionFeedback}
        onToggleFeedbackForm={(val) => val === false ? setShowFeedbackForm(false) : setShowFeedbackForm(!showFeedbackForm)}
        onHome={handleHome}
        onBack={() => {
          if (quizMode === 'testing') {
            setReturnToTestingMode(false);
            setCurrentView('testingMode');
            return;
          }
          if (returnToSpeedReview) {
            setReturnToSpeedReview(false);
            setCurrentView('speedReview');
          } else if (quizMode === 'daily') {
            setCurrentView('learningMode');
          } else {
            setCurrentView('topics');
          }
        }}
      />
    );
  }

  if (currentView === 'results') {
    return (
      <ResultsScreen
        answers={answers}
        quizMode={quizMode}
        quizQuestions={quizQuestions}
        allTips={allTips}
        seenTips={userData.seenTips}
        onMarkTipSeen={userData.markTipSeen}
        onRetry={handleRetry}
        onChooseTopic={() => setCurrentView(quizMode === 'daily' ? 'learningMode' : 'topics')}
        onHome={handleHome}
        canReview={!!lastCompletedQuiz?.sessionId}
        onReviewQuiz={handleReviewQuiz}
      />
    );
  }

  if (currentView === 'topicDrillDown' && drillDownTopic) {
    return (
      <TopicDrillDown
        subject={drillDownTopic.subject}
        topicKey={drillDownTopic.topicKey}
        mastery={mastery}
        questionResults={questionResults}
        onPractise={(subject, topicKey) => {
          setSelectedSubject(subject);
          handleTopicSelect(topicKey, subject);
        }}
        onBack={() => setCurrentView('progress')}
        onHome={handleHome}
      />
    );
  }

  if (currentView === 'mistakes') {
    return (
      <MistakesScreen
        questionResults={userData.questionResults}
        questionData={questionData}
        englishData={englishData}
        vrData={vrData}
        onPractiseTopic={(subject, topicKey) => {
          setSelectedSubject(subject);
          handleTopicSelect(topicKey, subject);
        }}
        onRecordResult={(result) => userData.saveQuestionResult(result)}
        onBack={handleHome}
      />
    );
  }

  if (currentView === 'progress') {
    return (
      <ProgressScreen
        quizHistory={quizHistory}
        questionData={questionData}
        mastery={mastery}
        streaksAndPP={streaksAndPP}
        userData={userData}
        currentUser={currentUser}
        getToken={getToken}
        activeChildId={activeChildId}
        onHome={handleHome}
        onStartTopic={(subject, topicKey) => {
          setSelectedSubject(subject);
          handleTopicSelect(topicKey, subject);
        }}
        onDrillDown={(subject, topicKey) => {
          setDrillDownTopic({ subject, topicKey });
          setCurrentView('topicDrillDown');
        }}
        onViewQuiz={(quiz) => {
          setSelectedQuiz(quiz);
          setQuizDetailReturnTo('progress');
          setCurrentView('quizDetail');
        }}
        onViewAllActivity={() => setCurrentView('allActivity')}
        onOpenParentMessages={() => setCurrentView('parentMessages')}
      />
    );
  }

  if (currentView === 'allActivity') {
    return (
      <AllActivityScreen
        quizHistory={quizHistory}
        onBack={() => setCurrentView('progress')}
        onViewQuiz={(quiz) => {
          setSelectedQuiz(quiz);
          setQuizDetailReturnTo('allActivity');
          setCurrentView('quizDetail');
        }}
      />
    );
  }

  if (currentView === 'quizDetail') {
    const isPostQuizReview = quizDetailReturnTo === 'results';
    return (
      <QuizDetailScreen
        quiz={selectedQuiz}
        questionResults={questionResults}
        inMemoryResults={isPostQuizReview ? questionResults : undefined}
        questionData={mathsData}
        englishData={englishData}
        vrData={vrData}
        quizVisualComponents={quizVisualComponents}
        landOn={isPostQuizReview ? 'first-wrong' : undefined}
        autoOpenTutor={isPostQuizReview}
        onFindLesson={handleReviewFindLesson}
        onBack={() => {
          setSelectedQuiz(null);
          setCurrentView(quizDetailReturnTo);
        }}
      />
    );
  }

  } // end renderView

  const FOOTER_VIEWS = new Set(['home', 'topics', 'results', 'progress', 'mistakes', 'allActivity', 'topicDrillDown']);

  // ── Animated view wrapper ──
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={viewKey} {...viewTransition}>
          {renderView()}
          {FOOTER_VIEWS.has(currentView) && <Footer />}
        </motion.div>
      </AnimatePresence>
      {pendingAchievement && (
        <AchievementModal
          achievement={pendingAchievement}
          onDismiss={() => setPendingAchievement(null)}
        />
      )}
      {resumePrompt && (
        <ResumeQuizPrompt
          savedState={resumePrompt.savedState}
          onResume={() => resumeSavedQuiz(resumePrompt.savedState)}
          onStartFresh={startFreshFromPrompt}
        />
      )}
      <CookieBanner />
    </>
  );
}

function ResumeQuizPrompt({ savedState, onResume, onStartFresh }) {
  const topicDisplay = topicNames[savedState.selectedTopic] || savedState.selectedTopic;
  const total = savedState.quizQuestions?.length || 10;
  const position = Math.min(total, (savedState.currentQuestionIndex || 0) + 1);
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EDE8FF] flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-[#7C3AED]" />
        </div>
        <h2 className="text-xl font-heading font-bold text-slate-800 mb-2">Pick up where you left off?</h2>
        <p className="text-sm text-gray-600 mb-6">
          You have a <strong>{topicDisplay}</strong> quiz in progress — question {position} of {total}.
        </p>
        <div className="space-y-2">
          <button
            onClick={onResume}
            className="w-full py-3 bg-[#7C3AED] hover:bg-[#5A4BD1] text-white font-bold rounded-xl transition-colors"
          >
            Resume quiz
          </button>
          <button
            onClick={onStartFresh}
            className="w-full py-3 bg-white hover:bg-gray-50 text-slate-600 border-2 border-gray-200 font-bold rounded-xl transition-colors"
          >
            Start fresh
          </button>
        </div>
      </div>
    </div>
  );
}

function SubjectCard({ title, icon: Icon, gradient, color, onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03, y: -3 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`${gradient ? `bg-gradient-to-br ${gradient}` : color} text-white rounded-2xl p-8 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <Icon className="w-9 h-9" />
      </div>
      <h3 className="text-2xl font-heading font-bold">{title}</h3>
      {disabled && <p className="text-sm mt-2 opacity-80">Coming Soon</p>}
    </motion.button>
  );
}

function getTopicBadge(pct) {
  if (pct >= 90) return { label: 'Jedi Master', icon: Crown, color: 'text-[#F59E0B]', bg: 'bg-[#FDCB6E]/20' };
  if (pct >= 70) return { label: 'Space Captain', icon: Rocket, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' };
  if (pct >= 50) return { label: 'Star Cadet', icon: Star, color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/10' };
  if (pct >= 30) return { label: 'Rocket Rookie', icon: Wrench, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' };
  return { label: 'Launch Pad', icon: Target, color: 'text-slate-500', bg: 'bg-gray-100' };
}

function TopicCard({ title, questionCount, performance, onClick }) {
  let perfDisplay = null;
  let perfPct = null;
  let perfBarColor = '#EDE8FF';
  if (performance) {
    if (performance.total >= 5) {
      const pct = Math.round((performance.correct / performance.total) * 100);
      perfPct = pct;
      perfBarColor = pct >= 70 ? '#22C55E' : pct >= 40 ? '#FDCB6E' : '#FF6B6B';
      const pctColor = pct >= 70 ? 'text-[#22C55E]' : pct >= 40 ? 'text-[#F59E0B]' : 'text-[#FF6B6B]';
      const badge = getTopicBadge(pct);
      const BadgeIcon = badge.icon;
      perfDisplay = (
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-sm font-bold ${pctColor}`}>{pct}%</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.color} flex items-center gap-1`}>
            <BadgeIcon className="w-3 h-3" />
            {badge.label}
          </span>
        </div>
      );
    } else {
      perfDisplay = <p className="text-sm text-slate-500 mt-1">Not enough data</p>;
    }
  }
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-full card hover:bg-[#EDE8FF]/30 rounded-xl p-6 flex items-center justify-between group overflow-hidden relative"
    >
      {/* Left performance bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: perfPct !== null ? perfBarColor : '#EDE8FF' }}
      />
      <div className="text-left pl-3">
        <h4 className="text-xl font-heading font-bold text-slate-800 mb-1">{title}</h4>
        {questionCount && <p className="text-[#7C3AED] font-medium">{questionCount} questions</p>}
        {perfDisplay}
      </div>
      <ChevronRight className="w-8 h-8 text-[#A29BFE] group-hover:translate-x-1 transition-transform" />
    </motion.button>
  );
}

export default App;