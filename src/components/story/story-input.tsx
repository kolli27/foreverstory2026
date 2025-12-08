'use client';

import { useState } from 'react';
import { WritingModeSelector, WritingMode } from './writing-mode-selector';
import { TextEditor } from './text-editor';
import { VoiceRecorder } from '@/components/voice/voice-recorder';

interface StoryInputProps {
  questionId: string;
  userId: string;
  initialContent?: string;
  storyId?: string;
}

export function StoryInput({
  questionId,
  userId,
  initialContent = '',
  storyId,
}: StoryInputProps) {
  const [mode, setMode] = useState<WritingMode>('text');

  const handleRecordingComplete = async (blob: Blob, duration: number) => {

    // Upload audio to S3
    try {
      // Get presigned URL
      const response = await fetch(
        `/api/upload/presigned-url?fileType=audio&storyId=${storyId || 'temp'}&contentType=${encodeURIComponent(blob.type)}`
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
          audioUrl: key, // Store S3 key
          audioDuration: duration,
          storyId,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save story');
      }

      // TODO: Show success message and move to transcription phase
      console.log('Audio uploaded successfully');
    } catch (error) {
      console.error('Error uploading audio:', error);
      // TODO: Show error message to user
    }
  };

  const handleSwitchToText = () => {
    setMode('text');
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
          storyId={storyId}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            onSwitchToText={handleSwitchToText}
          />
        </div>
      )}
    </div>
  );
}
