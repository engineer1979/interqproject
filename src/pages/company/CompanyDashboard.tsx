import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/contexts/SimpleAuthContext";
import {
  Building2, Users, Briefcase, UserCheck, Calendar, FileText,
  CheckCircle, Eye, Download, Plus, ArrowUpRight,
  Activity, Star, MessageSquare, Settings, Bell, Search,
  MoreHorizontal, Filter, X, User, Edit, Trash2, AlertCircle,
  Clock, DollarSign, TrendingUp
} from "lucide-react";
import { mockJobs, mockCandidates, mockInterviews } from "@/data/adminModuleData";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const stats = useMemo(() => ({
    activeJobs: mockJobs.filter(j => j.status === "open").length,
    totalApplicants: mockCandidates.length,
    shortlisted: mockCandidates.filter(c => c.stage === "shortlisted" || c.stage.includes("interview")).length,
    interviewsScheduled: mockInterviews.filter(i => i.status === "scheduled").length,
    offersSent: 5,
    hiresCompleted: 8,
  }), []);

  const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: "Open", color: "bg-green-100 text-green-700" },
    closed: { label: "Closed", color: "bg-gray-100 text-gray-700" },
    draft: { label: "Draft", color: "bg-yellow-100 text-yellow-700" },
    pending_approval: { label: "Pending", color: "bg-orange-100 text-orange-700" },
  };

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
          <p className="text-muted-foreground">Manage your hiring pipeline and team</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Active Jobs", value: stats.activeJobs, icon: Briefcase, color: "text-blue-600", trend: "+2" },
          { title: "Total Applicants", value: stats.totalApplicants, icon: Users, color: "text-green-600", trend: "+12%" },
          { title: "Interviews", value: stats.interviewsScheduled, icon: Calendar, color: "text-purple-600", trend: "+5" },
          { title: "Hires", value: stats.hiresCompleted, icon: CheckCircle, color: "text-emerald-600", trend: "+3" },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Recent Candidates</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCandidates.slice(0, 5).map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{c.fullName}</p>
                          <p className="text-xs text-muted-foreground">{c.appliedRole}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{c.stage.replace("_", " ")}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Upcoming Interviews</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInterviews.filter(i => i.status === "scheduled").slice(0, 4).map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{interview.candidateName}</p>
                          <p className="text-xs text-muted-foreground">{interview.jobTitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{new Date(interview.scheduledAt).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">{interview.mode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle>Job Listings</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search jobs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-[200px]" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => {
                    const statusInfo = statusConfig[job.status] || { label: job.status, color: "bg-gray-100" };
                    return (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-xs text-muted-foreground">{job.companyName}</p>
                          </div>
                        </TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.applications}</TableCell>
                        <TableCell><Badge className={statusInfo.color}>{statusInfo.label}</Badge></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem><Users className="h-4 w-4 mr-2" /> Applicants</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>All Candidates</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Applied Role</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCandidates.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{c.fullName}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{c.appliedRole}</TableCell>
                      <TableCell><Badge variant="outline">{c.stage.replace("_", " ")}</Badge></TableCell>
                      <TableCell>{c.source}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span>{c.rating || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-5">
            {["Applied", "Screening", "Interview", "Offer", "Hired"].map((stage, index) => (
              <Card key={stage}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{stage}</CardTitle>
                    <Badge variant="secondary">{[45, 30, 18, 8, 5][index]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[0, 1, 2].slice(0, Math.max(0, 3 - index)).map((i) => (
                    <div key={i} className="p-3 rounded-lg border bg-card">
                      <p className="font-medium text-sm">{mockCandidates[i + index]?.fullName || "Candidate"}</p>
                      <p className="text-xs text-muted-foreground">{mockJobs[0]?.title || "Position"}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>Fill in the details to create a new job posting</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input placeholder="e.g. Senior Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g. San Francisco, CA" />
              </div>
              <div className="space-y-2">
                <Label>Workplace Type</Label>
                <Select defaultValue="Remote">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Job Description</Label>
              <Textarea rows={4} placeholder="Describe the role, responsibilities, and requirements..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Create Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDashboard;
