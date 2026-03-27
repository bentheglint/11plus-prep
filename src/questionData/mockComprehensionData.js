// Mock Test Comprehension Data
// Long-form passages (~900 words) with 25 questions each, matching GL Assessment format:
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
        explanation: "'Hours' here functions as an adverb — it tells us how long she would spend (modifying the verb 'spend'). Although 'hours' is usually a noun, in this sentence it acts adverbially to describe the duration of the action. This is a common GL trap. ✓"
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
];

export default mockComprehensionPassages;
