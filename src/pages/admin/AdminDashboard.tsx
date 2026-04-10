import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  Award, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  Activity,
  Plus,
  ShieldAlert,
  Settings,
  ArrowUpRight,
  Code2,
  Video,
  VideoIcon
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignmentSystem } from "@/components/dashboard/AssignmentSystem";
import { mockKPIs } from "@/data/adminModuleData";
import { useNavigate } from "react-router-dom";
import { LiveInterviewPlatforms } from "@/components/dashboard/LiveInterviewPlatforms";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isCodingTestModalOpen, setIsCodingTestModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Form states
  const [assessmentData, setAssessmentData] = useState({ title: "", type: "multiple-choice", timeLimit: 30 });
  const [codingTestData, setCodingTestData] = useState({ title: "", language: "javascript", difficulty: "medium" });
  const [interviewData, setInterviewData] = useState({ candidateName: "", date: "", provider: "google_meet" });

  const handleCreateAssessment = () => {
    const saved = JSON.parse(localStorage.getItem('adminTests') || '[]');
    const newTest = { id: Date.now(), ...assessmentData, createdAt: new Date().toISOString() };
    localStorage.setItem('adminTests', JSON.stringify([newTest, ...saved]));
    setIsAssessmentModalOpen(false);
    toast({ title: "Assessment Created", description: `${assessmentData.title} is now in the bank.` });
  };

  const handleCreateCodingTest = () => {
    const saved = JSON.parse(localStorage.getItem('adminCodingTests') || '[]');
    const newTest = { id: Date.now(), ...codingTestData, createdAt: new Date().toISOString() };
    localStorage.setItem('adminCodingTests', JSON.stringify([newTest, ...saved]));
    setIsCodingTestModalOpen(false);
    toast({ title: "Coding Test Created", description: `${codingTestData.title} added to coding library.` });
  };

  const handleScheduleInterview = () => {
    const saved = JSON.parse(localStorage.getItem('companyInterviews') || '[]');
    const newInterview = { 
      id: "int-" + Date.now(), 
      candidateName: interviewData.candidateName,
      scheduledAt: interviewData.date,
      type: "video",
      platform: interviewData.provider,
      status: "scheduled"
    };
    localStorage.setItem('companyInterviews', JSON.stringify([newInterview, ...saved]));
    setIsInterviewModalOpen(false);
    toast({ title: "Interview Scheduled", description: `Meeting set up via ${interviewData.provider.replace('_', ' ')}.` });
  };

  const summaryCards = [
    { title: "Total Tests", value: 124, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
    { title: "Skill Questions", value: 3450, icon: GraduationCap, color: "text-violet-600 bg-violet-50" },
    { title: "Active Companies", value: mockKPIs.totalCompanies, icon: Building2, color: "text-emerald-600 bg-emerald-50" },
    { title: "Candidate Results", value: 4521, icon: ClipboardList, color: "text-amber-600 bg-amber-50" },
    { title: "Live Interviews", value: 89, icon: Activity, color: "text-pink-600 bg-pink-50" },
    { title: "Platform Users", value: 1256, icon: Users, color: "text-cyan-600 bg-cyan-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Super Admin <ShieldAlert className="w-6 h-6 text-red-500" />
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Platform-wide control, monitoring, and management.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/admin/users")} variant="outline" className="gap-2">
            <Users className="w-4 h-4" /> User Management
          </Button>
          <Button onClick={() => navigate("/admin/settings")} className="gap-2 bg-slate-900 border-none">
            <Settings className="w-4 h-4" /> System Settings
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-slate-900">{card.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-primary" /> Global Assignment Hub
              </h2>
            </div>
            <AssignmentSystem />
            <LiveInterviewPlatforms />
          </section>

          <Card className="border-slate-200">
             <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Platform Performance</CardTitle>
                <CardDescription>System-wide activity levels (Real-time)</CardDescription>
              </div>
              <Badge className="bg-emerald-500 text-white animate-pulse">Live</Badge>
            </CardHeader>
            <CardContent>
               <div className="h-64 flex items-end justify-between gap-2 py-4">
                {[30, 45, 25, 60, 40, 75, 55, 90, 65, 80, 50, 85].map((h, i) => (
                  <div key={i} className="flex-1 space-y-2 group">
                    <div className="relative w-full bg-slate-50 rounded-t-lg h-full overflow-hidden">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-700 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300" 
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900">99.99%</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900">1.2s</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Latency</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900">45k</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Requests/h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Create Assessment", icon: <Plus className="w-4 h-4" />, action: () => setIsAssessmentModalOpen(true) },
                { label: "Create Coding Test", icon: <Code2 className="w-4 h-4" />, action: () => setIsCodingTestModalOpen(true) },
                { label: "Schedule Live Interview", icon: <Video className="w-4 h-4" />, action: () => setIsInterviewModalOpen(true) },
                { label: "Platform Logs", icon: <Activity className="w-4 h-4" />, action: () => navigate("/admin/audit") },
              ].map((action, i) => (
                <Button key={i} variant="outline" className="w-full justify-between h-12 border-slate-200 hover:border-primary/50 group" onClick={action.action}>
                  <span className="flex items-center gap-2 font-semibold">
                    {action.icon} {action.label}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </Button>
              ))}
            </div>
          </section>

          <Card className="bg-red-50 border-red-100">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-red-900 text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Security Patch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-red-700 leading-relaxed mb-4 font-medium">
                Vulnerability detected in Recruiter PDF export. Please apply the 2.4.1 hotfix immediately.
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white border-none font-bold">
                Deploy Hotfix
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 scale-150 group-hover:scale-[1.7] transition-transform duration-1000">
              <TrendingUp className="w-32 h-32" />
            </div>
            <CardContent className="p-8 relative z-10">
              <h3 className="text-2xl font-black mb-2">Growth Milestone</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Platform transaction volume has increased by <span className="text-primary font-bold">42%</span> this week. Recommend scaling the CDN.
              </p>
              <Button className="w-full bg-primary text-white hover:bg-primary/90 font-bold border-none shadow-lg shadow-primary/20">
                View Infrastructure
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Assessment Creation Check</CardTitle>
              <CardDescription>Verify recently added platform content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {JSON.parse(localStorage.getItem('adminTests') || '[]').slice(0, 3).map((test: any) => (
                  <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{test.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{test.type || 'Assessment'}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-white text-emerald-600 border-emerald-100">Verified</Badge>
                  </div>
                ))}
                {JSON.parse(localStorage.getItem('adminTests') || '[]').length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-400">No assessments created yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={isAssessmentModalOpen} onOpenChange={setIsAssessmentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Assessment</DialogTitle>
            <DialogDescription>Create a theoretical assessment for candidates.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Assessment Title</Label>
              <Input placeholder="e.g. React Fundamentals" value={assessmentData.title} onChange={(e) => setAssessmentData({...assessmentData, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={assessmentData.type} onValueChange={(v) => setAssessmentData({...assessmentData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Limit (min)</Label>
                <Input type="number" value={assessmentData.timeLimit} onChange={(e) => setAssessmentData({...assessmentData, timeLimit: parseInt(e.target.value)})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssessmentModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateAssessment}>Create Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCodingTestModalOpen} onOpenChange={setIsCodingTestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Coding Test</DialogTitle>
            <DialogDescription>Add a programming challenge to the bank.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Challenge Name</Label>
              <Input placeholder="e.g. Binary Tree Traversal" value={codingTestData.title} onChange={(e) => setCodingTestData({...codingTestData, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={codingTestData.language} onValueChange={(v) => setCodingTestData({...codingTestData, language: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={codingTestData.difficulty} onValueChange={(v) => setCodingTestData({...codingTestData, difficulty: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCodingTestModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCodingTest}>Add Coding Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isInterviewModalOpen} onOpenChange={setIsInterviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Live Interview</DialogTitle>
            <DialogDescription>Set up a meeting with a candidate using your preferred tool.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Candidate Name</Label>
              <Input placeholder="Search or type candidate name" value={interviewData.candidateName} onChange={(e) => setInterviewData({...interviewData, candidateName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input type="datetime-local" value={interviewData.date} onChange={(e) => setInterviewData({...interviewData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Meeting Platform</Label>
              <Select value={interviewData.provider} onValueChange={(v) => setInterviewData({...interviewData, provider: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_meet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom Video</SelectItem>
                  <SelectItem value="ms_teams">Microsoft Teams</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInterviewModalOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleInterview}>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
