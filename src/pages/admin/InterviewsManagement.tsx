import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Calendar,
  List,
  Video,
  Phone,
  MapPin,
  Clock,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  FileText,
  Edit,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Interview,
  InterviewStatus,
  InterviewMode,
} from "@/types/adminModule";
import { mockInterviews, mockCompanies, mockUsers, mockCandidates, mockJobs } from "@/data/adminModuleData";

const statusConfig: Record<InterviewStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  scheduled: { label: "Scheduled", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  rescheduled: { label: "Rescheduled", variant: "outline" },
  pending_feedback: { label: "Pending Feedback", variant: "outline" },
};

const modeConfig: Record<InterviewMode, { label: string; icon: React.ElementType; color: string }> = {
  video: { label: "Video", icon: Video, color: "text-blue-500" },
  phone: { label: "Phone", icon: Phone, color: "text-green-500" },
  in_person: { label: "In Person", icon: MapPin, color: "text-purple-500" },
};

const ITEMS_PER_PAGE = 10;

interface InterviewFormData {
  candidateId: string;
  jobId: string;
  interviewerId: string;
  scheduledAt: string;
  duration: string;
  mode: InterviewMode;
  notes: string;
}

const initialFormData: InterviewFormData = {
  candidateId: "",
  jobId: "",
  interviewerId: "",
  scheduledAt: "",
  duration: "60",
  mode: "video",
  notes: "",
};

export default function InterviewsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isScorecardDialogOpen, setIsScorecardDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [notesContent, setNotesContent] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const [filters, setFilters] = useState({
    companyId: "",
    status: "" as InterviewStatus | "",
    mode: "" as InterviewMode | "",
    interviewerId: "",
  });

  const [formData, setFormData] = useState<InterviewFormData>(initialFormData);

  const filteredInterviews = useMemo(() => {
    return mockInterviews.filter((interview) => {
      const matchesSearch =
        interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.interviewerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCompany =
        !filters.companyId || interview.companyId === filters.companyId;
      const matchesStatus =
        !filters.status || interview.status === filters.status;
      const matchesMode =
        !filters.mode || interview.mode === filters.mode;
      const matchesInterviewer =
        !filters.interviewerId || interview.interviewerId === filters.interviewerId;

      let matchesDate = true;
      if (dateRange.from) {
        matchesDate = new Date(interview.scheduledAt) >= dateRange.from;
      }
      if (dateRange.to) {
        matchesDate = matchesDate && new Date(interview.scheduledAt) <= dateRange.to;
      }

      return (
        matchesSearch &&
        matchesCompany &&
        matchesStatus &&
        matchesMode &&
        matchesInterviewer &&
        matchesDate
      );
    });
  }, [searchTerm, filters, dateRange]);

  const totalPages = Math.ceil(filteredInterviews.length / ITEMS_PER_PAGE);
  const paginatedInterviews = filteredInterviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreateInterview = () => {
    console.log("Creating interview:", formData);
    setIsCreateDialogOpen(false);
    setFormData(initialFormData);
  };

  const handleReschedule = (interview: Interview) => {
    console.log("Reschedule interview:", interview.id);
  };

  const handleCancel = (interview: Interview) => {
    console.log("Cancel interview:", interview.id);
  };

  const handleAddNotes = (interview: Interview) => {
    setSelectedInterview(interview);
    setNotesContent(interview.notes || "");
    setIsNotesDialogOpen(true);
  };

  const handleSaveNotes = () => {
    console.log("Saving notes for interview:", selectedInterview?.id, notesContent);
    setIsNotesDialogOpen(false);
  };

  const handleViewScorecard = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsScorecardDialogOpen(true);
  };

  const handleSendReminder = (interview: Interview) => {
    console.log("Send reminder for interview:", interview.id);
  };

  const clearFilters = () => {
    setFilters({
      companyId: "",
      status: "",
      mode: "",
      interviewerId: "",
    });
    setDateRange({});
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.companyId ||
    filters.status ||
    filters.mode ||
    filters.interviewerId ||
    dateRange.from ||
    dateRange.to ||
    searchTerm;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Interviews Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and schedule interviews across all companies
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Interviews", value: mockInterviews.length, color: "text-blue-600" },
          { label: "Scheduled", value: mockInterviews.filter(i => i.status === "scheduled").length, color: "text-green-600" },
          { label: "Completed", value: mockInterviews.filter(i => i.status === "completed").length, color: "text-purple-600" },
          { label: "Pending Feedback", value: mockInterviews.filter(i => i.status === "pending_feedback").length, color: "text-orange-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by candidate, job, company, or interviewer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.companyId}
            onValueChange={(value) => {
              setFilters({ ...filters, companyId: value });
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {mockCompanies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => {
              setFilters({ ...filters, status: value as InterviewStatus });
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.mode}
            onValueChange={(value) => {
              setFilters({ ...filters, mode: value as InterviewMode });
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              {Object.entries(modeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.interviewerId}
            onValueChange={(value) => {
              setFilters({ ...filters, interviewerId: value });
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Interviewer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Interviewers</SelectItem>
              {mockUsers
                .filter((user) => user.role === "Interviewer" || user.role === "Hiring Manager")
                .map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              className="w-[150px]"
              value={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const newDate = e.target.value ? new Date(e.target.value) : undefined;
                setDateRange({ ...dateRange, from: newDate });
                setCurrentPage(1);
              }}
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              className="w-[150px]"
              value={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const newDate = e.target.value ? new Date(e.target.value) : undefined;
                setDateRange({ ...dateRange, to: newDate });
                setCurrentPage(1);
              }}
            />
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Interviewer</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInterviews.map((interview) => {
                  const modeInfo = modeConfig[interview.mode];
                  const ModeIcon = modeInfo.icon;
                  return (
                    <TableRow key={interview.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {interview.candidateName.charAt(0)}
                          </div>
                          <span className="font-medium">{interview.candidateName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{interview.jobTitle}</TableCell>
                      <TableCell>{interview.companyName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {interview.interviewerName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {new Date(interview.scheduledAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {interview.duration} min
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${modeInfo.color}`}>
                          <ModeIcon className="h-4 w-4" />
                          <span className="text-sm">{modeInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[interview.status].variant}>
                          {statusConfig[interview.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReschedule(interview)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCancel(interview)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddNotes(interview)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Add Notes
                            </DropdownMenuItem>
                            {interview.scorecard && (
                              <DropdownMenuItem onClick={() => handleViewScorecard(interview)}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Scorecard
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleSendReminder(interview)}>
                              <Send className="mr-2 h-4 w-4" />
                              Send Reminder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!paginatedInterviews.length && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No interviews found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {filteredInterviews.length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredInterviews.length)} of {filteredInterviews.length} interviews
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="bg-muted p-2 text-center text-sm font-medium">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - date.getDay() + i);
                const dayInterviews = filteredInterviews.filter((interview) => {
                  const interviewDate = new Date(interview.scheduledAt);
                  return (
                    interviewDate.getDate() === date.getDate() &&
                    interviewDate.getMonth() === date.getMonth() &&
                    interviewDate.getFullYear() === date.getFullYear()
                  );
                });
                return (
                  <div
                    key={i}
                    className={`min-h-[100px] p-2 bg-background ${
                      date.getMonth() !== new Date().getMonth() ? "text-muted-foreground" : ""
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                    {dayInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="text-xs p-1 mb-1 rounded bg-primary/10 truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => {
                          setSelectedInterview(interview);
                          setIsScorecardDialogOpen(true);
                        }}
                      >
                        {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {interview.candidateName}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new interview
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="candidate">Candidate</Label>
              <Select
                value={formData.candidateId}
                onValueChange={(value) => setFormData({ ...formData, candidateId: value })}
              >
                <SelectTrigger id="candidate">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {mockCandidates.map((candidate) => (
                    <SelectItem key={candidate.id} value={candidate.id}>
                      {candidate.fullName} - {candidate.appliedRole}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job">Job Position</Label>
              <Select
                value={formData.jobId}
                onValueChange={(value) => setFormData({ ...formData, jobId: value })}
              >
                <SelectTrigger id="job">
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  {mockJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interviewer">Interviewer</Label>
              <Select
                value={formData.interviewerId}
                onValueChange={(value) => setFormData({ ...formData, interviewerId: value })}
              >
                <SelectTrigger id="interviewer">
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers
                    .filter((user) => user.role === "Interviewer" || user.role === "Hiring Manager")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} - {user.role}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mode">Mode</Label>
              <Select
                value={formData.mode}
                onValueChange={(value) => setFormData({ ...formData, mode: value as InterviewMode })}
              >
                <SelectTrigger id="mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(modeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className={`h-4 w-4 ${config.color}`} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or instructions for the interview..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInterview}>Schedule Interview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Notes</DialogTitle>
            <DialogDescription>
              Add notes for interview with {selectedInterview?.candidateName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes-content">Notes</Label>
              <Textarea
                id="notes-content"
                placeholder="Enter notes..."
                value={notesContent}
                onChange={(e) => setNotesContent(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isScorecardDialogOpen} onOpenChange={setIsScorecardDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Interview Scorecard</DialogTitle>
            <DialogDescription>
              Scorecard for {selectedInterview?.candidateName}
            </DialogDescription>
          </DialogHeader>
          {selectedInterview?.scorecard ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">{selectedInterview.scorecard.rating}/5</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Recommendation</p>
                  <p className="text-lg font-semibold">{selectedInterview.scorecard.recommendation}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Strengths</Label>
                <p className="text-sm p-3 bg-muted rounded-lg">{selectedInterview.scorecard.strengths}</p>
              </div>
              <div className="grid gap-2">
                <Label>Concerns</Label>
                <p className="text-sm p-3 bg-muted rounded-lg">{selectedInterview.scorecard.concerns}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No scorecard available for this interview
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScorecardDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}