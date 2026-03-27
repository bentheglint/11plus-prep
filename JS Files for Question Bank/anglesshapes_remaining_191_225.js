    // ============================================
    // IRREGULAR-POLYGON-ANGLE QUESTIONS (IDs 191-198)
    // 0 x D1, 4 x D2, 4 x D3
    // ============================================

    // --- D2: Pentagon / Hexagon with missing angle ---

    {
      id: 191,
      difficulty: 2,
      question: "A pentagon has angles of 108°, 112°, 95°, 120° and x°. What is x?",
      options: ["95°", "100°", "105°", "110°", "115°"],
      correct: 2,
      explanation: "The sum of interior angles in a pentagon is (5−2) × 180° = 540°. So 108° + 112° + 95° + 120° + x = 540°. The four known angles add up to 435°. Therefore x = 540 − 435 = 105°. ✓"
    },
    {
      id: 192,
      difficulty: 2,
      question: "Grace draws a pentagon with angles 98°, 124°, 106°, 110° and y°. What is y?",
      options: ["92°", "97°", "102°", "107°", "112°"],
      correct: 2,
      explanation: "The sum of interior angles in a pentagon is (5−2) × 180° = 540°. So 98° + 124° + 106° + 110° + y = 540°. The four known angles add up to 438°. Therefore y = 540 − 438 = 102°. ✓"
    },
    {
      id: 193,
      difficulty: 2,
      question: "A hexagon has angles of 130°, 110°, 125°, 115°, 140° and z°. What is z?",
      options: ["90°", "95°", "100°", "105°", "110°"],
      correct: 2,
      explanation: "The sum of interior angles in a hexagon is (6−2) × 180° = 720°. So 130° + 110° + 125° + 115° + 140° + z = 720°. The five known angles add up to 620°. Therefore z = 720 − 620 = 100°. ✓"
    },
    {
      id: 194,
      difficulty: 2,
      question: "A hexagon has angles of 100°, 135°, 120°, 115°, 130° and a°. What is a?",
      options: ["110°", "115°", "120°", "125°", "130°"],
      correct: 2,
      explanation: "The sum of interior angles in a hexagon is (6−2) × 180° = 720°. So 100° + 135° + 120° + 115° + 130° + a = 720°. The five known angles add up to 600°. Therefore a = 720 − 600 = 120°. ✓"
    },

    // --- D3: Heptagon / trickier pentagons ---

    {
      id: 195,
      difficulty: 3,
      question: "A pentagon has angles 100°, 110°, 120°, 130° and x°. Find x.",
      options: ["60°", "70°", "80°", "90°", "100°"],
      correct: 2,
      explanation: "The sum of interior angles in a pentagon is (5−2) × 180° = 540°. So 100° + 110° + 120° + 130° + x = 540°. The four known angles add up to 460°. Therefore x = 540 − 460 = 80°. ✓"
    },
    {
      id: 196,
      difficulty: 3,
      question: "A heptagon (7-sided shape) has six angles of 115°, 130°, 140°, 125°, 135° and 120°. What is the seventh angle?",
      options: ["125°", "130°", "135°", "140°", "145°"],
      correct: 2,
      explanation: "The sum of interior angles in a heptagon is (7−2) × 180° = 900°. The six given angles add up to 115° + 130° + 140° + 125° + 135° + 120° = 765°. So the seventh angle = 900° − 765° = 135°. ✓"
    },
    {
      id: 197,
      difficulty: 3,
      question: "Oliver draws a heptagon (7 sides). Six of the angles are 128°, 132°, 119°, 145°, 126° and 110°. What is the seventh angle?",
      options: ["130°", "135°", "140°", "145°", "150°"],
      correct: 2,
      explanation: "The sum of interior angles in a heptagon is (7−2) × 180° = 900°. The six given angles add up to 128° + 132° + 119° + 145° + 126° + 110° = 760°. So the seventh angle = 900° − 760° = 140°. ✓"
    },
    {
      id: 198,
      difficulty: 3,
      question: "A pentagon has three angles of 108° each. The other two angles are equal. What is each of the equal angles?",
      options: ["98°", "103°", "108°", "113°", "118°"],
      correct: 2,
      explanation: "The sum of interior angles in a pentagon is (5−2) × 180° = 540°. Three angles of 108° give 3 × 108° = 324°. The remaining two equal angles share 540° − 324° = 216°. Each one = 216° ÷ 2 = 108°. ✓"
    },

    // ============================================
    // POLYGON-ANGLES QUESTIONS (IDs 199-204)
    // 4 x D1, 2 x D2, 0 x D3
    // ============================================

    // --- D1: Regular polygon interior angles ---

    {
      id: 199,
      difficulty: 1,
      question: "What is each interior angle of a regular hexagon?",
      options: ["100°", "108°", "110°", "120°", "135°"],
      correct: 3,
      explanation: "The sum of interior angles in a hexagon is (6−2) × 180° = 720°. A regular hexagon has 6 equal angles, so each angle = 720° ÷ 6 = 120°. ✓"
    },
    {
      id: 200,
      difficulty: 1,
      question: "How many degrees is each interior angle of a regular pentagon?",
      options: ["100°", "104°", "108°", "112°", "120°"],
      correct: 2,
      explanation: "The sum of interior angles in a pentagon is (5−2) × 180° = 540°. A regular pentagon has 5 equal angles, so each angle = 540° ÷ 5 = 108°. ✓"
    },
    {
      id: 201,
      difficulty: 1,
      question: "What is the sum of the interior angles in any triangle?",
      options: ["90°", "120°", "180°", "270°", "360°"],
      correct: 2,
      explanation: "The interior angles in any triangle always add up to 180°. This is one of the most important angle facts to remember. ✓"
    },
    {
      id: 202,
      difficulty: 1,
      question: "What is the sum of the interior angles in any quadrilateral?",
      options: ["180°", "270°", "360°", "450°", "540°"],
      correct: 2,
      explanation: "A quadrilateral has 4 sides. The sum of interior angles = (4−2) × 180° = 2 × 180° = 360°. ✓"
    },

    // --- D2: Working backwards or angle sums ---

    {
      id: 203,
      difficulty: 2,
      question: "A regular polygon has interior angles of 120° each. How many sides does it have?",
      options: ["4", "5", "6", "7", "8"],
      correct: 2,
      explanation: "For a regular polygon, each interior angle = ((n−2) × 180°) ÷ n. Setting this equal to 120° gives (n−2) × 180 = 120n. So 180n − 360 = 120n, meaning 60n = 360 and n = 6. It has 6 sides — it's a hexagon. ✓"
    },
    {
      id: 204,
      difficulty: 2,
      question: "What is the sum of the interior angles of a hexagon?",
      options: ["540°", "630°", "720°", "810°", "900°"],
      correct: 2,
      explanation: "The sum of interior angles in any polygon is (n−2) × 180°. For a hexagon, n = 6, so the sum = (6−2) × 180° = 4 × 180° = 720°. ✓"
    },

    // ============================================
    // RIGHT-ANGLED-TRIANGLE QUESTIONS (IDs 205-209)
    // 0 x D1, 3 x D2, 2 x D3
    // ============================================

    // --- D2: Combined with straight line ---

    {
      id: 205,
      difficulty: 2,
      question: "A right-angled triangle sits on a straight line. The right angle is at the bottom-left corner. The angle at the top of the triangle is 35°. What is the angle between the sloping side and the straight line, outside the triangle?",
      options: ["35°", "55°", "125°", "135°", "145°"],
      correct: 2,
      explanation: "The triangle's angles are 90°, 35° and 180° − 90° − 35° = 55°. The bottom-right angle inside the triangle is 55°. The angle between the sloping side and the straight line outside the triangle = 180° − 55° = 125°. ✓"
    },
    {
      id: 206,
      difficulty: 2,
      question: "In a right-angled triangle, one of the other angles is 28°. What is the third angle?",
      options: ["52°", "57°", "62°", "67°", "72°"],
      correct: 2,
      explanation: "Angles in a triangle add up to 180°. We have 90° + 28° + third angle = 180°. The third angle = 180° − 90° − 28° = 62°. ✓"
    },
    {
      id: 207,
      difficulty: 2,
      question: "Sophie draws a right-angled triangle on a straight line. The angle at the top of the triangle is 50°. What is the angle between the sloping side of the triangle and the straight line, outside the triangle?",
      options: ["40°", "130°", "140°", "150°", "160°"],
      correct: 2,
      explanation: "The triangle's angles are 90°, 50° and 180° − 90° − 50° = 40°. The base angle next to the straight line is 40°. The angle outside the triangle on the straight line = 180° − 40° = 140°. ✓"
    },

    // --- D3: Multi-step ---

    {
      id: 208,
      difficulty: 3,
      question: "In a right-angled triangle, one angle is twice the size of the other non-right angle. What are the two smaller angles?",
      options: ["20° and 40°", "25° and 50°", "30° and 60°", "35° and 70°", "40° and 80°"],
      correct: 2,
      explanation: "Let the smaller angle be x°. The other non-right angle is 2x°. So 90° + x + 2x = 180°. This gives 3x = 90°, so x = 30°. The two angles are 30° and 60°. ✓"
    },
    {
      id: 209,
      difficulty: 3,
      question: "In a right-angled triangle, one angle is three times the size of the other non-right angle. What is the smallest angle in the triangle?",
      options: ["18.5°", "20°", "22.5°", "25°", "27.5°"],
      correct: 2,
      explanation: "Let the smaller non-right angle be x°. The other is 3x°. So 90° + x + 3x = 180°. This gives 4x = 90°, so x = 22.5°. The smallest angle is 22.5°. ✓"
    },

    // ============================================
    // ISOSCELES-TRIANGLE QUESTIONS (IDs 210-212)
    // 3 x D1, 0 x D2, 0 x D3
    // ============================================

    {
      id: 210,
      difficulty: 1,
      question: "An isosceles triangle has two equal angles of 70°. What is the third angle?",
      options: ["30°", "35°", "40°", "45°", "50°"],
      correct: 2,
      explanation: "In an isosceles triangle, two angles are equal. Angles in a triangle add up to 180°. So 70° + 70° + third angle = 180°. The third angle = 180° − 140° = 40°. ✓"
    },
    {
      id: 211,
      difficulty: 1,
      question: "An isosceles triangle has two equal angles of 50°. What is the third angle?",
      options: ["60°", "70°", "80°", "90°", "100°"],
      correct: 2,
      explanation: "In an isosceles triangle, two angles are equal. Angles in a triangle add up to 180°. So 50° + 50° + third angle = 180°. The third angle = 180° − 100° = 80°. ✓"
    },
    {
      id: 212,
      difficulty: 1,
      question: "An isosceles triangle has two equal angles of 55°. What is the third angle?",
      options: ["60°", "65°", "70°", "75°", "80°"],
      correct: 2,
      explanation: "In an isosceles triangle, two angles are equal. Angles in a triangle add up to 180°. So 55° + 55° + third angle = 180°. The third angle = 180° − 110° = 70°. ✓"
    },

    // ============================================
    // EXTERIOR-ANGLES QUESTIONS (IDs 213-216)
    // 2 x D1, 2 x D2, 0 x D3
    // ============================================

    // --- D1: Basic exterior angle ---

    {
      id: 213,
      difficulty: 1,
      question: "The interior angle of a triangle at one vertex is 60°. What is the exterior angle at that vertex?",
      options: ["60°", "90°", "100°", "120°", "130°"],
      correct: 3,
      explanation: "An interior angle and its exterior angle sit on a straight line, so they add up to 180°. The exterior angle = 180° − 60° = 120°. ✓"
    },
    {
      id: 214,
      difficulty: 1,
      question: "The interior angle of a triangle at one vertex is 75°. What is the exterior angle at that vertex?",
      options: ["85°", "95°", "105°", "115°", "125°"],
      correct: 2,
      explanation: "An interior angle and its exterior angle sit on a straight line, so they add up to 180°. The exterior angle = 180° − 75° = 105°. ✓"
    },

    // --- D2: Using exterior angle theorem ---

    {
      id: 215,
      difficulty: 2,
      question: "The exterior angle of a triangle is 110°. The two non-adjacent interior angles are equal. What is each one?",
      options: ["45°", "50°", "55°", "60°", "65°"],
      correct: 2,
      explanation: "An exterior angle of a triangle equals the sum of the two non-adjacent interior angles. So the two equal angles add up to 110°. Each angle = 110° ÷ 2 = 55°. ✓"
    },
    {
      id: 216,
      difficulty: 2,
      question: "The exterior angle of a triangle is 124°. The two non-adjacent interior angles are equal. What is each one?",
      options: ["52°", "57°", "62°", "67°", "72°"],
      correct: 2,
      explanation: "An exterior angle of a triangle equals the sum of the two non-adjacent interior angles. So the two equal angles add up to 124°. Each angle = 124° ÷ 2 = 62°. ✓"
    },

    // ============================================
    // PARALLEL-LINES QUESTIONS (IDs 217-222)
    // 3 x D1, 3 x D2, 0 x D3
    // ============================================

    // --- D1: Basic corresponding / alternate angles ---

    {
      id: 217,
      difficulty: 1,
      question: "Two parallel lines are cut by a transversal. One angle is 70°. What is the corresponding angle?",
      options: ["70°", "80°", "90°", "100°", "110°"],
      correct: 0,
      explanation: "When a transversal crosses two parallel lines, corresponding angles are equal. So the corresponding angle is also 70°. ✓"
    },
    {
      id: 218,
      difficulty: 1,
      question: "Two parallel lines are cut by a transversal. One angle is 115°. What is the alternate angle?",
      options: ["55°", "65°", "75°", "105°", "115°"],
      correct: 4,
      explanation: "When a transversal crosses two parallel lines, alternate angles are equal. So the alternate angle is also 115°. ✓"
    },
    {
      id: 219,
      difficulty: 1,
      question: "Two parallel lines are cut by a transversal. One angle is 48°. What is the corresponding angle on the other parallel line?",
      options: ["42°", "48°", "52°", "132°", "138°"],
      correct: 1,
      explanation: "When a transversal crosses two parallel lines, corresponding angles are equal. So the corresponding angle is also 48°. ✓"
    },

    // --- D2: Finding co-interior or multiple angles ---

    {
      id: 220,
      difficulty: 2,
      question: "Two parallel lines are cut by a transversal. One angle is 55°. Co-interior angles (same side of the transversal, between the parallel lines) add up to 180°. What is the co-interior angle?",
      options: ["55°", "105°", "115°", "125°", "135°"],
      correct: 3,
      explanation: "Co-interior angles (also called allied angles) add up to 180°. So the co-interior angle = 180° − 55° = 125°. ✓"
    },
    {
      id: 221,
      difficulty: 2,
      question: "Two parallel lines are cut by a transversal. One angle is 68°. What is the co-interior angle on the same side?",
      options: ["68°", "102°", "108°", "112°", "122°"],
      correct: 3,
      explanation: "Co-interior angles add up to 180°. So the co-interior angle = 180° − 68° = 112°. ✓"
    },
    {
      id: 222,
      difficulty: 2,
      question: "Two parallel lines are cut by a transversal forming an angle of 72°. What are the two different angle sizes formed at each intersection?",
      options: ["72° and 98°", "72° and 108°", "72° and 118°", "72° and 128°", "72° and 138°"],
      correct: 1,
      explanation: "At each intersection, adjacent angles on a straight line add up to 180°. So the two angle sizes are 72° and 180° − 72° = 108°. ✓"
    },

    // ============================================
    // ALGEBRAIC-ANGLES QUESTIONS (IDs 223-225)
    // 3 x D1, 0 x D2, 0 x D3
    // ============================================

    {
      id: 223,
      difficulty: 1,
      question: "Two angles on a straight line are x° and 130°. What is x?",
      options: ["40°", "50°", "60°", "70°", "80°"],
      correct: 1,
      explanation: "Angles on a straight line add up to 180°. So x + 130 = 180. Therefore x = 180 − 130 = 50°. ✓"
    },
    {
      id: 224,
      difficulty: 1,
      question: "Two angles on a straight line are x° and 95°. What is x?",
      options: ["75°", "80°", "85°", "90°", "95°"],
      correct: 2,
      explanation: "Angles on a straight line add up to 180°. So x + 95 = 180. Therefore x = 180 − 95 = 85°. ✓"
    },
    {
      id: 225,
      difficulty: 1,
      question: "Angles around a point are x°, 100° and 150°. What is x?",
      options: ["100°", "105°", "110°", "115°", "120°"],
      correct: 2,
      explanation: "Angles around a point add up to 360°. So x + 100 + 150 = 360. Therefore x = 360 − 250 = 110°. ✓"
    }