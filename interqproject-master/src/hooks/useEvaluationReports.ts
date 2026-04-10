import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import type { CandidateEvaluation } from '@/types/candidateEvaluation';

import { DetailedCandidate, getStatsFromCandidates } from '@/data/candidateEvaluationsMock';
import { getDashboardStats } from '@/services/reportService';

export interface DashboardStats {
  approved: number;
  hold: number;
  rejected: number;
  pending: number;
  total: number;
}

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
      const { mockCandidates } = await import('@/data/candidateEvaluationsMock');
      let data = mockCandidates as DetailedCandidate[];
      
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

  const statsQuery = useQuery<DashboardStats>({
    queryKey: ['evaluation-stats', filters],
    queryFn: async () => {
      const { mockCandidates } = await import('@/data/candidateEvaluationsMock');
      return getDashboardStats(mockCandidates);
    },
    refetchInterval: 30000, // 30s polling
  });

  return {
    reports: reportsQuery.data || [],
    report: reportQuery.data,
    stats: statsQuery.data || { approved: 0, hold: 0, rejected: 0, pending: 0, total: 0 },
    isLoading: reportsQuery.isLoading || reportQuery.isLoading || statsQuery.isLoading,
    refetch: reportsQuery.refetch,
    updateNotes: updateNotesMutation.mutate,
    addTag: addTagMutation.mutate,
  };

};

