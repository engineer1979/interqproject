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

const RecruiterReports = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<EvaluationStats>({
    queryKey: ['recruiter-reports', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return {
          avgScore: 79.2,
          passRate: 62,
          totalCandidates: 32,
          topSkills: ['JavaScript', 'Node.js', 'SQL', 'Docker'],
        };
      }

      const { data: evaluations } = await supabase
        .from('evaluations')
        .select('rating, category')
        .eq('recruiter_id', user.id);

      const avgScore = evaluations?.reduce((sum, e) => sum + e.rating, 0) / evaluations?.length || 0;
      const passRate = evaluations?.filter((e: any) => e.rating >= 70).length / evaluations?.length * 100 || 0;
      
      return {
        avgScore,
        passRate,
        totalCandidates: evaluations?.length || 0,
        topSkills: ['JavaScript', 'Node.js', 'SQL'],
      };
    },
  });

  const radarData = [
    { skill: 'JavaScript', score: 88, full: 100 },
    { skill: 'Node.js', score: 76, full: 100 },
    { skill: 'SQL', score: 85, full: 100 },
    { skill: 'Docker', score: 72, full: 100 },
  ];

  const barData = [
    { name: 'Week 1', score: 72 },
    { name: 'Week 2', score: 81 },
    { name: 'Week 3', score: 79 },
    { name: 'Week 4', score: 85 },
  ];

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  const exportReport = () => {
    const dataStr = `Avg Score,${stats.avgScore.toFixed(1)}%\nPass Rate,${stats.passRate.toFixed(1)}%\nCandidates,${stats.totalCandidates}`;
    const dataUri = 'data:application/csv;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'recruiter-reports.csv');
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recruiter Reports</h2>
          <p className="text-muted-foreground">Personal evaluation analytics & performance</p>
        </div>
        <Button onClick={exportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
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
              <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                Top skills: {stats.topSkills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skills Radar</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance Trend</CardTitle>
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

export default RecruiterReports;

