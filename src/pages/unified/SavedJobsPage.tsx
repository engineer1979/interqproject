import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockJobs } from "@/data/adminModuleData";
import { Bookmark, MapPin, DollarSign, Clock, Briefcase, Trash2 } from "lucide-react";

export default function SavedJobsPage() {
  const { toast } = useToast();
  const [saved, setSaved] = useState(mockJobs.slice(0, 4));

  const remove = (id: string) => {
    setSaved(saved.filter(j => j.id !== id));
    toast({ title: "Job Removed", description: "Removed from saved jobs." });
  };

  const apply = (job: any) => {
    toast({ title: "Application Submitted!", description: `Applied for "${job.title}".` });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
        <p className="text-muted-foreground">{saved.length} job{saved.length !== 1 ? "s" : ""} saved</p>
      </div>

      {saved.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Bookmark className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground">No saved jobs yet. Browse jobs and save ones you like.</p>
          <Button className="mt-4" onClick={() => window.location.href = "/jobs"}>Browse Jobs</Button>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {saved.map(job => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <Badge className="bg-green-100 text-green-700 text-xs">{job.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{job.companyName} · {job.department}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.employmentType}</span>
                      {job.salaryMin && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()}</span>}
                    </div>
                    {job.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.skills.slice(0, 4).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => apply(job)}>Apply Now</Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => remove(job.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
