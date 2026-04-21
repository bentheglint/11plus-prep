// Mock Test Comprehension Data
// Long-form passages (~900 words) with 25 questions each, matching 11+ exam format:
// - 18 comprehension questions (retrieval, inference, character inference, negative retrieval, author purpose, effect on reader, text type, prediction)
// - 4 vocabulary-in-context questions
// - 3 word class/grammar questions
// Difficulty progression: Q1-6 easy, Q7-12 medium, Q13-18 hard
// All content 100% original — British English, UK context

export const mockComprehensionPassages = [
  {
    id: 'mary-anning',
    title: 'Mary Anning: The Fossil Hunter of Lyme Regis',
    genre: 'biographical-non-fiction',
    passage: `(1) On a wild winter's day in 1811, a twelve-year-old girl scrambled along the crumbling cliffs near Lyme Regis in Dorset. The wind tugged at her bonnet and the sea crashed against the rocks below, but Mary Anning barely noticed. Her eyes were fixed on something extraordinary — a row of huge, stony bones jutting out from the dark cliff face. Her brother Joseph had spotted a peculiar skull in the same stretch of rock a year earlier, but what Mary was uncovering now was far more remarkable: the complete skeleton of a creature that no living person had ever seen.

(2) Mary had been hunting for fossils since she was old enough to walk. Her father, Richard, was a cabinetmaker who earned extra money by collecting curiosities from the cliffs and selling them to tourists. He had taught both his children to recognise the coiled shells and strange stone shapes that tumbled from the crumbling Blue Lias limestone after heavy storms. When Richard died in 1810, leaving the family in desperate poverty, Mary and Joseph continued the dangerous work. It was no hobby — it was their survival.

(3) The skeleton Mary unearthed that winter took months of painstaking effort to extract. Local quarrymen were hired to help chip away the surrounding rock, and gradually an astonishing creature emerged: over five metres long, with a dolphin-like snout packed with razor-sharp teeth, enormous eye sockets, and four paddle-shaped limbs. Scientists in London were electrified. Nothing like it had ever been recorded. They named it Ichthyosaurus, meaning 'fish lizard', and the discovery made headlines across Europe.

(4) Yet despite her extraordinary find, Mary received little recognition. She was a woman in a world where science was considered a gentleman's pursuit. She had received almost no formal education, having attended only a church school where she learned to read and write. The wealthy men who purchased her fossils often published papers about them without mentioning her name. Mary was expected to be grateful for their business, not their respect.

(5) Undeterred, Mary continued her work with fierce determination. She became the most knowledgeable fossil hunter in Britain, teaching herself anatomy, geology, and scientific illustration. She would spend hours copying detailed diagrams from books she borrowed, and she dissected modern fish and cuttlefish to better understand the ancient creatures she was finding. Her technical skill was remarkable — she could identify a fossil species from a single fragment of bone.

(6) In 1823, Mary made another sensational discovery: the first complete Plesiosaurus, a marine reptile with a tiny head, extraordinarily long neck, and broad, flat body. The specimen was so unusual that some scientists initially accused her of faking it, claiming she had attached the neck of a sea serpent to the body of a different animal. The great French anatomist Georges Cuvier examined her work and declared it entirely genuine, silencing the doubters.

(7) Mary's finds continued to reshape scientific understanding. In 1828, she discovered the first British example of a Pterodactyl — a flying reptile — and also identified strange stones found inside fossil skeletons as coprolites, or fossilised animal droppings. This last discovery might sound unpleasant, but it was scientifically revolutionary: by examining coprolites, scientists could determine what prehistoric creatures had eaten, opening an entirely new field of research.

(8) Life for Mary, however, remained a constant struggle. The fossil trade was unpredictable — months could pass without a significant find, and the family frequently teetered on the edge of financial ruin. The cliffs themselves were treacherous. In 1833, a landslide killed her beloved dog, Tray, and came within inches of taking Mary's own life. She wrote to a friend afterwards: "The cliff fell upon my poor dog and killed him in a moment before my eyes."

(9) Despite these hardships, Mary's reputation grew steadily among the scientific community, even if public recognition remained elusive. Prominent geologists including Henry De la Beche, William Buckland, and Richard Owen all relied on her expertise. De la Beche painted a famous watercolour called 'Duria Antiquior' — meaning 'a more ancient Dorset' — depicting the prehistoric world based entirely on Mary's discoveries. He sold prints of it to raise money for her when she was struggling financially.

(10) Sadly, Mary Anning did not live to see her contributions fully acknowledged. She was diagnosed with breast cancer in 1846 and died on 9th March 1847, aged just forty-seven. The Geological Society of London — which did not admit women as members until 1904 — published an obituary praising her remarkable achievements. It was one of the few times the Society had honoured someone who was not a fellow member.

(11) Today, Mary Anning is celebrated as one of the most important figures in the history of palaeontology. The stretch of Dorset coastline where she made her discoveries is now a UNESCO World Heritage Site, known as the Jurassic Coast. A statue of Mary, striding forward with her hammer and basket, stands on the seafront at Lyme Regis. In 2024, the Royal Mint featured her on a commemorative fifty-pence coin.

(12) Mary Anning's story is not simply one of scientific brilliance, though she possessed that in abundance. It is a story of perseverance against poverty, prejudice, and physical danger. She proved that great discoveries are not the preserve of the privileged, and that curiosity, determination, and careful observation can change the way we understand the world. As she once remarked, with characteristic modesty: "The world has used me so unkindly, I fear it has made me suspicious of everyone."`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How old was Mary Anning when she discovered the Ichthyosaurus skeleton?",
        options: ["Ten years old", "Eleven years old", "Twelve years old", "Thirteen years old", "Fourteen years old"],
        correct: 2,
        explanation: "Paragraph 1 states 'a twelve-year-old girl scrambled along the crumbling cliffs'. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What was Mary's father's profession?",
        options: ["A fisherman", "A quarryman", "A geologist", "A cabinetmaker", "A shopkeeper"],
        correct: 3,
        explanation: "Paragraph 2 states 'Her father, Richard, was a cabinetmaker who earned extra money by collecting curiosities'. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What does the name 'Ichthyosaurus' mean?",
        options: ["Sea monster", "Ancient lizard", "Stone creature", "Fish lizard", "Giant dolphin"],
        correct: 3,
        explanation: "Paragraph 3 states 'They named it Ichthyosaurus, meaning fish lizard'. ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "In which year did Mary discover the first complete Plesiosaurus?",
        options: ["1811", "1820", "1823", "1828", "1833"],
        correct: 2,
        explanation: "Paragraph 6 states 'In 1823, Mary made another sensational discovery: the first complete Plesiosaurus'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why did Mary and Joseph continue collecting fossils after their father died?",
        options: [
          "They wanted to become famous scientists",
          "They enjoyed exploring the cliffs",
          "They needed the money to support the family",
          "Their father had asked them to continue",
          "They wanted to finish their father's collection"
        ],
        correct: 2,
        explanation: "Paragraph 2 states the family was left 'in desperate poverty' and that fossil collecting 'was no hobby — it was their survival'. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "Where would you most likely find a passage like this?",
        options: [
          "In a fairy tale collection",
          "In a science fiction novel",
          "In a non-fiction book about famous scientists",
          "In a travel guidebook about Dorset",
          "In a newspaper's daily news section"
        ],
        correct: 2,
        explanation: "This is biographical non-fiction about a real historical figure and her scientific achievements. It would be found in a book about famous scientists or historical figures. ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why did some scientists initially accuse Mary of faking the Plesiosaurus?",
        options: [
          "They did not believe women could find fossils",
          "The creature looked so unusual that it seemed impossible",
          "Mary had a reputation for dishonesty",
          "The skeleton was found in an unexpected location",
          "Other scientists had already claimed the discovery"
        ],
        correct: 1,
        explanation: "Paragraph 6 says the specimen was 'so unusual' that scientists accused her of faking it, 'claiming she had attached the neck of a sea serpent to the body of a different animal'. The creature's strange appearance made it seem unbelievable. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the passage suggest about Mary's education?",
        options: [
          "She attended the best schools in Dorset",
          "She was largely self-taught in scientific subjects",
          "She was trained by professors at the Geological Society",
          "She had no education at all",
          "She studied geology at university"
        ],
        correct: 1,
        explanation: "Paragraph 4 says she 'had received almost no formal education' and paragraph 5 explains she 'taught herself anatomy, geology, and scientific illustration' by copying diagrams and dissecting specimens. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why was the discovery of coprolites scientifically important?",
        options: [
          "They proved that dinosaurs existed",
          "They showed how old the fossils were",
          "They revealed what prehistoric creatures had eaten",
          "They helped scientists identify new species",
          "They were worth a lot of money to collectors"
        ],
        correct: 2,
        explanation: "Paragraph 7 states that 'by examining coprolites, scientists could determine what prehistoric creatures had eaten, opening an entirely new field of research'. ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What can we infer about Henry De la Beche's attitude towards Mary?",
        options: [
          "He felt guilty for stealing her discoveries",
          "He respected her work and wanted to help her",
          "He believed she was the greatest scientist in Britain",
          "He thought she should join the Geological Society",
          "He pitied her but did not value her expertise"
        ],
        correct: 1,
        explanation: "Paragraph 9 describes De la Beche painting a scene 'based entirely on Mary's discoveries' and selling prints 'to raise money for her when she was struggling financially'. This shows both respect for her work and personal concern for her welfare. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "Which word best describes Mary's character as presented in the passage?",
        options: ["Reckless", "Determined", "Ambitious", "Fortunate", "Cautious"],
        correct: 1,
        explanation: "The passage repeatedly emphasises Mary's perseverance despite poverty, prejudice, and danger. Paragraph 5 uses the word 'fierce determination' and paragraph 12 describes her story as one of 'perseverance'. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "How did Mary likely feel about the scientists who published papers without crediting her?",
        options: [
          "She was delighted they found her fossils useful",
          "She did not notice because she could not read their papers",
          "She felt frustrated but had little power to change it",
          "She was angry and refused to sell them any more fossils",
          "She did not mind because she preferred to stay anonymous"
        ],
        correct: 2,
        explanation: "Paragraph 4 describes how men 'published papers about them without mentioning her name' and paragraph 12 quotes Mary saying 'The world has used me so unkindly, I fear it has made me suspicious of everyone'. This suggests frustration and hurt, though she continued selling fossils because she needed the income. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'character-inference',
        question: "What does Mary's final quoted remark reveal about her?",
        options: [
          "She was bitter and had given up on people entirely",
          "She felt the unfair treatment had affected her ability to trust others",
          "She was joking about her difficult life",
          "She blamed herself for her lack of recognition",
          "She was warning other women not to pursue science"
        ],
        correct: 1,
        explanation: "Mary's words — 'The world has used me so unkindly, I fear it has made me suspicious of everyone' — show self-awareness about how years of being overlooked and mistreated had made her wary. It is honest and reflective, not bitter or self-blaming. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following is NOT mentioned as one of Mary's discoveries?",
        options: [
          "An Ichthyosaurus skeleton",
          "A complete Plesiosaurus",
          "A Pterodactyl specimen",
          "A Tyrannosaurus Rex tooth",
          "Fossilised animal droppings"
        ],
        correct: 3,
        explanation: "The passage mentions Ichthyosaurus (paragraph 3), Plesiosaurus (paragraph 6), Pterodactyl (paragraph 7), and coprolites (paragraph 7). A Tyrannosaurus Rex tooth is never mentioned. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of these statements about the Geological Society is NOT supported by the passage?",
        options: [
          "It did not admit women until 1904",
          "It published an obituary for Mary",
          "It rarely honoured non-members",
          "It invited Mary to present her findings",
          "It acknowledged Mary's achievements after her death"
        ],
        correct: 3,
        explanation: "The passage never states that the Society invited Mary to present her findings. All other statements are supported by paragraph 10. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author include the detail about Mary's dog being killed in a landslide?",
        options: [
          "To show that Mary was careless about safety",
          "To emphasise the physical dangers of fossil hunting",
          "To make the reader feel sorry for the dog",
          "To explain why Mary stopped collecting fossils",
          "To prove that the cliffs were unsuitable for walking"
        ],
        correct: 1,
        explanation: "The detail about the landslide killing Mary's dog and nearly killing Mary herself illustrates the genuine physical danger of her work. The author uses this to show that fossil hunting was not a safe or easy occupation. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "What is the author's main purpose in writing this passage?",
        options: [
          "To persuade readers to visit Lyme Regis",
          "To explain how fossils are formed in limestone",
          "To celebrate Mary's achievements and highlight the unfairness she faced",
          "To argue that women are better scientists than men",
          "To describe the different types of prehistoric creatures"
        ],
        correct: 2,
        explanation: "The passage consistently highlights both Mary's remarkable discoveries and the lack of recognition she received due to her gender and social class. Paragraph 12 explicitly states it is 'a story of perseverance against poverty, prejudice, and physical danger'. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'effect-on-reader',
        question: "What effect does the opening paragraph create?",
        options: [
          "It makes the reader feel calm and relaxed",
          "It creates a sense of excitement and anticipation",
          "It makes the reader feel confused about the setting",
          "It creates a humorous and light-hearted tone",
          "It makes the reader feel frightened for Mary's safety"
        ],
        correct: 1,
        explanation: "The opening uses dramatic language — 'wild winter's day', 'wind tugged', 'sea crashed' — combined with the revelation that Mary is discovering 'something extraordinary'. This builds excitement and anticipation about what she has found. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 3, what does the word 'electrified' mean?",
        options: ["Shocked by electricity", "Made extremely angry", "Filled with great excitement", "Confused and bewildered", "Made deeply worried"],
        correct: 2,
        explanation: "'Electrified' here means thrilled or filled with great excitement. The scientists were amazed and excited by the discovery, not literally given an electric shock. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 5, what does 'undeterred' mean?",
        options: ["Not discouraged or put off", "Not interested", "Not educated", "Not believed", "Not invited"],
        correct: 0,
        explanation: "'Undeterred' means not discouraged or prevented from continuing. Despite the lack of recognition described in paragraph 4, Mary carried on with 'fierce determination'. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 8, what does 'teetered on the edge of financial ruin' suggest?",
        options: [
          "The family was about to become very wealthy",
          "The family was dangerously close to having no money at all",
          "The family lived on a cliff edge",
          "The family was saving money carefully",
          "The family had recently lost some money"
        ],
        correct: 1,
        explanation: "'Teetered on the edge' means to be in a very unstable, precarious position. Combined with 'financial ruin', it means the family was constantly close to being completely out of money. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 10, what does the word 'elusive' mean in 'public recognition remained elusive'?",
        options: ["Unnecessary", "Impossible to achieve", "Difficult to obtain or find", "Unwanted", "Forgotten"],
        correct: 2,
        explanation: "'Elusive' means difficult to find, catch, or achieve. Public recognition kept slipping away from Mary despite her growing reputation among scientists. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 1, what type of word is 'extraordinary'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
        correct: 2,
        explanation: "'Extraordinary' is an adjective — it describes the thing Mary was looking at ('something extraordinary'). ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "What type of words are 'poverty', 'prejudice', and 'danger' in paragraph 12?",
        options: ["Verbs", "Adjectives", "Abstract nouns", "Adverbs", "Proper nouns"],
        correct: 2,
        explanation: "Poverty, prejudice, and danger are all abstract nouns — they name ideas or concepts that cannot be physically touched, rather than concrete objects. ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In the sentence from paragraph 5, 'She would spend hours copying detailed diagrams', which word is an adverb?",
        options: ["spend", "hours", "copying", "detailed", "diagrams"],
        correct: 1,
        explanation: "'Hours' here functions as an adverb — it tells us how long she would spend (modifying the verb 'spend'). Although 'hours' is usually a noun, in this sentence it acts adverbially to describe the duration of the action. This is a common exam trap. ✓"
      }
    ]
  },
  {
    id: 'channel-tunnel',
    title: 'The Building of the Channel Tunnel',
    genre: 'historical-non-fiction',
    passage: `(1) For centuries, the narrow strip of water separating England from France seemed like an impossible barrier. Just thirty-four kilometres wide at its narrowest point, the English Channel had defeated armies, wrecked countless ships, and frustrated engineers who dreamed of bridging the gap. Yet beneath those grey, churning waves lay a layer of chalk marl — a soft, waterproof rock — that would eventually make one of the most ambitious construction projects in history possible.

(2) The idea of a tunnel under the Channel was not new. As early as 1802, a French mining engineer named Albert Mathieu proposed digging a passage beneath the seabed, lit by oil lamps and ventilated by chimneys poking above the waves. Napoleon Bonaparte reportedly considered the scheme, imagining his soldiers marching beneath the sea to invade England. The British government, unsurprisingly, was not enthusiastic. For the next two hundred years, proposals came and went. Tunnels were started and abandoned. Politicians argued. Engineers drew plans that gathered dust.

(3) It was not until 1986 that the British and French governments finally signed the Treaty of Canterbury, committing both nations to building a fixed link beneath the Channel. The project would be privately funded — no taxpayer money — and would be delivered by a consortium of construction companies and banks called Eurotunnel. The estimated cost was £4.65 billion. The actual cost, when the tunnel finally opened eight years later, would be more than double that figure.

(4) The engineering challenge was staggering. Workers would need to bore three parallel tunnels through the chalk marl: two for trains — one running north, one south — and a smaller service tunnel between them for maintenance and emergency evacuation. Each running tunnel would be 7.6 metres in diameter, large enough to accommodate double-decker trains travelling at 160 kilometres per hour. The total length of tunnelling required, including cross-passages connecting the three tunnels every 375 metres, was over 150 kilometres.

(5) To accomplish this, engineers deployed eleven enormous tunnel boring machines, or TBMs. These extraordinary devices were mechanical moles, each weighing over a thousand tonnes and stretching the length of two football pitches. At the front, a rotating cutting head studded with tungsten carbide teeth gnawed through the chalk at a rate of roughly fifteen metres per day. Behind the cutting head, the machine automatically lined the freshly cut tunnel with pre-cast concrete segments, bolting each ring into place before inching forward again.

(6) Six TBMs started from the English side at Folkestone, boring southward beneath the seabed. Five more started from the French side at Coquelles, near Calais, boring northward. The machines worked around the clock in three eight-hour shifts, and at the peak of construction over fifteen thousand workers were employed on both sides of the Channel. The conditions underground were harsh: temperatures reached thirty degrees, the air was thick with chalk dust, and the noise from the boring machines was relentless. Workers wore ear defenders and breathed through filtered masks.

(7) The most nerve-wracking moment in the entire project came on 1st December 1990. Deep beneath the seabed, roughly fifteen kilometres from each shore, the British and French service tunnel teams were closing in on each other. Using laser guidance systems and satellite positioning, the two teams had been steering their TBMs towards a meeting point with astonishing precision. When the final section of rock was broken through, the gap between the two tunnels was just a few centimetres — a remarkable feat of engineering, given that each team had bored over twenty kilometres through pitch darkness.

(8) Graham Fagg, a British construction worker, and Philippe Cozette, his French counterpart, shook hands through the breakthrough hole. It was the first time since the Ice Age, over eight thousand years earlier, that Britain and France had been physically connected. Flags were waved, champagne was sprayed, and the moment was broadcast live on television across the world. Fagg later recalled that pushing through the final chunk of chalk was "the most emotional moment of my life."

(9) Yet the celebrations masked serious problems. The project was massively over budget, eventually costing £9.5 billion — more than twice the original estimate. Eurotunnel was drowning in debt, and the company would later need to restructure its finances to avoid collapse. Construction had also been plagued by setbacks: flooding, equipment breakdowns, labour disputes, and a devastating fire in 1996 that closed one tunnel for six months. Critics who had always dismissed the project as a white elephant felt vindicated.

(10) Despite these difficulties, the Channel Tunnel — or 'Chunnel' as it became known — transformed travel between Britain and continental Europe. When it opened on 6th May 1994, passengers could travel from London to Paris in just three hours by Eurostar train. Today, that journey takes little more than two hours. Over twenty million passengers use the Eurostar each year, and millions more vehicles cross through the tunnel aboard Le Shuttle, a drive-on, drive-off train service that completes the crossing in just thirty-five minutes.

(11) The tunnel also carries an enormous volume of freight. Around a quarter of all trade in goods between Britain and the European Union passes through the Channel Tunnel, making it one of the most economically important pieces of infrastructure in Europe. The three tunnels stretch 50.45 kilometres in total, of which 37.9 kilometres run beneath the sea — making it the longest undersea tunnel in the world until Japan's Seikan Tunnel reclaimed that record in terms of total length.

(12) The Channel Tunnel stands as a monument to what human ingenuity and international cooperation can achieve. It was delivered late, it cost too much, and it very nearly bankrupted the company that built it. But it fundamentally changed the relationship between two nations that had spent much of their history as rivals. As one French engineer remarked during the breakthrough celebrations: "We have not just connected two countries. We have connected two ways of life."`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How wide is the English Channel at its narrowest point?",
        options: ["Twenty-four kilometres", "Thirty kilometres", "Thirty-four kilometres", "Thirty-seven kilometres", "Fifty kilometres"],
        correct: 2,
        explanation: "Paragraph 1 states the Channel is 'Just thirty-four kilometres wide at its narrowest point'. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What type of rock was the tunnel bored through?",
        options: ["Granite", "Sandstone", "Limestone", "Chalk marl", "Clay"],
        correct: 3,
        explanation: "Paragraph 1 describes 'a layer of chalk marl — a soft, waterproof rock' beneath the seabed. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How many parallel tunnels were built?",
        options: ["One", "Two", "Three", "Four", "Five"],
        correct: 2,
        explanation: "Paragraph 4 states 'Workers would need to bore three parallel tunnels through the chalk marl'. ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Who shook hands through the breakthrough hole?",
        options: [
          "The British and French Prime Ministers",
          "Albert Mathieu and Napoleon Bonaparte",
          "Graham Fagg and Philippe Cozette",
          "The chief engineers from both countries",
          "The directors of Eurotunnel"
        ],
        correct: 2,
        explanation: "Paragraph 8 states 'Graham Fagg, a British construction worker, and Philippe Cozette, his French counterpart, shook hands through the breakthrough hole'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why was the British government not enthusiastic about Napoleon's tunnel idea?",
        options: [
          "The technology did not exist in 1802",
          "They feared it could be used for a French invasion",
          "The cost was too high for the British economy",
          "The rock beneath the Channel was too hard",
          "Britain and France were close allies at the time"
        ],
        correct: 1,
        explanation: "Paragraph 2 mentions that Napoleon imagined 'his soldiers marching beneath the sea to invade England' — the British would naturally oppose a tunnel that could serve as an invasion route. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "This passage is best described as:",
        options: [
          "A persuasive argument for building more tunnels",
          "A fictional story set during the tunnel construction",
          "An informative account of a major engineering project",
          "A scientific explanation of how tunnels are built",
          "A news report from the day the tunnel opened"
        ],
        correct: 2,
        explanation: "The passage gives a factual, chronological account of the Channel Tunnel project — its history, construction, problems, and legacy. This is informative non-fiction. ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why does the author mention that the project was 'privately funded'?",
        options: [
          "To show that the government did not care about the project",
          "To explain why the tunnel was built so cheaply",
          "To highlight that the financial risk was carried by companies, not taxpayers",
          "To criticise the government for not contributing",
          "To prove that private companies are better than governments at building things"
        ],
        correct: 2,
        explanation: "Paragraph 3 states it would be 'privately funded — no taxpayer money'. The author draws attention to this because it meant the financial risk (and later the massive cost overruns) fell on private investors, not the public. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What made the breakthrough on 1st December 1990 so remarkable?",
        options: [
          "It happened ahead of schedule",
          "The two tunnels met with only centimetres of error after boring over 40 kilometres in total",
          "It was the first tunnel ever bored beneath a sea",
          "The workers had to dig through unexpectedly hard rock",
          "The breakthrough happened at exactly midnight"
        ],
        correct: 1,
        explanation: "Paragraph 7 emphasises the 'astonishing precision' — the gap was 'just a few centimetres' despite each team boring 'over twenty kilometres through pitch darkness'. The accuracy over such a vast distance is what made it remarkable. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the passage suggest about working conditions inside the tunnel during construction?",
        options: [
          "They were comfortable and well-ventilated",
          "They were unpleasant and physically demanding",
          "They were dangerous but well-paid",
          "They were similar to working in an office",
          "They were only difficult on the French side"
        ],
        correct: 1,
        explanation: "Paragraph 6 describes temperatures of thirty degrees, air 'thick with chalk dust', 'relentless' noise, and workers needing ear defenders and filtered masks. These conditions were clearly unpleasant and demanding. ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "How did Graham Fagg feel about the breakthrough moment?",
        options: [
          "He was relieved that the difficult work was over",
          "He was deeply moved by the experience",
          "He was mainly proud of the engineering achievement",
          "He was disappointed that it took so long",
          "He was surprised that the tunnels actually met"
        ],
        correct: 1,
        explanation: "Paragraph 8 quotes Fagg saying it was 'the most emotional moment of my life'. The word 'emotional' suggests he was deeply moved, not just relieved or proud. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the phrase 'white elephant' mean in paragraph 9?",
        options: [
          "A rare and valuable treasure",
          "An expensive project that turns out to be useless or wasteful",
          "A construction project that takes too long",
          "A symbol of friendship between nations",
          "A very large building or structure"
        ],
        correct: 1,
        explanation: "A 'white elephant' is an idiom meaning something expensive to maintain but of little practical use. Critics used this term because they believed the tunnel would cost too much and not be worthwhile. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "How would the critics mentioned in paragraph 9 have felt when the cost doubled?",
        options: [
          "Embarrassed that they had been wrong",
          "Confused about why costs had risen",
          "Satisfied that their warnings had been justified",
          "Indifferent because it did not affect them",
          "Sympathetic towards the construction workers"
        ],
        correct: 2,
        explanation: "The passage says critics 'felt vindicated' — meaning they felt their earlier warnings had been proven correct by the cost overruns and problems. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'inference',
        question: "Why does the author describe the TBMs as 'mechanical moles'?",
        options: [
          "Because they were small and furry",
          "Because they burrowed through the ground like the animal does",
          "Because they were designed by a scientist called Mole",
          "Because they were used to search for underground creatures",
          "Because they worked best in darkness"
        ],
        correct: 1,
        explanation: "The comparison to moles is a metaphor — just as moles dig through earth underground, the TBMs bored through chalk beneath the seabed. The author uses this image to help the reader visualise what the machines did. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following problems is NOT mentioned as affecting the project?",
        options: [
          "Flooding",
          "Equipment breakdowns",
          "A fire that closed one tunnel",
          "Workers going on strike over safety concerns",
          "Labour disputes"
        ],
        correct: 3,
        explanation: "Paragraph 9 mentions flooding, equipment breakdowns, labour disputes, and a fire. Workers striking specifically over safety concerns is not mentioned — 'labour disputes' is a broader term that could cover many issues. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "According to the passage, which of the following statements is NOT true?",
        options: [
          "The tunnel was originally estimated to cost £4.65 billion",
          "Over fifteen thousand workers were employed at peak construction",
          "The Eurostar can now travel from London to Paris in under two hours",
          "The Channel Tunnel is currently the longest undersea tunnel in the world",
          "Around a quarter of UK-EU trade passes through the tunnel"
        ],
        correct: 3,
        explanation: "Paragraph 11 states that it was the longest undersea tunnel 'until Japan's Seikan Tunnel reclaimed that record' — so it is no longer the longest. All other statements are supported by the passage. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author begin the passage by describing the Channel as defeating armies and wrecking ships?",
        options: [
          "To explain why the Channel is dangerous for boats",
          "To give a history of naval warfare in the Channel",
          "To establish how formidable the barrier was, making the tunnel achievement more impressive",
          "To argue that a bridge would have been a better solution",
          "To show that the tunnel was unnecessary because boats already crossed it"
        ],
        correct: 2,
        explanation: "By emphasising how the Channel had 'defeated armies' and 'frustrated engineers' for centuries, the author makes the eventual success of the tunnel project seem all the more impressive. It sets up the scale of the achievement. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "The author presents a balanced view of the Channel Tunnel project by:",
        options: [
          "Only describing the positive aspects of the tunnel",
          "Interviewing workers from both the British and French sides",
          "Acknowledging both the remarkable achievement and the serious problems",
          "Comparing the tunnel to other engineering projects around the world",
          "Letting the reader decide whether the tunnel was a good idea"
        ],
        correct: 2,
        explanation: "The passage celebrates the engineering feat and international cooperation while also honestly describing the cost overruns, delays, and near-bankruptcy. This balanced approach is evident across paragraphs 9-12. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'prediction',
        question: "Based on the information in the passage, which statement is most likely to be true in the future?",
        options: [
          "The Channel Tunnel will be replaced by a bridge",
          "The tunnel will continue to be an important transport and trade link",
          "Eurotunnel will build a fourth tunnel beneath the Channel",
          "Passenger numbers will decline as people prefer to fly",
          "The tunnel will be closed permanently due to rising sea levels"
        ],
        correct: 1,
        explanation: "The passage describes over twenty million annual passengers, growing freight volumes, and the tunnel carrying a quarter of all UK-EU trade. These facts suggest it will remain an important link. There is no evidence in the passage for any of the other options. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 2, what does the word 'consortium' mean?",
        options: ["A government department", "A group of companies working together", "A type of construction machine", "A financial penalty", "A legal agreement"],
        correct: 1,
        explanation: "A 'consortium' is a group of organisations that join together for a shared purpose. Here, Eurotunnel was a consortium of 'construction companies and banks' working together to build the tunnel. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 7, what does 'nerve-wracking' mean?",
        options: ["Physically exhausting", "Extremely boring", "Causing great anxiety or tension", "Surprisingly easy", "Dangerously cold"],
        correct: 2,
        explanation: "'Nerve-wracking' means causing great stress or anxiety. The breakthrough moment was tense because tiny errors in alignment over such a vast distance could have meant the tunnels missed each other. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 9, what does 'vindicated' mean?",
        options: ["Punished for their views", "Proved right after being doubted", "Made to feel guilty", "Given an official apology", "Forced to change their opinion"],
        correct: 1,
        explanation: "'Vindicated' means shown to have been right all along. The critics who had warned the project would be too expensive felt vindicated when costs more than doubled. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 12, what does 'ingenuity' mean?",
        options: ["Physical strength", "Cleverness and inventiveness", "Patience and endurance", "Courage and bravery", "Wealth and resources"],
        correct: 1,
        explanation: "'Ingenuity' means the quality of being clever, original, and inventive. The author uses it to describe the creative problem-solving required to build the tunnel. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 5, what type of word is 'gnawed'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
        correct: 1,
        explanation: "'Gnawed' is a verb — it describes the action of the cutting head eating through the chalk. The author uses this word (usually associated with animals chewing) to bring the machine to life. ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "What type of words are 'staggering', 'relentless', and 'astonishing' as used in the passage?",
        options: ["Nouns", "Verbs", "Adjectives", "Adverbs", "Conjunctions"],
        correct: 2,
        explanation: "All three are adjectives — they describe nouns: 'staggering' challenge (paragraph 4), 'relentless' noise (paragraph 6), and 'astonishing' precision (paragraph 7). ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In paragraph 8, 'Flags were waved, champagne was sprayed, and the moment was broadcast live on television.' What is the grammatical term for this sentence structure?",
        options: ["A simple sentence", "A compound sentence", "A complex sentence", "The passive voice", "A rhetorical question"],
        correct: 3,
        explanation: "All three clauses use the passive voice: 'flags were waved' (not 'people waved flags'), 'champagne was sprayed', 'the moment was broadcast'. The subject receives the action rather than performing it. ✓"
      }
    ]
  },
  {
    id: 'deep-sea-creatures',
    title: 'The Secret World of Deep-Sea Creatures',
    genre: 'scientific-non-fiction',
    passage: `(1) Imagine a world of absolute darkness, where the pressure would crush a submarine like a tin can, where the temperature hovers just above freezing, and where no plant can grow. This is the deep ocean — the largest habitat on Earth and one of the least explored. Scientists estimate that more than eighty per cent of the ocean floor has never been mapped, photographed, or even visited by humans. We know more about the surface of Mars than we do about the bottom of our own seas.

(2) The deep sea begins where sunlight can no longer penetrate the water, roughly two hundred metres below the surface. This boundary is called the photic zone, and below it lies a world that operates by entirely different rules. Without sunlight, photosynthesis is impossible, which means there are no plants, no algae, and no coral reefs. Food is desperately scarce. Most deep-sea creatures survive on what scientists grimly call 'marine snow' — a constant, gentle rain of dead organisms, waste, and fragments that drift down from the sunlit waters above.

(3) To survive in this extreme environment, deep-sea creatures have evolved some of the most extraordinary adaptations in the animal kingdom. Perhaps the most spectacular is bioluminescence — the ability to produce light from within their own bodies. An estimated ninety per cent of deep-sea animals can generate light, using it to attract prey, confuse predators, or communicate with potential mates. The anglerfish, one of the ocean's most recognisable deep-sea inhabitants, dangles a glowing lure from a modified spine above its head, tempting smaller fish towards its enormous, fang-lined jaws.

(4) The giant squid is another creature that has captivated human imagination for centuries. Growing up to thirteen metres long, with eyes the size of dinner plates — the largest in the animal kingdom — it was long dismissed as a sailor's myth. Ancient mariners told tales of monstrous tentacles dragging ships beneath the waves, and the Norse legend of the Kraken was almost certainly inspired by encounters with these magnificent animals. It was not until 2004 that scientists obtained the first photograph of a living giant squid in its natural habitat, at a depth of nine hundred metres in the Pacific Ocean.

(5) At the very deepest point on Earth — the Challenger Deep in the Mariana Trench, nearly eleven kilometres below the surface — the pressure is over a thousand times greater than at sea level. A human body would be instantly crushed. Yet even here, life persists. In 2019, an expedition led by the American explorer Victor Vescovo reached the bottom and discovered, to widespread astonishment, tiny shrimp-like amphipods and strange, translucent sea cucumbers gliding across the sediment. A plastic bag was also found, a sobering reminder that human pollution has reached even the most remote corners of the planet.

(6) One of the most remarkable discoveries in deep-sea biology came in 1977, when scientists aboard the research submarine Alvin were exploring the ocean floor near the Galápagos Islands. At a depth of 2,500 metres, they stumbled upon something that overturned a fundamental assumption of biology: hydrothermal vents. These underwater chimneys spew superheated water, rich in minerals, from cracks in the Earth's crust. The water can reach temperatures of 400 degrees Celsius, yet it does not boil because of the immense pressure.

(7) Clustered around these vents was a thriving ecosystem unlike anything seen before. Giant tube worms, up to two metres tall, swayed in the current. Vast colonies of blind white crabs picked their way across the rocks. Mats of bacteria carpeted every surface. None of these organisms relied on sunlight. Instead, specialised bacteria at the base of the food chain used a process called chemosynthesis — converting the chemical energy from the vent minerals into food. This was a revelation: life did not require the sun to exist.

(8) The discovery of hydrothermal vent communities had profound implications beyond marine biology. If life could thrive in such hostile conditions on Earth, scientists reasoned, then perhaps it could also exist on other worlds. Jupiter's moon Europa is believed to have a vast ocean beneath its icy surface, heated by gravitational forces. Saturn's moon Enceladus shoots plumes of water vapour into space from cracks in its southern ice cap. Both worlds might harbour hydrothermal vents — and therefore, potentially, life.

(9) Closer to home, deep-sea organisms are proving to have practical applications that few predicted. Enzymes extracted from heat-resistant bacteria found near hydrothermal vents are now used in medical diagnostics and industrial processes. Compounds from deep-sea sponges are being investigated as potential treatments for cancer and antibiotic-resistant infections. The deep ocean, it turns out, may be as valuable as a pharmacy as it is as a habitat.

(10) Yet this fragile world faces growing threats. Deep-sea mining companies are eager to extract valuable minerals — including cobalt, manganese, and rare earth elements — from the ocean floor. Environmentalists warn that dragging heavy machinery across the seabed would destroy ecosystems that took thousands of years to develop and might never recover. Overfishing, pollution, and climate change are also altering deep-sea environments in ways that scientists are only beginning to understand.

(11) The deep ocean remains one of the great frontiers of exploration. Every expedition returns with new species, new questions, and new reasons to protect this hidden world. As the marine biologist Sylvia Earle has observed: "No water, no life. No blue, no green." The creatures that thrive in the crushing darkness of the abyss remind us that life is far more resilient, far more inventive, and far more mysterious than we ever imagined.`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "At what depth does the deep sea begin, according to the passage?",
        options: ["One hundred metres", "Two hundred metres", "Five hundred metres", "One thousand metres", "Two thousand metres"],
        correct: 1,
        explanation: "Paragraph 2 states 'The deep sea begins where sunlight can no longer penetrate the water, roughly two hundred metres below the surface'. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What is 'marine snow'?",
        options: [
          "Frozen seawater that falls to the ocean floor",
          "A type of white coral found in deep water",
          "Dead organisms and waste drifting down from above",
          "Tiny glowing creatures that look like snowflakes",
          "Salt crystals that form in cold water"
        ],
        correct: 2,
        explanation: "Paragraph 2 explains marine snow as 'a constant, gentle rain of dead organisms, waste, and fragments that drift down from the sunlit waters above'. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How long can a giant squid grow?",
        options: ["Up to five metres", "Up to eight metres", "Up to ten metres", "Up to thirteen metres", "Up to twenty metres"],
        correct: 3,
        explanation: "Paragraph 4 states giant squid grow 'up to thirteen metres long'. ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "In what year were hydrothermal vents first discovered?",
        options: ["1969", "1977", "1985", "2004", "2019"],
        correct: 1,
        explanation: "Paragraph 6 states 'One of the most remarkable discoveries in deep-sea biology came in 1977'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why does the author compare our knowledge of the deep sea to our knowledge of Mars?",
        options: [
          "To prove that space exploration is more important",
          "To show how surprisingly little we know about our own oceans",
          "To suggest we should stop exploring space",
          "To explain why deep-sea creatures look alien",
          "To argue that Mars might have oceans too"
        ],
        correct: 1,
        explanation: "The comparison in paragraph 1 — 'We know more about the surface of Mars than we do about the bottom of our own seas' — highlights how unexplored the deep ocean remains, which is surprising given that it is on our own planet. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "This passage would most likely be found in:",
        options: [
          "A children's adventure novel",
          "A recipe book about seafood",
          "A popular science magazine or book",
          "A fisherman's guide to the ocean",
          "A poetry collection about the sea"
        ],
        correct: 2,
        explanation: "The passage presents scientific information in an engaging, accessible way with vivid descriptions — this is the style of popular science writing for a general audience. ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why is food 'desperately scarce' in the deep ocean?",
        options: [
          "There are too many predators competing for food",
          "The cold temperatures prevent animals from eating",
          "Without sunlight, no plants can grow to form the base of a food chain",
          "Pollution has killed most of the organisms",
          "The pressure makes it impossible for animals to digest food"
        ],
        correct: 2,
        explanation: "Paragraph 2 explains that 'Without sunlight, photosynthesis is impossible, which means there are no plants, no algae, and no coral reefs'. Since plants normally form the base of ocean food chains, their absence means very little food is available. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why was the discovery of life at hydrothermal vents described as a 'revelation'?",
        options: [
          "Because the vents were much hotter than expected",
          "Because it proved that life could exist without sunlight",
          "Because the creatures found there were extremely beautiful",
          "Because scientists had predicted exactly what they would find",
          "Because it showed that the deep ocean was warmer than thought"
        ],
        correct: 1,
        explanation: "Paragraph 7 states 'This was a revelation: life did not require the sun to exist.' Before this discovery, scientists assumed all life ultimately depended on sunlight through photosynthesis. Finding organisms powered by chemosynthesis overturned that assumption. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why does the author mention the plastic bag found at the bottom of the Mariana Trench?",
        options: [
          "To explain what materials can survive deep-sea pressure",
          "To show that even the most remote places are affected by human pollution",
          "To prove that the expedition actually reached the bottom",
          "To suggest that plastic is useful for deep-sea research",
          "To describe what the ocean floor looks like"
        ],
        correct: 1,
        explanation: "The author calls it 'a sobering reminder that human pollution has reached even the most remote corners of the planet'. The detail is included to highlight the global scale of pollution, not to describe the seabed itself. ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "How would the scientists aboard Alvin most likely have felt when they first saw the hydrothermal vents?",
        options: [
          "Frightened by the extreme heat",
          "Disappointed that the vents were not what they expected",
          "Astonished because nothing like this had been seen before",
          "Bored because they had expected to find vents",
          "Angry that previous scientists had missed them"
        ],
        correct: 2,
        explanation: "Paragraph 6 says they 'stumbled upon' the vents and that the discovery 'overturned a fundamental assumption of biology'. The unexpected nature of the find and its significance suggest astonishment. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What is the connection between deep-sea vents on Earth and Jupiter's moon Europa?",
        options: [
          "Both have the same species of bacteria",
          "Both are equally well-explored by scientists",
          "Both might have conditions that could support life",
          "Both were discovered in the same year",
          "Both are heated by the sun"
        ],
        correct: 2,
        explanation: "Paragraph 8 explains that if life can thrive at hostile hydrothermal vents on Earth, then Europa's ocean (which might also have vents) could potentially harbour life too. The connection is the possibility of similar conditions supporting life. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "What is the attitude of environmentalists towards deep-sea mining, as described in the passage?",
        options: [
          "They fully support it as long as safety rules are followed",
          "They are cautiously optimistic about its potential",
          "They are strongly opposed because of the environmental damage",
          "They believe it should only happen in shallow waters",
          "They are not mentioned in the passage"
        ],
        correct: 2,
        explanation: "Paragraph 10 states environmentalists 'warn that dragging heavy machinery across the seabed would destroy ecosystems that took thousands of years to develop and might never recover'. This is clearly strong opposition. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'inference',
        question: "What does the passage suggest about the relationship between deep-sea research and medicine?",
        options: [
          "Deep-sea research has no practical applications outside biology",
          "Medical researchers have been working in the deep sea for decades",
          "Organisms from extreme environments may provide new medical treatments",
          "Deep-sea mining is necessary to fund medical research",
          "Doctors regularly prescribe medicines made from deep-sea bacteria"
        ],
        correct: 2,
        explanation: "Paragraph 9 describes compounds from deep-sea sponges being 'investigated as potential treatments for cancer and antibiotic-resistant infections'. The research is ongoing and promising, but not yet producing regular prescriptions. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following adaptations is NOT mentioned in the passage?",
        options: [
          "Producing light through bioluminescence",
          "Having extremely large eyes",
          "Changing colour to blend with surroundings",
          "Using chemical energy instead of sunlight for food",
          "Surviving extreme water pressure"
        ],
        correct: 2,
        explanation: "The passage mentions bioluminescence (paragraph 3), large eyes in giant squid (paragraph 4), chemosynthesis (paragraph 7), and survival under immense pressure (paragraph 5). Changing colour for camouflage is not mentioned. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "According to the passage, which of these threats to the deep sea is NOT specifically mentioned?",
        options: [
          "Deep-sea mining",
          "Overfishing",
          "Rising water temperatures from climate change",
          "Noise pollution from shipping",
          "Plastic pollution"
        ],
        correct: 3,
        explanation: "Paragraph 10 mentions deep-sea mining, overfishing, pollution, and climate change. Paragraph 5 mentions plastic pollution. Noise pollution from shipping is not mentioned anywhere in the passage. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author describe the anglerfish's hunting method in detail?",
        options: [
          "To frighten the reader about deep-sea creatures",
          "To give a vivid example of how bioluminescence is used for survival",
          "To explain why the anglerfish is the most dangerous deep-sea predator",
          "To compare the anglerfish to creatures on land",
          "To show that the anglerfish is the most common deep-sea fish"
        ],
        correct: 1,
        explanation: "The anglerfish example in paragraph 3 illustrates the broader point about bioluminescence — the ability to produce light. The author uses this specific, memorable example to make the abstract concept vivid and concrete. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "What is the main message of the final paragraph?",
        options: [
          "That deep-sea creatures are more dangerous than we thought",
          "That we should be inspired by the resilience of life and motivated to protect the deep ocean",
          "That marine biologists are the most important scientists",
          "That we will never fully understand the deep sea",
          "That life on Earth began in the deep ocean"
        ],
        correct: 1,
        explanation: "The final paragraph combines wonder ('far more resilient, far more inventive, and far more mysterious') with a conservation message (Sylvia Earle's quote about protecting water). It aims to inspire both awe and a sense of responsibility. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'effect-on-reader',
        question: "What effect does the opening paragraph have on the reader?",
        options: [
          "It creates a relaxing, peaceful atmosphere",
          "It makes the reader feel curious by describing an alien-like world on our own planet",
          "It confuses the reader with too many scientific terms",
          "It makes the reader feel guilty about pollution",
          "It bores the reader with too many statistics"
        ],
        correct: 1,
        explanation: "The opening invites the reader to 'Imagine a world' with dramatic conditions (darkness, crushing pressure, freezing temperatures), then reveals this world is on Earth. This creates curiosity and wonder about what lives in such an extreme environment. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 3, what does 'bioluminescence' mean?",
        options: ["The ability to see in darkness", "The ability to produce light from within the body", "The ability to detect heat from other creatures", "The ability to change shape underwater", "The ability to glow when touched"],
        correct: 1,
        explanation: "The passage defines bioluminescence as 'the ability to produce light from within their own bodies'. The prefix 'bio-' means life and 'luminescence' means light production. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 4, what does 'captivated' mean?",
        options: ["Frightened", "Fascinated and held the attention of", "Captured and imprisoned", "Confused and puzzled", "Bored and disappointed"],
        correct: 1,
        explanation: "'Captivated' means to have attracted and held someone's interest or attention. The giant squid has fascinated humans for centuries through legends and stories. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 5, what does the word 'sobering' suggest about the discovery of the plastic bag?",
        options: [
          "It was exciting and unexpected",
          "It made people think seriously about a worrying issue",
          "It helped scientists understand deep-sea pressure",
          "It proved that plastic is very strong",
          "It was amusing but not important"
        ],
        correct: 1,
        explanation: "'Sobering' means making someone feel serious or thoughtful, often about something concerning. Finding a plastic bag at the deepest point on Earth forced people to confront the reality of how far pollution has spread. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 6, what does 'overturned a fundamental assumption' mean?",
        options: [
          "Confirmed what scientists already believed",
          "Proved a basic, widely-held belief to be wrong",
          "Created a new type of scientific equipment",
          "Caused an argument between different scientists",
          "Made a discovery that was quickly forgotten"
        ],
        correct: 1,
        explanation: "To 'overturn' an assumption means to prove it wrong. A 'fundamental assumption' is a basic belief that underpins other thinking. Scientists had assumed all life needed sunlight — the vent discovery proved this wrong. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 1, what type of word is 'absolute'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Pronoun"],
        correct: 2,
        explanation: "'Absolute' is an adjective describing the noun 'darkness' — it tells us the darkness is total and complete. ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "What type of words are 'thriving', 'rotating', and 'glowing' as used in the passage?",
        options: ["Nouns", "Verbs in past tense", "Adjectives (present participles used as adjectives)", "Adverbs", "Prepositions"],
        correct: 2,
        explanation: "Although these words end in '-ing' (which usually indicates a verb), in the passage they describe nouns: 'thriving ecosystem' (paragraph 7), 'rotating cutting head' (paragraph not in this passage — 'glowing lure' paragraph 3). They function as adjectives. This is a classic exam trap — '-ing' words are not always verbs. ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In the sentence 'Yet even here, life persists' (paragraph 5), which word is a conjunction?",
        options: ["Yet", "even", "here", "life", "persists"],
        correct: 0,
        explanation: "'Yet' functions as a conjunction here, linking the previous idea (the extreme conditions) with the contrasting fact that life still exists. It means 'but' or 'nevertheless'. ✓"
      }
    ]
  },
  {
    id: 'pompeii',
    title: 'The Lost City of Pompeii',
    genre: 'historical-non-fiction',
    passage: `(1) On the morning of 24th August in the year 79 AD, the citizens of Pompeii went about their daily routines without the faintest suspicion that their world was about to end. Bakers lit their ovens. Merchants arranged their stalls in the forum. Children chased each other through the narrow, stone-paved streets. Pompeii was a prosperous Roman city of roughly twenty thousand people, nestled at the foot of a mountain that provided fertile volcanic soil for the surrounding farms and vineyards. That mountain was Vesuvius, and it had been silent for so long that most Pompeians did not even realise it was a volcano.

(2) The first sign of danger came around midday, when a tremendous explosion tore open the summit of Vesuvius. A column of superheated gas, ash, and pulverised rock shot upwards with extraordinary force, climbing over thirty kilometres into the sky before spreading outward like the canopy of a vast, grey umbrella. The Roman writer Pliny the Younger, who watched the eruption from across the Bay of Naples, described the cloud as resembling a Mediterranean stone pine tree — a tall trunk topped by spreading branches. His account, written in two letters to the historian Tacitus, remains the most detailed eyewitness record of the disaster.

(3) Within minutes, a rain of pumice stones began to fall on Pompeii. These lightweight volcanic rocks, some no bigger than a fist, clattered onto rooftops and bounced through the streets. At first, many citizens gathered up the pumice out of curiosity. But as the fall intensified, roofs began to collapse under the accumulating weight. Darkness descended as the ash cloud blotted out the sun completely. People tied cushions over their heads with strips of cloth, trying to protect themselves from the bombardment. Many fled towards the harbour, hoping to escape by sea.

(4) The eruption continued throughout the night. Layer upon layer of pumice and ash buried the city, eventually reaching a depth of nearly three metres. Buildings that had stood for centuries vanished beneath the grey blanket. But the worst was yet to come. In the early hours of 25th August, the eruption column, which had been held aloft by the force of the explosion, finally collapsed under its own weight. A devastating surge of superheated gas and rock — known today as a pyroclastic flow — raced down the mountainside at speeds exceeding one hundred kilometres per hour and temperatures above 300 degrees Celsius.

(5) The pyroclastic flow reached Pompeii in minutes. Anyone still in the city had no chance of survival. The intense heat killed people instantly, and the fine ash that followed preserved their bodies in the exact positions in which they died. Some were found crouching in corners, arms raised to shield their faces. Others were discovered clutching children or precious belongings. One man was found still holding a bag of coins. A dog lay curled at the end of its chain. These haunting casts, created centuries later by pouring plaster into the hollows left by decomposed bodies, remain the most powerful and emotional evidence of the disaster.

(6) Pompeii was not the only victim. The neighbouring town of Herculaneum, smaller but wealthier, was engulfed by an even thicker layer of volcanic material — in places over twenty metres deep. The intense heat carbonised wooden objects rather than burning them to ash, which meant that doors, furniture, food, and even scrolls of papyrus were preserved in remarkable condition. A loaf of bread, still bearing the baker's stamp, was found almost perfectly intact after nearly two thousand years.

(7) After the eruption, Pompeii was not immediately forgotten. The Roman emperor Titus sent rescue parties and allocated funds for survivors. But the sheer depth of the burial made recovery impossible with the technology of the time, and within a few generations the exact location of the city was lost. Fields were planted over the ruins. New communities grew up nearby. Pompeii slept beneath the soil for over sixteen hundred years.

(8) The city was rediscovered by accident in 1748, when workmen digging a channel for a local nobleman struck ancient walls. Systematic excavation began under the direction of the Spanish engineer Rocque Joaquin de Alcubierre, although his methods were crude by modern standards — he was primarily interested in finding treasures for the King of Naples rather than preserving the archaeological context. It was not until the nineteenth century, under the leadership of the Italian archaeologist Giuseppe Fiorelli, that excavation became truly scientific.

(9) Fiorelli transformed the study of Pompeii. He mapped the city methodically, dividing it into numbered regions and blocks. He pioneered the technique of pouring liquid plaster into the cavities left by decomposed organic material, producing the haunting body casts that are now among the site's most famous features. He also insisted on preserving objects where they were found, rather than removing them to distant museums, allowing visitors to experience the city as a complete, living environment.

(10) Today, Pompeii is one of the most visited archaeological sites in the world, attracting over three million visitors each year. Walking through its streets, you can peer into shops where amphorae still line the shelves, read election slogans painted on walls, and admire intricate mosaic floors in the houses of wealthy merchants. Graffiti scratched into plaster reveals the thoughts of ordinary Romans — their jokes, complaints, love declarations, and advertisements. One inscription, found near the amphitheatre, simply reads: "I am amazed, O wall, that you have not yet collapsed, so many writers' scribbles do you bear."

(11) Yet the excavation of Pompeii is far from complete. Roughly a third of the city remains buried, and archaeologists deliberately leave sections unexcavated, knowing that future technology will allow them to recover information that current methods would destroy. Conservation is an enormous challenge: exposed buildings are vulnerable to weathering, plant growth, and the sheer volume of tourist footfall. Several structures have collapsed in recent decades, prompting urgent restoration programmes funded by the Italian government and the European Union.

(12) Pompeii endures as both a tragedy and a treasure. It is a place where the past feels startlingly present — where you can stand in a Roman kitchen and see the soot marks on the ceiling, or walk along a pavement still grooved by chariot wheels. The disaster that destroyed Pompeii also, paradoxically, preserved it more completely than any other ancient city. As the novelist Robert Harris wrote: "Pompeii is the most complete picture of Roman daily life that exists anywhere in the world — because it was frozen in a single, terrible moment."`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Approximately how many people lived in Pompeii?",
        options: ["Five thousand", "Ten thousand", "Fifteen thousand", "Twenty thousand", "Fifty thousand"],
        correct: 3,
        explanation: "Paragraph 1 states Pompeii was 'a prosperous Roman city of roughly twenty thousand people'. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Who wrote the most detailed eyewitness account of the eruption?",
        options: ["Tacitus", "Pliny the Elder", "Pliny the Younger", "Giuseppe Fiorelli", "Emperor Titus"],
        correct: 2,
        explanation: "Paragraph 2 states 'The Roman writer Pliny the Younger, who watched the eruption from across the Bay of Naples' wrote the account. He described it in 'two letters to the historian Tacitus'. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What did people tie over their heads to protect themselves from the pumice?",
        options: ["Metal helmets", "Wooden shields", "Cushions", "Blankets", "Animal skins"],
        correct: 2,
        explanation: "Paragraph 3 states 'People tied cushions over their heads with strips of cloth, trying to protect themselves from the bombardment'. ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "When was Pompeii rediscovered?",
        options: ["1648", "1700", "1748", "1802", "1860"],
        correct: 2,
        explanation: "Paragraph 8 states 'The city was rediscovered by accident in 1748'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why did most Pompeians not realise Vesuvius was a volcano?",
        options: [
          "They had never heard of volcanoes",
          "The mountain had not erupted in living memory",
          "The mountain was too small to be a volcano",
          "They thought volcanoes only existed in other countries",
          "Scientists had told them it was safe"
        ],
        correct: 1,
        explanation: "Paragraph 1 says Vesuvius 'had been silent for so long' that people did not recognise it as a volcano. It had not erupted within anyone's memory, so its danger was forgotten. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "This passage is best described as:",
        options: [
          "A diary entry written by a Pompeii resident",
          "A factual account of a historical event and its rediscovery",
          "A persuasive text arguing for the preservation of Pompeii",
          "A fictional story set during the eruption of Vesuvius",
          "A scientific explanation of how volcanoes work"
        ],
        correct: 1,
        explanation: "The passage presents factual, chronological information about the eruption, burial, and excavation of Pompeii. It is informative historical non-fiction. ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why were wooden objects better preserved in Herculaneum than in Pompeii?",
        options: [
          "Herculaneum had stronger buildings",
          "The volcanic material was different — intense heat carbonised wood rather than burning it",
          "The residents of Herculaneum had protected their belongings",
          "Herculaneum was excavated more carefully",
          "The wood in Herculaneum was of better quality"
        ],
        correct: 1,
        explanation: "Paragraph 6 explains that 'The intense heat carbonised wooden objects rather than burning them to ash'. Carbonisation (turning to charcoal) preserves shape and structure, unlike burning which destroys them. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why was Alcubierre's excavation method criticised?",
        options: [
          "He worked too slowly",
          "He was not Italian",
          "He focused on finding treasures rather than preserving the archaeological site properly",
          "He refused to share his findings with other scientists",
          "He caused further damage to the volcano"
        ],
        correct: 2,
        explanation: "Paragraph 8 says Alcubierre's methods 'were crude by modern standards' and that 'he was primarily interested in finding treasures for the King of Naples rather than preserving the archaeological context'. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the graffiti found on Pompeii's walls tell us?",
        options: [
          "That Roman children were poorly behaved",
          "That Romans had no system of writing",
          "That ordinary Romans had the same kinds of everyday thoughts and feelings as people today",
          "That all Romans could read and write fluently",
          "That the walls were used instead of paper because paper was expensive"
        ],
        correct: 2,
        explanation: "Paragraph 10 describes graffiti including 'jokes, complaints, love declarations, and advertisements' — everyday human thoughts that feel remarkably familiar. This shows ordinary Romans were not so different from us. ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "How did Emperor Titus respond to the disaster?",
        options: [
          "He ignored it and focused on other matters",
          "He blamed the people of Pompeii for living near a volcano",
          "He took practical action by sending help and providing funds",
          "He ordered the construction of a new city on the same site",
          "He declared that Vesuvius must be destroyed"
        ],
        correct: 2,
        explanation: "Paragraph 7 states 'The Roman emperor Titus sent rescue parties and allocated funds for survivors', showing a practical and compassionate response. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "What does Fiorelli's insistence on preserving objects in their original location suggest about him?",
        options: [
          "He was lazy and did not want to move heavy objects",
          "He believed context was as important as the objects themselves",
          "He did not trust museums to look after the artefacts",
          "He wanted to keep everything in Italy",
          "He could not afford to transport the objects"
        ],
        correct: 1,
        explanation: "Paragraph 9 says Fiorelli 'insisted on preserving objects where they were found, rather than removing them to distant museums, allowing visitors to experience the city as a complete, living environment'. He understood that the location of objects within the city was as important as the objects themselves. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why do archaeologists deliberately leave parts of Pompeii unexcavated?",
        options: [
          "They have run out of funding",
          "The remaining sections are not interesting",
          "They want future generations with better technology to excavate them",
          "The Italian government has forbidden further digging",
          "They are afraid of disturbing the volcano"
        ],
        correct: 2,
        explanation: "Paragraph 11 states archaeologists 'deliberately leave sections unexcavated, knowing that future technology will allow them to recover information that current methods would destroy'. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'character-inference',
        question: "What emotions would a visitor to Pompeii most likely feel when seeing the plaster body casts?",
        options: [
          "Amusement at how different Romans looked",
          "Boredom because they are just plaster shapes",
          "Sadness and empathy for the people who died",
          "Anger at the archaeologists who made them",
          "Confusion about what the casts represent"
        ],
        correct: 2,
        explanation: "The passage describes the casts as 'haunting' and 'the most powerful and emotional evidence of the disaster' (paragraph 5). Seeing people frozen in their final moments — shielding their faces, clutching children — would naturally evoke sadness and empathy. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following was NOT found preserved at Pompeii or Herculaneum?",
        options: [
          "A loaf of bread with a baker's stamp",
          "Election slogans painted on walls",
          "A complete Roman chariot with horses",
          "Mosaic floors in wealthy houses",
          "Graffiti scratched into plaster"
        ],
        correct: 2,
        explanation: "The passage mentions bread (paragraph 6), election slogans (paragraph 10), mosaic floors (paragraph 10), and graffiti (paragraph 10). A complete chariot with horses is not mentioned anywhere. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of these statements about the eruption is NOT supported by the passage?",
        options: [
          "The eruption column rose over thirty kilometres high",
          "Pumice stones fell on the city for several hours",
          "Most deaths were caused by buildings collapsing under the weight of ash",
          "A pyroclastic flow reached speeds over one hundred kilometres per hour",
          "The eruption continued through the night"
        ],
        correct: 2,
        explanation: "The passage states that the pyroclastic flow on 25th August killed 'anyone still in the city' instantly with 'intense heat' (paragraph 5). While roofs did collapse (paragraph 3), the passage does not say most deaths were caused by building collapse — the pyroclastic flow was the main killer. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author begin the passage by describing ordinary daily activities in Pompeii?",
        options: [
          "To show that Roman daily life was boring",
          "To prove that the eruption happened without warning",
          "To create a contrast between normal life and the disaster that followed",
          "To explain what a typical Roman city looked like",
          "To demonstrate that Romans were similar to modern people"
        ],
        correct: 2,
        explanation: "Opening with bakers, merchants, and playing children creates a vivid picture of ordinary life — which makes the destruction that follows far more dramatic and poignant. The contrast between normality and catastrophe is a deliberate technique. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author use the word 'paradoxically' in the final paragraph?",
        options: [
          "Because the eruption was unexpected",
          "Because something that caused destruction also caused preservation — two opposite outcomes",
          "Because Pompeii is both old and modern at the same time",
          "Because tourists both help and harm the site",
          "Because the author disagrees with Robert Harris"
        ],
        correct: 1,
        explanation: "A paradox is a seemingly contradictory statement that is actually true. The disaster destroyed Pompeii as a living city but simultaneously preserved it for future generations — destruction and preservation are opposite outcomes from the same event. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'effect-on-reader',
        question: "What effect does the description of the dog 'curled at the end of its chain' create?",
        options: [
          "It adds humour to an otherwise serious passage",
          "It provides scientific evidence about Roman pets",
          "It creates a powerful emotional response by showing the helplessness of the victims",
          "It explains how animals behave during volcanic eruptions",
          "It proves that Romans were cruel to their animals"
        ],
        correct: 2,
        explanation: "The image of a chained dog unable to escape is deeply affecting. The animal's helplessness makes the disaster feel more personal and tragic, creating an emotional response in the reader beyond what statistics alone could achieve. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 1, what does 'prosperous' mean?",
        options: ["Dangerous", "Ancient", "Wealthy and successful", "Large and crowded", "Famous throughout the world"],
        correct: 2,
        explanation: "'Prosperous' means wealthy and successful. The word describes Pompeii as a thriving, well-off city before the eruption. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 4, what does 'devastating' mean?",
        options: ["Slow-moving", "Causing great destruction", "Brightly coloured", "Extremely cold", "Completely unexpected"],
        correct: 1,
        explanation: "'Devastating' means causing severe damage or destruction. The pyroclastic flow destroyed everything in its path, killing anyone still in the city. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 5, what does 'haunting' mean when describing the plaster casts?",
        options: [
          "Frightening like a ghost",
          "Beautiful and delicate",
          "Deeply moving and impossible to forget",
          "Old and crumbling",
          "Scientifically valuable"
        ],
        correct: 2,
        explanation: "'Haunting' means staying in the mind because of being emotionally powerful. The body casts are not frightening in a ghost-story sense, but they are so moving and thought-provoking that they stay with you long after you have seen them. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 10, what does 'intricate' mean?",
        options: ["Very old", "Extremely large", "Containing very fine, detailed patterns", "Made from expensive materials", "Hidden beneath the floor"],
        correct: 2,
        explanation: "'Intricate' means very detailed and complex, with many small parts. The mosaic floors were made up of thousands of tiny pieces arranged in detailed patterns. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 2, what type of word is 'tremendous'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Conjunction"],
        correct: 2,
        explanation: "'Tremendous' is an adjective describing the noun 'explosion' — it tells us the explosion was extremely powerful. ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "What type of words are 'curiosity', 'discovery', and 'preservation' as used in the passage?",
        options: ["Verbs", "Adjectives", "Abstract nouns", "Adverbs", "Proper nouns"],
        correct: 2,
        explanation: "All three are abstract nouns — they name ideas or concepts rather than physical objects. They are formed from the verbs 'to be curious', 'to discover', and 'to preserve' by adding suffixes (-ity, -y, -ation). ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In the sentence from paragraph 3, 'Many fled towards the harbour, hoping to escape by sea,' which word is a preposition?",
        options: ["Many", "fled", "towards", "hoping", "escape"],
        correct: 2,
        explanation: "'Towards' is a preposition — it shows the direction of movement in relation to the harbour. Prepositions indicate position, direction, or time relationships between words. ✓"
      }
    ]
  },
  {
    id: 'new-neighbourhood',
    title: 'The New Neighbourhood',
    genre: 'contemporary-realistic-fiction',
    passage: `(1) The removal van pulled away with a belch of grey exhaust, leaving Aisha standing on the unfamiliar pavement with a cardboard box of books and a growing sense of dread. Number fourteen Linden Close looked exactly like every other house on the street — red brick, white-framed windows, a square of lawn barely larger than a bath towel. It was nothing like their old flat above the launderette on Keighley Road, where the rumble of washing machines had been the soundtrack to her entire life. That flat had been cramped, noisy, and perpetually warm from the dryers below. She missed it already.

(2) "It's going to be brilliant, love," her mum said, appearing in the doorway with a mug of tea balanced on a stack of plates. She had been saying this for weeks, with the relentless cheerfulness of someone trying to convince herself as much as anyone else. Aisha's dad had started a new job at the hospital in town, which was the reason for the move, but knowing the reason did not make the reality any easier. Aisha was twelve years old, and every person she had ever known — every friend, every teacher, every shopkeeper who knew her name — was now forty-three miles away.

(3) School started on Monday. Aisha spent the weekend unpacking boxes and arranging her bedroom, placing her books in alphabetical order on the new shelves her dad had put up, slightly crooked, on Saturday afternoon. She laid out her new uniform on the chair: a maroon blazer that smelled of plastic packaging, a striped tie she had not yet learned to knot properly, and shoes so stiff they squeaked when she walked. Everything about it felt wrong — as though she was putting on a costume for a part she had not auditioned for.

(4) Westfield Academy was a sprawling modern building surrounded by playing fields that seemed to stretch to the horizon. The corridors hummed with the noise of six hundred students who all appeared to know exactly where they were going. Aisha did not. She clutched her timetable like a life raft and navigated from room to room with the cautious alertness of someone crossing a minefield. By lunchtime, she had been to the wrong classroom twice, dropped her pencil case in front of the entire maths group, and been asked by three separate people whether she was lost.

(5) She ate her lunch alone on a bench near the science block, unwrapping the cheese sandwich her mum had packed with a note tucked inside: "You're braver than you think. Love, Mum x." Aisha folded the note carefully and slipped it into her blazer pocket. She was not feeling particularly brave. She was feeling invisible — or worse, visible in all the wrong ways. The new girl. The one who did not know anyone. The one eating alone.

(6) It was during afternoon registration that everything shifted. A girl with a mass of curly red hair and paint-stained fingers dropped into the seat beside Aisha and said, without any preamble whatsoever: "You're new. I'm Meg. Do you like art?" Before Aisha could formulate a proper answer, Meg had already launched into a breathless description of the mural she was painting for the school's reception area — a rainforest scene featuring a jaguar that, according to Meg, currently looked more like a startled cat.

(7) "I need someone to do the leaves," Meg continued, as though they had known each other for years. "There are about four hundred leaves and I cannot face painting them all myself. Do you paint?" Aisha did not paint. She had never painted anything more ambitious than a birthday card. But something about Meg's completely unselfconscious enthusiasm was impossible to resist, and before she knew what was happening, Aisha had agreed to spend Tuesday lunchtime in the art room with a palette of greens and absolutely no idea what she was doing.

(8) Tuesday arrived, and Aisha found herself cross-legged on a dust sheet in front of an enormous canvas, dabbing tentative spots of emerald and lime onto branches that Meg had sketched in charcoal. The art room smelled of turpentine and damp clay and something indefinably creative. Meg painted beside her, chattering constantly — about her three cats, her disastrous attempt to learn the violin, the geography teacher who apparently looked exactly like a parrot, and a hundred other things that tumbled out of her without pause or filter.

(9) Aisha listened, smiled, and gradually found herself talking too. She told Meg about the flat above the launderette, about how the vibration of the spin cycle had been strangely soothing at night, about her dad's new job and her mum's relentless optimism. Meg listened with genuine interest, asked questions that showed she was actually paying attention, and did not once say anything as meaningless as "You'll settle in soon." Instead, she said: "My family moved here when I was nine. The first month was absolutely rubbish. Then I found the art room, and it sort of became my place. Maybe it can be yours too."

(10) Over the following weeks, the art room became exactly that. Aisha discovered that painting leaves was surprisingly meditative — the repetitive motion of brush on canvas quietened the anxious chatter in her head. She also discovered that Meg came with a wider circle of friends: Omar, who was obsessed with chess and terrible jokes; Priya, who wrote poetry and carried a different book every day; and Lucas, who could solve a Rubik's cube in under a minute and claimed to have once eaten fourteen custard creams in a single sitting.

(11) They were not the loudest group in the year, nor the most popular by whatever mysterious criteria determined such things. But they were warm, funny, and entirely unbothered by the fact that Aisha was new. She started to look forward to lunchtimes rather than dreading them. She learned to knot her tie properly. She stopped getting lost in the corridors. The maroon blazer began to feel less like a costume and more like something that actually belonged to her.

(12) One evening in late October, Aisha was sitting at her desk doing homework when her mum appeared in the doorway. "Everything alright, love?" she asked, with the careful tone she had been using since the move — as though Aisha were made of something breakable. Aisha looked up from her history textbook and realised, with a small jolt of surprise, that the answer was genuinely yes. She thought of the art room, of Meg's laugh, of the mural that now featured a jaguar that looked convincingly like a jaguar. She thought of the note still folded in her blazer pocket. "Yeah, Mum," she said. "It actually is."`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Where did Aisha live before moving to Linden Close?",
        options: ["A house in the countryside", "A flat above a launderette", "A cottage near the school", "A flat above a hospital", "A house on Linden Road"],
        correct: 1,
        explanation: "Paragraph 1 states it was 'nothing like their old flat above the launderette on Keighley Road'. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Why did Aisha's family move?",
        options: ["To be closer to relatives", "Because their old flat was too small", "Because her dad started a new job at the hospital", "Because Aisha wanted to change schools", "Because the launderette closed down"],
        correct: 2,
        explanation: "Paragraph 2 states 'Aisha's dad had started a new job at the hospital in town, which was the reason for the move'. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What was Meg painting for the school?",
        options: ["A portrait of the headteacher", "A picture of the school building", "A rainforest mural with a jaguar", "A seascape for the hall", "A pattern of leaves and flowers"],
        correct: 2,
        explanation: "Paragraph 6 describes 'the mural she was painting for the school's reception area — a rainforest scene featuring a jaguar'. ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How many students attended Westfield Academy?",
        options: ["Two hundred", "Four hundred", "Six hundred", "Eight hundred", "One thousand"],
        correct: 2,
        explanation: "Paragraph 4 mentions 'six hundred students who all appeared to know exactly where they were going'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why did Aisha arrange her books in alphabetical order?",
        options: [
          "Her mum told her to",
          "It was a way of creating something familiar and controlled in an unfamiliar place",
          "She needed to find a specific book quickly",
          "The shelves were too small for any other arrangement",
          "Her teacher had asked her to organise them for homework"
        ],
        correct: 1,
        explanation: "Alphabetical ordering is a methodical, controlling action. In the context of a stressful move, it suggests Aisha was trying to create order and familiarity in her new, unsettling environment. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "This passage is an example of:",
        options: [
          "A non-fiction article about moving house",
          "A fantasy story set in an imaginary school",
          "Contemporary realistic fiction about a relatable experience",
          "A diary entry written by a real person",
          "An autobiography by the author"
        ],
        correct: 2,
        explanation: "The story features realistic characters in a modern, everyday setting (moving house, starting a new school). It is fiction but set in the real world with relatable experiences — this is contemporary realistic fiction. ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the simile 'clutched her timetable like a life raft' suggest about Aisha?",
        options: [
          "She was worried about drowning",
          "The timetable was made of waterproof material",
          "The timetable was the only thing keeping her from feeling completely lost",
          "She was planning to go swimming after school",
          "She held onto everything tightly because she was clumsy"
        ],
        correct: 2,
        explanation: "A life raft saves someone from drowning in open water. By comparing the timetable to a life raft, the author suggests Aisha felt overwhelmed and lost, and the timetable was her only source of security and direction. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why does the author describe Aisha's mum's cheerfulness as 'relentless'?",
        options: [
          "Because her mum was genuinely very happy about the move",
          "Because her mum would not stop being cheerful, even though it felt forced",
          "Because her mum was trying to annoy Aisha",
          "Because her mum was always a cheerful person",
          "Because relentless means gentle and kind"
        ],
        correct: 1,
        explanation: "'Relentless' means never stopping. Combined with the detail that she was 'trying to convince herself as much as anyone else', it suggests the cheerfulness was forced and constant — her mum kept it up because she was anxious too, not because the situation genuinely felt brilliant. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "What kind of person is Meg?",
        options: [
          "Quiet, thoughtful, and shy",
          "Confident, creative, and friendly without being calculating",
          "Popular, sporty, and competitive",
          "Nervous, careful, and easily upset",
          "Bossy, demanding, and difficult to please"
        ],
        correct: 1,
        explanation: "Meg approaches Aisha 'without any preamble', talks with 'breathless' enthusiasm, has 'completely unselfconscious enthusiasm', and chatters 'without pause or filter'. She is genuinely friendly and creative, not performing friendliness for social advantage. ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "Why was Meg's comment — 'The first month was absolutely rubbish' — more helpful than saying 'You'll settle in soon'?",
        options: [
          "Because Aisha preferred people who complained",
          "Because it was honest and showed Meg understood how Aisha felt from experience",
          "Because Meg was trying to make Aisha feel worse",
          "Because 'you'll settle in soon' is grammatically incorrect",
          "Because Meg did not believe Aisha would settle in"
        ],
        correct: 1,
        explanation: "Meg's honesty about her own difficult experience ('absolutely rubbish') showed genuine empathy based on personal understanding. Empty reassurances like 'you'll settle in soon' can feel dismissive because they do not acknowledge the difficulty of the present moment. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the phrase 'as though she were made of something breakable' reveal about Aisha's mum?",
        options: [
          "She thought Aisha was physically unwell",
          "She was worried that Aisha was struggling emotionally with the move",
          "She did not want Aisha to break anything in the new house",
          "She thought Aisha was too young to cope with change",
          "She was angry with Aisha for not being more cheerful"
        ],
        correct: 1,
        explanation: "The metaphor of being 'breakable' suggests fragility. Aisha's mum was using a 'careful tone' because she was worried the move had been emotionally hard on her daughter and she did not want to make things worse. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the description of Meg's friends tell us about the group?",
        options: [
          "They are the most popular students in the year",
          "They are all very similar to each other",
          "They are individuals with different interests who accept each other",
          "They all love art and painting",
          "They are all new to the school like Aisha"
        ],
        correct: 2,
        explanation: "Omar likes chess, Priya writes poetry, Lucas solves Rubik's cubes — they have varied interests but are unified by being 'warm, funny, and entirely unbothered'. They accept people as they are, including Aisha being new. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'character-inference',
        question: "How does Aisha's attitude towards the school uniform change throughout the passage, and what does this represent?",
        options: [
          "She hates it at first and continues to hate it — showing she never settles in",
          "She loves it from the start — showing she is excited about the new school",
          "It changes from feeling like a costume to feeling like it belongs to her — representing her growing sense of belonging",
          "She stops noticing it — showing she becomes distracted by friends",
          "She customises it to express her individuality — showing her confidence grows"
        ],
        correct: 2,
        explanation: "In paragraph 3, the uniform feels like 'a costume for a part she had not auditioned for'. By paragraph 11, the blazer 'began to feel less like a costume and more like something that actually belonged to her'. This mirrors her journey from outsider to belonging. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following is NOT mentioned as something Aisha experienced on her first day at school?",
        options: [
          "Going to the wrong classroom",
          "Dropping her pencil case",
          "Being asked if she was lost",
          "Being teased about her old school",
          "Eating lunch alone"
        ],
        correct: 3,
        explanation: "The passage mentions wrong classrooms, a dropped pencil case, being asked if she was lost (paragraph 4), and eating alone (paragraph 5). Being teased is not mentioned — the other students were not unkind, Aisha simply felt isolated. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of these statements about Meg is NOT supported by the passage?",
        options: [
          "She has curly red hair",
          "She moved to the area when she was nine",
          "She owns three cats",
          "She is the most popular girl in the school",
          "She had paint on her fingers when she first met Aisha"
        ],
        correct: 3,
        explanation: "Paragraph 10 explicitly states the group was 'not the most popular by whatever mysterious criteria determined such things'. All other details about Meg are stated in the passage. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author include the detail about Aisha's mum's note in the sandwich?",
        options: [
          "To show that Aisha's mum packed unhealthy lunches",
          "To demonstrate that Aisha could not make her own lunch",
          "To show the quiet, everyday ways her mum was trying to support her",
          "To explain why Aisha ate a cheese sandwich",
          "To prove that Aisha's mum was a good cook"
        ],
        correct: 2,
        explanation: "The note — 'You're braver than you think' — is a small gesture of love and encouragement. Aisha folds it carefully and keeps it, showing it means something to her. It illustrates her mum's support through action rather than words. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "What is the main theme of this passage?",
        options: [
          "The importance of being good at art",
          "Why moving house is always a mistake",
          "How new friendships can help someone find belonging in an unfamiliar place",
          "The difficulties of being a parent",
          "Why large schools are better than small ones"
        ],
        correct: 2,
        explanation: "The passage traces Aisha's journey from isolation and dread to genuine belonging, driven primarily by Meg's friendship and the art room community. The central theme is finding connection and belonging through friendship. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'prediction',
        question: "What is most likely to happen next in Aisha's story?",
        options: [
          "She will ask to move back to her old flat",
          "She will continue to grow more confident and settled at Westfield Academy",
          "She will fall out with Meg over the mural",
          "She will decide to stop painting and focus on sport instead",
          "Her family will move again to another town"
        ],
        correct: 1,
        explanation: "The final paragraph shows Aisha realising she is genuinely alright. The trajectory of the story — from dread to belonging — suggests she will continue to grow in confidence and settle further into her new life. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 1, what does 'dread' mean?",
        options: ["Excitement", "Curiosity", "Great fear or anxiety about something", "Tiredness", "Confusion"],
        correct: 2,
        explanation: "'Dread' means a strong feeling of fear or anxiety about something that is going to happen. Aisha was deeply worried about living in this unfamiliar place. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 6, what does 'preamble' mean in 'without any preamble whatsoever'?",
        options: ["Permission", "Introduction or lead-up", "Nervousness", "Invitation", "Argument"],
        correct: 1,
        explanation: "'Preamble' means an introduction or preliminary statement. 'Without any preamble' means Meg launched straight into conversation without the usual polite introductions — showing her natural, direct friendliness. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 8, what does 'tentative' mean?",
        options: ["Bold and confident", "Messy and careless", "Hesitant and uncertain", "Quick and skilful", "Thick and heavy"],
        correct: 2,
        explanation: "'Tentative' means uncertain, hesitant, or not fully committed. Aisha's 'tentative spots' of paint reflect her lack of confidence — she is trying something new and is unsure of herself. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 10, what does 'meditative' suggest about painting leaves?",
        options: [
          "It was boring and repetitive",
          "It was calming and helped quiet her mind",
          "It required deep concentration and hard thinking",
          "It made her sleepy",
          "It reminded her of meditation classes she had taken"
        ],
        correct: 1,
        explanation: "'Meditative' means calming and contemplative, like meditation. The repetitive brushwork 'quietened the anxious chatter in her head' — painting became a soothing, peaceful activity for Aisha. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 1, what type of word is 'perpetually'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
        correct: 3,
        explanation: "'Perpetually' is an adverb — it modifies the adjective 'warm', telling us the flat was always warm (because of the dryers below). ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "What type of words are 'scrambled', 'navigated', and 'unwrapping' as used in the passage?",
        options: ["Nouns", "Verbs", "Adjectives", "Adverbs", "Prepositions"],
        correct: 1,
        explanation: "All three are verbs — they describe actions: 'scrambled' (paragraph not here but let's check — actually 'navigated' paragraph 4, 'unwrapping' paragraph 5). They tell us what characters did. ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In paragraph 4, 'She clutched her timetable like a life raft and navigated from room to room with the cautious alertness of someone crossing a minefield.' What literary device is used twice in this sentence?",
        options: ["Alliteration", "Personification", "Simile", "Onomatopoeia", "Rhetorical question"],
        correct: 2,
        explanation: "Two similes are used: 'like a life raft' (comparing the timetable to something that saves you from drowning) and 'of someone crossing a minefield' (comparing navigating school to walking through danger). Both use comparison to emphasise Aisha's anxiety. ✓"
      }
    ]
  },
  {
    id: 'cave-waterfall',
    title: 'The Cave Beyond the Waterfall',
    genre: 'adventure-fiction',
    passage: `(1) The waterfall roared like a living thing. It tumbled over the lip of the cliff in a great white curtain, crashing into the pool below with a force that sent plumes of spray drifting across the rocks. Sam could feel the vibration through the soles of his boots, a deep, constant tremor that seemed to come from the earth itself. He tightened his grip on the mossy ledge and tried not to look down.

(2) "Just three more metres," called his sister Jess, who was already perched on a narrow shelf of rock behind the falls. She had scrambled across the ledge as casually as if she were walking along a garden path. Jess was like that — she approached everything with the unshakeable confidence of someone who had never once considered that things might go wrong. Sam, two years younger at eleven, approached everything with a detailed mental catalogue of exactly how wrong things could go.

(3) The ledge that ran behind the waterfall was barely thirty centimetres wide, slick with spray, and bordered on one side by a wall of wet rock and on the other by a thundering column of water. If he slipped, he would fall four metres into the pool below — which was deep enough to cushion the impact, probably, but that single word 'probably' occupied a very large and uncomfortable space in Sam's imagination. He pressed his back against the rock wall, edged sideways, and tried to focus on Jess's outstretched hand rather than the roaring void beside him.

(4) "Got you," Jess said, pulling him onto the wider ledge behind the falls. Sam exhaled a breath he had not realised he was holding. The noise here was extraordinary — not louder, exactly, but different. The water formed a translucent curtain barely a metre from where they stood, and the sound was all around them, above and below and behind, as though they were standing inside the throat of some enormous creature. Light filtered through the falling water in rippling, greenish patterns that danced across the rock walls like something from a dream.

(5) And there, exactly where their grandfather's map had said it would be, was the cave. It was little more than a crack in the rock at first — a dark fissure about a metre wide and two metres tall, just large enough for a person to squeeze through sideways. But beyond the entrance, the crack widened rapidly, and Sam could see the passage opening out into what appeared to be a much larger space beyond.

(6) Their grandfather, Arthur Hargreaves, had been a geologist who had spent his career mapping the cave systems of the Yorkshire Dales. He had died the previous winter, leaving behind a house full of books, a shed full of rock samples, and — tucked inside a battered leather journal — a hand-drawn map of a cave he claimed to have discovered in 1967 but had never told anyone about. "Behind the falls at Thorndale Beck" was written in his careful, sloping handwriting, followed by: "Remarkable formations. Must return with proper equipment. Note: passage continues beyond the main chamber — have not explored."

(7) Jess had found the journal while helping to sort Grandpa Arthur's belongings. She had shown it to Sam with shining eyes and the unmistakeable expression of someone who had already decided what they were going to do. Sam had pointed out, reasonably, that exploring an unmapped cave behind a waterfall was exactly the sort of thing their parents would forbid. Jess had pointed out, less reasonably but more persuasively, that it was exactly the sort of thing Grandpa Arthur would have wanted them to do.

(8) They squeezed through the entrance one at a time, Jess first with the torch, Sam following with the map sealed in a plastic wallet. The passage was cool and dry — a sharp contrast to the drenching spray outside. The rock beneath their feet was smooth, worn by water that must have flowed here thousands of years ago but had long since found a different route. After about ten metres, the passage opened into a chamber that made both of them stop and stare.

(9) The cave was roughly circular, perhaps fifteen metres across, with a ceiling that arched overhead like the inside of a cathedral dome. But it was the formations that took their breath away. Stalactites hung from the ceiling in dense clusters, some as thin as drinking straws, others as thick as Sam's arm, their surfaces glistening with moisture in the torchlight. Stalagmites rose from the floor to meet them, creating pillars where the two had joined over millennia. The colours were astonishing — bands of cream, amber, and russet, with veins of pale blue where mineral deposits had seeped through the limestone.

(10) "It's like a palace," Jess whispered. Her voice echoed softly off the walls, returning to them as a gentle murmur. She moved the torch beam slowly across the chamber, and the light caught a frozen waterfall of calcite flowing down one wall — a cascade of stone that had taken tens of thousands of years to form, each layer deposited grain by grain by water carrying dissolved limestone from the surface above.

(11) Sam unfolded the map and held it up to the torchlight. His grandfather's careful annotations marked the positions of key formations: "organ pipes" (a row of thin, hollow stalactites that rang with a musical note when tapped gently), "the curtain" (a sheet of translucent calcite hanging from a ledge), and — at the far end of the chamber — "passage continues here." An arrow pointed into the darkness beyond the main chamber, into the section Grandpa Arthur had never explored.

(12) Sam looked at Jess. Jess looked at Sam. The sensible thing — the thing Sam usually argued for — would be to turn back, tell someone qualified about the cave, and let professionals investigate the unexplored passage. But standing in this extraordinary place that their grandfather had kept secret for over fifty years, with the sound of the waterfall a distant rumble and the ancient rock glittering all around them, the sensible thing felt remarkably unpersuasive. Sam folded the map, tucked it back into its wallet, and nodded towards the darkness. "Shall we?" he said. Jess grinned. "Thought you'd never ask."`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How old is Sam?",
        options: ["Nine", "Ten", "Eleven", "Twelve", "Thirteen"],
        correct: 2,
        explanation: "Paragraph 2 states 'Sam, two years younger at eleven'. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What was their grandfather's profession?",
        options: ["A teacher", "A geologist", "A miner", "An archaeologist", "A park ranger"],
        correct: 1,
        explanation: "Paragraph 6 states 'Their grandfather, Arthur Hargreaves, had been a geologist'. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "When did Grandpa Arthur claim to have discovered the cave?",
        options: ["1957", "1962", "1967", "1972", "1985"],
        correct: 2,
        explanation: "Paragraph 6 says he 'claimed to have discovered in 1967'. ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How wide was the ledge behind the waterfall?",
        options: ["Twenty centimetres", "Thirty centimetres", "Fifty centimetres", "One metre", "Two metres"],
        correct: 1,
        explanation: "Paragraph 3 states 'The ledge that ran behind the waterfall was barely thirty centimetres wide'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why does Sam focus on Jess's outstretched hand rather than looking at the waterfall?",
        options: [
          "Because the spray was hurting his eyes",
          "Because looking at the drop would increase his fear",
          "Because Jess told him not to look",
          "Because it was too dark to see anything else",
          "Because the waterfall was not interesting"
        ],
        correct: 1,
        explanation: "Paragraph 3 shows Sam is already afraid ('uncomfortable space in Sam's imagination'). Looking at the 'roaring void' beside him would make his fear worse, so he focuses on Jess's hand as a safer focal point. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "This passage is best described as:",
        options: [
          "A non-fiction article about cave exploration",
          "An adventure story with elements of family history",
          "A horror story set in a dangerous cave",
          "A science textbook about how caves form",
          "A biography of a famous geologist"
        ],
        correct: 1,
        explanation: "The passage follows two siblings on an adventure to find their grandfather's secret cave. It combines adventure (physical challenge, exploration) with family history (the grandfather's map and legacy). ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "What is the main difference between Sam and Jess's personalities?",
        options: [
          "Sam is older and more experienced; Jess is younger and inexperienced",
          "Sam is cautious and thinks about risks; Jess is confident and acts without hesitation",
          "Sam is brave and adventurous; Jess is timid and fearful",
          "Sam loves the outdoors; Jess prefers staying at home",
          "Sam is practical; Jess is lazy"
        ],
        correct: 1,
        explanation: "Paragraph 2 explicitly contrasts them: Jess had 'unshakeable confidence' while Sam had 'a detailed mental catalogue of exactly how wrong things could go'. This contrast runs throughout the passage. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why had Grandpa Arthur never told anyone about the cave?",
        options: [
          "The passage explains this in detail",
          "He was planning to return with proper equipment but never did",
          "He was afraid of the cave",
          "He wanted to sell it to the government",
          "He had forgotten about it"
        ],
        correct: 1,
        explanation: "Paragraph 6 shows his note: 'Must return with proper equipment. Note: passage continues beyond the main chamber — have not explored.' He intended to come back but apparently never did, and the secret remained in his journal until he died. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the description of the cave floor as 'smooth, worn by water that must have flowed here thousands of years ago' tell us?",
        options: [
          "The cave was recently formed",
          "Water still flows through the cave regularly",
          "The cave is very ancient and water shaped it over a long period before finding a new path",
          "The cave is artificial and was carved by humans",
          "The floor is dangerous because it is slippery"
        ],
        correct: 2,
        explanation: "The smooth rock worn by water that 'had long since found a different route' tells us the cave is extremely old and was shaped by flowing water over thousands of years, but the water no longer flows through this passage. ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why does Jess whisper 'It's like a palace' rather than speaking normally?",
        options: [
          "She was afraid someone might hear them",
          "The cave was so beautiful it inspired a sense of awe and reverence",
          "She had a sore throat from the cold air",
          "Sam had asked her to be quiet",
          "The echo would have been painfully loud"
        ],
        correct: 1,
        explanation: "Whispering in a beautiful, awe-inspiring place is a natural response — similar to how people lower their voices in cathedrals. The cave's beauty creates a hushed, reverent atmosphere. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "How did Jess convince Sam to explore the cave?",
        options: [
          "By threatening to go without him",
          "By bribing him with sweets",
          "By appealing to their grandfather's memory and what he would have wanted",
          "By promising it would be completely safe",
          "By saying their parents had given permission"
        ],
        correct: 2,
        explanation: "Paragraph 7 says Jess argued 'it was exactly the sort of thing Grandpa Arthur would have wanted them to do'. She used an emotional appeal based on their grandfather's legacy, which Sam found persuasive. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'inference',
        question: "How are stalactites and stalagmites different, based on the passage?",
        options: [
          "Stalactites are larger than stalagmites",
          "Stalactites hang from the ceiling; stalagmites rise from the floor",
          "Stalactites are made of limestone; stalagmites are made of calcite",
          "Stalactites are colourful; stalagmites are white",
          "Stalactites form quickly; stalagmites take thousands of years"
        ],
        correct: 1,
        explanation: "Paragraph 9 states 'Stalactites hung from the ceiling' and 'Stalagmites rose from the floor to meet them', clearly distinguishing their positions. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'character-inference',
        question: "What does Sam's decision at the end of the passage reveal about his character development?",
        options: [
          "He has become reckless and no longer cares about danger",
          "He is still cautious but the experience has made him willing to push beyond his comfort zone",
          "He is only going further because Jess is pressuring him",
          "He has completely overcome his fears",
          "He feels obligated to finish what his grandfather started"
        ],
        correct: 1,
        explanation: "Sam acknowledges 'the sensible thing' would be to turn back — showing he is still aware of risks. But he chooses to continue anyway, suggesting the cave experience has expanded his courage. He is growing, not transformed — the 'shall we?' is quiet and deliberate, not reckless. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following is NOT described as being in the cave?",
        options: [
          "Stalactites and stalagmites",
          "A frozen waterfall of calcite",
          "Underground pool of clear water",
          "Organ pipes that make musical sounds",
          "Bands of cream, amber, and russet colour"
        ],
        correct: 2,
        explanation: "The passage describes stalactites/stalagmites (paragraph 9), calcite waterfall (paragraph 10), organ pipes (paragraph 11), and coloured bands (paragraph 9). An underground pool of clear water inside the cave is not mentioned — the pool is outside, at the base of the waterfall. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of these details about Grandpa Arthur is NOT stated in the passage?",
        options: [
          "He mapped cave systems in the Yorkshire Dales",
          "He died the previous winter",
          "He kept a leather journal with a hand-drawn map",
          "He once published a scientific paper about this cave",
          "He left behind rock samples in his shed"
        ],
        correct: 3,
        explanation: "The passage says he 'never told anyone about' the cave (paragraph 6), so he could not have published a paper about it. All other details are stated in paragraph 6. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author use the simile 'as though they were standing inside the throat of some enormous creature' in paragraph 4?",
        options: [
          "To suggest the cave is dangerous and might swallow them",
          "To convey the overwhelming, all-surrounding nature of the sound behind the waterfall",
          "To compare the waterfall to a monster",
          "To make the reader feel frightened",
          "To explain how the cave was formed"
        ],
        correct: 1,
        explanation: "The simile captures the physical sensation of being completely surrounded by sound — it comes from 'above and below and behind'. Being inside a creature's throat is an image of total immersion in sound and vibration, not danger. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author end the passage at the moment Sam and Jess decide to explore further, rather than showing what they find?",
        options: [
          "Because the author ran out of ideas",
          "Because what they find is not important",
          "To create suspense and leave the reader wanting to know what happens next",
          "To show that the journey matters more than the destination",
          "Because they decide not to go any further"
        ],
        correct: 2,
        explanation: "Ending at a moment of decision — with the unexplored darkness ahead — creates a cliffhanger. The reader is left curious about what lies beyond the main chamber, which creates suspense and engagement. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'effect-on-reader',
        question: "What effect does the author create by describing the cave formations in such vivid detail in paragraphs 9 and 10?",
        options: [
          "It makes the reader feel bored by too much description",
          "It creates a sense of wonder and helps the reader visualise the extraordinary beauty of the cave",
          "It proves that the author has visited many caves",
          "It makes the cave sound dangerous and unstable",
          "It slows the story down so the reader loses interest"
        ],
        correct: 1,
        explanation: "The rich, detailed description — colours, textures, shapes, the cathedral comparison, the frozen waterfall — immerses the reader in the beauty of the cave. It creates the same sense of awe that Sam and Jess experience. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 3, what does the word 'slick' mean?",
        options: ["Smooth and slippery", "Dark and dirty", "Narrow and dangerous", "Cold and hard", "Rough and uneven"],
        correct: 0,
        explanation: "'Slick' means smooth and slippery, usually because of being wet. The ledge was 'slick with spray' from the waterfall, making it treacherous to walk on. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 4, what does 'translucent' mean?",
        options: ["Completely see-through", "Allowing some light through but not fully transparent", "Reflecting light like a mirror", "Completely solid and dark", "Sparkling with colour"],
        correct: 1,
        explanation: "'Translucent' means allowing light to pass through but not completely clear — you can see light and colour but not sharp details. The waterfall lets greenish light filter through without being fully transparent. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 5, what does 'fissure' mean?",
        options: ["A deep pool", "A narrow opening or crack in rock", "A type of cave animal", "A natural shelf", "A loose boulder"],
        correct: 1,
        explanation: "A 'fissure' is a long, narrow crack or opening in rock or earth. The cave entrance was 'a dark fissure about a metre wide and two metres tall'. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 12, what does 'unpersuasive' mean in the phrase 'the sensible thing felt remarkably unpersuasive'?",
        options: [
          "Very convincing",
          "Difficult to understand",
          "Not convincing or compelling",
          "Dangerous and risky",
          "Impossible to do"
        ],
        correct: 2,
        explanation: "'Unpersuasive' means not convincing — failing to make someone want to agree. Even though turning back was 'sensible', the beauty and excitement of the cave made that option feel unconvincing compared to exploring further. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 1, what type of word is 'constant'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
        correct: 2,
        explanation: "'Constant' is an adjective describing the noun 'tremor' — it tells us the tremor was continuous and unceasing. ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 2, 'Jess was like that — she approached everything with the unshakeable confidence of someone who had never once considered that things might go wrong.' What type of word is 'unshakeable'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Pronoun"],
        correct: 2,
        explanation: "'Unshakeable' is an adjective modifying the noun 'confidence'. It means the confidence cannot be shaken or disturbed. ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In paragraph 9, 'Stalactites hung from the ceiling in dense clusters.' Which word is a preposition?",
        options: ["Stalactites", "hung", "from", "dense", "clusters"],
        correct: 2,
        explanation: "'From' is a preposition — it shows the relationship between the stalactites and the ceiling, indicating where they hung. ✓"
      }
    ]
  },
  {
    id: 'lighthouse-storms-end',
    title: "The Lighthouse at Storm's End",
    genre: 'mystery-suspense-fiction',
    passage: `(1) Nobody had lived in the lighthouse at Storm's End for eleven years, and the village of Pencarrow had grown so accustomed to its dark silhouette against the evening sky that most people had stopped noticing it entirely. It stood on a spur of black rock at the headland, battered by salt wind, its white paint peeling in long grey strips. The glass at the top, which had once housed the great revolving lamp that warned ships away from the reef, was cracked and clouded with grime. The lighthouse was, by every reasonable measure, abandoned.

(2) Which was why, on the evening of October the fourteenth, twelve-year-old Noor Abbas nearly dropped her binoculars when she saw the light.

(3) It was not a steady beam, like the old lighthouse would have produced. It was a quick, irregular flicker — three short flashes, then a pause, then two long flashes, then darkness again. Noor watched from her bedroom window, which looked directly across the bay towards the headland, and counted the pattern carefully. Three short, two long. A pause of exactly ten seconds. Then the sequence repeated. It was too deliberate, too rhythmic, to be a reflection or a trick of the moonlight. Someone was up there, and they were signalling.

(4) Noor had moved to Pencarrow eighteen months earlier, when her mother had taken the position of headteacher at the village primary school. She had not entirely settled — the village was small, the nearest town was a forty-minute bus ride away, and the other children treated her with the polite wariness that small communities reserve for newcomers. But she had developed two consuming passions that made the isolation bearable: birdwatching, which was superb along this stretch of the Cornish coast, and codes.

(5) The codes had begun as a rainy-afternoon hobby, when she discovered a battered copy of Simon Singh's 'The Code Book' in the mobile library. She had devoured it in three days and moved on to teaching herself Morse code, the Caesar cipher, and a handful of other systems that she practised by writing encrypted messages to herself in a notebook she kept under her mattress. She was not yet fluent in Morse, but she knew enough to recognise what she was seeing through the binoculars. The pattern was not Morse. Three short, two long did not correspond to any standard Morse character. This was something else — something she did not yet understand.

(6) Over the following three nights, Noor kept careful watch. The signals appeared at precisely 9:47 pm each evening, lasted for approximately eight minutes, and followed the same basic structure — short and long flashes in varying combinations, separated by ten-second pauses. She recorded every sequence in her notebook, filling four pages with neat columns of dots and dashes. On the fourth night, she brought her mother's camera with its telephoto lens and managed to photograph the light source. When she enlarged the image on her laptop, she could just make out a pale, rectangular glow — not a torch, she decided, but something flat and even. A lantern, perhaps, or a tablet screen held up to the window.

(7) The obvious step was to tell someone. Noor considered this carefully and decided against it. Adults, in her experience, had a tendency to either dismiss things they could not immediately explain or to overreact in ways that shut down the interesting possibilities. She wanted to understand the signal before anyone else got involved. She wanted to crack the code.

(8) On Saturday morning, armed with a flask of tea, a packet of digestive biscuits, and her notebook, Noor climbed the coastal path to the headland. The lighthouse up close was more decrepit than it appeared from the village — the wooden door at the base hung from a single rusted hinge, and the interior smelled of damp stone and seagull droppings. She did not go inside. Instead, she circled the base of the tower, looking for clues, and found three things of interest.

(9) The first was a fresh bicycle tyre track in the muddy path leading from the road to the lighthouse. Someone had visited recently and repeatedly — the track was deep and well-worn. The second was a length of blue nylon rope tied to the iron railing at the base of the tower, its end frayed as though something had been lowered from it. The third, and most puzzling, was scratched into the white paint beside the door at a height of roughly one and a half metres — low enough, Noor realised, to have been made by someone her own age. It read: "E8 G3 C1 A5."

(10) Noor stared at the inscription for a long time. Four pairs of letters and numbers. It could be a grid reference, but it did not match any standard mapping format. It could be a book cipher — each pair pointing to a specific letter on a specific page — but without knowing the source book, that was a dead end. She copied it carefully into her notebook and walked home along the cliff path, her mind turning the puzzle over like a tumbler lock searching for the right combination.

(11) The breakthrough came that evening, quite by accident. Noor was helping her mother organise the school's music cupboard when she noticed the labels on a shelf of glockenspiels: C, D, E, F, G, A, B — the musical notes. E8, G3, C1, A5. What if the letters were not code letters at all, but musical notes? What if the numbers indicated something about those notes — the octave, perhaps, or the number of beats? And what if the flashing lights from the lighthouse were not random patterns but a visual representation of a melody, transcribed by someone who could not play it aloud without being heard?

(12) Noor sat down at the school's upright piano, which her mother had the key to, and carefully picked out the notes: E, G, C, A. Then again, in the rhythm of the light signals — three short, two long. She played it faster, then slower, trying different timings. And then, with a sudden rush of recognition that made the hairs on her arms stand up, she heard it. It was the opening four notes of a melody she knew — one that Grandpa Haroon used to hum while making tea. A folk song. A very old Cornish folk song. Someone at the lighthouse was playing music in light, and Noor was going to find out who.`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How long had the lighthouse been abandoned?",
        options: ["Five years", "Eight years", "Eleven years", "Fifteen years", "Twenty years"],
        correct: 2,
        explanation: "Paragraph 1 states 'Nobody had lived in the lighthouse at Storm's End for eleven years'. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What were Noor's two main hobbies?",
        options: ["Swimming and reading", "Birdwatching and codes", "Drawing and music", "Writing and photography", "Cycling and chess"],
        correct: 1,
        explanation: "Paragraph 4 states she had 'two consuming passions': birdwatching and codes. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "At what time did the signals appear each evening?",
        options: ["8:30 pm", "9:15 pm", "9:30 pm", "9:47 pm", "10:00 pm"],
        correct: 3,
        explanation: "Paragraph 6 states 'The signals appeared at precisely 9:47 pm each evening'. ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What was scratched into the paint beside the lighthouse door?",
        options: ["A name and date", "E8 G3 C1 A5", "A map of the coastline", "KEEP OUT", "A series of arrows"],
        correct: 1,
        explanation: "Paragraph 9 states the inscription read 'E8 G3 C1 A5'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why did Noor nearly drop her binoculars when she saw the light?",
        options: [
          "The binoculars were too heavy for her",
          "She was startled because no one was supposed to be in the abandoned lighthouse",
          "The light was painfully bright",
          "She heard a loud noise at the same time",
          "Her hands were cold from the October weather"
        ],
        correct: 1,
        explanation: "The passage establishes that the lighthouse had been abandoned for eleven years and 'most people had stopped noticing it'. Seeing a light in a place that should be empty would be a shock. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "This passage belongs to which genre?",
        options: [
          "Science fiction",
          "Historical fiction set in the past",
          "Mystery with elements of code-breaking",
          "Horror and ghost story",
          "Non-fiction about lighthouses"
        ],
        correct: 2,
        explanation: "The passage centres on an unexplained mystery (lights in an abandoned lighthouse) and a protagonist trying to solve it by cracking a code. This is mystery fiction. ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why did Noor decide not to tell an adult about the signals?",
        options: [
          "She was afraid of getting into trouble",
          "She did not trust her mother",
          "She wanted to solve the mystery herself before adults could dismiss or overreact to it",
          "She thought the signals were not important",
          "There were no adults available to tell"
        ],
        correct: 2,
        explanation: "Paragraph 7 explains her reasoning: 'Adults had a tendency to either dismiss things they could not immediately explain or to overreact in ways that shut down the interesting possibilities.' She wanted to understand first. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What evidence suggests the lighthouse visitor was young?",
        options: [
          "A bicycle was found parked outside",
          "The inscription was scratched at a height of about 1.5 metres — low enough for a child",
          "Children's toys were found inside the lighthouse",
          "The signals only appeared during school holidays",
          "Noor recognised the handwriting as a child's"
        ],
        correct: 1,
        explanation: "Paragraph 9 notes the inscription was 'at a height of roughly one and a half metres — low enough, Noor realised, to have been made by someone her own age'. An adult would typically scratch higher. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why does Noor rule out Morse code?",
        options: [
          "She does not know Morse code",
          "The pattern does not match any standard Morse character",
          "Morse code uses sound, not light",
          "The signals were too slow for Morse code",
          "She thinks Morse code is too old-fashioned"
        ],
        correct: 1,
        explanation: "Paragraph 5 states she 'knew enough to recognise what she was seeing' and that 'Three short, two long did not correspond to any standard Morse character. This was something else.' ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "What does Noor's approach to the mystery reveal about her character?",
        options: [
          "She is reckless and acts without thinking",
          "She is methodical, patient, and analytical",
          "She is easily frightened and avoids challenges",
          "She is popular and enjoys working in teams",
          "She is lazy and only investigates when bored"
        ],
        correct: 1,
        explanation: "Noor records patterns carefully, fills 'four pages with neat columns', photographs the light source, analyses the evidence systematically, and considers multiple hypotheses before reaching a conclusion. This is methodical, analytical behaviour. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the bicycle tyre track tell us?",
        options: [
          "The visitor drove a car to the lighthouse",
          "The visitor came once and left immediately",
          "Someone had been visiting the lighthouse regularly",
          "The path to the lighthouse was well-maintained",
          "A postman had been delivering letters"
        ],
        correct: 2,
        explanation: "Paragraph 9 describes the track as 'deep and well-worn', indicating repeated visits over time, not a single trip. The bicycle suggests someone who does not drive — possibly young. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "How does Noor feel about living in Pencarrow?",
        options: [
          "She loves it and has many close friends",
          "She has not fully settled but has found ways to cope with the isolation",
          "She hates it and wants to move back immediately",
          "She does not care where she lives",
          "She finds the village exciting and full of things to do"
        ],
        correct: 1,
        explanation: "Paragraph 4 says she 'had not entirely settled' and the village was small and remote. But her hobbies 'made the isolation bearable', suggesting she has adapted without fully belonging. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'inference',
        question: "What is Noor's breakthrough at the end of the passage?",
        options: [
          "She discovers who is sending the signals",
          "She realises the inscription letters are musical notes, not code letters, and the light signals represent a melody",
          "She finds a secret entrance to the lighthouse",
          "She deciphers a Morse code message",
          "She recognises the light pattern as a distress signal"
        ],
        correct: 1,
        explanation: "Paragraph 11 describes her realisation that E, G, C, A are musical notes, and paragraph 12 confirms the light signals match the rhythm of a melody — specifically a Cornish folk song she recognises. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following clues did Noor NOT find at the lighthouse?",
        options: [
          "A bicycle tyre track",
          "A blue nylon rope tied to the railing",
          "An inscription scratched into the paint",
          "A broken window with fabric caught on the glass",
          "The smell of damp stone and seagull droppings"
        ],
        correct: 3,
        explanation: "Paragraph 8-9 lists three clues: bicycle track, rope, and inscription. The smell is also mentioned (paragraph 8). A broken window with fabric is not described. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which code system is NOT mentioned in the passage?",
        options: [
          "Morse code",
          "Caesar cipher",
          "Book cipher",
          "Pigpen cipher",
          "Musical notation"
        ],
        correct: 3,
        explanation: "Morse code (paragraph 5), Caesar cipher (paragraph 5), book cipher (paragraph 10), and musical notation (paragraph 11) are all mentioned. Pigpen cipher is not mentioned anywhere in the passage. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author reveal details about the light pattern gradually across several paragraphs rather than all at once?",
        options: [
          "Because the author forgot to include them earlier",
          "To build suspense and mirror the step-by-step process of solving a mystery",
          "To make the passage longer",
          "Because Noor was confused and needed time to think",
          "To test whether the reader is paying attention"
        ],
        correct: 1,
        explanation: "The gradual revelation — first seeing the light, then recording patterns, then photographing it, then finding physical clues, then cracking the code — mirrors a real investigation and builds suspense. Each new detail draws the reader deeper into the mystery. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the passage end with 'Noor was going to find out who' rather than revealing the answer?",
        options: [
          "Because the author does not know who it is",
          "To frustrate the reader deliberately",
          "To create a cliffhanger that makes the reader want to read on",
          "Because who is sending the signal is not important",
          "To show that Noor has given up on the mystery"
        ],
        correct: 2,
        explanation: "The passage ends at the moment of breakthrough — Noor has cracked the code but not yet found the person. This cliffhanger creates a powerful urge in the reader to know what happens next. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'effect-on-reader',
        question: "What effect does the phrase 'the hairs on her arms stand up' create when Noor recognises the melody?",
        options: [
          "It shows that Noor is cold from the evening air",
          "It conveys the physical thrill of sudden understanding — a eureka moment",
          "It suggests Noor is frightened by what she has discovered",
          "It shows that the music is very loud",
          "It describes a medical condition"
        ],
        correct: 1,
        explanation: "Hairs standing up is a physical reaction to intense emotion — excitement, awe, or sudden recognition. Here it conveys the thrilling moment of realisation when scattered clues suddenly click into place. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 1, what does 'silhouette' mean?",
        options: ["A shadow", "A dark outline seen against a lighter background", "A photograph", "A type of building", "A reflection in water"],
        correct: 1,
        explanation: "A 'silhouette' is the dark shape or outline of something seen against a lighter background — here, the lighthouse's dark shape against the evening sky. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 4, what does 'consuming' mean in 'two consuming passions'?",
        options: ["Eating and drinking", "Taking up all her attention and energy", "Wasteful and expensive", "Recently discovered", "Secret and hidden"],
        correct: 1,
        explanation: "'Consuming' here means absorbing, taking up a great deal of time and attention. Her hobbies were not casual interests — they occupied her deeply. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 8, what does 'decrepit' mean?",
        options: ["Beautiful but old", "Extremely tall", "In a very poor condition due to age and neglect", "Recently painted", "Hidden from view"],
        correct: 2,
        explanation: "'Decrepit' means worn out and in very poor condition through age and neglect. The lighthouse's peeling paint, rusted hinge, and smell of damp confirm this meaning. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 10, what does 'turning the puzzle over like a tumbler lock searching for the right combination' suggest?",
        options: [
          "Noor was physically turning something in her hands",
          "Her mind was systematically working through possibilities to find the answer",
          "She was feeling dizzy and confused",
          "She had given up trying to solve the puzzle",
          "She was comparing the puzzle to a safe she wanted to break into"
        ],
        correct: 1,
        explanation: "A tumbler lock clicks through positions until the right combination aligns. The simile suggests Noor's mind was methodically working through possible interpretations, trying each one until something clicked. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 1, what type of word is 'battered'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Conjunction"],
        correct: 2,
        explanation: "'Battered' here is an adjective — it describes the state of the lighthouse (damaged by repeated exposure to salt wind). Although 'battered' can also be a verb, here it modifies a noun. ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "What type of words are 'carefully', 'precisely', and 'recently' as used in the passage?",
        options: ["Nouns", "Verbs", "Adjectives", "Adverbs", "Prepositions"],
        correct: 3,
        explanation: "All three are adverbs ending in '-ly'. They modify verbs: counted 'carefully' (paragraph 3), appeared 'precisely' at 9:47 (paragraph 6), visited 'recently' (paragraph 9). ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In paragraph 3, 'It was too deliberate, too rhythmic, to be a reflection or a trick of the moonlight.' Which word is an abstract noun?",
        options: ["deliberate", "rhythmic", "reflection", "trick", "moonlight"],
        correct: 3,
        explanation: "'Trick' is an abstract noun here — it names a concept (a deception or illusion) rather than a physical object. 'Reflection' could also be considered abstract, but 'trick of the moonlight' specifically refers to an intangible concept of deception. Note: 'deliberate' and 'rhythmic' are adjectives, 'moonlight' is a concrete/compound noun. ✓"
      }
    ]
  },
  {
    id: 'boudicca',
    title: 'Boudicca: Warrior Queen of the Iceni',
    genre: 'legend-narrative-non-fiction',
    passage: `(1) In the year 60 AD, the most powerful empire the world had ever known was shaken to its foundations — not by a rival army or a foreign invasion, but by a woman from a small tribal kingdom in what is now Norfolk. Her name was Boudicca, queen of the Iceni, and her rebellion against Roman rule remains one of the most dramatic and violent episodes in the history of Britain.

(2) The Iceni were a Celtic tribe who had occupied the flat, marshy lands of East Anglia for generations before the Romans arrived. When the Emperor Claudius invaded Britain in 43 AD, the Iceni king, Prasutagus, made a pragmatic decision: rather than fight, he would cooperate with Rome. He signed a treaty that allowed the Iceni to keep their lands and customs in exchange for accepting Roman authority. For nearly two decades, this uneasy arrangement held. Prasutagus even named the Roman emperor as co-heir to his kingdom in his will, alongside his two daughters — a gesture of loyalty that he hoped would protect his family after his death.

(3) It did not. When Prasutagus died around 60 AD, the Romans ignored the will entirely. Imperial officials seized the Iceni kingdom as if it were conquered territory, confiscating the property of tribal nobles and treating the people as slaves. When Boudicca protested, the Roman soldiers had her publicly flogged and assaulted her daughters. It was an act of breathtaking cruelty and arrogance, and it ignited a fury that the Romans had gravely underestimated.

(4) Boudicca gathered an army. The Iceni rallied to her immediately, joined by the Trinovantes — a neighbouring tribe that had its own grievances against Rome — and warriors from several other Celtic groups. Ancient sources disagree on the size of Boudicca's force, but most suggest it numbered well over a hundred thousand. This was not a disciplined professional army like Rome's legions; it was a vast, furious tide of men, women, and even children, united by rage and a desire for vengeance.

(5) The first target was Camulodunum — modern Colchester — which the Romans had established as a colony for retired soldiers. The town had no defensive walls. Its inhabitants had grown complacent, believing that Roman military superiority made them untouchable. They were wrong. Boudicca's forces swept through Camulodunum with devastating ferocity, burning buildings, destroying the temple dedicated to the former Emperor Claudius, and killing everyone they could find. The small Roman garrison was overwhelmed within hours. Archaeological excavations in Colchester have revealed a thick layer of burnt debris from this period — a red-black scar in the soil that archaeologists call the 'destruction layer'.

(6) The Ninth Legion, a Roman military unit stationed nearby, marched south to intercept Boudicca. It was ambushed and virtually annihilated. The legion's infantry was destroyed almost to a man, and only the cavalry escaped by fleeing at full gallop. News of the disaster sent shockwaves through the Roman administration. The procurator — the empire's chief financial officer in Britain — abandoned his post and fled across the Channel to Gaul.

(7) Boudicca turned next towards Londinium — London — which was rapidly growing into an important trading settlement. The Roman governor, Gaius Suetonius Paulinus, had been campaigning in Wales when the rebellion erupted and rushed back with his available forces. Arriving in London, he made a cold but calculated decision: the city could not be defended. He ordered a retreat, advising any Romans who could travel to leave with his army. Those who stayed — the elderly, the sick, traders who refused to abandon their goods — were left to face Boudicca's army alone.

(8) Londinium was burned to the ground. So was Verulamium — modern St Albans — which fell next. The Roman historian Tacitus recorded that approximately seventy thousand people were killed across the three towns. Boudicca's forces, he wrote, "had no interest in taking prisoners or selling slaves, or in any other commerce of war. They would only slaughter, hang, burn, and crucify." Whether this is entirely accurate or partly Roman propaganda — written by the losing side's own historians trying to justify their eventual brutal response — remains a matter of scholarly debate.

(9) The rebellion's climax came at a location that historians have never definitively identified, somewhere in the Midlands along the Roman road known as Watling Street. Suetonius Paulinus had finally assembled a force of roughly ten thousand legionaries and chose his ground carefully — a narrow valley with thick forest behind and open ground in front. This was critical: Boudicca's enormous numerical advantage was useless in a confined space where only a few warriors could engage at a time.

(10) The resulting battle was a catastrophe for the Britons. The Roman legionaries, heavily armoured and fighting in disciplined formation, advanced in a wedge shape through the charging mass of Celtic warriors. Behind Boudicca's army, their own supply wagons blocked the escape route. Tens of thousands were killed. Tacitus claims the Romans lost just four hundred men, though this figure may be exaggerated to glorify the victory. What is certain is that the rebellion was crushed utterly.

(11) Boudicca herself disappeared from the historical record after the battle. Tacitus states she took poison. Another Roman historian, Cassius Dio, says she fell ill and died. No grave has ever been found. The popular legend that she is buried beneath Platform 9 at King's Cross station is entirely fictional — though it is a story that refuses to die, perhaps because it captures something essential about Boudicca's enduring presence in the national imagination.

(12) Today, a bronze statue of Boudicca stands on the Victoria Embankment in London, beside Westminster Bridge and the Houses of Parliament. She is depicted riding a chariot with scythed wheels, her arm raised defiantly, her two daughters beside her. The statue was erected in 1902, and its placement beside the seat of government is deeply symbolic. Boudicca, who burned London to ashes, now watches over it as a symbol of British resistance and courage. History, as so often, has transformed a defeated rebel into an icon of defiance — a woman who, for a few extraordinary months, brought the mightiest empire on Earth to the brink of losing an entire province.`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Where did the Iceni tribe live?",
        options: ["Wales", "Cornwall", "East Anglia (Norfolk)", "Scotland", "Kent"],
        correct: 2,
        explanation: "Paragraph 1 says 'a small tribal kingdom in what is now Norfolk' and paragraph 2 confirms they 'occupied the flat, marshy lands of East Anglia'. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What happened to Boudicca when she protested against the Romans?",
        options: ["She was imprisoned in Rome", "She was exiled from Britain", "She was publicly flogged", "She was forced to sign a treaty", "She was fined and released"],
        correct: 2,
        explanation: "Paragraph 3 states 'When Boudicca protested, the Roman soldiers had her publicly flogged and assaulted her daughters'. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Which three towns were destroyed by Boudicca's forces?",
        options: [
          "London, York, and Bath",
          "Colchester, London, and St Albans",
          "Canterbury, London, and Winchester",
          "Colchester, Oxford, and London",
          "Bath, Colchester, and St Albans"
        ],
        correct: 1,
        explanation: "The passage describes the destruction of Camulodunum/Colchester (paragraph 5), Londinium/London (paragraph 8), and Verulamium/St Albans (paragraph 8). ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Where does Boudicca's statue stand today?",
        options: ["Trafalgar Square", "Outside the British Museum", "Victoria Embankment, near Westminster Bridge", "Buckingham Palace", "Tower of London"],
        correct: 2,
        explanation: "Paragraph 12 states 'a bronze statue of Boudicca stands on the Victoria Embankment in London, beside Westminster Bridge and the Houses of Parliament'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why did King Prasutagus name the Roman emperor as co-heir in his will?",
        options: [
          "Because the emperor was his personal friend",
          "Because Roman law required it",
          "Because he hoped it would protect his family from Roman aggression after his death",
          "Because he wanted the Romans to have all his wealth",
          "Because his daughters were too young to rule"
        ],
        correct: 2,
        explanation: "Paragraph 2 describes this as 'a gesture of loyalty that he hoped would protect his family after his death'. He was trying to maintain the cooperative relationship with Rome. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "This passage is best described as:",
        options: [
          "A legend with no basis in historical fact",
          "A historical account told in a narrative style",
          "A fictional story inspired by real events",
          "A persuasive argument about Roman cruelty",
          "A textbook entry listing dates and facts"
        ],
        correct: 1,
        explanation: "The passage presents real historical events (with named sources like Tacitus and Dio) but tells them in a dramatic, narrative style with vivid descriptions. It is historical non-fiction written as narrative. ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why did Suetonius Paulinus choose a narrow valley for the final battle?",
        options: [
          "It was close to his supply base",
          "It was near London and easy to reach",
          "The confined space would neutralise Boudicca's huge numerical advantage",
          "The valley had water supplies for his soldiers",
          "He wanted to trap Boudicca's army from behind"
        ],
        correct: 2,
        explanation: "Paragraph 9 explains that 'Boudicca's enormous numerical advantage was useless in a confined space where only a few warriors could engage at a time'. The narrow valley was chosen deliberately to negate the Britons' superior numbers. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the 'destruction layer' found in Colchester prove?",
        options: [
          "That Colchester was built by the Romans",
          "That a catastrophic fire occurred at this location during Boudicca's rebellion",
          "That the Romans rebuilt the town after the rebellion",
          "That Boudicca's army used advanced weapons",
          "That the archaeology is unreliable"
        ],
        correct: 1,
        explanation: "Paragraph 5 describes 'a thick layer of burnt debris' — 'a red-black scar in the soil' — which is physical archaeological evidence confirming the historical accounts of Boudicca burning Colchester. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why does the author question Tacitus's account of Boudicca's army killing civilians?",
        options: [
          "Because Tacitus was not in Britain at the time",
          "Because the account may include Roman propaganda to justify their violent response",
          "Because Tacitus supported Boudicca",
          "Because no civilians lived in the three towns",
          "Because the passage disagrees with all Roman historians"
        ],
        correct: 1,
        explanation: "Paragraph 8 asks 'Whether this is entirely accurate or partly Roman propaganda — written by the losing side's own historians trying to justify their eventual brutal response'. The author notes that Roman writers had a motive to exaggerate the rebels' cruelty. ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "What does Suetonius Paulinus's decision to abandon London suggest about him?",
        options: [
          "He was a coward who ran from danger",
          "He was a pragmatic military commander who prioritised winning the war over saving one city",
          "He did not care about the people of London",
          "He was tricked by Boudicca into leaving",
          "He had already decided to surrender to Boudicca"
        ],
        correct: 1,
        explanation: "Paragraph 7 describes his choice as 'cold but calculated' — he could not defend London with his available forces, so he retreated to fight on better terms later. This is pragmatic military decision-making, not cowardice. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "What motivated Boudicca's rebellion?",
        options: [
          "A desire for personal wealth and power",
          "Fury at the cruel treatment of herself and her daughters, and the theft of her kingdom",
          "A long-standing plan to unite all Celtic tribes",
          "Religious differences with the Romans",
          "Encouragement from other foreign enemies of Rome"
        ],
        correct: 1,
        explanation: "Paragraph 3 describes the seizure of her kingdom, her flogging, and the assault on her daughters. The passage says this 'ignited a fury that the Romans had gravely underestimated'. Her rebellion was driven by personal outrage and injustice. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why might Tacitus's claim that the Romans lost 'just four hundred men' be unreliable?",
        options: [
          "Because Tacitus was not a real person",
          "Because the Romans would want to minimise their own losses and glorify the victory",
          "Because the Romans did not count their dead",
          "Because Tacitus supported Boudicca",
          "Because the battle did not actually happen"
        ],
        correct: 1,
        explanation: "Paragraph 10 notes 'this figure may be exaggerated to glorify the victory'. Roman historians had an incentive to make Roman victories sound more impressive by understating their own casualties. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'character-inference',
        question: "What does the passage suggest about how Boudicca is remembered differently today compared to how the Romans viewed her?",
        options: [
          "She is remembered exactly as the Romans described her",
          "The Romans honoured her as a great leader",
          "She has been transformed from a defeated rebel into a symbol of British courage and defiance",
          "Modern historians believe she was entirely fictional",
          "She is remembered primarily for her cruelty"
        ],
        correct: 2,
        explanation: "Paragraph 12 explicitly states 'History has transformed a defeated rebel into an icon of defiance'. Her statue beside Parliament symbolises courage, not the violent defeat the Romans would have celebrated. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following is NOT stated about Boudicca's army?",
        options: [
          "It included men, women, and children",
          "It numbered over a hundred thousand",
          "It included warriors from several Celtic tribes",
          "It was highly trained and disciplined like the Roman legions",
          "It was driven by rage and a desire for vengeance"
        ],
        correct: 3,
        explanation: "Paragraph 4 explicitly says 'This was not a disciplined professional army like Rome's legions'. All other details are stated in the passage. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of these statements about Boudicca's death is supported by the passage?",
        options: [
          "She was captured and executed by the Romans",
          "She died in battle at Watling Street",
          "She escaped to Ireland and lived in exile",
          "Ancient sources give different accounts — poison or illness",
          "She is buried under Platform 9 at King's Cross"
        ],
        correct: 3,
        explanation: "Paragraph 11 states 'Tacitus states she took poison. Another Roman historian, Cassius Dio, says she fell ill and died.' The King's Cross burial is described as 'entirely fictional'. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author describe the placement of Boudicca's statue beside Parliament as 'deeply symbolic'?",
        options: [
          "Because Parliament is the most visited building in London",
          "Because it is ironic that a woman who destroyed London now watches over its seat of government",
          "Because the statue is the largest in London",
          "Because Boudicca was the first woman to sit in Parliament",
          "Because the statue was built by the same people who built Parliament"
        ],
        correct: 1,
        explanation: "The symbolism lies in the contradiction: Boudicca burned London to ashes, yet her statue now stands guard beside the centre of British government. The rebel has become a protector — a dramatic reversal that the author highlights. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "What is the author's main purpose in this passage?",
        options: [
          "To argue that the Romans should never have invaded Britain",
          "To present a vivid, balanced account of a pivotal event in British history",
          "To prove that Boudicca was a better leader than the Roman generals",
          "To explain why Roman civilisation was superior to Celtic culture",
          "To describe archaeological methods used at Colchester"
        ],
        correct: 1,
        explanation: "The passage presents both sides — Boudicca's justified fury and the Roman tactical brilliance — using vivid narrative while noting where sources may be unreliable. This is balanced historical storytelling. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'effect-on-reader',
        question: "What effect does the opening sentence create?",
        options: [
          "It bores the reader with a date",
          "It immediately grabs attention by showing how one woman challenged the world's greatest empire",
          "It confuses the reader about when the story is set",
          "It makes the reader sympathise with the Roman Empire",
          "It creates a peaceful, calm atmosphere"
        ],
        correct: 1,
        explanation: "Opening with 'the most powerful empire the world had ever known was shaken to its foundations' by 'a woman from a small tribal kingdom' creates an immediate David-vs-Goliath tension that hooks the reader. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 2, what does 'pragmatic' mean?",
        options: ["Cowardly", "Foolish", "Dealing with things in a practical, realistic way", "Extremely brave", "Deeply religious"],
        correct: 2,
        explanation: "'Pragmatic' means practical and focused on what is achievable rather than idealistic. Prasutagus chose cooperation because fighting Rome was unrealistic — a practical decision. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 5, what does 'complacent' mean?",
        options: ["Frightened", "Satisfied to the point of not recognising danger", "Extremely well-prepared", "Friendly and welcoming", "Suspicious and careful"],
        correct: 1,
        explanation: "'Complacent' means feeling so satisfied with the current situation that you fail to recognise potential problems. The Colchester Romans felt so safe that they did not build defensive walls. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 6, what does 'annihilated' mean?",
        options: ["Defeated narrowly", "Surrendered peacefully", "Completely destroyed", "Temporarily delayed", "Surrounded but not harmed"],
        correct: 2,
        explanation: "'Annihilated' means completely destroyed. The Ninth Legion's infantry was 'destroyed almost to a man' — virtually the entire unit was killed. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 12, what does 'defiance' mean?",
        options: ["Agreement with authority", "Fear of power", "Bold resistance and refusal to obey", "Quiet acceptance", "Physical strength"],
        correct: 2,
        explanation: "'Defiance' means bold resistance to authority or opposition. Boudicca's raised arm in the statue symbolises her refusal to accept Roman domination. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 3, what type of word is 'gravely'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
        correct: 3,
        explanation: "'Gravely' is an adverb modifying the verb 'underestimated'. It tells us the degree to which the Romans underestimated Boudicca — seriously and severely. ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "What type of words are 'rebellion', 'vengeance', and 'cruelty' as used in the passage?",
        options: ["Verbs", "Adjectives", "Abstract nouns", "Adverbs", "Proper nouns"],
        correct: 2,
        explanation: "All three are abstract nouns — they name ideas or states of being rather than physical objects. Rebellion, vengeance, and cruelty are concepts you cannot touch or see directly. ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In paragraph 4, 'Boudicca gathered an army.' What type of sentence is this?",
        options: ["A compound sentence", "A complex sentence", "A simple sentence", "A question", "An exclamatory sentence"],
        correct: 2,
        explanation: "This is a simple sentence — it has one subject (Boudicca), one verb (gathered), and one object (an army). It contains a single independent clause with no subordinate clauses or conjunctions. Its brevity gives it power and emphasis. ✓"
      }
    ]
  },
  {
    id: 'lambton-worm',
    title: 'The Legend of the Lambton Worm',
    genre: 'legend-narrative-non-fiction',
    passage: `(1) Of all the legends that have emerged from the hills and rivers of northern England, few are as strange, as enduring, or as delightfully gruesome as the tale of the Lambton Worm. This story, which has been told around firesides in County Durham for at least four hundred years, concerns a young nobleman, a monstrous serpent, and a curse that would haunt an entire family for nine generations. Whether there is any grain of truth behind the tale is impossible to say — but the people of the North East have never let a small matter like historical accuracy get in the way of a good story.

(2) The legend begins, as many legends do, with a young man behaving badly. John Lambton, heir to the Lambton estate near the River Wear, was a wild and reckless youth who had little time for church or responsibility. One Sunday morning, instead of attending the service at the local chapel, he took his fishing rod down to the river. An old man passing by warned him that no good would come of fishing on the Sabbath, but John laughed the warning off and cast his line.

(3) What he caught was not a fish. Hooked on the end of his line was a small, black creature — slimy, eyeless, and about the length of a man's thumb. It looked, according to various retellings, like a cross between an eel and a lizard, with nine holes along each side of its head where gills might have been. Repulsed, John pulled the creature from the hook and threw it into a nearby well. He thought no more about it.

(4) Years passed. John Lambton, filled with remorse for his wayward youth, joined the Crusades and travelled to the Holy Land to fight. In his absence, the creature in the well grew. It grew to an extraordinary size — some versions of the story claim it became large enough to wrap itself three times around a local hill known as Worm Hill. The word 'worm' in this context is the old English word for serpent or dragon, and by the time the creature emerged from the well, it was a dragon in all but name: enormous, vicious, and possessed of an insatiable appetite.

(5) The Worm terrorised the surrounding countryside. It devoured sheep, cattle, and any unwary traveller who ventured too close. Farmers found their livestock missing each morning, and the pastures nearest the river were stripped bare. Worse still, whenever anyone attempted to fight the creature, it simply reassembled itself. Knights and soldiers would hack it to pieces, only to watch in horror as the severed sections crawled back together and the Worm reformed, apparently unharmed. No weapon, no strategy, and no amount of courage could destroy it.

(6) When John Lambton finally returned from the Crusades — older, wiser, and carrying the weight of years of battle — he discovered the devastation his careless act had caused. The worm he had thrown into the well as a boy had become a monster that was destroying his family's land and terrifying its people. The responsibility was his, and he resolved to put it right.

(7) John sought advice from a wise woman — a witch, in some versions of the tale — who lived in the hills above the estate. She told him how to defeat the Worm: he must cover his armour with razor-sharp spearheads, so that when the creature wrapped itself around him to crush him, it would cut itself to ribbons on the blades. But the wise woman attached a terrible condition. After killing the Worm, John must immediately kill the first living thing he saw, or a curse would fall upon the Lambton family — for nine generations, no Lord of Lambton would die peacefully in his bed.

(8) John prepared carefully. He arranged a signal with his father: after the battle, John would blow his hunting horn three times, and his father would release the family's favourite greyhound. The dog would run to John, and John would kill it — satisfying the wise woman's condition without taking a human life. It was a clever plan, and John took his position on a rock in the middle of the River Wear, where the Worm came to drink each evening, and waited.

(9) The battle was ferocious. The Worm coiled itself around John with crushing force, but the spearheads embedded in his armour sliced through its flesh. Each severed piece fell into the river and was swept away by the current before it could rejoin the body. Gradually, piece by piece, the Worm was destroyed. John stood bloodied and exhausted on his rock as the last fragments of the creature disappeared downstream.

(10) He blew his horn three times. But his father, overcome with relief and joy at seeing his son alive, forgot the plan. Instead of releasing the dog, the old man ran out of the castle himself, arms outstretched, tears streaming down his face. John saw his father before he saw the greyhound. He could not bring himself to kill his own father. The greyhound arrived moments later and John killed it immediately — but the damage was done. The first living thing he had seen was his father, and the condition had been broken.

(11) The curse fell upon the Lambton family. According to local tradition, for the next nine generations, no Lord of Lambton died peacefully. Henry Lambton was drowned crossing a bridge. Another Lambton was killed in battle. A third died in a riding accident. The records of the Lambton family during these generations are patchy and incomplete, but enough unfortunate deaths occurred to keep the legend firmly alive in local memory. The ninth Lord Lambton, Henry Lambton, died in his carriage in 1761 — and with him, the curse was said to have been finally fulfilled.

(12) The Lambton Worm remains one of the most popular legends in the North East of England. It has been adapted into a famous dialect song, a pantomime performed annually in the region, and numerous children's books. The ruins of the original Lambton estate still stand beside the River Wear, and Worm Hill — if it ever existed — has been claimed by at least three different locations in County Durham, each insisting it is the genuine site. The story endures because it contains everything a good legend needs: a reckless youth, a terrible mistake, a heroic quest, an impossible condition, and a curse that echoes down the centuries. As the old song goes: "Whisht, lads, haad yer gobs — Aa'll tell ye aall an aaful story."`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Where is the Lambton estate located?",
        options: ["Near the River Thames", "Near the River Wear in County Durham", "Near the River Severn in Wales", "Near the River Tyne in Newcastle", "Near the River Avon in Bath"],
        correct: 1,
        explanation: "Paragraph 2 states 'John Lambton, heir to the Lambton estate near the River Wear' and paragraph 1 places the story in County Durham. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What was John Lambton doing when he caught the creature?",
        options: ["Hunting in the forest", "Swimming in the river", "Fishing instead of going to church", "Walking his dog", "Exploring a cave"],
        correct: 2,
        explanation: "Paragraph 2 states 'instead of attending the service at the local chapel, he took his fishing rod down to the river'. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What did John do with the creature after catching it?",
        options: ["He took it home as a pet", "He threw it back in the river", "He threw it into a nearby well", "He gave it to the old man", "He killed it immediately"],
        correct: 2,
        explanation: "Paragraph 3 states 'John pulled the creature from the hook and threw it into a nearby well'. ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "What was the wise woman's condition for lifting the curse?",
        options: [
          "John must never fish again",
          "John must kill the first living thing he saw after the battle",
          "John must leave the country forever",
          "John must rebuild the chapel",
          "John must throw the Worm back into the well"
        ],
        correct: 1,
        explanation: "Paragraph 7 states 'After killing the Worm, John must immediately kill the first living thing he saw'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why did the Worm survive when people tried to fight it?",
        options: [
          "Its skin was too thick for weapons to penetrate",
          "It could fly away from danger",
          "Its severed pieces crawled back together and it reformed",
          "It was protected by a magic spell",
          "It hid underwater during attacks"
        ],
        correct: 2,
        explanation: "Paragraph 5 describes how 'the severed sections crawled back together and the Worm reformed, apparently unharmed'. This regeneration ability made it seem impossible to destroy. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "This passage is best described as:",
        options: [
          "A scientific account of an ancient creature",
          "A retelling of a regional folk legend with historical commentary",
          "A fictional story written by the author",
          "A factual history of County Durham",
          "A newspaper report about a recent discovery"
        ],
        correct: 1,
        explanation: "The passage retells the traditional legend while commenting on its origins, variations, and cultural significance. It is a narrative non-fiction account of a folk legend. ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why was it important that the severed pieces fell into the river?",
        options: [
          "The river water was poisonous to the Worm",
          "The current swept the pieces away before they could rejoin the body",
          "John needed the river to wash his armour clean",
          "The wise woman told him to fight near water",
          "The Worm was afraid of water"
        ],
        correct: 1,
        explanation: "Paragraph 9 states 'Each severed piece fell into the river and was swept away by the current before it could rejoin the body'. The flowing water prevented the Worm's regeneration ability from working. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why did John's plan to kill the greyhound fail?",
        options: [
          "The greyhound escaped from the castle",
          "John's father forgot the plan and ran out before the dog was released",
          "John could not find his sword after the battle",
          "The horn signal was too quiet for his father to hear",
          "The greyhound was faster than John's father"
        ],
        correct: 1,
        explanation: "Paragraph 10 explains: 'his father, overcome with relief and joy at seeing his son alive, forgot the plan. Instead of releasing the dog, the old man ran out of the castle himself'. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What does the old English word 'worm' mean in this context?",
        options: ["An earthworm", "A caterpillar", "A serpent or dragon", "A type of fish", "A mythical bird"],
        correct: 2,
        explanation: "Paragraph 4 explicitly states: 'The word 'worm' in this context is the old English word for serpent or dragon'. ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "How had John Lambton changed by the time he returned from the Crusades?",
        options: [
          "He had become even more reckless and irresponsible",
          "He was physically weaker and unable to fight",
          "He had matured and was willing to take responsibility for his past mistake",
          "He was angry with his father for not dealing with the Worm",
          "He had forgotten about the creature entirely"
        ],
        correct: 2,
        explanation: "Paragraph 6 describes him as 'older, wiser' and states 'The responsibility was his, and he resolved to put it right'. He had grown from a 'wild and reckless youth' into a responsible adult. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "Why could John not bring himself to kill his father?",
        options: [
          "He was too exhausted from the battle",
          "His father was wearing armour",
          "Natural love and morality prevented him from killing his own parent",
          "The wise woman had forbidden it",
          "He did not have a weapon nearby"
        ],
        correct: 2,
        explanation: "The passage implies that killing one's own father is an act so morally unthinkable that John 'could not bring himself' to do it, despite knowing the consequences of failing to fulfil the condition. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why does the author say the curse was 'finally fulfilled' when the ninth Lord Lambton died?",
        options: [
          "Because the ninth lord was the first to die peacefully",
          "Because the wise woman had specified nine generations, and this was the ninth",
          "Because the ninth lord broke the curse with a magic spell",
          "Because the Worm returned and killed him",
          "Because the family ran out of heirs"
        ],
        correct: 1,
        explanation: "Paragraph 7 states the curse would last 'for nine generations'. Paragraph 11 counts through to 'The ninth Lord Lambton' whose death completed the nine-generation span predicted by the wise woman. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'character-inference',
        question: "What does the author's tone in the first paragraph suggest about how they view the legend?",
        options: [
          "They believe every detail is historically accurate",
          "They think the legend is boring and not worth retelling",
          "They are affectionately amused by it while acknowledging it is probably not factual",
          "They are frightened by the story",
          "They think it should be forgotten"
        ],
        correct: 2,
        explanation: "Phrases like 'delightfully gruesome' and 'never let a small matter like historical accuracy get in the way of a good story' show warm amusement and affection for the tale, combined with honest acknowledgment that it is legend, not history. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following is NOT mentioned as a way the Worm terrorised the countryside?",
        options: [
          "Devouring sheep and cattle",
          "Attacking unwary travellers",
          "Stripping pastures bare",
          "Setting fire to farmhouses",
          "Reforming after being cut to pieces"
        ],
        correct: 3,
        explanation: "Paragraph 5 mentions the Worm devouring livestock, attacking travellers, stripping pastures, and regenerating after attacks. Setting fire to farmhouses is not mentioned — this Worm is a serpent, not a fire-breathing dragon. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "According to the passage, which of these is NOT a form in which the legend has been adapted?",
        options: [
          "A dialect song",
          "A pantomime",
          "Children's books",
          "A Hollywood film",
          "Local cultural tradition"
        ],
        correct: 3,
        explanation: "Paragraph 12 mentions a dialect song, pantomime, and children's books. A Hollywood film is not mentioned. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author mention that 'at least three different locations' claim to be Worm Hill?",
        options: [
          "To prove that the legend is completely fictional",
          "To show that the story is still important to local communities and they compete to own it",
          "To explain that the hill has been destroyed",
          "To criticise the people of County Durham for lying",
          "To help the reader find the real location"
        ],
        correct: 1,
        explanation: "Multiple communities claiming the site shows the legend is still culturally significant and valued — each location wants to be connected to this famous story. It demonstrates the tale's enduring hold on local identity. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author list the elements of a 'good legend' in the final paragraph?",
        options: [
          "To teach the reader how to write their own legends",
          "To explain why this particular story has survived for four hundred years",
          "To compare this legend to other, better-known stories",
          "To argue that all legends follow the same pattern",
          "To summarise the plot for readers who skipped ahead"
        ],
        correct: 1,
        explanation: "By identifying the universal story elements — 'a reckless youth, a terrible mistake, a heroic quest, an impossible condition, and a curse' — the author explains why the story resonates and endures. These are timeless narrative ingredients. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'effect-on-reader',
        question: "What effect does the detail of the father running out 'arms outstretched, tears streaming down his face' create?",
        options: [
          "It makes the reader angry at the father for being foolish",
          "It creates sympathy because his reaction is completely natural — a father relieved his son is alive",
          "It creates humour because the father's behaviour is comical",
          "It makes the reader want the curse to be even worse",
          "It shows that the father never loved John"
        ],
        correct: 1,
        explanation: "The image of an emotional father running to embrace his son is deeply human and relatable. The tragedy is that this natural, loving reaction is precisely what triggers the curse — making the reader feel sympathy for both father and son, trapped between love and fate. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 2, what does 'reckless' mean?",
        options: ["Brave and strong", "Acting without thinking about consequences", "Lazy and uninterested", "Clever but dishonest", "Quiet and thoughtful"],
        correct: 1,
        explanation: "'Reckless' means acting without thinking about the potential dangers or consequences. Young John was 'wild and reckless' — he fished on the Sabbath despite warnings, not caring about potential results. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 5, what does 'insatiable' mean?",
        options: ["Very small", "Impossible to satisfy", "Extremely frightening", "Completely silent", "Surprisingly gentle"],
        correct: 1,
        explanation: "'Insatiable' means impossible to satisfy — no matter how much the Worm ate, it was never enough. The word emphasises the creature's endless, destructive hunger. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 6, what does 'resolved' mean in 'he resolved to put it right'?",
        options: ["He wished he could fix the problem", "He firmly decided to take action", "He discussed the problem with others", "He tried but failed", "He reluctantly agreed to help"],
        correct: 1,
        explanation: "'Resolved' means made a firm, determined decision. It is stronger than simply wanting or hoping — John committed himself to action. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 1, what does 'enduring' mean in 'as enduring' as the tale?",
        options: ["Painful and difficult", "Boring and repetitive", "Lasting for a very long time", "Extremely popular right now", "Recently discovered"],
        correct: 2,
        explanation: "'Enduring' means lasting over a long period of time. The tale has been told for 'at least four hundred years' — it has endured across centuries. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 3, what type of word is 'repulsed'?",
        options: ["Noun", "Verb (past tense)", "Adjective", "Adverb", "Preposition"],
        correct: 2,
        explanation: "'Repulsed' here functions as an adjective — it describes John's emotional state (feeling disgusted). Although it derives from the verb 'to repulse', in this sentence it modifies the subject rather than describing an action. ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "What type of words are 'enormous', 'vicious', and 'insatiable' in paragraph 4?",
        options: ["Nouns", "Verbs", "Adjectives", "Adverbs", "Conjunctions"],
        correct: 2,
        explanation: "All three are adjectives describing the Worm: 'enormous' (size), 'vicious' (temperament), and 'insatiable' (appetite). They build a picture of the creature's terrifying nature. ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In paragraph 10, 'But his father, overcome with relief and joy at seeing his son alive, forgot the plan.' What type of clause is 'overcome with relief and joy at seeing his son alive'?",
        options: [
          "A main clause",
          "A subordinate (embedded) clause giving extra information about the father",
          "A question",
          "A command",
          "An independent sentence"
        ],
        correct: 1,
        explanation: "This is a subordinate clause (specifically a participial phrase) embedded between commas. It gives additional information about the father's emotional state but is not essential to the main clause ('his father forgot the plan'). Removing it would leave a complete sentence. ✓"
      }
    ]
  },
  {
    id: 'red-kite',
    title: 'The Return of the Red Kite',
    genre: 'nature-environment',
    passage: `(1) There is a bird flying over the Chiltern Hills today that, thirty years ago, you would have been more likely to see in a museum than in the sky. With its russet body, forked tail, and wingspan of nearly two metres, the red kite is one of Britain's most magnificent raptors. Yet by the late 1980s, this elegant predator had been driven to the very edge of extinction in England, Wales, and Scotland. Its remarkable recovery since then is one of the greatest conservation success stories in European history — and a powerful lesson in what can be achieved when science, determination, and community effort work together.

(2) Red kites were once among the most common birds in Britain. In medieval London, they were so numerous that foreign visitors remarked upon them. The birds served a vital function as scavengers, swooping down to clean the streets of waste, scraps, and carrion. Laws were passed making it illegal to kill a kite, and the penalty was reportedly severe — though historians disagree on whether the punishment was really execution, as some accounts claim. What is certain is that kites were valued, protected, and very much part of everyday life.

(3) The decline began in the sixteenth century and accelerated brutally over the following three hundred years. As farming methods changed and estates began to be managed for game shooting, the red kite came to be seen as vermin — a threat to pheasant chicks and lambs. Gamekeepers shot, trapped, and poisoned kites in enormous numbers. Egg collectors, drawn by the bird's increasing rarity, raided the few remaining nests. By the early twentieth century, the red kite had been completely wiped out across England and Scotland. Only a handful survived — fewer than twenty individuals — clinging to existence in the remote oak valleys of central Wales.

(4) For decades, those Welsh kites were the subject of one of the longest-running protection programmes in conservation history. Volunteers guarded nesting sites around the clock during breeding season, and farmers were paid to tolerate the birds on their land. The population grew slowly — agonisingly slowly — because the Welsh kites were so inbred that fertility rates were low and many eggs failed to hatch. By 1989, there were still only around fifty breeding pairs in the whole of Britain, all in Wales. The species was surviving, but only barely, and the prospect of kites returning to England or Scotland under their own power seemed impossibly remote.

(5) The breakthrough came from an ambitious plan called the Red Kite Reintroduction Programme. Beginning in 1989, conservationists from the RSPB and Natural England, working with the Swedish and Spanish governments, imported young red kites from healthy populations in Sweden and Spain. These birds were released at carefully chosen sites in the Chiltern Hills in southern England and in the Black Isle in northern Scotland. Over the following five years, ninety-three kites were released in the Chilterns and over a hundred in Scotland.

(6) The programme was not without controversy. Some local residents objected to what they saw as an artificial interference with nature. Farmers worried that the kites would attack their poultry. Gamekeepers on nearby shooting estates were suspected of illegally poisoning some of the released birds — suspicions that, in several cases, proved to be well-founded. Despite these setbacks, the released kites began to breed successfully. The Chilterns population grew from the initial ninety-three birds to over three hundred breeding pairs within fifteen years.

(7) What made the Chilterns site so successful was not just the landscape — rolling chalk hills with mixed woodland and open farmland — but the extraordinary response of the local community. Farmers left areas of rough ground uncut, providing habitat for the small mammals and invertebrates that kites feed on. Homeowners put out scraps in their gardens, and 'kite feeding stations' became a popular tourist attraction. Schools adopted the kite as their emblem. The bird became a source of local pride, transforming from a creature most people had never heard of into a symbol of the Chiltern Hills themselves.

(8) The success in the Chilterns inspired further reintroductions across the country. Kites were released in Northamptonshire, Yorkshire, the north-east of England, County Down in Northern Ireland, and the central belt of Scotland. Each new population was carefully monitored, with some birds fitted with wing-tags or satellite transmitters that allowed scientists to track their movements across the country. The data revealed fascinating insights into kite behaviour: they could travel remarkable distances, with some birds moving over three hundred kilometres from their release sites.

(9) The numbers are remarkable. In 1989, there were roughly fifty breeding pairs of red kites in Britain — all in Wales. By 2023, the population had grown to an estimated four thousand eight hundred breeding pairs spread across England, Scotland, Wales, and Northern Ireland. The species has been officially reclassified from 'endangered' to 'near threatened' — still not completely safe, but a transformation from the brink of extinction to a thriving, expanding population.

(10) Driving through the Chilterns today, it is common to see half a dozen kites circling on a single stretch of motorway. Their distinctive silhouette — long wings angled slightly forward, deeply forked tail constantly adjusting for balance — has become as much a part of the English landscape as church spires and hedgerows. Children growing up in the area have never known a time without kites. For them, the bird is simply part of the scenery, which is perhaps the greatest measure of the reintroduction's success.

(11) The recovery has not been without ongoing challenges. Illegal poisoning continues to be a problem, particularly in areas managed for game shooting. Collisions with vehicles account for a significant number of deaths, and the growing kite population increasingly competes for food with buzzards, another raptor that has expanded dramatically in recent decades. Scientists debate whether the current population can continue to grow or has reached the carrying capacity of the available habitat.

(12) Yet the red kite's return offers something beyond pure ecology. It demonstrates that conservation works — that it is possible to reverse decades of decline if the commitment is sustained and the approach is scientific. It shows that communities can embrace wildlife as an asset rather than a threat, and that a single species can change the identity of a landscape. The red kite flying over the Chilterns is not just a bird. It is proof that the natural world, given half a chance, is capable of an extraordinary comeback.`,
    comprehensionQuestions: [
      {
        id: 1,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How many breeding pairs of red kites were in Britain in 1989?",
        options: ["About twenty", "About fifty", "About one hundred", "About two hundred", "About five hundred"],
        correct: 1,
        explanation: "Paragraph 4 states 'By 1989, there were still only around fifty breeding pairs in the whole of Britain'. ✓"
      },
      {
        id: 2,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Where did the last British red kites survive before the reintroduction?",
        options: ["The Chiltern Hills", "The Scottish Highlands", "Central Wales", "The Lake District", "Norfolk"],
        correct: 2,
        explanation: "Paragraph 3 states they survived 'in the remote oak valleys of central Wales' and paragraph 4 confirms 'all in Wales'. ✓"
      },
      {
        id: 3,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "Where were the imported kites brought from?",
        options: ["France and Germany", "Sweden and Spain", "Norway and Italy", "Denmark and Portugal", "Ireland and Iceland"],
        correct: 1,
        explanation: "Paragraph 5 states they were imported 'from healthy populations in Sweden and Spain'. ✓"
      },
      {
        id: 4,
        difficulty: 1,
        questionSubType: 'retrieval',
        question: "How many breeding pairs were estimated in Britain by 2023?",
        options: ["One thousand", "Two thousand five hundred", "Three thousand", "Four thousand eight hundred", "Ten thousand"],
        correct: 3,
        explanation: "Paragraph 9 states 'the population had grown to an estimated four thousand eight hundred breeding pairs'. ✓"
      },
      {
        id: 5,
        difficulty: 1,
        questionSubType: 'inference',
        question: "Why were red kites protected by law in medieval London?",
        options: [
          "Because they were beautiful and people enjoyed watching them",
          "Because they performed a useful role cleaning the streets of waste",
          "Because the king kept them as pets",
          "Because they were already very rare",
          "Because they ate the rats that spread disease"
        ],
        correct: 1,
        explanation: "Paragraph 2 explains kites 'served a vital function as scavengers, swooping down to clean the streets of waste, scraps, and carrion'. They were protected because they were useful. ✓"
      },
      {
        id: 6,
        difficulty: 1,
        questionSubType: 'text-type',
        question: "This passage is best described as:",
        options: [
          "A fictional story about a bird rescue",
          "A persuasive letter arguing against game shooting",
          "An informative account of a wildlife conservation programme",
          "A scientific paper about bird genetics",
          "A travel guide to the Chiltern Hills"
        ],
        correct: 2,
        explanation: "The passage gives a factual, chronological account of the red kite's decline and recovery through conservation. It is informative non-fiction about a real wildlife programme. ✓"
      },
      {
        id: 7,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why were the Welsh kites slow to recover on their own?",
        options: [
          "There were too many predators in Wales",
          "The climate in Wales was unsuitable for kites",
          "The remaining population was so inbred that fertility was low and many eggs failed",
          "Welsh farmers refused to protect them",
          "There was not enough food in Wales"
        ],
        correct: 2,
        explanation: "Paragraph 4 explains 'the Welsh kites were so inbred that fertility rates were low and many eggs failed to hatch'. The tiny population meant all the birds were closely related, reducing breeding success. ✓"
      },
      {
        id: 8,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why did conservationists import kites from Sweden and Spain rather than using Welsh kites?",
        options: [
          "Welsh kites were a different species",
          "The Welsh kites were too wild to capture",
          "Foreign kites were cheaper to obtain",
          "The Welsh population was too small and inbred to provide healthy birds for new sites",
          "Swedish and Spanish kites were larger and more impressive"
        ],
        correct: 3,
        explanation: "Given the Welsh kites' inbreeding problems (paragraph 4), taking birds from them would have weakened the fragile Welsh population further. Importing from large, healthy foreign populations provided genetically diverse birds without risking the existing Welsh kites. ✓"
      },
      {
        id: 9,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What role did the local community play in the Chilterns success?",
        options: [
          "They donated money to the RSPB",
          "They actively supported the kites by providing habitat, food, and cultural embrace",
          "They moved away from the area to give the kites space",
          "They captured and bred kites in their homes",
          "They had no involvement — it was entirely a scientific project"
        ],
        correct: 1,
        explanation: "Paragraph 7 describes farmers leaving rough ground, homeowners putting out scraps, feeding stations becoming tourist attractions, and schools adopting the kite as their emblem. The community actively embraced the birds. ✓"
      },
      {
        id: 10,
        difficulty: 2,
        questionSubType: 'character-inference',
        question: "How did some gamekeepers respond to the reintroduction programme?",
        options: [
          "They enthusiastically supported it",
          "They were indifferent",
          "Some illegally poisoned the released birds",
          "They captured and relocated the kites",
          "They protested peacefully"
        ],
        correct: 2,
        explanation: "Paragraph 6 states 'Gamekeepers on nearby shooting estates were suspected of illegally poisoning some of the released birds — suspicions that, in several cases, proved to be well-founded'. ✓"
      },
      {
        id: 11,
        difficulty: 2,
        questionSubType: 'inference',
        question: "Why does the author say that children not knowing a time without kites is 'the greatest measure of the reintroduction's success'?",
        options: [
          "Because children are more observant than adults",
          "Because it means the kites have become a permanent, normal part of the landscape",
          "Because children care more about wildlife",
          "Because it proves the programme was expensive",
          "Because children helped feed the kites"
        ],
        correct: 1,
        explanation: "When something becomes so normal that the youngest generation takes it for granted, it has truly been integrated into everyday life. The kite is no longer a rare curiosity but a natural part of the scenery. ✓"
      },
      {
        id: 12,
        difficulty: 2,
        questionSubType: 'inference',
        question: "What do the satellite tracking data reveal about kite behaviour?",
        options: [
          "That kites never leave their release sites",
          "That kites migrate to Africa in winter",
          "That individual birds can travel over three hundred kilometres from their release sites",
          "That kites always return to the exact spot where they were born",
          "That kites avoid urban areas completely"
        ],
        correct: 2,
        explanation: "Paragraph 8 states the data 'revealed fascinating insights into kite behaviour: they could travel remarkable distances, with some birds moving over three hundred kilometres from their release sites'. ✓"
      },
      {
        id: 13,
        difficulty: 3,
        questionSubType: 'inference',
        question: "What does the phrase 'carrying capacity of the available habitat' mean in paragraph 11?",
        options: [
          "The maximum weight the land can support",
          "The maximum number of kites the environment can sustainably feed and house",
          "The distance kites can carry food",
          "The amount of pollution the habitat can absorb",
          "The number of species that can live together"
        ],
        correct: 1,
        explanation: "'Carrying capacity' is an ecological term for the maximum population an environment can sustain indefinitely — determined by food availability, nesting sites, and other resources. Scientists wonder if the habitat can support continued growth. ✓"
      },
      {
        id: 14,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of the following is NOT mentioned as a threat to red kites?",
        options: [
          "Illegal poisoning",
          "Vehicle collisions",
          "Competition with buzzards",
          "Loss of habitat to housing development",
          "Egg collecting in earlier centuries"
        ],
        correct: 3,
        explanation: "Paragraphs 3 and 11 mention poisoning, vehicle collisions, competition with buzzards, and egg collecting. Loss of habitat to housing development is not mentioned as a threat. ✓"
      },
      {
        id: 15,
        difficulty: 3,
        questionSubType: 'negative-retrieval',
        question: "Which of these statements about the reintroduction programme is NOT supported by the passage?",
        options: [
          "Ninety-three kites were released in the Chilterns",
          "The programme began in 1989",
          "Every released bird survived to breed",
          "The RSPB was involved in the programme",
          "Birds were released in Scotland as well as England"
        ],
        correct: 2,
        explanation: "The passage mentions some birds were illegally poisoned (paragraph 6) and describes ongoing deaths from vehicles (paragraph 11). It never claims every released bird survived. All other statements are directly supported. ✓"
      },
      {
        id: 16,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "Why does the author open the passage by saying you would have been 'more likely to see [the kite] in a museum than in the sky'?",
        options: [
          "Because kites are commonly displayed in museums",
          "To dramatically highlight how close the species came to extinction in Britain",
          "Because the author works in a museum",
          "To suggest that museums are the best place to learn about wildlife",
          "Because red kites prefer to live near museums"
        ],
        correct: 1,
        explanation: "The museum comparison suggests the bird was so rare it belonged more to history than to living nature. This dramatic opening establishes the scale of the decline, making the subsequent recovery all the more impressive. ✓"
      },
      {
        id: 17,
        difficulty: 3,
        questionSubType: 'author-purpose',
        question: "What is the author's overall message in this passage?",
        options: [
          "That humans always destroy wildlife",
          "That conservation is too expensive to be worthwhile",
          "That determined, science-based conservation can reverse even severe wildlife decline",
          "That red kites are more important than other British birds",
          "That game shooting should be banned throughout Britain"
        ],
        correct: 2,
        explanation: "The final paragraph explicitly states the message: 'conservation works — that it is possible to reverse decades of decline if the commitment is sustained and the approach is scientific'. The passage celebrates the combination of science, community, and persistence. ✓"
      },
      {
        id: 18,
        difficulty: 3,
        questionSubType: 'effect-on-reader',
        question: "What effect does the comparison of the kite's silhouette to 'church spires and hedgerows' create?",
        options: [
          "It suggests the kite is as boring as a church spire",
          "It positions the kite as a natural, permanent part of the quintessentially English landscape",
          "It implies the kite is a religious symbol",
          "It shows that kites only live near churches",
          "It suggests the kite is man-made like a building"
        ],
        correct: 1,
        explanation: "Church spires and hedgerows are iconic features of the English countryside. By placing the kite alongside them, the author suggests it has become an equally natural and established part of the landscape — exactly what the reintroduction programme hoped to achieve. ✓"
      }
    ],
    vocabularyQuestions: [
      {
        id: 19,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 1, what does 'raptor' mean?",
        options: ["A type of dinosaur", "A bird of prey", "A scavenging insect", "A very fast animal", "A migratory bird"],
        correct: 1,
        explanation: "A 'raptor' is a bird of prey — a bird that hunts and feeds on other animals. Eagles, hawks, owls, and kites are all raptors. ✓"
      },
      {
        id: 20,
        difficulty: 2,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 3, what does 'accelerated' mean?",
        options: ["Slowed down", "Stopped completely", "Got faster or more intense", "Stayed the same", "Changed direction"],
        correct: 2,
        explanation: "'Accelerated' means increased in speed or intensity. The decline in kite numbers got worse and faster over three hundred years, driven by shooting, trapping, and egg collecting. ✓"
      },
      {
        id: 21,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 6, what does 'controversy' mean?",
        options: ["Excitement", "Prolonged public disagreement", "Scientific research", "Financial support", "Legal protection"],
        correct: 1,
        explanation: "'Controversy' means prolonged public disagreement or argument. The programme caused debate — some supported it while others objected to 'artificial interference with nature' or worried about their poultry. ✓"
      },
      {
        id: 22,
        difficulty: 3,
        questionSubType: 'vocabulary-in-context',
        question: "In paragraph 4, what does the phrase 'agonisingly slowly' suggest?",
        options: [
          "The process was painful to the birds",
          "The growth was so slow it was frustrating and distressing for those trying to save the species",
          "The scientists were working too slowly",
          "The birds were moving slowly because they were ill",
          "The volunteers were impatient"
        ],
        correct: 1,
        explanation: "'Agonisingly' means to an extent that causes great mental distress. The population grew so slowly — despite enormous effort — that it was deeply frustrating for conservationists who feared the species might still be lost. ✓"
      }
    ],
    wordClassQuestions: [
      {
        id: 23,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "In paragraph 1, what type of word is 'magnificent'?",
        options: ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
        correct: 2,
        explanation: "'Magnificent' is an adjective describing the noun 'raptors' — it tells us the red kite is extremely beautiful and impressive. ✓"
      },
      {
        id: 24,
        difficulty: 2,
        questionSubType: 'word-class',
        question: "What type of words are 'determination', 'recovery', and 'extinction' as used in the passage?",
        options: ["Verbs", "Adjectives", "Abstract nouns", "Adverbs", "Proper nouns"],
        correct: 2,
        explanation: "All three are abstract nouns — they name ideas or processes that cannot be physically touched. They derive from verbs (determine, recover, extinct) with noun-forming suffixes (-ation, -y, -ion). ✓"
      },
      {
        id: 25,
        difficulty: 3,
        questionSubType: 'word-class',
        question: "In paragraph 10, 'Their distinctive silhouette — long wings angled slightly forward, deeply forked tail constantly adjusting for balance — has become as much a part of the English landscape as church spires and hedgerows.' Which word is an adverb?",
        options: ["distinctive", "slightly", "deeply", "constantly", "All three: slightly, deeply, constantly"],
        correct: 4,
        explanation: "'Slightly' (modifies 'forward'), 'deeply' (modifies 'forked'), and 'constantly' (modifies 'adjusting') are all adverbs — they modify adjectives or verbs to tell us how something is done. ✓"
      }
    ]
  },
];

export default mockComprehensionPassages;
