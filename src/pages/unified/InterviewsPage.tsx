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
import { mockInterviews } from "@/data/adminModuleData";
import { Calendar, Clock, Video, MapPin, Phone, Users, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { LiveInterviewPlatforms } from "@/components/dashboard/LiveInterviewPlatforms";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rescheduled: "bg-yellow-100 text-yellow-700",
};

const modeIcons: Record<string, any> = {
  video: Video,
  in_person: MapPin,
  phone: Phone,
};

export default function InterviewsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [newInterview, setNewInterview] = useState({
    candidate: "", job: "", date: "", time: "", duration: "60", mode: "video", notes: ""
  });

  const role = user?.role || "jobseeker";
  const canManage = role === "admin" || role === "company" || role === "recruiter";

  const filtered = mockInterviews.filter(i => {
    const matchSearch = i.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      i.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSchedule = () => {
    if (!newInterview.candidate || !newInterview.date) {
      toast({ title: "Error", description: "Candidate and date are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Interview Scheduled!", description: `Interview with ${newInterview.candidate} scheduled for ${newInterview.date}.` });
    setShowScheduleDialog(false);
    setNewInterview({ candidate: "", job: "", date: "", time: "", duration: "60", mode: "video", notes: "" });
  };

  const handleAction = (interview: any, action: string) => {
    const messages: Record<string, string> = {
      complete: `${interview.candidateName}'s interview marked as completed.`,
      cancel: `${interview.candidateName}'s interview cancelled.`,
      reschedule: `Rescheduling request sent for ${interview.candidateName}'s interview.`,
    };
    toast({ title: action.charAt(0).toUpperCase() + action.slice(1), description: messages[action] });
  };

  const upcoming = filtered.filter(i => i.status === "scheduled");
  const past = filtered.filter(i => i.status !== "scheduled");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground">
            {role === "jobseeker" ? "Your upcoming and past interviews" : "Schedule and manage interviews"}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setShowScheduleDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Schedule Interview
          </Button>
        )}
      </div>

      <LiveInterviewPlatforms />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: mockInterviews.length, color: "text-blue-600" },
          { label: "Scheduled", value: mockInterviews.filter(i => i.status === "scheduled").length, color: "text-yellow-600" },
          { label: "Completed", value: mockInterviews.filter(i => i.status === "completed").length, color: "text-green-600" },
          { label: "Cancelled", value: mockInterviews.filter(i => i.status === "cancelled").length, color: "text-red-600" },
        ].map(stat => (
          <Card key={stat.label}><CardContent className="p-4"><div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div><div className="text-sm text-muted-foreground">{stat.label}</div></CardContent></Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input placeholder="Search by candidate or job..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Upcoming Interviews */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Upcoming ({upcoming.length})</h2>
          <div className="space-y-3">
            {upcoming.map(interview => {
              const ModeIcon = modeIcons[interview.mode] || Video;
              return (
                <Card key={interview.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{interview.candidateName}</span>
                          <Badge className={statusColors[interview.status]}>{interview.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{interview.jobTitle} · {interview.companyName}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(interview.scheduledAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(interview.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{interview.duration} min</span>
                          <span className="flex items-center gap-1"><ModeIcon className="h-3 w-3" />{interview.mode?.replace(/_/g, " ")}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{interview.interviewerName}</span>
                        </div>
                        {interview.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{interview.notes}"</p>}
                      </div>
                      {canManage && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleAction(interview, "complete")} className="text-green-600">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction(interview, "reschedule")} className="text-yellow-600">
                            <AlertCircle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction(interview, "cancel")} className="text-red-600">
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Interviews */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Past Interviews ({past.length})</h2>
          <div className="space-y-3">
            {past.map(interview => (
              <Card key={interview.id} className="opacity-80">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{interview.candidateName}</span>
                        <Badge className={statusColors[interview.status]}>{interview.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{interview.jobTitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(interview.scheduledAt).toLocaleDateString()} · {interview.duration} min · {interview.mode?.replace(/_/g, " ")}</p>
                    </div>
                    {interview.scorecard && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Rating: {interview.scorecard.rating}/5</div>
                        <div className="text-xs text-muted-foreground">{interview.scorecard.recommendation}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No interviews found.</CardContent></Card>
      )}

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Schedule Interview</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Candidate Name *</Label><Input placeholder="Alex Thompson" value={newInterview.candidate} onChange={e => setNewInterview({ ...newInterview, candidate: e.target.value })} /></div>
            <div><Label>Job Position</Label><Input placeholder="Senior React Developer" value={newInterview.job} onChange={e => setNewInterview({ ...newInterview, job: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date *</Label><Input type="date" value={newInterview.date} onChange={e => setNewInterview({ ...newInterview, date: e.target.value })} /></div>
              <div><Label>Time</Label><Input type="time" value={newInterview.time} onChange={e => setNewInterview({ ...newInterview, time: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Duration (min)</Label>
                <Select value={newInterview.duration} onValueChange={val => setNewInterview({ ...newInterview, duration: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mode</Label>
                <Select value={newInterview.mode} onValueChange={val => setNewInterview({ ...newInterview, mode: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="in_person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Notes</Label><Textarea placeholder="Interview agenda, topics to cover..." rows={3} value={newInterview.notes} onChange={e => setNewInterview({ ...newInterview, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
            <Button onClick={handleSchedule}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
