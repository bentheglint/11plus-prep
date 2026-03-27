/**
 * visual-mapping.js — Source-of-truth mapping from topic/sub-concept to expected visual components
 *
 * Structure:
 *   { topicKey: { _default: { expected, forbidden }, subConceptId: { expected, forbidden } } }
 *
 * Rules:
 *   - `expected`: array of component names appropriate for this sub-concept/topic
 *   - `forbidden`: array of component names that should NEVER appear here
 *   - WorkedExample is always allowed (generic, text-based) — no need to list it
 *   - Sub-concept entries override _default for that sub-concept
 *   - If a sub-concept has no entry, _default applies
 *
 * Used by CHECK-15 in lesson-lint.js
 */

module.exports = {

  // ================================================================
  // MATHS — Geometry topics (strict visual requirements)
  // ================================================================

  areaperimeter: {
    _default: {
      expected: ['RectangleDiagram', 'TriangleAreaDiagram', 'ParallelogramDiagram', 'LShapeDiagram'],
      forbidden: ['BarModel', 'NumberLine', 'AngleDiagram', 'CuboidDiagram', 'BusStopDiagram', 'SDTTriangle']
    },
    'area-triangles': { expected: ['TriangleAreaDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'area-triangles-steps': { expected: ['TriangleAreaDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'area-parallelograms': { expected: ['ParallelogramDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'area-parallelograms-steps': { expected: ['ParallelogramDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'compound-shapes': { expected: ['LShapeDiagram', 'RectangleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'compound-shapes-steps': { expected: ['LShapeDiagram', 'RectangleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'area-vs-perimeter': { expected: ['RectangleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'area-vs-perimeter-discovery': { expected: ['RectangleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'paths-and-borders': { expected: ['RectangleDiagram', 'LShapeDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'paths-and-borders-curiosity': { expected: ['RectangleDiagram', 'LShapeDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'paths-and-borders-steps': { expected: ['RectangleDiagram', 'LShapeDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'perimeter-rectangles': { expected: ['RectangleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'perimeter-rectangles-steps': { expected: ['RectangleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'missing-side-area': { expected: ['RectangleDiagram', 'TriangleAreaDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'missing-side-area-steps': { expected: ['RectangleDiagram', 'TriangleAreaDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'missing-side-perimeter': { expected: ['RectangleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'missing-side-perimeter-steps': { expected: ['RectangleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'unit-conversion': { expected: ['RectangleDiagram'], forbidden: ['BarModel'] },
    'unit-conversion-steps': { expected: ['RectangleDiagram'], forbidden: ['BarModel'] },
  },

  anglesshapes: {
    _default: {
      expected: ['AngleDisplay', 'AngleDiagram', 'QuadShape', 'ParallelLines', 'ExteriorAngle', 'RegularPolygon'],
      forbidden: ['BarModel', 'NumberLine', 'RectangleDiagram', 'CuboidDiagram', 'BusStopDiagram', 'SDTTriangle']
    },
    'angle-types': { expected: ['AngleDisplay'], forbidden: ['BarModel', 'NumberLine'] },
    'angle-types-discovery': { expected: ['AngleDisplay'], forbidden: ['BarModel', 'NumberLine'] },
    'straight-line': { expected: ['AngleDisplay'], forbidden: ['BarModel', 'NumberLine'] },
    'straight-line-steps': { expected: ['AngleDisplay'], forbidden: ['BarModel', 'NumberLine'] },
    'around-a-point': { expected: ['AngleDisplay'], forbidden: ['BarModel', 'NumberLine'] },
    'around-a-point-steps': { expected: ['AngleDisplay'], forbidden: ['BarModel', 'NumberLine'] },
    'quadrilateral-angles': { expected: ['QuadShape'], forbidden: ['BarModel', 'NumberLine'] },
    'quadrilateral-angles-steps': { expected: ['QuadShape'], forbidden: ['BarModel', 'NumberLine'] },
    'isosceles-triangle': { expected: ['AngleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'isosceles-triangle-steps': { expected: ['AngleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'right-angled-triangle': { expected: ['AngleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'right-angled-triangle-steps': { expected: ['AngleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'exterior-angles': { expected: ['ExteriorAngle'], forbidden: ['BarModel', 'NumberLine'] },
    'exterior-angles-steps': { expected: ['ExteriorAngle'], forbidden: ['BarModel', 'NumberLine'] },
    'parallel-lines': { expected: ['ParallelLines'], forbidden: ['BarModel', 'NumberLine'] },
    'parallel-lines-steps': { expected: ['ParallelLines'], forbidden: ['BarModel', 'NumberLine'] },
    'polygon-angles': { expected: ['RegularPolygon'], forbidden: ['BarModel', 'NumberLine'] },
    'polygon-angles-steps': { expected: ['RegularPolygon'], forbidden: ['BarModel', 'NumberLine'] },
    'irregular-polygon-angle': { expected: ['RegularPolygon', 'QuadShape'], forbidden: ['BarModel', 'NumberLine'] },
    'irregular-polygon-angle-steps': { expected: ['RegularPolygon', 'QuadShape'], forbidden: ['BarModel', 'NumberLine'] },
    'algebraic-angles': { expected: ['AngleDisplay', 'AngleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
    'algebraic-angles-steps': { expected: ['AngleDisplay', 'AngleDiagram'], forbidden: ['BarModel', 'NumberLine'] },
  },

  volume: {
    _default: {
      expected: ['CuboidDiagram'],
      forbidden: ['BarModel', 'NumberLine', 'RectangleDiagram', 'AngleDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  // ================================================================
  // MATHS — Arithmetic topics (BarModel is fine, geometry is not)
  // ================================================================

  longdivision: {
    _default: {
      expected: ['BusStopDiagram', 'ColumnMethod'],
      forbidden: ['AngleDiagram', 'RectangleDiagram', 'CuboidDiagram', 'SDTTriangle']
    },
    // BarModel is forbidden in sub-concepts where BusStopDiagram should be used
    'sharing-equally': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'sharing-equally-curiosity': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'sharing-equally-mistake': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'long-division-method': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'long-division-method-steps': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'short-division-remainders': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'short-division-remainders-steps': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'interpreting-remainders': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'interpreting-remainders-steps': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'dividing-word-problems': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'dividing-word-problems-steps': { expected: ['BusStopDiagram'], forbidden: ['BarModel'] },
    'estimation-checking': { expected: ['BusStopDiagram', 'NumberLine'], forbidden: ['BarModel'] },
    'estimation-checking-steps': { expected: ['BusStopDiagram', 'NumberLine'], forbidden: ['BarModel'] },
  },

  longmultiplication: {
    _default: {
      expected: ['GridModel', 'ColumnMethod'],
      forbidden: ['AngleDiagram', 'RectangleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  speeddistancetime: {
    _default: {
      expected: ['SDTTriangle', 'NumberLine'],
      forbidden: ['AngleDiagram', 'RectangleDiagram', 'CuboidDiagram', 'BusStopDiagram']
    },
    'converting-units-sdt': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'converting-units-sdt-steps': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'average-speed': { expected: ['SDTTriangle'], forbidden: ['BarModel'] },
    'average-speed-steps': { expected: ['SDTTriangle'], forbidden: ['BarModel'] },
    'calculate-distance': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'calculate-distance-steps': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'calculate-time': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'calculate-time-steps': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'minutes-to-hours': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'minutes-to-hours-steps': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'metres-to-km': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'metres-to-km-steps': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'time-in-minutes': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
    'time-in-minutes-steps': { expected: ['SDTTriangle', 'NumberLine'], forbidden: ['BarModel'] },
  },

  // ================================================================
  // MATHS — Number topics (BarModel + NumberLine fine)
  // ================================================================

  fractions: {
    _default: {
      expected: ['BarModel', 'NumberLine'],
      forbidden: ['AngleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  decimals: {
    _default: {
      expected: ['NumberLine', 'PlaceValueChart', 'BarModel'],
      forbidden: ['AngleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  percentages: {
    _default: {
      expected: ['BarModel', 'NumberLine'],
      forbidden: ['AngleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  ratio: {
    _default: {
      expected: ['BarModel'],
      forbidden: ['AngleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  negativenumbers: {
    _default: {
      expected: ['NumberLine'],
      forbidden: ['AngleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  placevalue: {
    _default: {
      expected: ['PlaceValueChart', 'NumberLine'],
      forbidden: ['AngleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  algebra: {
    _default: {
      expected: ['FunctionMachine', 'NumberLine', 'BarModel'],
      forbidden: ['CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  sequences: {
    _default: {
      expected: ['SequenceChain', 'NumberLine'],
      forbidden: ['AngleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  primenumbersfactors: {
    _default: {
      expected: ['NumberLine', 'GridModel'],
      forbidden: ['AngleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram']
    },
  },

  datahandling: {
    _default: {
      expected: ['BarModel', 'NumberLine'],
      forbidden: ['AngleDiagram', 'CuboidDiagram', 'SDTTriangle', 'BusStopDiagram', 'RectangleDiagram']
    },
    // Pie charts need a new component — flag but don't forbid BarModel as interim
    'reading-pie-charts': { expected: ['BarModel'], forbidden: [] },
    'reading-pie-charts-steps': { expected: ['BarModel'], forbidden: [] },
  },

  // ================================================================
  // ENGLISH — SentenceDisplay is primary
  // ================================================================

  antonyms: { _default: { expected: ['SentenceDisplay', 'AnalogyDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  compoundwords: { _default: { expected: ['SentenceDisplay', 'LetterTiles'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  comprehension: { _default: { expected: ['SentenceDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  grammar: { _default: { expected: ['SentenceDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  punctuation: { _default: { expected: ['SentenceDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  spelling: { _default: { expected: ['SentenceDisplay', 'LetterTiles'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  synonyms: { _default: { expected: ['SentenceDisplay', 'AnalogyDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  vocabulary: { _default: { expected: ['SentenceDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  wordclass: { _default: { expected: ['SentenceDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },

  // ================================================================
  // VERBAL REASONING — Mixed visual needs
  // ================================================================

  hiddenwords: { _default: { expected: ['LetterTiles', 'SentenceDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  lettercodes: { _default: { expected: ['CodeTable', 'LetterTiles', 'AlphabetLine'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  lettermove: { _default: { expected: ['AlphabetLine', 'LetterTiles'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  letterpairseries: { _default: { expected: ['AlphabetLine', 'LetterTiles', 'SequenceChain'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  lettersums: { _default: { expected: ['AlphabetLine', 'CodeTable', 'LetterTiles'], forbidden: ['AngleDiagram', 'CuboidDiagram'] } },
  logicandlanguage: { _default: { expected: ['SentenceDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  missingletterswords: { _default: { expected: ['LetterTiles', 'SentenceDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  numberseries: { _default: { expected: ['SequenceChain', 'NumberLine'], forbidden: ['AngleDiagram', 'CuboidDiagram'] } },
  numberwordcodes: { _default: { expected: ['CodeTable', 'LetterTiles'], forbidden: ['AngleDiagram', 'CuboidDiagram'] } },
  oddtwoout: { _default: { expected: ['AnalogyDisplay', 'SentenceDisplay', 'WordChipsDisplay'], forbidden: ['AngleDiagram', 'CuboidDiagram'] } },
  sharedletter: { _default: { expected: ['LetterTiles'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  verbalanalogies: { _default: { expected: ['AnalogyDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
  wordcodeanalogies: { _default: { expected: ['CodeTable', 'AnalogyDisplay'], forbidden: ['NumberLine', 'AngleDiagram', 'CuboidDiagram'] } },
};
