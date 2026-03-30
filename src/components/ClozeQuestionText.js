import React from 'react';

function ClozeQuestionText({ text, className }) {
  if (!text || !text.includes('___')) {
    return <span className={className}>{text}</span>;
  }

  // Split by 3+ underscores
  const parts = text.split(/_{3,}/);

  return (
    <span className={className}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="inline-block mx-1 min-w-[4rem] border-b-2 border-[#6C5CE7] align-baseline">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}

export default ClozeQuestionText;
