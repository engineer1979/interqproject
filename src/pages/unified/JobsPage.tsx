import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { mockJobs } from "@/data/adminModuleData";
import {
  Briefcase, Plus, Search, Filter, MapPin, Clock, DollarSign,
  Users, Eye, Edit, Trash2, ChevronRight, Building2, Bookmark
} from "lucide-react";

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  draft: "bg-blue-100 text-blue-800",
};

export default function JobsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [newJob, setNewJob] = useState({
    title: "", department: "", location: "", employmentType: "Full-time",
    salaryMin: "", salaryMax: "", description: "", skills: ""
  });

  const role = user?.role || "jobseeker";
  const canCreate = role === "admin" || role === "company" || role === "recruiter";

  const filtered = mockJobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!newJob.title || !newJob.department) {
      toast({ title: "Error", description: "Title and Department are required", variant: "destructive" });
      return;
    }
    toast({ title: "Job Posted!", description: `"${newJob.title}" has been posted successfully.` });
    setShowCreateDialog(false);
    setNewJob({ title: "", department: "", location: "", employmentType: "Full-time", salaryMin: "", salaryMax: "", description: "", skills: "" });
  };

  const handleSave = (jobId: string) => {
    setSavedJobs(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
    toast({ title: savedJobs.includes(jobId) ? "Job Unsaved" : "Job Saved", description: savedJobs.includes(jobId) ? "Removed from saved jobs." : "Added to your saved jobs." });
  };

  const handleApply = (job: any) => {
    toast({ title: "Application Submitted!", description: `Your application for "${job.title}" has been sent.` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {role === "jobseeker" ? "Browse Jobs" : "Jobs Management"}
          </h1>
          <p className="text-muted-foreground">
            {role === "jobseeker" ? "Find your next opportunity" : "Manage job postings and openings"}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Post New Job
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Jobs", value: mockJobs.length, color: "text-blue-600" },
          { label: "Open Positions", value: mockJobs.filter(j => j.status === "open").length, color: "text-green-600" },
          { label: "Total Openings", value: mockJobs.reduce((sum, j) => sum + (j.openings || 1), 0), color: "text-purple-600" },
          { label: "Applications", value: mockJobs.reduce((sum, j) => sum + (j.applications || 0), 0), color: "text-orange-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search jobs..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="pending_approval">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Cards */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card><CardContent className="p-12 text-center text-muted-foreground">No jobs found matching your criteria.</CardContent></Card>
        ) : filtered.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <Badge className={statusColors[job.status] || "bg-gray-100 text-gray-800"}>
                      {job.status?.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <Building2 className="h-3 w-3" />
                    <span>{job.companyName}</span>
                    <span className="mx-1">•</span>
                    <span>{job.department}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location || "Remote"}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.employmentType || "Full-time"}</span>
                    {(job.salaryMin || job.salaryMax) && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{job.openings || 1} opening{(job.openings || 1) > 1 ? "s" : ""}</span>
                    {job.applications !== undefined && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.applications} applicants</span>}
                  </div>
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.skills.slice(0, 5).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {role === "jobseeker" ? (
                    <>
                      <Button size="sm" onClick={() => handleApply(job)}>Apply Now</Button>
                      <Button size="sm" variant="outline" onClick={() => handleSave(job.id)}>
                        <Bookmark className={`h-3 w-3 mr-1 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                        {savedJobs.includes(job.id) ? "Saved" : "Save"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setSelectedJob(job)}>
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
                      {canCreate && (
                        <Button size="sm" variant="ghost" onClick={() => toast({ title: "Edit mode", description: "Edit job form would open here." })}>
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Job Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Post New Job</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Job Title *</Label>
                <Input placeholder="e.g. Senior React Developer" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
              </div>
              <div>
                <Label>Department *</Label>
                <Input placeholder="e.g. Engineering" value={newJob.department} onChange={e => setNewJob({ ...newJob, department: e.target.value })} />
              </div>
              <div>
                <Label>Location</Label>
                <Input placeholder="e.g. Remote" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} />
              </div>
              <div>
                <Label>Min Salary</Label>
                <Input type="number" placeholder="80000" value={newJob.salaryMin} onChange={e => setNewJob({ ...newJob, salaryMin: e.target.value })} />
              </div>
              <div>
                <Label>Max Salary</Label>
                <Input type="number" placeholder="120000" value={newJob.salaryMax} onChange={e => setNewJob({ ...newJob, salaryMax: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Required Skills (comma separated)</Label>
                <Input placeholder="React, TypeScript, Node.js" value={newJob.skills} onChange={e => setNewJob({ ...newJob, skills: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Job Description</Label>
                <Textarea placeholder="Describe the role, responsibilities, requirements..." rows={4} value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Post Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Job Dialog */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedJob.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Building2 className="h-4 w-4" /><span>{selectedJob.companyName} — {selectedJob.department}</span></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{selectedJob.location}</span></div>
              <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /><span>${selectedJob.salaryMin?.toLocaleString()} – ${selectedJob.salaryMax?.toLocaleString()}</span></div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{selectedJob.applications || 0} applicants · {selectedJob.openings || 1} opening(s)</span></div>
              {selectedJob.skills && (
                <div><p className="font-medium mb-1">Skills Required:</p><div className="flex flex-wrap gap-1">{selectedJob.skills.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}</div></div>
              )}
              <div><p className="font-medium mb-1">Description:</p><p className="text-muted-foreground">{selectedJob.description || "No description provided."}</p></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
              {canCreate && <Button onClick={() => { toast({ title: "Edit mode", description: "Job edit form would open." }); setSelectedJob(null); }}>Edit Job</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
