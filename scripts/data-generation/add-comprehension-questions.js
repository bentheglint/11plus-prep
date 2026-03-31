/**
 * Add ~60 new comprehension questions:
 * - 35 word-class identification (completely missing category)
 * - 25 inference (under-represented)
 * Each attached to an existing passage.
 * Word-class questions are D2 (requires grammar knowledge applied to passage context)
 * Inference questions are D2 (reading between lines)
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/englishData.js';

const newQs = [
  // ===== WORD CLASS IDENTIFICATION (35 questions, mostly D2) =====
  // These ask children to identify word types in the passage context
  // GL tests: noun, verb, adjective, adverb, preposition, pronoun, conjunction

  // Passage: lighthouse-cat
  {id:351, d:2, pid:"lighthouse-cat", pt:"The Lighthouse Keeper's Cat",
    st:"word-class", q:"In the sentence 'The wind howled fiercely around the tower,' what type of word is 'fiercely'?",
    opts:["A noun (naming word)","A verb (doing word)","An adjective (describing word)","An adverb (tells us how something is done)","A preposition (position word)"],
    correct:3, ex:"'Fiercely' is an adverb — it tells us HOW the wind howled. Most adverbs end in '-ly' and answer the question 'how?'. If you can ask 'how did it happen?' and the word answers that, it's an adverb! ✓"},

  // Passage: peculiar-museum
  {id:352, d:2, pid:"peculiar-museum", pt:"The Peculiar Museum",
    st:"word-class", q:"In the sentence 'The ancient display cases were covered in dust,' what type of word is 'ancient'?",
    opts:["A noun","A verb","An adjective","An adverb","A pronoun"],
    correct:2, ex:"'Ancient' is an adjective — it describes the display cases, telling us what they're like. Adjectives answer the question 'what kind of?' — what kind of display cases? Ancient ones! ✓"},

  // Passage: hedgehogs
  {id:353, d:2, pid:"saving-hedgehogs", pt:"Saving the Hedgehogs",
    st:"word-class", q:"In the sentence 'Hedgehogs sleep through the cold winter months,' what type of word is 'through'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:4, ex:"'Through' is a preposition — it shows the relationship between 'sleep' and 'winter months'. Prepositions are position/direction words like 'in', 'on', 'under', 'through', 'between'. ✓"},

  // Passage: roman-baths
  {id:354, d:2, pid:"roman-baths-sulis", pt:"The Roman Baths of Aquae Sulis",
    st:"word-class", q:"In the sentence 'Visitors can still see the steaming green water today,' what type of word is 'steaming'?",
    opts:["A noun","A verb","An adjective","An adverb","A conjunction"],
    correct:2, ex:"'Steaming' is an adjective here — it describes the water (what kind of water? steaming water). Words ending in '-ing' can sometimes be verbs, but here it's describing a noun, so it's working as an adjective. ✓"},

  // Passage: storm-warning
  {id:355, d:2, pid:"storm-warning", pt:"Storm Warning",
    st:"word-class", q:"In the sentence 'The dark clouds gathered quickly above the village,' what type of word is 'gathered'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:1, ex:"'Gathered' is a verb — it's the action word telling us what the clouds DID. Verbs are doing or being words. What did the clouds do? They gathered! ✓"},

  // Passage: spiders-web
  {id:356, d:2, pid:"spiders-web", pt:"The Spider's Web",
    st:"word-class", q:"In the sentence 'She carefully placed the jar over the spider,' what type of word is 'carefully'?",
    opts:["A noun","A verb","An adjective","An adverb","A pronoun"],
    correct:3, ex:"'Carefully' is an adverb — it tells us HOW she placed the jar. The '-ly' ending is a big clue! Adverbs usually describe verbs, telling us how, when, or where something happens. ✓"},

  // Passage: hedgehogs-secret
  {id:357, d:2, pid:"secret-hedgehogs", pt:"The Secret Life of Hedgehogs",
    st:"word-class", q:"In the sentence 'They build warm nests from dry leaves and grass,' what type of word is 'warm'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:2, ex:"'Warm' is an adjective — it describes the nests (what kind of nests? warm ones). Adjectives are describing words that tell us more about a noun. ✓"},

  // Passage: rock-pools
  {id:358, d:2, pid:"rock-pools", pt:"The Rock Pools of Cornwall",
    st:"word-class", q:"In the sentence 'Tiny crabs scuttle between the rocks,' what type of word is 'between'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:4, ex:"'Between' is a preposition — it tells us WHERE the crabs scuttle (between the rocks). Prepositions show position or direction: in, on, under, between, through, beside. ✓"},

  // Passage: bees
  {id:359, d:2, pid:"bee-honey", pt:"How Bees Make Honey",
    st:"word-class", q:"In the sentence 'The busy workers collect nectar from hundreds of flowers,' what type of word is 'collect'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:1, ex:"'Collect' is a verb — it's the action the workers do. What do the workers do? They collect! Verbs are the engine of every sentence — they tell us what's happening. ✓"},

  // Passage: great-oak
  {id:360, d:2, pid:"great-oak", pt:"The Great Oak",
    st:"word-class", q:"In the sentence 'Its enormous branches stretched across the entire meadow,' what type of word is 'enormous'?",
    opts:["A noun","A verb","An adjective","An adverb","A conjunction"],
    correct:2, ex:"'Enormous' is an adjective — it tells us about the branches (how big? enormous!). Adjectives add detail to nouns, painting a picture in the reader's mind. ✓"},

  // Passage: storm-chasers
  {id:361, d:2, pid:"storm-chasers", pt:"Storm Chasers",
    st:"word-class", q:"In the sentence 'The team drove rapidly towards the approaching storm,' what type of word is 'rapidly'?",
    opts:["A noun","A verb","An adjective","An adverb","A pronoun"],
    correct:3, ex:"'Rapidly' is an adverb — it tells us HOW the team drove. That '-ly' ending is your best friend for spotting adverbs! ✓"},

  // Passage: viking-ship
  {id:362, d:2, pid:"viking-ship", pt:"The Viking Ship",
    st:"word-class", q:"In the sentence 'The warriors sailed across the freezing sea,' what type of word is 'across'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:4, ex:"'Across' is a preposition — it shows the direction of the sailing (across the sea). Prepositions tell us about position and direction. ✓"},

  // Passage: nightingale
  {id:363, d:2, pid:"florence-nightingale", pt:"Florence Nightingale's Lamp",
    st:"word-class", q:"In the sentence 'She tended the wounded soldiers with great care,' what type of word is 'wounded'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:2, ex:"'Wounded' is an adjective here — it describes the soldiers (which soldiers? the wounded ones). Like 'steaming' and 'broken', words ending in '-ed' can work as adjectives when they describe a noun. ✓"},

  // Passage: silk-road
  {id:364, d:2, pid:"silk-road", pt:"The Silk Road",
    st:"word-class", q:"In the sentence 'Merchants traded silk, spices and precious stones,' what type of word is 'traded'?",
    opts:["A noun","A verb","An adjective","An adverb","A conjunction"],
    correct:1, ex:"'Traded' is a verb — it tells us what the merchants DID. It's in the past tense (they traded), which is how we know it's describing an action that already happened. ✓"},

  // Passage: tudor
  {id:365, d:2, pid:"tudor-day", pt:"A Day in Tudor England",
    st:"word-class", q:"In the sentence 'Rich families ate lavishly while poor people often went hungry,' what type of word is 'while'?",
    opts:["A noun","A verb","An adjective","An adverb","A conjunction"],
    correct:4, ex:"'While' is a conjunction — it joins two parts of the sentence together and shows they're happening at the same time. Conjunctions are joining words: and, but, or, because, although, while. ✓"},

  // Passage: midnight-library
  {id:366, d:2, pid:"midnight-library", pt:"The Midnight Library",
    st:"word-class", q:"In the sentence 'She crept silently between the towering shelves,' what type of word is 'silently'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:3, ex:"'Silently' is an adverb — it tells us HOW she crept. Spot the '-ly'! Adverbs usually modify verbs: she crept (how?) silently. ✓"},

  // Passage: attic-map
  {id:367, d:2, pid:"attic-map", pt:"The Map in the Attic",
    st:"word-class", q:"In the sentence 'Mia carefully unfolded the yellowed parchment,' what type of word is 'yellowed'?",
    opts:["A noun","A verb","An adjective","An adverb","A pronoun"],
    correct:2, ex:"'Yellowed' is an adjective — it describes the parchment (what kind? yellowed/old). Past participles like 'yellowed', 'broken', and 'frozen' often work as adjectives. ✓"},

  // Passage: last-dragon
  {id:368, d:2, pid:"last-dragon", pt:"The Last Dragon of Wales",
    st:"word-class", q:"In the sentence 'The creature roared with terrifying power,' what type of word is 'terrifying'?",
    opts:["A noun","A verb","An adjective","An adverb","A conjunction"],
    correct:2, ex:"'Terrifying' is an adjective — it describes the power (what kind of power? terrifying power). Even though it looks like a verb form, here it's describing a noun. ✓"},

  // Passage: shipwrecked
  {id:369, d:1, pid:"shipwrecked", pt:"Shipwrecked!",
    st:"word-class", q:"In the sentence 'The cold waves crashed against the rocks,' what type of word is 'crashed'?",
    opts:["A noun (naming word)","A verb (doing word)","An adjective (describing word)","An adverb (how word)","A preposition (position word)"],
    correct:1, ex:"'Crashed' is a verb — it's what the waves DID. Verbs are action words. What happened? The waves crashed! ✓"},

  // Passage: clockmaker
  {id:370, d:2, pid:"clockmaker-apprentice", pt:"The Clockmaker's Apprentice",
    st:"word-class", q:"In the sentence 'The delicate mechanism ticked softly inside the wooden case,' what type of word is 'softly'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:3, ex:"'Softly' is an adverb — it tells us HOW the mechanism ticked. That '-ly' is your clue! ✓"},

  // More word-class across various passages
  {id:371, d:2, pid:"school-garden", pt:"The School Garden Project",
    st:"word-class", q:"In the sentence 'The children planted seeds in neat rows,' what type of word is 'in'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:4, ex:"'In' is a preposition — it tells us WHERE the seeds were planted (in the rows). Short words like 'in', 'on', 'at', 'by', 'to' are almost always prepositions. ✓"},

  {id:372, d:1, pid:"post-delivery", pt:"How the Post Gets Delivered",
    st:"word-class", q:"In the sentence 'The postman delivers letters every morning,' what type of word is 'delivers'?",
    opts:["A noun (naming word)","A verb (doing word)","An adjective (describing word)","An adverb (how word)","A preposition (position word)"],
    correct:1, ex:"'Delivers' is a verb — it's what the postman DOES. Verbs tell us the action in the sentence. ✓"},

  {id:373, d:2, pid:"new-girl", pt:"The New Girl",
    st:"word-class", q:"In the sentence 'She felt nervous and uncertain about her first day,' what type of word is 'uncertain'?",
    opts:["A noun","A verb","An adjective","An adverb","A conjunction"],
    correct:2, ex:"'Uncertain' is an adjective — it describes how she felt. Adjectives don't just describe things you can see — they also describe feelings and emotions! ✓"},

  {id:374, d:2, pid:"cycling-school", pt:"Cycling to School",
    st:"word-class", q:"In the sentence 'He pedalled steadily up the steep hill,' what type of word is 'steadily'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:3, ex:"'Steadily' is an adverb — it tells us HOW he pedalled. The '-ly' ending is your biggest clue for spotting adverbs! ✓"},

  {id:375, d:2, pid:"bake-off", pt:"The Bake Off",
    st:"word-class", q:"In the sentence 'The delicious aroma drifted through the kitchen,' what type of word is 'through'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:4, ex:"'Through' is a preposition — it shows the direction the aroma moved (through the kitchen). Prepositions tell us about position and movement. ✓"},

  {id:376, d:1, pid:"secret-bees", pt:"The Secret World of Bees",
    st:"word-class", q:"In the sentence 'Bees are incredibly important for our environment,' what type of word is 'important'?",
    opts:["A noun (naming word)","A verb (doing word)","An adjective (describing word)","An adverb (how word)","A preposition (position word)"],
    correct:2, ex:"'Important' is an adjective — it describes the bees (bees are important). Adjectives tell us what something is like. ✓"},

  {id:377, d:2, pid:"ocean-depths", pt:"Into the Ocean Depths",
    st:"word-class", q:"In the sentence 'Strange creatures lurk in the darkness below,' what type of word is 'below'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:3, ex:"'Below' is an adverb here — it tells us WHERE the darkness is. Some words like 'below', 'above', 'outside' can be either adverbs or prepositions depending on how they're used. Here it modifies 'darkness' by telling us its location. ✓"},

  {id:378, d:2, pid:"lightning", pt:"When Lightning Strikes",
    st:"word-class", q:"In the sentence 'Lightning strikes are both dangerous and fascinating,' what type of word is 'and'?",
    opts:["A noun","A verb","An adjective","An adverb","A conjunction"],
    correct:4, ex:"'And' is a conjunction — it joins 'dangerous' and 'fascinating' together. Conjunctions are the glue words of English: and, but, or, so, because, although. ✓"},

  {id:379, d:2, pid:"fire-mountains", pt:"Fire Mountains",
    st:"word-class", q:"In the sentence 'Molten lava flows slowly down the mountainside,' what type of word is 'slowly'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:3, ex:"'Slowly' is an adverb — it tells us HOW the lava flows. Spot the '-ly'! ✓"},

  {id:380, d:3, pid:"ancient-woodlands", pt:"Britain's Ancient Woodlands",
    st:"word-class", q:"In the sentence 'These remarkable forests have survived for thousands of years,' what type of word is 'remarkable'?",
    opts:["A noun","A verb","An adjective","An adverb","A pronoun"],
    correct:2, ex:"'Remarkable' is an adjective — it describes the forests. Adjectives add colour and detail to nouns, helping the reader picture exactly what the writer means. ✓"},

  {id:381, d:3, pid:"night-sky", pt:"A Guide to the Night Sky",
    st:"word-class", q:"In the sentence 'The stars twinkled brightly above the quiet countryside,' what type of word is 'above'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:4, ex:"'Above' is a preposition here — it tells us WHERE the stars twinkled (above the countryside). When 'above' is followed by a noun, it's a preposition showing position. ✓"},

  {id:382, d:2, pid:"hedgehog-highways", pt:"Hedgehog Highways",
    st:"word-class", q:"In the sentence 'Volunteers worked tirelessly to create safe routes,' what type of word is 'tirelessly'?",
    opts:["A noun","A verb","An adjective","An adverb","A conjunction"],
    correct:3, ex:"'Tirelessly' is an adverb — it describes HOW the volunteers worked. That '-ly' ending is your best clue for adverbs! ✓"},

  {id:383, d:1, pid:"raindrop-journey", pt:"The Journey of a Raindrop",
    st:"word-class", q:"In the sentence 'The tiny raindrop fell from the grey cloud,' what type of word is 'fell'?",
    opts:["A noun (naming word)","A verb (doing word)","An adjective (describing word)","An adverb (how word)","A preposition (position word)"],
    correct:1, ex:"'Fell' is a verb — it tells us what the raindrop DID. It's the past tense of 'fall'. ✓"},

  {id:384, d:2, pid:"fastest-animal", pt:"The Fastest Animal on Earth",
    st:"word-class", q:"In the sentence 'The peregrine falcon dives at extraordinary speed,' what type of word is 'extraordinary'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:2, ex:"'Extraordinary' is an adjective — it describes the speed (what kind of speed? extraordinary speed!). Even long, impressive-sounding words can be adjectives! ✓"},

  {id:385, d:2, pid:"pharaohs", pt:"Secrets of the Pharaohs",
    st:"word-class", q:"In the sentence 'Archaeologists discovered the tomb beneath the sand,' what type of word is 'beneath'?",
    opts:["A noun","A verb","An adjective","An adverb","A preposition"],
    correct:4, ex:"'Beneath' is a preposition — it tells us WHERE the tomb was (beneath the sand). 'Beneath', 'under', 'below' are all prepositions that show something is lower than something else. ✓"},

  // ===== INFERENCE (+25) =====
  // D2 questions that require reading between the lines

  {id:386, d:2, pid:"lighthouse-cat", pt:"The Lighthouse Keeper's Cat",
    st:"inference", q:"Why does Tom climb the lighthouse steps 'two at a time'?",
    opts:["He wants to exercise","He is racing against Barnacle","He is in a hurry because he is worried about something","He always climbs stairs quickly","He wants to reach the light before dark"],
    correct:2, ex:"Tom taking the stairs 'two at a time' suggests urgency — he's rushing because something has concerned him. Writers use details like this to show how a character is feeling without telling us directly. ✓"},

  {id:387, d:2, pid:"storm-warning", pt:"Storm Warning",
    st:"inference", q:"What does the description of the sky as 'bruised and heavy' tell the reader?",
    opts:["The sky has been damaged","The weather is about to turn very bad","It is night time","The clouds are purple","Someone has been hurt"],
    correct:1, ex:"'Bruised and heavy' paints a picture of dark, threatening clouds — the writer is hinting that a storm is coming without saying it directly. This is a great example of how authors use description to create atmosphere. ✓"},

  {id:388, d:2, pid:"peculiar-museum", pt:"The Peculiar Museum",
    st:"inference", q:"Why does the author describe the museum as 'peculiar' rather than just 'old' or 'interesting'?",
    opts:["Because it is very large","Because there is something strange and unexpected about it","Because it is in a peculiar location","Because the exhibits are boring","Because it is very expensive"],
    correct:1, ex:"'Peculiar' suggests something odd and slightly mysterious — it makes us curious about what we might find inside. The author chose this word carefully to create a sense of wonder and intrigue from the very start. ✓"},

  {id:389, d:2, pid:"secret-hedgehogs", pt:"The Secret Life of Hedgehogs",
    st:"inference", q:"Why does the author call hedgehogs' lives 'secret'?",
    opts:["Because hedgehogs can talk","Because most people don't know what hedgehogs do at night","Because hedgehogs hide from other animals","Because scientists don't study hedgehogs","Because hedgehogs are invisible"],
    correct:1, ex:"Hedgehogs are nocturnal (active at night), so most people never see what they get up to. The word 'secret' makes us feel like we're about to discover something hidden — it hooks us into wanting to read more! ✓"},

  {id:390, d:2, pid:"great-oak", pt:"The Great Oak",
    st:"inference", q:"What does the phrase 'the oak had witnessed centuries of change' suggest about the tree?",
    opts:["The tree can see","The tree is very old and has been standing through many generations","The tree has been moved many times","The tree was planted recently","The tree is magical"],
    correct:1, ex:"'Witnessed centuries' is personification — giving the tree a human quality (witnessing). It tells us the tree is extremely old and has been there through huge amounts of history. The writer makes the tree sound wise and important. ✓"},

  {id:391, d:2, pid:"rock-pools", pt:"The Rock Pools of Cornwall",
    st:"inference", q:"Why does the author describe the rock pool as 'a miniature world'?",
    opts:["Because it is very small","Because it contains a complete ecosystem with many different creatures, like a tiny version of the ocean","Because children like small things","Because it is shaped like the world","Because it has a map in it"],
    correct:1, ex:"A rock pool is like a tiny ocean in miniature — it has plants, predators, prey, and a whole community of creatures. Calling it 'a miniature world' helps us see it as something amazing and complete, not just a puddle. ✓"},

  {id:392, d:2, pid:"bee-honey", pt:"How Bees Make Honey",
    st:"inference", q:"Why does the author compare a beehive to 'a perfectly organised factory'?",
    opts:["Because bees are machines","Because every bee has a specific job and they work together efficiently","Because beehives are made of metal","Because bees produce pollution","Because factories make honey"],
    correct:1, ex:"The comparison helps us understand that a beehive is incredibly well-organised — every bee has a role (guards, foragers, nursery bees) and they all work together smoothly, just like workers in a factory. ✓"},

  {id:393, d:2, pid:"storm-chasers", pt:"Storm Chasers",
    st:"inference", q:"What do the storm chasers' actions tell us about their character?",
    opts:["They are lazy","They are brave and passionate about understanding weather","They are afraid of storms","They don't enjoy their job","They are lost"],
    correct:1, ex:"People who deliberately drive TOWARDS dangerous storms must be both brave and fascinated by weather. Their actions tell us more about them than any description could — this is 'show, don't tell' in action! ✓"},

  {id:394, d:2, pid:"viking-ship", pt:"The Viking Ship",
    st:"inference", q:"Why might the author have chosen to describe the Vikings' journey from the perspective of someone on the ship?",
    opts:["Because the author was a Viking","To make the reader feel like they are there, experiencing the journey","Because it was easier to write","Because Vikings only told stories on ships","Because the ship is the most important character"],
    correct:1, ex:"Writing from the ship's perspective puts us right in the middle of the action — we can feel the waves, hear the wind, and share the Vikings' excitement and fear. It's much more gripping than just describing events from the outside! ✓"},

  {id:395, d:2, pid:"florence-nightingale", pt:"Florence Nightingale's Lamp",
    st:"inference", q:"What does the detail about Florence carrying a lamp at night suggest about her?",
    opts:["She was afraid of the dark","She was dedicated to her patients and worked even through the night","She collected lamps","The hospital had no electricity","She was looking for something she lost"],
    correct:1, ex:"Carrying a lamp to check on patients at night shows incredible dedication — she didn't stop caring when her shift ended. This small detail tells us so much about her character: she was tireless, compassionate, and put her patients first. ✓"},

  {id:396, d:2, pid:"silk-road", pt:"The Silk Road",
    st:"inference", q:"Why does the author emphasise how long and dangerous the journey along the Silk Road was?",
    opts:["To scare the reader","To make the reader appreciate how valuable the traded goods must have been","To show that people were foolish","To explain why nobody travels any more","To describe the weather"],
    correct:1, ex:"If traders were willing to face months of dangerous travel, the goods they carried must have been incredibly valuable. By emphasising the difficulty, the author helps us understand why silk and spices were considered treasures. ✓"},

  {id:397, d:2, pid:"tudor-day", pt:"A Day in Tudor England",
    st:"inference", q:"What can we infer about life in Tudor times from the contrast between rich and poor families?",
    opts:["Everyone was happy","There was a huge gap between the lives of wealthy and ordinary people","Rich people were always kind","Poor people didn't exist","Everyone ate the same food"],
    correct:1, ex:"The author deliberately shows both sides — lavish feasts for the rich and simple meals for the poor — to highlight the enormous inequality in Tudor society. The contrast makes the gap feel even bigger. ✓"},

  {id:398, d:2, pid:"midnight-library", pt:"The Midnight Library",
    st:"inference", q:"Why does the author set the story in a library at midnight?",
    opts:["Because libraries are boring during the day","To create a mysterious, magical atmosphere where anything could happen","Because the character works night shifts","Because books can only be read at night","Because the library is closed"],
    correct:1, ex:"Midnight suggests mystery, magic, and the unknown. A library is already full of stories and imagination — combine that with midnight and you've got the perfect setting for something extraordinary to happen. Clever authors choose their settings very carefully! ✓"},

  {id:399, d:2, pid:"clockmaker-apprentice", pt:"The Clockmaker's Apprentice",
    st:"inference", q:"What does the apprentice's careful handling of the clockwork suggest about his feelings towards his work?",
    opts:["He is bored","He respects and values the craft, and wants to do his best","He is afraid of the clockmaker","He doesn't understand how clocks work","He wants to break the clock"],
    correct:1, ex:"Careful, gentle handling shows respect and pride in the work. The apprentice isn't just going through the motions — he genuinely cares about getting it right. Actions speak louder than words! ✓"},

  {id:400, d:2, pid:"school-garden", pt:"The School Garden Project",
    st:"inference", q:"Why does the author include the detail that 'even the children who didn't like vegetables were excited'?",
    opts:["To show that the vegetables were different","To show how engaging and fun the project was — it won over even the reluctant ones","To criticise children who don't eat vegetables","To sell vegetables","To show the teacher was strict"],
    correct:1, ex:"This detail shows the project was SO exciting that it changed people's minds. When even the doubters get on board, you know something special is happening. The author includes this to show the power of hands-on learning. ✓"},

  {id:401, d:2, pid:"new-girl", pt:"The New Girl",
    st:"inference", q:"What does Amira noticing 'the sunlight dancing on the harbour' at the end of the passage suggest?",
    opts:["The weather improved","She is finally beginning to feel happy and hopeful in her new home","She is interested in science","She wants to go swimming","She is looking for her old home"],
    correct:1, ex:"At the start, Amira was too anxious to notice anything around her. Now she's seeing beauty in her new surroundings — the 'dancing' sunlight reflects her lighter, more hopeful mood. The author uses the setting to mirror her feelings. ✓"},

  {id:402, d:2, pid:"cycling-school", pt:"Cycling to School",
    st:"inference", q:"Why does the author mention the character's legs 'burning' as he cycles uphill?",
    opts:["His legs are on fire","To show the physical effort and determination required","Because cycling is dangerous","He has a medical condition","To warn children not to cycle"],
    correct:1, ex:"'Burning' legs is a vivid way to describe the pain of hard exercise. The author uses this physical detail to show us how tough the hill is and how determined the character is to keep going. It puts us right in his shoes! ✓"},

  {id:403, d:2, pid:"bake-off", pt:"The Bake Off",
    st:"inference", q:"What does the phrase 'her hands trembled as she piped the icing' tell us about how the character feels?",
    opts:["She is cold","She is nervous and under pressure","She doesn't know how to bake","She is angry","She is tired"],
    correct:1, ex:"Trembling hands are a physical sign of nerves. The author doesn't need to say 'she was nervous' — the trembling shows us. This is a great example of 'show, don't tell' — one of the most important writing techniques. ✓"},

  {id:404, d:2, pid:"secret-bees", pt:"The Secret World of Bees",
    st:"inference", q:"Why does the author use the word 'secret' in the title?",
    opts:["Because bees keep secrets","To make us curious about what bees do that most people don't know about","Because the information is classified","Because bees are invisible","Because the author doesn't want us to read it"],
    correct:1, ex:"'Secret' makes us feel like we're about to discover something hidden and special. It hooks us in — we WANT to know the secret! Clever title choices can make readers desperate to keep reading. ✓"},

  {id:405, d:2, pid:"ocean-depths", pt:"Into the Ocean Depths",
    st:"inference", q:"What effect does the word 'lurk' have when describing deep-sea creatures?",
    opts:["It makes them sound friendly","It makes them sound hidden and slightly threatening","It makes them sound fast","It makes them sound small","It makes them sound colourful"],
    correct:1, ex:"'Lurk' suggests something hiding in the shadows, waiting — it creates a sense of mystery and slight danger. The author could have used 'live' or 'swim' but 'lurk' is much more atmospheric. Word choice makes all the difference! ✓"},

  {id:406, d:2, pid:"lightning", pt:"When Lightning Strikes",
    st:"inference", q:"Why does the author describe lightning as 'a crack of white fire splitting the sky'?",
    opts:["Because the sky actually breaks","To help us see and feel the power and speed of lightning through vivid description","Because lightning is made of fire","To explain the science","Because white is a common colour"],
    correct:1, ex:"This vivid description helps us EXPERIENCE the lightning rather than just reading about it. 'Crack' gives us sound, 'white fire' gives us brightness, and 'splitting the sky' gives us the dramatic scale. Good writers make you feel like you were there! ✓"},

  {id:407, d:2, pid:"fire-mountains", pt:"Fire Mountains",
    st:"inference", q:"Why does the author call volcanoes 'fire mountains' in the title?",
    opts:["Because the mountains are always on fire","To use simple, dramatic language that makes volcanoes sound exciting and powerful","Because that's the scientific name","Because the mountains are red","Because they're in a hot country"],
    correct:1, ex:"'Fire mountains' is much more exciting and vivid than 'volcanoes'. The title creates an image of something dramatic and dangerous — it makes us want to find out more. Authors choose titles that grab attention! ✓"},

  {id:408, d:2, pid:"roman-wall", pt:"The Roman Wall",
    st:"inference", q:"What does the size of Hadrian's Wall tell us about the Romans?",
    opts:["They were very tall","They were incredibly organised, powerful, and determined to defend their territory","They liked building walls","They had nothing else to do","They were afraid of everything"],
    correct:1, ex:"Building a wall across the entire width of Britain required incredible organisation, thousands of workers, and huge resources. The wall itself is evidence of how powerful and determined the Roman Empire was. ✓"},

  {id:409, d:2, pid:"tudor-feast", pt:"A Tudor Feast",
    st:"inference", q:"What can we infer about Tudor society from the description of the feast?",
    opts:["Everyone was vegetarian","Wealth and status were extremely important — food was used to show off power and position","Nobody enjoyed the food","The food was all healthy","Everyone ate the same amount"],
    correct:1, ex:"The lavish descriptions of exotic dishes and elaborate presentations show that Tudor feasts were as much about displaying wealth as they were about eating. Food was a status symbol — the richer you were, the more impressive your table. ✓"},

  {id:410, d:2, pid:"blitz-spirit", pt:"The Blitz Spirit",
    st:"inference", q:"Why does the author include the detail that 'neighbours shared their last tin of biscuits'?",
    opts:["To show that biscuits were popular","To illustrate how people came together and supported each other during the most difficult times","To show food was expensive","To explain rationing rules","To advertise biscuits"],
    correct:1, ex:"Sharing your LAST tin — not just any tin — shows real sacrifice and community spirit. This small detail powerfully illustrates how ordinary people looked after each other when times were toughest. Sometimes the smallest details tell the biggest stories. ✓"},
];

// Read and insert
let content = fs.readFileSync(filePath, 'utf8');
const compStart = content.indexOf("comprehension: {");
const spellingStart = content.indexOf("spelling: {", compStart);
const compSection = content.substring(compStart, spellingStart);
const questionsStart = compSection.indexOf("questions: [");
let depth = 0, arrayEnd = -1;
for (let i = compSection.indexOf("[", questionsStart); i < compSection.length; i++) {
  if (compSection[i] === '[') depth++;
  if (compSection[i] === ']') depth--;
  if (depth === 0) { arrayEnd = i; break; }
}

const insertPoint = compStart + arrayEnd;

const formatted = newQs.map(q => {
  const ex = q.ex.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const opts = q.opts.map(o => '"' + o.replace(/"/g, '\\"') + '"').join(',');
  return `        {
          "id": ${q.id},
          "difficulty": ${q.d},
          "questionType": "passage",
          "questionSubType": "${q.st}",
          "passageId": "${q.pid}",
          "passageTitle": "${q.pt}",
          "question": "${q.q.replace(/"/g, '\\"')}",
          "options": [${opts}],
          "correct": ${q.correct},
          "explanation": "${ex}"
        }`;
}).join(',\n');

const newContent = content.substring(0, insertPoint) + ',\n' + formatted + '\n      ' + content.substring(insertPoint);
fs.writeFileSync(filePath, newContent, 'utf8');

// Verify
delete require.cache[require.resolve('../src/questionData/englishData.js')];
const m2 = require('../src/questionData/englishData.js');
const qs2 = (m2.default || m2).topics.comprehension.questions;
const dd = {1:0, 2:0, 3:0};
const stCounts = {};
for (const q of qs2) {
  dd[q.difficulty]++;
  stCounts[q.questionSubType] = (stCounts[q.questionSubType] || 0) + 1;
}

console.log(`Added ${newQs.length} new questions (Q351-Q410)`);
console.log(`Total: ${qs2.length}`);
console.log(`D1:${dd[1]}(${Math.round(dd[1]/qs2.length*100)}%) D2:${dd[2]}(${Math.round(dd[2]/qs2.length*100)}%) D3:${dd[3]}(${Math.round(dd[3]/qs2.length*100)}%)`);
console.log('Subtypes:', JSON.stringify(stCounts));
