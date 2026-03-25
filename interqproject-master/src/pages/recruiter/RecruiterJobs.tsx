import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Button,
} from "@/components/ui/button";
import {
  Badge,
} from "@/components/ui/badge";
import {
  useNavigate,
} from "react-router-dom";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Input,
} from "@/components/ui/input";
import {
  Textarea,
} from "@/components/ui/textarea";
import {
  Label,
} from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Separator,
} from "@/components/ui/separator";

const jobStatusOptions = [
  { value: "all", label: "All Jobs" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
];

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    status: "Open",
    applications: 24,
    postedDate: "2024-01-15",
    salary: "$120k - $150k",
    description: "We are looking for a Senior Frontend Developer with expertise in React, TypeScript, and modern frontend technologies.",
    requirements: [
      "5+ years of experience in frontend development",
      "Expertise in React and TypeScript",
      "Experience with state management libraries",
      "Knowledge of testing frameworks",
    ],
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    status: "Open",
    applications: 18,
    postedDate: "2024-01-18",
    salary: "$110k - $140k",
    description: "Join our product team to drive the vision and execution of our flagship products.",
    requirements: [
      "3+ years of experience in product management",
      "Experience with agile methodologies",
      "Strong analytical and problem-solving skills",
      "Excellent communication skills",
    ],
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    status: "Open",
    applications: 32,
    postedDate: "2024-01-20",
    salary: "$90k - $120k",
    description: "Create beautiful and intuitive user experiences for our web and mobile applications.",
    requirements: [
      "Portfolio showcasing UX/UI design work",
      "Proficiency in Figma, Sketch, or Adobe XD",
      "User research and testing experience",
      "Understanding of accessibility principles",
    ],
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Engineering",
    status: "Closed",
    applications: 15,
    postedDate: "2024-01-10",
    salary: "$130k - $160k",
    description: "Help us build and maintain our scalable infrastructure and deployment pipelines.",
    requirements: [
      "Experience with AWS, Docker, and Kubernetes",
      "CI/CD pipeline expertise",
      "Infrastructure as Code (Terraform, CloudFormation)",
      "Monitoring and logging solutions",
    ],
  },
  {
    id: 5,
    title: "Sales Representative",
    department: "Sales",
    status: "Draft",
    applications: 0,
    postedDate: "2024-01-22",
    salary: "$60k - $80k",
    description: "Join our sales team to drive revenue growth and customer acquisition.",
    requirements: [
      "Proven track record in sales",
      "Excellent communication and negotiation skills",
      "Experience with CRM software",
      "Self-motivated and target-driven",
    ],
  },
  {
    id: 6,
    title: "Marketing Specialist",
    department: "Marketing",
    status: "Open",
    applications: 28,
    postedDate: "2024-01-12",
    salary: "$70k - $90k",
    description: "Develop and execute marketing campaigns to increase brand awareness and lead generation.",
    requirements: [
      "Experience with digital marketing channels",
      "Proficiency in marketing analytics tools",
      "Content creation and copywriting skills",
      "Understanding of SEO and SEM principles",
    ],
  },
];

export default function RecruiterJobs() {
  const navigate = useNavigate();
  const [jobStatus, setJobStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(false);

  const filteredJobs = jobOpenings
    .filter(job =>
      jobStatus === "all" || job.status.toLowerCase() === jobStatus
    )
    .filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleCreateJob = () => {
    setShowCreateJob(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setEditingJob(true);
    setShowCreateJob(true);
  };

  const handleDeleteJob = (id) => {
    // In a real app, this would make an API call
    alert(`Job ${id} would be deleted`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-800";
      case "Closed": return "bg-red-100 text-red-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Openings</h1>
          <p className="text-muted-foreground">
            Manage your job postings and recruitment pipeline
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={handleCreateJob} className="gap-2">
            <Plus className="h-4 w-4" /> New Job
          </Button>
          <Select value={jobStatus} onValueChange={setJobStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {jobStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Input
              placeholder="Search jobs..."
              className="pl-10 bg-muted/50 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No job openings found</p>
            {jobStatus !== "all" && (
              <Button variant="outline" onClick={() => setJobStatus("all")}>
                Show all jobs
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      <div>
                        <p>{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.salary}</p>
                      </div>
                    </TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {job.applications}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{job.postedDate}</TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-48">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setSelectedJob(job);
                              setEditingJob(false);
                              setShowCreateJob(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleEditJob(job)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowCreateJob(false);
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" /> View Candidates
                          </Button>
                          <Separator className="my-2" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-destructive"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Job Modal */}
      <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Job</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] sm:mx-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? "Edit Job Opening" : "Create New Job Opening"}
            </DialogTitle>
            <DialogDescription>
              {editingJob
                ? `Edit the details for "${selectedJob?.title}"`
                : "Fill in the details to post a new job opening."}
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="space-y-6">
            <form>
              <div className="grid gap-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Developer"
                  defaultValue={selectedJob?.title || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g., New York" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role..."
                  className="min-h-[100px]"
                  defaultValue={selectedJob?.description || ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  placeholder="List requirements, one per line"
                  className="min-h-[80px]"
                  defaultValue={
                    selectedJob?.requirements
                      ? selectedJob.requirements.join("\n")
                      : ""
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    placeholder="e.g., $80k - $100k"
                    defaultValue={selectedJob?.salary || ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Employment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </DialogContent>
          <DialogContent className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateJob(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateJob(false)}>
              {editingJob ? "Update Job" : "Create Job"}
            </Button>
          </DialogContent>
        </DialogContent>
      </Dialog>
    </div>
  );
}