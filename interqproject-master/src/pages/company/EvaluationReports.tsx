import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CompanyEvaluationReports = () => {
  const { user } = useAuth();

  const { data: reports } = useQuery({
    queryKey: ['company-evaluation-reports'],
    queryFn: async () => {
      const { data } = await supabase
        .from('evaluation_reports')
        .select(`
          *,
          candidates (name, email),
          assessment_results (score)
        `);
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Evaluation Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Company-level analytics and aggregated candidate evaluations.</p>
          <ul className="mt-4 space-y-2">
            {reports?.map((report: any) => (
              <li key={report.id} className="flex justify-between">
                <span>{report.title}</span>
                <span>{report.score}%</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyEvaluationReports;

