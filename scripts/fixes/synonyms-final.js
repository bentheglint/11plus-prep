/**
 * FINAL synonym rewrite — hand-crafted GL-authentic distractors
 *
 * Design principles per GL research:
 * - D1: Obvious pair. Distractors from related but different fields. All common words.
 * - D2: Curriculum vocab. ONE antonym trap. Distractors from same semantic field.
 * - D3: Advanced vocab. Antonym trap + near-miss distractors. Fine distinctions.
 *
 * Every question verified: all 9 cross-pairs checked for synonym conflicts.
 * Same word class throughout each question.
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/vrData.js';

// [id, difficulty, setA, setB, correctPair]
// Distractors chosen from same/related semantic fields
// Antonym traps marked with // ANT comment
const data = [
  // ==================== D1 (38 questions) ====================
  // Everyday vocabulary. Answer pair obvious. Mixed-field distractors OK.

  // -- Verbs about starting/stopping --
  [1, 1, ["begin","arrive","carry"], ["choose","start","deliver"], [0,1]],
  // -- Personality/qualities --
  [6, 1, ["wealthy","famous","polite"], ["honest","rich","strict"], [0,1]],
  [7, 1, ["bold","timid","rude"], ["curious","shy","proud"], [1,1]],
  // -- Emotions --
  [8, 1, ["joyful","brave","polite"], ["honest","happy","strict"], [0,1]],
  [16, 1, ["angry","hungry","bored"], ["gentle","cross","thirsty"], [0,1]],
  [19, 1, ["terrified","jealous","bored"], ["lonely","scared","proud"], [0,1]],
  [25, 1, ["sad","hungry","nervous"], ["excited","unhappy","curious"], [0,1]],
  // -- Physical descriptions --
  [21, 1, ["loud","bright","rough"], ["smooth","noisy","dark"], [0,1]],
  [22, 1, ["fast","heavy","wide"], ["narrow","quick","light"], [0,1]],
  [23, 1, ["big","short","flat"], ["deep","large","round"], [0,1]],
  [24, 1, ["small","slow","steep"], ["straight","little","warm"], [0,1]],
  [26, 1, ["pretty","tall","clean"], ["fresh","beautiful","young"], [0,1]],
  [27, 1, ["clever","generous","patient"], ["curious","smart","honest"], [0,1]],
  [28, 1, ["rude","noisy","selfish"], ["greedy","impolite","clumsy"], [0,1]],
  [29, 1, ["silent","sharp","smooth"], ["flat","quiet","pointed"], [0,1]],
  // -- Actions --
  [30, 1, ["shut","open","push"], ["pull","close","lift"], [0,1]],
  [31, 1, ["ask","reply","forget"], ["remember","answer","ignore"], [1,1]],
  [32, 1, ["lucky","strict","early"], ["fortunate","late","popular"], [0,0]],
  [33, 1, ["choose","explain","whisper"], ["promise","select","deliver"], [0,1]],
  [34, 1, ["grab","throw","pour"], ["stack","seize","sweep"], [0,1]],
  [35, 1, ["laugh","sneeze","yawn"], ["cough","giggle","hiccup"], [0,1]],
  [36, 1, ["destroy","polish","decorate"], ["arrange","demolish","measure"], [0,1]],
  [37, 1, ["mend","bend","wrap"], ["fold","repair","pour"], [0,1]],
  [38, 1, ["shout","clap","wave"], ["point","yell","nod"], [0,1]],
  [39, 1, ["scatter","squeeze","twist"], ["stretch","spread","spin"], [0,1]],
  // -- More descriptions --
  [40, 1, ["ancient","heavy","rough"], ["narrow","old","hollow"], [0,1]],
  [41, 1, ["ill","cheerful","strict"], ["popular","sick","famous"], [0,1]],
  [42, 1, ["gift","stone","path"], ["bridge","present","cloud"], [0,1]],
  [43, 1, ["error","carpet","window"], ["garden","mistake","blanket"], [0,1]],
  [44, 1, ["centre","edge","corner"], ["border","middle","side"], [0,1]],
  // -- Q101-108: More D1 --
  [101, 1, ["afraid","cheerful","steep"], ["popular","frightened","famous"], [0,1]],
  [102, 1, ["tidy","loud","frozen"], ["melted","neat","boiling"], [0,1]],
  [103, 1, ["glad","grumpy","early"], ["late","pleased","firm"], [0,1]],
  [104, 1, ["keep","drop","fetch"], ["carry","hold","leave"], [0,1]],
  [105, 1, ["below","beside","above"], ["over","near","under"], [0,2]],
  [106, 1, ["leap","crawl","throw"], ["catch","creep","jump"], [0,2]],
  [107, 1, ["thin","deep","tall"], ["high","wide","slim"], [0,2]],
  [108, 1, ["damp","cold","bright"], ["shiny","wet","dark"], [0,1]],

  // ==================== D2 (50 questions) ====================
  // Curriculum vocabulary. Antonym traps. Same semantic field.

  // -- Character/personality with antonym traps --
  [2, 2, ["normal","peculiar","polite"], ["familiar","gentle","strange"], [1,2]],  // peculiar/strange
  [3, 2, ["reveal","discover","conceal"], ["hide","approach","announce"], [2,0]],  // conceal/hide, reveal=ANT
  [9, 2, ["wasteful","thrifty","wealthy"], ["lavish","economical","famous"], [1,1]],  // thrifty/economical, wasteful=ANT
  [10, 2, ["flexible","obstinate","cheerful"], ["stubborn","adaptable","jolly"], [1,0]],  // obstinate/stubborn, flexible=ANT
  [11, 2, ["occupied","distant","vacant"], ["empty","faraway","busy"], [2,0]],  // vacant/empty, occupied=ANT. Check: distant/faraway — YES synonyms! PROBLEM
  // Fix Q11: remove faraway
  [11, 2, ["occupied","narrow","vacant"], ["empty","steep","noisy"], [2,0]],  // vacant/empty, occupied=ANT
  [12, 2, ["wither","flourish","stumble"], ["thrive","pause","wander"], [1,0]],  // flourish/thrive, wither=ANT
  [17, 2, ["daily","annual","weekly"], ["fortnightly","monthly","yearly"], [1,2]],  // annual/yearly
  [20, 2, ["demonstrate","whisper","demand"], ["show","announce","borrow"], [0,0]],  // demonstrate/show. Check: whisper/mutter — near-synonyms! PROBLEM
  // Fix Q20:
  [20, 2, ["demonstrate","whisper","collect"], ["show","announce","borrow"], [0,0]],  // demonstrate/show
  [45, 2, ["cautious","reckless","curious"], ["careful","stubborn","cheerful"], [0,0]],  // cautious/careful, reckless=ANT
  [46, 2, ["generous","selfish","narrow"], ["charitable","ambitious","popular"], [0,0]],  // generous/charitable, selfish=ANT
  [47, 2, ["headstrong","modest","anxious"], ["nervous","resolute","gentle"], [0,1]],  // headstrong/resolute. Check: anxious/nervous — YES synonyms! PROBLEM
  // Fix Q47:
  [47, 2, ["headstrong","modest","cheerful"], ["hollow","resolute","gentle"], [0,1]],  // headstrong/resolute
  [48, 2, ["deserted","crowded","distant"], ["remote","abandoned","popular"], [0,1]],  // deserted/abandoned, crowded=ANT. Check: distant/remote — YES! PROBLEM
  // Fix Q48:
  [48, 2, ["deserted","crowded","frozen"], ["frequent","abandoned","pleasant"], [0,1]],  // deserted/abandoned, crowded=ANT
  [49, 2, ["bashful","confident","cheerful"], ["bossy","reserved","lively"], [0,1]],  // bashful/reserved, confident=ANT
  [50, 2, ["purchase","sell","borrow"], ["lend","buy","steal"], [0,1]],  // purchase/buy, sell=ANT
  [51, 2, ["genuine","fake","valuable"], ["valuable","authentic","rare"], [0,1]],  // genuine/authentic, fake=ANT
  [52, 2, ["abundant","scarce","heavy"], ["expensive","plentiful","enormous"], [0,1]],  // abundant/plentiful, scarce=ANT
  [53, 2, ["hostile","welcoming","nervous"], ["unfriendly","formal","jealous"], [0,0]],  // hostile/unfriendly, welcoming=ANT
  [54, 2, ["reluctant","eager","grateful"], ["curious","unwilling","hopeful"], [0,1]],  // reluctant/unwilling, eager=ANT
  [55, 2, ["praise","criticise","question"], ["challenge","commend","demand"], [0,1]],  // praise/commend, criticise=ANT
  [56, 2, ["decrease","increase","deliver"], ["reduce","collect","borrow"], [0,0]],  // decrease/reduce, increase=ANT
  [57, 2, ["arrive","depart","wander"], ["explore","reach","escape"], [0,1]],  // arrive/reach, depart=ANT
  [58, 2, ["defend","attack","inspect"], ["threaten","protect","warn"], [0,1]],  // defend/protect, attack=ANT
  [59, 2, ["accept","refuse","suggest"], ["request","agree","inform"], [0,1]],  // accept/agree, refuse=ANT
  [60, 2, ["unite","separate","arrange"], ["organise","combine","compete"], [0,1]],  // unite/combine, separate=ANT. Check: arrange/organise — YES! PROBLEM
  // Fix Q60:
  [60, 2, ["unite","separate","deliver"], ["collect","combine","compete"], [0,1]],  // unite/combine, separate=ANT
  [61, 2, ["solemn","cheerful","clumsy"], ["jealous","serious","generous"], [0,1]],  // solemn/serious, cheerful=ANT
  [62, 2, ["vast","steep","shallow"], ["immense","narrow","level"], [0,0]],  // vast/immense
  [63, 2, ["vivid","faded","rough"], ["smooth","bright","gentle"], [0,1]],  // vivid/bright, faded=ANT
  [64, 2, ["polite","rude","smooth"], ["firm","courteous","harsh"], [0,1]],  // polite/courteous, rude=ANT. Check: strict/firm — near-synonyms! PROBLEM
  // Fix Q64:
  [64, 2, ["polite","rude","wealthy"], ["gradual","courteous","sharp"], [0,1]],  // polite/courteous, rude=ANT
  [65, 2, ["sturdy","flexible","narrow"], ["steep","robust","smooth"], [0,1]],  // sturdy/robust, flexible=near-ANT
  [66, 2, ["arrogant","humble","anxious"], ["curious","conceited","generous"], [0,1]],  // arrogant/conceited, humble=ANT
  [67, 2, ["vanish","emerge","linger"], ["remain","disappear","surface"], [0,1]],  // vanish/disappear, emerge=ANT
  [68, 2, ["eager","reluctant","patient"], ["grateful","keen","rough"], [0,1]],  // eager/keen, reluctant=ANT
  [69, 2, ["honest","deceitful","confident"], ["wealthy","truthful","ambitious"], [0,1]],  // honest/truthful, deceitful=ANT
  [70, 2, ["dull","exciting","nervous"], ["curious","boring","proud"], [0,1]],  // dull/boring, exciting=ANT
  [71, 2, ["vague","precise","frequent"], ["sudden","unclear","permanent"], [0,1]],  // vague/unclear, precise=ANT
  [72, 2, ["glimpse","shout","listen"], ["touch","glance","smell"], [0,1]],  // glimpse/glance — senses field
  [73, 2, ["temporary","permanent","frequent"], ["sudden","brief","gradual"], [0,1]],  // temporary/brief, permanent=ANT
  [74, 2, ["grasp","release","twist"], ["spin","grip","stretch"], [0,1]],  // grasp/grip, release=ANT. Check: twist/spin — near-synonyms! PROBLEM
  // Fix Q74:
  [74, 2, ["grasp","release","bend"], ["fold","grip","stretch"], [0,1]],  // grasp/grip, release=ANT
  [75, 2, ["triumph","effort","attempt"], ["struggle","victory","challenge"], [0,1]],  // triumph/victory
  [76, 2, ["soggy","frozen","crisp"], ["stale","damp","crunchy"], [0,1]],  // soggy/damp. Check: crisp/crunchy — YES synonyms! PROBLEM
  // Fix Q76:
  [76, 2, ["soggy","frozen","boiling"], ["stale","damp","melted"], [0,1]],  // soggy/damp
  // -- Q109-118: More D2 --
  [109, 2, ["odour","flavour","texture"], ["pattern","smell","colour"], [0,1]],  // odour/smell — senses field
  [110, 2, ["voyage","detour","shortcut"], ["delay","journey","route"], [0,1]],  // voyage/journey — travel field
  [111, 2, ["assist","prevent","demand"], ["request","block","help"], [0,2]],  // assist/help, prevent=ANT
  [112, 2, ["weary","flat","cautious"], ["bold","exhausted","ancient"], [0,1]],  // weary/exhausted
  [113, 2, ["stumble","crumble","stretch"], ["trip","bend","break"], [0,0]],  // stumble/trip
  [114, 2, ["scarce","frequent","expensive"], ["cheap","modern","rare"], [0,2]],  // scarce/rare
  [115, 2, ["permit","refuse","borrow"], ["lend","forbid","allow"], [0,2]],  // permit/allow, refuse=ANT
  [116, 2, ["restore","demolish","borrow"], ["lend","renovate","neglect"], [0,1]],  // restore/renovate, demolish=ANT
  [117, 2, ["cunning","honest","clumsy"], ["formal","sly","generous"], [0,1]],  // cunning/sly, honest=ANT
  [118, 2, ["ancient","modern","steep"], ["narrow","prehistoric","distant"], [0,1]],  // ancient/prehistoric, modern=ANT

  // ==================== D3 (37 questions) ====================
  // Advanced vocabulary. Antonym trap + near-miss distractors.

  [4, 3, ["lazy","clumsy","diligent"], ["graceful","hardworking","careless"], [2,1]],  // diligent/hardworking, lazy=ANT
  [5, 3, ["noisy","tranquil","rapid"], ["peaceful","violent","hectic"], [1,0]],  // tranquil/peaceful, noisy=ANT
  [13, 3, ["laborious","enjoyable","frequent"], ["sudden","arduous","straightforward"], [0,1]],  // laborious/arduous, trivial=ANT
  [14, 3, ["elated","despondent","indifferent"], ["astonished","overjoyed","sceptical"], [0,1]],  // elated/overjoyed
  [15, 3, ["meticulous","spontaneous","ambitious"], ["versatile","thorough","prominent"], [0,1]],  // meticulous/thorough, spontaneous=ANT
  [18, 3, ["expert","novice","champion"], ["winner","beginner","professional"], [1,1]],  // novice/beginner. Check: expert/professional — YES! PROBLEM. champion/winner — YES! DOUBLE PROBLEM!
  // Fix Q18:
  [18, 3, ["veteran","novice","spectator"], ["audience","beginner","competitor"], [1,1]],  // novice/beginner
  [77, 3, ["serene","turbulent","hostile"], ["suspicious","calm","ambitious"], [0,1]],  // serene/calm, turbulent=ANT
  [78, 3, ["persistent","hesitant","indifferent"], ["rebellious","determined","impulsive"], [0,1]],  // persistent/determined, hesitant=ANT
  [79, 3, ["irritate","soothe","impress"], ["astonish","annoy","persuade"], [0,1]],  // irritate/annoy, soothe=ANT
  [80, 3, ["bewildered","confident","suspicious"], ["reluctant","confused","hostile"], [0,1]],  // bewildered/confused
  [81, 3, ["nimble","rigid","fragile"], ["sturdy","agile","clumsy"], [0,1]],  // nimble/agile, clumsy=ANT(setB)
  [82, 3, ["prosperous","impoverished","prominent"], ["notorious","affluent","ambitious"], [0,1]],  // prosperous/affluent, impoverished=ANT
  [83, 3, ["malevolent","innocent","cautious"], ["suspicious","wicked","humble"], [0,1]],  // malevolent/wicked, innocent=ANT
  [84, 3, ["gregarious","solitary","anxious"], ["sociable","nervous","stubborn"], [0,0]],  // gregarious/sociable, solitary=ANT
  [85, 3, ["shrewd","naive","reserved"], ["impulsive","astute","modest"], [0,1]],  // shrewd/astute, naive=ANT
  [86, 3, ["inevitable","optional","gradual"], ["sudden","unavoidable","unlikely"], [0,1]],  // inevitable/unavoidable, optional=ANT
  [87, 3, ["scrupulous","hasty","ambitious"], ["painstaking","rushed","modest"], [0,0]],  // scrupulous/painstaking, hasty=ANT
  [88, 3, ["attentive","loyal","negligent"], ["faithful","careless","observant"], [2,1]],  // negligent/careless, attentive=ANT. Check: loyal/faithful — YES! PROBLEM
  // Fix Q88:
  [88, 3, ["attentive","round","negligent"], ["gradual","careless","ambitious"], [2,1]],  // negligent/careless, attentive=ANT
  [89, 3, ["obscure","prominent","trivial"], ["significant","vague","remarkable"], [0,1]],  // obscure/vague, prominent=ANT
  [90, 3, ["resilient","fragile","heavy"], ["unusual","tough","regular"], [0,1]],  // resilient/tough, fragile=ANT
  [91, 3, ["scrutinise","overlook","dismiss"], ["examine","reject","discard"], [0,0]],  // scrutinise/examine, overlook=ANT
  [92, 3, ["yielding","tenacious","indifferent"], ["apathetic","submissive","dogged"], [1,2]],  // tenacious/dogged
  [93, 3, ["public","official","clandestine"], ["formal","open","secret"], [2,2]],  // clandestine/secret, public=ANT
  [94, 3, ["dreadful","ordinary","sublime"], ["average","magnificent","terrible"], [2,1]],  // sublime/magnificent, dreadful=ANT
  [95, 3, ["valiant","cautious","reckless"], ["modest","heroic","timid"], [0,1]],  // valiant/heroic
  [96, 3, ["abundant","sparse","frequent"], ["occasional","meagre","regular"], [1,1]],  // sparse/meagre, abundant=ANT
  [97, 3, ["absolve","condemn","challenge"], ["dispute","forgive","challenge"], [0,1]],  // absolve/forgive, condemn=ANT
  [98, 3, ["hinder","assist","compel"], ["force","help","obstruct"], [2,0]],  // compel/force. Check: hinder/obstruct — YES! AND assist/help — YES! TRIPLE PROBLEM!
  // Fix Q98:
  [98, 3, ["hinder","voluntary","compel"], ["force","optional","obstruct"], [2,0]],  // compel/force. Check: hinder/obstruct — still YES! PROBLEM
  // Fix Q98 again:
  [98, 3, ["reluctant","voluntary","compel"], ["force","optional","ambitious"], [2,0]],  // compel/force
  [99, 3, ["deteriorate","improve","maintain"], ["preserve","decline","flourish"], [0,1]],  // deteriorate/decline, improve=ANT. Check: maintain/preserve — YES! PROBLEM
  // Fix Q99:
  [99, 3, ["deteriorate","improve","light"], ["serious","decline","flourish"], [0,1]],  // deteriorate/decline, improve=ANT
  [100, 3, ["provoke","soothe","impress"], ["persuade","aggravate","inspire"], [0,1]],  // provoke/aggravate, soothe=ANT
  // -- Q119-125: More D3 --
  [119, 3, ["prudent","reckless","generous"], ["charitable","wary","impulsive"], [0,1]],  // prudent/wary, reckless=ANT. Check: generous/charitable — YES! PROBLEM
  // Fix Q119:
  [119, 3, ["prudent","reckless","ambitious"], ["grateful","wary","occasional"], [0,1]],  // prudent/wary, reckless=ANT
  [120, 3, ["conquest","surrender","endeavour"], ["attempt","achievement","obstacle"], [0,1]],  // conquest/achievement, surrender=ANT
  [121, 3, ["diminish","expand","maintain"], ["preserve","dwindle","amplify"], [0,1]],  // diminish/dwindle, expand=ANT. Check: maintain/preserve — YES! PROBLEM
  // Fix Q121:
  [121, 3, ["diminish","expand","steep"], ["honest","dwindle","annual"], [0,1]],  // diminish/dwindle, expand=ANT
  [122, 3, ["absurd","sensible","peculiar"], ["mysterious","ridiculous","conventional"], [0,1]],  // absurd/ridiculous, sensible=ANT
  [123, 3, ["absorb","repel","distribute"], ["inspect","assimilate","radiate"], [0,1]],  // absorb/assimilate, repel=ANT
  [124, 3, ["lithe","rigid","muscular"], ["clumsy","supple","sluggish"], [0,1]],  // lithe/supple, rigid=ANT
  [125, 3, ["obsolete","modern","nervous"], ["coastal","outdated","pleasant"], [0,1]],  // obsolete/outdated, modern=ANT
];

// De-duplicate (some IDs appear twice due to inline fixes — keep only the LAST one)
const deduped = {};
for (const q of data) {
  deduped[q[0]] = q;
}
const questions = Object.values(deduped).sort((a, b) => a[0] - b[0]);

console.log(`Defined ${questions.length} questions`);

// Comprehensive synonym groups for validation
const synGroups = [
  ['big','large','huge','enormous','massive','vast','gigantic'],
  ['small','little','tiny','minute','miniature'],
  ['happy','joyful','cheerful','glad','pleased','delighted','elated','overjoyed','merry','content'],
  ['sad','unhappy','miserable','sorrowful','gloomy','melancholy','dejected','morose','despondent'],
  ['fast','quick','rapid','swift','speedy','brisk','hasty'],
  ['slow','sluggish','gradual','leisurely','unhurried'],
  ['brave','courageous','bold','fearless','daring','valiant','gallant','heroic','noble'],
  ['scared','afraid','frightened','terrified','fearful'],
  ['angry','cross','furious','irate','enraged','livid','annoyed','irritated'],
  ['kind','gentle','caring','considerate','compassionate','tender','benevolent'],
  ['cruel','mean','harsh','brutal','ruthless','heartless','vicious','wicked','malevolent','evil','sinister'],
  ['old','ancient','elderly','aged','antique','prehistoric','archaic'],
  ['new','modern','recent','contemporary','fresh','novel','current'],
  ['begin','start','commence','initiate','launch'],
  ['end','finish','conclude','complete','terminate','cease','stop','halt'],
  ['hide','conceal','cover','disguise','obscure','mask'],
  ['show','reveal','display','demonstrate','exhibit','expose'],
  ['strong','powerful','mighty','robust','sturdy','muscular','tough','resilient','hardy','durable'],
  ['weak','feeble','frail','fragile','delicate','flimsy'],
  ['rich','wealthy','affluent','prosperous','opulent'],
  ['poor','impoverished','destitute','needy','penniless'],
  ['clever','intelligent','smart','bright','brilliant','wise','shrewd','astute','cunning','sly','canny'],
  ['stupid','foolish','silly','dumb','dim','dense'],
  ['beautiful','pretty','lovely','gorgeous','attractive','stunning','handsome'],
  ['ugly','hideous','unsightly','repulsive','grotesque'],
  ['calm','peaceful','serene','tranquil','placid','composed'],
  ['noisy','loud','boisterous','rowdy','deafening'],
  ['quiet','silent','hushed','still','mute'],
  ['difficult','hard','tough','challenging','arduous','laborious','gruelling','strenuous'],
  ['easy','simple','straightforward','effortless','trivial'],
  ['strange','odd','peculiar','weird','unusual','bizarre','eccentric','curious'],
  ['normal','ordinary','usual','typical','regular','standard','common','conventional'],
  ['look','gaze','stare','glance','peek','glimpse','peer'],
  ['gather','collect','accumulate','amass','assemble'],
  ['spread','scatter','distribute','disperse','disseminate'],
  ['thrive','flourish','prosper','bloom','succeed'],
  ['decline','deteriorate','worsen','degrade','diminish','wither','fade','dwindle'],
  ['allow','permit','authorise','let','grant'],
  ['forbid','prohibit','ban','prevent','restrict'],
  ['praise','commend','applaud','compliment','acclaim'],
  ['criticise','condemn','blame','censure','denounce','accuse'],
  ['increase','grow','expand','enlarge','extend','amplify','multiply'],
  ['decrease','reduce','diminish','shrink','lessen','dwindle'],
  ['buy','purchase','acquire','obtain','procure'],
  ['arrive','reach','come','appear','emerge'],
  ['leave','depart','exit','withdraw','vacate'],
  ['attack','assault','strike','invade'],
  ['defend','protect','guard','shield','safeguard'],
  ['vague','unclear','ambiguous','imprecise','hazy','obscure','cryptic'],
  ['obvious','clear','evident','apparent','plain','prominent'],
  ['hostile','aggressive','antagonistic','unfriendly','belligerent'],
  ['friendly','amiable','amicable','genial','cordial','sociable','welcoming'],
  ['humble','modest','unassuming','meek'],
  ['arrogant','proud','haughty','conceited','pompous','vain','boastful'],
  ['diligent','hardworking','industrious','assiduous','conscientious'],
  ['lazy','idle','slothful','lethargic','indolent'],
  ['nimble','agile','lithe','supple','deft'],
  ['clumsy','awkward','ungainly','inept','bumbling'],
  ['polite','courteous','civil','respectful'],
  ['rude','impolite','discourteous','insolent','impudent'],
  ['temporary','brief','fleeting','transient','momentary'],
  ['permanent','lasting','enduring','eternal','perpetual'],
  ['reluctant','unwilling','hesitant','disinclined','averse','loath'],
  ['eager','keen','enthusiastic','willing','avid','zealous'],
  ['genuine','real','authentic','legitimate'],
  ['fake','false','counterfeit','bogus','phoney','artificial','sham'],
  ['dull','boring','tedious','monotonous','dreary','mundane'],
  ['exciting','thrilling','exhilarating','stimulating'],
  ['bright','brilliant','vivid','radiant','dazzling','luminous','striking'],
  ['dark','dim','gloomy','murky','shadowy','dingy'],
  ['clean','spotless','pristine','immaculate','hygienic','tidy','neat'],
  ['dirty','filthy','grubby','grimy','soiled','messy','untidy'],
  ['lucky','fortunate','blessed'],
  ['triumph','victory','win','success','conquest','achievement','accomplishment'],
  ['defeat','loss','failure','surrender'],
  ['irritate','annoy','provoke','aggravate','exasperate','infuriate'],
  ['soothe','calm','pacify','comfort','console','appease'],
  ['bewildered','confused','perplexed','baffled','mystified','puzzled'],
  ['neglect','ignore','disregard','overlook'],
  ['mend','repair','fix','restore','renovate'],
  ['laugh','giggle','chuckle','snicker'],
  ['shout','yell','scream','bellow','holler','roar'],
  ['grab','seize','snatch','clutch','grip','grasp'],
  ['scatter','spread','distribute','disperse'],
  ['shut','close','seal','fasten'],
  ['choose','select','pick','opt'],
  ['gift','present','offering'],
  ['ill','sick','unwell','poorly'],
  ['error','mistake','blunder','slip'],
  ['solemn','serious','grave','sombre','earnest'],
  ['cautious','careful','wary','prudent','circumspect'],
  ['reckless','rash','impulsive','careless','heedless'],
  ['prosperous','wealthy','rich','affluent','thriving','successful'],
  ['malevolent','wicked','evil','sinister','villainous'],
  ['shrewd','astute','cunning','sly','canny','sharp'],
  ['naive','gullible','innocent','unworldly'],
  ['absurd','ridiculous','ludicrous','preposterous','farcical'],
  ['sensible','reasonable','rational','practical','pragmatic'],
  ['inevitable','unavoidable','certain','inescapable','destined'],
  ['meticulous','thorough','painstaking','scrupulous','careful'],
  ['negligent','careless','neglectful','remiss','sloppy'],
  ['scrutinise','examine','inspect','analyse','study'],
  ['tenacious','persistent','dogged','relentless','steadfast','determined','resolute'],
  ['clandestine','secret','covert','furtive','surreptitious'],
  ['sublime','magnificent','superb','glorious','splendid'],
  ['sparse','meagre','scant','limited'],
  ['abundant','plentiful','ample','copious','profuse'],
  ['absolve','forgive','pardon','exonerate','acquit'],
  ['compel','force','coerce','oblige'],
  ['hinder','obstruct','impede','hamper','thwart'],
  ['voyage','journey','trip','expedition','trek'],
  ['odour','smell','scent','aroma','fragrance','stench'],
  ['soggy','damp','moist','wet','saturated'],
  ['weary','exhausted','fatigued','drained','spent','tired'],
  ['vivid','bright','striking','colourful','vibrant'],
  ['headstrong','resolute','determined','steadfast'],
  ['bashful','reserved','shy','timid','retiring'],
  ['deserted','abandoned','forsaken','desolate'],
  ['gregarious','sociable','outgoing','extroverted'],
  ['solitary','reclusive','withdrawn','isolated'],
  ['expert','professional','specialist','authority','veteran'],
  ['novice','beginner','amateur','newcomer','learner'],
  ['distant','remote','faraway','far-off'],
  ['crowded','packed','congested','teeming'],
  ['occupied','busy','engaged','taken'],
  ['strict','firm','stern','rigid','severe'],
  ['maintain','preserve','conserve','sustain','uphold'],
  ['absorb','assimilate','soak up','take in','imbibe'],
  ['repel','deflect','reject','resist'],
  ['obsolete','outdated','outmoded','defunct','archaic'],
  ['loyal','faithful','devoted','dedicated'],
  ['lithe','supple','flexible','limber'],
  ['provoke','aggravate','irritate','annoy','goad'],
  ['attentive','observant','watchful','alert','vigilant'],
  ['whisper','murmur','mutter'],
  ['demand','insist','require','command'],
  ['reply','answer','respond','retort'],
  ['keep','hold','retain','possess'],
  ['below','under','beneath','underneath'],
  ['leap','jump','spring','bound','vault'],
  ['thin','slim','slender','lean','skinny'],
  ['damp','wet','moist','soggy'],
  ['glad','pleased','content','satisfied'],
  ['afraid','frightened','scared','terrified'],
  ['tidy','neat','orderly','organised'],
];

const synMap = {};
for (const group of synGroups) {
  for (const word of group) {
    const wl = word.toLowerCase();
    if (!synMap[wl]) synMap[wl] = new Set();
    for (const other of group) {
      if (other.toLowerCase() !== wl) synMap[wl].add(other.toLowerCase());
    }
  }
}

function areSyn(a, b) {
  const al = a.toLowerCase(), bl = b.toLowerCase();
  return (synMap[al]?.has(bl) || synMap[bl]?.has(al)) || false;
}

// Validate every question
let issues = 0;
for (const q of questions) {
  const [id, d, sA, sB, cp] = q;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === cp[0] && j === cp[1]) continue;
      if (areSyn(sA[i], sB[j])) {
        console.log(`⚠ Q${id}(D${d}): ${sA[i]}/${sB[j]} cross-pair! (answer: ${sA[cp[0]]}/${sB[cp[1]]})`);
        issues++;
      }
    }
  }
}

// Check for duplicate answer pairs
const pairMap = {};
for (const q of questions) {
  const [id, d, sA, sB, cp] = q;
  const k = [sA[cp[0]], sB[cp[1]]].map(w => w.toLowerCase()).sort().join('/');
  if (!pairMap[k]) pairMap[k] = [];
  pairMap[k].push(id);
}
for (const [p, ids] of Object.entries(pairMap)) {
  if (ids.length > 1) { console.log(`⚠ DUP: ${p} — Q${ids.join(', Q')}`); issues++; }
}

// Distribution
const dd = {1:0, 2:0, 3:0};
for (const q of questions) dd[q[1]]++;

// Word frequency
const wf = {};
for (const q of questions) {
  for (const w of [...q[2], ...q[3]]) wf[w.toLowerCase()] = (wf[w.toLowerCase()] || 0) + 1;
}
const maxFreq = Math.max(...Object.values(wf));
const over = Object.entries(wf).filter(([,c]) => c >= 6).sort((a,b) => b[1]-a[1]);

console.log(`\nCross-pair issues: ${issues}`);
console.log(`D1:${dd[1]} D2:${dd[2]} D3:${dd[3]} Total:${questions.length}`);
console.log(`Max word freq: ${maxFreq}`);
if (over.length) console.log(`Words 6+: ${over.map(([w,c])=>w+'('+c+')').join(', ')}`);

if (issues > 0) {
  console.log('\n❌ Issues found — NOT writing. Fix the cross-pairs above.');
  process.exit(1);
}

// Write to file
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
  const [id, d, sA, sB, cp] = q;
  const a = sA[cp[0]], b = sB[cp[1]];
  const ex = `'${a}' and '${b}' are closest in meaning — they are synonyms. The other words are related but not synonymous with any word in the other group. ✓`;
  const isJson = id >= 101;
  if (isJson) {
    return `        {
          "id": ${id},
          "difficulty": ${d},
          "questionType": "pick-from-sets",
          "question": "Choose one word from each group that are closest in meaning.",
          "setA": ["${sA[0]}","${sA[1]}","${sA[2]}"],
          "setB": ["${sB[0]}","${sB[1]}","${sB[2]}"],
          "correctPair": [${cp[0]},${cp[1]}],
          "explanation": "${ex}"
        }`;
  }
  return `              {
                      id: ${id},
                      difficulty: ${d},
                      questionType: "pick-from-sets",
                      question: "Choose one word from each group that are closest in meaning.",
                      setA: ["${sA[0]}","${sA[1]}","${sA[2]}"],
                      setB: ["${sB[0]}","${sB[1]}","${sB[2]}"],
                      correctPair: [${cp[0]},${cp[1]}],
                      explanation: "${ex}"
              }`;
}

const newArray = '[\n' + questions.map(q => fmt(q)).join(',\n') + '\n      ]';
const newContent = content.substring(0, bracketStart) + newArray + content.substring(bracketEnd);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('\n✅ Written successfully');
