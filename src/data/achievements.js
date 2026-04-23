// Achievement definitions for the PrepStep app
// Each achievement has a check function that receives user stats
// "Prep Points" is our points system name (placeholder for rebranding)

import { Rocket, Flame, Star, Crown, Trophy, Target, Calculator, BookOpen, Brain, TrendingUp, Zap, Award } from 'lucide-react';

const ACHIEVEMENTS = [
  // --- Getting Started ---
  {
    id: 'first-quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: Rocket,
    colour: '#0770C2',
    check: (s) => s.totalQuizzes >= 1,
  },
  {
    id: 'questions-50',
    name: 'Half Century',
    description: 'Answer 50 questions',
    icon: Target,
    colour: '#6C5CE7',
    check: (s) => s.totalQuestions >= 50,
  },
  {
    id: 'questions-100',
    name: 'Century',
    description: 'Answer 100 questions',
    icon: Target,
    colour: '#6C5CE7',
    check: (s) => s.totalQuestions >= 100,
  },
  {
    id: 'questions-500',
    name: 'Fantastic Five Hundred',
    description: 'Answer 500 questions',
    icon: Trophy,
    colour: '#F39C12',
    check: (s) => s.totalQuestions >= 500,
  },
  {
    id: 'questions-1000',
    name: 'Grand Master',
    description: 'Answer 1,000 questions',
    icon: Crown,
    colour: '#FDCB6E',
    check: (s) => s.totalQuestions >= 1000,
  },

  // --- Streaks ---
  {
    id: 'streak-3',
    name: 'Getting Going',
    description: '3-day practice streak',
    icon: Flame,
    colour: '#FF6B6B',
    check: (s) => s.longestStreak >= 3,
  },
  {
    id: 'streak-7',
    name: 'On Fire!',
    description: '7-day practice streak',
    icon: Flame,
    colour: '#FF6B6B',
    check: (s) => s.longestStreak >= 7,
  },
  {
    id: 'streak-14',
    name: 'Unstoppable',
    description: '14-day practice streak',
    icon: Flame,
    colour: '#E84393',
    check: (s) => s.longestStreak >= 14,
  },
  {
    id: 'streak-30',
    name: 'Legend',
    description: '30-day practice streak',
    icon: Crown,
    colour: '#FDCB6E',
    check: (s) => s.longestStreak >= 30,
  },

  // --- Scores ---
  {
    id: 'perfect-score',
    name: 'Perfect 10',
    description: 'Score 100% on a quiz',
    icon: Star,
    colour: '#FDCB6E',
    check: (s) => s.hasPerfectScore,
  },
  {
    id: 'score-80-five',
    name: 'Consistent Star',
    description: 'Score 80%+ on 5 quizzes',
    icon: Award,
    colour: '#007D62',
    check: (s) => s.highScoreCount >= 5,
  },

  // --- Subject Explorers ---
  {
    id: 'explore-maths',
    name: 'Maths Explorer',
    description: 'Try every Maths topic',
    icon: Calculator,
    colour: '#0770C2',
    check: (s) => s.mathsTopicsCovered >= 16,
  },
  {
    id: 'explore-english',
    name: 'English Explorer',
    description: 'Try every English topic',
    icon: BookOpen,
    colour: '#007D62',
    check: (s) => s.englishTopicsCovered >= 6,
  },
  {
    id: 'explore-vr',
    name: 'VR Explorer',
    description: 'Try every VR topic',
    icon: Brain,
    colour: '#6C5CE7',
    check: (s) => s.vrTopicsCovered >= 16,
  },

  // --- Mastery ---
  {
    id: 'first-mastery',
    name: 'Topic Master',
    description: 'Reach 5 stars on any topic',
    icon: Star,
    colour: '#FDCB6E',
    check: (s) => s.masteredTopics >= 1,
  },
  {
    id: 'mastery-5',
    name: 'Star Collector',
    description: 'Reach 5 stars on 5 topics',
    icon: Crown,
    colour: '#FDCB6E',
    check: (s) => s.masteredTopics >= 5,
  },

  // --- Improvement ---
  {
    id: 'big-leap',
    name: 'Big Leap',
    description: 'Improve 20%+ on a topic',
    icon: TrendingUp,
    colour: '#007D62',
    check: (s) => s.biggestImprovement >= 20,
  },

  // --- Mock Tests ---
  {
    id: 'first-mock',
    name: 'Test Ready',
    description: 'Complete your first mock test',
    icon: Zap,
    colour: '#6C5CE7',
    check: (s) => s.mockTestCount >= 1,
  },
  {
    id: 'mock-80',
    name: 'Exam Ready',
    description: 'Score 80%+ on a mock test',
    icon: Trophy,
    colour: '#007D62',
    check: (s) => s.bestMockScore >= 80,
  },
];

export default ACHIEVEMENTS;
