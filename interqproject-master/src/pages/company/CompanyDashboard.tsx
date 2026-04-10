import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Users, 
  BarChart3, 
  PieChart,
  ArrowUpRight,
  Settings,
  Briefcase,
  Layers,
  ClipboardList,
  Code2,
  Video,
  PlusCircle,
  FilePlus,
  UserPlus2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { AssignmentSystem } from "@/components/dashboard/AssignmentSystem";
import { mockKPIs, mockInterviews } from "@/data/adminModuleData";
import { LiveInterviewPlatforms } from "@/components/dashboard/LiveInterviewPlatforms";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [assessmentTitle, setAssessmentTitle] = useState("");
  
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    totalRecruiters: 12, // Default
    hiresCompleted: 4
  });

  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);

  useEffect(() => {
    // Initialize data if missing
    let jobs = JSON.parse(localStorage.getItem('companyJobs') || '[]');
    if (jobs.length === 0) {
      const mockJobs = [
        { id: "job-1", title: "Senior React Developer", department: "Engineering", location: "Remote", status: "open", applicationsCount: 12, postedAt: new Date().toISOString() },
        { id: "job-2", title: "UX Designer", department: "Design", location: "San Francisco", status: "open", applicationsCount: 8, postedAt: new Date().toISOString() }
      ];
      localStorage.setItem('companyJobs', JSON.stringify(mockJobs));
      jobs = mockJobs;
    }

    let candidates = JSON.parse(localStorage.getItem('companyCandidates') || '[]');
    if (candidates.length === 0) {
      const mockCands = [
        { id: "cand-1", fullName: "Alex Thompson", email: "alex@example.com", appliedRole: "Senior React Developer", stage: "shortlisted", appliedAt: new Date().toISOString() },
        { id: "cand-2", fullName: "Maria Garcia", email: "maria@example.com", appliedRole: "UX Designer", stage: "screening", appliedAt: new Date().toISOString() }
      ];
      localStorage.setItem('companyCandidates', JSON.stringify(mockCands));
      candidates = mockCands;
    }
    
    // Initialize interviews if empty
    let interviewsArr = JSON.parse(localStorage.getItem('companyInterviews') || '[]');
    if (interviewsArr.length === 0) {
      interviewsArr = mockInterviews.map((i, idx) => ({
        ...i,
        scheduledAt: new Date(Date.now() + (idx * 2 - 2) * 24 * 60 * 60 * 1000).toISOString()
      }));
      localStorage.setItem('companyInterviews', JSON.stringify(interviewsArr));
    }
    setUpcomingInterviews(interviewsArr.slice(0, 4));

    setStats({
      totalCandidates: candidates.length,
      activeJobs: jobs.filter((j: any) => j.status === 'open').length,
      totalRecruiters: mockKPIs.totalRecruiters,
      hiresCompleted: mockKPIs.hiresCompleted
    });
  }, []);

  const kpiData = [
    { label: "Active Recruiters", value: stats.totalRecruiters, icon: <Users className="w-5 h-5 text-blue-600" />, color: "bg-blue-50" },
    { label: "Company Job Slots", value: stats.activeJobs, icon: <Briefcase className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-50" },
    { label: "Total Candidates", value: stats.totalCandidates, icon: <Layers className="w-5 h-5 text-purple-600" />, color: "bg-purple-50" },
    { label: "Successful Hires", value: stats.hiresCompleted, icon: <BarChart3 className="w-5 h-5 text-amber-600" />, color: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            {user?.companyName || "Company Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Monitor recruitment performance and manage your hiring team.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsInviteModalOpen(true)} className="gap-2">
            <UserPlus2 className="w-4 h-4" /> Invite Recruiter
          </Button>
          <Button variant="outline" onClick={() => setIsAssessmentModalOpen(true)} className="gap-2 bg-slate-900 text-white hover:bg-slate-800 border-none">
            <PlusCircle className="w-4 h-4" /> Create Assessment
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AssignmentSystem />
          <LiveInterviewPlatforms />
          
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Company-Wide Analytics</CardTitle>
                <CardDescription>Performance across all hiring departments</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/5">
                Full Report <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-4 py-4">
                {[45, 78, 52, 90, 65, 84, 95].map((h, i) => (
                  <div key={i} className="flex-1 space-y-2 group">
                    <div className="relative w-full bg-slate-100 rounded-t-lg h-full overflow-hidden">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-primary group-hover:bg-primary/80 transition-all duration-300" 
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20" />
                      </div>
                    </div>
                    <p className="text-[10px] text-center font-bold text-slate-400">W {i + 1}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold">Upcoming Interviews</h2>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {upcomingInterviews.map((interview: any) => (
                    <div key={interview.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {interview.candidateName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{interview.candidateName}</p>
                          <p className="text-xs text-slate-500">{interview.jobTitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-700">
                          {new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {upcomingInterviews.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">No interviews scheduled.</div>
                  )}
                </div>
                <div className="p-3 bg-slate-50/50 border-t border-slate-100">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-primary font-bold" onClick={() => navigate("/company/interviews")}>
                    View All Interviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold">Team Breakdown</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold">Engineering</span>
                    <span className="text-slate-500 font-medium">45%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[45%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold">Sales & Ops</span>
                    <span className="text-slate-500 font-medium">30%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[30%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold">Design</span>
                    <span className="text-slate-500 font-medium">25%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[25%]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <CardContent className="p-8 relative z-10">
              <h3 className="text-xl font-bold mb-4">Need More Recruiter Slots?</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Your current Enterprise plan includes 25 recruiter seats. Contact your account manager to add more.
              </p>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold border-none">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Recruiter Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-[425px] text-slate-800">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation link to a coworker to join your hiring team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                placeholder="recruiter@company.com" 
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({ title: "Invitation Sent", description: `We've sent a link to ${recruiterEmail}.` });
              setRecruiterEmail("");
              setIsInviteModalOpen(false);
            }}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Assessment Modal */}
      <Dialog open={isAssessmentModalOpen} onOpenChange={setIsAssessmentModalOpen}>
        <DialogContent className="sm:max-w-[425px] text-slate-800">
          <DialogHeader>
            <DialogTitle>Create New Assessment</DialogTitle>
            <DialogDescription>
              Define the parameters for a new candidate skill evaluation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="aTitle">Assessment Title</Label>
              <Input 
                id="aTitle" 
                placeholder="e.g. JavaScript Senior Fundamentals" 
                value={assessmentTitle}
                onChange={(e) => setAssessmentTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="aType">Initial Questions</Label>
              <Input id="aType" type="number" defaultValue="20" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssessmentModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({ title: "Assessment Created", description: `"${assessmentTitle}" has been added to your library.` });
              setAssessmentTitle("");
              setIsAssessmentModalOpen(false);
            }}>Create Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}