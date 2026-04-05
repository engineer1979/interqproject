import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, TrendingUp, Users, BarChart3, FileText } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EvaluationStats {
  avgScore: number;
  passRate: number;
  totalCandidates: number;
  topSkills: string[];
}

const CompanyReports = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<EvaluationStats>({
    queryKey: ['company-reports', user?.companyId || user?.id],
    queryFn: async () => {
      if (!user?.companyId) {
        // Mock data for demo
        return {
          avgScore: 82.5,
          passRate: 68,
          totalCandidates: 47,
          topSkills: ['AWS', 'React', 'Python', 'Kubernetes', 'Docker'],
        };
      }

      const { data: evaluations } = await supabase
        .from('evaluations')
        .select('rating, category')
        .eq('company_id', user.companyId);

      const avgScore = evaluations?.reduce((sum, e) => sum + e.rating, 0) / evaluations?.length || 0;
      const passRate = evaluations?.filter((e: any) => e.rating >= 70).length / evaluations?.length * 100 || 0;
      
      return {
        avgScore,
        passRate,
        totalCandidates: evaluations?.length || 0,
        topSkills: ['AWS', 'React', 'Python', 'Kubernetes'],
      };
    },
  });

  const radarData = [
    { skill: 'AWS', score: 85, full: 100 },
    { skill: 'React', score: 78, full: 100 },
    { skill: 'Python', score: 92, full: 100 },
    { skill: 'Kubernetes', score: 71, full: 100 },
  ];

  const barData = [
    { name: 'Q1', score: 65 },
    { name: 'Q2', score: 78 },
    { name: 'Q3', score: 82 },
    { name: 'Q4', score: 88 },
  ];

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  const exportReport = () => {
    // Mock export
    const dataStr = `Avg Score,${stats.avgScore.toFixed(1)}%\nPass Rate,${stats.passRate.toFixed(1)}%\nCandidates,${stats.totalCandidates}`;
    const dataUri = 'data:application/csv;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'company-reports.csv';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
<h2 className="text-2xl font-bold">Candidate Evaluation Reports</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Company-wide analytics | <Button variant="link" onClick={() => navigate('/company/evaluation-reports')} className="h-auto p-0 text-primary hover:text-primary/80">View Individual Reports →</Button></p>
          <p className="text-muted-foreground">Comprehensive candidate assessment analytics</p>
        </div>
        <Button onClick={exportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stats Cards */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-2">{stats.avgScore.toFixed(1)}%</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {stats.totalCandidates} candidates evaluated
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Pass Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-600 mb-2">{stats.passRate.toFixed(1)}%</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Top skills: {stats.topSkills.slice(0, 3).join(', ')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Radar (Latest Cohort)</CardTitle>
          </CardHeader>
          <CardContent className="h-80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Cohort Performance Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyReports;

