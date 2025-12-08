'use client';

interface RecordingTimerProps {
  duration: number; // in seconds
  className?: string;
}

export function RecordingTimer({ duration, className = '' }: RecordingTimerProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`font-mono text-5xl font-bold tabular-nums ${className}`}
      role="timer"
      aria-label={`Aufnahmedauer: ${formatTime(duration)}`}
      aria-live="polite"
    >
      {formatTime(duration)}
    </div>
  );
}
