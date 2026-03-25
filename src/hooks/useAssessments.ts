import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { globalITAssessmentSystem } from '@/data/globalITAssessmentSystem';
import { Assessment } from '@/types/assessment';

export function useAssessments() {
  console.log('🔄 useAssessments: Starting query');
  const query = useQuery({
    queryKey: ['assessments'] as const,
    queryFn: async (): Promise<Assessment[]> => {
      console.log('📡 Supabase query started');
      const start = Date.now();
      const { data, error } = await supabase
        .from('assessments')
        .select(`
          *,
          assessment_questions!inner(count)
        `)
        .order('created_at', { ascending: false });

      const duration = Date.now() - start;
      console.log(`📡 Supabase query complete: ${duration}ms, data: ${data?.length || 0}, error:`, error);

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      // Map count
      const assessments: Assessment[] = (data || []).map((row: any) => ({
        ...row,
        total_questions: row.assessment_questions?.[0]?.count || 0,
        domain: row.domain || row.category,
      }));

      console.log(`✅ Mapped ${assessments.length} assessments`);

      // Hybrid fallback
      if (assessments.length === 0) {
        console.log('🔄 DB empty → Loading mocks');
        return globalITAssessmentSystem.domains.map(domain => ({
          id: domain.id,
          title: domain.name,
          description: `Professional ${domain.name} assessment`,
          duration_minutes: 60,
          passing_score: 70,
          total_questions: domain.questionCount,
          difficulty: domain.difficulty,
          category: domain.category,
          tags: domain.tags,
          is_active: true,
          created_at: new Date().toISOString(),
        }));
      }

      return assessments;
    },
    retry: 3,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (query.error) {
    console.error('💥 Final query error:', query.error);
  }

  console.log('🔍 useAssessments render: isLoading=', query.isLoading, 'data=', query.data?.length, 'error=', !!query.error);

  return query;
}

