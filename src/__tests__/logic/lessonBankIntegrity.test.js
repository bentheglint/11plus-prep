import { lessonBank, selectLesson } from '../../microLessons/lessonData';

// Every topic in the lesson bank must be able to select and shape a lesson
// without throwing. balanceEquations shipped without a variableSets array and
// undefined.filter crashed MicroLessonScreen the moment a child opened the
// topic (12 Jun 2026) — this suite makes that class of authoring gap a test
// failure instead of a production blank screen.
describe('lesson bank integrity', () => {
  const topicKeys = Object.keys(lessonBank);

  test('lesson bank has topics', () => {
    expect(topicKeys.length).toBeGreaterThan(0);
  });

  test.each(topicKeys)('selectLesson(%s) returns a lesson without throwing', (key) => {
    // Run several times — selection is randomised across sub-concepts,
    // template types, and variable sets.
    for (let i = 0; i < 10; i++) {
      const result = selectLesson(key, {}, {}, 'integrity-test');
      expect(result).not.toBeNull();
      expect(result.lesson).toBeDefined();
      expect(Array.isArray(result.lesson.screens) || result.lesson.templateType).toBeTruthy();
    }
  });

  test.each(topicKeys)('every lesson in %s has a non-empty variableSets array', (key) => {
    for (const sc of lessonBank[key].subConcepts) {
      for (const lesson of sc.lessons || []) {
        expect(Array.isArray(lesson.variableSets)).toBe(true);
        expect(lesson.variableSets.length).toBeGreaterThan(0);
      }
    }
  });

  test('balanceEquations selects with experienced-learner history (hard-set path)', () => {
    // topicVisits >= 9 exercises the allowHard branch over the [null]/empty-set path
    const history = { balanceEquations: { shown: Array.from({ length: 12 }, (_, i) => ({ subConcept: 'balance-equations', date: `2026-06-0${(i % 9) + 1}` })) } };
    for (let i = 0; i < 10; i++) {
      expect(() => selectLesson('balanceEquations', {}, history, 'integrity-test')).not.toThrow();
    }
  });

  // MicroLessonScreen calls screen.interaction.getOptions(vars) and
  // .correctAnswer(vars) DIRECTLY, with no typeof guard (MicroLessonScreen.js
  // ~817/824). A multiple-choice screen authored without those as functions
  // throws "getOptions is not a function" and blanks the lesson the moment a
  // child reaches the interact screen (Sentry JAVASCRIPT-REACT-3, 24 May 2026).
  // Walk every screen of every lesson and pin the contract.
  const everyLesson = [];
  for (const key of topicKeys) {
    for (const sc of lessonBank[key].subConcepts) {
      for (const lesson of sc.lessons || []) {
        everyLesson.push([`${key}/${sc.id}/${lesson.id}`, lesson]);
      }
    }
  }

  test.each(everyLesson)('multiple-choice screens in %s expose getOptions + correctAnswer as functions', (_label, lesson) => {
    const sampleVars = (lesson.variableSets && lesson.variableSets[0]) || {};
    for (const screen of lesson.screens || []) {
      const interaction = screen?.interaction;
      if (interaction?.type !== 'multiple-choice') continue;

      expect(typeof interaction.getOptions).toBe('function');
      expect(typeof interaction.correctAnswer).toBe('function');

      // Exercise both against a real variable set — must not throw, and
      // getOptions must yield a non-empty, spreadable array (the screen does
      // [...getOptions(vars)] then shuffles).
      let options;
      expect(() => { options = interaction.getOptions(sampleVars); }).not.toThrow();
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
      expect(() => interaction.correctAnswer(sampleVars)).not.toThrow();
    }
  });
});
