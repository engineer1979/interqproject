import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, CheckCircle, MessageCircle, BarChart3, Plus, ArrowRight, Clock, ClipboardList } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  change: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

const StatCard = ({ title, value, change, icon, color, path, navigate }: StatCardProps & { navigate: any }) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(path)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
<p className={`text-xs font-medium mt-1 ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'purple' ? 'text-purple-600' : color === 'orange' ? 'text-orange-600' : color === 'emerald' ? 'text-emerald-600' : 'text-indigo-600'}`}>{change}</p>
        </div>
<div className={`p-3 rounded-xl ${color === 'blue' ? 'bg-blue-500/10' : color === 'green' ? 'bg-green-500/10' : color === 'purple' ? 'bg-purple-500/10' : color === 'orange' ? 'bg-orange-500/10' : color === 'emerald' ? 'bg-emerald-500/10' : 'bg-indigo-500/10'}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 3,
    newApplications: 12,
    inPipeline: 8,
    interviewsScheduled: 2,
    offersMade: 1,
    messages: 5,
  });

  const statCards: Omit<StatCardProps, 'navigate'>[] = [
    { title: "Active Jobs", value: stats.activeJobs, change: "+2 this week", icon: <Briefcase className="h-8 w-8 text-blue-600" />, color: "blue", path: "/recruiter/jobs" },
    { title: "New Applications", value: stats.newApplications, change: "+12 today", icon: <Users className="h-8 w-8 text-green-600" />, color: "green", path: "/recruiter/pipeline" },
    { title: "Candidates in Pipeline", value: stats.inPipeline, change: "5 ready for interview", icon: <ClipboardList className="h-8 w-8 text-purple-600" />, color: "purple", path: "/recruiter/candidates" },
    { title: "Interviews Scheduled", value: stats.interviewsScheduled, change: "2 tomorrow", icon: <Clock className="h-8 w-8 text-orange-600" />, color: "orange", path: "/recruiter/pipeline" },
    { title: "Offers Made", value: stats.offersMade, change: "1 pending", icon: <CheckCircle className="h-8 w-8 text-emerald-600" />, color: "emerald", path: "/recruiter/candidates" },
    { title: "Unread Messages", value: stats.messages, change: "Reply now", icon: <MessageCircle className="h-8 w-8 text-indigo-600" />, color: "indigo", path: "/recruiter/messages" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your hiring pipeline and candidates</p>
        </div>
      <div className="flex gap-3 flex-wrap">
          <Button onClick={() => navigate("/recruiter/jobs")} className="gap-2">
            <Plus className="h-4 w-4" /> New Job
          </Button>
          <Button variant="outline" onClick={() => navigate("/recruiter/pipeline")} className="gap-2">
            View Pipeline <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/recruiter/reports")}>
            Evaluation Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={card.title} {...card} navigate={navigate} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">John Doe applied to Frontend Dev</span>
                <Badge variant="default" className="text-xs">2 min ago</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Sarah Wilson - ATS score 87</span>
                <Badge variant="outline" className="text-xs bg-green-100 text-green-800">Passed</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Mike Johnson interview tomorrow</span>
                <Badge variant="secondary" className="text-xs">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Candidates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">JD</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">John Doe</p>
                <p className="text-xs text-muted-foreground">Final Score: 92</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">Interview</Button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">SW</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Sarah Wilson</p>
                <p className="text-xs text-muted-foreground">Final Score: 87</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">Offer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Applied</span>
                <div className="ml-auto font-mono text-xs">24</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>ATS Passed</span>
                <div className="ml-auto font-mono text-xs">18 (75%)</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Assessment Complete</span>
                <div className="ml-auto font-mono text-xs">12 (50%)</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Interviews</span>
                <div className="ml-auto font-mono text-xs">6 (25%)</div>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-primary">
                <span>Hired</span>
                <div className="ml-auto font-mono">1 (4%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

