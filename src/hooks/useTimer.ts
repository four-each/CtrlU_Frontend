import { useState, useEffect, useRef } from "react";

interface UseTimerProps {
  durationTime: number;
  endTime: string;
}
const useTimer = ({ durationTime, endTime }: UseTimerProps) => {
  const INTERVAL = 1000;
  const [duration, setDuration] = useState<number>(durationTime);
  const [isFinished, setIsFinished] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const formatTimeToString = (time: number) => {
    const hours = String(Math.floor((time / (1000 * 60 * 60)) % 24)).padStart(
      2,
      "0"
    );
    const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(
      2,
      "0"
    );
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const formetStringToTime = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
  };

  const allMilliSeconds = formetStringToTime(endTime);

  const displayTime = formatTimeToString(duration);

  const [percentage, setPercentage] = useState<number>(
    Math.floor((duration / allMilliSeconds) * 100)
  );

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDuration((prevTime) => prevTime + INTERVAL);
      setPercentage(Math.floor((duration / allMilliSeconds) * 100));
    }, INTERVAL);

    if (duration >= allMilliSeconds) {
      setIsOver(true);
    } else {
      setIsOver(false);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [duration, endTime, allMilliSeconds]);

  const reset = () => {
    clearInterval(timerRef.current);
  };

  return {
    displayTime,
    percentage,
    isFinished,
    isOver,
    setIsFinished,
    reset,
  };
};

export default useTimer;
