import { useEffect, useRef, useState } from 'react';
import React from 'react';

interface CounterProps {
  end: number;
  duration: number;
}

const Counter: React.FC<CounterProps> = ({ end, duration }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const increment = end / duration;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCount();
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + increment;
        if (newCount >= end) {
          clearInterval(interval);
          return end;
        } else {
          return newCount;
        }
      });
    }, 1000 / duration);

    return () => {
      clearInterval(interval);
    };
  }, [end, increment, duration]); // duration is added to the dependency array

  const startCount = () => {
    setCount(0);
  };

  return (
    <span ref={countRef}>
      <span>{Math.round(count)}</span>
    </span>
  );
};

export default Counter;
