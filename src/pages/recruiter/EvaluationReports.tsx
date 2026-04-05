import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Eye, Users, TrendingUp, BarChart3 } from 'lucide-react';

const EvaluationReports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['recruiter-evaluation-reports'],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from('evaluation_reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (data && data.length > 0) return data;
      } catch (e) {
        console.log('DB not ready, using demo');
      }
      
      // Always fallback to demo data
      const demoData = await fetch('/data/evaluationReports.json').then(r => r.json());
      return demoData;
    },
  });

  const stats = reports?.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Evaluation Reports</h1>
          <p className="text-muted-foreground">Candidate evaluation and assessment reports</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Reports ({stats})</CardTitle>
            <Badge variant="outline">{stats} reports</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
{reports.map((report: any) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">Candidate #{report.candidate_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{report.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No evaluation reports yet</p>
                <Button className="mt-4">Create First Report</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationReports;

