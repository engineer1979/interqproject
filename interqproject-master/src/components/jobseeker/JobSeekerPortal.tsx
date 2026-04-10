import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, FileText, Code2, Video, TrendingUp, Award, 
  User, Bell, Settings, LogOut, ChevronLeft, ChevronRight, 
  Menu, X, Shield, BookOpen, Search, Filter, Download, 
  Plus, Calendar, Clock, ArrowUpRight, CheckCircle, BrainCircuit,
  Star, Briefcase, ExternalLink, Activity, Target, Zap, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// --- MOCK DATA ---
const seekerData = {
  name: "John Doe",
  email: "john@example.com",
  atsScore: 84,
  profileCompletion: 92,
  progress: {
    applied: 12,
    underReview: 4,
    interviews: 2,
    offers: 1
  },
  assessments: [
    { id: "a1", company: "Tech Solutions Inc", title: "Frontend Architecture", deadline: "Apr 20, 2026", status: "Assigned", difficulty: "Hard" },
    { id: "a2", company: "InterQ Labs", title: "System Design Essentials", deadline: "Apr 25, 2026", status: "Pending", difficulty: "Expert" },
    { id: "a3", company: "CloudScale HQ", title: "React Performance Hub", deadline: "COMPLETED", status: "Completed", score: 92, difficulty: "Medium" }
  ],
  results: [
    { name: "Technical", score: 88, color: "#3b82f6" },
    { name: "Logic", score: 94, color: "#10b981" },
    { name: "Behavioral", score: 78, color: "#8b5cf6" },
    { name: "Comms", score: 82, color: "#f59e0b" }
  ],
  performanceHistory: [
    { month: "Jan", score: 65 },
    { month: "Feb", score: 72 },
    { month: "Mar", score: 88 },
    { month: "Apr", score: 84 }
  ],
  certificates: [
    { id: "c1", title: "Advanced JavaScript Mastery", issuer: "InterQ Technologies", date: "Mar 15, 2026", score: 95, color: "bg-blue-500" },
    { id: "c2", title: "Cloud Architecture Pro", issuer: "InterQ Technologies", date: "Apr 02, 2026", score: 88, color: "bg-emerald-500" }
  ],
  upcomingInterviews: [
    { id: "i1", company: "Tech Solutions Inc", role: "Senior Frontend", time: "Tomorrow, 2:30 PM", type: "Technical Video" },
    { id: "i2", company: "InterQ Labs", role: "Lead Engineer", time: "Apr 15, 10:00 AM", type: "System Design" }
  ]
};

export function JobSeekerPortal() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path && ["dashboard", "assessments", "coding-challenges", "interviews", "results", "certificates", "profile", "settings"].includes(path)) {
      setActiveTab(path);
    } else if (location.pathname === "/jobseeker") {
      setActiveTab("dashboard");
    }
  }, [location.pathname]);

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "assessments", label: "My Assessments", icon: FileText },
    { id: "coding-challenges", label: "Code Platform", icon: Code2 },
    { id: "interviews", label: "Interviews", icon: Video },
    { id: "results", label: "Skills Analytics", icon: TrendingUp },
    { id: "certificates", label: "Badges & Certs", icon: Award },
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Account", icon: Settings },
  ];

  const handleDownloadCertificate = async (id: string) => {
    toast.loading("Generating Secure Certificate PDF...");
    setTimeout(() => {
       toast.dismiss();
       toast.success("Certificate downloaded! Verified by InterQ Ledger.");
    }, 2000);
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 group">
            Ready for your next leap, {seekerData.name.split(' ')[0]}?
            <span className="inline-block ml-2 animate-bounce">👋</span>
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Your ATS score is in the top 5% of all candidates this month.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Available for Hire</span>
           </div>
           <Button className="bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all font-bold">
              <Plus className="w-4 h-4 mr-2" /> Find Jobs
           </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="bg-white hover:shadow-2xl transition-all duration-500 group border-none shadow-sm">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                     <Target className="w-6 h-6" />
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-none font-bold">+12%</Badge>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">ATS Profile Score</p>
               <h3 className="text-3xl font-black text-slate-900">{seekerData.atsScore}</h3>
               <Progress value={seekerData.atsScore} className="h-1.5 mt-4" />
            </CardContent>
         </Card>

         <Card className="bg-white hover:shadow-2xl transition-all duration-500 group border-none shadow-sm">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                     <Briefcase className="w-6 h-6" />
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold">Active</Badge>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Active Applications</p>
               <h3 className="text-3xl font-black text-slate-900">{seekerData.progress.applied}</h3>
               <p className="text-[10px] text-slate-400 font-bold mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 4 items under review
               </p>
            </CardContent>
         </Card>

         <Card className="bg-white hover:shadow-2xl transition-all duration-500 group border-none shadow-sm">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
                     <Zap className="w-6 h-6" />
                  </div>
                  <Badge className="bg-purple-50 text-purple-700 border-none font-bold">Hot</Badge>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Skill Assessment Rank</p>
               <h3 className="text-3xl font-black text-slate-900">42 <span className="text-sm font-bold text-slate-400 italic">/ 1.2k</span></h3>
               <p className="text-[10px] text-purple-600 font-black mt-2">Top 3% of React Developers</p>
            </CardContent>
         </Card>

         <Card className="bg-white hover:shadow-2xl transition-all duration-500 group border-none shadow-sm">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
                     <Award className="w-6 h-6" />
                  </div>
                  <Badge className="bg-amber-50 text-amber-700 border-none font-bold">New</Badge>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Earned Badges</p>
               <h3 className="text-3xl font-black text-slate-900">{seekerData.certificates.length}</h3>
               <p className="text-[10px] text-amber-600 font-black mt-2">1 Verified Certification</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Area */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
               <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black">Performance over time</CardTitle>
                    <CardDescription className="text-slate-400 font-medium tracking-tight">Your improvement Across technical tracks</CardDescription>
                  </div>
                  <Select defaultValue="avg">
                     <Trigger className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border-none flex items-center gap-2">
                        View: Avg Score <ChevronDown className="w-3 h-3" />
                     </Trigger>
                  </Select>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={seekerData.performanceHistory}>
                           <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                           <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                           <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -1px rgb(0 0 0 / 0.1)'}} />
                           <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </CardContent>
            </Card>

            <section>
               <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                     <FileText className="w-5 h-5 text-slate-700" />
                     <h2 className="text-lg font-black text-slate-800">Pending Assessments</h2>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary font-bold text-xs" onClick={() => setActiveTab('assessments')}>
                     View All <ArrowUpRight className="ml-2 w-3 h-3" />
                  </Button>
               </div>
               <div className="grid gap-4">
                  {seekerData.assessments.filter(a => a.status !== 'Completed').map((assessment) => (
                    <Card key={assessment.id} className="border border-slate-100 hover:border-primary/50 transition-all hover:shadow-md group">
                       <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                   <BrainCircuit className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                   <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors">{assessment.title}</h4>
                                   <p className="text-xs font-bold text-slate-400">{assessment.company} · {assessment.difficulty} Difficulty</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-6">
                                <div className="text-right">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Deadline</p>
                                   <p className="text-sm font-bold text-destructive mt-1">{assessment.deadline}</p>
                                </div>
                                <Button className="bg-primary shadow-lg shadow-primary/10 font-black h-10 px-6 rounded-xl hover:scale-105 transition-transform" onClick={() => toast.info("Opening assessment environment...")}>
                                   Take Assessment
                                </Button>
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                  ))}
               </div>
            </section>
         </div>

         {/* Sidebar Area */}
         <div className="space-y-8">
            {/* Upcoming Interviews */}
            <section>
               <div className="flex items-center gap-2 mb-4 px-2">
                  <Video className="w-5 h-5 text-slate-700" />
                  <h2 className="text-lg font-black text-slate-800">Interviews</h2>
               </div>
               <div className="space-y-3">
                  {seekerData.upcomingInterviews.map((interview) => (
                     <Card key={interview.id} className="bg-slate-900 text-white border-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-primary/40 transition-all" />
                        <CardContent className="p-6">
                           <div className="flex justify-between items-start mb-4">
                              <Badge className="bg-white/10 text-white border-white/20 font-bold text-[9px] uppercase tracking-widest">Confirmed</Badge>
                              <div className="p-2 bg-white/10 rounded-xl">
                                 <Calendar className="w-4 h-4 text-primary" />
                              </div>
                           </div>
                           <h4 className="font-black text-lg mb-0.5">{interview.company}</h4>
                           <p className="text-xs font-bold text-slate-400 mb-4">{interview.role} · {interview.type}</p>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[11px] font-bold text-primary">
                                 <Clock className="h-3 w-3" /> {interview.time}
                              </div>
                              <Button variant="ghost" className="h-8 px-3 text-[10px] font-black text-white hover:bg-white/10">
                                 Join Session
                              </Button>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </section>

            {/* Resume Analytics */}
            <Card className="bg-white border-none shadow-sm">
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                     <Activity className="w-4 h-4" /> Skills Breakdown
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="space-y-4">
                     {seekerData.results.map((skill) => (
                        <div key={skill.name}>
                           <div className="flex justify-between text-xs font-black mb-1.5 uppercase tracking-tighter">
                              <span className="text-slate-500">{skill.name}</span>
                              <span className="text-slate-900">{skill.score}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                              <div className="h-full group-hover:opacity-80 transition-all rounded-full" style={{ width: `${skill.score}%`, backgroundColor: skill.color }} />
                           </div>
                        </div>
                     ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-6 text-primary font-black text-xs hover:bg-primary/5">
                     View Deep-Dive Analysis
                  </Button>
               </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl">
               <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-white/10 rounded-2xl">
                        <User className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <h4 className="font-black">Complete Profile</h4>
                        <p className="text-[10px] font-bold text-white/60">Increase hire chance by 40%</p>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>Progress</span>
                        <span>{seekerData.profileCompletion}%</span>
                     </div>
                     <div className="h-2 w-full bg-white/10 rounded-full">
                        <div className="h-full bg-white rounded-full" style={{ width: `${seekerData.profileCompletion}%` }} />
                     </div>
                  </div>
                  <Button className="w-full mt-6 bg-white text-indigo-600 font-black h-10 hover:bg-white/90">
                     Update My Resume
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Credential Ledger</h1>
          <p className="text-muted-foreground font-medium mt-1">Your verified skills and badges, backed by InterQ technologies.</p>
        </div>
        <Button className="bg-slate-900 text-white font-bold h-12 px-8 rounded-2xl">
          <Share2 className="w-4 h-4 mr-2" /> Share My Portfolio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {seekerData.certificates.map((cert) => (
           <Card key={cert.id} className="group hover:scale-[1.02] transition-all duration-300 border-none shadow-sm bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                 <img src="/interq-logo.png" className="h-6 grayscale" alt="InterQ" />
              </div>
              <CardContent className="p-0">
                 <div className={`h-24 ${cert.color} p-6 flex items-end relative`}>
                    <Award className="w-12 h-12 text-white/40 absolute -bottom-2 -left-2" />
                    <Badge className="bg-white/20 text-white border-white/30 font-black text-[10px] uppercase tracking-widest backdrop-blur-md">Verified 2026</Badge>
                 </div>
                 <div className="p-6">
                    <h3 className="font-black text-xl text-slate-900 mb-1 leading-tight">{cert.title}</h3>
                    <p className="text-xs font-bold text-slate-400 mb-6">{cert.issuer} · {cert.date}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                       <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-lg font-black text-slate-900">{cert.score}%</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Score</span>
                       </div>
                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5" onClick={() => handleDownloadCertificate(cert.id)}>
                          <Download className="w-5 h-5" />
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
         ))}
         
         <Card className="border-2 border-dashed border-slate-200 bg-transparent flex flex-col items-center justify-center p-10 text-center hover:border-primary transition-all cursor-pointer group" onClick={() => setActiveTab('assessments')}>
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <TrendingUp className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="font-black text-slate-800">Earn New Badge</h4>
            <p className="text-xs font-medium text-slate-400 mt-1">Take a challenge to add to your ledger</p>
         </Card>
      </div>

      <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden p-1">
         <div className="bg-slate-800/10 rounded-[23px] p-8 md:p-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/20">
                     <ShieldCheck className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">InterQ Verified Protocol</span>
                  </div>
                  <h2 className="text-4xl font-black leading-tight">Your credentials are cryptographically secured.</h2>
                  <p className="text-slate-400 font-medium text-lg leading-relaxed">
                     Every certificate you earn is recorded on our secure ledger, allowing companies to verify your technical skills instantly WITHOUT needing manual validation.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <Button className="bg-primary text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-primary/20">Learn More About Verification</Button>
                  </div>
               </div>
               <div className="w-full md:w-[350px] aspect-square bg-[#0c1015] rounded-[3rem] border border-slate-800 p-8 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                     <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
                  </div>
                  <Award className="w-32 h-32 text-primary animate-pulse filter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-8" />
                  <div className="text-center">
                     <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-600 mb-2">Security ID</p>
                     <p className="font-mono text-[10px] text-slate-400">0x8B...C2A9_F42</p>
                  </div>
               </div>
            </div>
         </div>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fcfcfd] overflow-hidden font-sans selection:bg-primary/20">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-[70] w-72 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col ${sidebarCollapsed && 'lg:w-[94px]'}`}>
        <div className={`p-8 border-b border-slate-50 flex items-center justify-between ${sidebarCollapsed && 'justify-center p-6'}`}>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center p-1.5 shadow-lg shadow-slate-200">
                 <img src="/interq-logo.png" alt="logo" className="w-full h-full object-contain" />
              </div>
              {!sidebarCollapsed && (
                 <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">InterQ</h2>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">Job Seeker Portal</span>
                 </div>
              )}
           </div>
           <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
           </Button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
           {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${
                  activeTab === item.id
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-primary' : ''}`} />
                {!sidebarCollapsed && <span className="text-sm font-black whitespace-nowrap">{item.label}</span>}
                {!sidebarCollapsed && activeTab === item.id && (
                   <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
           ))}
        </nav>

        <div className="p-4 border-t border-slate-50">
           <div className={`bg-slate-50 p-4 rounded-3xl ${sidebarCollapsed && 'p-2'}`}>
              <div className={`flex items-center gap-3 mb-4 ${sidebarCollapsed && 'justify-center'}`}>
                 <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                    <AvatarFallback className="bg-primary text-white text-[10px] font-black">{seekerData.name.charAt(0)}</AvatarFallback>
                 </Avatar>
                 {!sidebarCollapsed && (
                    <div className="min-w-0">
                       <p className="text-xs font-black text-slate-900 truncate">{seekerData.name}</p>
                       <p className="text-[10px] text-slate-400 font-bold truncate">Basic License</p>
                    </div>
                 )}
              </div>
              {!sidebarCollapsed && (
                 <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-destructive h-10 px-2 group" onClick={() => {signOut(); navigate("/auth");}}>
                    <LogOut className="h-4 w-4 mr-3 transition-transform group-hover:-translate-x-1" /> Sign Out
                 </Button>
              )}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/30">
        <header className="h-[90px] bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
           <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                 <Menu className="h-6 w-6" />
              </Button>
              <div className="hidden lg:flex items-center gap-4">
                 <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-slate-400 hover:text-slate-900">
                    <Menu className="h-5 w-5" />
                 </Button>
                 <Separator orientation="vertical" className="h-6 bg-slate-200" />
                 <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                    {navItems.find(i => i.id === activeTab)?.label}
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border-none h-5">v2.4</Badge>
                 </h2>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                 Marketability: <span className="ml-2">High 🔥</span>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary relative group">
                 <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
              </Button>
              <Separator orientation="vertical" className="h-10 bg-slate-100 mx-2" />
              <div className="flex items-center gap-3 pl-2">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-slate-900 leading-none">John Doe</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Free Tier</p>
                 </div>
                 <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-1 ring-slate-100 cursor-pointer hover:scale-105 transition-transform">
                    <AvatarFallback className="bg-slate-900 text-white font-black text-[10px]">JD</AvatarFallback>
                 </Avatar>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative">
           <div className="max-w-[1400px] mx-auto">
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "certificates" && renderCertificates()}
              {activeTab === "assessments" && (
                 <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h1 className="text-3xl font-black mb-8">Your Assignments</h1>
                    <div className="grid gap-6">
                       {seekerData.assessments.map(assessment => (
                          <Card key={assessment.id} className="bg-white border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                             <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                   <div className={`w-3 md:w-2 ${assessment.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'}`} />
                                   <div className="flex-1 p-8">
                                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                         <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                               <Badge className="bg-slate-100 text-slate-600 border-none font-bold uppercase text-[9px] tracking-widest">{assessment.difficulty}</Badge>
                                               <span className="text-xs font-bold text-slate-400">{assessment.company}</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{assessment.title}</h3>
                                            <div className="flex items-center gap-4 pt-2">
                                               <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                  <Calendar className="h-3.5 w-3.5" /> Starts: {assessment.deadline}
                                               </div>
                                               <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                  <Clock className="h-3.5 w-3.5" /> Est. 45 mins
                                               </div>
                                            </div>
                                         </div>
                                         <div className="flex flex-col items-end gap-3">
                                            {assessment.status === 'Completed' ? (
                                               <div className="flex flex-col items-end">
                                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Score</p>
                                                  <p className="text-3xl font-black text-emerald-500">{assessment.score}%</p>
                                                  <Button variant="ghost" className="text-primary font-black text-xs h-auto p-0 mt-2">View Breakdown</Button>
                                               </div>
                                            ) : (
                                               <Button className="bg-slate-900 text-white font-black h-12 px-8 rounded-2xl shadow-xl shadow-slate-200">
                                                  Begin Evaluation
                                               </Button>
                                            )}
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </CardContent>
                          </Card>
                       ))}
                    </div>
                 </div>
              )}
              {activeTab === "results" && (
                 <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h1 className="text-3xl font-black mb-8">Skills Analytics</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <Card className="p-8 border-none shadow-sm h-[400px]">
                          <CardHeader className="p-0 mb-6">
                             <CardTitle className="text-lg">Radar Profile</CardTitle>
                          </CardHeader>
                          <div className="h-full flex items-center justify-center">
                             <PieChart width={300} height={300}>
                                <Pie
                                  data={seekerData.results}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={100}
                                  paddingAngle={5}
                                  dataKey="score"
                                >
                                  {seekerData.results.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                             </PieChart>
                          </div>
                       </Card>
                       <div className="space-y-6">
                          <Card className="p-6 border-none shadow-sm">
                             <h4 className="font-black text-slate-900 mb-4">Core Competencies</h4>
                             <div className="space-y-6">
                                {seekerData.results.map(skill => (
                                   <div key={skill.name} className="space-y-2">
                                      <div className="flex items-center justify-between">
                                         <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{skill.name}</span>
                                         <span className="text-sm font-black">{skill.score}%</span>
                                      </div>
                                      <Progress value={skill.score} className="h-2 rounded-full" />
                                   </div>
                                ))}
                             </div>
                          </Card>
                       </div>
                    </div>
                 </div>
              )}
              {/* Other views as needed */}
           </div>
        </main>
      </div>
    </div>
  );
}

// Helper components missing from @/components/ui/select if not strictly used as original
function Trigger({children, className}: any) {
   return <button className={className}>{children}</button>;
}
function Secret() { return null; }
function Select({children}: any) { return <div className="relative">{children}</div>; }
function Separator({className}: any) { return <div className={`w-full bg-slate-100 ${className}`} />; }
function Legend() { return null; }
