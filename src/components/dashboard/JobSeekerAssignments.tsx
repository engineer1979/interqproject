import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, 
  Code2, 
  Video, 
  Play, 
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SimpleAuthContext";

export const JobSeekerAssignments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    // Load assignments from localStorage
    const loadAssignments = () => {
      const stored = JSON.parse(localStorage.getItem('interq_assignments') || '[]');
      // Filter for assignments assigned to THIS user
      setAssignments(stored.filter((a: any) => a.jobSeekerId === user?.id));
    };

    if (user?.id) {
      loadAssignments();
    }
    
    // Polyfill for storage changes
    window.addEventListener('storage', loadAssignments);
    return () => window.removeEventListener('storage', loadAssignments);
  }, [user]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <ClipboardList className="w-5 h-5 text-blue-500" />;
      case 'coding': return <Code2 className="w-5 h-5 text-purple-500" />;
      case 'interview': return <Video className="w-5 h-5 text-emerald-500" />;
      default: return <ClipboardList className="w-5 h-5 text-slate-500" />;
    }
  };

  const getButtonText = (type: string) => {
    switch (type) {
      case 'assessment': return "Start MCQ Test";
      case 'coding': return "Enter Sandbox";
      case 'interview': return "Join Meeting";
      default: return "Start";
    }
  };

  const handleStart = (id: string, type: string) => {
    if (type === 'assessment') navigate(`/assessment/${id}`);
    else if (type === 'coding') navigate(`/coding-test/${id}`);
    else if (type === 'interview') navigate(`/jobseeker/interview/${id}`);
  };

  return (
    <div className="space-y-8">
      {/* Assessments Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Assigned Assessments (MCQs)</h2>
          </div>
          <Badge variant="outline" className="bg-blue-50">{assignments.filter(a => a.type === 'assessment').length} Pending</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.filter(a => a.type === 'assessment').length > 0 ? (
            assignments.filter(a => a.type === 'assessment').map(assign => (
              <Card key={assign.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{assign.resourceName}</h3>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Assigned: {new Date(assign.assignedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getIcon(assign.type)}
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" /> 45 Mins
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded">
                      30 Questions
                    </div>
                  </div>
                  <Button className="w-full gap-2" onClick={() => handleStart(assign.resourceId, assign.type)}>
                    <Play className="w-4 h-4" /> {getButtonText(assign.type)}
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-muted-foreground">No assessments assigned yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Coding Tests Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold">Coding Challenges</h2>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {assignments.filter(a => a.type === 'coding').length} Active
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.filter(a => a.type === 'coding').length > 0 ? (
             assignments.filter(a => a.type === 'coding').map(assign => (
              <Card key={assign.id} className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{assign.resourceName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Scenario-based technical challenge</p>
                    </div>
                    {getIcon(assign.type)}
                  </div>
                  <Button variant="secondary" className="w-full gap-2 text-purple-700 border-purple-200 hover:bg-purple-50" onClick={() => handleStart(assign.resourceId, assign.type)}>
                    <Code2 className="w-4 h-4" /> Start Coding Test
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-muted-foreground">No coding tests assigned yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Live Interviews Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold">Live Technical Interviews</h2>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {assignments.filter(a => a.type === 'interview').length} Scheduled
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {assignments.filter(a => a.type === 'interview').length > 0 ? (
            assignments.filter(a => a.type === 'interview').map(assign => (
              <Card key={assign.id} className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500 bg-emerald-50/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-100 rounded-full">
                        <Video className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{assign.resourceName}</h3>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-2">
                          <p className="text-sm text-slate-600 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> March 25, 2024
                          </p>
                          <p className="text-sm text-slate-600 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> 10:00 AM - 11:00 AM
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" /> Reschedule
                      </Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8" onClick={() => handleStart(assign.resourceId, assign.type)}>
                        Join Lobby <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-muted-foreground">No interviews scheduled yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
