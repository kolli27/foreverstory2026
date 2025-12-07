'use client';

interface SaveDraftButtonProps {
  onClick: () => void;
  disabled: boolean;
  isDirty: boolean;
}

export function SaveDraftButton({
  onClick,
  disabled,
  isDirty,
}: SaveDraftButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex-1 sm:flex-none px-8 py-4 rounded-lg text-lg font-medium
        transition-all min-h-[44px]
        ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
        }
      `}
      aria-label="Entwurf speichern"
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
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
        Entwurf speichern
        {isDirty && <span className="text-sm">(ungespeichert)</span>}
      </span>
    </button>
  );
}
