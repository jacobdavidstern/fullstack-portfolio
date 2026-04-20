import { useState, useEffect, useRef } from 'react';

export default function useTimer(initialSeconds = 180) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Start the timer
  function start() {
    if (!running) setRunning(true);
  }

  // Stop the timer
  function stop() {
    setRunning(false);
  }

  // Reset to original time
  function reset() {
    setTimeLeft(initialSeconds);
    setRunning(false);
  }

  // Tick logic
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  return { timeLeft, start, stop, reset };
}
