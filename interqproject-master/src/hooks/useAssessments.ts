import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { assessmentsData, Assessment } from '@/data/assessments';

export function useAssessments() {
  const query = useQuery({
    queryKey: ['assessments'] as const,
    queryFn: async (): Promise<Assessment[]> => {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('status', 'active')
          .order('title', { ascending: true });

        if (error) {
          console.warn('Using mock assessments data:', error.message);
          return assessmentsData;
        }

        if (!data || data.length === 0) {
          console.log('No assessments in database, using mock data');
          return assessmentsData;
        }

        return data;
      } catch (err) {
        console.warn('Error fetching assessments, using mock data:', err);
        return assessmentsData;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return query;
}

