import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mockCandidates } from "@/data/adminModuleData";
import { Search, ChevronRight, ChevronLeft, Star } from "lucide-react";

const STAGES = [
  { id: "applied", label: "Applied", color: "bg-gray-50 border-gray-200" },
  { id: "screening", label: "Screening", color: "bg-blue-50 border-blue-200" },
  { id: "shortlisted", label: "Shortlisted", color: "bg-purple-50 border-purple-200" },
  { id: "interview_r1", label: "Interview", color: "bg-yellow-50 border-yellow-200" },
  { id: "offer", label: "Offer", color: "bg-green-50 border-green-200" },
];

export default function PipelinePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [pipeline, setPipeline] = useState(
    mockCandidates.reduce<Record<string, any[]>>((acc, c) => {
      const stage = STAGES.find(s => s.id === c.stage)?.id || "applied";
      acc[stage] = [...(acc[stage] || []), c];
      return acc;
    }, {})
  );

  const moveCandidate = (candidate: any, fromStage: string, direction: "forward" | "back") => {
    const idx = STAGES.findIndex(s => s.id === fromStage);
    const toIdx = direction === "forward" ? idx + 1 : idx - 1;
    if (toIdx < 0 || toIdx >= STAGES.length) return;
    const toStage = STAGES[toIdx].id;

    setPipeline(prev => ({
      ...prev,
      [fromStage]: (prev[fromStage] || []).filter(c => c.id !== candidate.id),
      [toStage]: [...(prev[toStage] || []), { ...candidate, stage: toStage }],
    }));
    toast({ title: "Candidate Moved", description: `${candidate.fullName} → ${STAGES[toIdx].label}` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">Track candidates through your hiring stages</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 overflow-x-auto min-w-0">
        {STAGES.map((stage, stageIdx) => {
          const candidates = (pipeline[stage.id] || []).filter(c =>
            !search || c.fullName.toLowerCase().includes(search.toLowerCase())
          );
          return (
            <div key={stage.id} className={`rounded-xl border p-3 ${stage.color} min-w-[180px]`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm">{stage.label}</span>
                <Badge variant="secondary" className="text-xs">{candidates.length}</Badge>
              </div>
              <div className="space-y-2">
                {candidates.map(candidate => (
                  <Card key={candidate.id} className="shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {candidate.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{candidate.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">{candidate.appliedRole}</p>
                        </div>
                      </div>
                      {candidate.rating && (
                        <div className="flex items-center gap-0.5 text-yellow-500 text-xs mb-2">
                          <Star className="h-2.5 w-2.5 fill-current" />{candidate.rating}
                        </div>
                      )}
                      <div className="flex gap-1">
                        {stageIdx > 0 && (
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0 flex-shrink-0" onClick={() => moveCandidate(candidate, stage.id, "back")}>
                            <ChevronLeft className="h-3 w-3" />
                          </Button>
                        )}
                        {stageIdx < STAGES.length - 1 && (
                          <Button size="sm" className="h-6 flex-1 text-xs px-1" onClick={() => moveCandidate(candidate, stage.id, "forward")}>
                            <ChevronRight className="h-3 w-3 mr-0.5" />Advance
                          </Button>
                        )}
                        {stageIdx === STAGES.length - 1 && (
                          <Button size="sm" className="h-6 flex-1 text-xs px-1 bg-green-600 hover:bg-green-700" onClick={() => toast({ title: "Offer Sent!", description: `Offer letter sent to ${candidate.fullName}.` })}>
                            Send Offer
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {candidates.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No candidates</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
