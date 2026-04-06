import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Download,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Globe,
  Calendar,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  UserPlus,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import {
  companyService,
  jobService,
  candidateService,
  dashboardService,
  isValidUrl,
  formatLocation
} from '@/services/companyService';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

interface Company {
  id: string;
  name: string;
  email?: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  description?: string;
}

interface Job {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
  status: 'open' | 'closed' | 'draft';
  created_at: string;
  applications?: number;
}

interface Candidate {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  current_title?: string;
  location?: string;
  status: string;
  source?: string;
  skills?: string[];
  rating?: number;
  created_at: string;
}

interface Stats {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalCandidates: number;
  pendingReview: number;
  interviewsScheduled: number;
  offersSent: number;
  hiresCompleted: number;
}

// Mock data for fallback
const mockStats: Stats = {
  totalJobs: 8,
  openJobs: 6,
  closedJobs: 2,
  totalCandidates: 156,
  pendingReview: 42,
  interviewsScheduled: 18,
  offersSent: 5,
  hiresCompleted: 12
};

const mockJobs: Job[] = [
  { id: '1', title: 'Senior Frontend Developer', department: 'Engineering', location: 'San Francisco, CA', status: 'open', created_at: '2025-01-15', applications: 24 },
  { id: '2', title: 'Backend Developer', department: 'Engineering', location: 'Remote', status: 'open', created_at: '2025-01-14', applications: 18 },
  { id: '3', title: 'Product Manager', department: 'Product', location: 'New York, NY', status: 'open', created_at: '2025-01-13', applications: 31 },
  { id: '4', title: 'UX Designer', department: 'Design', location: 'San Francisco, CA', status: 'closed', created_at: '2025-01-10', applications: 15 },
];

const mockCandidates: Candidate[] = [
  { id: '1', full_name: 'John Doe', email: 'john@example.com', current_title: 'Frontend Developer', location: 'San Francisco, CA', status: 'interview', source: 'LinkedIn', rating: 4.5, created_at: '2025-01-15' },
  { id: '2', full_name: 'Sarah Wilson', email: 'sarah@example.com', current_title: 'Senior Developer', location: 'Austin, TX', status: 'applied', source: 'Website', rating: 4.0, created_at: '2025-01-14' },
  { id: '3', full_name: 'Mike Johnson', email: 'mike@example.com', current_title: 'Backend Engineer', location: 'Seattle, WA', status: 'screening', source: 'Referral', rating: 3.8, created_at: '2025-01-13' },
  { id: '4', full_name: 'Emily Davis', email: 'emily@example.com', current_title: 'Product Manager', location: 'New York, NY', status: 'offer', source: 'LinkedIn', rating: 4.8, created_at: '2025-01-12' },
  { id: '5', full_name: 'David Kim', email: 'david@example.com', current_title: 'Software Engineer', location: 'Chicago, IL', status: 'hired', source: 'Indeed', rating: 4.2, created_at: '2025-01-11' },
];

const mockApplicationsTrend = [
  { month: 'Jan', applications: 45, hires: 3 },
  { month: 'Feb', applications: 52, hires: 5 },
  { month: 'Mar', applications: 48, hires: 4 },
  { month: 'Apr', applications: 61, hires: 6 },
  { month: 'May', applications: 55, hires: 4 },
  { month: 'Jun', applications: 70, hires: 8 },
];

export default function CompanyDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<Stats>(mockStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    website: '',
    industry: '',
    company_size: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load from service - if it fails, use mock data
      try {
        const [companyData, jobsData, candidatesData, statsData] = await Promise.all([
          companyService.getById('00000000-0000-0000-0000-000000000001'),
          jobService.getByCompany('00000000-0000-0000-0000-000000000001'),
          candidateService.getByCompany('00000000-0000-0000-0000-000000000001'),
          dashboardService.getStats('00000000-0000-0000-0000-000000000001')
        ]);

        if (companyData) setCompany(companyData);
        if (jobsData.length) setJobs(jobsData);
        if (candidatesData.length) setCandidates(candidatesData);
        if (statsData) setStats(statsData);
      } catch (serviceError) {
        console.log('Using mock data - service not available:', serviceError);
        // Use mock data as fallback
        setJobs(mockJobs);
        setCandidates(mockCandidates);
        setStats(mockStats);
        setCompany({
          id: '00000000-0000-0000-0000-000000000001',
          name: 'TechCorp Solutions',
          email: 'contact@techcorp.com',
          industry: 'Technology',
          company_size: '500-1000',
          location: 'San Francisco, CA',
          website: 'https://techcorp.com',
          description: 'Leading technology solutions provider'
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompany = async () => {
    if (!company) return;

    // Validate
    if (!editForm.name.trim()) {
      toast({ title: 'Company name is required', variant: 'destructive' });
      return;
    }

    if (editForm.website && !isValidUrl(editForm.website)) {
      toast({ title: 'Invalid website URL', description: 'Please enter a valid URL starting with http:// or https://', variant: 'destructive' });
      return;
    }

    try {
      const updated = await companyService.update(company.id, {
        name: formatLocation(editForm.name.trim()),
        email: editForm.email?.trim() || undefined,
        website: editForm.website?.trim() || undefined,
        industry: editForm.industry || undefined,
        company_size: editForm.company_size || undefined,
        location: formatLocation(editForm.location || ''),
        description: editForm.description?.trim() || undefined
      });

      setCompany(updated);
      setEditModalOpen(false);
      toast({ title: 'Company updated successfully' });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({ title: 'Failed to update company', variant: 'destructive' });
    }
  };

  const handleCreateJob = async (jobData: Partial<Job>) => {
    if (!company) return;

    if (!jobData.title?.trim()) {
      toast({ title: 'Job title is required', variant: 'destructive' });
      return;
    }

    try {
      if (editingJob) {
        const updated = await jobService.update(editingJob.id, jobData);
        setJobs(jobs.map(j => j.id === updated.id ? updated : j));
        toast({ title: 'Job updated successfully' });
      } else {
        const created = await jobService.create(company.id, jobData as any, '');
        setJobs([created, ...jobs]);
        toast({ title: 'Job created successfully' });
      }
      setJobModalOpen(false);
      setEditingJob(null);
    } catch (error) {
      console.error('Error saving job:', error);
      toast({ title: 'Failed to save job', variant: 'destructive' });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await jobService.delete(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      toast({ title: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({ title: 'Failed to delete job', variant: 'destructive' });
    }
  };

  const handleUpdateCandidateStatus = async (candidateId: string, status: string) => {
    try {
      await candidateService.updateStatus(candidateId, status);
      setCandidates(candidates.map(c => c.id === candidateId ? { ...c, status } : c));
      toast({ title: 'Candidate status updated' });
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast({ title: 'Failed to update candidate', variant: 'destructive' });
    }
  };

  const openEditModal = () => {
    if (company) {
      setEditForm({
        name: company.name || '',
        email: company.email || '',
        website: company.website || '',
        industry: company.industry || '',
        company_size: company.company_size || '',
        location: company.location || '',
        description: company.description || ''
      });
      setEditModalOpen(true);
    }
  };

  const openJobModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
    } else {
      setEditingJob(null);
    }
    setJobModalOpen(true);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.current_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-green-100 text-green-800">Open</Badge>;
      case 'closed': return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      case 'draft': return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'applied': return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>;
      case 'screening': return <Badge className="bg-purple-100 text-purple-800">Screening</Badge>;
      case 'interview': return <Badge className="bg-indigo-100 text-indigo-800">Interview</Badge>;
      case 'offer': return <Badge className="bg-pink-100 text-pink-800">Offer</Badge>;
      case 'hired': return <Badge className="bg-green-100 text-green-800">Hired</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPipelineStats = () => {
    return {
      applied: candidates.filter(c => c.status === 'applied').length,
      screening: candidates.filter(c => c.status === 'screening').length,
      interview: candidates.filter(c => c.status === 'interview').length,
      offer: candidates.filter(c => c.status === 'offer').length,
      hired: candidates.filter(c => c.status === 'hired').length
    };
  };

  const pipeline = getPipelineStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-slate-100 dark:border-slate-800 shadow-md">
            {company?.logo_url ? (
              <AvatarImage src={company.logo_url} alt={company.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl">
                {company?.name?.slice(0, 2).toUpperCase() || 'TC'}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{company?.name || 'Company Dashboard'}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              {company?.industry && <span>{company.industry}</span>}
              {company?.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {company.location}
                  </span>
                </>
              )}
              {company?.website && (
                <>
                  <span>•</span>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                    <Globe className="h-3 w-3" />
                    Website
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEditModal}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{stats.totalJobs}</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Positions</p>
                <p className="text-2xl font-bold text-green-600">{stats.openJobs}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold">{stats.totalCandidates}</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hires (This Month)</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.hiresCompleted}</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <UserPlus className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hiring Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Hiring Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Applied', value: pipeline.applied, color: 'bg-blue-500' },
                    { label: 'Screening', value: pipeline.screening, color: 'bg-purple-500' },
                    { label: 'Interview', value: pipeline.interview, color: 'bg-indigo-500' },
                    { label: 'Offer', value: pipeline.offer, color: 'bg-pink-500' },
                    { label: 'Hired', value: pipeline.hired, color: 'bg-green-500' },
                  ].map((stage) => (
                    <div key={stage.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{stage.label}</span>
                        <span className="font-semibold">{stage.value}</span>
                      </div>
                      <Progress 
                        value={(stage.value / stats.totalCandidates) * 100} 
                        className={`h-2 ${stage.color}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates.slice(0, 5).map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {candidate.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{candidate.full_name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.current_title}</p>
                        </div>
                      </div>
                      {getStatusBadge(candidate.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Job Postings</CardTitle>
                <Button onClick={() => openJobModal()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          {job.department && <span>{job.department}</span>}
                          {job.department && job.location && <span>•</span>}
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status)}
                        <Button variant="ghost" size="sm" onClick={() => openJobModal(job)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(job.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.applications || 0} applicants
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Candidates Tab */}
        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Candidates ({candidates.length})</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search candidates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
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
              <div className="space-y-4">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                            {candidate.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{candidate.full_name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.current_title}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            {candidate.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{candidate.email}</span>}
                            {candidate.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{candidate.location}</span>}
                          </div>
                        </div>
                      </div>
                      <Select value={candidate.status} onValueChange={(v) => handleUpdateCandidateStatus(candidate.id, v)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="screening">Screening</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {candidate.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockApplicationsTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} name="Applications" />
                    <Line type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={2} name="Hires" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pipeline Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={[
                        { name: 'Applied', value: pipeline.applied },
                        { name: 'Screening', value: pipeline.screening },
                        { name: 'Interview', value: pipeline.interview },
                        { name: 'Offer', value: pipeline.offer },
                        { name: 'Hired', value: pipeline.hired },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {CHART_COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Company Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
            <DialogDescription>Update your company information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="company@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                placeholder="https://example.com"
              />
              {editForm.website && !isValidUrl(editForm.website) && (
                <p className="text-xs text-red-500">Please enter a valid URL starting with http:// or https://</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={editForm.industry} onValueChange={(v) => setEditForm({ ...editForm, industry: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Select value={editForm.company_size} onValueChange={(v) => setEditForm({ ...editForm, company_size: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-500">201-500</SelectItem>
                    <SelectItem value="500-1000">500-1000</SelectItem>
                    <SelectItem value="1000+">1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="City, State"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Describe your company..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCompany}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Job Modal */}
      <Dialog open={jobModalOpen} onOpenChange={setJobModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Create New Job'}</DialogTitle>
            <DialogDescription>Fill in the job details</DialogDescription>
          </DialogHeader>
          <JobForm onSubmit={handleCreateJob} onCancel={() => { setJobModalOpen(false); setEditingJob(null); }} job={editingJob} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function JobForm({ onSubmit, onCancel, job }: { onSubmit: (data: any) => void; onCancel: () => void; job?: Job | null }) {
  const [form, setForm] = useState({
    title: job?.title || '',
    department: job?.department || '',
    location: job?.location || '',
    employment_type: job?.employment_type || 'Full-time',
    salary_min: job?.salary_min || 0,
    salary_max: job?.salary_max || 0,
    description: job?.description || '',
    status: job?.status || 'open'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Job Title *</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g., Senior Frontend Developer"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Department</Label>
          <Input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            placeholder="e.g., Engineering"
          />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g., San Francisco, CA"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Employment Type</Label>
          <Select value={form.employment_type} onValueChange={(v) => setForm({ ...form, employment_type: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Salary</Label>
          <Input
            type="number"
            value={form.salary_min}
            onChange={(e) => setForm({ ...form, salary_min: Number(e.target.value) })}
            placeholder="50000"
          />
        </div>
        <div className="space-y-2">
          <Label>Max Salary</Label>
          <Input
            type="number"
            value={form.salary_max}
            onChange={(e) => setForm({ ...form, salary_max: Number(e.target.value) })}
            placeholder="100000"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Job description..."
          rows={4}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{job ? 'Update' : 'Create'} Job</Button>
      </div>
    </form>
  );
}