import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label as UILabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  MoreVertical,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Edit,
  Trash2,
  Eye,
  Copy,
  Filter,
} from "lucide-react";
import { mockJobs as initialMockJobs } from "@/data/adminModuleData";

export default function CompanyJobs() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const savedJobs = localStorage.getItem('companyJobs');
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      setJobs(initialMockJobs);
      localStorage.setItem('companyJobs', JSON.stringify(initialMockJobs));
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "Engineering",
    location: "",
    salaryMin: 80000,
    salaryMax: 150000,
    workplaceType: "hybrid"
  });

  const handlePostJob = () => {
    if (!newJob.title || !newJob.location) {
      toast({ title: "Incomplete Form", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    if (editingJobId) {
      const updated = jobs.map(j => j.id === editingJobId ? { ...j, ...newJob } : j);
      setJobs(updated);
      localStorage.setItem('companyJobs', JSON.stringify(updated));
      setEditingJobId(null);
      toast({ title: "Job Updated", description: "Listing has been successfully updated." });
    } else {
      const jobToAdd = {
        id: "job-" + Date.now(),
        ...newJob,
        companyName: "InterQ Technologies",
        applicationsCount: 0,
        status: "open",
        postedAt: new Date().toISOString()
      };
      const updated = [jobToAdd, ...jobs];
      setJobs(updated);
      localStorage.setItem('companyJobs', JSON.stringify(updated));
      toast({ title: "Job Posted", description: "Your new job listing is now live." });
    }
    
    setIsModalOpen(false);
    setNewJob({ title: "", department: "Engineering", location: "", salaryMin: 80000, salaryMax: 150000, workplaceType: "hybrid" });
  };

  const handleDuplicate = (job: any) => {
    const duplicated = {
      ...job,
      id: "job-copy-" + Date.now(),
      title: `${job.title} (Copy)`,
      applicationsCount: 0,
      postedAt: new Date().toISOString()
    };
    const updated = [duplicated, ...jobs];
    setJobs(updated);
    localStorage.setItem('companyJobs', JSON.stringify(updated));
    toast({ title: "Job Duplicated", description: "New listing created from copy." });
  };

  const handleEdit = (job: any) => {
    setNewJob({
      title: job.title,
      department: job.department,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      workplaceType: job.workplaceType
    });
    setEditingJobId(job.id);
    setIsModalOpen(true);
  };


  const handleDeleteJob = (id: string) => {
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    localStorage.setItem('companyJobs', JSON.stringify(updated));
    toast({ title: "Job Deleted", description: "Job listing has been removed." });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      (job.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (job.department?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    closed: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-700",
    paused: "bg-amber-100 text-amber-700",
  };

  const stats = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === "open").length,
    totalApplicants: jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-500">Post and manage your job listings</p>
        </div>
        <Button onClick={() => { setEditingJobId(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Positions</p>
                <p className="text-2xl font-bold text-green-600">{stats.open}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applicants</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalApplicants}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg per Job</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.total > 0 ? Math.round(stats.totalApplicants / stats.total) : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Job Postings</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Salary Range</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Work Type</TableHead>
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
                    <p className="text-xs text-gray-500">{job.companyName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{job.department}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4" />
                    {(job.salaryMin / 1000).toFixed(0)}k - {(job.salaryMax / 1000).toFixed(0)}k
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="font-medium">{job.applicationsCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm capitalize">{job.workplaceType.replace("_", "-")}</span>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[job.status] || "bg-gray-100 text-gray-700"}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(job)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(job)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        const navigate = (window as any).navigation_router; // In case I had one, otherwise toast
                        toast({ title: "Navigating...", description: "Viewing applicants for this position." });
                      }}>
                        <Users className="w-4 h-4 mr-2" />
                        View Applicants
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(job)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create Job Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="w-4 h-4 mr-2" />
                Bulk Import Jobs
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">New applications today</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Views this week</span>
                <span className="font-semibold">245</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Saved jobs</span>
                <span className="font-semibold">38</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Tips</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Jobs with salary ranges get 30% more applications</p>
              <p>Keep job descriptions under 700 words</p>
              <p>Respond to applicants within 48 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
            <DialogTitle>{editingJobId ? "Edit Position" : "Post New Position"}</DialogTitle>
            <DialogDescription>
              {editingJobId ? "Update existing job details." : "Fill in the details to create a new job opening."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-slate-800">
            <div className="grid gap-2">
              <UILabel htmlFor="title">Job Title</UILabel>
              <Input 
                id="title" 
                placeholder="e.g. Senior Product Designer" 
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <UILabel htmlFor="dept">Department</UILabel>
                <select 
                  id="dept" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={newJob.department}
                  onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              <div className="grid gap-2">
                <UILabel htmlFor="workType">Work Type</UILabel>
                <select 
                  id="workType" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={newJob.workplaceType}
                  onChange={(e) => setNewJob({...newJob, workplaceType: e.target.value})}
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <UILabel htmlFor="loc">Location</UILabel>
              <Input 
                id="loc" 
                placeholder="e.g. San Francisco, CA" 
                value={newJob.location}
                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <UILabel htmlFor="sMin">Min Salary ($)</UILabel>
                <Input 
                  id="sMin" 
                  type="number" 
                  value={newJob.salaryMin}
                  onChange={(e) => setNewJob({...newJob, salaryMin: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <UILabel htmlFor="sMax">Max Salary ($)</UILabel>
                <Input 
                  id="sMax" 
                  type="number" 
                  value={newJob.salaryMax}
                  onChange={(e) => setNewJob({...newJob, salaryMax: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setEditingJobId(null); }}>Cancel</Button>
            <Button onClick={handlePostJob}>{editingJobId ? "Save Changes" : "Post Job"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
