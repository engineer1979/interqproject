import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";
import { mockKPIs, mockCandidates, mockJobs, mockInterviews } from "@/data/adminModuleData";
import { BarChart3, TrendingUp, TrendingDown, Download, Users, Briefcase, Calendar, CheckCircle, DollarSign, Clock } from "lucide-react";

const monthlyData = [
  { month: "Oct", hires: 8, applications: 145, interviews: 32 },
  { month: "Nov", hires: 12, applications: 189, interviews: 45 },
  { month: "Dec", hires: 9, applications: 134, interviews: 28 },
  { month: "Jan", hires: 15, applications: 210, interviews: 56 },
  { month: "Feb", hires: 18, applications: 267, interviews: 72 },
  { month: "Mar", hires: 22, applications: 312, interviews: 89 },
];

const maxApps = Math.max(...monthlyData.map(d => d.applications));

export default function ReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const role = user?.role || "jobseeker";

  const handleDownload = (reportName: string) => {
    toast({ title: "Report Downloaded", description: `${reportName} has been exported as CSV.` });
  };

  const conversionRate = ((mockKPIs.hiresCompleted / mockKPIs.totalCandidates) * 100).toFixed(1);
  const avgTimeToHire = 18;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Hiring performance and platform insights</p>
        </div>
        <Button onClick={() => handleDownload("Full Report")}>
          <Download className="h-4 w-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Candidates", value: mockKPIs.totalCandidates.toLocaleString(), icon: Users, trend: "+22%", up: true, color: "text-blue-600" },
          { label: "Active Jobs", value: mockKPIs.activeJobs, icon: Briefcase, trend: "+15%", up: true, color: "text-purple-600" },
          { label: "Interviews Held", value: mockKPIs.interviewsScheduled, icon: Calendar, trend: "-5%", up: false, color: "text-orange-600" },
          { label: "Hires Completed", value: mockKPIs.hiresCompleted, icon: CheckCircle, trend: "+25%", up: true, color: "text-green-600" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <Badge variant="outline" className={`text-xs ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                  {kpi.up ? <TrendingUp className="h-3 w-3 mr-0.5 inline" /> : <TrendingDown className="h-3 w-3 mr-0.5 inline" />}
                  {kpi.trend}
                </Badge>
              </div>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1"><DollarSign className="h-4 w-4 text-emerald-600" /><span className="text-sm text-muted-foreground">Conversion Rate</span></div>
            <div className="text-3xl font-bold text-emerald-600">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">Candidates → Hired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1"><Clock className="h-4 w-4 text-cyan-600" /><span className="text-sm text-muted-foreground">Avg. Time to Hire</span></div>
            <div className="text-3xl font-bold text-cyan-600">{avgTimeToHire} days</div>
            <div className="text-xs text-muted-foreground mt-1">From application to offer</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-purple-600" /><span className="text-sm text-muted-foreground">Offer Acceptance</span></div>
            <div className="text-3xl font-bold text-purple-600">78%</div>
            <div className="text-xs text-muted-foreground mt-1">Offers accepted this quarter</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Hiring Chart */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Monthly Hiring Activity</CardTitle>
          <Button size="sm" variant="outline" onClick={() => handleDownload("Monthly Activity Report")}>
            <Download className="h-3 w-3 mr-1" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-48 px-2">
            {monthlyData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "160px", justifyContent: "flex-end" }}>
                  <div className="w-full relative group" style={{ height: `${(d.applications / maxApps) * 140}px` }}>
                    <div className="w-full h-full bg-blue-100 rounded-t-sm hover:bg-blue-200 transition-colors cursor-default" />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-foreground text-background text-xs rounded px-1 py-0.5 whitespace-nowrap z-10">{d.applications} apps</div>
                  </div>
                  <div className="w-full relative group" style={{ height: `${(d.interviews / maxApps) * 140}px`, marginTop: "-100%" }}>
                    <div className="w-2/3 mx-auto h-full bg-purple-400 rounded-t-sm hover:bg-purple-500 transition-colors cursor-default" />
                  </div>
                  <div className="w-full relative group" style={{ height: `${(d.hires / maxApps) * 140}px`, marginTop: "-100%" }}>
                    <div className="w-1/3 mx-auto h-full bg-green-500 rounded-t-sm hover:bg-green-600 transition-colors cursor-default" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 justify-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-100 inline-block" /> Applications</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-purple-400 inline-block" /> Interviews</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Hires</span>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Pipeline Stage Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { stage: "Applied", count: 312, pct: 100, color: "bg-gray-400" },
              { stage: "Screening", count: 187, pct: 60, color: "bg-blue-400" },
              { stage: "Shortlisted", count: 89, pct: 28, color: "bg-purple-400" },
              { stage: "Interview", count: 56, pct: 18, color: "bg-yellow-400" },
              { stage: "Offer", count: 23, pct: 7, color: "bg-orange-400" },
              { stage: "Hired", count: 18, pct: 6, color: "bg-green-500" },
            ].map(item => (
              <div key={item.stage} className="flex items-center gap-3">
                <div className="w-24 text-sm text-muted-foreground">{item.stage}</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
                <div className="w-10 text-right text-sm font-medium">{item.count}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Top Job Sources</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { source: "LinkedIn", count: 145, pct: 46 },
              { source: "Indeed", count: 89, pct: 28 },
              { source: "Career Page", count: 45, pct: 14 },
              { source: "Referral", count: 23, pct: 7 },
              { source: "Other", count: 10, pct: 3 },
            ].map(item => (
              <div key={item.source} className="flex items-center gap-3">
                <div className="w-24 text-sm text-muted-foreground">{item.source}</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
                <div className="w-16 text-right text-sm font-medium">{item.count} <span className="text-muted-foreground text-xs">({item.pct}%)</span></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Download Buttons */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Download Reports</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {["Candidate Pipeline Report", "Monthly Hiring Summary", "Job Performance Report", "Interview Feedback Report", "Offer Acceptance Report"].map(r => (
              <Button key={r} size="sm" variant="outline" onClick={() => handleDownload(r)}>
                <Download className="h-3 w-3 mr-1" /> {r}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
