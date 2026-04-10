import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getQuestionsForAssessment, AssessmentQuestion } from '@/data/assessmentQuestions';

const TOTAL_QUESTIONS = 20;
const ASSESSMENT_DURATION_MINUTES = 25;

export { TOTAL_QUESTIONS, ASSESSMENT_DURATION_MINUTES };

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function useAssessmentQuestions(assessmentId: string | undefined) {
  return useQuery({
    queryKey: ['assessment-questions', assessmentId],
    enabled: !!assessmentId,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<AssessmentQuestion[]> => {
      try {
        // Try fetching from Supabase first
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('assessment_id', assessmentId)
          .limit(60);

        if (!error && data && data.length > 0) {
          const mapped: AssessmentQuestion[] = data.map((q: any) => ({
            id: q.id,
            assessment_id: q.assessment_id,
            question: q.question_text ?? q.question,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_answer: q.correct_answer,
            difficulty: q.difficulty ?? 'medium',
          }));
          const shuffled = shuffleArray(mapped);
          return shuffled.slice(0, TOTAL_QUESTIONS);
        }
      } catch (e) {
        console.warn('Supabase question fetch failed, using local data:', e);
      }

      // Fallback: local mock data
      const local = getQuestionsForAssessment(assessmentId!);
      if (local.length > 0) {
        return shuffleArray(local).slice(0, TOTAL_QUESTIONS);
      }

      // Last resort: generate placeholder questions
      return Array.from({ length: TOTAL_QUESTIONS }, (_, i) => ({
        id: `${assessmentId}_q${i + 1}`,
        assessment_id: assessmentId!,
        question: `Question ${i + 1}: Which of the following best describes this concept?`,
        option_a: 'First possible answer',
        option_b: 'Second possible answer',
        option_c: 'Third possible answer',
        option_d: 'Fourth possible answer',
        correct_answer: ['A', 'B', 'C', 'D'][i % 4],
        difficulty: 'medium' as const,
      }));
    },
  });
}
