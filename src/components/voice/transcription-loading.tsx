'use client';

interface TranscriptionLoadingProps {
  className?: string;
}

export function TranscriptionLoading({ className = '' }: TranscriptionLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-6 py-12 ${className}`}>
      {/* Animated spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-medium text-gray-900">
          Ihre Aufnahme wird transkribiert...
        </h3>
        <p className="text-base text-gray-600 max-w-md">
          Dies kann einen Moment dauern. Bitte haben Sie etwas Geduld.
        </p>
      </div>

      {/* Progress dots animation */}
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
