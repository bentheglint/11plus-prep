const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';

const vr = require('../src/questionData/vrData.js');
const qs = (vr.default || vr).topics.synonyms.questions;

const E = {
  1: "'Begin' and 'start' both mean to set something in motion — they are direct synonyms. 'Arrive' means to reach a place, 'carry' means to hold while moving, 'choose' means to pick, 'deliver' means to bring. ✓",
  6: "'Wealthy' and 'rich' both mean having a lot of money or possessions. 'Famous' means well known (you can be famous without being rich!). 'Polite' means well-mannered, 'honest' means truthful, 'strict' means firm with rules. ✓",
  7: "'Timid' and 'shy' both mean lacking confidence and being nervous around others. 'Bold' means the opposite — brave and confident. 'Rude' means bad-mannered, 'curious' means wanting to know things, 'proud' means self-satisfied. ✓",
  8: "'Joyful' and 'happy' both mean feeling great pleasure or delight. 'Brave' means courageous, 'polite' means well-mannered, 'honest' means truthful, 'strict' means firm. ✓",
  16: "'Angry' and 'cross' both mean feeling annoyed or upset with someone. 'Hungry' means wanting food, 'bored' means uninterested, 'gentle' means soft-natured, 'thirsty' means wanting a drink. ✓",
  19: "'Terrified' and 'scared' both mean feeling great fear. 'Terrified' is stronger but they share the same core meaning. 'Jealous' means envious, 'bored' means uninterested, 'lonely' means feeling alone, 'proud' means self-satisfied. ✓",
  21: "'Loud' and 'noisy' both mean making a lot of sound. 'Bright' describes light, 'rough' describes texture, 'smooth' means even, 'dark' means lacking light — all physical descriptions but about different things. ✓",
  22: "'Fast' and 'quick' both mean moving with speed. 'Heavy' describes weight, 'wide' describes breadth, 'narrow' means not wide, 'light' can mean not heavy — but none mean speedy. ✓",
  23: "'Big' and 'large' both mean great in size. 'Short' describes height, 'flat' means level, 'deep' describes depth, 'round' describes shape — all dimensions but different ones. ✓",
  24: "'Small' and 'little' both mean not big in size. 'Slow' describes speed, 'steep' describes angle, 'straight' means not curved, 'warm' describes temperature. ✓",
  25: "'Sad' and 'unhappy' both mean feeling sorrow. The prefix 'un-' in 'unhappy' reverses 'happy', giving us the same meaning as 'sad'. 'Hungry' means wanting food, 'nervous' means anxious, 'excited' means eager, 'curious' means inquisitive. ✓",
  26: "'Pretty' and 'beautiful' both mean pleasing to look at. 'Tall' describes height, 'clean' means free from dirt, 'fresh' means newly made, 'young' means not old. ✓",
  27: "'Clever' and 'smart' both mean having quick intelligence. 'Generous' means willing to give, 'patient' means able to wait calmly, 'curious' means wanting to learn, 'honest' means truthful. ✓",
  28: "'Rude' and 'impolite' both mean lacking good manners. The prefix 'im-' means 'not', so 'impolite' literally means 'not polite'. 'Noisy' means loud, 'selfish' means thinking only of yourself, 'greedy' means wanting too much, 'clumsy' means awkward. ✓",
  29: "'Silent' and 'quiet' both mean making little or no sound. 'Sharp' means having a fine edge, 'smooth' means even, 'flat' means level, 'pointed' means tapering to a tip. ✓",
  30: "'Shut' and 'close' both mean to block an opening. 'Open' is the opposite. 'Push' means to press away, 'pull' means to draw towards, 'lift' means to raise up. ✓",
  31: "'Reply' and 'answer' both mean to respond when asked a question. 'Ask' is the opposite action. 'Forget' means to fail to remember, 'remember' means to recall, 'ignore' means to pay no attention. ✓",
  32: "'Lucky' and 'fortunate' both mean having good luck. 'Strict' means firm, 'early' means before time, 'late' means after time, 'popular' means well-liked. ✓",
  33: "'Choose' and 'select' both mean to pick one thing from several options. 'Explain' means to make clear, 'whisper' means to speak softly, 'promise' means to commit, 'deliver' means to bring. ✓",
  34: "'Grab' and 'seize' both mean to take hold of something suddenly and firmly. 'Throw' means to send through the air, 'pour' means to make liquid flow, 'stack' means to pile up, 'sweep' means to clean. ✓",
  35: "'Laugh' and 'giggle' both mean making sounds of amusement. A giggle is a lighter, quieter laugh. 'Sneeze', 'yawn', 'cough', and 'hiccup' are involuntary body sounds, not about amusement. ✓",
  36: "'Destroy' and 'demolish' both mean to completely wreck something. 'Polish' means to make shiny, 'decorate' means to make attractive, 'arrange' means to put in order, 'measure' means to find the size. ✓",
  37: "'Mend' and 'repair' both mean to fix something broken. 'Bend' means to curve, 'wrap' means to cover, 'fold' means to crease, 'pour' means to make liquid flow. ✓",
  38: "'Shout' and 'yell' both mean to call out in a loud voice. 'Clap' and 'wave' are hand gestures, 'point' and 'nod' are body movements — none are vocal sounds. ✓",
  39: "'Scatter' and 'spread' both mean to distribute things over a wide area. 'Squeeze' means to press, 'twist' means to turn, 'stretch' means to extend, 'spin' means to rotate. ✓",
  40: "'Ancient' and 'old' both mean having existed for a very long time. 'Heavy' describes weight, 'rough' describes texture, 'narrow' describes width, 'hollow' means empty inside. ✓",
  41: "'Ill' and 'sick' both mean not in good health. 'Cheerful' means happy, 'strict' means firm, 'popular' means well-liked, 'famous' means well known. ✓",
  42: "'Gift' and 'present' both mean something given to someone on a special occasion. 'Stone', 'path', 'bridge', and 'cloud' are everyday nouns from completely different categories. ✓",
  43: "'Error' and 'mistake' both mean something done incorrectly. 'Carpet', 'window', 'garden', and 'blanket' are household nouns — none relate to getting things wrong. ✓",
  44: "'Centre' and 'middle' both mean the point equally distant from all edges. 'Edge' means the outer limit, 'corner' is where edges meet, 'border' means boundary, 'side' means left or right part. ✓",
  101: "'Afraid' and 'frightened' both mean feeling fear. 'Cheerful' means happy, 'strict' means firm, 'popular' means well-liked, 'famous' means well known — none describe fear. ✓",
  102: "'Tidy' and 'neat' both mean arranged in an orderly way. 'Loud' describes volume, 'frozen' means turned to ice, 'melted' means turned liquid, 'boiling' means extremely hot. ✓",
  103: "'Glad' and 'pleased' both mean feeling happy about something. 'Grumpy' means bad-tempered (nearly opposite!). 'Early' means before time, 'late' means after time, 'firm' means solid or strict. ✓",
  104: "'Keep' and 'hold' both mean to have something in your possession. 'Drop' means to let fall (nearly opposite!). 'Fetch' means to go and get, 'carry' means to transport, 'leave' means to go away. ✓",
  105: "'Below' and 'under' both mean in a lower position. 'Beside' means next to, 'above' means higher (the opposite!). 'Over' means above, 'near' means close to. ✓",
  106: "'Leap' and 'jump' both mean to spring up from the ground. 'Crawl' means to move on hands and knees, 'throw' means to send through the air, 'catch' means to grab, 'creep' means to move slowly. ✓",
  107: "'Thin' and 'slim' both mean having little width. 'Deep' describes depth, 'tall' describes height, 'high' means at a great height, 'wide' means broad. ✓",
  108: "'Damp' and 'wet' both mean slightly covered in water. 'Cold' describes temperature, 'bright' describes light, 'shiny' means reflecting light, 'dark' means lacking light. ✓",
  2: "'Peculiar' and 'strange' both mean unusual or different from what is expected. 'Normal' is nearly the opposite — ordinary. 'Polite' means well-mannered, 'familiar' means well known, 'gentle' means soft and kind. ✓",
  3: "'Conceal' and 'hide' both mean to keep something out of sight. Watch out — 'reveal' means the opposite (to show something hidden), a common trap! 'Discover' means to find, 'approach' means to come near, 'announce' means to declare. ✓",
  9: "'Thrifty' and 'economical' both mean careful with money, avoiding waste. 'Wasteful' is the opposite — spending too freely. 'Wealthy' means having lots of money (different from being careful with it!). 'Lavish' means very generous, 'famous' means well known. ✓",
  10: "'Obstinate' and 'stubborn' both mean refusing to change your mind. 'Flexible' is the opposite — willing to adapt. 'Cheerful' means happy, 'adaptable' means able to adjust, 'jolly' means in good spirits. ✓",
  11: "'Vacant' and 'empty' both mean containing nothing. 'Occupied' is the opposite — being used. 'Narrow' describes width, 'steep' describes angle, 'noisy' describes sound. ✓",
  12: "'Flourish' and 'thrive' both mean to grow well and be successful. 'Wither' is the opposite — to shrivel and decline. Watch for this antonym trap! 'Stumble' means to trip, 'pause' means to stop briefly, 'wander' means to walk aimlessly. ✓",
  17: "'Annual' and 'yearly' both mean happening once every year. 'Daily' means every day, 'weekly' means every week, 'fortnightly' means every two weeks, 'monthly' means every month — different time intervals. ✓",
  20: "'Demonstrate' and 'show' both mean to display something or make it visible. 'Whisper' means to speak softly, 'collect' means to gather, 'announce' means to declare, 'borrow' means to take temporarily. ✓",
  45: "'Cautious' and 'careful' both mean taking care to avoid danger or mistakes. 'Reckless' is the opposite — acting without thinking. Watch for this antonym trap! 'Curious' means inquisitive, 'stubborn' means refusing to budge, 'cheerful' means happy. ✓",
  46: "'Generous' and 'charitable' both mean willing to give freely. 'Selfish' is the opposite — thinking only of yourself. 'Strict' means firm, 'ambitious' means driven, 'popular' means well-liked. ✓",
  47: "'Headstrong' and 'resolute' both mean firmly determined and unwilling to be swayed. 'Modest' means humble, 'cheerful' means happy, 'hollow' means empty inside, 'gentle' means soft. ✓",
  48: "'Deserted' and 'abandoned' both mean left empty with no people. 'Crowded' is the opposite — packed with people. 'Strict' means firm, 'famous' means well known, 'popular' means well-liked. ✓",
  49: "'Bashful' and 'reserved' both mean reluctant to draw attention to yourself. 'Confident' is the opposite — sure of yourself. 'Cheerful' means happy, 'bossy' means domineering, 'lively' means energetic. ✓",
  50: "'Purchase' and 'buy' both mean to get something by paying money. 'Sell' is the opposite — giving something for money. 'Borrow' means to take temporarily, 'lend' means to give temporarily, 'steal' means to take without permission. ✓",
  51: "'Genuine' and 'authentic' both mean real and not fake. 'Fake' is the opposite — not real. 'Popular' means well-liked, 'valuable' means worth a lot, 'rare' means hard to find. ✓",
  52: "'Abundant' and 'plentiful' both mean existing in very large quantities. 'Scarce' is the opposite — in short supply. 'Heavy' describes weight, 'expensive' describes cost, 'enormous' describes size. ✓",
  53: "'Hostile' and 'unfriendly' both mean showing strong dislike. 'Welcoming' is the opposite — warm and open. 'Nervous' means anxious, 'formal' means proper, 'jealous' means envious. ✓",
  54: "'Reluctant' and 'unwilling' both mean not wanting to do something. 'Eager' is the opposite — keen and enthusiastic. 'Grateful' means thankful, 'curious' means inquisitive, 'hopeful' means optimistic. ✓",
  55: "'Praise' and 'commend' both mean to express approval. 'Criticise' is the opposite — to find fault. 'Question' means to ask, 'challenge' means to test, 'demand' means to insist. ✓",
  56: "'Decrease' and 'reduce' both mean to make smaller. 'Increase' is the opposite — to make bigger. 'Deliver' means to bring, 'collect' means to gather, 'borrow' means to take temporarily. ✓",
  57: "'Arrive' and 'reach' both mean to get to your destination. 'Depart' is the opposite — to leave. 'Wander' means to walk aimlessly, 'explore' means to investigate, 'escape' means to break free. ✓",
  58: "'Defend' and 'protect' both mean to keep safe from harm. 'Attack' is the opposite — to act aggressively. 'Inspect' means to examine, 'threaten' means to warn of danger, 'warn' means to alert. ✓",
  59: "'Accept' and 'agree' both mean to say yes. 'Refuse' is the opposite — to say no. 'Suggest' means to propose, 'request' means to ask, 'inform' means to tell. ✓",
  60: "'Unite' and 'combine' both mean to join things together. 'Separate' is the opposite — to divide apart. 'Deliver' means to bring, 'collect' means to gather, 'compete' means to try to win. ✓",
  61: "'Solemn' and 'serious' both mean grave and not smiling or joking. 'Cheerful' is the opposite — bright and happy. 'Clumsy' means awkward, 'jealous' means envious, 'generous' means giving. ✓",
  62: "'Vast' and 'immense' both mean extremely large in size. 'Steep' describes an angle, 'shallow' means not deep, 'narrow' means not wide, 'level' means flat. ✓",
  63: "'Vivid' and 'bright' both mean strong and intense in colour. 'Faded' is the opposite — pale and washed out. 'Rough' and 'smooth' describe texture, 'gentle' means soft. ✓",
  64: "'Polite' and 'courteous' both mean showing good manners. 'Rude' is the opposite — lacking manners. 'Wealthy' means rich, 'famous' means well known, 'strict' means firm. ✓",
  65: "'Sturdy' and 'robust' both mean strong and well-built. 'Flexible' is nearly the opposite — bendable. 'Narrow' describes width, 'steep' describes angle, 'smooth' describes texture. ✓",
  66: "'Arrogant' and 'conceited' both mean having too high an opinion of yourself. 'Humble' is the opposite — modest and not boastful. 'Anxious' means worried, 'curious' means inquisitive, 'generous' means giving. ✓",
  67: "'Vanish' and 'disappear' both mean to pass out of sight. 'Emerge' is the opposite — to come into view. 'Linger' means to stay, 'remain' means to stay behind, 'surface' means to come up from below. ✓",
  68: "'Eager' and 'keen' both mean enthusiastic and wanting to do something. 'Reluctant' is the opposite — not wanting to. 'Patient' means able to wait, 'grateful' means thankful, 'strict' means firm. ✓",
  69: "'Honest' and 'truthful' both mean always telling the truth. 'Deceitful' is the opposite — deliberately misleading. 'Confident' means self-assured, 'popular' means well-liked, 'ambitious' means driven. ✓",
  70: "'Dull' and 'boring' both mean not interesting. 'Exciting' is the opposite — thrilling. 'Nervous' means anxious, 'curious' means inquisitive, 'proud' means self-satisfied. ✓",
  71: "'Vague' and 'unclear' both mean not clearly expressed. 'Precise' is the opposite — exact and clear. 'Frequent' means often, 'sudden' means quick, 'permanent' means lasting forever. ✓",
  72: "'Glimpse' and 'glance' both mean a very brief, quick look. 'Shout' is about sound not sight, 'listen' is hearing, 'touch' is feeling, 'smell' is scent — all different senses. ✓",
  73: "'Temporary' and 'brief' both mean lasting only a short time. 'Permanent' is the opposite — lasting forever. 'Frequent' means often, 'sudden' means quick, 'gradual' means slow. ✓",
  74: "'Grasp' and 'grip' both mean to hold something firmly. 'Release' is the opposite — to let go. 'Bend' means to curve, 'fold' means to crease, 'stretch' means to extend. ✓",
  75: "'Triumph' and 'victory' both mean a great success or win. 'Effort', 'attempt', 'struggle', and 'challenge' are about the process of trying — not the result. ✓",
  76: "'Soggy' and 'damp' both mean slightly wet. 'Frozen' means turned to ice, 'boiling' means extremely hot, 'stale' means no longer fresh, 'melted' means changed from solid to liquid. ✓",
  109: "'Odour' and 'smell' both mean a scent detected through your nose. 'Flavour' is taste, 'texture' is touch, 'pattern' is sight, 'colour' is visual — all different senses. ✓",
  110: "'Voyage' and 'journey' both mean a long trip from one place to another. 'Detour' means going a different way, 'shortcut' means a quicker route, 'delay' means being held up, 'route' means the path taken. ✓",
  111: "'Assist' and 'help' both mean to give support. 'Prevent' is nearly the opposite — to stop something. 'Demand' means to insist, 'request' means to ask, 'block' means to obstruct. ✓",
  112: "'Weary' and 'exhausted' both mean extremely tired. 'Strict' means firm, 'cautious' means careful, 'bold' means brave, 'popular' means well-liked — none relate to tiredness. ✓",
  113: "'Stumble' and 'trip' both mean to catch your foot and nearly fall. 'Crumble' means to break into pieces, 'stretch' means to extend, 'bend' means to curve, 'break' means to separate. ✓",
  114: "'Scarce' and 'rare' both mean not found in large numbers. 'Frequent' is the opposite — happening often. 'Expensive' means costly, 'cheap' means low-priced, 'popular' means well-liked. ✓",
  115: "'Permit' and 'allow' both mean to give permission. 'Refuse' and 'forbid' are both opposites — refusing or banning something. 'Borrow' means to take temporarily, 'lend' means to give temporarily. ✓",
  116: "'Restore' and 'renovate' both mean to bring something back to good condition. 'Demolish' is the opposite — to completely destroy. 'Borrow' means to take temporarily, 'lend' means to give, 'neglect' means to ignore. ✓",
  117: "'Cunning' and 'sly' both mean clever in a sneaky, deceptive way. 'Honest' is the opposite — truthful and open. 'Clumsy' means awkward, 'awkward' is similar but cunning/sly is by far the closest pair. 'Generous' means giving. ✓",
  118: "'Ancient' and 'prehistoric' both mean belonging to the very distant past. 'Modern' is the opposite — present day. 'Steep' describes angle, 'narrow' describes width, 'popular' means well-liked. ✓",
  4: "'Diligent' and 'hardworking' both mean putting great care and effort into everything. 'Lazy' is the opposite — unwilling to work. 'Clumsy' means awkward, 'graceful' means elegant, 'careless' means not paying attention. ✓",
  5: "'Tranquil' and 'peaceful' both mean calm and free from disturbance. 'Noisy' is the opposite — full of loud sounds. 'Rapid' means fast, 'violent' means forceful, 'hectic' means very busy. ✓",
  13: "'Laborious' and 'arduous' both mean requiring a lot of hard work — exhausting tasks. 'Enjoyable' means pleasant. 'Popular' means well-liked, 'straightforward' means easy, 'famous' means well known. ✓",
  14: "'Elated' and 'overjoyed' both mean extremely happy. 'Despondent' is the opposite — deeply sad and hopeless. 'Indifferent' means not caring, 'astonished' means very surprised, 'sceptical' means doubting. ✓",
  15: "'Meticulous' and 'thorough' both mean paying careful attention to every detail. 'Spontaneous' is nearly the opposite — acting on impulse. 'Ambitious' means driven, 'versatile' means adaptable, 'prominent' means well known. ✓",
  18: "'Novice' and 'beginner' both mean someone new to an activity, still learning. 'Veteran' is the opposite — someone with lots of experience. 'Spectator' means a watcher, 'audience' means the people watching, 'competitor' means someone taking part. ✓",
  77: "'Serene' and 'calm' both mean peacefully quiet and free from worry. 'Turbulent' is the opposite — wild and chaotic. 'Hostile' means unfriendly, 'suspicious' means distrustful, 'ambitious' means driven. ✓",
  78: "'Persistent' and 'determined' both mean continuing firmly despite difficulties. 'Hesitant' is the opposite — uncertain and holding back. 'Indifferent' means not caring, 'rebellious' means resisting authority, 'impulsive' means acting rashly. ✓",
  79: "'Irritate' and 'annoy' both mean to make someone slightly angry. 'Soothe' is the opposite — to calm and comfort. 'Impress' means to cause admiration, 'astonish' means to shock, 'persuade' means to convince. ✓",
  80: "'Bewildered' and 'confused' both mean completely unable to understand what is happening. 'Confident' is nearly the opposite. 'Suspicious' means distrustful, 'reluctant' means unwilling, 'hostile' means aggressive. ✓",
  81: "'Nimble' and 'agile' both mean able to move quickly and lightly. 'Rigid' is nearly opposite — stiff and unbending. 'Fragile' means easily broken, 'sturdy' means strong, 'clumsy' is the opposite of nimble. ✓",
  82: "'Prosperous' and 'affluent' both mean wealthy and financially successful. 'Impoverished' is the opposite — extremely poor. 'Prominent' means well known, 'notorious' means famous for bad things, 'ambitious' means driven. ✓",
  83: "'Malevolent' means wishing evil on others, and 'wicked' means morally bad — closest in meaning. The Latin root 'mal-' means bad (like in 'malfunction'). 'Innocent' is the opposite. 'Cautious' means careful, 'suspicious' means distrustful, 'humble' means modest. ✓",
  84: "'Gregarious' and 'sociable' both mean enjoying the company of others. 'Solitary' is the opposite — preferring to be alone. 'Anxious' means worried, 'nervous' means uneasy, 'stubborn' means refusing to change. ✓",
  85: "'Shrewd' and 'astute' both mean having sharp judgement. 'Naive' is the opposite — lacking experience. 'Reserved' means quiet, 'impulsive' means acting without thinking, 'modest' means humble. ✓",
  86: "'Inevitable' and 'unavoidable' both mean certain to happen. 'Optional' is the opposite — you can choose. 'Gradual' means slow, 'sudden' means quick, 'unlikely' means probably won't happen. ✓",
  87: "'Scrupulous' and 'painstaking' both mean taking extreme care over every detail. 'Hasty' is the opposite — done too quickly. 'Ambitious' means driven, 'rushed' means done too fast, 'modest' means humble. ✓",
  88: "'Negligent' and 'careless' both mean failing to take proper care. 'Attentive' is the opposite — paying close attention. 'Strict' means firm, 'popular' means well-liked, 'ambitious' means driven. ✓",
  89: "'Obscure' and 'vague' both mean not clear or hard to understand. 'Prominent' is the opposite — standing out clearly. 'Trivial' means unimportant, 'significant' means important, 'remarkable' means worth noticing. ✓",
  90: "'Resilient' and 'tough' both mean able to recover from difficulties. 'Fragile' is the opposite — easily broken. 'Strict' means firm, 'popular' means well-liked, 'famous' means well known. ✓",
  91: "'Scrutinise' and 'examine' both mean to look at something very carefully. 'Overlook' is the opposite — to miss or fail to notice. 'Dismiss' means to reject, 'reject' means to refuse, 'discard' means to throw away. ✓",
  92: "'Tenacious' and 'dogged' both mean holding on firmly and refusing to give up. 'Yielding' is the opposite — giving way easily. 'Indifferent' means not caring, 'apathetic' means lacking enthusiasm, 'submissive' means giving in. ✓",
  93: "'Clandestine' and 'secret' both mean done in a hidden way. 'Public' is the opposite — open for all to see. 'Official' means formally approved, 'formal' means following rules, 'open' means accessible. ✓",
  94: "'Sublime' and 'magnificent' both mean awe-inspiringly beautiful or impressive. 'Dreadful' is the opposite — terrible. 'Ordinary' means unremarkable, 'average' means middle, 'terrible' means very bad. ✓",
  95: "'Valiant' and 'heroic' both mean showing great bravery in danger. 'Cautious' means careful, 'modest' means humble, 'reckless' means careless, 'timid' means lacking courage (nearly opposite!). ✓",
  96: "'Sparse' and 'meagre' both mean present in very small amounts. 'Abundant' is the opposite — present in large quantities. 'Frequent' means often, 'occasional' means sometimes, 'regular' means at fixed intervals. ✓",
  97: "'Absolve' and 'forgive' both mean to declare someone free from blame. 'Condemn' is the opposite — to declare guilty. 'Challenge' means to test, 'dispute' means to argue, 'forbid' means to ban. ✓",
  98: "'Compel' and 'force' both mean to make someone do something against their will. 'Reluctant' means unwilling, 'voluntary' means done by choice (not forced), 'optional' means not required, 'ambitious' means driven. ✓",
  99: "'Deteriorate' and 'decline' both mean to get progressively worse over time. 'Improve' is the opposite — to get better. 'Flourish' also means the opposite — to thrive. Watch for these antonym traps! ✓",
  100: "'Provoke' and 'aggravate' both mean to deliberately annoy or make things worse. 'Soothe' is the opposite — to calm. 'Impress' means to cause admiration, 'persuade' means to convince, 'inspire' means to motivate. ✓",
  119: "'Prudent' and 'wary' both mean acting with careful thought about possible dangers. 'Reckless' is the opposite — acting without thinking. 'Ambitious' means driven, 'popular' means well-liked, 'famous' means well known. ✓",
  120: "'Conquest' and 'achievement' both mean a great success or accomplishment. 'Surrender' is the opposite — giving up. 'Endeavour' means a determined effort, 'attempt' means a try, 'obstacle' means a barrier. ✓",
  121: "'Diminish' and 'dwindle' both mean to become gradually smaller over time. 'Expand' is the opposite — to grow larger. ✓",
  122: "'Absurd' and 'ridiculous' both mean completely unreasonable or wildly silly. 'Sensible' is the opposite — practical. 'Peculiar' means strange (related but weaker). 'Mysterious' means puzzling, 'conventional' means traditional. ✓",
  123: "'Absorb' and 'assimilate' both mean to take in and make part of a whole. 'Repel' is the opposite — to push away. 'Distribute' means to share out, 'inspect' means to examine, 'radiate' means to send out. ✓",
  124: "'Lithe' and 'supple' both mean flexible and moving gracefully. 'Rigid' is the opposite — stiff and unbending. 'Muscular' means having strong muscles (strong but not necessarily flexible), 'clumsy' means awkward, 'sluggish' means slow. ✓",
  125: "'Obsolete' and 'outdated' both mean no longer in use because something better has replaced it. 'Modern' is the opposite — present day. 'Popular' means well-liked, 'famous' means well known. ✓",
};

// Rebuild the entire synonym question section with new explanations
const content = fs.readFileSync(filePath, 'utf8');
const synStart = content.indexOf("synonyms: {");
const antStart = content.indexOf("antonyms: {");
const questionsStart = content.indexOf("questions: [", synStart);
const bracketStart = content.indexOf("[", questionsStart);
let depth = 0, bracketEnd = -1;
for (let i = bracketStart; i < content.length; i++) {
  if (content[i] === '[') depth++;
  if (content[i] === ']') depth--;
  if (depth === 0) { bracketEnd = i + 1; break; }
}

function fmt(q) {
  const ex = (E[q.id] || q.explanation).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const isJson = q.id >= 101;
  if (isJson) {
    return `        {
          "id": ${q.id},
          "difficulty": ${q.difficulty},
          "questionType": "pick-from-sets",
          "question": "Choose one word from each group that are closest in meaning.",
          "setA": ["${q.setA[0]}","${q.setA[1]}","${q.setA[2]}"],
          "setB": ["${q.setB[0]}","${q.setB[1]}","${q.setB[2]}"],
          "correctPair": [${q.correctPair[0]},${q.correctPair[1]}],
          "explanation": "${ex}"
        }`;
  }
  return `              {
                      id: ${q.id},
                      difficulty: ${q.difficulty},
                      questionType: "pick-from-sets",
                      question: "Choose one word from each group that are closest in meaning.",
                      setA: ["${q.setA[0]}","${q.setA[1]}","${q.setA[2]}"],
                      setB: ["${q.setB[0]}","${q.setB[1]}","${q.setB[2]}"],
                      correctPair: [${q.correctPair[0]},${q.correctPair[1]}],
                      explanation: "${ex}"
              }`;
}

const newArray = '[\n' + qs.map(q => fmt(q)).join(',\n') + '\n      ]';
const newContent = content.substring(0, bracketStart) + newArray + content.substring(bracketEnd);
fs.writeFileSync(filePath, newContent, 'utf8');

// Verify
delete require.cache[require.resolve('../src/questionData/vrData.js')];
const vr2 = require('../src/questionData/vrData.js');
const qs2 = (vr2.default || vr2).topics.synonyms.questions;

let updated = 0;
for (const q of qs2) {
  if (E[q.id] && q.explanation.includes(E[q.id].substring(0, 30))) updated++;
}
console.log(`Explanations updated: ${updated}/${Object.keys(E).length}`);

// Show samples
for (const id of [3, 14, 50, 83, 125]) {
  const q = qs2.find(q => q.id === id);
  console.log('\nQ' + id + '(D' + q.difficulty + '): ' + q.explanation.substring(0, 150));
}
