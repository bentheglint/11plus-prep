import React, { useCallback, useEffect, useRef, useState } from 'react';

// Ported verbatim from the mockup's NODES data (design-mockups/landing/
// landing-prepstep.html, <script> ~lines 956-1087) — same conversation
// content, same hint branch, same refusal moment, same three questions.
// HTML entities (&pound; etc.) are intentional: these strings are rendered
// via dangerouslySetInnerHTML (see below), which parses real HTML, so the
// entities resolve correctly regardless of JSX.
const NODES = {
  start: {
    tutor: [
      "Here's one to try: a jumper costs <b>&pound;40</b>, and in a sale it's <b>25% off</b>. What's the new price?",
      'Have a go, or ask me for help if you get stuck.',
    ],
    choices: [
      { label: "I think it's &pound;30", next: 'correct' },
      { label: "I think it's &pound;35", next: 'wrong35' },
      { label: 'Give me a hint', next: 'hint' },
      { label: 'Just tell me the answer', next: 'refuse', cls: 'tell' },
    ],
  },
  refuse: {
    tutor: [
      "Nice try! I'm not going to just hand it over, that's how it stops sticking.",
      "But I'll get you there. 25% off means you keep <b>three quarters</b> of the price. What's a quarter of &pound;40?",
    ],
    choices: [
      { label: 'A quarter of &pound;40 is &pound;10', next: 'quarter' },
      { label: "I'm not sure", next: 'hint' },
      { label: 'Just tell me!', next: 'refuse2', cls: 'tell' },
    ],
  },
  refuse2: {
    tutor: [
      "Still not a chance, and you're closer than you think. A quarter of &pound;40 is <b>&pound;10</b>. Take that off, and what's left?",
    ],
    choices: [
      { label: '&pound;30', next: 'correct' },
      { label: '&pound;35', next: 'wrong35' },
    ],
  },
  hint: {
    tutor: [
      "Of course. Here's the trick: <b>25% is the same as a quarter.</b> So find a quarter of &pound;40, then take it off. What's a quarter of &pound;40?",
    ],
    choices: [
      { label: '&pound;10', next: 'quarter' },
      { label: '&pound;4', next: 'quarterWrong' },
    ],
  },
  quarterWrong: {
    tutor: [
      "Not quite. A quarter means splitting into four equal parts, and &pound;40 shared into 4 is &pound;10. So take &pound;10 off &pound;40. What's the new price?",
    ],
    choices: [
      { label: '&pound;30', next: 'correct' },
      { label: '&pound;35', next: 'wrong35' },
    ],
  },
  quarter: {
    tutor: ["Exactly. So 25% off takes that &pound;10 away. &pound;40 with &pound;10 off leaves...?"],
    choices: [
      { label: '&pound;30', next: 'correct' },
      { label: '&pound;35', next: 'wrong35' },
    ],
  },
  wrong35: {
    tutor: [
      'Good try, and a really common one. &pound;35 is taking off &pound;5, but 25% of &pound;40 is <b>&pound;10</b>, not &pound;5. Take &pound;10 off instead. What do you get?',
    ],
    choices: [{ label: '&pound;30', next: 'correct' }],
  },
  correct: {
    tutor: [
      "That's it, <b>&pound;30</b> &check;",
      'A quarter of &pound;40 is &pound;10, so 25% off takes &pound;10 away and leaves &pound;30. And you worked it out yourself. That\'s the bit that sticks on exam day.',
    ],
    choices: [{ label: 'Next question &rarr;', next: 'q2', cls: 'next' }],
  },

  // Q2: sharing in a ratio (harder)
  q2: {
    fresh: true,
    tutor: ["Great. Let's step it up a bit.", 'Sophie and Jack share <b>&pound;48</b> in the ratio <b>3:5</b>. How much does <b>Jack</b> get?'],
    choices: [
      { label: 'I think &pound;30', next: 'q2correct' },
      { label: 'I think &pound;18', next: 'q2wrong18' },
      { label: 'Give me a hint', next: 'q2hint' },
    ],
  },
  q2hint: {
    tutor: [
      'Start by adding the ratio numbers: 3 + 5 = <b>8</b> equal parts. Share the money out: &pound;48 &divide; 8 = &pound;6 each. Jack has 5 parts, so what is 5 &times; &pound;6?',
    ],
    choices: [
      { label: '&pound;30', next: 'q2correct' },
      { label: '&pound;18', next: 'q2wrong18' },
    ],
  },
  q2wrong18: {
    tutor: [
      "So close, but &pound;18 is <b>Sophie's</b> share, her 3 parts. Jack has the bigger number, 5 parts. Each part is &pound;6, so what do Jack's 5 parts come to?",
    ],
    choices: [
      { label: '&pound;30', next: 'q2correct' },
      { label: '&pound;24', next: 'q2wrong24' },
    ],
  },
  q2wrong24: {
    tutor: ['Careful, &pound;24 would be splitting it equally, but 3:5 means Jack gets more than Sophie. Five parts at &pound;6 each is...?'],
    choices: [{ label: '&pound;30', next: 'q2correct' }],
  },
  q2correct: {
    tutor: [
      'Exactly, <b>&pound;30</b> &check;',
      "8 parts, &pound;6 each, and Jack's 5 parts make &pound;30. Sophie's 3 make &pound;18, and &pound;30 and &pound;18 together give &pound;48. It checks out. Lovely working.",
    ],
    choices: [{ label: 'One more &rarr;', next: 'q3', cls: 'next' }],
  },

  // Q3: reverse percentage (hardest)
  q3: {
    fresh: true,
    tutor: ["Last one, and it's a proper brain-bender.", 'In a sale, a coat is reduced by <b>20%</b>. It now costs <b>&pound;60</b>. What was the <b>original</b> price?'],
    choices: [
      { label: 'I think &pound;75', next: 'q3correct' },
      { label: 'I think &pound;72', next: 'q3wrong72' },
      { label: 'Give me a hint', next: 'q3hint' },
    ],
  },
  q3hint: {
    tutor: [
      'Here\'s the clever bit: the &pound;60 already has the discount taken off, so &pound;60 is <b>80%</b> of the original, not 100%. Find 1%: &pound;60 &divide; 80 = &pound;0.75. So what is 100%?',
    ],
    choices: [
      { label: '&pound;75', next: 'q3correct' },
      { label: '&pound;72', next: 'q3wrong72' },
    ],
  },
  q3wrong72: {
    tutor: [
      "I can see the thinking, but that's the classic trap. You took 20% of &pound;60 and added it on. The 20% came off the <b>original</b>, which was bigger than &pound;60. So if &pound;60 is 80% of the original, what is 100%?",
    ],
    choices: [
      { label: '&pound;75', next: 'q3correct' },
      { label: '&pound;48', next: 'q3wrong48' },
    ],
  },
  q3wrong48: {
    tutor: ['Careful, that takes another 20% off. The &pound;60 is the price <b>after</b> the discount, so the original must be more than &pound;60. If &pound;60 is 80%, then 100% is...?'],
    choices: [{ label: '&pound;75', next: 'q3correct' }],
  },
  q3correct: {
    tutor: [
      'Yes! <b>&pound;75</b> &check;',
      '&pound;60 was 80% of the original, so 1% is &pound;0.75 and 100% is &pound;75. A quick check: 20% of &pound;75 is &pound;15, and taking that off leaves &pound;60. That\'s the trickiest percentage there is, and you got there.',
    ],
    end: true,
  },
};

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

let msgIdSeq = 0;
const nextMsgId = () => {
  msgIdSeq += 1;
  return msgIdSeq;
};

export default function TutorDemo() {
  const [messages, setMessages] = useState([]); // [{ id, who: 'tutor'|'child', html }]
  const [choices, setChoices] = useState([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);

  const chatRef = useRef(null);
  const timersRef = useRef([]);
  const cancelledRef = useRef(false);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      if (cancelledRef.current) return;
      fn();
    }, ms);
    timersRef.current.push(id);
  }, []);

  const goNode = useCallback(
    (nodeId) => {
      const node = NODES[nodeId];
      if (!node) return;

      if (node.fresh) setMessages([]);
      setBusy(true);
      setChoices([]);
      setTyping(false);

      const finish = () => {
        if (cancelledRef.current) return;
        setBusy(false);
        setTyping(false);
        if (node.end) {
          setChoices([{ label: 'Try it again &#8634;', cls: 'reset', reset: true }]);
        } else {
          setChoices(node.choices);
        }
      };

      // Must-fix 9: reduced motion gets the same conversation, instantly,
      // with no typing-dots choreography.
      if (prefersReducedMotion()) {
        node.tutor.forEach((html) => {
          setMessages((prev) => [...prev, { id: nextMsgId(), who: 'tutor', html }]);
        });
        finish();
        return;
      }

      let i = 0;
      const step = () => {
        if (cancelledRef.current) return;
        if (i >= node.tutor.length) {
          finish();
          return;
        }
        setTyping(true);
        const plainLen = node.tutor[i].replace(/<[^>]+>/g, '').length;
        const delay = 460 + Math.min(plainLen * 9, 680);
        schedule(() => {
          setTyping(false);
          const html = node.tutor[i];
          setMessages((prev) => [...prev, { id: nextMsgId(), who: 'tutor', html }]);
          i += 1;
          schedule(step, 240);
        }, delay);
      };
      step();
    },
    [schedule]
  );

  const choose = useCallback(
    (choice) => {
      if (busy) return;
      if (choice.reset) {
        setMessages([]);
        setChoices([]);
        goNode('start');
        return;
      }
      setMessages((prev) => [...prev, { id: nextMsgId(), who: 'child', html: choice.label }]);
      setChoices([]);
      goNode(choice.next);
    },
    [busy, goNode]
  );

  // Mount-time intro sequence, StrictMode-safe (must-fix 11): rather than
  // guarding with a "started" ref (which would permanently block the SECOND,
  // real invocation after StrictMode's dev double-fire), each effect run
  // resets local state and schedules its own timers; the effect's own
  // cleanup cancels those specific timers via cancelledRef before they can
  // fire. StrictMode's synchronous mount->cleanup->mount means the FIRST
  // run's timers are cancelled before any setTimeout callback executes, so
  // only the second (real) run's messages ever land — no doubled intro.
  useEffect(() => {
    cancelledRef.current = false;
    setMessages([]);
    setChoices([]);
    setTyping(false);
    setBusy(false);
    goNode('start');
    return () => {
      cancelledRef.current = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  return (
    <div className="demo rise d5" id="demo" aria-label="A live example of the no-spoiler tutor">
      <span className="demo-tab">
        <span className="pulse" aria-hidden="true"></span> Watch: it won&apos;t just give the answer
      </span>
      <div className="chat-head">
        <div className="tutor-av" aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8" />
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <path d="M2 14h2M20 14h2M9 13v2M15 13v2" />
          </svg>
        </div>
        <div className="who">
          PrepStep Tutor <span>Here to help your child work it out</span>
        </div>
      </div>
      <div className="chat" ref={chatRef} role="log" aria-live="polite">
        {messages.map((m) => (
          // eslint-disable-next-line react/no-danger
          <div key={m.id} className={`msg ${m.who}`} dangerouslySetInnerHTML={{ __html: m.html }} />
        ))}
        {typing && (
          <div className="msg tutor typing">
            <span className="typing-dots">
              <i></i>
              <i></i>
              <i></i>
            </span>
          </div>
        )}
      </div>
      <div className="choices">
        {choices.map((c, idx) => (
          <button
            key={c.label}
            type="button"
            className={`choice${c.cls ? ` ${c.cls}` : ''}`}
            style={{ animationDelay: `${idx * 0.05}s` }}
            onClick={() => choose(c)}
            disabled={busy}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: c.label }}
          />
        ))}
      </div>
      <div className="demo-foot">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        This is the real behaviour: the tutor coaches while your child is working, and never just hands over the answer.
      </div>
    </div>
  );
}
