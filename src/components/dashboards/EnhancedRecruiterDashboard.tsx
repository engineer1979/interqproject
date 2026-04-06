import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Briefcase,
  Users,
  CheckCircle,
  MessageCircle,
  BarChart3,
  Plus,
  ArrowRight,
  Clock,
  ClipboardList,
  Filter,
  Search,
  Calendar,
  Mail,
  Phone,
  Video,
  Star,
  TrendingUp,
  Download,
  Settings,
  Bell,
  UserCheck,
  X
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  appliedRole: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  score: number;
  lastUpdate: string;
  avatar?: string;
  skills: string[];
  interviewDate?: string;
  interviewer?: string;
}

interface PipelineStats {
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  hired: number;
  rejected: number;
}

interface Interview {
  id: string;
  candidate: string;
  role: string;
  date: string;
  time: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export function EnhancedRecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const pipelineStats: PipelineStats = {
    applied: 24,
    screening: 18,
    interview: 12,
    offer: 6,
    hired: 3,
    rejected: 9
  };

  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      appliedRole: 'Senior React Developer',
      status: 'interview',
      score: 92,
      lastUpdate: '2 hours ago',
      skills: ['React', 'TypeScript', 'Node.js'],
      interviewDate: 'Tomorrow, 2:00 PM',
      interviewer: 'Sarah Wilson'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      appliedRole: 'DevOps Engineer',
      status: 'offer',
      score: 87,
      lastUpdate: '1 hour ago',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      interviewDate: 'Completed',
      interviewer: 'Mike Johnson'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      appliedRole: 'Backend Developer',
      status: 'screening',
      score: 78,
      lastUpdate: '30 minutes ago',
      skills: ['Python', 'Django', 'PostgreSQL']
    }
  ];

  const interviews: Interview[] = [
    {
      id: '1',
      candidate: 'John Doe',
      role: 'Senior React Developer',
      date: 'Tomorrow',
      time: '2:00 PM',
      interviewer: 'Sarah Wilson',
      status: 'scheduled'
    },
    {
      id: '2',
      candidate: 'Emily Chen',
      role: 'UX Designer',
      date: 'Today',
      time: '4:30 PM',
      interviewer: 'David Kim',
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Candidate['status']) => {
    switch (status) {
      case 'applied': return <ClipboardList className="w-4 h-4" />;
      case 'screening': return <Search className="w-4 h-4" />;
      case 'interview': return <Video className="w-4 h-4" />;
      case 'offer': return <CheckCircle className="w-4 h-4" />;
      case 'hired': return <UserCheck className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <ClipboardList className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your hiring pipeline and candidates</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Job
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(pipelineStats).map(([status, count]) => (
          <Card key={status} className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-muted-foreground capitalize">{status}</div>
              <Progress value={(count / 24) * 100} className="mt-2 h-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <Card key={candidate.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{candidate.name}</h3>
                          <Badge className={getStatusColor(candidate.status)}>
                            {getStatusIcon(candidate.status)}
                            <span className="ml-1">{candidate.status}</span>
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-2">
                          {candidate.appliedRole} • {candidate.email}
                        </p>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-semibold text-green-600">
                            Score: {candidate.score}%
                          </span>
                          <span className="text-muted-foreground">
                            {candidate.lastUpdate}
                          </span>
                        </div>
                        
                        {candidate.interviewDate && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                            <Calendar className="w-4 h-4" />
                            {candidate.interviewDate} with {candidate.interviewer}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm">View Profile</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pipeline Analytics Sidebar */}
            <div className="w-80 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pipeline Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span className="font-semibold text-green-600">12.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Time to Hire</span>
                      <span className="font-semibold">18 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Offer Acceptance</span>
                      <span className="font-semibold text-green-600">83%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {interviews.map((interview) => (
                      <div key={interview.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{interview.candidate}</p>
                            <p className="text-sm text-muted-foreground">{interview.role}</p>
                          </div>
                          <Badge variant="outline">
                            {interview.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Calendar className="w-4 h-4" />
                          {interview.date} at {interview.time}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Interviewer: {interview.interviewer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Interviews Tab */}
        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <CardTitle>Interview Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Interview scheduling and management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluations Tab */}
        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Detailed candidate evaluation reports and scoring interface.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Advanced analytics and reporting dashboard for recruitment metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}