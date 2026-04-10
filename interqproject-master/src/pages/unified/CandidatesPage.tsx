import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { mockCandidates } from "@/data/adminModuleData";
import { Search, Star, Mail, Phone, Calendar, ChevronRight, Plus, Eye, UserCheck, Filter } from "lucide-react";

const stageColors: Record<string, string> = {
  applied: "bg-gray-100 text-gray-700",
  screening: "bg-blue-100 text-blue-700",
  shortlisted: "bg-purple-100 text-purple-700",
  interview_r1: "bg-yellow-100 text-yellow-700",
  interview_r2: "bg-orange-100 text-orange-700",
  hr_interview: "bg-cyan-100 text-cyan-700",
  offer: "bg-green-100 text-green-700",
  hired: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const stages = ["applied", "screening", "shortlisted", "interview_r1", "hr_interview", "offer", "hired"];

export default function CandidatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ name: "", email: "", phone: "", role: "", notes: "" });

  const role = user?.role || "jobseeker";
  const canManage = role === "admin" || role === "company" || role === "recruiter";

  const filtered = mockCandidates.filter(c => {
    const matchSearch = c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedRole?.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "all" || c.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const handleMoveStage = (candidate: any, newStage: string) => {
    toast({ title: "Stage Updated", description: `${candidate.fullName} moved to ${newStage.replace(/_/g, " ")}.` });
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.email) {
      toast({ title: "Error", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Candidate Added", description: `${newCandidate.name} added to pipeline.` });
    setShowAddDialog(false);
    setNewCandidate({ name: "", email: "", phone: "", role: "", notes: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground">Manage your talent pipeline</p>
        </div>
        {canManage && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Candidate
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: mockCandidates.length, color: "text-blue-600" },
          { label: "In Interview", value: mockCandidates.filter(c => c.stage?.includes("interview")).length, color: "text-yellow-600" },
          { label: "Offers Sent", value: mockCandidates.filter(c => c.stage === "offer").length, color: "text-green-600" },
          { label: "Hired", value: mockCandidates.filter(c => c.stage === "hired" || c.stage === "offer").length, color: "text-emerald-600" },
        ].map(stat => (
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
          <Input placeholder="Search candidates..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Pipeline Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><CardContent className="p-12 text-center text-muted-foreground">No candidates found.</CardContent></Card>
        ) : filtered.map(candidate => (
          <Card key={candidate.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {candidate.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold">{candidate.fullName}</span>
                    {candidate.rating && (
                      <span className="flex items-center gap-0.5 text-yellow-500 text-xs">
                        <Star className="h-3 w-3 fill-current" /> {candidate.rating}
                      </span>
                    )}
                    <Badge className={`text-xs ${stageColors[candidate.stage] || "bg-gray-100 text-gray-700"}`}>
                      {candidate.stage?.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{candidate.appliedRole} · {candidate.companyName}</div>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{candidate.email}</span>
                    {candidate.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{candidate.phone}</span>}
                  </div>
                  {candidate.tags && candidate.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {candidate.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedCandidate(candidate)}>
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                  {canManage && (
                    <Select onValueChange={val => handleMoveStage(candidate, val)}>
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue placeholder="Move stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map(s => <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Candidate Dialog */}
      {selectedCandidate && (
        <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{selectedCandidate.fullName}</DialogTitle></DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Applied For</p><p className="font-medium">{selectedCandidate.appliedRole}</p></div>
                <div><p className="text-muted-foreground text-xs">Company</p><p className="font-medium">{selectedCandidate.companyName}</p></div>
                <div><p className="text-muted-foreground text-xs">Stage</p><Badge className={`text-xs ${stageColors[selectedCandidate.stage]}`}>{selectedCandidate.stage?.replace(/_/g, " ")}</Badge></div>
                <div><p className="text-muted-foreground text-xs">Source</p><p className="font-medium">{selectedCandidate.source || "—"}</p></div>
                <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{selectedCandidate.email}</p></div>
                <div><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{selectedCandidate.phone || "—"}</p></div>
              </div>
              {selectedCandidate.notes && (
                <div><p className="text-muted-foreground text-xs mb-1">Notes</p><p className="bg-muted rounded p-2">{selectedCandidate.notes}</p></div>
              )}
              {canManage && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1" onClick={() => { toast({ title: "Interview Scheduled", description: `Interview scheduled with ${selectedCandidate.fullName}.` }); setSelectedCandidate(null); }}>
                    <Calendar className="h-3 w-3 mr-1" /> Schedule Interview
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => { toast({ title: "Email Sent", description: `Email sent to ${selectedCandidate.email}.` }); }}>
                    <Mail className="h-3 w-3 mr-1" /> Send Email
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Candidate Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Candidate</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Full Name *</Label><Input placeholder="John Smith" value={newCandidate.name} onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })} /></div>
            <div><Label>Email *</Label><Input type="email" placeholder="john@email.com" value={newCandidate.email} onChange={e => setNewCandidate({ ...newCandidate, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input placeholder="+1 555-0100" value={newCandidate.phone} onChange={e => setNewCandidate({ ...newCandidate, phone: e.target.value })} /></div>
            <div><Label>Applied Role</Label><Input placeholder="Senior Engineer" value={newCandidate.role} onChange={e => setNewCandidate({ ...newCandidate, role: e.target.value })} /></div>
            <div><Label>Notes</Label><Input placeholder="Initial notes..." value={newCandidate.notes} onChange={e => setNewCandidate({ ...newCandidate, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCandidate}>Add Candidate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
