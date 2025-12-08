'use client';

import { useState } from 'react';
import { StoryInput } from '@/components/story/story-input';

// Test question for manual testing
const TEST_QUESTION = {
  id: 'test-question-1',
  textDe: 'Was war Ihr schönster Sommerurlaub als Kind?',
  textEn: 'What was your favorite summer vacation as a child?',
  category: 'childhood',
  region: 'general',
};

// Test user ID (only for development testing)
const TEST_USER_ID = 'test-user-dev';

/**
 * Test page for manual testing of the complete story submission flow
 * This page is only available in development mode
 *
 * Features tested:
 * - Text input with character count
 * - Voice recording with waveform visualization
 * - German transcription via Gladia
 * - Photo upload with client-side resize
 * - Draft saving
 * - Story submission
 * - Accessibility (keyboard nav, ARIA, focus management)
 */
export default function StoryFlowTestPage() {
  const [key, setKey] = useState(0);

  const handleReset = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Development Warning Banner */}
      <div className="bg-yellow-100 border-b-2 border-yellow-400 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-yellow-800">
            🧪 <strong>TEST MODE</strong> - This page is for manual testing only.
            No data is saved to the database.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Story Submission Flow Test
          </h1>
          <p className="text-gray-600">
            Test all features: text input, voice recording, transcription, photo upload,
            drafts, and submission.
          </p>
        </div>

        {/* Test Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold">?</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Test Frage
              </h2>
              <p className="text-gray-600">
                {TEST_QUESTION.textDe}
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {TEST_QUESTION.category}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              {TEST_QUESTION.region}
            </span>
          </div>
        </div>

        {/* Story Input Component */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <StoryInput
            key={key}
            questionId={TEST_QUESTION.id}
            userId={TEST_USER_ID}
          />
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Reset Form
          </button>
        </div>

        {/* Testing Checklist */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Manual Testing Checklist
          </h3>
          <ul className="space-y-2 text-sm text-blue-900">
            <li className="flex gap-2">
              <span>☐</span>
              <span>Text input works and character count updates</span>
            </li>
            <li className="flex gap-2">
              <span>☐</span>
              <span>Voice recording starts/stops with visual feedback</span>
            </li>
            <li className="flex gap-2">
              <span>☐</span>
              <span>Transcription generates German text from audio</span>
            </li>
            <li className="flex gap-2">
              <span>☐</span>
              <span>Photos can be uploaded and display correctly</span>
            </li>
            <li className="flex gap-2">
              <span>☐</span>
              <span>Large photos are resized client-side (&lt;2MB)</span>
            </li>
            <li className="flex gap-2">
              <span>☐</span>
              <span>Draft saving works and persists across page reload</span>
            </li>
            <li className="flex gap-2">
              <span>☐</span>
              <span>Submit button is disabled until content exists</span>
            </li>
            <li className="flex gap-2">
              <span>☐</span>
              <span>Keyboard navigation works (Tab, Enter, Escape)</span>
            </li>
            <li className="flex gap-2">
              <span>☐</span>
              <span>Screen reader announces status changes</span>
            </li>
            <li className="flex gap-2">
              <span>☐</span>
              <span>Mobile responsive on small screens</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
