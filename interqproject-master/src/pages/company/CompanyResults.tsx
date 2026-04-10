import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Award, FileText, Download, ChevronRight } from "lucide-react";
import { mockCandidates } from "@/data/adminModuleData";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CompanyResults() {
  const { company } = useOutletContext<{ company: { id: string } }>();

  // Filter candidates who have completed assessments (mock)
  const results = mockCandidates.map(c => ({
    ...c,
    score: c.rating ? c.rating * 20 : Math.floor(Math.random() * 40 + 60),
    testName: ["React Developer Test", "Frontend Skills", "UI/UX Basics"][Math.floor(Math.random() * 3)],
    date: new Date(Date.now() - Math.random() * 86400000 * 7).toLocaleDateString()
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Results & Reports</h1>
          <p className="text-sm text-muted-foreground">View candidate scores and export reports</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 opacity-80" />
              <Badge variant="secondary" className="bg-white/20 text-white border-none">Avg Score</Badge>
            </div>
            <p className="text-3xl font-bold">84%</p>
            <p className="text-sm opacity-80 mt-1">Overall candidate quality</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Test Completed</p>
              <p className="text-2xl font-bold">124</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pass Rate</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
          <CardDescription>Performance of the last 10 candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.slice(0, 5).map((result, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {result.fullName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm truncate">{result.fullName}</p>
                    <span className="text-xs text-muted-foreground">{result.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground truncate">{result.testName}</p>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{result.appliedRole}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={result.score} className="h-1.5 flex-1" />
                    <span className={`text-sm font-bold ${result.score > 80 ? 'text-green-600' : result.score > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {result.score}%
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Custom reports ready for generation</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 border rounded-xl gap-4 hover:border-primary/50 cursor-pointer transition-all">
             <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-indigo-600" />
             </div>
             <div>
                <p className="font-semibold text-sm">Hiring Funnel Report</p>
                <p className="text-xs text-muted-foreground">Analysis of candidate conversion stages</p>
             </div>
          </div>
          <div className="flex items-center p-4 border rounded-xl gap-4 hover:border-primary/50 cursor-pointer transition-all">
             <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600" />
             </div>
             <div>
                <p className="font-semibold text-sm">Quality of Hire Report</p>
                <p className="text-xs text-muted-foreground">Candidate performance vs interview scores</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
