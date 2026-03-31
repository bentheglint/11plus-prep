/**
 * Add ~103 new punctuation questions to fill GL ratio gaps
 * All error-spotting format with 4 segments + "No mistake"
 * Difficulty weighted toward D2/D3 to rebalance distribution
 *
 * Also fixes Q16: D2→D1 (basic contraction)
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/englishData.js';

// Format: {id, d, segs:[A,B,C,D], correct:0-4, ex}
// correct: 0=A, 1=B, 2=C, 3=D, 4=No mistake
const newQs = [

  // ===== APOSTROPHE — SINGULAR POSSESSION (+16) =====
  // D2: basic singular possession
  {id:331, d:2, segs:["The teachers desk","was covered with","piles of books and","marking to finish."], correct:0,
    ex: "'teachers' should be 'teacher's' — the desk belongs to one teacher, so it needs an apostrophe before the 's': teacher's desk. ✓"},
  {id:332, d:2, segs:["My brothers football","was left in the","garden after the","match on Saturday."], correct:0,
    ex: "'brothers' should be 'brother's' — the football belongs to one brother, so add an apostrophe: brother's football. ✓"},
  {id:333, d:2, segs:["The cats collar","had a little bell","that jingled when","she walked around."], correct:0,
    ex: "'cats' should be 'cat's' — the collar belongs to one cat: cat's collar. Without the apostrophe it looks like a plural. ✓"},
  {id:334, d:2, segs:["We borrowed Dads","umbrella because it","was raining heavily","on the way to school."], correct:0,
    ex: "'Dads' should be 'Dad's' — the umbrella belongs to Dad: Dad's umbrella. ✓"},
  {id:335, d:2, segs:["The schools library","has over two thousand","books for the","children to borrow."], correct:0,
    ex: "'schools' should be 'school's' — the library belongs to the school: school's library. ✓"},
  {id:336, d:2, segs:["My friends house","has a lovely garden","with a pond and","a big oak tree."], correct:0,
    ex: "'friends' should be 'friend's' — the house belongs to one friend: friend's house. ✓"},
  {id:337, d:2, segs:["The dogs lead was","hanging on the hook","by the front door","ready for walkies."], correct:0,
    ex: "'dogs' should be 'dog's' — the lead belongs to one dog: dog's lead. ✓"},
  {id:338, d:2, segs:["Grandmas apple pie","is the best thing","I have ever","tasted in my life."], correct:0,
    ex: "'Grandmas' should be 'Grandma's' — the pie belongs to Grandma: Grandma's apple pie. ✓"},
  // D3: names ending in s
  {id:339, d:3, segs:["James pencil case","was found under the","desk after the","lesson had finished."], correct:0,
    ex: "'James' needs an apostrophe to show possession: 'James's pencil case' or 'James' pencil case'. Both forms are accepted, but the apostrophe must be there. ✓"},
  {id:340, d:3, segs:["The class enjoyed","reading about Charles","Dickens famous novels","during English."], correct:2,
    ex: "'Dickens' should be 'Dickens's' (or 'Dickens'') to show the novels belong to Dickens. Without an apostrophe it's just his surname. ✓"},
  {id:341, d:2, segs:["The babys toys were","scattered across the","playroom floor after","a busy afternoon."], correct:0,
    ex: "'babys' should be 'baby's' — the toys belong to one baby: baby's toys. ✓"},
  {id:342, d:2, segs:["Mums recipe for","chocolate brownies is","the best one in","our whole family."], correct:0,
    ex: "'Mums' should be 'Mum's' — the recipe belongs to Mum: Mum's recipe. ✓"},
  {id:343, d:2, segs:["The captains armband","was handed to the","new leader of","the football team."], correct:0,
    ex: "'captains' should be 'captain's' — the armband belongs to one captain: captain's armband. ✓"},
  {id:344, d:3, segs:["The princess' tiara","sparkled beautifully","under the bright","stage lights."], correct:4,
    ex: "There is no error. 'Princess'' is a correct way to show possession for a word ending in 's'. Both 'princess's' and 'princess'' are accepted. ✓"},
  {id:345, d:2, segs:["The authors latest","book has become a","bestseller in shops","across the country."], correct:0,
    ex: "'authors' should be 'author's' — the book belongs to one author: author's latest book. ✓"},
  {id:346, d:2, segs:["My sisters bedroom","is much tidier than","mine and she keeps","everything organised."], correct:0,
    ex: "'sisters' should be 'sister's' — the bedroom belongs to one sister: sister's bedroom. ✓"},

  // ===== APOSTROPHE — IRREGULAR PLURAL (+10) =====
  {id:347, d:3, segs:["The childrens' coats","were soaked after","playing outside in","the heavy rain."], correct:0,
    ex: "'childrens'' should be 'children's'. 'Children' is already plural (you don't say 'childrens'), so the apostrophe goes before the 's': children's. ✓"},
  {id:348, d:3, segs:["The womens' toilets","were being cleaned","so we had to","wait a few minutes."], correct:0,
    ex: "'womens'' should be 'women's'. 'Women' is already plural, so the apostrophe goes before the 's': women's. ✓"},
  {id:349, d:3, segs:["The mens' changing","room was closed for","repairs during the","swimming gala."], correct:0,
    ex: "'mens'' should be 'men's'. 'Men' is already plural, so the apostrophe goes before the 's': men's. ✓"},
  {id:350, d:3, segs:["The peoples' voices","could be heard from","the market square","on Saturday morning."], correct:0,
    ex: "'peoples'' should be 'people's'. 'People' is already plural, so the apostrophe goes before the 's': people's. ✓"},
  {id:351, d:3, segs:["The children's choir","sang beautifully at","the Christmas concert","last Friday evening."], correct:4,
    ex: "There is no error. 'Children's' is correct — 'children' is already plural, so the apostrophe goes before the 's'. ✓"},
  {id:352, d:3, segs:["The mices' tracks","could be seen in the","fresh snow outside","the garden shed."], correct:0,
    ex: "'mices'' should be 'mice's'. 'Mice' is already plural (not 'mices'), so the apostrophe goes before the 's': mice's. ✓"},
  {id:353, d:3, segs:["The women's team","won the tournament","and celebrated with","a special dinner."], correct:4,
    ex: "There is no error. 'Women's' is correct — 'women' is already plural, so the apostrophe goes before the 's'. ✓"},
  {id:354, d:3, segs:["The geeses' feathers","were scattered across","the farmyard after","the storm last night."], correct:0,
    ex: "'geeses'' should be 'geese's'. 'Geese' is already plural (not 'geeses'), so the apostrophe goes before the 's': geese's. ✓"},
  {id:355, d:3, segs:["The oxens' pen","needed mending before","the animals could","be put back inside."], correct:0,
    ex: "'oxens'' should be 'oxen's'. 'Oxen' is already plural (not 'oxens'), so the apostrophe goes before the 's': oxen's. ✓"},
  {id:356, d:3, segs:["The men's football","team trained every","Wednesday evening at","the local sports club."], correct:4,
    ex: "There is no error. 'Men's' is correct — 'men' is already plural, so the apostrophe goes before the 's'. ✓"},

  // ===== COMMA — LISTS (+14) =====
  {id:357, d:1, segs:["We need bread milk","eggs and butter","from the shop","on the way home."], correct:0,
    ex: "Commas are needed to separate items in the list: 'bread, milk, eggs and butter'. Without commas the list is confusing. ✓"},
  {id:358, d:1, segs:["She packed her","swimming costume towel","goggles and a snack","for the pool."], correct:1,
    ex: "Commas are needed between the list items: 'costume, towel, goggles and a snack'. ✓"},
  {id:359, d:1, segs:["The fruit bowl had","apples oranges bananas","and grapes in it","on the kitchen table."], correct:1,
    ex: "Commas needed: 'apples, oranges, bananas and grapes'. Each item in a list needs separating with a comma. ✓"},
  {id:360, d:2, segs:["For the trip we need","a torch a map","a compass and warm","clothing."], correct:1,
    ex: "Commas needed between list items: 'a torch, a map, a compass and warm clothing'. ✓"},
  {id:361, d:2, segs:["The class enjoyed","painting, drawing and","reading during the","wet playtime session."], correct:4,
    ex: "There is no error. The commas correctly separate the items in the list: painting, drawing and reading. ✓"},
  {id:362, d:1, segs:["Red blue green","and yellow are the","colours we used in","our art lesson."], correct:0,
    ex: "Commas needed: 'Red, blue, green and yellow'. List items must be separated by commas. ✓"},
  {id:363, d:2, segs:["The recipe needs","flour, sugar, butter","eggs and vanilla","extract to work."], correct:2,
    ex: "A comma is needed after 'butter': 'butter, eggs and vanilla extract'. Every item except the last needs a comma. ✓"},
  {id:364, d:1, segs:["He likes football","cricket rugby and","swimming but his","favourite is cricket."], correct:0,
    ex: "Commas needed: 'football, cricket, rugby and swimming'. ✓"},
  {id:365, d:2, segs:["The garden had roses","daffodils, tulips","and sunflowers growing","along the path."], correct:0,
    ex: "A comma is needed after 'roses': 'roses, daffodils, tulips and sunflowers'. The first item in the list also needs a comma after it. ✓"},
  {id:366, d:1, segs:["Mum bought socks","shoes a hat and","a scarf for my","brother at the shops."], correct:1,
    ex: "Commas needed: 'shoes, a hat and a scarf'. List items need separating. ✓"},
  {id:367, d:2, segs:["The children brought","pencils, rubbers, rulers","and sharpeners for","the maths test."], correct:4,
    ex: "There is no error. The list items are correctly separated by commas. ✓"},
  {id:368, d:1, segs:["My favourite subjects","are maths English","science and art","at school."], correct:1,
    ex: "Commas needed: 'maths, English, science and art'. ✓"},
  {id:369, d:2, segs:["The shop sells bread","cakes, pastries and","sandwiches as well as","hot drinks."], correct:0,
    ex: "A comma is needed after 'bread': 'bread, cakes, pastries and sandwiches'. ✓"},
  {id:370, d:1, segs:["We visited the castle","the museum the park","and the beach on","our holiday."], correct:1,
    ex: "Commas needed: 'the museum, the park and the beach'. ✓"},

  // ===== COMMA — PARENTHESIS (+16) =====
  {id:371, d:3, segs:["The old bridge which","was built in 1850","is now a protected","historical monument."], correct:0,
    ex: "The extra information 'which was built in 1850' is a non-essential clause (the bridge would still make sense without it), so it needs commas around it: 'bridge, which was built in 1850, is...' ✓"},
  {id:372, d:3, segs:["My cousin, who lives","in Edinburgh plays","for her school's","netball team."], correct:1,
    ex: "A closing comma is needed after 'Edinburgh': 'Edinburgh, plays'. The extra information 'who lives in Edinburgh' needs a comma at both ends. ✓"},
  {id:373, d:3, segs:["The library which","is near our house","has a wonderful","children's section."], correct:0,
    ex: "'Which is near our house' is extra information, so it needs commas: 'library, which is near our house, has...' ✓"},
  {id:374, d:3, segs:["Our headteacher,","Mrs Jones, gave","a lovely speech at","the leavers' assembly."], correct:4,
    ex: "There is no error. 'Mrs Jones' is correctly enclosed in commas — it's extra information (an appositive) that tells us who the headteacher is. ✓"},
  {id:375, d:3, segs:["The children who","had finished early,","were allowed to","read their books."], correct:1,
    ex: "The comma after 'early' is wrong. 'Who had finished early' is essential information (it tells us WHICH children), so it should NOT have commas around it. Remove the comma. ✓"},
  {id:376, d:3, segs:["The dog which","belonged to our","neighbour, kept","barking all night."], correct:2,
    ex: "If 'which belonged to our neighbour' is extra information, it needs commas at BOTH ends: 'dog, which belonged to our neighbour, kept...' Currently only the closing comma is there. ✓"},
  {id:377, d:3, segs:["Mount Snowdon, the","highest peak in Wales","attracts thousands of","visitors every year."], correct:1,
    ex: "A closing comma is needed after 'Wales': 'Wales, attracts'. The extra information 'the highest peak in Wales' needs commas at both ends. ✓"},
  {id:378, d:3, segs:["My best friend,","Amira, who lives","next door is coming","to my party."], correct:2,
    ex: "A comma is needed after 'door': 'next door, is coming'. The information 'who lives next door' needs a closing comma. ✓"},
  {id:379, d:3, segs:["The River Thames,","which flows through","London, is the","longest river in England."], correct:4,
    ex: "There is no error. The extra information 'which flows through London' is correctly enclosed in commas. ✓"},
  {id:380, d:3, segs:["The story that we","read in class,","was about a","boy who lived alone."], correct:1,
    ex: "The comma after 'class' is wrong. 'That we read in class' is essential information (it tells us WHICH story), so it should NOT have a comma. Remove it. ✓"},
  {id:381, d:3, segs:["Our neighbour,","Mr Patel who is","very kind, offered","to water our plants."], correct:1,
    ex: "A comma is needed after 'Patel': 'Mr Patel, who is very kind, offered...' The extra information needs commas at both ends. ✓"},
  {id:382, d:3, segs:["The pupils who","had been absent,","needed to catch","up on their work."], correct:1,
    ex: "The comma after 'absent' is wrong. 'Who had been absent' is essential (it tells us WHICH pupils), so no commas. ✓"},
  {id:383, d:3, segs:["The new teacher,","Miss Clark, was","very popular with","the children."], correct:4,
    ex: "There is no error. 'Miss Clark' is correctly enclosed in commas as extra information identifying the teacher. ✓"},
  {id:384, d:3, segs:["The boy who sits","next to me,","always forgets","his homework."], correct:1,
    ex: "The comma after 'me' is wrong. 'Who sits next to me' is essential information (it tells us WHICH boy), so no comma is needed. ✓"},
  {id:385, d:3, segs:["The castle, which","overlooks the harbour","is open to visitors","throughout the summer."], correct:1,
    ex: "A closing comma is needed after 'harbour': 'harbour, is open'. The extra information needs commas at both ends. ✓"},
  {id:386, d:3, segs:["The poem, which","she had memorised,","was performed","beautifully on stage."], correct:4,
    ex: "There is no error. The extra information 'which she had memorised' is correctly enclosed in commas. ✓"},

  // ===== SPEECH MARKS (+10) =====
  {id:387, d:2, segs:["\"Come here\" called","Mum from the","kitchen, \"your dinner","is ready now.\""], correct:0,
    ex: "A comma is needed after the speech: '\"Come here,\" called'. When speech is followed by 'said/called/asked', a comma goes inside the closing speech marks. ✓"},
  {id:388, d:2, segs:["\"I love this book,\"","said Emma. \"it is","really exciting and","I can't put it down.\""], correct:1,
    ex: "'it' should have a capital letter: '\"It is really exciting...' — this is a new sentence of speech, so it starts with a capital. ✓"},
  {id:389, d:2, segs:["Dad said, \"Please","tidy your room","before you go","out to play\"."], correct:3,
    ex: "The full stop should be inside the speech marks: 'to play.\"' not 'to play\".'. Punctuation at the end of speech always goes inside the closing marks. ✓"},
  {id:390, d:2, segs:["\"Where are you","going?\" asked Ben.","\"I'm going to the","park,\" replied Amy."], correct:4,
    ex: "There is no error. The question mark is correctly inside the speech marks, and the comma before 'replied' is correct. ✓"},
  {id:391, d:2, segs:["\"This is amazing!\"","shouted Jake. \"I've","never seen so many","butterflies before.\""], correct:4,
    ex: "There is no error. The exclamation mark and full stop are both correctly inside the speech marks. ✓"},
  {id:392, d:2, segs:["\"Can we go now\"","asked Sophie, \"I'm","getting really bored","of waiting here.\""], correct:0,
    ex: "A question mark is needed: '\"Can we go now?\"' — this is a question, so it needs a question mark inside the speech marks. ✓"},
  {id:393, d:3, segs:["\"Have you finished","your homework?\" asked Dad.","\"Not yet\" replied","Emma, \"but I will soon.\""], correct:2,
    ex: "A comma is needed after 'yet': '\"Not yet,\" replied'. When speech is followed by 'said/replied/asked', a comma goes inside the closing speech marks. ✓"},
  {id:394, d:2, segs:["The teacher said","\"Please open your","books to page twelve","and begin reading.\""], correct:0,
    ex: "A comma is needed after 'said': 'The teacher said,' before the opening speech marks. ✓"},
  {id:395, d:3, segs:["\"I'm really hungry,\"","said Tom. \"can we","have tea soon?\"","asked his sister."], correct:1,
    ex: "'can' should be 'Can' — this is a new sentence of speech by a different person, so it starts with a capital letter. ✓"},
  {id:396, d:2, segs:["\"Let's go to the","park,\" suggested Mia.","\"That sounds like a","great idea,\" agreed Lily."], correct:4,
    ex: "There is no error. Commas are correctly placed inside speech marks before 'suggested' and 'agreed'. ✓"},

  // ===== COMMA — FRONTED ADVERBIALS (+6) =====
  {id:397, d:2, segs:["After the long walk","we were all tired","and ready for a","nice cup of tea."], correct:0,
    ex: "A comma is needed after the fronted adverbial: 'After the long walk, we were...' When a sentence starts with a time/place/manner phrase, put a comma after it. ✓"},
  {id:398, d:2, segs:["During the assembly","the headteacher made","an important","announcement to everyone."], correct:0,
    ex: "A comma is needed: 'During the assembly, the headteacher...' The opening phrase tells us WHEN, so it needs a comma after it. ✓"},
  {id:399, d:2, segs:["Nervously, the boy","walked onto the stage","and began to sing","his solo."], correct:4,
    ex: "There is no error. The comma after 'Nervously' is correct — it's a fronted adverbial (tells us HOW), so a comma separates it from the main sentence. ✓"},
  {id:400, d:2, segs:["Before the match","started the players","warmed up on","the football pitch."], correct:0,
    ex: "A comma is needed: 'Before the match started, the players...' The opening clause tells us WHEN. ✓"},
  {id:401, d:2, segs:["Without any warning","the lights went out","and the whole school","was plunged into darkness."], correct:0,
    ex: "A comma is needed: 'Without any warning, the lights...' ✓"},
  {id:402, d:2, segs:["Carefully, she lifted","the fragile vase","off the shelf and","placed it on the table."], correct:4,
    ex: "There is no error. The comma after 'Carefully' correctly separates the fronted adverbial from the main clause. ✓"},

  // ===== SEMICOLONS (+9) =====
  {id:403, d:3, segs:["The sun was shining,","everyone was happy","and excited about","the school trip."], correct:0,
    ex: "A semicolon is needed instead of the comma: 'The sun was shining; everyone was happy...' A comma alone cannot join two complete sentences — this is called a comma splice. Use a semicolon instead. ✓"},
  {id:404, d:3, segs:["She loved reading;","her brother, however,","preferred playing","football outside."], correct:4,
    ex: "There is no error. The semicolon correctly joins two related but independent sentences. The commas around 'however' are also correct. ✓"},
  {id:405, d:3, segs:["The weather was","dreadful; nevertheless,","the sponsored walk","went ahead as planned."], correct:4,
    ex: "There is no error. The semicolon before 'nevertheless' correctly joins two independent clauses, and the comma after 'nevertheless' is also correct. ✓"},
  {id:406, d:3, segs:["It was raining","heavily, we decided","to stay indoors","and play board games."], correct:0,
    ex: "The comma after 'heavily' should be a semicolon: 'heavily; we decided...' Two complete sentences cannot be joined with just a comma. ✓"},
  {id:407, d:3, segs:["The team played","brilliantly, they","deserved to win","the tournament."], correct:0,
    ex: "The comma after 'brilliantly' should be a semicolon (or full stop): 'brilliantly; they deserved...' This is a comma splice — two complete sentences need more than a comma. ✓"},
  {id:408, d:3, segs:["The cake was","delicious; it had","three layers of","chocolate sponge."], correct:4,
    ex: "There is no error. The semicolon correctly joins two closely related sentences. ✓"},
  {id:409, d:3, segs:["The bus was late;","therefore, we missed","the start of","the performance."], correct:4,
    ex: "There is no error. The semicolon before 'therefore' and the comma after it are both correct. ✓"},
  {id:410, d:3, segs:["She was exhausted,","she had been","running for over","an hour."], correct:0,
    ex: "The comma should be a semicolon: 'exhausted; she had been...' Two complete sentences cannot be joined by a comma alone. ✓"},
  {id:411, d:3, segs:["The children played","outside; meanwhile,","the teachers prepared","the classroom."], correct:4,
    ex: "There is no error. The semicolon before 'meanwhile' correctly links two related sentences. ✓"},

  // ===== COLONS (+8) =====
  {id:412, d:3, segs:["You will need the","following, a pen","a ruler and","a calculator."], correct:1,
    ex: "The comma after 'following' should be a colon: 'the following: a pen, a ruler and a calculator.' A colon introduces a list when it follows a complete sentence. ✓"},
  {id:413, d:3, segs:["There was one rule","at camp: everyone","had to be back","before it got dark."], correct:4,
    ex: "There is no error. The colon correctly introduces an explanation of what the 'one rule' was. ✓"},
  {id:414, d:3, segs:["She had three","hobbies, swimming","painting and reading","adventure stories."], correct:0,
    ex: "A colon is needed after 'hobbies': 'three hobbies: swimming, painting and reading...' The colon introduces the list. ✓"},
  {id:415, d:3, segs:["The sign said:","\"Keep off the grass.\"","We decided to walk","on the path instead."], correct:4,
    ex: "There is no error. The colon correctly introduces what the sign said. ✓"},
  {id:416, d:3, segs:["For the trip you","will need, warm","clothes, waterproof","boots and a packed lunch."], correct:1,
    ex: "The comma after 'need' should be a colon: 'you will need: warm clothes...' A colon introduces a list after a complete introductory statement. ✓"},
  {id:417, d:3, segs:["The teacher","explained the task:","read the passage","carefully and answer."], correct:4,
    ex: "There is no error. The colon correctly introduces what the task involved. ✓"},
  {id:418, d:3, segs:["There are three","types of rock,","igneous, sedimentary","and metamorphic."], correct:1,
    ex: "The comma after 'rock' should be a colon: 'three types of rock: igneous...' A colon introduces the list of rock types. ✓"},
  {id:419, d:3, segs:["His reason was","simple: he wanted","to spend more time","with his family."], correct:4,
    ex: "There is no error. The colon correctly introduces the explanation of his reason. ✓"},

  // ===== BRACKETS/DASHES (+9) =====
  {id:420, d:3, segs:["Mount Snowdon (the","highest peak in Wales","attracts thousands of","visitors every year."], correct:1,
    ex: "The closing bracket is missing: 'Wales) attracts'. Brackets must come in pairs — if you open one, you must close it. ✓"},
  {id:421, d:3, segs:["The school (which","was built in 1965)","is being renovated","this summer."], correct:4,
    ex: "There is no error. The brackets correctly enclose extra information about when the school was built. ✓"},
  {id:422, d:3, segs:["The concert — which","lasted two hours —","was thoroughly enjoyed","by the audience."], correct:4,
    ex: "There is no error. The dashes correctly enclose extra information, just like brackets or commas would. ✓"},
  {id:423, d:3, segs:["The museum (open","daily from 9am to 5pm","is free for","children under twelve."], correct:1,
    ex: "The closing bracket is missing: '5pm) is free'. Always close your brackets! ✓"},
  {id:424, d:2, segs:["The trip costs","fifteen pounds (£15","and includes lunch","and all activities."], correct:1,
    ex: "The closing bracket is missing: '(£15) and includes'. Brackets must always come in pairs. ✓"},
  {id:425, d:3, segs:["The old oak tree","(which had stood for","centuries) was finally","cut down last week."], correct:4,
    ex: "There is no error. The brackets correctly enclose extra information about the tree. ✓"},
  {id:426, d:3, segs:["The headteacher —","a kind and patient","woman — always had","time for the children."], correct:4,
    ex: "There is no error. The dashes correctly enclose extra information describing the headteacher. ✓"},
  {id:427, d:2, segs:["The swimming pool","(which is 25 metres","long is available","for school bookings."], correct:1,
    ex: "The closing bracket is missing: 'long) is available'. ✓"},
  {id:428, d:3, segs:["The village shop —","the only one for","miles around — was","a lifeline for locals."], correct:4,
    ex: "There is no error. The dashes correctly enclose the extra information. ✓"},

  // ===== HYPHENS (+4) =====
  {id:429, d:3, segs:["The well known author","visited our school","to read from her","latest children's book."], correct:0,
    ex: "'well known' should be 'well-known' with a hyphen. When two words work together as a single describing word before a noun ('well-known author'), they need a hyphen. ✓"},
  {id:430, d:3, segs:["My nine year old","cousin won first","prize in the","painting competition."], correct:0,
    ex: "'nine year old' should be 'nine-year-old' with hyphens. When a phrase like this describes someone ('nine-year-old cousin'), it needs hyphens to show the words belong together. ✓"},
  {id:431, d:3, segs:["The brightly-coloured","butterfly landed on","the flower in","our school garden."], correct:4,
    ex: "There is no error. 'Brightly-coloured' is correctly hyphenated as a compound adjective describing the butterfly. ✓"},
  {id:432, d:3, segs:["The man eating shark","was spotted near","the coast of","Cornwall last summer."], correct:0,
    ex: "'man eating' should be 'man-eating' with a hyphen. Without the hyphen, it sounds like a man who is eating a shark! The hyphen shows that the shark eats men: a man-eating shark. ✓"},

  // ===== COMMA SPLICE (+1) =====
  {id:433, d:3, segs:["The garden was","overgrown, the lawn","needed mowing and","the hedges needed trimming."], correct:0,
    ex: "The comma after 'overgrown' creates a comma splice — two complete sentences joined by just a comma. It should be a semicolon or full stop: 'overgrown; the lawn...' or 'overgrown. The lawn...' ✓"},
];

// Read file and insert
let content = fs.readFileSync(filePath, 'utf8');

// Find punctuation section end
const punctStart = content.indexOf("punctuation: {");
const grammarStart = content.indexOf("grammar: {", punctStart);
const punctSection = content.substring(punctStart, grammarStart);
const questionsStart = punctSection.indexOf("questions: [");
let depth = 0, arrayEnd = -1;
for (let i = punctSection.indexOf("[", questionsStart); i < punctSection.length; i++) {
  if (punctSection[i] === '[') depth++;
  if (punctSection[i] === ']') depth--;
  if (depth === 0) { arrayEnd = i; break; }
}

const insertPoint = punctStart + arrayEnd;

// Also fix Q16: D2→D1
const q16Pattern = /"id": 16,\s*\n\s*"difficulty": 2/;
const punctSectionFixed = punctSection.replace(q16Pattern, '"id": 16,\n          "difficulty": 1');
if (punctSectionFixed !== punctSection) {
  content = content.substring(0, punctStart) + punctSectionFixed + content.substring(grammarStart);
  console.log('Fixed Q16: D2→D1');
  // Recalculate insert point
  const newPunctSection = content.substring(punctStart, content.indexOf("grammar: {", punctStart));
  const newQStart = newPunctSection.indexOf("questions: [");
  depth = 0; arrayEnd = -1;
  for (let i = newPunctSection.indexOf("[", newQStart); i < newPunctSection.length; i++) {
    if (newPunctSection[i] === '[') depth++;
    if (newPunctSection[i] === ']') depth--;
    if (depth === 0) { arrayEnd = i; break; }
  }
}

const finalInsertPoint = punctStart + arrayEnd;

// Format questions
const formatted = newQs.map(q => {
  const segs = q.segs.map(s => '"' + s.replace(/"/g, '\\"') + '"').join(',');
  const ex = q.ex.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `        {
          "id": ${q.id},
          "difficulty": ${q.d},
          "questionType": "error-spotting",
          "question": "Which section contains a punctuation error?",
          "segments": [${segs}],
          "options": ["Section A","Section B","Section C","Section D","No mistake"],
          "correct": ${q.correct},
          "explanation": "${ex}"
        }`;
}).join(',\n');

const newContent = content.substring(0, finalInsertPoint) + ',\n' + formatted + '\n      ' + content.substring(finalInsertPoint);
fs.writeFileSync(filePath, newContent, 'utf8');

// Verify
delete require.cache[require.resolve('../src/questionData/englishData.js')];
const m2 = require('../src/questionData/englishData.js');
const qs2 = (m2.default || m2).topics.punctuation.questions;
const dd = {1:0, 2:0, 3:0};
for (const q of qs2) dd[q.difficulty]++;

console.log(`Added ${newQs.length} new punctuation questions (Q331-Q433)`);
console.log(`Total: ${qs2.length}`);
console.log(`D1:${dd[1]}(${Math.round(dd[1]/qs2.length*100)}%) D2:${dd[2]}(${Math.round(dd[2]/qs2.length*100)}%) D3:${dd[3]}(${Math.round(dd[3]/qs2.length*100)}%)`);
