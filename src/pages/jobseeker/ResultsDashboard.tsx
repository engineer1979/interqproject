import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Star, BookOpen, Clock, BarChart3, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const mockAssessmentData = [
  {
    id: "1",
    title: "AWS Cloud Practitioner",
    category: "Cloud",
    score: 92,
    completed_at: "2024-01-15",
  },
  {
    id: "2",
    title: "CCNA Networking",
    category: "Networking",
    score: 85,
    completed_at: "2024-01-10",
  },
  {
    id: "3",
    title: "Python Developer",
    category: "Programming",
    score: 78,
    completed_at: "2024-01-05",
  },
];

export default function ResultsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(mockAssessmentData);
  const [loading, setLoading] = useState(false);

  const chartData = assessmentData.map((assessment, index) => ({
    name: assessment.title.substring(0, 15) + (assessment.title.length > 15 ? '...' : ''),
    score: assessment.score,
    date: assessment.completed_at,
  }));

  const averageScore = Math.round(assessmentData.reduce((sum, a) => sum + a.score, 0) / assessmentData.length);
  const topCategory = assessmentData.reduce((max, a) => a.score > max.score ? a : max, assessmentData[0] || { category: 'N/A' }).category;

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">My Results</h1>
          <p className="text-muted-foreground">Track your assessment performance and progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Total Completed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{assessmentData.length}</div>
            <p className="text-sm text-muted-foreground mt-1">assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Average Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-primary">{averageScore}%</div>
            <p className="text-sm text-muted-foreground mt-1">across all assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Top Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCategory}</div>
            <p className="text-sm text-muted-foreground mt-1">your best performing area</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
          <p className="text-sm text-muted-foreground">Your score progression over time</p>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" angle={-45} height={80} tick={{ fontSize: 12 }} />
              <YAxis type="number" domain={['dataMin - 10', 'dataMax + 10']} unit="%" />
              <Tooltip formatter={(value: number) => [`${value}%`, 'Score']} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessmentData.slice(0, 5).map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{assessment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assessment.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "text-2xl font-bold px-3 py-1 rounded-full",
                    assessment.score >= 90 ? "bg-emerald-100 text-emerald-800" :
                    assessment.score >= 70 ? "bg-amber-100 text-amber-800" :
                    "bg-destructive/10 text-destructive"
                  )}>
                    {assessment.score}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(assessment.completed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

