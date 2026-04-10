import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Interview {
  id: string;
  title: string;
  job_role?: string;
  description?: string;
  duration_minutes: number;
  is_published?: boolean;
  meeting_link?: string;
  scheduled_at?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  candidate_id?: string;
  job_id?: string;
  interviewer_id?: string;
  feedback?: string;
  score?: number;
  created_at: string;
  updated_at: string;
}

export interface InterviewSession {
  id: string;
  user_id?: string;
  interview_id?: string;
  title?: string;
  job_role?: string;
  duration_minutes: number;
  status: string;
  completed: boolean;
  score?: number;
  feedback?: string;
  notes?: string;
  meeting_link?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
  interviews?: Interview;
}

export function useInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInterviews(data || []);
    } catch (err: any) {
      console.error('Error fetching interviews:', err);
      setError(err.message || 'Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('interview_sessions')
        .select('*, interviews(*)')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setSessions(data || []);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError(err.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleInterview = useCallback(async (sessionData: {
    user_id?: string;
    interview_id?: string;
    title?: string;
    job_role?: string;
    duration_minutes?: number;
    scheduled_at?: string;
    meeting_link?: string;
  }) => {
    try {
      const { data, error: insertError } = await supabase
        .from('interview_sessions')
        .insert({
          ...sessionData,
          status: 'scheduled',
          completed: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      await fetchSessions();
      return { success: true, session: data };
    } catch (err: any) {
      console.error('Error scheduling interview:', err);
      return { success: false, error: err.message };
    }
  }, [fetchSessions]);

  const completeInterview = useCallback(async (sessionId: string, feedback: string, score: number) => {
    try {
      const { error: updateError } = await supabase
        .from('interview_sessions')
        .update({
          status: 'completed',
          completed: true,
          feedback,
          score,
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;
      await fetchSessions();
      return { success: true };
    } catch (err: any) {
      console.error('Error completing interview:', err);
      return { success: false, error: err.message };
    }
  }, [fetchSessions]);

  const cancelInterview = useCallback(async (sessionId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('interview_sessions')
        .update({
          status: 'cancelled',
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;
      await fetchSessions();
      return { success: true };
    } catch (err: any) {
      console.error('Error cancelling interview:', err);
      return { success: false, error: err.message };
    }
  }, [fetchSessions]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const upcomingSessions = sessions.filter(s => !s.completed && s.status !== 'completed');
  const completedSessions = sessions.filter(s => s.completed || s.status === 'completed');
  const publishedInterviews = interviews.filter(i => i.is_published);

  return {
    interviews,
    sessions,
    loading,
    error,
    fetchInterviews,
    fetchSessions,
    scheduleInterview,
    completeInterview,
    cancelInterview,
    upcomingSessions,
    completedSessions,
    publishedInterviews,
  };
}
