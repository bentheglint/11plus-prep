import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, Brain, Home, ChevronRight, CheckCircle, XCircle, RotateCcw, BarChart3, Calendar, Target, MessageSquare, GraduationCap, Star, Trophy, ThumbsUp, Zap, Crown, Rocket, Wrench, MessageCircle, ArrowLeft, Award, Layers, Mic, MicOff } from 'lucide-react';
import MicroLessonScreen from './microLessons/MicroLessonScreen';
import SpeedReviewPanel from './SpeedReviewPanel';
import { lessonBank } from './microLessons/lessonData';
import {
  FunctionMachine, CuboidDiagram, SDTTriangle, AngleDiagram,
  AngleDisplay, QuadShape, ParallelLines, ExteriorAngle, RegularPolygon,
  BarChart, PieChart, LineGraph, TwoWayTable, RectangleDiagram,
  TriangleAreaDiagram, ParallelogramDiagram, LShapeDiagram,
  NumberLine, BarModel, GridModel, PathBorderDiagram, PlaceValueChart
} from './microLessons/visuals';
import ResultsScreen from './screens/ResultsScreen';
import ProgressScreen from './screens/ProgressScreen';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import LearningModeScreen from './screens/LearningModeScreen';
import TopicsScreen from './screens/TopicsScreen';
import mathsData from './questionData/mathsData';
import englishData from './questionData/englishData';
import vrData from './questionData/vrData';

// Visual component map for rendering diagrams on quiz question screens
const quizVisualComponents = {
  FunctionMachine, CuboidDiagram, SDTTriangle, AngleDiagram,
  AngleDisplay, QuadShape, ParallelLines, ExteriorAngle, RegularPolygon,
  BarChart, PieChart, LineGraph, TwoWayTable, RectangleDiagram,
  TriangleAreaDiagram, ParallelogramDiagram, LShapeDiagram,
  NumberLine, BarModel, GridModel, PathBorderDiagram, PlaceValueChart
};

const questionData = {
  maths: {
    ...mathsData,
    icon: Calculator
  },
  english: {
    ...englishData,
    icon: BookOpen
  },
  verbalreasoning: {
    ...vrData,
    icon: Brain
  }
};

function App() {
  const [currentView, setCurrentView] = useState('home');
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
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizMode, setQuizMode] = useState(null);
  const [returnToSpeedReview, setReturnToSpeedReview] = useState(false);
  const [speedReviewTab, setSpeedReviewTab] = useState('lessons');
  const [speedReviewMapTopic, setSpeedReviewMapTopic] = useState('');
  const [speedReviewScrollY, setSpeedReviewScrollY] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [seenQuestions, setSeenQuestions] = useState({});
  const [topicPerformance, setTopicPerformance] = useState({});
  const [questionFeedback, setQuestionFeedback] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [lessonHistory, setLessonHistory] = useState({});
  const [forcedLessonResult, setForcedLessonResult] = useState(null);
  const [lessonFromQuiz, setLessonFromQuiz] = useState(null); // tracks quiz state to return to after "Find Me a Lesson"
  const [showDidItHelp, setShowDidItHelp] = useState(false); // "Did that help?" screen after lesson
  const [questionMappings, setQuestionMappings] = useState({}); // loaded mapping files
  const [testedSubConcepts, setTestedSubConcepts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tested-subconcepts')) || {}; } catch { return {}; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('current-user') || '';
  });

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

  useEffect(() => {
    const saved = localStorage.getItem('quiz-history');
    if (saved) {
      setQuizHistory(JSON.parse(saved));
    }
    const savedSeen = localStorage.getItem('seen-questions');
    if (savedSeen) {
      setSeenQuestions(JSON.parse(savedSeen));
    }
    const savedPerf = localStorage.getItem('topic-performance');
    if (savedPerf) {
      setTopicPerformance(JSON.parse(savedPerf));
    }
    const savedFeedback = localStorage.getItem('question-feedback');
    if (savedFeedback) {
      setQuestionFeedback(JSON.parse(savedFeedback));
    }
    const savedLessonHistory = localStorage.getItem('lesson-history');
    if (savedLessonHistory) {
      setLessonHistory(JSON.parse(savedLessonHistory));
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

  const saveQuizResult = (subject, topic, score, total) => {
    const newResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      subject,
      topic,
      score,
      total,
      percentage: Math.round((score / total) * 100)
    };

    const updatedHistory = [...quizHistory, newResult];
    setQuizHistory(updatedHistory);
    localStorage.setItem('quiz-history', JSON.stringify(updatedHistory));
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setCurrentView('learningMode');
  };

  const handleStartDaily = () => {
    const selected = selectDailyQuestions();
    setQuizQuestions(selected);
    setQuizMode('daily');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
    setCurrentView('quiz');
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    const selected = selectFocusedQuestions(topic);
    setQuizQuestions(selected);
    setQuizMode('focused');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
    setForcedLessonResult(null);

    if (selectedSubject === 'maths' || selectedSubject === 'english' || selectedSubject === 'verbalreasoning') {
      setCurrentView('lesson');
    } else {
      setCurrentView('quiz');
    }
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

    let isCorrect;
    if (currentQuestion.questionType === 'select-two' || currentQuestion.questionType === 'pick-from-sets') {
      const cp = currentQuestion.correctPair;
      if (currentQuestion.questionType === 'select-two') {
        isCorrect = selectedPair.length === 2 &&
          ((selectedPair[0] === cp[0] && selectedPair[1] === cp[1]) ||
           (selectedPair[0] === cp[1] && selectedPair[1] === cp[0]));
      } else {
        isCorrect = selectedPair[0] === cp[0] && selectedPair[1] === cp[1];
      }
    } else {
      isCorrect = selectedAnswer === currentQuestion.correct;
    }

    setAnswers([...answers, {
      questionId: currentQuestion.id,
      correct: isCorrect
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setSelectedPair([]);
      setShowFeedback(false);
      setShowTutorChat(false);
      setChatMessages([]);
      setShowFeedbackForm(false);
      setFeedbackText('');
    } else {
      // If viewing a single question from Speed Review, go back instead of showing results
      if (returnToSpeedReview) {
        setCurrentView('speedReview');
        setReturnToSpeedReview(false);
        window.scrollTo(0, speedReviewScrollY);
        return;
      }
      const correctCount = answers.filter(a => a.correct).length;
      markQuestionsAsSeen(quizQuestions);
      updateTopicPerformance(quizQuestions, answers);
      const topicLabel = quizMode === 'daily' ? 'Daily Learning' : quizQuestions[0].topicName;
      saveQuizResult(selectedSubject, topicLabel, correctCount, quizQuestions.length);
      setCurrentView('results');
    }
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
  const handleFindLesson = () => {
    const currentQ = quizQuestions[currentQuestionIndex];
    const topicKey = currentQ.topicKey || selectedTopic;
    const questionId = currentQ.question.id;

    // Determine which mapping file to use
    const englishTopics = ['spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar', 'comprehension'];
    const vrTopics = ['hiddenWords', 'letterCodes', 'letterMove', 'letterPairSeries', 'letterSums', 'logicAndLanguage', 'missingLettersWords', 'numberSeries', 'numberWordCodes', 'oddTwoOut', 'sharedLetter', 'verbalAnalogies', 'wordCodeAnalogies', 'compoundWords', 'antonyms', 'synonyms'];
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

      const systemPrompt = `You are a friendly, patient tutor helping a 9-year-old child understand a question from their 11+ exam practice.

The question was: "${currentQuestion.question}"
${questionContext}

The explanation already given was: "${currentQuestion.explanation || 'None provided.'}"

Your job is to:
- Answer their questions in a kind, encouraging way
- If they got it right, you can praise them and help deepen their understanding
- If they got it wrong, help them learn without making them feel bad
- Break things down into simpler steps if needed
- Use examples or analogies that a 9-year-old would understand
- Be patient and supportive
- Keep responses short and clear (2-3 sentences usually)
- Format responses for easy reading: use short paragraphs with a blank line between each point. Never write large blocks of text. Each idea or step should be on its own line.
- If explaining steps, number them clearly with one step per line
- Use encouraging words like "Great question!", "Let me explain that differently", "You're doing great!"
- Relate to things they might know from daily life

Remember: This is a child learning, so be warm, supportive, and make learning fun!`;

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

  const pickQuestionAtDifficulty = (questions, seenIds, targetDifficulty) => {
    // Try to find an unseen question at the target difficulty
    let pool = questions.filter(q => q.difficulty === targetDifficulty && !seenIds.includes(q.id));
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    // Fallback: any unseen question
    pool = questions.filter(q => !seenIds.includes(q.id));
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    // All seen: pick any at target difficulty
    pool = questions.filter(q => q.difficulty === targetDifficulty);
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    // Last resort: any question
    return questions[Math.floor(Math.random() * questions.length)];
  };

  const selectDailyQuestions = () => {
    const topics = questionData[selectedSubject].topics;
    const topicKeys = shuffleArray(Object.keys(topics)).slice(0, 10);
    // Difficulty targets: 3 easy, 4 medium, 3 hard
    const diffTargets = shuffleArray([1,1,1, 2,2,2,2, 3,3,3]);
    const selected = [];
    const updatedSeen = { ...seenQuestions };

    topicKeys.forEach((key, i) => {
      const topicQuestions = topics[key].questions;
      const seenIds = updatedSeen[key] || [];
      // Reset seen list if nearly exhausted
      const unseenCount = topicQuestions.filter(q => !seenIds.includes(q.id)).length;
      if (unseenCount < 1) {
        updatedSeen[key] = [];
      }
      const question = pickQuestionAtDifficulty(topicQuestions, updatedSeen[key] || [], diffTargets[i]);
      selected.push({ question, topicKey: key, topicName: topics[key].name });
    });

    return shuffleArray(selected);
  };

  const selectFocusedQuestions = (topicKey) => {
    const topics = questionData[selectedSubject].topics;
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
      return selected.slice(0, 14); // Allow slightly more if a passage has many questions
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

  const markQuestionsAsSeen = (questions) => {
    const updatedSeen = { ...seenQuestions };
    questions.forEach(({ question, topicKey }) => {
      if (!updatedSeen[topicKey]) updatedSeen[topicKey] = [];
      if (!updatedSeen[topicKey].includes(question.id)) {
        updatedSeen[topicKey].push(question.id);
      }
    });
    setSeenQuestions(updatedSeen);
    localStorage.setItem('seen-questions', JSON.stringify(updatedSeen));
  };

  const updateTopicPerformance = (sessionQuestions, sessionAnswers) => {
    const updated = { ...topicPerformance };
    sessionQuestions.forEach((q, i) => {
      const key = q.topicKey;
      if (!updated[key]) updated[key] = { correct: 0, total: 0 };
      updated[key].total += 1;
      if (sessionAnswers[i]?.correct) updated[key].correct += 1;
    });
    setTopicPerformance(updated);
    localStorage.setItem('topic-performance', JSON.stringify(updated));
  };

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
        const vrTopics = ['hiddenWords', 'letterCodes', 'letterMove', 'letterPairSeries', 'letterSums', 'logicAndLanguage', 'missingLettersWords', 'numberSeries', 'numberWordCodes', 'oddTwoOut', 'sharedLetter', 'verbalAnalogies', 'wordCodeAnalogies', 'compoundWords'];
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
        const vrTopics = ['hiddenWords', 'letterCodes', 'letterMove', 'letterPairSeries', 'letterSums', 'logicAndLanguage', 'missingLettersWords', 'numberSeries', 'numberWordCodes', 'oddTwoOut', 'sharedLetter', 'verbalAnalogies', 'wordCodeAnalogies', 'compoundWords', 'antonyms', 'synonyms'];
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

  if (currentView === 'home') {
    return (
      <HomeScreen
        currentUser={currentUser}
        onSetCurrentUser={handleSetCurrentUser}
        onSubjectSelect={handleSubjectSelect}
        onViewProgress={() => setCurrentView('progress')}
        onSpeedReview={() => setCurrentView('speedReview')}
      />
    );
  }

  if (currentView === 'learningMode') {
    return (
      <LearningModeScreen
        subjectName={questionData[selectedSubject]?.name}
        onStartDaily={handleStartDaily}
        onFocusedLearning={() => setCurrentView('topics')}
        onBack={handleHome}
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
        backLabel={returnToSpeedReview ? "Back to Speed Review" : "Back to Topics"}
        onComplete={(lessonRecord) => {
          if (lessonRecord) {
            const updated = { ...lessonHistory };
            if (!updated[selectedTopic]) updated[selectedTopic] = { shown: [] };
            updated[selectedTopic].shown.push(lessonRecord);
            updated[selectedTopic].lastSubConcept = lessonRecord.subConcept;
            updated[selectedTopic].lastTemplateType = lessonRecord.templateType;
            setLessonHistory(updated);
            localStorage.setItem('lesson-history', JSON.stringify(updated));
          }
          setForcedLessonResult(null);
          // If launched from quiz "Find Me a Lesson", show "Did that help?" screen
          if (lessonFromQuiz) {
            setShowDidItHelp(true);
            setCurrentView('quiz');
          } else if (returnToSpeedReview) {
            setReturnToSpeedReview(false);
            setCurrentView('speedReview');
          } else {
            setCurrentView('quiz');
          }
        }}
        onBack={() => {
          setForcedLessonResult(null);
          if (returnToSpeedReview) {
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
        <div className="max-w-md mx-auto card-elevated p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EDE8FF] flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#6C5CE7]" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-2">Did that lesson help?</h2>
          <p className="text-gray-600 mb-6">We showed you the <strong>{lessonFromQuiz.subConceptName}</strong> lesson. Did it help you understand the question better?</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setShowDidItHelp(false);
                setLessonFromQuiz(null);
              }}
              className="px-8 py-3 bg-[#00B894] hover:bg-[#00A381] text-white font-bold rounded-xl text-lg transition-colors"
            >
              Yes, it helped!
            </button>
            <button
              onClick={() => {
                // Log to Google Sheet
                submitToGoogleSheet({
                  type: 'lesson-not-helpful',
                  submitter: currentUser || 'Unknown',
                  topicKey: lessonFromQuiz.topicKey,
                  questionId: String(lessonFromQuiz.questionId),
                  subConceptId: lessonFromQuiz.subConceptId,
                  subConceptName: lessonFromQuiz.subConceptName,
                  date: new Date().toISOString(),
                });
                setShowDidItHelp(false);
                setLessonFromQuiz(null);
                // Open AI Tutor chat with a helpful prompt
                setShowTutorChat(true);
                setChatMessages([{
                  role: 'assistant',
                  content: "The lesson didn't quite click? No worries — I'm here to help! 😊 Let me try explaining this question in a different way. What part are you finding tricky?"
                }]);
              }}
              className="px-8 py-3 bg-[#FF6B6B] hover:bg-[#E55A5A] text-white font-bold rounded-xl text-lg transition-colors"
            >
              Not really
            </button>
          </div>
        </div>
      </div>
    );
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
        onAnswerSelect={handleAnswerSelect}
        onSelectTwoToggle={handleSelectTwoToggle}
        onPickFromSet={handlePickFromSet}
        onCheckAnswer={handleCheckAnswer}
        onNextQuestion={handleNextQuestion}
        onFindLesson={handleFindLesson}
        onAskTutor={handleAskTutor}
        onSendMessage={handleSendMessage}
        onUserMessageChange={setUserMessage}
        onToggleListening={(target) => toggleListening(target === 'feedback' ? setFeedbackText : setUserMessage)}
        onFeedbackTextChange={setFeedbackText}
        onSubmitFeedback={submitQuestionFeedback}
        onToggleFeedbackForm={(val) => val === false ? setShowFeedbackForm(false) : setShowFeedbackForm(!showFeedbackForm)}
        onBack={() => {
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
        onRetry={handleRetry}
        onChooseTopic={() => setCurrentView(quizMode === 'daily' ? 'learningMode' : 'topics')}
        onHome={handleHome}
      />
    );
  }

  if (currentView === 'progress') {
    return (
      <ProgressScreen
        quizHistory={quizHistory}
        questionData={questionData}
        onHome={handleHome}
      />
    );
  }
}

function SubjectCard({ title, icon: Icon, gradient, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${gradient ? `bg-gradient-to-br ${gradient}` : color} text-white rounded-2xl p-8 transition-all transform hover:scale-[1.03] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed animate-scale-in`}
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <Icon className="w-9 h-9" />
      </div>
      <h3 className="text-2xl font-heading font-bold">{title}</h3>
      {disabled && <p className="text-sm mt-2 opacity-80">Coming Soon</p>}
    </button>
  );
}

function getTopicBadge(pct) {
  if (pct >= 90) return { label: 'Jedi Master', icon: Crown, color: 'text-[#F39C12]', bg: 'bg-[#FDCB6E]/20' };
  if (pct >= 70) return { label: 'Space Captain', icon: Rocket, color: 'text-[#0984E3]', bg: 'bg-[#0984E3]/10' };
  if (pct >= 50) return { label: 'Star Cadet', icon: Star, color: 'text-[#6C5CE7]', bg: 'bg-[#6C5CE7]/10' };
  if (pct >= 30) return { label: 'Rocket Rookie', icon: Wrench, color: 'text-[#F39C12]', bg: 'bg-[#F39C12]/10' };
  return { label: 'Launch Pad', icon: Target, color: 'text-[#636E72]', bg: 'bg-gray-100' };
}

function TopicCard({ title, questionCount, performance, onClick }) {
  let perfDisplay = null;
  let perfPct = null;
  let perfBarColor = '#EDE8FF';
  if (performance) {
    if (performance.total >= 5) {
      const pct = Math.round((performance.correct / performance.total) * 100);
      perfPct = pct;
      perfBarColor = pct >= 70 ? '#00B894' : pct >= 40 ? '#FDCB6E' : '#FF6B6B';
      const pctColor = pct >= 70 ? 'text-[#00B894]' : pct >= 40 ? 'text-[#F39C12]' : 'text-[#FF6B6B]';
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
      perfDisplay = <p className="text-sm text-[#636E72] mt-1">Not enough data</p>;
    }
  }
  return (
    <button
      onClick={onClick}
      className="w-full card hover:bg-[#EDE8FF]/30 rounded-xl p-6 transition-all flex items-center justify-between group animate-fade-in-up overflow-hidden relative"
    >
      {/* Left performance bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: perfPct !== null ? perfBarColor : '#EDE8FF' }}
      />
      <div className="text-left pl-3">
        <h4 className="text-xl font-heading font-bold text-[#2D3436] mb-1">{title}</h4>
        {questionCount && <p className="text-[#6C5CE7] font-medium">{questionCount} questions</p>}
        {perfDisplay}
      </div>
      <ChevronRight className="w-8 h-8 text-[#A29BFE] group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

export default App;