interface QuestionDisplayProps {
  question: {
    id: string;
    textDe: string;
    category: string;
  };
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {/* Category badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {getCategoryLabel(question.category)}
        </span>
      </div>

      {/* Question text - Large and clear for elderly users */}
      <p className="text-2xl leading-relaxed text-gray-900">
        {question.textDe}
      </p>

      {/* Helper text */}
      <p className="mt-6 text-base text-gray-600">
        Nehmen Sie sich Zeit und erzählen Sie so viel Sie möchten. Es gibt keine
        Eile.
      </p>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    CHILDHOOD: 'Kindheit',
    EDUCATION: 'Ausbildung',
    CAREER: 'Beruf',
    FAMILY: 'Familie',
    RELATIONSHIPS: 'Beziehungen',
    WAR_POSTWAR: 'Krieg und Nachkriegszeit',
    DDR: 'DDR-Erinnerungen',
    REUNIFICATION: 'Wiedervereinigung',
    TRADITIONS: 'Traditionen',
    LIFE_LESSONS: 'Lebenslektionen',
    CUSTOM: 'Persönlich',
  };

  return labels[category] || category;
}
