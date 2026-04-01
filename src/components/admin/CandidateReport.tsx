import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer as RechartsResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { Candidate, EvaluationItem, FinalDecision } from '@/types/candidateEvaluation';

interface Props {
  candidate: Candidate;
  evaluations: EvaluationItem[];
  finalDecision: FinalDecision | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CandidateReport = ({ candidate, evaluations, finalDecision }: Props) => {
  const averageScore = evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length;
  const strengths = evaluations.filter(e => e.rating >= 4).map(e => e.category);
  const weaknesses = evaluations.filter(e => e.rating <= 2).map(e => e.category);

  const radarData = evaluations.map(e => ({
    category: e.category,
    rating: e.rating,
    fullMark: 5,
  }));

  const barData = evaluations.reduce((acc, e) => {
    acc[e.category] = e.rating;
    return acc;
  }, {} as Record<string, number>);

  const decisionData = [
    { name: 'Advance', value: finalDecision?.recommendation === 'Advance' ? 1 : 0 },
    { name: 'Reservations', value: finalDecision?.recommendation === 'Advance with Reservations' ? 1 : 0 },
    { name: 'Do Not Advance', value: finalDecision?.recommendation === 'Do Not Advance' ? 1 : 0 },
  ];

  const exportPDF = () => {
    // jsPDF implementation
    window.print();
  };

  const exportCSV = () => {
    const csv = evaluations.map(e => `${e.category},${e.rating},"${e.comments || ''}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.name}_evaluation.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{candidate.name}</h1>
          <p className="text-xl text-muted-foreground">{candidate.position}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPDF}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills Radar Chart</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData as any}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <Radar name="Rating" dataKey="rating" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Score: {averageScore.toFixed(1)}/5</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant={finalDecision?.recommendation === 'Advance' ? 'default' : 'secondary'}>
                  {finalDecision?.recommendation}
                </Badge>
              </div>
              <div>
                <span>Education Verified</span>
                <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  finalDecision?.education 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {finalDecision?.education ? 'Yes' : 'No'}
                </div>
              </div>
              {strengths.length > 0 && (
                <div>
                  <span className="font-medium">Strengths:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {strengths.map(s => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {weaknesses.length > 0 && (
                <div>
                  <span className="font-medium">Weaknesses:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {weaknesses.map(w => (
                      <Badge key={w} variant="destructive">{w}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Ratings</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.entries(barData).map(([category, rating]) => ({ category, rating })) as any}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} height={60} />
              <YAxis type="number" domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Impression</CardTitle>
          </CardHeader>
          <CardContent>
                <p className="whitespace-pre-wrap">{finalDecision?.overallComments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Individual Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evaluations.map((e) => (
                <div key={e.id} className="border-l-4 border-muted pl-4">
                  <h4 className="font-medium">{e.category}: {e.rating}/5</h4>
                  {e.comments && <p className="text-sm text-muted-foreground mt-1">{e.comments}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateReport;

