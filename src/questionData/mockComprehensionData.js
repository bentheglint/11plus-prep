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
];

export default mockComprehensionPassages;
