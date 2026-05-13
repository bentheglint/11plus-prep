#!/usr/bin/env node
// One-shot applier for Oracle G's Tier 2 vocabulary length-tell fixes.
// 53 questions (Tier 2A: 17, Tier 2B: 36). Same shape as Tier 1 applier.
// Run once, kept in repo as audit trail.

const fs = require('node:fs');
const path = require('node:path');

const SRC = path.join(__dirname, '..', '..', 'src', 'questionData', 'englishData.js');

// [questionId, oldOptionsJSON, newOptionsJSON, newCorrect]
const FIXES = [
  // ── Tier 2A ──
  [86, '["Underwater","Ordinary","Of outstanding beauty or grandeur","Sad","Small"]',
       '["Underwater","Ordinary","Magnificent","Trivial","Compact"]', 2],
  [36, '["Dull","Average","Extremely clever or bright","Terrible","Quiet"]',
       '["Dull","Average","Outstanding","Terrible","Quiet"]', 2],
  [41, '["Friendly","Small","Aggressive and frightening","Old","Playful"]',
       '["Gentle and timid","Small and harmless","Aggressive and frightening","Old and tired","Playful and friendly"]', 2],
  [80, '["Clear","Open to more than one meaning","Boring","Dangerous","Exciting"]',
       '["Clear","Unclear","Boring","Dangerous","Exciting"]', 1],
  [88, '["Beautiful","Warm","Green","Flat","Bleak, empty, and uninhabited"]',
       '["Beautiful and lively","Warm and welcoming","Green and fertile","Flat and featureless","Bleak, empty, and barren"]', 4],
  [108, '["He has not eaten in three hundred years","He has not been able to fly for three hundred years","No human has been able to see him for over three hundred years","He has not spoken to another dragon in three hundred years","The cave has not had a visitor in three hundred years"]',
        '["He has not eaten in over three hundred years","He has not been able to fly for three hundred years","No human has been able to see him for three hundred years","He has not spoken to another dragon in three hundred years","No visitor has entered the cave in three hundred years"]', 2],
  [112, '["The Storm Chaser","The Silver Gull","The Cornish Maid","The White Falcon","The Sea Breeze"]',
        '["The Storm Chaser","The Silver Gull","The Cornish Maiden","The White Falcon","The Ocean Breeze"]', 1],
  [5, '["Gentle","Strict and serious","Funny","Quiet","Long"]',
      '["Gentle and kind","Strict and serious","Funny and lighthearted","Quiet and shy","Long and detailed"]', 1],
  [57, '["Nervous","Bored","Angry","Confused","Overjoyed and triumphant"]',
       '["Nervous","Bored","Angry","Confused","Triumphant"]', 4],
  [58, '["Careless","Brave","Quick","Creative","Very careful and precise"]',
       '["Careless","Brave","Quick","Creative","Painstaking"]', 4],
  [65, '["Energetic","Sluggish and lacking energy","Hungry","Happy","Restless"]',
       '["Energetic and lively","Sluggish and tired","Hungry and irritable","Cheerful and chatty","Restless and fidgety"]', 1],
  [68, '["Old","Hungry","Frightened","Large","Stubbornly refusing to change"]',
       '["Old and worn out","Hungry and weak","Frightened and uneasy","Large and powerful","Stubborn and unyielding"]', 4],
  [40, '["Excited","Worried and nervous","Bored","Proud","Annoyed"]',
       '["Excited and eager","Worried and nervous","Bored and restless","Proud and confident","Annoyed and grumpy"]', 1],
  [66, '["Well-planned","Slow","Acting suddenly without thinking","Careful","Wise"]',
       '["Carefully planned","Slow and steady","Sudden and unthinking","Cautious and careful","Wise and sensible"]', 2],
  [140, '["Shy and quiet, preferring to be alone","Interested only in animals and not people","Bossy and unkind to other children","Nervous about talking to people she does not know","Friendly, confident, and welcoming to newcomers"]',
        '["Shy and quiet, preferring her own company","Interested only in animals, not in people","Bossy and unkind to the other children","Nervous about meeting people she does not know","Friendly, confident, and welcoming to newcomers"]', 4],
  [52, '["Clever","Shocking","Unfair","Completely ridiculous","Ordinary"]',
       '["Clever","Shocking","Unfair","Ridiculous","Ordinary"]', 3],
  [138, '["They walked past her slowly, carefully, and quietly","They ran past her as fast as they possibly could","They moved in a steady, continuous flow, like water in a river","They pushed past her rudely without saying sorry","They stopped suddenly to stand and look at her"]',
        '["They walked past her slowly, carefully, and quietly","They ran past her as fast as they possibly could","They moved in a steady, continuous flow past her","They pushed past her rudely without saying anything","They stopped suddenly and stood watching her closely"]', 2],

  // ── Tier 2B ──
  [61, '["Tired","Polite","Openly resisting authority","Confused","Frightened"]',
       '["Exhausted from running","Polite and well-mannered","Openly resisting authority","Confused by instructions","Frightened of the dark"]', 2],
  [211, '["Boring","Short","Confusing","Very clear and detailed","Quiet"]',
        '["Dull and lifeless","Short and rushed","Confusing and unclear","Very clear and detailed","Quiet and calm"]', 3],
  [156, '["Collected and stored away","Ate","Threw away","Lost","Shared"]',
        '["Collected and stored away","Quickly ate up","Carelessly threw away","Accidentally lost track of","Generously shared with others"]', 0],
  [174, '["Brave","Loud","Shy and nervous","Strong","Clever"]',
        '["Brave","Loud","Shy","Strong","Clever"]', 2],
  [8, '["Giving the impression something bad will happen","Bright and cheerful","Extremely large","Very loud","Moving quickly"]',
      '["Threatening","Cheerful","Enormous","Deafening","Speedy"]', 0],
  [37, '["Wonderful","Ordinary","Exciting","Very bad or unpleasant","Odd"]',
       '["Wonderful","Ordinary","Exciting","Terrible","Odd"]', 3],
  [258, '["Forgot","Refused","Pretended","Hoped","Made a serious promise"]',
        '["Forgot completely","Refused outright","Pretended falsely","Hoped quietly","Promised solemnly"]', 4],
  [81, '["Open","Noisy","Kept secret or hidden","Ancient","Beautiful"]',
       '["Open","Noisy","Secret","Ancient","Beautiful"]', 2],
  [291, '["Shy and reserved","Extremely generous","Failing to observe proper limits; too bold","Quite forgetful","Very intelligent"]',
        '["Shy and reserved","Extremely generous","Overstepping proper boundaries","Quite forgetful","Very intelligent"]', 2],
  [198, '["An easy choice","A boring routine","A pleasant surprise","A quick solution","A difficult situation with two tough options"]',
        '["An easy choice","A boring routine","A pleasant surprise","A quick solution","A tough either-or problem"]', 4],
  [231, '["A violent fight","A polite discussion","A noisy argument about something unimportant","A long silence","A happy celebration"]',
        '["A violent fight","A polite discussion","A petty noisy argument","A long silence","A happy celebration"]', 2],
  [196, '["Hidden from view","Very quiet","Clearly visible and attracting notice","Slightly damaged","Extremely old"]',
        '["Hidden from view","Very quiet","Clearly visible and noticeable","Slightly damaged","Extremely old"]', 2],
  [288, '["To praise warmly","To ignore completely","To reward generously","To whisper quietly","To express sharp disapproval; tell someone off"]',
        '["To praise warmly","To ignore completely","To reward generously","To whisper quietly","To scold sharply"]', 4],
  [87, '["Ignore","Celebrate","Complain about","Think about deeply and carefully","Rush through"]',
       '["Ignore","Celebrate","Complain about","Ponder deeply","Rush through"]', 3],
  [84, '["Widely admired and famous","Unknown","Ordinary","Illustrated","Confusing"]',
       '["Famous","Unknown","Ordinary","Illustrated","Confusing"]', 0],
  [59, '["Continuing firmly despite difficulty","Giving up easily","Angry","Quiet","Lucky"]',
       '["Determined","Quitting","Angry","Quiet","Lucky"]', 0],
  [242, '["A pair of glasses","A loud noise","A written report","A visually striking performance or display","A difficult problem"]',
        '["A pair of glasses","A loud noise","A written report","A striking visual display","A difficult problem"]', 3],
  [261, '["Essential","More than is needed; excessive","Very expensive","Extremely fast","Well organised"]',
        '["Essential","Unnecessary and excessive","Very expensive","Extremely fast","Well organised"]', 1],
  [285, '["Perfectly safe","Not securely held; dangerously likely to fall","Extremely comfortable","Very expensive","Quite ordinary"]',
        '["Perfectly safe","Dangerously unstable","Extremely comfortable","Very expensive","Quite ordinary"]', 1],
  [18, '["Very fast","Continuing firmly despite difficulty","Giving up easily","Extremely careful","Slightly worried"]',
       '["Very fast","Refusing to give up","Giving up easily","Extremely careful","Slightly worried"]', 1],
  [289, '["Showing unselfish concern for others","Very wealthy","Selfish","Physically strong","Extremely clever"]',
        '["Selflessly caring for others","Very wealthy","Selfish and greedy","Physically strong","Extremely clever"]', 0],
  [212, '["Forbade","Helped","Strongly encouraged","Prevented","Allowed"]',
        '["Forbade","Helped","Pressed","Prevented","Allowed"]', 2],
  [235, '["Prevented","Enjoyed","Ended","Ignored","Caused or triggered"]',
        '["Prevented","Enjoyed","Ended","Ignored","Triggered"]', 4],
  [209, '["Tempted","Forced by a strong urge","Hesitant","Permitted","Embarrassed"]',
        '["Tempted","Pressured","Hesitant","Permitted","Embarrassed"]', 1],
  [245, '["Disproved","Complicated","Changed","Supported and confirmed","Ignored"]',
        '["Disproved","Complicated","Changed","Confirmed","Ignored"]', 3],
  [262, '["Sloppy","Very fast","Slightly bored","Extremely careful and precise","Quite noisy"]',
        '["Sloppy","Hasty","Bored","Painstaking","Noisy"]', 3],
  [325, '["Completely certain","Very angry","Extremely happy","Having mixed feelings about something","Rather tired"]',
        '["Completely certain","Very angry","Extremely happy","Having mixed feelings","Rather tired"]', 3],
  [195, '["Exciting and varied","Dull and repetitive without any variety","Very loud","Extremely fast","Slightly dangerous"]',
        '["Exciting and varied","Dull and repetitive","Very loud","Extremely fast","Slightly dangerous"]', 1],
  [434, '["To be ice skating","To be in a hurry","To be very cold","To be losing weight","To be in a dangerous or risky situation"]',
        '["To be ice skating","To be in a hurry","To be very cold","To be losing weight","To be in a risky position"]', 4],
  [146, '["Slightly wet","Frozen","Warm","Dry","Dirty"]',
        '["Moist","Frozen","Warm","Dry","Dirty"]', 0],
  [228, '["Considerable in size or amount","Very tiny","Completely free","Slightly broken","Quite ordinary"]',
        '["Considerable in size","Very tiny","Completely free","Slightly broken","Quite ordinary"]', 0],
  [256, '["Agreement","Celebration","Disagreement or argument","Conversation","Solution"]',
        '["Agreement","Celebration","Argument","Conversation","Solution"]', 2],
  [266, '["Extremely angry","Passionate","Showing no interest or concern","Very cheerful","Deeply worried"]',
        '["Furious","Passionate","Indifferent","Cheerful","Worried"]', 2],
  [290, '["Quick and easy","Requiring considerable time and effort","Extremely enjoyable","Slightly risky","Very colourful"]',
        '["Quick and easy","Requiring great effort","Extremely enjoyable","Slightly risky","Very colourful"]', 1],
  [312, '["Very talkative","Extremely friendly","Always laughing","Not revealing one\'s thoughts readily","Rather clumsy"]',
        '["Very talkative","Extremely friendly","Always laughing","Reserved and quiet","Rather clumsy"]', 3],
  [405, '["A raised flat area of land","A deep ocean","A high cloud","A strong wind","A bright star"]',
        '["A raised flat platform","A deep ocean","A high cloud","A strong wind","A bright star"]', 0],
];

let src = fs.readFileSync(SRC, 'utf8');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let applied = 0;
const failures = [];

for (const [id, oldOpts, newOpts, newCorrect] of FIXES) {
  let oldItems, newOptsItems;
  try {
    oldItems = JSON.parse(oldOpts);
    newOptsItems = JSON.parse(newOpts);
  } catch (e) {
    failures.push(`Q${id}: JSON parse error in fix entry: ${e.message}`);
    continue;
  }

  const itemPatternDQ = oldItems.map(it => `"${escapeRe(it)}"`).join('\\s*,\\s*');
  const itemPatternSQ = oldItems.map(it => `'${escapeRe(it.replace(/'/g, "\\\\'"))}'`).join('\\s*,\\s*');

  const dqRe = new RegExp(`"options":\\s*\\[\\s*${itemPatternDQ}\\s*\\]`);
  const sqUnquotedRe = new RegExp(`(?<!"\\w*)\\boptions:\\s*\\[\\s*${itemPatternDQ}\\s*\\]`);
  const sqQuotedRe = new RegExp(`(?<!"\\w*)\\boptions:\\s*\\[\\s*${itemPatternSQ}\\s*\\]`);

  let matched = null, style = null;
  if (dqRe.test(src)) { matched = src.match(dqRe)[0]; style = 'dq'; }
  else if (sqUnquotedRe.test(src)) { matched = src.match(sqUnquotedRe)[0]; style = 'sqUnq'; }
  else if (sqQuotedRe.test(src)) { matched = src.match(sqQuotedRe)[0]; style = 'sqQ'; }

  if (!matched) {
    failures.push(`Q${id}: options array not found`);
    continue;
  }

  let newOptsLiteral;
  if (style === 'dq') {
    newOptsLiteral = `"options": [\n            "${newOptsItems.map(it => it.replace(/"/g, '\\"')).join('",\n            "')}"\n          ]`;
  } else if (style === 'sqUnq') {
    newOptsLiteral = `options: [${newOptsItems.map(it => `"${it.replace(/"/g, '\\"')}"`).join(',')}]`;
  } else {
    newOptsLiteral = `options: [${newOptsItems.map(it => `'${it.replace(/'/g, "\\'")}'`).join(',')}]`;
  }
  src = src.replace(matched, newOptsLiteral);

  // Update correct field
  const replacedIdx = src.indexOf(newOptsLiteral);
  if (replacedIdx >= 0) {
    const before = src.slice(0, replacedIdx + newOptsLiteral.length);
    const tail = src.slice(replacedIdx + newOptsLiteral.length);
    src = before + tail.replace(/("?correct"?):\s*\d+/, `$1: ${newCorrect}`);
  }
  applied++;
}

if (applied > 0) fs.writeFileSync(SRC, src);

console.log('');
console.log(`Applied: ${applied}/${FIXES.length}`);
console.log(`Failures: ${failures.length}`);
for (const f of failures) console.log(`  - ${f}`);
process.exit(failures.length > 0 ? 1 : 0);
