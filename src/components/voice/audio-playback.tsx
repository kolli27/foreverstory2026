'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlaybackProps {
  audioUrl: string;
  duration: number; // Total duration in seconds
  onReRecord: () => void;
  onKeep: () => void;
  className?: string;
}

export function AudioPlayback({
  audioUrl,
  duration,
  onReRecord,
  onKeep,
  className = ''
}: AudioPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Instruction */}
      <p className="text-lg text-center text-gray-700">
        Hören Sie Ihre Aufnahme ab oder nehmen Sie sie neu auf
      </p>

      {/* Playback controls */}
      <div className="flex flex-col items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Abspielen'}
        >
          {isPlaying ? (
            // Pause icon
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            // Play icon
            <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Time display */}
        <div className="text-2xl font-mono tabular-nums text-gray-700">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReRecord}
          className="px-8 py-4 text-lg font-medium border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-colors min-h-[44px]"
        >
          Neu aufnehmen
        </button>
        <button
          onClick={onKeep}
          className="px-8 py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors min-h-[44px]"
        >
          Aufnahme verwenden
        </button>
      </div>
    </div>
  );
}
