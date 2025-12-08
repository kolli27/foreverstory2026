'use client';

import { useState } from 'react';
import { WritingModeSelector, WritingMode } from './writing-mode-selector';
import { TextEditor } from './text-editor';
import { VoiceRecorder } from '@/components/voice/voice-recorder';
import { TranscriptionLoading } from '@/components/voice/transcription-loading';
import { TranscriptionEditor } from '@/components/voice/transcription-editor';
import { getPublicUrl } from '@/lib/storage/s3-upload';

interface StoryInputProps {
  questionId: string;
  userId: string;
  initialContent?: string;
  storyId?: string;
}

type VoiceState = 'recording' | 'transcribing' | 'editing' | 'error';

export function StoryInput({
  questionId,
  userId,
  initialContent = '',
  storyId,
}: StoryInputProps) {
  const [mode, setMode] = useState<WritingMode>('text');
  const [voiceState, setVoiceState] = useState<VoiceState>('recording');
  const [transcribedText, setTranscribedText] = useState('');
  const [transcriptionConfidence, setTranscriptionConfidence] = useState(0);
  const [currentStoryId, setCurrentStoryId] = useState(storyId);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRecordingComplete = async (blob: Blob, duration: number) => {
    setVoiceState('transcribing');
    setErrorMessage('');

    try {
      // Get presigned URL
      const response = await fetch(
        `/api/upload/presigned-url?fileType=audio&storyId=${currentStoryId || 'temp'}&contentType=${encodeURIComponent(blob.type)}`
      );

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { presignedUrl, key } = await response.json();

      // Upload to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': blob.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload audio');
      }

      // Save story with audio URL
      const saveResponse = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          status: 'DRAFT',
          inputMode: 'voice',
          audioUrl: key,
          audioDuration: duration,
          storyId: currentStoryId,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save story');
      }

      const saveData = await saveResponse.json();
      const savedStoryId = saveData.id;
      setCurrentStoryId(savedStoryId);

      // Get public URL for transcription
      const publicAudioUrl = getPublicUrl(key);

      // Transcribe audio
      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioUrl: publicAudioUrl,
          storyId: savedStoryId,
        }),
      });

      if (!transcribeResponse.ok) {
        throw new Error('Transcription failed');
      }

      const transcribeData = await transcribeResponse.json();

      if (transcribeData.success && transcribeData.transcription) {
        setTranscribedText(transcribeData.transcription.text);
        setTranscriptionConfidence(transcribeData.transcription.confidence);
        setVoiceState('editing');
      } else {
        throw new Error('Transcription failed');
      }
    } catch (error) {
      console.error('Error in voice recording flow:', error);
      setErrorMessage(
        'Die Transkription ist fehlgeschlagen. Bitte geben Sie Ihren Text manuell ein.'
      );
      setVoiceState('error');
    }
  };

  const handleSwitchToText = () => {
    setMode('text');
    setVoiceState('recording');
    setErrorMessage('');
  };

  const handleReRecord = () => {
    setVoiceState('recording');
    setTranscribedText('');
    setTranscriptionConfidence(0);
    setErrorMessage('');
  };

  const handleTranscriptionTextChange = (text: string) => {
    setTranscribedText(text);
  };

  const handleTranscriptionSubmit = async () => {
    try {
      // Update story with final content
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          content: transcribedText,
          status: 'SUBMITTED',
          inputMode: 'voice',
          storyId: currentStoryId,
        }),
      });

      if (response.ok) {
        // Redirect to success page or story list
        window.location.href = '/stories';
      }
    } catch (error) {
      console.error('Failed to submit story:', error);
      setErrorMessage('Fehler beim Absenden der Geschichte. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <WritingModeSelector mode={mode} onModeChange={setMode} />

      {/* Conditional input based on mode */}
      {mode === 'text' ? (
        <TextEditor
          questionId={questionId}
          userId={userId}
          initialContent={initialContent}
          storyId={currentStoryId}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Voice recording flow states */}
          {voiceState === 'recording' && (
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              onSwitchToText={handleSwitchToText}
            />
          )}

          {voiceState === 'transcribing' && (
            <TranscriptionLoading />
          )}

          {voiceState === 'editing' && (
            <TranscriptionEditor
              transcribedText={transcribedText}
              confidence={transcriptionConfidence}
              onTextChange={handleTranscriptionTextChange}
              onSubmit={handleTranscriptionSubmit}
              onReRecord={handleReRecord}
            />
          )}

          {voiceState === 'error' && (
            <div className="space-y-6">
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-lg text-red-800 mb-4">{errorMessage}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleReRecord}
                    className="px-8 py-4 text-lg font-medium border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-colors min-h-[44px]"
                  >
                    Erneut versuchen
                  </button>
                  <button
                    onClick={handleSwitchToText}
                    className="px-8 py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors min-h-[44px]"
                  >
                    Stattdessen Text eingeben
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
