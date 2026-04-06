import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Report {
  id: string;
  candidate_name: string;
  candidate_email?: string;
  job_id?: string;
  job_title?: string;
  score: number;
  max_score: number;
  status: 'pass' | 'fail' | 'pending';
  interview_date: string;
  generated_by?: string;
  details?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ReportFilters {
  search: string;
  status: 'all' | 'pass' | 'fail' | 'pending';
  dateFrom?: string;
  dateTo?: string;
  minScore?: number;
  maxScore?: number;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    search: '',
    status: 'all',
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Report;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('reports').select('*', { count: 'exact' });

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.dateFrom) {
        query = query.gte('interview_date', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('interview_date', filters.dateTo);
      }

      if (filters.minScore !== undefined) {
        query = query.gte('score', filters.minScore);
      }

      if (filters.maxScore !== undefined) {
        query = query.lte('score', filters.maxScore);
      }

      const { data, error: fetchError, count } = await query
        .order(sortConfig.key, { ascending: sortConfig.direction === 'asc' })
        .range((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize - 1);

      if (fetchError) throw fetchError;

      let filteredData = data || [];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (r) =>
            r.candidate_name.toLowerCase().includes(searchLower) ||
            r.candidate_email?.toLowerCase().includes(searchLower) ||
            r.job_title?.toLowerCase().includes(searchLower)
        );
      }

      setReports(filteredData);
      setPagination((prev) => ({ ...prev, total: count || 0 }));
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize, sortConfig]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const generateReport = useCallback(
    async (reportData: {
      candidate_name: string;
      candidate_email?: string;
      job_id?: string;
      job_title?: string;
      score: number;
      max_score?: number;
      status: 'pass' | 'fail' | 'pending';
      details?: Record<string, any>;
    }) => {
      try {
        const { data, error: insertError } = await supabase
          .from('reports')
          .insert({
            candidate_name: reportData.candidate_name,
            candidate_email: reportData.candidate_email,
            job_id: reportData.job_id,
            job_title: reportData.job_title,
            score: reportData.score,
            max_score: reportData.max_score || 100,
            status: reportData.status,
            details: reportData.details,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        await fetchReports();
        return { success: true, report: data };
      } catch (err: any) {
        console.error('Error generating report:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchReports]
  );

  const deleteReport = useCallback(
    async (reportId: string) => {
      try {
        const { error: deleteError } = await supabase.from('reports').delete().eq('id', reportId);

        if (deleteError) throw deleteError;

        await fetchReports();
        return { success: true };
      } catch (err: any) {
        console.error('Error deleting report:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchReports]
  );

  const updateReport = useCallback(
    async (reportId: string, updates: Partial<Report>) => {
      try {
        const { error: updateError } = await supabase
          .from('reports')
          .update(updates)
          .eq('id', reportId);

        if (updateError) throw updateError;

        await fetchReports();
        return { success: true };
      } catch (err: any) {
        console.error('Error updating report:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchReports]
  );

  const exportToCSV = useCallback(
    (reportsToExport: Report[], filename?: string) => {
      const headers = ['Candidate Name', 'Email', 'Job Title', 'Score', 'Max Score', 'Status', 'Interview Date', 'Created At'];

      const csvRows = [
        headers.join(','),
        ...reportsToExport.map((r) =>
          [
            `"${r.candidate_name}"`,
            `"${r.candidate_email || ''}"`,
            `"${r.job_title || ''}"`,
            r.score,
            r.max_score,
            r.status,
            `"${new Date(r.interview_date).toISOString()}"`,
            `"${new Date(r.created_at).toISOString()}"`,
          ].join(',')
        ),
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', filename || `reports_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    []
  );

  const getStats = useCallback(() => {
    const total = reports.length;
    const passCount = reports.filter((r) => r.status === 'pass').length;
    const failCount = reports.filter((r) => r.status === 'fail').length;
    const pendingCount = reports.filter((r) => r.status === 'pending').length;
    const avgScore = total > 0 ? reports.reduce((acc, r) => acc + (r.score / r.max_score) * 100, 0) / total : 0;

    return { total, passCount, failCount, pendingCount, avgScore };
  }, [reports]);

  return {
    reports,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    sortConfig,
    setSortConfig,
    fetchReports,
    generateReport,
    deleteReport,
    updateReport,
    exportToCSV,
    getStats,
  };
}
