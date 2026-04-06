import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import type { CandidateEvaluation } from '@/types/candidateEvaluation';

export const useEvaluationReports = ({
  role = 'recruiter',
  filters = {},
  page = 1,
  limit = 20,
} : {
  role?: 'recruiter' | 'company' | 'admin';
  filters?: {
    status?: string;
    minScore?: number;
    search?: string;
    dateRange?: [string, string];
  };
  page?: number;
  limit?: number;
}) => {
  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: ['evaluation-reports', role, filters, page],
    queryFn: async () => {
      // Mock data fallback for demo
      const { mockCandidates } = await import('@/data/candidateEvaluationsMock');
      let data = mockCandidates as any[];
      
      // Apply filters to mock data
      if (filters.status) {
        data = data.filter(c => c.status === filters.status);
      }
      if (filters.minScore) {
        data = data.filter(c => c.overallScore * 20 >= filters.minScore); // Convert 5-scale to 100
      }
      if (filters.search) {
        data = data.filter(c => c.name.toLowerCase().includes(filters.search.toLowerCase()) || c.position.toLowerCase().includes(filters.search.toLowerCase()));
      }

      // Pagination
      const start = (page - 1) * limit;
      return data.slice(start, start + limit);
    },
  });

  const reportQuery = useQuery({
    queryKey: ['evaluation-report', role],
    queryFn: async ({ queryKey }: any) => {
      const [, , id] = queryKey;
      const { data, error } = await supabase
        .from('candidate_evaluations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as CandidateEvaluation;
    },
    enabled: false,
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('candidate_evaluations')
        .update({ recruiterNotes: notes })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation-reports'] });
    },
  });

  const addTagMutation = useMutation({
    mutationFn: async ({ id, tag }: { id: string; tag: string }) => {
      // Implement tag array update
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation-reports'] });
    },
  });

  return {
    reports: reportsQuery.data || [],
    report: reportQuery.data,
    isLoading: reportsQuery.isLoading || reportQuery.isLoading,
    refetch: reportsQuery.refetch,
    updateNotes: updateNotesMutation.mutate,
    addTag: addTagMutation.mutate,
  };
};

