/**
 * Write unique, teaching-focused explanations for all 125 synonym questions.
 * Each explains: WHY the pair are synonyms + WHY distractors are wrong.
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';

const vr = require('../src/questionData/vrData.js');
const qs = (vr.default || vr).topics.synonyms.questions;

// Hand-crafted explanations for every question
const explanations = {
  // ===== D1 =====
  1: "'Begin' and 'start' both mean to set something in motion — they are direct synonyms. 'Arrive' means to reach a place, 'carry' means to hold while moving, 'choose' means to pick, 'deliver' means to bring to someone. None of these mean the same as each other. ✓",
  6: "'Wealthy' and 'rich' both mean having a lot of money or possessions. 'Famous' means well known (you can be famous without being rich!). 'Polite' means well-mannered, 'honest' means truthful, 'strict' means firm with rules. ✓",
  7: "'Timid' and 'shy' both mean lacking confidence and being nervous around others. 'Bold' means the opposite — brave and confident. 'Rude' means bad-mannered, 'curious' means wanting to know things, 'proud' means feeling pleased with yourself. ✓",
  8: "'Joyful' and 'happy' both mean feeling great pleasure or delight. 'Brave' means courageous, 'polite' means well-mannered, 'honest' means truthful, 'strict' means firm — all positive qualities but none mean the same as happy. ✓",
  16: "'Angry' and 'cross' both mean feeling annoyed or upset with someone. 'Hungry' means wanting food, 'bored' means uninterested, 'gentle' means soft-natured, 'thirsty' means wanting a drink. ✓",
  19: "'Terrified' and 'scared' both mean feeling great fear. 'Terrified' is a stronger word but they share the same core meaning. 'Jealous' means envious, 'bored' means uninterested, 'lonely' means feeling alone, 'proud' means self-satisfied. ✓",
  21: "'Loud' and 'noisy' both mean making a lot of sound. 'Bright' describes light intensity, 'rough' describes an uneven surface, 'smooth' describes an even surface, 'dark' means lacking light — all physical descriptions but about different things. ✓",
  22: "'Fast' and 'quick' both mean moving with speed. 'Heavy' describes weight, 'wide' describes breadth, 'narrow' means not wide, 'light' can mean not heavy or not dark — but none mean speedy. ✓",
  23: "'Big' and 'large' both mean great in size. 'Short' describes height, 'flat' means level, 'deep' describes depth, 'round' describes shape — all words about dimensions but different ones. ✓",
  24: "'Small' and 'little' both mean not big in size. 'Slow' describes speed, 'steep' describes an angle, 'straight' means not curved, 'warm' describes temperature — none relate to size. ✓",
  25: "'Sad' and 'unhappy' both mean feeling sorrow or low spirits. The prefix 'un-' in 'unhappy' means 'not happy', giving us the same meaning as 'sad'. 'Hungry' means wanting food, 'nervous' means anxious, 'excited' means eager, 'curious' means inquisitive. ✓",
  26: "'Pretty' and 'beautiful' both mean pleasing to look at. 'Tall' describes height, 'clean' means free from dirt, 'fresh' means newly made, 'young' means not old — all positive but about different qualities. ✓",
  27: "'Clever' and 'smart' both mean having quick intelligence. 'Generous' means willing to give, 'patient' means able to wait calmly, 'curious' means wanting to learn, 'honest' means truthful — all good qualities but not about intelligence. ✓",
  28: "'Rude' and 'impolite' both mean lacking good manners. The prefix 'im-' in 'impolite' means 'not polite', giving us the same meaning as 'rude'. 'Noisy' means loud, 'selfish' means thinking only of yourself, 'greedy' means wanting too much, 'clumsy' means awkward in movement. ✓",
  29: "'Silent' and 'quiet' both mean making little or no sound. 'Sharp' means having a fine edge, 'smooth' means having an even surface, 'flat' means level, 'pointed' means tapering to a tip — all about physical qualities, not sound. ✓",
  30: "'Shut' and 'close' both mean to move something so it blocks an opening. 'Open' means the opposite — to unblock. 'Push' means to press away, 'pull' means to draw towards you, 'lift' means to raise up — all physical actions but not about closing. ✓",
  31: "'Reply' and 'answer' both mean to respond when someone speaks to you or asks a question. 'Ask' is the opposite action (posing the question). 'Forget' means to fail to remember, 'remember' means to recall, 'ignore' means to pay no attention. ✓",
  32: "'Lucky' and 'fortunate' both mean having good luck or being favoured by chance. 'Strict' means firm about rules, 'early' means before the expected time, 'late' means after the expected time, 'popular' means liked by many. ✓",
  33: "'Choose' and 'select' both mean to pick one thing from several options. 'Explain' means to make something clear, 'whisper' means to speak very softly, 'promise' means to commit to doing something, 'deliver' means to bring something to someone. ✓",
  34: "'Grab' and 'seize' both mean to take hold of something suddenly and firmly. 'Throw' means to send through the air, 'pour' means to make liquid flow, 'stack' means to pile up, 'sweep' means to clean with a brush. ✓",
  35: "'Laugh' and 'giggle' both mean making sounds of amusement. A giggle is a lighter, quieter laugh. 'Sneeze' and 'yawn' are involuntary body actions, 'cough' clears the throat, 'hiccup' is a spasm — none are about amusement. ✓",
  36: "'Destroy' and 'demolish' both mean to completely wreck or tear down something. 'Polish' means to make shiny, 'decorate' means to make attractive, 'arrange' means to put in order, 'measure' means to find the size — all very different actions. ✓",
  37: "'Mend' and 'repair' both mean to fix something that is broken or damaged. 'Bend' means to curve, 'wrap' means to cover, 'fold' means to crease over, 'pour' means to make liquid flow — all physical actions but not about fixing. ✓",
  38: "'Shout' and 'yell' both mean to call out in a loud voice. 'Clap' means to strike palms together, 'wave' means to move your hand in greeting, 'point' means to indicate direction, 'nod' means to move your head — all gestures, not vocal sounds. ✓",
  39: "'Scatter' and 'spread' both mean to distribute things over a wide area. 'Squeeze' means to press tightly, 'twist' means to turn, 'stretch' means to extend, 'spin' means to rotate — all physical movements but not about distributing. ✓",
  40: "'Ancient' and 'old' both mean having existed for a very long time. 'Heavy' describes weight, 'rough' describes texture, 'narrow' describes width, 'hollow' means empty inside — all physical descriptions but not about age. ✓",
  41: "'Ill' and 'sick' both mean not in good health. 'Cheerful' means happy and bright, 'strict' means firm about rules, 'popular' means liked by many, 'famous' means well known — none relate to health. ✓",
  42: "'Gift' and 'present' both mean something given to someone, especially on a special occasion. 'Stone' is a hard natural object, 'path' is a route to walk along, 'bridge' crosses over water, 'cloud' floats in the sky — everyday nouns but completely different from gifts. ✓",
  43: "'Error' and 'mistake' both mean something done incorrectly or wrongly. 'Carpet' covers a floor, 'window' lets in light, 'garden' is an outdoor growing space, 'blanket' keeps you warm — none relate to getting things wrong. ✓",
  44: "'Centre' and 'middle' both mean the point that is equally distant from all edges or ends. 'Edge' means the outer limit, 'corner' is where two edges meet, 'border' means the boundary, 'side' means the left or right part. ✓",
  101: "'Afraid' and 'frightened' both mean feeling fear about something. 'Cheerful' means happy, 'strict' means firm, 'popular' means well-liked, 'famous' means well known — none describe fear. ✓",
  102: "'Tidy' and 'neat' both mean arranged in an orderly, organised way. 'Loud' describes volume, 'frozen' means turned to ice, 'melted' means turned from solid to liquid, 'boiling' means extremely hot — all about physical states, not orderliness. ✓",
  103: "'Glad' and 'pleased' both mean feeling happy about something. 'Grumpy' means bad-tempered (nearly the opposite!). 'Early' means before time, 'late' means after time, 'firm' means solid or strict. ✓",
  104: "'Keep' and 'hold' both mean to have something in your possession or hands. 'Drop' means to let fall (nearly the opposite!). 'Fetch' means to go and get, 'carry' means to transport, 'leave' means to go away from. ✓",
  105: "'Below' and 'under' both mean in a lower position than something else. 'Beside' means next to, 'above' means higher than (the opposite!). 'Over' means above, 'near' means close to — all position words but different directions. ✓",
  106: "'Leap' and 'jump' both mean to spring up from the ground. 'Crawl' means to move on hands and knees, 'throw' means to send through the air, 'catch' means to grab something moving, 'creep' means to move slowly and quietly. ✓",
  107: "'Thin' and 'slim' both mean having little width or body fat. 'Deep' describes how far down something goes, 'tall' describes height, 'high' means at a great height, 'wide' means broad — all about dimensions but not about being thin. ✓",
  108: "'Damp' and 'wet' both mean slightly covered in water or moisture. 'Cold' describes temperature, 'bright' describes light, 'shiny' means reflecting light, 'dark' means lacking light — all physical qualities but not about moisture. ✓",

  // ===== D2 =====
  2: "'Peculiar' and 'strange' both mean unusual or different from what is expected. 'Normal' means the opposite — ordinary and expected. 'Polite' means well-mannered, 'familiar' means well known to you, 'gentle' means soft and kind. ✓",
  3: "'Conceal' and 'hide' both mean to keep something out of sight. Watch out for 'reveal' — it means the opposite (to show something hidden), which is a common trap! 'Discover' means to find something new, 'approach' means to come near, 'announce' means to declare publicly. ✓",
  9: "'Thrifty' and 'economical' both mean careful and sensible with money, avoiding waste. 'Wasteful' means the opposite — spending too freely. 'Wealthy' means having lots of money (different from being careful with it!), 'lavish' means very generous or extravagant, 'famous' means well known. ✓",
  10: "'Obstinate' and 'stubborn' both mean refusing to change your mind even when others disagree. 'Flexible' means the opposite — willing to change and adapt. 'Cheerful' means happy, 'adaptable' means able to adjust, 'jolly' means cheerful. ✓",
  11: "'Vacant' and 'empty' both mean containing nothing or having no one inside. 'Occupied' means the opposite — being used or filled. 'Narrow' describes width, 'steep' describes angle, 'noisy' describes sound level. ✓",
  12: "'Flourish' and 'thrive' both mean to grow well and be healthy and successful. 'Wither' means the opposite — to shrivel up and decline. Watch out for this antonym trap! 'Stumble' means to trip, 'pause' means to stop briefly, 'wander' means to walk without purpose. ✓",
  17: "'Annual' and 'yearly' both mean happening once every year. 'Daily' means every day, 'weekly' means every week, 'fortnightly' means every two weeks, 'monthly' means every month — all time frequencies but different intervals. ✓",
  20: "'Demonstrate' and 'show' both mean to display something or make it visible to others. 'Whisper' means to speak very softly, 'collect' means to gather, 'announce' means to declare, 'borrow' means to take temporarily. ✓",
  45: "'Cautious' and 'careful' both mean taking care to avoid danger or mistakes. 'Reckless' means the opposite — acting without thinking about consequences. Watch out for this antonym trap! 'Curious' means wanting to know, 'stubborn' means refusing to change, 'cheerful' means happy. ✓",
  46: "'Generous' and 'charitable' both mean willing to give money, help, or time freely. 'Selfish' means the opposite — thinking only of yourself. 'Strict' means firm about rules, 'ambitious' means wanting to succeed, 'popular' means well-liked. ✓",
  47: "'Headstrong' and 'resolute' both mean firmly determined and unwilling to be persuaded otherwise. 'Modest' means humble, 'cheerful' means happy, 'hollow' means empty inside, 'gentle' means soft-natured. ✓",
  48: "'Deserted' and 'abandoned' both mean left empty with no people remaining. 'Crowded' means the opposite — packed full of people. 'Strict' means firm, 'famous' means well known, 'popular' means well-liked. ✓",
  49: "'Bashful' and 'reserved' both mean reluctant to draw attention to yourself — quietly shy. 'Confident' means the opposite — sure of yourself and outgoing. 'Cheerful' means happy, 'bossy' means domineering, 'lively' means full of energy. ✓",
  50: "'Purchase' and 'buy' both mean to get something by paying money for it. 'Sell' means the opposite — giving something in exchange for money. 'Borrow' means to take temporarily, 'lend' means to give temporarily, 'steal' means to take without permission. ✓",
  51: "'Genuine' and 'authentic' both mean real, true, and not fake. 'Fake' means the opposite — not real, a copy. 'Popular' means well-liked, 'valuable' means worth a lot of money, 'rare' means not found often. ✓",
  52: "'Abundant' and 'plentiful' both mean existing in very large quantities — more than enough. 'Scarce' means the opposite — in short supply, hard to find. 'Heavy' describes weight, 'expensive' describes cost, 'enormous' describes size. ✓",
  53: "'Hostile' and 'unfriendly' both mean showing strong dislike or opposition. 'Welcoming' means the opposite — warm and open to others. 'Nervous' means anxious, 'formal' means following strict rules of behaviour, 'jealous' means envious. ✓",
  54: "'Reluctant' and 'unwilling' both mean not wanting to do something — hesitant and resistant. 'Eager' means the opposite — keen and enthusiastic. 'Grateful' means thankful, 'curious' means wanting to know, 'hopeful' means expecting good things. ✓",
  55: "'Praise' and 'commend' both mean to express approval and admiration for someone. 'Criticise' means the opposite — to find fault with someone. 'Question' means to ask, 'challenge' means to test, 'demand' means to insist. ✓",
  56: "'Decrease' and 'reduce' both mean to make something smaller in size, amount, or number. 'Increase' means the opposite — to make bigger. 'Deliver' means to bring to someone, 'collect' means to gather, 'borrow' means to take temporarily. ✓",
  57: "'Arrive' and 'reach' both mean to get to your destination. 'Depart' means the opposite — to leave a place. 'Wander' means to walk without a fixed route, 'explore' means to travel through unfamiliar areas, 'escape' means to break free. ✓",
  58: "'Defend' and 'protect' both mean to keep safe from harm or attack. 'Attack' means the opposite — to act aggressively against. 'Inspect' means to examine closely, 'threaten' means to warn of danger, 'warn' means to alert someone. ✓",
  59: "'Accept' and 'agree' both mean to say yes or give consent to something. 'Refuse' means the opposite — to say no. 'Suggest' means to put forward an idea, 'request' means to ask for something, 'inform' means to tell someone. ✓",
  60: "'Unite' and 'combine' both mean to join things together into one. 'Separate' means the opposite — to divide apart. 'Deliver' means to bring, 'collect' means to gather, 'compete' means to try to win against others. ✓",
  61: "'Solemn' and 'serious' both mean thoughtful, grave, and not smiling or joking. 'Cheerful' means the opposite — happy and bright. 'Clumsy' means physically awkward, 'jealous' means envious, 'generous' means willing to give. ✓",
  62: "'Vast' and 'immense' both mean extremely large in size or scale. 'Steep' describes a sharp angle, 'shallow' means not deep, 'narrow' means not wide, 'level' means flat and even. ✓",
  63: "'Vivid' and 'bright' both mean strong, clear, and intense in colour or detail. 'Faded' means the opposite — pale and washed out. 'Rough' describes an uneven texture, 'smooth' describes an even texture, 'gentle' means soft. ✓",
  64: "'Polite' and 'courteous' both mean showing good manners and respect for others. 'Rude' means the opposite — lacking manners. 'Wealthy' means rich, 'famous' means well known, 'strict' means firm about rules. ✓",
  65: "'Sturdy' and 'robust' both mean strong, well-built, and able to withstand pressure. 'Flexible' means the opposite — able to bend easily. 'Narrow' describes width, 'steep' describes angle, 'smooth' describes surface texture. ✓",
  66: "'Arrogant' and 'conceited' both mean having an excessively high opinion of yourself. 'Humble' means the opposite — modest and not boastful. 'Anxious' means worried, 'curious' means inquisitive, 'generous' means willing to give. ✓",
  67: "'Vanish' and 'disappear' both mean to pass out of sight completely. 'Emerge' means the opposite — to come into view. 'Linger' means to stay longer than expected, 'remain' means to stay behind, 'surface' means to come up from below. ✓",
  68: "'Eager' and 'keen' both mean very enthusiastic and wanting to do something. 'Reluctant' means the opposite — not wanting to do it. 'Patient' means able to wait calmly, 'grateful' means thankful, 'strict' means firm. ✓",
  69: "'Honest' and 'truthful' both mean always telling the truth and not lying. 'Deceitful' means the opposite — deliberately misleading. 'Confident' means self-assured, 'popular' means well-liked, 'ambitious' means driven to succeed. ✓",
  70: "'Dull' and 'boring' both mean not interesting or exciting. 'Exciting' means the opposite — thrilling and full of interest. 'Nervous' means anxious, 'curious' means inquisitive, 'proud' means self-satisfied. ✓",
  71: "'Vague' and 'unclear' both mean not clearly expressed or hard to understand. 'Precise' means the opposite — exact and clearly stated. 'Frequent' means happening often, 'sudden' means happening quickly, 'permanent' means lasting forever. ✓",
  72: "'Glimpse' and 'glance' both mean a very brief, quick look at something. 'Shout' is about sound not sight, 'listen' is about hearing, 'touch' is about feeling, 'smell' is about scent — these are all different senses. ✓",
  73: "'Temporary' and 'brief' both mean lasting for only a short time. 'Permanent' means the opposite — lasting forever. 'Frequent' means happening often, 'sudden' means without warning, 'gradual' means happening slowly over time. ✓",
  74: "'Grasp' and 'grip' both mean to hold something firmly and tightly. 'Release' means the opposite — to let go. 'Bend' means to curve, 'fold' means to crease, 'stretch' means to extend — all physical actions but not about holding. ✓",
  75: "'Triumph' and 'victory' both mean a great success or win. 'Effort' means energy put into something, 'attempt' means a try, 'struggle' means a difficult effort, 'challenge' means a test of ability — all about the process, not the result. ✓",
  76: "'Soggy' and 'damp' both mean slightly wet or moist. 'Frozen' means turned to ice, 'boiling' means extremely hot, 'stale' means no longer fresh, 'melted' means changed from solid to liquid — all about temperature or freshness, not wetness. ✓",
  109: "'Odour' and 'smell' both mean a scent that you detect through your nose. 'Flavour' is what you taste, 'texture' is what you feel, 'pattern' is what you see in a design, 'colour' is a visual quality — all different senses. ✓",
  110: "'Voyage' and 'journey' both mean a long trip from one place to another. 'Detour' means going a different way around, 'shortcut' means a quicker route, 'delay' means being held up, 'route' means the path taken. ✓",
  111: "'Assist' and 'help' both mean to give support or make something easier for someone. 'Prevent' means to stop something happening (nearly the opposite!). 'Demand' means to insist, 'request' means to ask, 'block' means to obstruct. ✓",
  112: "'Weary' and 'exhausted' both mean extremely tired and lacking energy. 'Strict' means firm about rules, 'cautious' means careful, 'bold' means brave, 'popular' means well-liked — none relate to tiredness. ✓",
  113: "'Stumble' and 'trip' both mean to catch your foot on something and nearly fall over. 'Crumble' means to break into small pieces, 'stretch' means to extend, 'bend' means to curve, 'break' means to separate into pieces. ✓",
  114: "'Scarce' and 'rare' both mean not found in large numbers — hard to come by. 'Frequent' means the opposite — happening often. 'Expensive' means costing a lot, 'cheap' means low-priced, 'popular' means well-liked. ✓",
  115: "'Permit' and 'allow' both mean to give someone permission to do something. 'Refuse' means the opposite — to say no. 'Forbid' also means the opposite — to ban something. 'Borrow' means to take temporarily, 'lend' means to give temporarily. ✓",
  116: "'Restore' and 'renovate' both mean to bring something back to its original good condition. 'Demolish' means the opposite — to completely destroy. 'Borrow' means to take temporarily, 'lend' means to give temporarily, 'neglect' means to fail to look after. ✓",
  117: "'Cunning' and 'sly' both mean clever in a sneaky, deceptive way. 'Honest' means the opposite — truthful and open. 'Clumsy' means physically awkward, 'awkward' means similar to clumsy — but cunning/sly is by far the closest pair here. 'Generous' means willing to give. ✓",
  118: "'Ancient' and 'prehistoric' both mean belonging to the very distant past, thousands of years ago. 'Modern' means the opposite — belonging to the present time. 'Steep' describes an angle, 'narrow' describes width, 'popular' means well-liked. ✓",

  // ===== D3 =====
  4: "'Diligent' and 'hardworking' both mean putting great care and effort into everything you do. 'Lazy' means the opposite — unwilling to work. 'Clumsy' means awkward in movement, 'graceful' means moving beautifully, 'careless' means not paying attention. ✓",
  5: "'Tranquil' and 'peaceful' both mean calm, quiet, and free from disturbance. 'Noisy' means the opposite — full of loud sounds. 'Rapid' means very fast, 'violent' means using force, 'hectic' means very busy and rushed. ✓",
  13: "'Laborious' and 'arduous' both mean requiring a lot of hard work and effort — exhausting tasks. 'Enjoyable' means pleasant (the opposite feeling!). 'Popular' means well-liked, 'straightforward' means easy to understand, 'famous' means well known. ✓",
  14: "'Elated' and 'overjoyed' both mean extremely happy — filled with great delight. 'Despondent' means the opposite — deeply sad and hopeless. 'Indifferent' means not caring either way, 'astonished' means very surprised, 'sceptical' means doubting. ✓",
  15: "'Meticulous' and 'thorough' both mean paying very careful attention to every detail, leaving nothing out. 'Spontaneous' means acting on impulse without planning (nearly the opposite!). 'Ambitious' means wanting to achieve great things, 'versatile' means able to adapt, 'prominent' means well known. ✓",
  18: "'Novice' and 'beginner' both mean someone who is new to an activity and still learning. 'Veteran' means someone with lots of experience (the opposite!). 'Spectator' means someone watching, 'audience' means the people watching a show, 'competitor' means someone taking part in a contest. ✓",
  77: "'Serene' and 'calm' both mean peacefully quiet and free from worry. 'Turbulent' means the opposite — wild, chaotic, and disturbed. 'Hostile' means unfriendly, 'suspicious' means distrustful, 'ambitious' means driven to succeed. ✓",
  78: "'Persistent' and 'determined' both mean continuing firmly despite difficulties — never giving up. 'Hesitant' means the opposite — uncertain and holding back. 'Indifferent' means not caring, 'rebellious' means resisting authority, 'impulsive' means acting without thinking. ✓",
  79: "'Irritate' and 'annoy' both mean to make someone slightly angry or frustrated. 'Soothe' means the opposite — to calm and comfort. 'Impress' means to make someone admire you, 'astonish' means to shock with surprise, 'persuade' means to convince. ✓",
  80: "'Bewildered' and 'confused' both mean completely unable to understand what is happening. 'Confident' means self-assured (nearly the opposite!). 'Suspicious' means distrustful, 'reluctant' means unwilling, 'hostile' means aggressive. ✓",
  81: "'Nimble' and 'agile' both mean able to move quickly and lightly with great coordination. 'Rigid' means stiff and unable to bend (nearly the opposite!). 'Fragile' means easily broken, 'sturdy' means strong and solid, 'clumsy' means the opposite of nimble. ✓",
  82: "'Prosperous' and 'affluent' both mean wealthy and financially successful. 'Impoverished' means the opposite — extremely poor. 'Prominent' means well known and important, 'notorious' means famous for something bad, 'ambitious' means driven. ✓",
  83: "'Malevolent' means wishing evil or harm on others, and 'wicked' means morally bad — they are closest in meaning. The Latin root 'mal-' means bad (like in 'malfunction'). 'Innocent' means the opposite — free from guilt. 'Cautious' means careful, 'suspicious' means distrustful, 'humble' means modest. ✓",
  84: "'Gregarious' and 'sociable' both mean enjoying the company of others and being outgoing. 'Solitary' means the opposite — preferring to be alone. 'Anxious' means worried, 'nervous' means uneasy, 'stubborn' means refusing to change. ✓",
  85: "'Shrewd' and 'astute' both mean having sharp judgement and being quick to understand situations. 'Naive' means the opposite — lacking experience and easily fooled. 'Reserved' means quiet and keeping to yourself, 'impulsive' means acting without thinking, 'modest' means humble. ✓",
  86: "'Inevitable' and 'unavoidable' both mean certain to happen — impossible to prevent. 'Optional' means the opposite — you can choose whether to do it or not. 'Gradual' means happening slowly, 'sudden' means happening quickly, 'unlikely' means probably won't happen. ✓",
  87: "'Scrupulous' and 'painstaking' both mean taking extreme care over every detail, being very thorough. 'Hasty' means the opposite — done too quickly without enough care. 'Ambitious' means wanting to achieve, 'rushed' means done too fast, 'modest' means humble. ✓",
  88: "'Negligent' and 'careless' both mean failing to take proper care — not giving enough attention. 'Attentive' means the opposite — paying close attention. 'Strict' means firm about rules, 'popular' means well-liked, 'ambitious' means driven to succeed. ✓",
  89: "'Obscure' and 'vague' both mean not clear, hard to see or understand. 'Prominent' means the opposite — standing out clearly and obviously. 'Trivial' means unimportant, 'significant' means important, 'remarkable' means worth noticing. ✓",
  90: "'Resilient' and 'tough' both mean able to recover quickly from difficulties and withstand pressure. 'Fragile' means the opposite — easily broken or damaged. 'Strict' means firm, 'popular' means well-liked, 'famous' means well known. ✓",
  91: "'Scrutinise' and 'examine' both mean to look at something very carefully and closely, checking every detail. 'Overlook' means the opposite — to miss or fail to notice. 'Dismiss' means to reject, 'reject' means to refuse, 'discard' means to throw away. ✓",
  92: "'Tenacious' and 'dogged' both mean holding on firmly and refusing to let go or give up. 'Yielding' means the opposite — giving way easily. 'Indifferent' means not caring, 'apathetic' means lacking enthusiasm, 'submissive' means ready to give in to others. ✓",
  93: "'Clandestine' and 'secret' both mean done in a hidden way, kept from public knowledge. 'Public' means the opposite — open for everyone to see. 'Official' means formally approved, 'formal' means following proper rules, 'open' means accessible. ✓",
  94: "'Sublime' and 'magnificent' both mean of the highest quality — awe-inspiringly beautiful or impressive. 'Dreadful' means the opposite — terrible. 'Ordinary' means normal and unremarkable, 'average' means in the middle, 'terrible' means very bad. ✓",
  95: "'Valiant' and 'heroic' both mean showing great bravery, especially in a dangerous situation. 'Cautious' means careful and avoiding risk, 'modest' means humble, 'reckless' means acting without care, 'timid' means lacking courage (nearly the opposite!). ✓",
  96: "'Sparse' and 'meagre' both mean thin on the ground — present in very small amounts. 'Abundant' means the opposite — present in large quantities. 'Frequent' means happening often, 'occasional' means happening from time to time, 'regular' means happening at fixed intervals. ✓",
  97: "'Absolve' and 'forgive' both mean to declare someone free from blame or guilt. 'Condemn' means the opposite — to declare guilty or express strong disapproval. 'Challenge' means to test, 'dispute' means to argue about, 'forbid' means to ban. ✓",
  98: "'Compel' and 'force' both mean to make someone do something against their will — to coerce. 'Reluctant' means unwilling, 'voluntary' means done by choice (not forced), 'optional' means not required, 'ambitious' means driven. ✓",
  99: "'Deteriorate' and 'decline' both mean to become progressively worse over time. 'Improve' means the opposite — to get better. 'Light' describes brightness, 'serious' means grave, 'flourish' means to thrive — note 'flourish' is the opposite of deteriorate, another trap! ✓",
  100: "'Provoke' and 'aggravate' both mean to deliberately annoy someone or make a situation worse. 'Soothe' means the opposite — to calm and comfort. 'Impress' means to cause admiration, 'persuade' means to convince, 'inspire' means to motivate. ✓",
  119: "'Prudent' and 'wary' both mean acting with careful thought, especially about possible dangers. 'Reckless' means the opposite — acting without thinking about consequences. 'Ambitious' means wanting to succeed, 'popular' means well-liked, 'famous' means well known. ✓",
  120: "'Conquest' and 'achievement' both mean a great success or notable accomplishment. 'Surrender' means the opposite — giving up. 'Endeavour' means a determined effort, 'attempt' means a try, 'obstacle' means something blocking the way. ✓",
  121: "'Diminish' and 'dwindle' both mean to become gradually smaller or fewer over time. 'Expand' means the opposite — to grow larger. 'Strict' means firm, 'popular' means well-liked, 'famous' means well known. ✓",
  122: "'Absurd' and 'ridiculous' both mean completely unreasonable or wildly silly. 'Sensible' means the opposite — practical and reasonable. 'Peculiar' means strange (related but weaker — not as extreme as absurd). 'Mysterious' means hard to explain, 'conventional' means following tradition. ✓",
  123: "'Absorb' and 'assimilate' both mean to take in and make part of a whole — to soak up knowledge or substances. 'Repel' means the opposite — to push away. 'Distribute' means to share out, 'inspect' means to examine, 'radiate' means to send out rays. ✓",
  124: "'Lithe' and 'supple' both mean having a body that moves easily and gracefully — flexible and elegant. 'Rigid' means the opposite — stiff and unbending. 'Muscular' means having strong muscles (strong but not necessarily flexible), 'clumsy' means awkward, 'sluggish' means slow and lazy. ✓",
  125: "'Obsolete' and 'outdated' both mean no longer in use because something better has replaced it. 'Modern' means the opposite — belonging to the present day. 'Popular' means well-liked, 'famous' means well known — neither is about being old-fashioned. ✓",
};

// Apply explanations to the file
let content = fs.readFileSync(filePath, 'utf8');
const synStart = content.indexOf("synonyms: {");
const antStart = content.indexOf("antonyms: {");

let section = content.substring(synStart, antStart);
let changeCount = 0;

for (const q of qs) {
  const newEx = explanations[q.id];
  if (!newEx) continue;

  // Find and replace the old explanation for this question
  const oldEx = q.explanation;
  if (oldEx && section.includes(oldEx)) {
    const escapedNew = newEx.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    section = section.replace(oldEx, escapedNew);
    changeCount++;
  }
}

const newContent = content.substring(0, synStart) + section + content.substring(antStart);
fs.writeFileSync(filePath, newContent, 'utf8');

console.log(`Updated ${changeCount} explanations out of ${Object.keys(explanations).length} defined`);
console.log(`Questions without new explanation: ${qs.length - changeCount}`);

// Verify a few
delete require.cache[require.resolve('../src/questionData/vrData.js')];
const vr2 = require('../src/questionData/vrData.js');
const qs2 = (vr2.default || vr2).topics.synonyms.questions;
for (const id of [1, 3, 14, 50, 83]) {
  const q = qs2.find(q => q.id === id);
  console.log('\nQ' + id + ': ' + q.explanation.substring(0, 120) + '...');
}
