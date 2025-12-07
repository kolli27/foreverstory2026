'use client';

import { useState, useEffect, useCallback } from 'react';
import { SaveDraftButton } from './save-draft-button';
import { SubmitButton } from './submit-button';

interface TextEditorProps {
  questionId: string;
  userId: string;
  initialContent?: string;
  storyId?: string;
}

export function TextEditor({
  questionId,
  userId: _userId, // Prefix with underscore to indicate intentionally unused
  initialContent = '',
  storyId,
}: TextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Calculate word and character count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setCharCount(content.length);
  }, [content]);

  // Mark as dirty when content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!isDirty || !content.trim()) return;

    const timer = setTimeout(() => {
      handleSaveDraft();
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [content, isDirty]);

  // Save on blur (when clicking away)
  const handleBlur = useCallback(() => {
    if (isDirty && content.trim()) {
      handleSaveDraft();
    }
  }, [isDirty, content]);

  const handleSaveDraft = async () => {
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          content,
          status: 'DRAFT',
          inputMode: 'text',
          storyId, // Include if updating existing draft
        }),
      });

      if (response.ok) {
        setIsDirty(false);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          content,
          status: 'SUBMITTED',
          inputMode: 'text',
          storyId,
        }),
      });

      if (response.ok) {
        // TODO: Redirect to success page or story list
        window.location.href = '/stories';
      }
    } catch (error) {
      console.error('Failed to submit story:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Textarea - Large and accessible */}
      <div>
        <label htmlFor="story-content" className="sr-only">
          Ihre Geschichte
        </label>
        <textarea
          id="story-content"
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          placeholder="Schreiben Sie Ihre Antwort hier..."
          className="
            w-full min-h-[400px] px-4 py-3 text-lg leading-relaxed
            border-2 border-gray-200 rounded-lg
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
            resize-y
            placeholder:text-gray-400
          "
          style={{ fontSize: '18px' }} // Ensure minimum 16px font
          aria-describedby="word-count char-count"
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span id="word-count" aria-live="polite">
            {wordCount} {wordCount === 1 ? 'Wort' : 'Wörter'}
          </span>
          <span id="char-count" aria-live="polite">
            {charCount} Zeichen
          </span>
        </div>

        {/* Last saved indicator */}
        {lastSaved && (
          <span className="text-gray-500">
            Zuletzt gespeichert:{' '}
            {lastSaved.toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SaveDraftButton
          onClick={handleSaveDraft}
          disabled={!isDirty || !content.trim()}
          isDirty={isDirty}
        />

        <SubmitButton
          onClick={handleSubmit}
          disabled={!content.trim() || wordCount < 10}
          wordCount={wordCount}
        />
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
