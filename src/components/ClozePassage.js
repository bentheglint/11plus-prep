import React from 'react';

// Renders a running-passage Cloze (benchmark fix #6). The passage text carries
// numbered gap markers of the form ___(n)___. Each marker is drawn as a small
// numbered blank; the blank whose number matches `currentGap` is highlighted so
// the child can see which gap the current question is asking about while still
// reading the whole story for context.
function ClozePassage({ passage, currentGap }) {
  if (!passage) return null;
  const parts = passage.split(/(___\(\d+\)___)/g);
  return (
    <span>
      {parts.map((part, i) => {
        const m = part.match(/^___\((\d+)\)___$/);
        if (!m) return <React.Fragment key={i}>{part}</React.Fragment>;
        const n = parseInt(m[1], 10);
        const active = n === currentGap;
        return (
          <span
            key={i}
            data-testid={active ? 'cloze-gap-active' : 'cloze-gap'}
            className={
              'inline-flex items-center justify-center min-w-[2rem] h-6 px-1.5 mx-0.5 rounded-md text-xs font-bold align-middle border-b-2 ' +
              (active
                ? 'bg-[#FDCB6E] text-slate-900 border-[#F59E0B] shadow-sm'
                : 'bg-gray-100 text-slate-400 border-gray-300')
            }
          >
            {n}
          </span>
        );
      })}
    </span>
  );
}

export default ClozePassage;
