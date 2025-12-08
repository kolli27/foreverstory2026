'use client';

interface VolumeMeterProps {
  volumeLevel: number; // 0-100
  className?: string;
}

export function VolumeMeter({ volumeLevel, className = '' }: VolumeMeterProps) {
  // Create 10 bars for the volume meter
  const barCount = 10;
  const activeBarCount = Math.ceil((volumeLevel / 100) * barCount);

  return (
    <div className={`flex items-end gap-1 ${className}`} role="meter" aria-label="Lautstärkemesser" aria-valuenow={volumeLevel} aria-valuemin={0} aria-valuemax={100}>
      {Array.from({ length: barCount }).map((_, index) => {
        const isActive = index < activeBarCount;
        const height = ((index + 1) / barCount) * 100;

        // Color intensity based on volume level
        let colorClass = 'bg-green-500';
        if (volumeLevel > 70) {
          colorClass = 'bg-red-500';
        } else if (volumeLevel > 40) {
          colorClass = 'bg-yellow-500';
        }

        return (
          <div
            key={index}
            className={`w-2 rounded-t transition-all duration-100 ${
              isActive ? colorClass : 'bg-gray-300'
            }`}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}
