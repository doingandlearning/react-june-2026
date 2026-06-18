import { useState } from "react";

interface CounterProps {
  /** Value the counter starts at. Defaults to 0. */
  initialCount?: number;
}

export function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
      <button type="button" onClick={() => setCount((current) => current - 1)}>
        Decrement
      </button>
    </div>
  );
}
