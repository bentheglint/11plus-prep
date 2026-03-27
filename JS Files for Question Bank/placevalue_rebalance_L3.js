// PLACE VALUE AND ROUNDING - Level 3 (Hard) Rebalance Questions
// Questions 126-145 (20 questions)
// Generated for 11+ Exam Prep App - GL Assessment Style
// Multi-step, reverse-reasoning, and constraint-based place value problems

    {
      id: 126,
      difficulty: 3,
      question: "A number rounds to 47,000 to the nearest thousand and to 46,500 to the nearest hundred. What are the possible values of its tens digit?",
      options: ["0, 1, 2, 3 or 4 only", "5, 6, 7, 8 or 9 only", "Any digit from 0 to 9", "0 or 5 only", "Only 5"],
      correct: 2,
      explanation: "Rounding to the nearest thousand gives 47,000, so the number is from 46,500 to 47,499. Rounding to the nearest hundred gives 46,500, so the number is from 46,450 to 46,549. Both conditions together mean the number is from 46,450 to 46,549. Numbers like 46,459 have tens digit 5, numbers like 46,503 have tens digit 0, and numbers like 46,549 have tens digit 4. Every digit from 0 to 9 appears as a tens digit somewhere in this range. ✓"
    },
    {
      id: 127,
      difficulty: 3,
      question: "Three different digits are used to make a 3-digit number. When rounded to the nearest 10 it gives 540. When rounded to the nearest 100 it gives 500. What is the largest possible number?",
      options: ["538", "539", "541", "543", "544"],
      correct: 3,
      explanation: "Rounding to the nearest 10 gives 540, so the number is from 535 to 544. Rounding to the nearest 100 gives 500, so the number is from 450 to 549. Both conditions: 535 to 544. The digits must all be different. Working down from the top: 544 has digits 5, 4, 4 which repeat. 543 has digits 5, 4, 3 — all different. So the largest possible number is 543. ✓"
    },
    {
      id: 128,
      difficulty: 3,
      question: "Aisha writes a 4-digit number. The thousands digit is twice the hundreds digit. The tens digit is three times the hundreds digit. The ones digit is 1. The number is greater than 6,000. What is the number?",
      options: ["4,291", "6,391", "2,131", "8,491", "4,261"],
      correct: 1,
      explanation: "Let the hundreds digit = h. Then thousands = 2h, tens = 3h, and ones = 1. For valid single digits: 2h ≤ 9 gives h ≤ 4, and 3h ≤ 9 gives h ≤ 3. So h can be 1, 2 or 3. If h = 1: the number is 2,131 (less than 6,000). If h = 2: the number is 4,261 (less than 6,000). If h = 3: the number is 6,391 (greater than 6,000). The answer is 6,391. ✓"
    },
    {
      id: 129,
      difficulty: 3,
      question: "Emma thinks of a 4-digit number. When she rounds it to the nearest 1,000, she gets 7,000. When she rounds it to the nearest 100, she gets 6,500. What is the smallest number Emma could be thinking of?",
      options: ["6,450", "6,480", "6,500", "6,501", "6,550"],
      correct: 2,
      explanation: "Rounding to the nearest 1,000 gives 7,000, so the number is from 6,500 to 7,499. Rounding to the nearest 100 gives 6,500, so the number is from 6,450 to 6,549. Numbers 6,450 to 6,499 have hundreds digit 4, so they round down to 6,000 to the nearest thousand — these don't satisfy the first condition. Numbers 6,500 to 6,549 have hundreds digit 5, so they round up to 7,000 to the nearest thousand. The valid range is 6,500 to 6,549, and the smallest is 6,500. ✓"
    },
    {
      id: 130,
      difficulty: 3,
      question: "Two different 5-digit numbers both round to 35,000 to the nearest thousand. What is the largest possible difference between them?",
      options: ["499", "998", "999", "500", "1,000"],
      correct: 2,
      explanation: "Numbers that round to 35,000 to the nearest thousand range from 34,500 to 35,499. The smallest is 34,500 and the largest is 35,499. The largest possible difference is 35,499 − 34,500 = 999. ✓"
    },
    {
      id: 131,
      difficulty: 3,
      question: "Oliver writes a 5-digit number using each of the digits 1, 2, 3, 4 and 5 exactly once. When rounded to the nearest 1,000 it gives 22,000. What is the largest number Oliver could have written?",
      options: ["25,431", "24,531", "23,451", "21,543", "21,534"],
      correct: 3,
      explanation: "Rounding to 22,000 to the nearest thousand means the number is from 21,500 to 22,499. The ten-thousands digit must be 2. The thousands digit cannot also be 2 (each digit used once), so it must be 1, giving 21,___. We need 21,500 or more, so the hundreds digit must be 5. The remaining digits {3, 4} go in the tens and units places. For the largest number: tens = 4, units = 3. The answer is 21,543. ✓"
    },
    {
      id: 132,
      difficulty: 3,
      question: "A number rounds to 6,800 to the nearest hundred and to 6,750 to the nearest ten. How many whole numbers satisfy both conditions?",
      options: ["5", "10", "50", "100", "0"],
      correct: 0,
      explanation: "Rounding to the nearest hundred gives 6,800, so the number is from 6,750 to 6,849. Rounding to the nearest ten gives 6,750, so the number is from 6,745 to 6,754. The overlap of these two ranges is 6,750 to 6,754. That gives 5 whole numbers: 6,750, 6,751, 6,752, 6,753 and 6,754. ✓"
    },
    {
      id: 133,
      difficulty: 3,
      question: "Priya thinks of a number. 'If I round it to the nearest 10, I get 350. If I round it to the nearest 100, I get 400.' What is the smallest number Priya could be thinking of?",
      options: ["345", "348", "350", "351", "354"],
      correct: 2,
      explanation: "Rounding to the nearest 10 gives 350, so the number is from 345 to 354. Rounding to the nearest 100 gives 400, so the number is from 350 to 449. Both conditions together: 350 to 354. Numbers 345 to 349 have tens digit 4, so they round down to 300 to the nearest 100 — they don't satisfy the second condition. The smallest valid number is 350. ✓"
    },
    {
      id: 134,
      difficulty: 3,
      question: "A 5-digit number has the form 5■,■12 where both ■ symbols stand for the same missing digit. The digit sum of the whole number is 20. What is the number?",
      options: ["54,412", "55,512", "56,612", "57,712", "58,812"],
      correct: 2,
      explanation: "The number is 5d,d12 where d is the missing digit appearing twice. The digit sum is 5 + d + d + 1 + 2 = 2d + 8. Setting 2d + 8 = 20 gives 2d = 12, so d = 6. The number is 56,612. Check: 5 + 6 + 6 + 1 + 2 = 20 ✓. ✓"
    },
    {
      id: 135,
      difficulty: 3,
      question: "When a 4-digit number is rounded to the nearest 10, the answer is 3,470. When the same number is rounded to the nearest 100, the answer is 3,500. Which of these could be the original number?",
      options: ["3,478", "3,474", "3,462", "3,453", "3,481"],
      correct: 1,
      explanation: "Rounding to the nearest 10 gives 3,470, so the number is from 3,465 to 3,474. Rounding to the nearest 100 gives 3,500, so the number is from 3,450 to 3,549. Both conditions: 3,465 to 3,474. Check each option: 3,478 rounds to 3,480 to nearest 10 ✗. 3,474 is in range, rounds to 3,470 (ones 4 < 5, round down) ✓, and rounds to 3,500 (tens 7 ≥ 5, round up) ✓. 3,462 rounds to 3,460 to nearest 10 ✗. 3,453 rounds to 3,450 to nearest 10 ✗. 3,481 rounds to 3,480 to nearest 10 ✗. The answer is 3,474. ✓"
    },
    {
      id: 136,
      difficulty: 3,
      question: "A 5-digit number rounds to 50,000 to the nearest ten thousand and to 46,000 to the nearest thousand. What is the largest the number could be?",
      options: ["46,489", "46,499", "46,500", "46,999", "49,999"],
      correct: 1,
      explanation: "Rounding to the nearest ten thousand gives 50,000, so the number is from 45,000 to 54,999. Rounding to the nearest thousand gives 46,000, so the number is from 45,500 to 46,499. The overlap is 45,500 to 46,499. The largest number in this range is 46,499. ✓"
    },
    {
      id: 137,
      difficulty: 3,
      question: "A 3-digit number has its hundreds digit exactly 4 more than its ones digit. The tens digit is exactly halfway between the hundreds and ones digits. How many such 3-digit numbers exist?",
      options: ["4", "5", "6", "7", "8"],
      correct: 2,
      explanation: "Let the ones digit = d. Then the hundreds digit = d + 4, and the tens digit = d + 2 (halfway between d and d + 4). For valid single digits: d + 4 ≤ 9 gives d ≤ 5, and d ≥ 0. So d can be 0, 1, 2, 3, 4 or 5, giving the numbers 420, 531, 642, 753, 864 and 975. That is 6 numbers. ✓"
    },
    {
      id: 138,
      difficulty: 3,
      question: "A whole number is greater than 34,500 and less than 35,500. When rounded to the nearest 100, the result ends in 700. What is the largest this number could be?",
      options: ["34,749", "35,449", "34,650", "35,749", "34,700"],
      correct: 0,
      explanation: "The number is from 34,501 to 35,499. When rounded to the nearest 100, it must give a result ending in 700. The possible rounded results in this range are 34,500, 34,600, 34,700, ..., 35,400, 35,500. The only one ending in 700 is 34,700. Numbers that round to 34,700 are from 34,650 to 34,749. All of these are within our range. The largest is 34,749. ✓"
    },
    {
      id: 139,
      difficulty: 3,
      question: "Sophie writes a 5-digit number where every digit is different. It rounds to 30,000 to the nearest 10,000 and to 28,000 to the nearest 1,000. What is the smallest number Sophie could have written?",
      options: ["27,501", "27,503", "27,510", "27,504", "27,530"],
      correct: 0,
      explanation: "Rounding to the nearest 10,000 gives 30,000, so the number is from 25,000 to 34,999. Rounding to the nearest 1,000 gives 28,000, so the number is from 27,500 to 28,499. The overlap is 27,500 to 28,499. All five digits must be different. Starting from the bottom: 27,500 has digits 2, 7, 5, 0, 0 — the zero repeats. 27,501 has digits 2, 7, 5, 0, 1 — all different. Check: 27,501 rounds to 30,000 to the nearest 10,000 (thousands digit 7 ≥ 5) ✓, and to 28,000 to the nearest 1,000 (hundreds digit 5 ≥ 5) ✓. The answer is 27,501. ✓"
    },
    {
      id: 140,
      difficulty: 3,
      question: "Ryan thinks of a 4-digit number. He says: 'When I round to the nearest 100, I get 4,300. When I round to the nearest 1,000, I get 4,000.' What is the largest number Ryan could be thinking of?",
      options: ["4,349", "4,344", "4,340", "4,299", "4,345"],
      correct: 0,
      explanation: "Rounding to the nearest 100 gives 4,300, so the number is from 4,250 to 4,349. Rounding to the nearest 1,000 gives 4,000, so the number is from 3,500 to 4,499. Both conditions: 4,250 to 4,349. The largest number in this range is 4,349. ✓"
    },
    {
      id: 141,
      difficulty: 3,
      question: "When 58,■46 is rounded to the nearest thousand, the answer is 59,000. Which digits could ■ be?",
      options: ["5, 6, 7, 8 or 9", "Only 5", "6, 7, 8 or 9 only", "Any digit from 0 to 9", "Only 9"],
      correct: 0,
      explanation: "The number is 58,_46 where ■ is the hundreds digit. To round up to 59,000 to the nearest thousand, the hundreds digit must be 5 or more. So ■ can be 5, 6, 7, 8 or 9. For example, 58,546 rounds to 59,000 ✓, but 58,446 rounds to 58,000 ✗. ✓"
    },
    {
      id: 142,
      difficulty: 3,
      question: "A number rounds to 8,400 to the nearest hundred. Freya says the number is a multiple of 5. Ben says the ones digit is not 0 or 5. Can they both be correct?",
      options: ["Yes — there are exactly 10 such numbers", "Yes — there are exactly 20 such numbers", "Yes — there is exactly 1 such number", "No — they cannot both be correct", "Yes — there are exactly 5 such numbers"],
      correct: 3,
      explanation: "A multiple of 5 always ends in 0 or 5. Ben says the ones digit is not 0 or 5. These two statements directly contradict each other — no number can be a multiple of 5 while also not ending in 0 or 5. So Freya and Ben cannot both be correct. ✓"
    },
    {
      id: 143,
      difficulty: 3,
      question: "A 5-digit number has the form 2■,■51 where both ■ symbols stand for the same digit. The number rounds to 30,000 to the nearest ten thousand. What is the largest possible value of the missing digit?",
      options: ["5", "6", "7", "8", "9"],
      correct: 4,
      explanation: "The number is 2d,d51 where d is the same digit in both the thousands and hundreds places. For the number to round to 30,000 to the nearest ten thousand, it must be from 25,000 to 34,999. Since it starts with 2, we need 2d,d51 ≥ 25,000, so the thousands digit d must be at least 5. The digit d can be 5, 6, 7, 8 or 9. The largest value is 9, giving the number 29,951. Check: 29,951 rounds to 30,000 ✓. ✓"
    },
    {
      id: 144,
      difficulty: 3,
      question: "Liam rounds a number to the nearest 10 and gets 4,500. He rounds the same number to the nearest 100 and also gets 4,500. Which of these could be Liam's number?",
      options: ["4,505", "4,549", "4,503", "4,452", "4,510"],
      correct: 2,
      explanation: "Rounding to the nearest 10 gives 4,500, so the number is from 4,495 to 4,504. Rounding to the nearest 100 gives 4,500, so the number is from 4,450 to 4,549. Both conditions: the number must be from 4,495 to 4,504. Check each option: 4,505 rounds to 4,510 to nearest 10 ✗. 4,549 rounds to 4,550 to nearest 10 ✗. 4,503 rounds to 4,500 to nearest 10 ✓, and to 4,500 to nearest 100 ✓ — this works. 4,452 rounds to 4,450 to nearest 10 ✗. 4,510 rounds to 4,510 to nearest 10 ✗. The answer is 4,503. ✓"
    },
    {
      id: 145,
      difficulty: 3,
      question: "Jack uses each of the digits 0, 1, 2, 3 and 4 exactly once to make a 5-digit number. What is the smallest number he can make that rounds to 20,000 to the nearest 10,000?",
      options: ["10,234", "20,134", "13,024", "14,320", "20,314"],
      correct: 1,
      explanation: "Rounding to 20,000 to the nearest 10,000 means the number is from 15,000 to 24,999. Using digits {0, 1, 2, 3, 4} each once, we need the ten-thousands digit to be at least 1 (cannot start with 0). If ten-thousands = 1: the largest possible number starting with 1 is 14,320, and 14,320 rounds to 10,000 (thousands digit 4 < 5). No arrangement starting with 1 can reach 15,000 since the largest available thousands digit is 4. So ten-thousands must be 2. The smallest number starting with 2 uses the smallest remaining digits in order: 2, 0, 1, 3, 4 giving 20,134. Check: 20,134 rounds to 20,000 ✓. The answer is 20,134. ✓"
    }
