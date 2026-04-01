import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import CandidateReport from '@/components/admin/CandidateReport';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const EvaluationReportPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('candidate_dashboard')
        .select('*')
        .eq('id', id!)
        .single();
      return data;
    },
  });

  const { data: evaluations } = useQuery({
    queryKey: ['evaluations', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('evaluations')
        .select('*')
        .eq('candidate_id', id!)
        .order('created_at');
      return data || [];
    },
    enabled: !!id,
  });

  const { data: finalDecision } = useQuery({
    queryKey: ['finalDecision', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('final_decision')
        .select('*')
        .eq('candidate_id', id!)
        .single();
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!candidate) {
    return <div>Candidate not found</div>;
  }

  return (
    <div>
      <CandidateReport 
        candidate={candidate} 
        evaluations={evaluations || []} 
        finalDecision={finalDecision || null} 
      />
    </div>
  );
};

export default EvaluationReportPage;

