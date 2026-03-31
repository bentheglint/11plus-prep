/**
 * Synonyms v3: Proper GL-authentic distractor design
 *
 * GL distractor rules:
 * - ALL words in both sets should be from the same semantic field
 * - D1: Related words that aren't synonyms (e.g. emotions: happy/sad/brave — not candle/meadow)
 * - D2: Include antonym of answer as trap + semantically close words
 * - D3: Multiple near-synonyms, fine-grained distinctions
 * - NEVER use random unrelated words (no candle, meadow, turquoise, etc.)
 *
 * Critical: After choosing distractors, verify NO cross-pairing creates synonym pairs
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';

// Every question that was previously fixed with random words needs proper distractors
// Format: { id, d, sA, sB, cp, ex }
// Strategy: answer pair stays, distractors redesigned from same semantic field

const fixes = [
  // ===== D1: Same semantic field, no synonym cross-pairs =====
  // All words should be real, recognisable vocabulary for a 10-year-old

  { id: 1, d: 1, // begin/start — action words about time
    sA: ["begin", "arrive", "allow"], sB: ["choose", "start", "carry"], cp: [0, 1],
    ex: "'Begin' and 'start' both mean to set something in motion — they are closest in meaning. 'Arrive' means to reach a place, 'allow' means to permit, 'choose' means to pick, and 'carry' means to hold — none of these mean the same as each other. ✓" },

  { id: 6, d: 1, // wealthy/rich — words about personal qualities
    sA: ["wealthy", "famous", "polite"], sB: ["honest", "rich", "strict"], cp: [0, 1],
    ex: "'Wealthy' and 'rich' both mean having a lot of money — they are closest in meaning. 'Famous' means well known, 'polite' means well-mannered, 'honest' means truthful, 'strict' means firm with rules — none are synonyms. ✓" },

  { id: 7, d: 1, // timid/shy — personality words
    sA: ["bold", "timid", "rude"], sB: ["loud", "angry", "shy"], cp: [1, 2],
    ex: "'Timid' and 'shy' both mean lacking confidence around others — they are closest in meaning. 'Bold' means the opposite (brave/confident). 'Rude' means impolite. 'Loud' and 'angry' describe behaviour, not personality. ✓" },

  { id: 8, d: 1, // joyful/happy — emotion words (NO other emotion synonyms!)
    sA: ["joyful", "brave", "polite"], sB: ["honest", "happy", "proud"], cp: [0, 1],
    ex: "'Joyful' and 'happy' both mean feeling great pleasure — they are closest in meaning. 'Brave' means courageous, 'polite' means well-mannered, 'honest' means truthful, 'proud' means feeling satisfaction — none are synonyms of each other. ✓" },

  { id: 19, d: 1, // terrified/very frightened — emotion words
    sA: ["terrified", "jealous", "bored"], sB: ["lonely", "very frightened", "proud"], cp: [0, 1],
    ex: "'Terrified' means extremely scared, and 'very frightened' means the same — they are closest in meaning. 'Jealous', 'bored', 'lonely', and 'proud' are all different emotions that don't match each other. ✓" },

  { id: 24, d: 1, // big/large — size words
    sA: ["big", "short", "heavy"], sB: ["deep", "large", "round"], cp: [0, 1],
    ex: "'Big' and 'large' both mean great in size — they are closest in meaning. 'Short' describes height, 'heavy' describes weight, 'deep' describes depth, 'round' describes shape — all different dimensions. ✓" },

  { id: 26, d: 1, // quick/fast — speed/movement words
    sA: ["quick", "careful", "steep"], sB: ["flat", "fast", "straight"], cp: [0, 1],
    ex: "'Quick' and 'fast' both mean moving with speed — they are closest in meaning. 'Careful' means cautious, 'steep' describes an angle, 'flat' means level, 'straight' means not curved — none are synonyms. ✓" },

  { id: 27, d: 1, // sad/unhappy — emotion words
    sA: ["sad", "hungry", "nervous"], sB: ["excited", "unhappy", "curious"], cp: [0, 1],
    ex: "'Sad' and 'unhappy' both mean feeling sorrow — they are closest in meaning. 'Hungry', 'nervous', 'excited', and 'curious' are all different feelings. ✓" },

  { id: 28, d: 1, // pretty/beautiful — appearance words
    sA: ["pretty", "tall", "clean"], sB: ["smooth", "beautiful", "young"], cp: [0, 1],
    ex: "'Pretty' and 'beautiful' both mean pleasing to look at — they are closest in meaning. 'Tall', 'clean', 'smooth', and 'young' describe different physical qualities. ✓" },

  { id: 29, d: 1, // clever/smart — personality traits
    sA: ["clever", "generous", "patient"], sB: ["curious", "smart", "honest"], cp: [0, 1],
    ex: "'Clever' and 'smart' both mean having quick intelligence — they are closest in meaning. 'Generous' means giving, 'patient' means willing to wait, 'curious' means wanting to know, 'honest' means truthful. ✓" },

  { id: 31, d: 1, // silent/quiet — sound words
    sA: ["silent", "smooth", "fresh"], sB: ["clean", "quiet", "new"], cp: [0, 1],
    ex: "'Silent' and 'quiet' both mean making little or no sound — they are closest in meaning. 'Smooth', 'fresh', 'clean', and 'new' describe different qualities entirely. ✓" },

  { id: 32, d: 1, // kind/generous — character words
    sA: ["kind", "honest", "patient"], sB: ["careful", "generous", "popular"], cp: [0, 1],
    ex: "'Kind' and 'generous' both describe someone who gives and helps willingly — they are closest in meaning. 'Honest' means truthful, 'patient' means willing to wait — positive traits but different meanings. ✓" },

  { id: 33, d: 1, // rude/impolite — behaviour words
    sA: ["rude", "noisy", "selfish"], sB: ["greedy", "impolite", "clumsy"], cp: [0, 1],
    ex: "'Rude' and 'impolite' both mean lacking good manners — they are closest in meaning. 'Noisy' means loud, 'selfish' means self-centred, 'greedy' means wanting too much, 'clumsy' means awkward — all negative but different. ✓" },

  { id: 34, d: 1, // lucky/fortunate — words about chance
    sA: ["lucky", "careful", "early"], sB: ["fortunate", "friendly", "cheerful"], cp: [0, 1],
    ex: "'Lucky' and 'fortunate' both mean having good luck — they are closest in meaning. 'Careful' means cautious, 'early' means before time, 'friendly' means welcoming, 'cheerful' means happy — all positive but different. ✓" },

  { id: 37, d: 1, // choose/select — action verbs
    sA: ["choose", "explain", "whisper"], sB: ["promise", "select", "deliver"], cp: [0, 1],
    ex: "'Choose' and 'select' both mean to pick from options — they are closest in meaning. 'Explain', 'whisper', 'promise', and 'deliver' are all different actions. ✓" },

  { id: 38, d: 1, // destroy/demolish — action verbs about change
    sA: ["destroy", "polish", "decorate"], sB: ["arrange", "demolish", "measure"], cp: [0, 1],
    ex: "'Destroy' and 'demolish' both mean to completely wreck something — they are closest in meaning. 'Polish', 'decorate', 'arrange', and 'measure' are all constructive actions — the opposite direction. ✓" },

  { id: 39, d: 1, // laugh/giggle — sound verbs
    sA: ["laugh", "sneeze", "yawn"], sB: ["cough", "giggle", "hiccup"], cp: [0, 1],
    ex: "'Laugh' and 'giggle' both mean making sounds of amusement — they are closest in meaning. 'Sneeze', 'yawn', 'cough', and 'hiccup' are all involuntary sounds but not about amusement. ✓" },

  { id: 40, d: 1, // mend/repair — action verbs
    sA: ["mend", "bend", "wrap"], sB: ["fold", "repair", "pour"], cp: [0, 1],
    ex: "'Mend' and 'repair' both mean to fix something broken — they are closest in meaning. 'Bend', 'wrap', 'fold', and 'pour' are all physical actions but unrelated to fixing. ✓" },

  { id: 41, d: 1, // shout/yell — sound verbs
    sA: ["shout", "clap", "wave"], sB: ["point", "yell", "nod"], cp: [0, 1],
    ex: "'Shout' and 'yell' both mean to call out loudly — they are closest in meaning. 'Clap', 'wave', 'point', and 'nod' are all gestures, not vocal sounds. ✓" },

  { id: 42, d: 1, // grab/seize — action verbs
    sA: ["grab", "throw", "pour"], sB: ["stack", "seize", "sweep"], cp: [0, 1],
    ex: "'Grab' and 'seize' both mean to take hold of suddenly — they are closest in meaning. 'Throw', 'pour', 'stack', and 'sweep' all involve moving things but not grabbing. ✓" },

  { id: 43, d: 1, // scatter/spread — action verbs about distribution
    sA: ["scatter", "squeeze", "twist"], sB: ["stretch", "spread", "spin"], cp: [0, 1],
    ex: "'Scatter' and 'spread' both mean to distribute over an area — they are closest in meaning. 'Squeeze', 'twist', 'stretch', and 'spin' all involve physical manipulation but not distributing. ✓" },

  { id: 44, d: 1, // ancient/old — age words
    sA: ["ancient", "heavy", "rough"], sB: ["narrow", "old", "hollow"], cp: [0, 1],
    ex: "'Ancient' and 'old' both mean having existed for a long time — they are closest in meaning. 'Heavy', 'rough', 'narrow', and 'hollow' describe physical properties, not age. ✓" },

  // ===== D2: Antonym traps + same semantic field =====

  { id: 3, d: 2, // conceal/hide — verbs about visibility. Antonym trap: reveal
    sA: ["reveal", "discover", "conceal"], sB: ["hide", "approach", "announce"], cp: [2, 0],
    ex: "'Conceal' and 'hide' both mean to keep out of sight — they are closest in meaning. 'Reveal' is the opposite of conceal (a common trap!). 'Discover' means to find, 'approach' means to come near, 'announce' means to declare. ✓" },

  { id: 12, d: 2, // flourish/thrive — verbs about growth. Antonym trap: wither
    sA: ["wither", "flourish", "stumble"], sB: ["thrive", "pause", "wander"], cp: [1, 0],
    ex: "'Flourish' and 'thrive' both mean to grow and do well — they are closest in meaning. 'Wither' means the opposite (to shrink and decay) — a common trap! 'Stumble', 'pause', and 'wander' are unrelated actions. ✓" },

  { id: 20, d: 2, // demonstrate/show — verbs about communication
    sA: ["demonstrate", "whisper", "argue"], sB: ["show", "debate", "listen"], cp: [0, 0],
    ex: "'Demonstrate' and 'show' both mean to display or prove something — they are closest in meaning. 'Argue' and 'debate' are related to each other but mean to dispute, not to show. 'Whisper' and 'listen' relate to communication but not displaying. ✓" },

  { id: 45, d: 2, // cautious/careful — personality. Antonym trap: reckless
    sA: ["cautious", "reckless", "curious"], sB: ["careful", "stubborn", "cheerful"], cp: [0, 0],
    ex: "'Cautious' and 'careful' both mean taking care to avoid risk — they are closest in meaning. 'Reckless' is the opposite (acting without thinking) — a trap! 'Curious', 'stubborn', and 'cheerful' are different personality traits. ✓" },

  { id: 46, d: 2, // generous/charitable — character. Antonym trap: selfish
    sA: ["generous", "selfish", "strict"], sB: ["charitable", "ambitious", "popular"], cp: [0, 0],
    ex: "'Generous' and 'charitable' both mean willing to give freely — they are closest in meaning. 'Selfish' is the opposite — a trap! 'Strict' means firm, 'ambitious' means driven, 'popular' means well-liked. ✓" },

  { id: 47, d: 2, // headstrong/resolute — personality (was dup, new pair)
    sA: ["headstrong", "cautious", "anxious"], sB: ["nervous", "resolute", "modest"], cp: [0, 1],
    ex: "'Headstrong' and 'resolute' both mean firmly determined — they are closest in meaning. 'Cautious' means careful, 'anxious' and 'nervous' are related feelings but not about determination, 'modest' means humble. ✓" },

  { id: 48, d: 2, // deserted/abandoned — words about emptiness (was dup, new pair)
    sA: ["deserted", "crowded", "distant"], sB: ["remote", "abandoned", "popular"], cp: [0, 1],
    ex: "'Deserted' and 'abandoned' both mean left empty with no people — they are closest in meaning. 'Crowded' is the opposite — a trap! 'Distant' and 'remote' are related (both mean far away) but not about being empty. ✓" },

  { id: 49, d: 2, // bashful/reserved — personality (was dup, new pair)
    sA: ["bashful", "confident", "cheerful"], sB: ["bossy", "reserved", "lively"], cp: [0, 1],
    ex: "'Bashful' and 'reserved' both mean reluctant to draw attention — they are closest in meaning. 'Confident' is the opposite — a trap! 'Cheerful', 'bossy', and 'lively' are different personality traits. ✓" },

  { id: 50, d: 2, // purchase/buy — verbs about commerce. Antonym trap: sell
    sA: ["purchase", "sell", "borrow"], sB: ["lend", "buy", "steal"], cp: [0, 1],
    ex: "'Purchase' and 'buy' both mean to acquire by paying — they are closest in meaning. 'Sell' is the opposite — a trap! 'Borrow' and 'lend' are related but different actions. 'Steal' means to take without permission. ✓" },

  { id: 51, d: 2, // genuine/authentic — words about truth. Antonym trap: fake
    sA: ["genuine", "fake", "popular"], sB: ["valuable", "authentic", "rare"], cp: [0, 1],
    ex: "'Genuine' and 'authentic' both mean real and not fake — they are closest in meaning. 'Fake' is the opposite — a trap! 'Popular' means well-liked, 'valuable' means worth a lot, 'rare' means uncommon. ✓" },

  { id: 52, d: 2, // abundant/plentiful — words about quantity. Antonym trap: scarce
    sA: ["abundant", "scarce", "heavy"], sB: ["expensive", "plentiful", "enormous"], cp: [0, 1],
    ex: "'Abundant' and 'plentiful' both mean existing in large quantities — they are closest in meaning. 'Scarce' is the opposite (in short supply) — a trap! 'Heavy' describes weight, 'expensive' describes cost, 'enormous' describes size. ✓" },

  { id: 53, d: 2, // hostile/unfriendly — attitude words. Antonym trap: welcoming
    sA: ["hostile", "welcoming", "nervous"], sB: ["unfriendly", "formal", "jealous"], cp: [0, 0],
    ex: "'Hostile' and 'unfriendly' both mean showing opposition or dislike — they are closest in meaning. 'Welcoming' is the opposite — a trap! 'Nervous' means anxious, 'formal' means proper, 'jealous' means envious. ✓" },

  { id: 54, d: 2, // reluctant/unwilling — attitude words. Antonym trap: eager
    sA: ["reluctant", "eager", "grateful"], sB: ["curious", "unwilling", "hopeful"], cp: [0, 1],
    ex: "'Reluctant' and 'unwilling' both mean not wanting to do something — they are closest in meaning. 'Eager' is the opposite (keen to do it) — a trap! 'Grateful', 'curious', and 'hopeful' are different attitudes. ✓" },

  { id: 55, d: 2, // praise/commend — verbs about judgement. Antonym trap: criticise
    sA: ["praise", "criticise", "question"], sB: ["challenge", "commend", "demand"], cp: [0, 1],
    ex: "'Praise' and 'commend' both mean to express approval — they are closest in meaning. 'Criticise' is the opposite — a trap! 'Question' and 'challenge' are about doubt, 'demand' means to insist. ✓" },

  { id: 56, d: 2, // decrease/reduce — verbs about change. Antonym trap: increase
    sA: ["decrease", "increase", "maintain"], sB: ["measure", "reduce", "balance"], cp: [0, 1],
    ex: "'Decrease' and 'reduce' both mean to make smaller — they are closest in meaning. 'Increase' is the opposite — a trap! 'Maintain' means to keep the same, 'measure' means to find the size, 'balance' means to make even. ✓" },

  { id: 57, d: 2, // arrive/reach — verbs about travel. Antonym trap: depart
    sA: ["arrive", "depart", "wander"], sB: ["explore", "reach", "escape"], cp: [0, 1],
    ex: "'Arrive' and 'reach' both mean to get to a destination — they are closest in meaning. 'Depart' is the opposite (to leave) — a trap! 'Wander' and 'explore' involve movement but not arriving. ✓" },

  { id: 58, d: 2, // defend/protect — verbs about safety. Antonym trap: attack
    sA: ["defend", "attack", "inspect"], sB: ["threaten", "protect", "warn"], cp: [0, 1],
    ex: "'Defend' and 'protect' both mean to keep safe from harm — they are closest in meaning. 'Attack' is the opposite — a trap! 'Inspect' means to examine, 'threaten' means to warn of danger, 'warn' means to alert. ✓" },

  { id: 59, d: 2, // accept/agree — verbs about decisions. Antonym trap: refuse
    sA: ["accept", "refuse", "suggest"], sB: ["request", "agree", "inform"], cp: [0, 1],
    ex: "'Accept' and 'agree' both mean to say yes or consent — they are closest in meaning. 'Refuse' is the opposite — a trap! 'Suggest' means to propose, 'request' means to ask, 'inform' means to tell. ✓" },

  { id: 60, d: 2, // unite/combine — verbs about joining. Antonym trap: separate
    sA: ["unite", "separate", "arrange"], sB: ["organise", "combine", "compete"], cp: [0, 1],
    ex: "'Unite' and 'combine' both mean to join together — they are closest in meaning. 'Separate' is the opposite — a trap! 'Arrange' and 'organise' are about order, 'compete' means to rival. ✓" },

  { id: 61, d: 2, // solemn/serious (was dup, new pair)
    sA: ["solemn", "cheerful", "clumsy"], sB: ["jealous", "serious", "generous"], cp: [0, 1],
    ex: "'Solemn' and 'serious' both mean grave and thoughtful — they are closest in meaning. 'Cheerful' is the opposite mood. 'Clumsy' means awkward, 'jealous' means envious, 'generous' means giving. ✓" },

  { id: 63, d: 2, // vivid/bright — words about visual quality
    sA: ["vivid", "faded", "rough"], sB: ["smooth", "bright", "gentle"], cp: [0, 1],
    ex: "'Vivid' and 'bright' both mean strong and clear in colour — they are closest in meaning. 'Faded' is the opposite (pale and washed out). 'Rough', 'smooth', and 'gentle' describe texture or manner, not colour. ✓" },

  { id: 65, d: 2, // sturdy/robust — words about strength
    sA: ["sturdy", "flexible", "narrow"], sB: ["steep", "robust", "smooth"], cp: [0, 1],
    ex: "'Sturdy' and 'robust' both mean strong and solidly built — they are closest in meaning. 'Flexible' means bendable (almost opposite). 'Narrow', 'steep', and 'smooth' describe different physical qualities. ✓" },

  { id: 66, d: 2, // arrogant/conceited — personality. Antonym trap: humble
    sA: ["arrogant", "humble", "anxious"], sB: ["curious", "conceited", "generous"], cp: [0, 1],
    ex: "'Arrogant' and 'conceited' both mean having too high an opinion of oneself — they are closest in meaning. 'Humble' is the opposite — a trap! 'Anxious', 'curious', and 'generous' are unrelated traits. ✓" },

  { id: 68, d: 2, // eager/keen — attitude words. Antonym trap: reluctant
    sA: ["eager", "reluctant", "patient"], sB: ["grateful", "keen", "strict"], cp: [0, 1],
    ex: "'Eager' and 'keen' both mean enthusiastic and wanting to do something — they are closest in meaning. 'Reluctant' is the opposite — a trap! 'Patient' means willing to wait, 'grateful' means thankful, 'strict' means firm. ✓" },

  { id: 69, d: 2, // polite/courteous — behaviour. Antonym trap: rude
    sA: ["polite", "rude", "clever"], sB: ["popular", "courteous", "wealthy"], cp: [0, 1],
    ex: "'Polite' and 'courteous' both mean showing good manners — they are closest in meaning. 'Rude' is the opposite — a trap! 'Clever', 'popular', and 'wealthy' are positive qualities but unrelated to manners. ✓" },

  { id: 70, d: 2, // honest/truthful — character words. Antonym trap: deceitful
    sA: ["honest", "deceitful", "confident"], sB: ["popular", "truthful", "ambitious"], cp: [0, 1],
    ex: "'Honest' and 'truthful' both mean telling the truth — they are closest in meaning. 'Deceitful' is the opposite — a trap! 'Confident', 'popular', and 'ambitious' are different qualities. ✓" },

  { id: 71, d: 2, // dull/boring — words about interest. Antonym trap: exciting
    sA: ["dull", "exciting", "nervous"], sB: ["curious", "boring", "proud"], cp: [0, 1],
    ex: "'Dull' and 'boring' both mean not interesting — they are closest in meaning. 'Exciting' is the opposite — a trap! 'Nervous', 'curious', and 'proud' are emotions, not about interest level. ✓" },

  { id: 72, d: 2, // vague/unclear — words about clarity. Antonym trap: precise
    sA: ["vague", "precise", "frequent"], sB: ["sudden", "unclear", "permanent"], cp: [0, 1],
    ex: "'Vague' and 'unclear' both mean not clearly expressed — they are closest in meaning. 'Precise' is the opposite (exact and clear) — a trap! 'Frequent', 'sudden', and 'permanent' describe time patterns, not clarity. ✓" },

  { id: 75, d: 2, // temporary/brief — words about duration. Antonym trap: permanent
    sA: ["temporary", "permanent", "frequent"], sB: ["sudden", "brief", "gradual"], cp: [0, 1],
    ex: "'Temporary' and 'brief' both mean lasting a short time — they are closest in meaning. 'Permanent' is the opposite — a trap! 'Frequent' means often, 'sudden' means quick, 'gradual' means slow — all about time but different aspects. ✓" },

  { id: 76, d: 2, // triumph/victory — words about outcomes
    sA: ["triumph", "effort", "attempt"], sB: ["struggle", "victory", "challenge"], cp: [0, 1],
    ex: "'Triumph' and 'victory' both mean a great win — they are closest in meaning. 'Effort', 'attempt', 'struggle', and 'challenge' are all about the process of trying, not the result. ✓" },

  // ===== D3: Near-synonyms, fine distinctions, advanced vocab =====

  { id: 14, d: 3, // elated/overjoyed — advanced emotion words
    sA: ["elated", "anxious", "indifferent"], sB: ["astonished", "overjoyed", "sceptical"], cp: [0, 1],
    ex: "'Elated' and 'overjoyed' both mean extremely happy — they are closest in meaning. 'Anxious' means worried, 'indifferent' means not caring, 'astonished' means shocked, 'sceptical' means doubtful — all strong emotions but different ones. ✓" },

  { id: 15, d: 3, // meticulous/very thorough — advanced personality words
    sA: ["meticulous", "spontaneous", "ambitious"], sB: ["versatile", "very thorough", "prominent"], cp: [0, 1],
    ex: "'Meticulous' means paying great attention to detail, and 'very thorough' means the same — they are closest in meaning. 'Spontaneous' means acting on impulse (almost opposite). 'Ambitious', 'versatile', and 'prominent' are different positive qualities. ✓" },

  { id: 77, d: 3, // serene/calm (was dup, new pair)
    sA: ["serene", "turbulent", "hostile"], sB: ["suspicious", "calm", "ambitious"], cp: [0, 1],
    ex: "'Serene' and 'calm' both mean peaceful and undisturbed — they are closest in meaning. 'Turbulent' is the opposite (chaotic) — a trap! 'Hostile' means aggressive, 'suspicious' means distrustful, 'ambitious' means driven. ✓" },

  { id: 78, d: 3, // persistent/determined (was dup, new pair)
    sA: ["persistent", "hesitant", "indifferent"], sB: ["rebellious", "determined", "impulsive"], cp: [0, 1],
    ex: "'Persistent' and 'determined' both mean refusing to give up — they are closest in meaning. 'Hesitant' is almost the opposite (uncertain). 'Indifferent' means not caring, 'rebellious' means defiant, 'impulsive' means acting rashly. ✓" },

  { id: 79, d: 3, // irritate/annoy — verbs about emotion. Antonym trap: soothe
    sA: ["irritate", "soothe", "impress"], sB: ["astonish", "annoy", "persuade"], cp: [0, 1],
    ex: "'Irritate' and 'annoy' both mean to make slightly angry — they are closest in meaning. 'Soothe' is the opposite (to calm) — a trap! 'Impress', 'astonish', and 'persuade' are about influence, not anger. ✓" },

  { id: 80, d: 3, // bewildered/confused — advanced emotion words
    sA: ["bewildered", "determined", "cautious"], sB: ["suspicious", "confused", "reluctant"], cp: [0, 1],
    ex: "'Bewildered' and 'confused' both mean unable to understand — they are closest in meaning. 'Determined' means resolute, 'cautious' means careful, 'suspicious' means distrustful, 'reluctant' means unwilling — all mental states but not about confusion. ✓" },

  { id: 81, d: 3, // nimble/agile — physical ability words
    sA: ["nimble", "rigid", "fragile"], sB: ["sturdy", "agile", "clumsy"], cp: [0, 1],
    ex: "'Nimble' and 'agile' both mean quick and light in movement — they are closest in meaning. 'Clumsy' is the opposite — a trap! 'Rigid' means stiff, 'fragile' means easily broken, 'sturdy' means strong — all physical qualities but not about movement. ✓" },

  { id: 82, d: 3, // prosperous/wealthy — words about success
    sA: ["prosperous", "impoverished", "prominent"], sB: ["notorious", "wealthy", "ambitious"], cp: [0, 1],
    ex: "'Prosperous' and 'wealthy' both mean rich and successful — they are closest in meaning. 'Impoverished' is the opposite (very poor) — a trap! 'Prominent' means well-known, 'notorious' means famous for bad things, 'ambitious' means driven. ✓" },

  { id: 83, d: 3, // malevolent/wicked — words about morality
    sA: ["malevolent", "innocent", "cautious"], sB: ["suspicious", "wicked", "humble"], cp: [0, 1],
    ex: "'Malevolent' means wishing harm, and 'wicked' means morally bad — they are closest in meaning. 'Innocent' is the opposite — a trap! 'Cautious' means careful, 'suspicious' means distrustful, 'humble' means modest. ✓" },

  { id: 85, d: 3, // shrewd/astute — advanced intelligence words
    sA: ["shrewd", "naive", "reserved"], sB: ["impulsive", "astute", "modest"], cp: [0, 1],
    ex: "'Shrewd' and 'astute' both mean having sharp judgement — they are closest in meaning. 'Naive' is the opposite (lacking experience) — a trap! 'Reserved' means quiet, 'impulsive' means acting rashly, 'modest' means humble. ✓" },

  { id: 116, d: 2, // restore/renovate (was dup, new pair)
    sA: ["restore", "demolish", "inspect"], sB: ["survey", "renovate", "neglect"], cp: [0, 1],
    ex: "'Restore' and 'renovate' both mean to bring back to good condition — they are closest in meaning. 'Demolish' is the opposite (to destroy) — a trap! 'Inspect' and 'survey' both mean to examine, 'neglect' means to ignore. ✓" },

  { id: 120, d: 3, // conquest/achievement (was dup, new pair)
    sA: ["conquest", "surrender", "endeavour"], sB: ["attempt", "achievement", "obstacle"], cp: [0, 1],
    ex: "'Conquest' and 'achievement' both mean a notable success — they are closest in meaning. 'Surrender' is the opposite (giving up) — a trap! 'Endeavour' and 'attempt' mean trying, 'obstacle' means a barrier. ✓" },

  { id: 122, d: 3, // absurd/ridiculous (was dup, new pair)
    sA: ["absurd", "sensible", "peculiar"], sB: ["mysterious", "ridiculous", "conventional"], cp: [0, 1],
    ex: "'Absurd' and 'ridiculous' both mean wildly unreasonable — they are closest in meaning. 'Sensible' is the opposite — a trap! 'Peculiar' means strange (close but not the same as absurd), 'mysterious' means hard to explain, 'conventional' means traditional. ✓" },

  { id: 124, d: 3, // lithe/supple (was dup, new pair)
    sA: ["lithe", "rigid", "muscular"], sB: ["sturdy", "supple", "sluggish"], cp: [0, 1],
    ex: "'Lithe' and 'supple' both mean flexible and moving gracefully — they are closest in meaning. 'Rigid' is the opposite (stiff) — a trap! 'Muscular' and 'sturdy' describe strength, 'sluggish' means slow and lazy. ✓" },
];

// Apply fixes
let content = fs.readFileSync(filePath, 'utf8');
const synStart = content.indexOf("synonyms: {");
const antStart = content.indexOf("antonyms: {");

// Parse current questions
const synSection = content.substring(synStart, antStart);
const blocks = synSection.split(/\{[\s\n]*(?:"id"|id):/);
blocks.shift();

const existing = [];
for (const b of blocks) {
  const id = parseInt(b.match(/^\s*(\d+)/)[1]);
  const d = parseInt(b.match(/(?:"difficulty"|difficulty):\s*(\d+)/)[1]);
  const sA = b.match(/(?:"setA"|setA):\s*\[([\s\S]*?)\]/)[1].match(/["']([^"']+)["']/g).map(s => s.replace(/["']/g, ''));
  const sB = b.match(/(?:"setB"|setB):\s*\[([\s\S]*?)\]/)[1].match(/["']([^"']+)["']/g).map(s => s.replace(/["']/g, ''));
  const cp = b.match(/(?:"correctPair"|correctPair):\s*\[([\s\S]*?)\]/)[1].trim().split(/\s*,\s*/).map(Number);
  const exM = b.match(/(?:"explanation"|explanation):\s*"([\s\S]*?)"\s*$/m);
  existing.push({ id, d, sA, sB, cp, ex: exM ? exM[1] : '' });
}

// Build fix map
const fixMap = {};
for (const f of fixes) fixMap[f.id] = f;

const corrected = existing.map(q => {
  const f = fixMap[q.id];
  if (!f) return q;
  return { id: q.id, d: f.d, sA: f.sA, sB: f.sB, cp: f.cp, ex: f.ex };
});

// Write
const questionsStart = content.indexOf("questions: [", synStart);
const bracketStart = content.indexOf("[", questionsStart);
let depth = 0, bracketEnd = -1;
for (let i = bracketStart; i < content.length; i++) {
  if (content[i] === '[') depth++;
  if (content[i] === ']') depth--;
  if (depth === 0) { bracketEnd = i + 1; break; }
}

function fmt(q) {
  const isJson = q.id >= 101;
  const ex = q.ex.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (isJson) {
    return `        {
          "id": ${q.id},
          "difficulty": ${q.d},
          "questionType": "pick-from-sets",
          "question": "Choose one word from each group that are closest in meaning.",
          "setA": ["${q.sA[0]}","${q.sA[1]}","${q.sA[2]}"],
          "setB": ["${q.sB[0]}","${q.sB[1]}","${q.sB[2]}"],
          "correctPair": [${q.cp[0]},${q.cp[1]}],
          "explanation": "${ex}"
        }`;
  }
  return `              {
                      id: ${q.id},
                      difficulty: ${q.d},
                      questionType: "pick-from-sets",
                      question: "Choose one word from each group that are closest in meaning.",
                      setA: ["${q.sA[0]}","${q.sA[1]}","${q.sA[2]}"],
                      setB: ["${q.sB[0]}","${q.sB[1]}","${q.sB[2]}"],
                      correctPair: [${q.cp[0]},${q.cp[1]}],
                      explanation: "${ex}"
              }`;
}

const newArray = '[\n' + corrected.map(q => fmt(q)).join(',\n') + '\n      ]';
const newContent = content.substring(0, bracketStart) + newArray + content.substring(bracketEnd);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`Applied ${fixes.length} GL-authentic fixes`);

// Quick validate
const synonymGroups = [
  ['happy','joyful','cheerful','glad','pleased','delighted','elated','overjoyed','merry'],
  ['sad','unhappy','miserable','sorrowful','gloomy','melancholy','dejected'],
  ['angry','cross','furious','irate','enraged','livid','annoyed','irritated'],
  ['brave','courageous','bold','fearless','daring','valiant','heroic'],
  ['scared','afraid','frightened','terrified','fearful','timid','cowardly'],
  ['kind','gentle','caring','considerate','compassionate','generous','thoughtful','benevolent'],
  ['cruel','mean','harsh','brutal','ruthless','heartless','vicious','wicked','malevolent'],
  ['clever','intelligent','smart','bright','brilliant','wise','shrewd','astute'],
  ['big','large','huge','enormous','massive','vast'],
  ['small','little','tiny','minute'],
  ['fast','quick','rapid','swift','speedy','brisk','hasty'],
  ['begin','start','commence','initiate'],['end','finish','conclude','complete','terminate','cease'],
  ['hide','conceal','cover','disguise','obscure'],['show','reveal','display','demonstrate','exhibit','expose'],
  ['rich','wealthy','affluent','prosperous','opulent'],['poor','impoverished','destitute','needy'],
  ['calm','peaceful','serene','tranquil','placid'],['noisy','loud','boisterous','rowdy'],
  ['quiet','silent','hushed','still'],['difficult','hard','tough','arduous','laborious'],
  ['strong','powerful','mighty','robust','sturdy'],['weak','feeble','frail','fragile','delicate'],
  ['old','ancient','elderly','aged'],['new','modern','recent','contemporary','fresh'],
  ['thrive','flourish','prosper','bloom'],['decline','deteriorate','worsen','wither','fade'],
  ['gather','collect','accumulate','amass'],['spread','scatter','distribute','disperse'],
  ['honest','truthful','sincere','frank','candid'],['dishonest','deceitful','deceptive'],
  ['polite','courteous','civil','respectful'],['rude','impolite','discourteous','insolent'],
  ['arrogant','proud','haughty','conceited','pompous','vain'],['humble','modest','unassuming','meek'],
  ['eager','keen','enthusiastic','willing'],['reluctant','unwilling','hesitant','disinclined'],
  ['destroy','demolish','wreck','ruin','smash','shatter'],['mend','repair','fix','restore','renovate'],
  ['nimble','agile','lithe','deft','supple'],['clumsy','awkward','ungainly','inept'],
  ['dull','boring','tedious','monotonous','dreary'],['vivid','bright','brilliant','radiant','striking'],
  ['vague','unclear','ambiguous','imprecise','obscure'],['obvious','clear','evident','apparent'],
  ['genuine','real','authentic','true','legitimate'],['fake','false','counterfeit','bogus','artificial'],
  ['abundant','plentiful','ample','copious'],['scarce','rare','sparse','meagre'],
  ['hostile','aggressive','antagonistic','unfriendly','belligerent'],
  ['cautious','careful','wary','prudent'],['reckless','rash','impulsive','careless'],
  ['temporary','brief','fleeting','transient'],['permanent','lasting','enduring','eternal'],
  ['triumph','victory','win','success'],['defeat','loss','failure'],
  ['irritate','annoy','provoke','aggravate','exasperate'],['soothe','calm','pacify','comfort'],
  ['bewildered','confused','perplexed','baffled','puzzled'],
  ['prosperous','wealthy','rich','affluent','successful','thriving'],
  ['obstinate','stubborn','headstrong','determined','resolute','persistent','tenacious'],
  ['shy','timid','bashful','reserved','reticent'],['confident','bold','assertive'],
  ['solemn','serious','grave','sombre','earnest'],
  ['accept','agree','consent'],['refuse','reject','decline','deny'],
  ['praise','commend','applaud','compliment'],['criticise','condemn','blame','censure','denounce'],
  ['increase','grow','expand','enlarge','extend'],['decrease','reduce','diminish','shrink','lessen'],
  ['buy','purchase','acquire','obtain'],['arrive','reach','come','appear'],
  ['leave','depart','exit','withdraw'],['unite','combine','merge','join'],
  ['divide','separate','split','sever'],['defend','protect','guard','shield'],
  ['absurd','ridiculous','ludicrous','preposterous'],
  ['conquest','achievement','accomplishment','feat'],
  ['shout','yell','scream','bellow'],['grab','seize','snatch','clutch'],
  ['scatter','spread','distribute','disperse'],['laugh','giggle','chuckle'],
  ['choose','select','pick','opt'],['deserted','abandoned','empty','vacant'],
  ['shrewd','astute','cunning','sly','canny'],['naive','gullible','innocent'],
  ['anxious','nervous','worried','uneasy'],['meticulous','thorough','painstaking','scrupulous'],
  ['elated','overjoyed','ecstatic','euphoric','jubilant'],
  ['persistent','determined','resolute','dogged','tenacious'],
  ['serene','calm','peaceful','tranquil'],['turbulent','chaotic','stormy'],
  ['malevolent','wicked','evil','sinister'],['innocent','blameless','guiltless'],
];

const synMap2 = {};
for (const group of synonymGroups) {
  for (const word of group) {
    const wl = word.toLowerCase();
    if (!synMap2[wl]) synMap2[wl] = new Set();
    for (const other of group) {
      if (other.toLowerCase() !== wl) synMap2[wl].add(other.toLowerCase());
    }
  }
}

let ambig = 0;
for (const q of corrected) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === q.cp[0] && j === q.cp[1]) continue;
      const al = q.sA[i].toLowerCase(), bl = q.sB[j].toLowerCase();
      if (synMap2[al]?.has(bl) || synMap2[bl]?.has(al)) {
        console.log(`⚠ Q${q.id}: ${q.sA[i]}/${q.sB[j]} alt pair`);
        ambig++;
      }
    }
  }
}

const pairMap = {};
for (const q of corrected) {
  const k = [q.sA[q.cp[0]], q.sB[q.cp[1]]].map(w => w.toLowerCase()).sort().join('/');
  if (!pairMap[k]) pairMap[k] = [];
  pairMap[k].push(q.id);
}
let dups = 0;
for (const [p, ids] of Object.entries(pairMap)) {
  if (ids.length > 1) { console.log(`⚠ DUP: ${p}`); dups++; }
}

const dd = {1:0,2:0,3:0};
for (const q of corrected) dd[q.d]++;

const wf = {};
for (const q of corrected) for (const w of [...q.sA,...q.sB]) wf[w.toLowerCase()]=(wf[w.toLowerCase()]||0)+1;
const maxFreq = Math.max(...Object.values(wf));

console.log(`Ambiguous: ${ambig} | Dups: ${dups} | D1:${dd[1]} D2:${dd[2]} D3:${dd[3]} | Max freq: ${maxFreq}`);
