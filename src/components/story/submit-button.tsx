'use client';

import { useState } from 'react';

interface SubmitButtonProps {
  onClick: () => void;
  disabled: boolean;
  wordCount: number;
}

export function SubmitButton({
  onClick,
  disabled,
  wordCount,
}: SubmitButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onClick();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          flex-1 sm:flex-none px-8 py-4 rounded-lg text-lg font-medium
          transition-all min-h-[44px]
          ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
          }
        `}
        aria-label="Geschichte absenden"
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Geschichte absenden
        </span>
      </button>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 id="confirm-title" className="text-2xl font-bold text-gray-900">
              Geschichte absenden?
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed">
              Möchten Sie Ihre Geschichte jetzt absenden? Ihre Familie kann sie
              dann lesen.
            </p>

            <p className="text-base text-gray-600">
              Sie haben {wordCount} Wörter geschrieben.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleCancel}
                className="
                  flex-1 px-6 py-3 rounded-lg text-lg font-medium
                  bg-gray-200 text-gray-700 hover:bg-gray-300
                  transition-colors min-h-[44px]
                "
              >
                Noch nicht
              </button>
              <button
                onClick={handleConfirm}
                className="
                  flex-1 px-6 py-3 rounded-lg text-lg font-medium
                  bg-blue-600 text-white hover:bg-blue-700
                  transition-colors min-h-[44px]
                "
                autoFocus
              >
                Ja, absenden
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
