import { useState, useEffect, useRef } from "react";

interface UseTimerProps {
  durationTime: number; // 이미 경과한 시간 (밀리초)
  challengeTime: string; // 목표 시간 (HH:MM:SS 형식)
}

const useTimer = ({ durationTime, challengeTime }: UseTimerProps) => {
  const INTERVAL = 1000;
  const [elapsedTime, setElapsedTime] = useState<number>(durationTime); // 이미 경과한 시간부터 시작
  const [isFinished, setIsFinished] = useState(false);

  const formatTimeToString = (time: number) => {
    const hours = String(Math.floor(time / (1000 * 60 * 60))).padStart(
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

  const formatStringToTime = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
  };

  const targetTime = formatStringToTime(challengeTime);
  const displayTime = formatTimeToString(elapsedTime);
  const isOver = elapsedTime >= targetTime;

  const [percentage, setPercentage] = useState<number>(
    Math.floor((elapsedTime / targetTime) * 100)
  );

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newElapsedTime = prevTime + INTERVAL;
        const newPercentage = Math.floor((newElapsedTime / targetTime) * 100);
        
        setPercentage(newPercentage);
        
        return newElapsedTime;
      });
    }, INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [targetTime]);

  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setElapsedTime(durationTime);
    setPercentage(Math.floor((durationTime / targetTime) * 100));
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
