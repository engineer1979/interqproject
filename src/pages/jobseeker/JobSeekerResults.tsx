import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer as RechartsResponsiveContainer } from 'recharts';
import { Download, Award, Clock, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface AssessmentResult {
  id: string;
  title: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  category: string;
  date: string;
  duration_minutes: number;
}

const JobSeekerResults = () => {
  const { user } = useAuth();

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['user-results', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from('assessment_results')
        .select(`
          *,
          assessments (title, domain, difficulty)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user?.id,
  });

  const averageScore = results.reduce((sum, r) => sum + r.percentage, 0) / results.length || 0;
  const passRate = results.filter(r => r.passed).length / results.length * 100 || 0;

  const radarData = [
    { category: 'Technical', rating: averageScore / 20, fullMark: 5 },
    { category: 'Problem Solving', rating: averageScore / 20, fullMark: 5 },
    { category: 'Communication', rating: averageScore / 20, fullMark: 5 },
  ];

  const recentResults = results.slice(0, 5);

  const exportResults = () => {
    const csv = results.map(r => `${r.assessments.title},${r.percentage}%,${r.passed ? 'Pass' : 'Fail'},${r.created_at}`).join('\\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interq-results.csv';
    a.click();
  };

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Results</h2>
          <p className="text-sm text-muted-foreground">Track your assessment performance and progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportResults}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{averageScore.toFixed(0)}%</div>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">{passRate.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground">Pass Rate</p>
              </div>
              <div>
                <div className="text-lg font-bold">{results.length}</div>
                <p className="text-xs text-muted-foreground">Tests Taken</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Radar</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <Radar name="Averages" dataKey="rating" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performances</CardTitle>
          </CardHeader>
          <CardContent>
            {results.slice(0,3).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{r.assessments?.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">{r.percentage.toFixed(0)}%</div>
                  <Badge variant={r.passed ? "default" : "secondary"} className="text-xs">
                    {r.passed ? "Passed" : "Retake"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentResults.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{r.assessments?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {r.category} • {new Date(r.created_at).toLocaleDateString()} • {r.duration_minutes} min
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{r.percentage.toFixed(0)}%</div>
<Badge variant={r.passed ? "default" : "secondary"}>
                    {r.passed ? "Passed" : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            ))}
            {recentResults.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No results yet. Take your first assessment!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobSeekerResults;

