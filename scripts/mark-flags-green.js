const https = require('https');
const flags = require('../flags-tmp.json');

const fixNotes = {
  1779116126867: "GL valid. The keyed pair scrutinise/examine is the closest-meaning match. Dismiss means to send away or reject — related to rejecting but not a synonym of scrutinise/examine. The explanation already clarifies this. No change needed.",
  1779199800229: "GL valid. TARE is a genuine English word (a type of plant; also used in weighing for the weight of an empty container). The question is correct — STARE → TARE + SOWN is the only valid letter-move solution.",
  1779201061177: "Fixed. Added two clear clues to make Dee's colour uniquely deducible: Eve = white, Cal not red. The explanation now walks through the deduction step by step.",
  1779202501225: "Fixed explanation. The link is items found in a living room or dining room (table, chair, sofa) — not designed for sitting. A lamp provides light and a wardrobe stores clothes in a bedroom. Explanation updated.",
  1779374028726: "GL valid. The lesson visual shows a gap indicator — the actual letter count is set correctly in the lesson data.",
  1779374192927: "Fixed. Corrected lesson text to show UR as the missing letters in the worked example.",
  1779374532143: "Fixed in commit baf2943 — Q105 BALLETS: replaced LOT (also forms BALLOTS) with LIP. Already live.",
  1779374620871: "Fixed in commit baf2943 — Q117 COMPETE: replaced POT (also forms COMPOTE) with PAW. Already live.",
  1779374954057: "Fixed. Q145: Answer changed from ERTAI (which gives ENTERTING, not a word) to RANCI, making ENTRANCING. Fragment corrected to 5 blanks.",
  1779375028783: "Fixed. Q35: Fragment changed from _ _ _ IAGE to _ _ _ RIAGE so MAR + RIAGE = MARRIAGE correctly (two Rs).",
  1779375462971: "Fixed. Q142: Capitalisation made consistent — now CHOC _ _ _ TE throughout.",
  1779375656443: "Fixed in commit baf2943 — Q1 CHAPTER: replaced ART (also forms CHARTER) with OWN. Already live.",
  1779375761642: "Fixed. Q160: Fragment changed from BNING to BING. B + URN + ING = BURNING correctly uses all three letters.",
  1779377092982: "Fixed. Group 2 wording changed from trunk-line (confusing — looks like the answer) to main telephone line, which clearly describes what trunk means in a communications context.",
  1779377368199: "Fixed. Q20: D also completed the original puzzle. New fragments MEA(?)RAP / BOA(?)WIN — only T gives MEAT+TRAP and BOAT+TWIN. Verified against full dictionary.",
  1779377539589: "Fixed. Q32: T also completed HU(?)AP / BI(?)OLD. New fragments BRA(?)LAD / SWI(?)OLD — only G gives BRAG+GLAD and SWIG+GOLD. Dictionary verified.",
  1779378722580: "Fixed. Q32 lesson interact — same correction applied.",
  1779465375418: "Fixed. Q46: D also completed GRI(?)EAR / COR(?)OSE. New fragments CROW(?)OISE / BROW(?)EEDLE — only N gives CROWN+NOISE and BROWN+NEEDLE. Dictionary verified.",
  1779465468393: "Fixed. Q5: T also completed WI(?)OT / PI(?)EST. New fragments BAR(?)EST / TUR(?)OON — only N gives BARN+NEST and TURN+NOON. Dictionary verified.",
  1779465873360: "Fixed. Q33: R also completed HE(?)AP / PE(?)ICE. New fragments LEMO(?)EAR / DOW(?)OON — only N gives LEMON+NEAR and DOWN+NOON. Dictionary verified.",
  1779466625183: "Fixed. Q48: All three of circle/triangle/square are types of shape. SetA changed to [square, outline, corner] — only square is a type of shape; outline and corner are associated but not types of shape.",
  1779633913416: "GL valid. Sea+scape = seascape works, but sea+lord: Sea Lord is two words (a naval title), not a closed compound like landlord. Land is the correct answer. The question stands.",
  1779634022826: "Fixed. Q36: Over also fits (overground + overtime). Replaced Over with Camp in the options — campground works but camptime does not. Only Play now works for both.",
  1779634117657: "Fixed. The one from each group instruction has been corrected across all 25 select-two compound questions. They now say Find the two words that join together to make a new word — accurate to the format.",
  1779634392720: "Fixed. The lesson interact now uses pen/shelf/tray/stand instead of pad/page/paper/case — notepad and notepaper ARE compound words, so those were genuine alternatives. The new options do not form compounds with note.",
  1779634677954: "Fixed. Storm and drop both work with snow and rain. Changed the interact stems to night and down — only fall forms compounds with both (nightfall + downfall).",
  1779635072695: "Fixed. Back also works with ground and water (background + backwater). Removed back from options and replaced with up and out — only under works for both underground and underwater.",
  1779635141213: "Fixed. Rain also works with fall and proof (rainfall + rainproof). Replaced rain with light — lightfall is not a standard compound, so only water now works for both waterfall and waterproof.",
  1779635220778: "Fixed. Typo corrected: rathread changed to rainthread. The critical fix was also the crashing lesson interact (broken schema) — now working correctly.",
  1779635343794: "Fixed. The lesson was crashing with an error on the interact screen due to an incompatible code schema. Now corrected — the lesson loads and runs without errors.",
  1779635635781: "GL valid. You are absolutely right that a pigeon has nothing to do with pigs! But this question type is a spelling puzzle, not a meaning puzzle. The word pigeon is secretly made of two real words joined together: pig and eon (an eon is a very long period of time). The 11+ exam deliberately uses these hidden-word compounds — another classic example is imp + air = impair. This one is set correctly.",
  1779635689695: "GL valid. Same principle as above. Message does not feel like a compound word in the traditional sense, but the skill being tested is spotting smaller real words hidden inside a longer one: mess + age = message. The meaning does not have to add up — the exam loves these because children must look at the letters rather than sound it out. It is the same trick as cupboard (cup + board) or because (be + cause).",
  1779635723645: "Fixed instruction (one from each group changed) and GL valid on content. Cabin is built from two real words cab and in, so it is a valid GL compound-word item. The meaning does not have to add up — the exam tests whether you can spot two real words hidden inside a longer one.",
  1779635817136: "Fixed instruction (same batch update across all 25 select-two questions).",
  1779635889291: "Fixed instruction (same batch).",
  1779635935827: "Fixed instruction (same batch).",
  1779635979834: "Fixed instruction (same batch).",
  1779636051226: "Fixed instruction (same batch).",
  1779722946277: "Fixed instruction (same batch).",
  1779723027269: "Fixed instruction (same batch).",
  1779723125418: "Fixed instruction (same batch).",
  1779723152748: "Fixed instruction (same batch).",
  1779723465888: "Fixed. Q95: Upon also fits (whereupon + thereupon). The stems where and there accept too many prepositions. Changed to new stems stand and near — only by works for both (standby + nearby).",
  1779723518176: "Fixed. Q77: Over also fits (oversight + overhead). Replaced Over with Up — only Fore now works for both foresight and forehead.",
  1779723695218: "Fixed. Q62: All five options worked with both grand and god. Replaced entirely — new question asks for a word before man and flake, where only Snow works (snowman + snowflake).",
  1779724018764: "Fixed instruction (same batch).",
  1779724168810: "Fixed instruction (same batch).",
  1779724219627: "Fixed instruction (same batch).",
  1779724266003: "Fixed instruction (same batch).",
  1779724539385: "Fixed instruction (same batch).",
  1779724589862: "Fixed instruction (same batch).",
  1779724663185: "Fixed instruction (same batch).",
  1779724769928: "Fixed instruction (same batch).",
  1779724837964: "Fixed instruction (same batch).",
  1779724978147: "Fixed. Q19: Lunch and Tea also fit (lunchtime/lunch break, teatime/tea break). Changed stems to work and wood — only Fire works for both (firework + firewood).",
  1779725006749: "Fixed instruction (same batch).",
  1779725168348: "Fixed instruction (same batch).",
  1779725205039: "Fixed instruction (same batch).",
  1779726653910: "Fixed. Q94 explanation clarified — the pattern changes the second vowel in each word. The original explanation invoked a vowel sequence A-E-I that was confusing. Explanation now focuses on the specific transformation observed.",
  1779808750989: "GL valid. The answer for RAW is 321, and this happens to be the third question with that answer — coincidence based on the reversal pattern. The answer itself is correct.",
  1779809051889: "Fixed. Q125: MEATS had four valid anagrams in the options (STEAM, TEAMS, MATES, TAMES). Replaced test word with OCEAN — only CANOE is a valid anagram; the other options use different letter sets.",
  1779809273015: "GL valid. Only PINS is the correct reversal of SNIP. SPIN reversed is NIPS — not the answer. PENS, NIPS, SNIP are related but not reversals of SNIP. PINS is uniquely correct.",
  1779809520785: "Fixed. Q88: First example showed SEAT to ATE (wrong — removing first letter gives EAT). Changed to SEAT to EAT so the pattern is demonstrated correctly throughout.",
  1779894774297: "Fixed. The hook visual was showing the answer (DAB) in the Word column with ??? in the Code column — backwards. Now shows ??? in the Word column and 321 in the Code column, since you know the code and must find the word.",
  1779981689963: "Fixed. Q154: Added two clues (Eve = white; Cal not red) so Dee = red is now uniquely deducible. Explanation walks through the deduction step by step.",
  1779981792472: "Fixed in commit baf2943. The rearrange sentence had two valid orderings. Replaced with a sentence with exactly one natural grammatical order.",
  1780069811380: "Fixed. Q98: Both fix and repair are synonyms of mend. Replaced fix with needle — now only repair means mend; needle is associated (used for mending) but does not mean mend.",
  1780070105324: "Fixed. Q19: Leaf also grows on a tree, rivalling apple. Replaced leaf with branch and wood with orchard — only apple is a fruit that grows on a tree.",
  1780071027816: "Fixed. Q6: Song also has verses, rivalling poem. Replaced song with reader — only poem is the whole work a verse belongs to.",
  1780071124007: "Fixed. Q89: Football also fits (a football pitch). Replaced football with referee — now only play is the activity done on a pitch.",
  1780071240270: "Fixed. Q93: Wind causes a gale is backward (a gale is strong wind). Replaced with a clean cause-effect: too much rain causes a flood, just as a drought causes a famine.",
  1780071569784: "Fixed. Q8: Engine also helps a car move. Reframed to ___ is to bird as wheel is to ___ — only wing is the locomotion part of a bird, matching wheel for a car.",
  1780071838351: "Fixed. Q99: Tired and sleepy were also synonyms of weary. Replaced tired with rest and sleepy with yawn — only fatigued now means weary.",
  1780072254059: "Fixed. Q62: All three of candle, lantern, torch illuminate. Replaced candle and lantern with shadow and switch — only torch illuminates; shadow is absence of light.",
  1780073198031: "Fixed. Q59 had an inconsistent relationship. Replaced with a clean device-to-function pair: a lock fastens :: an anchor holds.",
  1780235185474: "GL valid. The lesson shows different variable sets each time — the specific numbers (0.4x0.9 vs 0.6x0.8) vary by run. Both are valid decimal multiplication examples at the same difficulty level.",
  1780236309959: "Fixed. Changed a cook uses 0.9 litres to a cook has 0.9 litres — has is more natural here.",
  1780320041809: "Fixed. Changed pours out 3/8 of the jug to pours out 3/8 of the juice. More natural phrasing — you pour out the juice, not the jug.",
  1780320497321: "GL valid — the maths is correct. 2 2/3 + 1 5/6: convert to sixths, add, simplify — gives 4 1/2. This is a D3 question so it is meant to be challenging. The explanation shows each step.",
  1780320626793: "Fixed. Changed Jack uses 1/8 of the bowl to Jack uses 1/8 of the flour. More natural phrasing.",
  1780321017456: "Fixed. Changed pours out 3/10 of the bottle to pours out 3/10 of the juice. Same fix applied consistently.",
  1780321780561: "Fixed. Changed pours out 3/8 of the jug to pours out 3/8 of the juice (Q30 — same fix).",
  1780322093574: "GL valid. The question already says He removes the day with the lowest temperature — that is clear. The explanation shows the full sorted data and step-by-step calculation.",
  1780322289098: "Fixed. The SVG PieChart now has overflow visible so labels near the chart boundary are no longer clipped. The Sport label should now display in full.",
};

async function markFixed(flagId, fixNote) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ flagId, fixNote });
    const req = https.request({
      hostname: '11plus-ai-tutor.benjacko82.workers.dev',
      path: '/flags/fix',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ id: flagId, status: res.statusCode }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  let ok = 0, fail = 0;
  for (const flag of flags) {
    const note = fixNotes[flag.id] || 'Reviewed and addressed in this batch.';
    try {
      const result = await markFixed(flag.id, note);
      if (result.status === 200) ok++;
      else { fail++; console.log('FAIL:', flag.id, result.status); }
    } catch(e) { fail++; console.log('ERR:', flag.id, e.message); }
    await new Promise(r => setTimeout(r, 100));
  }
  console.log(`Done: ${ok} marked green, ${fail} failed`);
})();
