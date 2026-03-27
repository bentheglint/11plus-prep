# Teaching Methods Research for 11+ Micro-Lessons

## Purpose
This document compiles evidence-based research on effective teaching and learning methods for primary school maths, specifically targeting 9-10 year old children. It is intended to directly inform the design of micro-lesson templates (1-2 minutes, 3-4 screens) within a digital 11+ exam preparation app.

All findings reference named researchers, specific frameworks, or established methodologies from cognitive science, educational psychology, and mathematics education research.

---

## Table of Contents
1. [Cognitive Science of How Children Learn Maths](#1-cognitive-science-of-how-children-learn-maths)
2. [Effective Primary Maths Teaching Strategies](#2-effective-primary-maths-teaching-strategies)
3. [Micro-Learning Research](#3-micro-learning-research)
4. [Visual and Concrete Approaches to Maths](#4-visual-and-concrete-approaches-to-maths)
5. [Engagement and Motivation in Children's Digital Learning](#5-engagement-and-motivation-in-childrens-digital-learning)
6. [Interactive Learning vs Passive Reading](#6-interactive-learning-vs-passive-reading)
7. [Language and Communication](#7-language-and-communication)
8. [Specific Strategies for Key 11+ Maths Topics](#8-specific-strategies-for-key-11-maths-topics)
9. [Synthesis: Design Principles for Micro-Lessons](#9-synthesis-design-principles-for-micro-lessons)

---

## 1. Cognitive Science of How Children Learn Maths

### 1.1 Working Memory Limitations

**Key research:** Baddeley & Hitch (1974); Sweller's Cognitive Load Theory (1988, 1994); Cowan (2001); Gathercole & Alloway (2008).

Children aged 9-10 have significantly less working memory capacity than adults. The critical findings:

- **Working memory capacity:** Children at this age can hold roughly **4 items** in working memory simultaneously (Cowan, 2001), compared to 4-7 for adults. This is a hard constraint on lesson design.
- **Cognitive Load Theory (Sweller):** Learning fails when cognitive load exceeds working memory capacity. Sweller identifies three types:
  - **Intrinsic load** — the inherent complexity of the material (e.g., long division has high intrinsic load because it requires multiple steps)
  - **Extraneous load** — caused by poor instructional design (confusing layout, irrelevant information, split-attention effect)
  - **Germane load** — the productive effort of building schemas and mental models
- **Split-attention effect (Sweller & Chandler, 1992):** When learners must mentally integrate information from separate sources (e.g., a diagram on one page and text on another), learning suffers. Text and visuals should be physically integrated.
- **Redundancy effect:** Presenting the same information in multiple redundant forms (e.g., reading aloud text that is also displayed on screen) can actually harm learning by consuming working memory unnecessarily.
- **Gathercole & Alloway (2008):** Working memory is the strongest predictor of academic achievement in children, more so than IQ. Children with lower working memory struggle particularly with multi-step maths problems.

**Practical takeaways for micro-lessons:**
- Present no more than **2-3 new pieces of information per screen**
- Integrate text and visuals in a single display (no flipping between screens to connect information)
- Remove all extraneous decoration, text, or visual clutter
- Break multi-step procedures into small chunks, each practised before combining
- Use worked examples to reduce cognitive load (see Section 6)

### 1.2 Concrete-Representational-Abstract (CRA) Progression

**Key research:** Bruner (1966) — Enactive, Iconic, Symbolic modes; Witzel, Mercer & Miller (2003); Flores (2010); EEF Guidance Report on Maths KS2-3 (2017).

The CRA framework (also called the Concrete-Pictorial-Abstract or CPA framework in Singapore Maths) is one of the most robustly supported approaches in maths education:

- **Concrete (Enactive):** Physical manipulation of objects — counters, Dienes blocks, fraction strips, measuring tools. The child physically handles the maths.
- **Representational/Pictorial (Iconic):** Visual representations — drawings, diagrams, bar models, number lines. The child sees the maths.
- **Abstract (Symbolic):** Numbers and symbols — equations, algorithms, formal notation. The child works with the maths symbolically.

**Critical finding:** Witzel, Mercer & Miller (2003) found that students taught using the CRA sequence significantly outperformed those taught with abstract methods alone, with effect sizes of d = 0.50-0.97 depending on the topic.

**Bruner's three modes of representation:**
- **Enactive** — learning through action (manipulating objects)
- **Iconic** — learning through images (diagrams, pictures)
- **Symbolic** — learning through symbols (numbers, letters, equations)

Bruner argued children must progress through these in order, and that jumping to symbolic too early creates fragile, procedural knowledge without understanding.

**Implications for a digital app:**
- We cannot provide physical manipulatives, but we can provide the **iconic/pictorial** stage richly
- Every abstract concept should be accompanied by a visual representation
- Micro-lessons should start with a visual/pictorial representation, then connect it to the abstract
- The "concrete" stage can be partially simulated through **interactive visual manipulatives** (dragging, tapping to add/remove) or through real-world contextual scenarios that ground the maths in tangible situations

### 1.3 Schema Theory and Knowledge Organisation

**Key research:** Piaget (1936, 1952); Chi, Feltovich & Glaser (1981); Sweller (1988).

- **Schemas** are organised networks of knowledge stored in long-term memory. Expert mathematicians have rich, interconnected schemas; novices have fragmented, isolated pieces of knowledge.
- **Schema acquisition** is the primary goal of learning. Once a schema is formed, it can be retrieved from long-term memory as a single unit, dramatically reducing working memory load.
- Children at 9-10 are in Piaget's **Concrete Operational Stage** (roughly ages 7-11): they can think logically about concrete events but struggle with abstract/hypothetical reasoning. This reinforces the need for concrete and visual grounding.
- **Chunking:** As schemas develop, children can "chunk" related information into single units (e.g., knowing that 7 x 8 = 56 becomes a single retrieval rather than a calculation), freeing working memory for higher-level problem solving.

**Practical takeaways:**
- Build new knowledge by connecting to existing schemas ("You already know that multiplication is repeated addition. Now let's see how that helps with area...")
- Help children see connections between topics (fractions, decimals, and percentages are the same concept in different forms)
- Ensure foundational facts are automated (times tables, number bonds) so they don't consume working memory during complex problem solving

### 1.4 Developmental Considerations for 9-10 Year Olds

**Key research:** Piaget (1952); Siegler (2006); National Curriculum expectations.

At age 9-10, children typically:
- Can reason logically about concrete situations but not purely abstract ones
- Are developing **proportional reasoning** but it is not yet reliable (critical for ratio, fractions, percentages)
- Can understand **reversibility** (if 3 + 4 = 7, then 7 - 4 = 3) but may not apply it spontaneously
- Are beginning to understand **conservation** of number, area, and volume but can be tripped up by visual transformations
- Have improving but still limited **metacognitive skills** — they struggle to judge what they do and don't understand
- Benefit enormously from **multiple representations** of the same concept
- Are capable of self-explanation but need prompting to do it

---

## 2. Effective Primary Maths Teaching Strategies

### 2.1 Rosenshine's Principles of Instruction

**Source:** Barak Rosenshine (2012), "Principles of Instruction: Research-Based Strategies That All Teachers Should Know," *American Educator*.

Rosenshine synthesised decades of cognitive science and classroom research into 10 principles. The most relevant for micro-lesson design:

1. **Begin with a short review of previous learning** — daily review strengthens recall and automaticity. Spending 5-8 minutes reviewing previous material was a hallmark of the most effective teachers.
2. **Present new material in small steps with student practice after each step** — the limited capacity of working memory means we should not overload students. Small steps + immediate practice is key.
3. **Ask a large number of questions and check responses** — effective teachers ask many questions, both to check understanding and to promote active processing.
4. **Provide models and worked examples** — showing step-by-step solutions helps students build schemas. Gradually reduce the scaffolding (fading).
5. **Guide student practice** — provide scaffolded practice with feedback before independent practice. High success rates (80%+) during practice build confidence and correct understanding.
6. **Check for student understanding frequently** — don't wait until the end. Embed checks throughout.
7. **Obtain a high success rate** — students should get roughly 80% correct during practice. If they're getting less, the material is too hard or the instruction was insufficient.
8. **Provide scaffolds for difficult tasks** — then gradually remove them.

**For micro-lessons:** Each lesson should open with a brief connection to prior knowledge (principle 1), introduce one small new idea with a worked example (principles 2 and 4), include a check/interaction (principles 3 and 6), and give a practice opportunity (principle 5).

### 2.2 Singapore Maths and the Mastery Approach

**Key research:** Kaur (2019); Jerrim & Vignoles (2016); NCETM Mastery resources; EEF evaluation of Maths Mastery programme (2015).

Singapore Maths, consistently producing top PISA results, is built on:

- **CPA (Concrete-Pictorial-Abstract) approach** — the same CRA sequence above, but Singapore places particular emphasis on the pictorial/bar model stage
- **Bar modelling** — a visual heuristic for representing problems. A rectangular bar represents a quantity; it can be split, compared, or grouped. Research shows bar models help children:
  - Understand part-whole relationships
  - Visualise comparison problems
  - Bridge from concrete to abstract
  - Solve multi-step word problems by making the structure visible
- **Mastery for all** — the belief that all children can achieve, with differentiation through depth rather than acceleration. Children who grasp a concept quickly explore it more deeply rather than racing ahead.
- **Variation theory (Gu, Huang & Marton, 2004; Watson & Mason, 2006):** Carefully varying one element at a time helps children notice what matters. Two types:
  - **Conceptual variation** — showing the same concept in different representations (a fraction as a pie chart, a bar model, a number line, a decimal)
  - **Procedural variation** — keeping the structure the same but changing the numbers, or keeping the numbers the same but changing the structure

**EEF evaluation (2015):** The Maths Mastery programme showed +1 month's additional progress in Year 1 (small but positive). The research noted that the visual and structured approach was particularly beneficial for lower-attaining pupils.

**For micro-lessons:** Use bar models as a consistent visual language across topics (fractions, ratio, percentages, word problems). Apply variation by showing the same concept in 2-3 different representations within a single micro-lesson.

### 2.3 EEF Recommendations for KS2-3 Maths

**Source:** Education Endowment Foundation, "Improving Mathematics in Key Stages 2 and 3" (2017). Eight recommendations based on extensive evidence review:

1. **Use assessment to build on pupils' existing knowledge and understanding** — identify what children already know and build from there
2. **Use manipulatives and representations** — to expose mathematical structure, with the aim of eventually working without them
3. **Teach pupils strategies for solving problems** — not just procedures, but when and why to use them
4. **Enable pupils to develop a rich network of mathematical knowledge** — connect concepts together
5. **Develop pupils' independence and motivation** — encourage mathematical reasoning and self-regulation
6. **Use tasks and resources to challenge and support pupils' mathematics** — carefully calibrate difficulty
7. **Use structured interventions to provide additional support** — targeted help for those who need it
8. **Support pupils to make a successful transition between primary and secondary school**

**Recommendation 2 is particularly well-evidenced.** The report emphasises that representations should be used purposefully, with explicit connections made between the representation and the underlying maths. Simply showing a picture is not enough — the teacher must draw out the mathematical meaning.

### 2.4 Scaffolding and the Zone of Proximal Development

**Key research:** Vygotsky (1978); Wood, Bruner & Ross (1976).

- **Zone of Proximal Development (ZPD):** The gap between what a child can do independently and what they can do with support. Learning happens most effectively in this zone.
- **Scaffolding (Wood, Bruner & Ross, 1976):** Temporary support structures that help a child accomplish a task they couldn't do alone. Key features:
  - Reduces degrees of freedom (narrows the task)
  - Maintains direction (keeps the child focused on the goal)
  - Marks critical features (highlights what matters)
  - Controls frustration
  - Demonstrates solutions
- **Fading:** Scaffolds should be gradually removed as competence grows. This is the principle behind worked examples that progressively leave more steps for the student to complete.

**For micro-lessons:** Start with fully worked examples, then present partially-completed examples (with one step missing for the child to fill in), then present problems for independent solving. This is the **completion effect** (van Merriënboer, 1990).

### 2.5 Explicit Instruction vs Discovery Learning

**Key research:** Kirschner, Sweller & Clark (2006), "Why Minimal Guidance During Instruction Does Not Work"; Alfieri et al. (2011) meta-analysis.

- For novice learners (which children at this stage are, for most 11+ topics), **explicit, guided instruction significantly outperforms discovery-based or minimally-guided approaches**
- Kirschner et al. argue that discovery learning overloads working memory because the student must simultaneously discover the principle AND learn it
- **However:** Alfieri et al.'s meta-analysis found that *guided* discovery (with prompts, hints, and feedback) outperforms both pure discovery and pure explicit instruction
- The sweet spot is: **explicit instruction for initial learning, with structured opportunities for the child to make connections and generate understanding** (not pure telling, not pure discovery)

**For micro-lessons:** Use explicit worked examples first, then guided practice with hints available, rather than asking children to discover patterns without support.

---

## 3. Micro-Learning Research

### 3.1 Optimal Length and Chunking

**Key research:** Kapp & Defelice (2019); Jahnke et al. (2020); Giurgiu (2017); Hug (2005).

- **Micro-learning** is defined as learning in small, focused units typically lasting 2-10 minutes
- Research consistently finds that **shorter is better for retention** when the content is well-designed and focused on a single learning objective
- Kapp & Defelice (2019) distinguish between micro-learning (short content for a specific outcome) and "micro-content" (just short content without pedagogical design) — the design matters more than the length
- **Optimal length for children:** No precise figure, but research on children's attention spans suggests **1-3 minutes of focused instructional content** is appropriate for 9-10 year olds in a digital context
- **One concept per micro-lesson** is the consistent recommendation — trying to teach two concepts in a micro-lesson defeats the purpose

### 3.2 Spacing Effect

**Key research:** Ebbinghaus (1885); Cepeda et al. (2006); Rohrer & Taylor (2007); Dunlosky et al. (2013).

The spacing effect is one of the most robust findings in all of learning science:

- **Distributed practice** (spacing study sessions out over time) produces dramatically better long-term retention than **massed practice** (cramming)
- **Cepeda et al. (2006)** meta-analysis of 254 studies: spacing produced an average effect size of d = 0.67, a large and consistent effect
- **Optimal spacing interval:** For material that needs to be retained for weeks to months, study sessions should be spaced **days to weeks apart**, not hours
- **Expanding retrieval practice:** Start with short intervals (1 day), then gradually increase (3 days, 1 week, 2 weeks). This is the principle behind spaced repetition systems like Anki

**For the app:** Rather than teaching a topic in a block and moving on, the app should **revisit topics at expanding intervals**. A child who studied fractions today should see a fraction micro-lesson again in 2-3 days, then a week later, etc.

### 3.3 Interleaving vs Blocked Practice

**Key research:** Rohrer & Taylor (2007); Taylor & Rohrer (2010); Rohrer, Dedrick & Stershic (2015); Pan et al. (2019).

- **Blocked practice:** Doing many problems of the same type in a row (e.g., 20 fraction addition problems). Children feel more confident but learn less.
- **Interleaving:** Mixing different problem types in a single practice session (e.g., a fraction problem, then a percentage problem, then a ratio problem). Children feel less confident but learn significantly more.
- **Rohrer, Dedrick & Stershic (2015):** In a study with 7th graders learning maths, interleaved practice produced 72% correct on a delayed test vs 38% for blocked practice — a massive difference.
- **Why it works:** Interleaving forces children to **discriminate between problem types** (deciding which strategy to use), which is exactly what exams require. Blocked practice removes this discrimination step because children know every problem uses the same method.
- **Caveat:** Interleaving should come **after** initial learning. It is a practice strategy, not an initial instruction strategy. Teach the concept first with blocked practice, then interleave in later reviews.

**For the app:** The "Daily Challenge" mode should interleave topics. The "Focused Learning" mode can use blocked practice for initial learning, but review sessions should mix topics.

### 3.4 Retrieval Practice (Testing Effect)

**Key research:** Roediger & Karpicke (2006); Dunlosky et al. (2013); Agarwal et al. (2012); Agarwal & Bain (2019, *Powerful Teaching*).

- **The testing effect:** The act of retrieving information from memory strengthens that memory far more than re-reading or re-studying the information
- **Roediger & Karpicke (2006):** Students who practised retrieval remembered 80% after one week, vs 36% for those who re-studied
- **Low-stakes is key:** Retrieval practice works best when it is **low-stakes** (no grades, no punishment for errors). The act of trying to retrieve is what matters, even if the retrieval fails — as long as feedback is provided
- **Feedback after retrieval:** Providing the correct answer after a retrieval attempt significantly enhances the benefit. Immediate feedback is better than delayed for children
- **Agarwal et al. (2012):** Even very young children (8-9 year olds) benefit substantially from retrieval practice in real classroom settings

**For micro-lessons:** Every micro-lesson should include at least one retrieval opportunity (a question the child must answer before being shown the answer). This is not assessment — it is a learning activity.

### 3.5 The Forgetting Curve and Overlearning

**Key research:** Ebbinghaus (1885); Rohrer et al. (2005).

- **Ebbinghaus's forgetting curve:** Without review, roughly 70% of new information is forgotten within 24 hours
- **Overlearning:** Continuing to practise after mastery has been achieved. Has diminishing returns — moderate overlearning is beneficial, but excessive repetition of already-mastered material is inefficient
- **The implication:** The first review should happen within 24 hours of initial learning, with subsequent reviews at expanding intervals

---

## 4. Visual and Concrete Approaches to Maths

### 4.1 Dual Coding Theory

**Key research:** Paivio (1971, 1986); Clark & Paivio (1991); Mayer's Cognitive Theory of Multimedia Learning (2001, 2009).

- **Dual coding theory (Paivio):** The brain processes verbal and visual information through **separate channels**. When information is encoded both verbally and visually, it creates two retrieval pathways, significantly improving recall
- **Mayer's multimedia principles (2001):** People learn better from words and pictures together than from words alone. Key principles:
  - **Multimedia principle:** Use both words and graphics, not just words
  - **Contiguity principle:** Place words and corresponding graphics near each other (both spatially and temporally)
  - **Coherence principle:** Exclude extraneous material (decorative images, irrelevant stories)
  - **Signalling principle:** Highlight essential information (use colour, arrows, emphasis)
  - **Segmenting principle:** Break complex lessons into learner-paced segments
- **Effect sizes:** Mayer's research consistently shows d = 0.4-1.0 for multimedia instruction over text-only instruction

**For micro-lessons:** Every screen should combine words AND a visual representation. The visual should be directly relevant (not decorative), and text should be placed close to the part of the visual it refers to.

### 4.2 Bar Models

**Key research:** Kho Tek Hong (1980s, Singapore MOE); Ng & Lee (2009); Kaur (2019).

The bar model (also called the model method) was developed in Singapore in the 1980s and is now central to Singapore's world-leading maths education:

- **Part-whole model:** A single bar divided into sections, showing how parts combine to make a whole. Used for addition/subtraction, fractions, percentages.
- **Comparison model:** Two bars side by side, showing the relationship between two quantities. Used for ratio, difference problems, multiplicative comparison.

**Research evidence:**
- Ng & Lee (2009) found that children trained in bar modelling significantly outperformed control groups on word problem solving
- Bar models make the **mathematical structure visible**, reducing the need for children to hold the problem structure in working memory
- Particularly effective for: fractions (showing parts of a whole), ratio (showing proportional relationships), percentages (showing parts of 100), multi-step word problems

**For micro-lessons:** Bar models should be a consistent visual language throughout. The child should learn to "read" bar models as naturally as reading number sentences.

### 4.3 Number Lines

**Key research:** Siegler & Booth (2004); Siegler & Ramani (2009); Booth & Siegler (2008).

- **Number line estimation** is strongly correlated with overall maths achievement
- Children's mental number line shifts from **logarithmic** (compressed at the high end) to **linear** between ages 7-11
- **Siegler & Ramani (2009):** Playing linear number line games for just 1 hour improved low-income preschoolers' numerical understanding significantly
- Number lines are especially effective for: negative numbers, decimals, fractions, rounding, sequences

**For micro-lessons:** Use number lines for any topic involving magnitude, ordering, or position (negative numbers, decimals, fractions, rounding, sequences).

### 4.4 Area Models and Arrays

**Key research:** Young-Loveridge & Mills (2009); Barmby et al. (2009).

- **Area models** make multiplication visual by representing it as the area of a rectangle
- Particularly powerful for: long multiplication (grid method), fractions of amounts, algebraic expressions (expanding brackets)
- **Arrays** (rows and columns of dots/objects) help children see the commutative property of multiplication and build towards area models

### 4.5 Manipulatives in Digital Contexts

**Key research:** Moyer-Packenham & Westenskow (2013) meta-analysis; Carbonneau, Marley & Selig (2013).

- **Moyer-Packenham & Westenskow (2013):** Meta-analysis of 66 studies found virtual manipulatives produced moderate-to-large effects on learning (d = 0.35-0.69), comparable to physical manipulatives
- **Key finding:** Virtual manipulatives are most effective when they are **interactive** (the child manipulates them) rather than passive (just watching an animation)
- **Focused constraint:** Virtual manipulatives can actually be more effective than physical ones because they can **constrain** the child's actions to mathematically relevant moves, reducing extraneous cognitive load

**For micro-lessons:** Where possible, include interactive elements (tapping to split a bar, dragging to rearrange, tapping to count). Even simple interactivity (tap to reveal the next step) keeps the child engaged and gives them a sense of agency.

---

## 5. Engagement and Motivation in Children's Digital Learning

### 5.1 Self-Determination Theory (SDT)

**Key research:** Deci & Ryan (1985, 2000); Ryan & Deci (2000).

SDT identifies three innate psychological needs that drive motivation:

1. **Autonomy** — the need to feel in control of one's actions. Children are more motivated when they have choices (which topic to study, which challenge to try).
2. **Competence** — the need to feel capable and effective. Success builds motivation; repeated failure destroys it. This is why Rosenshine's 80% success rate matters.
3. **Relatedness** — the need to feel connected to others. In a solo app context, this can be provided through characters, narrative, or the sense that someone (the AI tutor, a mascot) is "with" them.

**For the app:**
- Provide choices (topic selection, difficulty level)
- Calibrate difficulty so children succeed ~80% of the time
- Use a consistent, warm, encouraging voice/character

### 5.2 Curiosity Gaps and Information Gap Theory

**Key research:** Loewenstein (1994); Gruber, Gelman & Ranganath (2014).

- **Information Gap Theory (Loewenstein, 1994):** Curiosity arises when there is a gap between what we know and what we want to know. This gap creates a feeling of deprivation that motivates information-seeking.
- **Gruber et al. (2014):** When curiosity is triggered, the brain's reward system activates (dopamine release), and this state enhances learning of even incidental information presented during the curious state.

**Practical application for micro-lessons:**
- Open with a **puzzle, surprising fact, or question** that creates a curiosity gap
  - "A pizza company made a mistake and cut a pizza into 7 slices instead of 8. If you eat 3 slices, have you eaten more or less than half?"
  - "In 2012, Usain Bolt ran 100m in 9.63 seconds. How far did he run every second?"
  - "A shop accidentally put the wrong price tag on a toy. It said £4.50 instead of £5.00. What percentage discount did customers accidentally get?"
- **Don't reveal the answer immediately** — let the question hang for a moment
- Then teach the concept needed to answer it, and return to the opening question

### 5.3 Storytelling and Context in Maths

**Key research:** Willingham (2004, 2009); Bruner (1991); Egan (1986, 2005).

- **Willingham (2009, *Why Don't Students Like School?*):** The human mind is naturally story-oriented. We remember information better when it's embedded in a narrative structure.
- **Egan (1986, *Teaching as Story Telling*):** Primary-aged children engage powerfully with stories involving **binary opposites** (big/small, rich/poor, fast/slow), **mystery**, and **human emotion**
- **Context matters enormously:** "Calculate 3/5 of 40" is abstract. "Maya has 40 stickers and gives 3/5 of them to her best friend. How many does she give away?" is contextual. The contextual version activates more neural pathways and is more memorable.

**For micro-lessons:**
- Always embed maths in a real-world context with characters and situations
- Use British contexts: pounds sterling, UK place names, school scenarios, British sports
- Create recurring characters that children recognise and care about
- Frame problems as mini-stories with a beginning (situation), middle (challenge), and end (solution)

### 5.4 Gamification: What Works and What Doesn't

**Key research:** Hamari, Koivisto & Sarsa (2014); Deterding et al. (2011); Hanus & Fox (2015); Plass, Homer & Kinzer (2015).

**What the research actually shows:**

- **Points, badges, and leaderboards (PBL):** The most common gamification elements are the **least effective** for learning. Hanus & Fox (2015) found that PBL can actually *decrease* intrinsic motivation over time by shifting focus to extrinsic rewards.
- **What DOES work:**
  - **Challenge and mastery:** Progressively harder challenges with clear feedback on improvement (not just scores, but visible skill growth)
  - **Narrative/theme:** A story world that provides context and purpose (the existing space theme is good)
  - **Autonomy:** Meaningful choices that affect the experience
  - **Immediate, specific feedback:** Not just "correct/incorrect" but "You got this right because you correctly found 3/5 of 40 by dividing by 5 first"
  - **Progress visualisation:** Showing children how far they've come (not just scores, but skills unlocked, topics mastered)
  - **Low-stakes failure:** Making it safe to fail and try again. "Not quite — here's what happened" rather than a harsh buzzer sound.

**For the app:** The existing badge system (Jedi Master, Space Captain, etc.) is fine as a light motivational layer, but the primary motivation should come from curiosity, competence, and narrative — not from collecting badges.

### 5.5 Flow Theory

**Key research:** Csikszentmihalyi (1990); Kiili (2005).

- **Flow** is the state of complete absorption in an activity. It occurs when:
  - The challenge level matches the skill level (not too easy, not too hard)
  - There are clear goals
  - There is immediate feedback
  - The person has a sense of control
- If the task is too easy: boredom. If too hard: anxiety. The "flow channel" is the sweet spot between them.
- **For adaptive difficulty:** The app's difficulty system (levels 1/2/3) should be used to keep each child in their flow channel. After consecutive correct answers, increase difficulty. After errors, provide support and possibly decrease difficulty.

---

## 6. Interactive Learning vs Passive Reading

### 6.1 The Testing Effect (Retrieval Practice)

(See Section 3.4 for full details)

The core finding: **answering questions about material produces better learning than re-reading material**, even when the initial retrieval attempt fails (provided feedback is given).

### 6.2 The Generation Effect

**Key research:** Slamecka & Graf (1978); Bertsch et al. (2007); Foos, Mora & Tkacz (1994).

- **The generation effect:** Information that is **generated** by the learner (rather than simply read) is better remembered
- Example: "What is 3/5 as a percentage? ___%" produces better learning than "3/5 as a percentage is 60%"
- Even partial generation helps: "3/5 as a percentage is __0%" (fill in the blank) is better than reading the complete answer
- **Self-explanation effect (Chi et al., 1989):** Students who explain worked examples to themselves learn far more than those who simply read them

**For micro-lessons:**
- Ask children to **predict** before revealing ("What do you think the answer will be?")
- Use **fill-in-the-blank** steps in worked examples
- Prompt **self-explanation** ("Why do you think we divided by 5 first?")

### 6.3 Desirable Difficulties

**Key research:** Bjork (1994); Bjork & Bjork (2011).

Robert Bjork's concept of "desirable difficulties" identifies conditions that make learning feel harder but actually produce better long-term retention:

1. **Spacing** (vs massing) — feels less productive but works better
2. **Interleaving** (vs blocking) — feels more confusing but works better
3. **Testing** (vs re-reading) — feels less fluent but works better
4. **Varying practice conditions** — feels less comfortable but works better
5. **Reducing feedback frequency over time** — feels less supportive but promotes independence

**Critical caveat:** Difficulties are only "desirable" if the learner has the prerequisite knowledge to engage with them. For a child who hasn't yet understood fractions, interleaving fractions with decimals is not a desirable difficulty — it's just overwhelming.

### 6.4 Productive Struggle

**Key research:** Hiebert & Grouws (2007); Kapur (2008, 2014 — "Productive Failure").

- **Productive struggle** means allowing children to wrestle with a problem before being shown the solution. This builds deeper understanding than simply demonstrating the solution first.
- **Kapur's Productive Failure (2008, 2014):** Students who attempted to solve complex problems before instruction (and failed) subsequently learned more deeply from the instruction than students who received instruction first.
- **Key conditions:**
  - The problem must be within reach (just above current ability)
  - The child must not be left struggling for too long (frustration is counterproductive)
  - Clear instruction must follow the struggle (the struggle creates "readiness to learn")
  - The environment must feel safe (failure is explicitly normalised)

**For micro-lessons:** Consider occasionally presenting a **challenge question first** (before teaching), letting the child attempt it, then teaching the concept. "Let's try this one first — don't worry if you're not sure." Then: "Here's the trick to solving problems like this..."

---

## 7. Language and Communication

### 7.1 Mathematical Language Development

**Key research:** Vygotsky (1962); Sfard (2001); EEF guidance; National Curriculum emphasis on mathematical vocabulary.

- **Vocabulary is a gatekeeper:** Children who don't understand the mathematical vocabulary cannot access the maths. Words like "product," "factor," "denominator," "perpendicular," "consecutive" must be explicitly taught.
- **Sfard (2001):** Mathematical thinking IS mathematical communication. Learning maths is learning to participate in mathematical discourse.
- **The National Curriculum** explicitly requires that children "use the correct mathematical vocabulary" at KS2.

**For micro-lessons:**
- **Introduce and define** key vocabulary at point of use, not in advance
- Use **bold or colour** to highlight new mathematical terms
- Provide the **everyday meaning alongside the mathematical meaning** ("A 'product' in maths isn't something you buy — it's the answer when you multiply two numbers together")
- Repeat key vocabulary across multiple lessons

### 7.2 Conversational vs Formal Tone

**Key research:** Mayer's personalisation principle (2004); Moreno & Mayer (2000, 2004).

- **Personalisation principle (Mayer):** Using a conversational, second-person style ("you") produces significantly better learning than a formal, third-person style. Effect sizes of d = 0.30-0.79 across multiple studies.
- **Moreno & Mayer (2000):** Students learned more deeply from a multimedia lesson when the words were in conversational style vs formal style, even when the content was identical.
- **Why it works:** Conversational language activates social responses — the learner unconsciously treats the interaction as a conversation with another person, which increases engagement and cognitive effort.

**For micro-lessons:**
- Use "you" and "we" throughout: "Let's figure this out together" not "The student should calculate"
- Use direct, friendly language: "Nice work!" not "The answer is correct"
- Keep sentences short — average 10-15 words
- Use questions to maintain dialogue: "Can you see what happened there?"

### 7.3 Worked Examples with Self-Explanation

**Key research:** Sweller & Cooper (1985); Atkinson et al. (2000); Chi et al. (1989); Renkl (1997, 2002).

Worked examples are one of the most effective instructional tools for novice learners:

- **Worked example effect (Sweller):** Studying worked examples produces better learning and transfer than solving equivalent problems, because worked examples reduce extraneous cognitive load.
- **Self-explanation effect (Chi et al., 1989):** Students who explain each step of a worked example to themselves learn far more. The key is generating explanations, not just reading them.
- **Renkl's model (2002):** Effective worked example study involves:
  1. Reading the step
  2. Explaining WHY the step was taken (not just WHAT was done)
  3. Connecting to known principles
  4. Anticipating the next step

**Best practice for worked examples in micro-lessons:**

```
Step-by-step worked example format:

PROBLEM: "A shop reduces the price of a £40 jacket by 15%. What is the sale price?"

STEP 1: "First, let's find 10% of £40."
         -> WHY: "Finding 10% is easy — just divide by 10"
         -> £40 / 10 = £4

STEP 2: "Now let's find 5% of £40."
         -> WHY: "5% is half of 10%"
         -> £4 / 2 = £2

STEP 3: "Add them to get 15%."
         -> WHY: "10% + 5% = 15%"
         -> £4 + £2 = £6

STEP 4: "Subtract from the original price."
         -> WHY: "It's a reduction, so we take the discount off"
         -> £40 - £6 = £34

ANSWER: "The sale price is £34"
```

- **Faded worked examples (Renkl & Atkinson, 2003):** Gradually remove steps from worked examples, asking the child to complete them:
  - First example: all steps shown
  - Second example: last step missing (child completes it)
  - Third example: last two steps missing
  - Fourth: full problem for independent solving

### 7.4 Dual Coding in Explanations

**Key research:** Paivio (1971); Clark & Mayer (2016); Caviglioli (2019, *Dual Coding with Teachers*).

- Present **words and images together** for every concept
- The image should be directly relevant and referenced by the text
- Avoid purely decorative images (they add cognitive load without learning benefit)
- Use **annotations** on diagrams (arrows, labels, colour-coding) to direct attention

**Example of good dual coding:**
> "To find the area of this shape, we split it into two rectangles."
> [Diagram showing an L-shape with a dotted line splitting it, rectangles labelled A and B with dimensions]
> "Rectangle A is 5cm x 3cm = 15cm². Rectangle B is 4cm x 2cm = 8cm²."
> "Total area = 15 + 8 = 23cm²"

The text and the diagram work together — neither makes full sense without the other.

---

## 8. Specific Strategies for Key 11+ Maths Topics

### 8.1 Fractions

**Key research:** Lamon (2012); Siegler et al. (2013); EEF; NCETM.

**Common misconceptions:**
- Treating numerator and denominator as separate whole numbers (e.g., 1/3 + 1/4 = 2/7)
- Believing a larger denominator means a larger fraction (1/8 > 1/5 because 8 > 5)
- Not understanding that fractions represent a single number/point on the number line

**Evidence-based strategies:**
- **Area models** (circles, rectangles) for initial understanding, then transition to **bar models** and **number lines**
- **Comparison tasks:** Which is bigger, 3/5 or 2/3? Force children to reason about fraction magnitude
- **Equivalent fraction strips:** Visual strips showing that 1/2 = 2/4 = 3/6 = 4/8
- **Fraction-as-division understanding:** Explicitly teach that 3/4 means 3 divided by 4. Use fair-sharing contexts: "Share 3 pizzas equally among 4 people"
- **Siegler et al. (2013) — IES Practice Guide:** Recommends building fraction understanding on the **number line** as a central representation, because it emphasises that fractions are numbers with magnitude

### 8.2 Decimals

**Key research:** Steinle & Stacey (2004); Resnick et al. (1989).

**Common misconceptions:**
- "Longer is larger" — believing 0.36 > 0.4 because 36 > 4
- "Shorter is larger" — believing 0.4 > 0.36 because tenths are bigger than hundredths (partial understanding gone wrong)
- Not connecting decimals to fractions (0.75 = 75/100 = 3/4)

**Evidence-based strategies:**
- **Place value charts** with explicit column labelling (ones, tenths, hundredths, thousandths)
- **Number lines** with zooming in: 0 to 1, then 0.3 to 0.4, then 0.35 to 0.36
- **Money as a concrete model:** £1.50 is naturally understood; connect this to 1.50 as a number
- **Explicit fraction-decimal connection:** Show 1/4 and 0.25 as the same point on a number line
- **Comparison tasks with different decimal lengths:** Which is bigger, 0.4 or 0.36? Require children to align place values

### 8.3 Percentages

**Key research:** Parker & Leinhardt (1995); Lembke & Reys (1994).

**Common misconceptions:**
- Not understanding that percentage means "per hundred"
- Difficulty connecting percentages to fractions and decimals (the "trio" of rational number representations)
- Struggling with percentage increase/decrease (confusing the base amount)

**Evidence-based strategies:**
- **The percentage bar:** A bar model divided into 100 equal parts (or simplified to 10 sections of 10%)
- **Benchmark percentages:** Master 50%, 25%, 10%, 1% first, then build others from these
  - 50% = divide by 2
  - 25% = divide by 4 (or halve the half)
  - 10% = divide by 10
  - 5% = half of 10%
  - 1% = divide by 100
  - 15% = 10% + 5%
  - 35% = 25% + 10%
- **Real-world contexts:** Sales, discounts, test scores, pie charts
- **Fraction-decimal-percentage equivalence:** Constantly reinforce that 1/4 = 0.25 = 25%, etc.

### 8.4 Long Multiplication

**Key research:** Lampert (1986); NCETM teaching resources; Ma (1999).

**Evidence-based strategies:**
- **Grid/box method** as a visual intermediate step before the standard algorithm
  - 34 x 27: split into (30 + 4) x (20 + 7), create a 2x2 grid, calculate each cell, sum
  - This makes the **place value explicit** and connects to the area model
- **Build from understanding, not procedure:** Children should understand WHY 34 x 27 = (34 x 20) + (34 x 7) before drilling the standard algorithm
- **Estimation first:** Before calculating, estimate. "34 x 27 is roughly 30 x 30 = 900, so our answer should be near 900"
- **Arrays and area models** to visualise what multiplication means physically

### 8.5 Long Division

**Key research:** Silver et al. (1993); Van de Walle et al. (2019).

**Common misconceptions:**
- Not understanding what division means (sharing equally vs grouping)
- Place value errors in the standard algorithm
- Forgetting to bring down digits

**Evidence-based strategies:**
- **Chunking method** (also called partial quotients): Subtract known chunks rather than going digit by digit
  - 432 / 15: "I know 15 x 10 = 150. Subtract 150 from 432 = 282. Another 150 = 132. Then 15 x 8 = 120. 132 - 120 = 12. Answer: 28 remainder 12"
  - This uses multiplication knowledge children already have
- **Two meanings of division:**
  - Sharing: "432 sweets shared among 15 children"
  - Grouping: "How many groups of 15 can you make from 432?"
- **Estimation and reasonableness:** "432 / 15 — well, 15 x 30 = 450, so the answer is a bit less than 30"
- **Connection to multiplication:** Division is the inverse of multiplication. Use fact families.

### 8.6 Algebra

**Key research:** Kieran (2004); Knuth et al. (2006); Carraher et al. (2006).

**Common misconceptions:**
- Thinking the equals sign means "the answer is" rather than "is equivalent to"
- Letters represent specific numbers rather than variables
- Difficulty with the idea of doing the same operation to both sides

**Evidence-based strategies:**
- **Balance model:** An equation is a balance scale. What you do to one side, you must do to the other to keep it balanced. This can be powerfully visualised.
- **Bar models for equations:** 3x + 5 = 20 can be shown as a bar of length 20, split into a section of 5 and three equal sections (each = x)
- **Function machines:** Input -> operation -> output. Work forwards and backwards.
- **Pattern-based introduction:** Before formal algebra, use pattern sequences where children find the rule
  - "Position 1 = 4, Position 2 = 7, Position 3 = 10, Position 4 = ? ... What's the rule?"
  - Then: "The rule is 3n + 1. Can you see why?"
- **Arithmetic to algebra bridge:** Start with missing number problems (7 + ? = 12) and evolve to (7 + x = 12)

### 8.7 Ratio and Proportion

**Key research:** Lamon (2007); Hart (1981); Tourniaire & Pulos (1985).

**Common misconceptions:**
- Using additive rather than multiplicative reasoning ("If 2:3, then 5:6" — adding 3 to both rather than maintaining the ratio)
- Confusing ratio with fraction
- Not understanding that ratios describe relationships, not absolute amounts

**Evidence-based strategies:**
- **Bar models** are exceptionally powerful for ratio (the core Singapore approach)
  - Ratio 2:3 -> draw 2 blocks : 3 blocks, each block worth the same amount
  - "The ratio of red to blue paint is 2:3. If there are 15 litres of blue, how much red?" -> 3 blocks = 15, so 1 block = 5, so 2 blocks = 10
- **Scaling recipes:** A natural, real-world context (doubling/tripling recipes)
- **Proportion tables:** Organised tables showing the multiplicative relationship
- **Explicit teaching of the multiplicative relationship:** "Ratio means 'for every'. For every 2 red, there are 3 blue"

### 8.8 Area and Perimeter

**Key research:** Outhred & Mitchelmore (2000); Huang & Witz (2013).

**Common misconceptions:**
- Confusing area and perimeter (adding when they should multiply, or vice versa)
- Not understanding what area measures (covering) vs what perimeter measures (going around)
- Difficulty decomposing compound shapes

**Evidence-based strategies:**
- **Counting squares:** Start by physically counting unit squares on a grid. This builds understanding of what area means before introducing the formula.
- **String and tiles:** Perimeter = the length of string around the edge. Area = the number of tiles to cover the surface. These physical metaphors help distinguish the two concepts.
- **Compound shapes:** Teach the strategy of decomposition (splitting into rectangles) and demonstrate with colour-coding
- **Real-world contexts:** "How much carpet do you need?" (area), "How much fencing do you need?" (perimeter)
- **Counter-intuitive examples:** Shapes with the same area but different perimeters (and vice versa) help children disentangle the two concepts

### 8.9 Sequences

**Key research:** Rivera & Becker (2011); Stacey (1989); NCETM.

**Evidence-based strategies:**
- **Visual pattern sequences:** Dot patterns, matchstick patterns, block towers that grow. Children see the pattern before writing numbers.
- **Position-to-term relationship:** Move beyond "add 3 each time" (term-to-term) to "the nth term is 3n + 1" (position-to-term). Use a two-column table:
  - Position: 1, 2, 3, 4, 5
  - Term: 4, 7, 10, 13, 16
  - "What's the connection between position and term?"
- **Prediction:** "What will the 10th term be? The 100th?" — forces children to find the rule rather than just continuing the pattern

### 8.10 Speed, Distance, Time

**Key research:** Greer (1992); Thompson (1994).

**Evidence-based strategies:**
- **The formula triangle** (S = D/T) is widely taught but poorly understood without conceptual grounding
- **Start with experience:** "If you walk 3 miles in 1 hour, how far in 2 hours?" Build from intuition
- **Double number lines:** One line for distance, one for time, showing the proportional relationship
- **Unitising:** "If 60 miles in 2 hours, that's 30 miles in 1 hour (per hour)" — establish the rate first
- **Bar models:** Can show distance as a bar, divided by time units

### 8.11 Negative Numbers

**Key research:** Altiparmak & Ozdogan (2010); Vlassis (2004).

**Evidence-based strategies:**
- **Thermometers and number lines** — the most natural real-world model
- **Contexts:** Temperature (below zero), floors in a building (underground floors), sea level (above/below), bank balances (debt)
- **Two-colour counters:** Red for negative, blue for positive. Adding negatives = adding red counters. Zero pairs cancel out.
- **Movement model:** Addition = moving right, subtraction = moving left. Adding a negative = moving left. Subtracting a negative = turning around and moving right.

### 8.12 Place Value and Rounding

**Key research:** Fuson (1990); Ross (1989); Thompson (2003).

**Evidence-based strategies:**
- **Place value charts/grids** with physical or virtual counters
- **Partitioning and recombining:** 3,456 = 3,000 + 400 + 50 + 6 (standard) but ALSO = 3,400 + 56, or 2,000 + 1,456 (flexible partitioning)
- **Rounding using number lines:** Place the number on a number line between the two rounding boundaries. Which is it closer to? This makes rounding visual and intuitive.
- **Arrow cards:** Physical or digital cards that stack to show place value (3000 + 400 + 50 + 6 stack to show 3456)

### 8.13 Prime Numbers, Factors, and Multiples

**Key research:** Zazkis & Liljedahl (2004); NCETM.

**Evidence-based strategies:**
- **Sieve of Eratosthenes:** Crossing out multiples on a number grid — a visual, active discovery of primes
- **Factor bugs/rainbows:** Visual representations showing factor pairs, arching over a number
- **Array method for factors:** Can you arrange 12 objects into a rectangle? 1x12, 2x6, 3x4 — those are the factors. Can you do the same for 7? Only 1x7 — it's prime.
- **Venn diagrams:** For common factors and common multiples (HCF and LCM)

### 8.14 Volume

**Evidence-based strategies:**
- **Counting cubes:** Start with physical or visual unit cubes filling a 3D shape. "How many cubes fit inside?"
- **Layer method:** Show that volume = area of base x height. Count one layer, then multiply by the number of layers.
- **Water/liquid context:** "How much water can the tank hold?" makes volume tangible
- **Build from 2D to 3D:** Connect area understanding (covering a flat surface) to volume understanding (filling a 3D space)

### 8.15 Angles and Shapes

**Evidence-based strategies:**
- **Estimation before measurement:** "Is this angle bigger or smaller than a right angle?" before measuring
- **Physical turning:** Angles as rotation — turn your body to feel what 90 degrees, 180 degrees, 360 degrees means
- **Properties-based classification:** Sort shapes by properties (number of sides, parallel lines, equal angles) rather than just memorising names
- **Angle facts as relationships:** Angles on a straight line sum to 180 degrees, angles in a triangle sum to 180 degrees, angles around a point sum to 360 degrees — teach these as connected facts, not isolated rules

### 8.16 Data Handling

**Evidence-based strategies:**
- **Read, interpret, then create:** Follow this progression — first read data from given charts/graphs, then answer questions requiring interpretation, then create their own representations
- **Comparison tasks:** Give two related charts and ask children to draw conclusions
- **Real data:** Use data children care about (sports statistics, class surveys, weather data)
- **Critical questioning:** "What does this chart NOT tell us?" builds higher-order thinking

---

## 9. Synthesis: Design Principles for Micro-Lessons

Drawing together all of the above research, here are the evidence-based design principles that should govern every micro-lesson in the app:

### 9.1 Structure: The 4-Screen Micro-Lesson Template

Based on Rosenshine's principles, worked example research, and retrieval practice evidence:

| Screen | Purpose | Research Basis |
|--------|---------|----------------|
| **Screen 1: Hook** | Curiosity gap, real-world context, or surprising fact. Pose a question or challenge. Connect to prior knowledge. | Loewenstein (1994), Rosenshine (Principle 1: review), Willingham (2009) |
| **Screen 2: Teach** | One key concept, using dual coding (words + visual). Worked example with clear steps and WHY reasoning. | Mayer (2001), Sweller (worked example effect), CRA/CPA progression |
| **Screen 3: Interact** | Retrieval practice — child answers a question, fills a blank, makes a prediction, or explains a step. Immediate feedback. | Roediger & Karpicke (2006), generation effect, self-explanation |
| **Screen 4: Consolidate** | Brief summary, connection to the bigger picture, and a "try this" prompt leading into quiz practice. | Spacing effect setup, schema building |

### 9.2 Content Principles

1. **One concept per micro-lesson.** Never two. (Cognitive load theory; micro-learning research)
2. **Always use dual coding.** Every screen has both words and a relevant visual. (Paivio; Mayer)
3. **Use bar models as the universal visual language** across topics. (Singapore Maths; Ng & Lee 2009)
4. **Embed maths in real-world, British contexts.** Use characters, stories, and familiar situations. (Willingham; Egan; personalisation principle)
5. **Introduce vocabulary at point of use** with clear, child-friendly definitions. (EEF recommendation)
6. **Use conversational, second-person language.** "You" and "we," not formal instruction. (Mayer's personalisation principle)
7. **Show WHY, not just WHAT.** Every step in a worked example should explain the reasoning. (Chi et al. self-explanation; Renkl)
8. **Build from visual/pictorial to abstract.** Start with a representation, then connect to the symbolic. (CRA; Bruner)

### 9.3 Engagement Principles

1. **Open with curiosity.** A question, puzzle, or surprising fact. (Loewenstein; Gruber et al.)
2. **Maintain 80%+ success rate.** Calibrate difficulty to the child's level. (Rosenshine; SDT competence need)
3. **Provide choice where possible.** Let children pick topics or challenges. (SDT autonomy)
4. **Make failure safe and productive.** "Not quite — let's see why" rather than punishment. (Kapur; Bjork)
5. **Keep it short.** 1-2 minutes total. If it can't be taught that quickly, split into two micro-lessons. (Micro-learning research; working memory constraints)
6. **Use narrative and characters.** Recurring characters in recognisable situations. (Willingham; Egan)

### 9.4 Retention Principles

1. **Every micro-lesson includes retrieval practice.** At least one question the child must answer. (Roediger & Karpicke; Agarwal)
2. **Space topic revisits across days.** Use expanding intervals: 1 day, 3 days, 1 week, 2 weeks. (Cepeda et al.; Ebbinghaus)
3. **Interleave topics in review sessions.** Mix fractions, decimals, and percentages in a single review. (Rohrer & Taylor; Pan et al.)
4. **Use faded worked examples.** Progress from fully worked to partially worked to independent. (Renkl & Atkinson; van Merriënboer)
5. **Vary surface features while maintaining deep structure.** Same mathematical concept in different contexts. (Variation theory; Gu, Huang & Marton)

### 9.5 Specific Visual Strategies by Topic

| Topic | Primary Visual | Secondary Visual | Key Strategy |
|-------|---------------|-----------------|--------------|
| Fractions | Bar models, fraction strips | Number lines, area models (circles) | Fraction-as-number (number line placement) |
| Decimals | Place value charts | Number lines (zoomed) | Money as concrete model; comparison tasks |
| Percentages | Percentage bars (10 sections) | Pie charts, price tags | Benchmark percentages (50%, 25%, 10%, 1%) |
| Long Multiplication | Grid/box method | Area model | Estimation first, then calculate |
| Long Division | Chunking method visualisation | Number line (jumps) | Connect to known multiplication facts |
| Algebra | Balance scales, bar models | Function machines | Missing number to letter; pattern-based |
| Ratio | Bar models (comparison) | Proportion tables | Multiplicative reasoning; scaling |
| Area & Perimeter | Grid squares, compound shape decomposition | Colour-coded dimensions | Distinguish covering (area) vs going around (perimeter) |
| Sequences | Visual dot/block patterns | Two-column tables | Position-to-term, not just term-to-term |
| Speed/Distance/Time | Double number lines | Journey diagrams | Unitise first (find the rate per 1 unit) |
| Negative Numbers | Thermometers, number lines | Building floors, sea level | Context-first; movement model |
| Place Value | Place value charts, arrow cards | Number lines | Flexible partitioning |
| Primes & Factors | Arrays, factor rainbows | Sieve of Eratosthenes, Venn diagrams | "Can you make a rectangle?" for primes |
| Angles & Shapes | Annotated diagrams | Protractor models | Estimation before measurement |
| Volume | 3D diagrams with layer counting | Cuboid nets | Build from counting cubes to formula |
| Data Handling | Annotated charts/graphs | Comparison displays | Reading before interpreting before creating |

---

## 10. Key References

### Cognitive Science and Learning Theory
- Baddeley, A. & Hitch, G. (1974). Working memory. *Psychology of Learning and Motivation*, 8, 47-89.
- Bjork, R. A. (1994). Memory and metamemory considerations in the training of human beings. In *Metacognition: Knowing about knowing*.
- Bjork, E. L. & Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In *Psychology and the real world*.
- Bruner, J. S. (1966). *Toward a Theory of Instruction*. Harvard University Press.
- Cowan, N. (2001). The magical number 4 in short-term memory. *Behavioral and Brain Sciences*, 24(1), 87-114.
- Csikszentmihalyi, M. (1990). *Flow: The Psychology of Optimal Experience*. Harper & Row.
- Ebbinghaus, H. (1885/1913). *Memory: A Contribution to Experimental Psychology*.
- Gathercole, S. E. & Alloway, T. P. (2008). *Working Memory and Learning: A Practical Guide for Teachers*. Sage.
- Loewenstein, G. (1994). The psychology of curiosity: A review and reinterpretation. *Psychological Bulletin*, 116(1), 75-98.
- Mayer, R. E. (2001). *Multimedia Learning*. Cambridge University Press.
- Mayer, R. E. (2009). *Multimedia Learning* (2nd ed.). Cambridge University Press.
- Paivio, A. (1971). *Imagery and Verbal Processes*. Holt, Rinehart and Winston.
- Piaget, J. (1952). *The Origins of Intelligence in Children*. International Universities Press.
- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science*, 12(2), 257-285.
- Vygotsky, L. S. (1978). *Mind in Society: The Development of Higher Psychological Processes*. Harvard University Press.

### Teaching Strategies and Instruction
- Atkinson, R. K., Derry, S. J., Renkl, A. & Wortham, D. (2000). Learning from examples: Instructional principles from the worked examples research. *Review of Educational Research*, 70(2), 181-214.
- Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P. & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. *Cognitive Science*, 13(2), 145-182.
- Education Endowment Foundation (2017). *Improving Mathematics in Key Stages 2 and 3*. Guidance Report.
- Hiebert, J. & Grouws, D. A. (2007). The effects of classroom mathematics teaching on students' learning. In *Second Handbook of Research on Mathematics Teaching and Learning*.
- Kapur, M. (2014). Productive failure in learning math. *Cognitive Science*, 38(5), 1008-1022.
- Kirschner, P. A., Sweller, J. & Clark, R. E. (2006). Why minimal guidance during instruction does not work. *Educational Psychologist*, 41(2), 75-86.
- Renkl, A. (2002). Worked-out examples: Instructional explanations support learning by self-explanations. *Learning and Instruction*, 12(5), 529-556.
- Rosenshine, B. (2012). Principles of instruction: Research-based strategies that all teachers should know. *American Educator*, 36(1), 12-19.
- Witzel, B. S., Mercer, C. D. & Miller, M. D. (2003). Teaching algebra to students with learning difficulties: An investigation of an explicit instruction model. *Learning Disabilities Research & Practice*, 18(2), 121-131.
- Wood, D., Bruner, J. S. & Ross, G. (1976). The role of tutoring in problem solving. *Journal of Child Psychology and Psychiatry*, 17(2), 89-100.

### Retrieval Practice, Spacing, and Interleaving
- Agarwal, P. K., Bain, P. M. & Chamberlain, R. W. (2012). The value of applied research: Retrieval practice improves classroom learning and recommendations from a teacher, a principal, and a scientist. *Educational Psychology Review*, 24(3), 437-448.
- Agarwal, P. K. & Bain, P. M. (2019). *Powerful Teaching: Unleash the Science of Learning*. Jossey-Bass.
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T. & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. *Psychological Bulletin*, 132(3), 354-380.
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J. & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1), 4-58.
- Roediger, H. L. & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science*, 17(3), 249-255.
- Rohrer, D., Dedrick, R. F. & Stershic, S. (2015). Interleaved practice improves mathematics learning. *Journal of Educational Psychology*, 107(3), 900-908.

### Mathematics Education
- Flores, M. M. (2010). Using the concrete-representational-abstract sequence to teach subtraction with regrouping to students at risk for failure. *Remedial and Special Education*, 31(3), 195-207.
- Hart, K. M. (1981). *Children's Understanding of Mathematics: 11-16*. John Murray.
- Kaur, B. (2019). The why, what and how of the 'Model' method: A tool for representing and visualising relationships when solving whole number arithmetic word problems. *ZDM*, 51(1), 151-168.
- Kieran, C. (2004). Algebraic thinking in the early grades: What is it? *The Mathematics Educator*, 8(1), 139-151.
- Lamon, S. J. (2012). *Teaching Fractions and Ratios for Understanding* (3rd ed.). Routledge.
- Ma, L. (1999). *Knowing and Teaching Elementary Mathematics*. Lawrence Erlbaum Associates.
- Ng, S. F. & Lee, K. (2009). The model method: Singapore children's tool for representing and solving algebraic word problems. *Journal for Research in Mathematics Education*, 40(3), 282-313.
- Siegler, R. S. et al. (2013). *Developing Effective Fractions Instruction for Kindergarten Through 8th Grade*. IES Practice Guide.
- Van de Walle, J. A., Karp, K. S. & Bay-Williams, J. M. (2019). *Elementary and Middle School Mathematics: Teaching Developmentally* (10th ed.). Pearson.

### Motivation and Engagement
- Deci, E. L. & Ryan, R. M. (2000). The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior. *Psychological Inquiry*, 11(4), 227-268.
- Egan, K. (1986). *Teaching as Story Telling*. University of Chicago Press.
- Hanus, M. D. & Fox, J. (2015). Assessing the effects of gamification in the classroom. *Computers & Education*, 80, 152-161.
- Willingham, D. T. (2009). *Why Don't Students Like School?* Jossey-Bass.

### Visual and Digital Approaches
- Booth, J. L. & Siegler, R. S. (2008). Numerical magnitude representations influence arithmetic learning. *Child Development*, 79(4), 1016-1031.
- Caviglioli, O. (2019). *Dual Coding with Teachers*. John Catt Educational.
- Clark, R. C. & Mayer, R. E. (2016). *e-Learning and the Science of Instruction* (4th ed.). Wiley.
- Moyer-Packenham, P. S. & Westenskow, A. (2013). Effects of virtual manipulatives on student achievement and mathematics learning. *International Journal of Virtual and Personal Learning Environments*, 4(3), 35-50.

---

## 11. Summary: The Research-Backed Micro-Lesson Recipe

If you could distil all of this research into a single recipe for a 1-2 minute micro-lesson:

1. **Hook them** (10-15 seconds): A real-world scenario, surprising fact, or puzzle that creates a curiosity gap and connects to something they already know.

2. **Show them** (30-45 seconds): One concept, taught through a worked example that uses dual coding (words alongside a bar model, number line, or diagram). Explain WHY each step works, not just WHAT to do. Use conversational language.

3. **Test them** (20-30 seconds): A retrieval practice question — they must generate an answer before being shown the solution. Provide immediate, specific, encouraging feedback.

4. **Connect it** (10-15 seconds): A one-sentence summary linking this concept to the bigger picture, plus a prompt to practise ("Ready to try some questions on this?").

**Total: 70-105 seconds. Four screens. One concept. Words + pictures. A question to answer. Done.**

---

*This document was compiled from established cognitive science and mathematics education research. All named researchers, frameworks, and studies referenced are well-documented in the academic literature. For the most current findings, the EEF guidance reports and NCETM resources are freely available online and regularly updated.*
