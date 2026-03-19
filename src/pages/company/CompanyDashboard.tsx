import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, Users, Briefcase, UserCheck, Calendar, FileText,
  CheckCircle, Eye, Download, Plus, ArrowUpRight, ArrowDownRight,
  Activity, Star, MessageSquare, Settings, Bell, Search,
  MoreHorizontal, Filter, X, UserPlus, Edit, Trash2, AlertCircle,
  Clock, DollarSign, TrendingUp, PieChart, BarChart3, LineChart,
  UsersRound, BriefcaseBusiness, ClipboardCheck, Send, RefreshCw,
  Mail, Phone, MapPin, Globe, Loader2, Check, AlertTriangle,
  ChevronRight, Zap, Target, Award, UserCog, Shield, Crown, User
} from "lucide-react";
import {
  LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  AreaChart, Area, Legend
} from 'recharts';

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  company_size: string | null;
  created_at: string;
}

interface Employee {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  joined_at: string;
  status: string;
}

interface Job {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  status: string | null;
  employment_type: string | null;
  description: string | null;
  created_at: string;
  created_by: string;
  applications?: number;
}

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  current_title: string | null;
  location: string | null;
  status: string;
  applied_job?: string;
  applied_at: string;
  source: string;
  rating: number;
  skills: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'application' | 'interview' | 'system' | 'offer';
  is_read: boolean;
  created_at: string;
}

const CHART_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const CompanyDashboard = () => {
  const { user, isDemo } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dialogs
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [createEmployeeOpen, setCreateEmployeeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [candidateStatusFilter, setCandidateStatusFilter] = useState("all");
  
  // Form states
  const [newJob, setNewJob] = useState({
    title: '', department: '', location: '', employment_type: 'Full-time',
    description: '', salary_min: '', salary_max: '', remote: false
  });
  const [newEmployee, setNewEmployee] = useState({
    email: '', full_name: '', role: 'recruiter', phone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch company
        const { data: membership } = await supabase
          .from("company_members")
          .select("company_id, companies(*)")
          .eq("user_id", user.id)
          .single();
        
        if (membership?.companies) {
          setCompany(membership.companies as Company);
          
          // Fetch jobs
          const { data: jobsData } = await supabase
            .from("jobs")
            .select("*")
            .eq("company_id", membership.company_id)
            .order("created_at", { ascending: false });
          setJobs(jobsData || []);
          
          // Fetch employees
          const { data: employeesData } = await supabase
            .from("company_members")
            .select("*, profiles(full_name, avatar_url)")
            .eq("company_id", membership.company_id);
          
          const formattedEmployees: Employee[] = (employeesData || []).map((e: any) => ({
            id: e.user_id,
            email: e.profiles?.email || '',
            full_name: e.profiles?.full_name || 'Unknown',
            avatar_url: e.profiles?.avatar_url || null,
            role: e.role,
            joined_at: e.joined_at,
            status: 'active'
          }));
          setEmployees(formattedEmployees);
          
          // Fetch candidates
          const { data: candidatesData } = await supabase
            .from("candidates")
            .select("*")
            .eq("company_id", membership.company_id)
            .order("created_at", { ascending: false });
          
          const formattedCandidates: Candidate[] = (candidatesData || []).map((c: any) => ({
            id: c.id,
            full_name: c.full_name,
            email: c.email,
            phone: c.phone,
            current_title: c.current_title,
            location: c.location,
            status: c.status,
            applied_job: c.job_id,
            applied_at: c.created_at,
            source: 'Direct',
            rating: 0,
            skills: c.skills || []
          }));
          setCandidates(formattedCandidates);
        }
        
        // Fetch notifications
        const { data: notificationsData } = await supabase
          .from("job_seeker_notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        
        const formattedNotifications: Notification[] = (notificationsData || []).map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type as any,
          is_read: n.is_read,
          created_at: n.created_at
        }));
        setNotifications(formattedNotifications);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({ title: "Error", description: "Failed to load dashboard data", variant: "destructive" });
      }
      
      setLoading(false);
    };

    fetchData();
  }, [user, toast]);

  // Stats calculation
  const stats = useMemo(() => ({
    activeJobs: jobs.filter(j => j.status === 'open').length,
    totalCandidates: candidates.length,
    pendingReview: candidates.filter(c => c.status === 'applied' || c.status === 'screening').length,
    interviewsScheduled: candidates.filter(c => c.status === 'interview').length,
    offersSent: candidates.filter(c => c.status === 'offer').length,
    hiresCompleted: candidates.filter(c => c.status === 'hired').length,
    employeesCount: employees.length,
    totalApplications: candidates.length
  }), [jobs, candidates, employees]);

  // Analytics data
  const analyticsData = useMemo(() => ({
    applicationsTrend: [
      { month: 'Jan', applications: 45, hires: 3 },
      { month: 'Feb', applications: 52, hires: 5 },
      { month: 'Mar', applications: 48, hires: 4 },
      { month: 'Apr', applications: 61, hires: 6 },
      { month: 'May', applications: 55, hires: 4 },
      { month: 'Jun', applications: 70, hires: 8 },
    ],
    pipelineDistribution: [
      { name: 'Applied', value: candidates.filter(c => c.status === 'applied').length || 45, color: CHART_COLORS[0] },
      { name: 'Screening', value: candidates.filter(c => c.status === 'screening').length || 30, color: CHART_COLORS[1] },
      { name: 'Interview', value: candidates.filter(c => c.status === 'interview').length || 18, color: CHART_COLORS[2] },
      { name: 'Offer', value: candidates.filter(c => c.status === 'offer').length || 8, color: CHART_COLORS[3] },
      { name: 'Hired', value: candidates.filter(c => c.status === 'hired').length || 5, color: CHART_COLORS[4] },
    ],
    sourceDistribution: [
      { source: 'LinkedIn', count: 120 },
      { source: 'Website', count: 85 },
      { source: 'Referral', count: 65 },
      { source: 'Indeed', count: 45 },
    ]
  }), [candidates]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.department || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = jobStatusFilter === 'all' || job.status === jobStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, jobStatusFilter]);

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = candidateStatusFilter === 'all' || c.status === candidateStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchTerm, candidateStatusFilter]);

  // Create job
  const handleCreateJob = async () => {
    if (!newJob.title || !company) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from("jobs").insert({
        title: newJob.title,
        department: newJob.department,
        location: newJob.location,
        employment_type: newJob.employment_type,
        description: newJob.description,
        company_id: company.id,
        created_by: user?.id,
        status: 'open'
      });

      if (error) throw error;

      toast({ title: "Success", description: "Job created successfully" });
      setCreateJobOpen(false);
      setNewJob({ title: '', department: '', location: '', employment_type: 'Full-time', description: '', salary_min: '', salary_max: '', remote: false });
      
      // Refresh jobs
      const { data: jobsData } = await supabase.from("jobs").select("*").eq("company_id", company.id);
      setJobs(jobsData || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create job", variant: "destructive" });
    }
    setSubmitting(false);
  };

  // Create employee invite
  const handleCreateEmployee = async () => {
    if (!newEmployee.email || !newEmployee.full_name || !company) return;
    
    setSubmitting(true);
    try {
      // In production, this would send an invite email
      toast({ title: "Success", description: `Invitation sent to ${newEmployee.email}` });
      setCreateEmployeeOpen(false);
      setNewEmployee({ email: '', full_name: '', role: 'recruiter', phone: '' });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send invitation", variant: "destructive" });
    }
    setSubmitting(false);
  };

  // Update job status
  const handleUpdateJobStatus = async (jobId: string, status: string) => {
    try {
      await supabase.from("jobs").update({ status }).eq("id", jobId);
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status } : j));
      toast({ title: "Success", description: "Job status updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  // Update candidate status
  const handleUpdateCandidateStatus = async (candidateId: string, status: string) => {
    try {
      await supabase.from("candidates").update({ status }).eq("id", candidateId);
      setCandidates(candidates.map(c => c.id === candidateId ? { ...c, status } : c));
      toast({ title: "Success", description: "Candidate status updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await supabase.from("job_seeker_notifications").update({ is_read: true }).eq("id", id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      open: { label: "Open", className: "bg-green-100 text-green-700 border-green-200" },
      closed: { label: "Closed", className: "bg-gray-100 text-gray-700 border-gray-200" },
      draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      applied: { label: "Applied", className: "bg-blue-100 text-blue-700 border-blue-200" },
      screening: { label: "Screening", className: "bg-purple-100 text-purple-700 border-purple-200" },
      interview: { label: "Interview", className: "bg-orange-100 text-orange-700 border-orange-200" },
      offer: { label: "Offer", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      hired: { label: "Hired", className: "bg-green-100 text-green-700 border-green-200" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-200" },
    };
    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-700" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; className: string; icon: any }> = {
      admin: { label: "Admin", className: "bg-purple-100 text-purple-700", icon: Crown },
      hr: { label: "HR", className: "bg-blue-100 text-blue-700", icon: UsersRound },
      recruiter: { label: "Recruiter", className: "bg-green-100 text-green-700", icon: UserCheck },
      hiring_manager: { label: "Hiring Manager", className: "bg-orange-100 text-orange-700", icon: Briefcase },
      interviewer: { label: "Interviewer", className: "bg-cyan-100 text-cyan-700", icon: MessageSquare },
    };
    const config = roleConfig[role] || { label: role, className: "bg-gray-100 text-gray-700", icon: User };
    return (
      <Badge className={config.className}>
        <config.icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {company?.name || 'Company'} Dashboard
          </h1>
          <p className="text-muted-foreground">
            {isDemo ? 'Demo Mode - ' : ''}Manage your hiring pipeline and team
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate("/company/results")}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setCreateJobOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-cyan-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              +2 this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidates</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground">Scheduled this week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hires</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hiresCompleted}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              +3 this quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Candidates */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Candidates</CardTitle>
                  <CardDescription>Latest applicants for your jobs</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("candidates")}>
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {filteredCandidates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No candidates yet</p>
                    <p className="text-sm">Candidates will appear here when they apply</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCandidates.slice(0, 5).map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                              {c.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{c.full_name}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                        {getStatusBadge(c.status)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Jobs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Jobs</CardTitle>
                  <CardDescription>Currently open positions</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("jobs")}>
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {filteredJobs.filter(j => j.status === 'open').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No active jobs</p>
                    <Button size="sm" className="mt-2" onClick={() => setCreateJobOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Post a Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredJobs.filter(j => j.status === 'open').slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium text-sm">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.department} • {job.location}</p>
                        </div>
                        <Badge variant="outline">{stats.totalCandidates} applicants</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pipeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
              <CardDescription>Current status of all candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {analyticsData.pipelineDistribution.map((stage, i) => (
                  <div key={stage.name} className="text-center p-4 rounded-xl bg-muted/50">
                    <div className="text-2xl font-bold" style={{ color: stage.color }}>{stage.value}</div>
                    <p className="text-sm text-muted-foreground">{stage.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Job Listings</CardTitle>
                  <CardDescription>Manage your job postings</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search jobs..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={jobStatusFilter} onValueChange={setJobStatusFilter}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setCreateJobOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Job
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No jobs found</p>
                  <p className="text-sm">Create your first job posting to get started</p>
                  <Button className="mt-4" onClick={() => setCreateJobOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-xs text-muted-foreground">Posted {new Date(job.created_at).toLocaleDateString()}</p>
                          </div>
                        </TableCell>
                        <TableCell>{job.department || '-'}</TableCell>
                        <TableCell>{job.location || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.employment_type || 'Full-time'}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(job.status || 'draft')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/company/candidates?job=${job.id}`)}>
                                <Users className="h-4 w-4 mr-2" /> View Applicants
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateJobStatus(job.id, job.status === 'open' ? 'closed' : 'open')}>
                                <RefreshCw className="h-4 w-4 mr-2" /> {job.status === 'open' ? 'Close' : 'Reopen'}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>All Candidates</CardTitle>
                  <CardDescription>Manage your candidate pipeline</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search candidates..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={candidateStatusFilter} onValueChange={setCandidateStatusFilter}>
                    <SelectTrigger className="w-[150px]"><SelectValue placeholder="Stage" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No candidates found</p>
                  <p className="text-sm">Candidates will appear when they apply to your jobs</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-xs">
                                {c.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{c.full_name}</p>
                              <p className="text-xs text-muted-foreground">{c.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{c.location || '-'}</TableCell>
                        <TableCell>{getStatusBadge(c.status)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(c.applied_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateCandidateStatus(c.id, 'screening')}>
                                <ClipboardCheck className="h-4 w-4 mr-2" /> Move to Screening
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateCandidateStatus(c.id, 'interview')}>
                                <Calendar className="h-4 w-4 mr-2" /> Schedule Interview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateCandidateStatus(c.id, 'offer')}>
                                <Send className="h-4 w-4 mr-2" /> Send Offer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Team Members</h2>
              <p className="text-sm text-muted-foreground">{employees.length} members in your company</p>
            </div>
            <Button onClick={() => setCreateEmployeeOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                          {employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.full_name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UserCog className="h-4 w-4 mr-2" /> Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    {getRoleBadge(employee.role)}
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(employee.joined_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Applications Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Applications Trend</CardTitle>
                <CardDescription>Monthly applications and hires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.applicationsTrend}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Area type="monotone" dataKey="applications" stroke="#06b6d4" fillOpacity={1} fill="url(#colorApps)" />
                      <Area type="monotone" dataKey="hires" stroke="#10b981" fillOpacity={1} fill="url(#colorHires)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Pipeline</CardTitle>
                <CardDescription>Distribution by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.pipelineDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analyticsData.pipelineDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Source Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate Sources</CardTitle>
              <CardDescription>Where your candidates come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.sourceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="source" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Job Dialog */}
      <Dialog open={createJobOpen} onOpenChange={setCreateJobOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>Fill in the details to create a new job posting</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title *</Label>
              <Input 
                id="job-title" 
                placeholder="e.g. Senior Software Engineer" 
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  placeholder="e.g. Engineering" 
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="e.g. San Francisco, CA" 
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select value={newJob.employment_type} onValueChange={(v) => setNewJob({ ...newJob, employment_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <div className="flex gap-2">
                  <Input placeholder="Min" value={newJob.salary_min} onChange={(e) => setNewJob({ ...newJob, salary_min: e.target.value })} />
                  <Input placeholder="Max" value={newJob.salary_max} onChange={(e) => setNewJob({ ...newJob, salary_max: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="remote" 
                checked={newJob.remote}
                onCheckedChange={(checked) => setNewJob({ ...newJob, remote: checked })}
              />
              <Label htmlFor="remote">Remote position available</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea 
                id="description" 
                rows={4} 
                placeholder="Describe the role, responsibilities, and requirements..."
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateJobOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateJob} disabled={!newJob.title || submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Employee Dialog */}
      <Dialog open={createEmployeeOpen} onOpenChange={setCreateEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to join your company workspace</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee-name">Full Name *</Label>
              <Input 
                id="employee-name" 
                placeholder="John Smith" 
                value={newEmployee.full_name}
                onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-email">Email *</Label>
              <Input 
                id="employee-email" 
                type="email"
                placeholder="john@company.com" 
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newEmployee.role} onValueChange={(v) => setNewEmployee({ ...newEmployee, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="hr">HR Manager</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
                  <SelectItem value="interviewer">Interviewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateEmployeeOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEmployee} disabled={!newEmployee.email || !newEmployee.full_name || submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDashboard;
