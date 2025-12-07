'use client';

import { useState } from 'react';

type WritingMode = 'text' | 'voice';

export function WritingModeSelector() {
  const [mode, setMode] = useState<WritingMode>('text');

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Text mode button */}
      <button
        onClick={() => setMode('text')}
        className={`
          flex-1 flex items-center justify-center gap-3 px-8 py-6 rounded-lg border-2 transition-all
          ${
            mode === 'text'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }
        `}
        aria-pressed={mode === 'text'}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span className="text-lg font-medium">Text eingeben</span>
      </button>

      {/* Voice mode button - Disabled in Phase 1 */}
      <button
        onClick={() => setMode('voice')}
        disabled
        className="
          flex-1 flex items-center justify-center gap-3 px-8 py-6 rounded-lg border-2
          border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed
        "
        aria-pressed={mode === 'voice'}
        aria-disabled="true"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        <span className="text-lg font-medium">Aufnehmen</span>
        <span className="text-sm">(bald verfügbar)</span>
      </button>
    </div>
  );
}
