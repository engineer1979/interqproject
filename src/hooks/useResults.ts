import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Result {
  id: string;
  candidate_id?: string;
  job_id?: string;
  interview_id?: string;
  assessment_id?: string;
  overall_score: number;
  max_score: number;
  status: 'pending' | 'pass' | 'fail';
  recommendation?: string;
  notes?: string;
  evaluated_by?: string;
  evaluated_at?: string;
  created_at: string;
  updated_at: string;
}

export function useResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('results')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('candidate_id', userId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setResults(data || []);
    } catch (err: any) {
      console.error('Error fetching results:', err);
      setError(err.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }, []);

  const createResult = useCallback(async (resultData: {
    candidate_id?: string;
    job_id?: string;
    interview_id?: string;
    assessment_id?: string;
    overall_score: number;
    max_score?: number;
    status?: 'pending' | 'pass' | 'fail';
    recommendation?: string;
    notes?: string;
    evaluated_by?: string;
  }) => {
    try {
      const { data, error: insertError } = await supabase
        .from('results')
        .insert({
          ...resultData,
          max_score: resultData.max_score || 100,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      await fetchResults();
      return { success: true, result: data };
    } catch (err: any) {
      console.error('Error creating result:', err);
      return { success: false, error: err.message };
    }
  }, [fetchResults]);

  const updateResult = useCallback(async (resultId: string, updates: Partial<Result>) => {
    try {
      const { error: updateError } = await supabase
        .from('results')
        .update(updates)
        .eq('id', resultId);

      if (updateError) throw updateError;
      await fetchResults();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating result:', err);
      return { success: false, error: err.message };
    }
  }, [fetchResults]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const passResults = results.filter(r => r.status === 'pass');
  const failResults = results.filter(r => r.status === 'fail');
  const pendingResults = results.filter(r => r.status === 'pending');

  return {
    results,
    loading,
    error,
    fetchResults,
    createResult,
    updateResult,
    passResults,
    failResults,
    pendingResults,
  };
}
