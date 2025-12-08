'use client';

import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { RecordingTimer } from './recording-timer';
import { VolumeMeter } from './volume-meter';
import { AudioPlayback } from './audio-playback';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onSwitchToText: () => void;
  className?: string;
}

export function VoiceRecorder({
  onRecordingComplete,
  onSwitchToText,
  className = ''
}: VoiceRecorderProps) {
  const {
    recordingState,
    audioBlob,
    audioUrl,
    duration,
    volumeLevel,
    error,
    startRecording,
    stopRecording,
    clearRecording,
    isSupported,
  } = useAudioRecorder();

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleReRecord = () => {
    clearRecording();
  };

  const handleKeepRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob, duration);
    }
  };

  // Show error message
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-lg text-red-800 mb-4">{error}</p>
          <button
            onClick={onSwitchToText}
            className="px-8 py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors min-h-[44px]"
          >
            Stattdessen Text eingeben
          </button>
        </div>
      </div>
    );
  }

  // Show unsupported message
  if (!isSupported) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <p className="text-lg text-yellow-800 mb-4">
            Ihr Browser unterstützt leider keine Audioaufnahme. Bitte verwenden Sie einen modernen Browser wie Chrome, Firefox oder Safari.
          </p>
          <button
            onClick={onSwitchToText}
            className="px-8 py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors min-h-[44px]"
          >
            Stattdessen Text eingeben
          </button>
        </div>
      </div>
    );
  }

  // Show playback interface
  if (recordingState === 'stopped' && audioUrl) {
    return (
      <div className={className}>
        <AudioPlayback
          audioUrl={audioUrl}
          duration={duration}
          onReRecord={handleReRecord}
          onKeep={handleKeepRecording}
        />

        {/* Switch to text option */}
        <div className="mt-8 text-center">
          <button
            onClick={onSwitchToText}
            className="text-blue-600 hover:text-blue-700 underline text-base"
          >
            Oder schreiben Sie stattdessen
          </button>
        </div>
      </div>
    );
  }

  // Show recording interface
  if (recordingState === 'recording') {
    return (
      <div className={`space-y-8 ${className}`}>
        {/* Instruction */}
        <p className="text-lg text-center text-gray-700">
          Sprechen Sie jetzt... Klicken Sie &quot;Stopp&quot; wenn Sie fertig sind
        </p>

        {/* Timer */}
        <div className="flex justify-center">
          <RecordingTimer duration={duration} className="text-gray-900" />
        </div>

        {/* Pulsing red circle with microphone icon */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Pulsing animation */}
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" style={{ width: '120px', height: '120px' }} />

            {/* Static circle with microphone */}
            <button
              onClick={handleStopRecording}
              className="relative w-[120px] h-[120px] rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors shadow-lg"
              aria-label="Aufnahme stoppen"
            >
              {/* Microphone icon */}
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <p className="text-xl font-medium text-gray-900">Stopp</p>
        </div>

        {/* Volume meter */}
        <div className="flex justify-center">
          <VolumeMeter volumeLevel={volumeLevel} className="h-24" />
        </div>

        {/* Switch to text option */}
        <div className="text-center pt-4">
          <button
            onClick={onSwitchToText}
            className="text-blue-600 hover:text-blue-700 underline text-base"
          >
            Oder schreiben Sie stattdessen
          </button>
        </div>
      </div>
    );
  }

  // Show initial state (ready to record)
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Instruction */}
      <p className="text-lg text-center text-gray-700">
        Klicken Sie auf &quot;Aufnehmen&quot; und erzählen Sie Ihre Geschichte
      </p>

      {/* Large record button */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={handleStartRecording}
          className="w-[120px] h-[120px] rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shadow-lg group"
          aria-label="Aufnahme starten"
        >
          {/* Microphone icon */}
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <p className="text-xl font-medium text-gray-900">Aufnehmen</p>
      </div>

      {/* Switch to text option */}
      <div className="text-center pt-4">
        <button
          onClick={onSwitchToText}
          className="text-blue-600 hover:text-blue-700 underline text-base"
        >
          Oder schreiben Sie stattdessen
        </button>
      </div>
    </div>
  );
}
