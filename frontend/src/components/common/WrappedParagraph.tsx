import React, { Fragment } from 'react';

interface WrappedParagraphProps {
  text?: string;
  wordsPerLine?: number;
}

const WrappedParagraph: React.FC<WrappedParagraphProps> = ({
  text,
  wordsPerLine = 10,
}) => {
  // Handle undefined or empty text
  if (!text || wordsPerLine <= 0) {
    return <p style={{ textAlign: 'justify' }}>{text ?? ''}</p>;
  }

  // Split text into words, filtering out empty strings and normalizing whitespace
  const words = text.trim().split(/\s+/).filter(Boolean);

  // Group words into lines
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(' '));
  }

  return (
    <p style={{ textAlign: 'justify' }}>
      {lines.map((line, index) => (
        <Fragment key={`line-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </p>
  );
};

export default WrappedParagraph;
