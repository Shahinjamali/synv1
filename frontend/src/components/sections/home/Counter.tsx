import React from 'react';

interface CounterProps {
  // Define your component props here (if any)
}

const Counter: React.FC<CounterProps> = ({ /* Destructure props here */ }) => {
  return (
    <div>
      {/* Your component content */}
      <p>This is Counter.tsx</p>
    </div>
  );
};

export default Counter;
