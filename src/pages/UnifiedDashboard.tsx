import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  Briefcase,
  UserCheck,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Star,
  MessageSquare,
  Settings,
  Shield,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { mockKPIs, mockCompanies, mockJobs, mockCandidates, mockInterviews, mockOffers, mockActivityFeed } from "@/data/adminModuleData";

const statCards = {
  admin: [
    { title: "Total Companies", value: mockKPIs.totalCompanies, icon: Building2, trend: 12, color: "text-blue-600" },
    { title: "Total Recruiters", value: mockKPIs.totalRecruiters, icon: Users, trend: 8, color: "text-green-600" },
    { title: "Active Jobs", value: mockKPIs.activeJobs, icon: Briefcase, trend: 15, color: "text-purple-600" },
    { title: "Total Candidates", value: mockKPIs.totalCandidates.toLocaleString(), icon: UserCheck, trend: 22, color: "text-orange-600" },
    { title: "Interviews Scheduled", value: mockKPIs.interviewsScheduled, icon: Calendar, trend: -5, color: "text-cyan-600" },
    { title: "Offers Sent", value: mockKPIs.offersSent, icon: FileText, trend: 18, color: "text-pink-600" },
    { title: "Hires Completed", value: mockKPIs.hiresCompleted, icon: CheckCircle, trend: 25, color: "text-emerald-600" },
    { title: "Pending Approvals", value: mockKPIs.pendingApprovals, icon: Clock, trend: -15, color: "text-amber-600" },
  ],
  company: [
    { title: "Active Jobs", value: 18, icon: Briefcase, trend: 10, color: "text-blue-600" },
    { title: "Total Applicants", value: 234, icon: UserCheck, trend: 15, color: "text-green-600" },
    { title: "Shortlisted", value: 45, icon: Star, trend: 8, color: "text-purple-600" },
    { title: "Interviews Scheduled", value: 12, icon: Calendar, trend: -3, color: "text-cyan-600" },
    { title: "Offers Sent", value: 5, icon: FileText, trend: 20, color: "text-pink-600" },
    { title: "Hires Completed", value: 8, icon: CheckCircle, trend: 25, color: "text-emerald-600" },
  ],
  recruiter: [
    { title: "Open Jobs", value: 8, icon: Briefcase, trend: 5, color: "text-blue-600" },
    { title: "Candidates in Pipeline", value: 156, icon: UserCheck, trend: 12, color: "text-green-600" },
    { title: "Interviews Today", value: 4, icon: Calendar, trend: 0, color: "text-cyan-600" },
    { title: "Pending Feedback", value: 7, icon: Clock, trend: -10, color: "text-amber-600" },
    { title: "Offers Pending", value: 3, icon: FileText, trend: 15, color: "text-pink-600" },
    { title: "Hires This Month", value: 5, icon: CheckCircle, trend: 25, color: "text-emerald-600" },
  ],
  jobseeker: [
    { title: "Profile Views", value: 48, icon: Eye, trend: 25, color: "text-blue-600" },
    { title: "Applications Sent", value: 12, icon: FileText, trend: 10, color: "text-green-600" },
    { title: "Interviews Scheduled", value: 3, icon: Calendar, trend: 50, color: "text-cyan-600" },
    { title: "Offers Received", value: 1, icon: CheckCircle, trend: 100, color: "text-emerald-600" },
    { title: "Saved Jobs", value: 8, icon: Star, trend: 20, color: "text-purple-600" },
    { title: "Profile Strength", value: "85%", icon: TrendingUp, trend: 10, color: "text-orange-600" },
  ],
};

const quickActions = {
  admin: [
    { label: "Add Company", icon: Building2, href: "/companies", color: "bg-blue-500" },
    { label: "Add Recruiter", icon: Users, href: "/users", color: "bg-green-500" },
    { label: "Post Job", icon: Briefcase, href: "/jobs", color: "bg-purple-500" },
    { label: "Permissions", icon: Shield, href: "/settings", color: "bg-orange-500" },
    { label: "Reports", icon: BarChart3, href: "/reports", color: "bg-cyan-500" },
    { label: "Billing", icon: CreditCard, href: "/billing", color: "bg-pink-500" },
  ],
  company: [
    { label: "Post New Job", icon: Plus, href: "/jobs", color: "bg-blue-500" },
    { label: "Review Candidates", icon: UserCheck, href: "/candidates", color: "bg-green-500" },
    { label: "Schedule Interview", icon: Calendar, href: "/interviews", color: "bg-purple-500" },
    { label: "Send Offer", icon: FileText, href: "/offers", color: "bg-orange-500" },
    { label: "Team Settings", icon: Users, href: "/team", color: "bg-cyan-500" },
    { label: "View Reports", icon: BarChart3, href: "/reports", color: "bg-pink-500" },
  ],
  recruiter: [
    { label: "Add Candidate", icon: Plus, href: "/candidates", color: "bg-blue-500" },
    { label: "Schedule Interview", icon: Calendar, href: "/interviews", color: "bg-green-500" },
    { label: "Review Pipeline", icon: UserCheck, href: "/pipeline", color: "bg-purple-500" },
    { label: "Send Offer Request", icon: FileText, href: "/offers", color: "bg-orange-500" },
    { label: "Talent Pool", icon: Star, href: "/talent-pool", color: "bg-cyan-500" },
    { label: "My Reports", icon: BarChart3, href: "/reports", color: "bg-pink-500" },
  ],
  jobseeker: [
    { label: "Search Jobs", icon: Briefcase, href: "/jobs", color: "bg-blue-500" },
    { label: "Edit Profile", icon: Users, href: "/profile", color: "bg-green-500" },
    { label: "Upload Resume", icon: FileText, href: "/profile", color: "bg-purple-500" },
    { label: "Saved Jobs", icon: Star, href: "/saved-jobs", color: "bg-orange-500" },
    { label: "Messages", icon: MessageSquare, href: "/messages", color: "bg-cyan-500" },
    { label: "Settings", icon: Settings, href: "/settings", color: "bg-pink-500" },
  ],
};

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications] = useState(mockActivityFeed.slice(0, 5));
  const currentRole = user?.role || "jobseeker";

  const stats = statCards[currentRole];
  const actions = quickActions[currentRole];

  const roleTitle = {
    admin: "Admin Dashboard",
    company: "Company Dashboard",
    recruiter: "Recruiter Dashboard",
    jobseeker: "My Dashboard",
  };

  const roleDescription = {
    admin: "Monitor platform performance and manage all accounts",
    company: "Manage your hiring pipeline and team activities",
    recruiter: "Track your candidates and manage interviews",
    jobseeker: "Track your applications and manage your career profile",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{roleTitle[currentRole]}</h1>
          <p className="text-muted-foreground">{roleDescription[currentRole]}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { toast({ title: "Report Exported", description: "Dashboard report downloaded as CSV." }); }}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          {currentRole !== "jobseeker" && (
            <Button onClick={() => navigate(currentRole === "admin" ? "/companies" : currentRole === "company" ? "/jobs" : "/candidates")}>
              <Plus className="h-4 w-4 mr-2" />
              {currentRole === "admin" ? "Add Company" : currentRole === "company" ? "Post Job" : "Add Candidate"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : stat.trend < 0 ? (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                ) : null}
                <span className={stat.trend > 0 ? "text-green-500" : stat.trend < 0 ? "text-red-500" : ""}>
                  {Math.abs(stat.trend)}%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Badge variant="outline">{notifications.length} new</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => navigate(action.href)}
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {currentRole === "admin" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCompanies.slice(0, 5).map((company) => (
                  <div key={company.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{company.name}</p>
                        <p className="text-xs text-muted-foreground">{company.industry}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{company.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInterviews.slice(0, 5).map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{interview.candidateName}</p>
                      <p className="text-xs text-muted-foreground">{interview.jobTitle}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={interview.status === "scheduled" ? "default" : interview.status === "completed" ? "secondary" : "outline"}>
                        {interview.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(interview.scheduledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentRole === "company" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Applied", "Screening", "Interview", "Offer", "Hired"].map((stage, index) => (
                <div key={stage} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium">{stage}</div>
                  <Progress value={[40, 30, 20, 15, 10][index]} className="flex-1" />
                  <div className="w-12 text-sm text-muted-foreground text-right">{[45, 32, 18, 8, 5][index]}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jobs Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockJobs.slice(0, 4).map((job) => (
                  <div key={job.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.applications} applications</p>
                    </div>
                    <Badge variant="outline">{job.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentRole === "recruiter" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCandidates.slice(0, 5).map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{candidate.fullName}</p>
                        <p className="text-xs text-muted-foreground">{candidate.appliedRole}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{candidate.stage.replace("_", " ")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInterviews.filter(i => i.status === "scheduled").slice(0, 4).map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{interview.candidateName}</p>
                      <p className="text-xs text-muted-foreground">{interview.jobTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(interview.scheduledAt).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">{interview.duration} min</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentRole === "jobseeker" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockJobs.slice(0, 4).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.companyName} - {job.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">${(job.salaryMin / 1000).toFixed(0)}K+</Badge>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Applied", count: 5, color: "bg-blue-500" },
                { label: "Under Review", count: 3, color: "bg-yellow-500" },
                { label: "Interview", count: 2, color: "bg-purple-500" },
                { label: "Offer", count: 1, color: "bg-green-500" },
              ].map((status) => (
                <div key={status.label} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <div className="flex-1 text-sm font-medium">{status.label}</div>
                  <div className="text-sm text-muted-foreground">{status.count}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
