import { requireAuth } from '@/lib/auth/get-session';
import { QuestionDisplay } from '@/components/story/question-display';
import { StoryInput } from '@/components/story/story-input';

export default async function WritePage() {
  const user = await requireAuth();

  // TODO: Fetch current question from database
  // For now, using mock data
  const currentQuestion = {
    id: 'mock-question-1',
    textDe: 'Erzählen Sie von Ihrer Kindheit. Wo sind Sie aufgewachsen und wie war das Leben in Ihrer Nachbarschaft?',
    category: 'CHILDHOOD' as const,
  };

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Ihre Geschichte schreiben
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Frage der Woche
        </p>
      </div>

      {/* Question display */}
      <QuestionDisplay question={currentQuestion} />

      {/* Story input (Text or Voice mode) - Phase 2 includes voice recording */}
      <StoryInput questionId={currentQuestion.id} userId={user.id} />
    </div>
  );
}
