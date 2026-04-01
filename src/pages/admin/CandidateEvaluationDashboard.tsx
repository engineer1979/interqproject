import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileText, BarChart3, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SimpleAuthContext';

interface Candidate {
  id: string;
  name: string;
  position: string;
  interviewer: string;
  date: string;
  overallScore: number;
  status: 'advance' | 'advance-reserve' | 'reject';
}

const CandidateEvaluationDashboard = () => {
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  const { data: candidates, isLoading } = useQuery<Candidate[]>({
    queryKey: ['candidates'],
    queryFn: async () => {
      const { data } = await supabase
        .from('candidates')
        .select('*')
        .order('date', { ascending: false });
      return data || [];
    },
  });

  const filteredCandidates = candidates?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.position.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'advance': return <Badge className="bg-green-100 text-green-800">Advance</Badge>;
      case 'advance-reserve': return <Badge className="bg-yellow-100 text-yellow-800">Advance w/ Reservations</Badge>;
      case 'reject': return <Badge className="bg-red-100 text-red-800">Do Not Advance</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidate Evaluations</h1>
          <p className="text-muted-foreground">Review and analyze interview evaluations</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search candidates..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Evaluation
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-all border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.position}</p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {candidate.overallScore.toFixed(1)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Interviewer</span>
                  <span className="font-medium">{candidate.interviewer}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Date</span>
                  <span className="font-medium">{new Date(candidate.date).toLocaleDateString()}</span>
                </div>
                {getStatusBadge(candidate.status)}
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <Card className="text-center p-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No evaluations found</h3>
          <p className="text-muted-foreground mb-4">Create your first candidate evaluation to get started</p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Evaluation
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CandidateEvaluationDashboard;

