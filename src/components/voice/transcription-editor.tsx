'use client';

import { useState, useEffect } from 'react';

interface TranscriptionEditorProps {
  transcribedText: string;
  confidence: number;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onReRecord: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export function TranscriptionEditor({
  transcribedText,
  confidence,
  onTextChange,
  onSubmit,
  onReRecord,
  isSubmitting = false,
  className = '',
}: TranscriptionEditorProps) {
  const [content, setContent] = useState(transcribedText);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Update content when transcribedText changes
  useEffect(() => {
    setContent(transcribedText);
  }, [transcribedText]);

  // Calculate word and character count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setCharCount(content.length);
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onTextChange(newContent);
  };

  const showLowConfidenceWarning = confidence < 0.8;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Transcription header with label */}
      <div>
        <label htmlFor="transcription-content" className="block text-lg font-medium text-gray-900 mb-2">
          Transkription bearbeiten
        </label>
        {showLowConfidenceWarning && (
          <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <p className="text-base text-yellow-800">
              Die automatische Transkription war unsicher. Bitte überprüfen Sie den Text sorgfältig.
            </p>
          </div>
        )}
        <p className="text-base text-gray-600">
          Überprüfen und bearbeiten Sie Ihre transkribierte Geschichte. Sie können den Text nach Belieben ändern.
        </p>
      </div>

      {/* Editable textarea */}
      <div>
        <textarea
          id="transcription-content"
          value={content}
          onChange={handleContentChange}
          className="
            w-full min-h-[400px] px-4 py-3 text-lg leading-relaxed
            border-2 border-gray-200 rounded-lg
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
            resize-y
            placeholder:text-gray-400
          "
          style={{ fontSize: '18px' }} // Ensure minimum 18px font for elderly users
          aria-describedby="transcription-word-count transcription-char-count"
          placeholder="Ihre transkribierte Geschichte erscheint hier..."
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span id="transcription-word-count" aria-live="polite">
            {wordCount} {wordCount === 1 ? 'Wort' : 'Wörter'}
          </span>
          <span id="transcription-char-count" aria-live="polite">
            {charCount} Zeichen
          </span>
          {confidence > 0 && (
            <span className="text-gray-500">
              Genauigkeit: {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onReRecord}
          disabled={isSubmitting}
          className="px-8 py-4 text-lg font-medium border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Neu aufnehmen
        </button>
        <button
          onClick={onSubmit}
          disabled={!content.trim() || wordCount < 10 || isSubmitting}
          className="flex-1 px-8 py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors min-h-[44px] disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Wird abgesendet...' : 'Geschichte absenden'}
        </button>
      </div>

      {/* Helper text */}
      {content.trim() && wordCount < 10 && (
        <p className="text-sm text-amber-600" role="alert">
          Bitte schreiben Sie mindestens 10 Wörter, bevor Sie absenden.
        </p>
      )}
    </div>
  );
}
