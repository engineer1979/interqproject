import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Play, Calendar, Clock, ChevronRight, Search, Zap, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/SimpleAuthContext";

// Public challenges data (from CodingTests.tsx)
const PUBLIC_CHALLENGES = [
  { id: "ct_frontend_1", title: "Frontend UI/UX Challenges", description: "Complex scenario-based challenges for React and DOM manipulation.", category: "Frontend", difficulty: "medium", duration_minutes: 25 },
  { id: "ct_backend_1", title: "Backend API Logic", description: "Design scalable API logic and solve performance bottlenecks.", category: "Backend", difficulty: "hard", duration_minutes: 25 },
  { id: "ct_ai_1", title: "AI Model Fine-tuning Scenarios", description: "Answer scenario logic questions on data pipelining and AI optimization.", category: "AI", difficulty: "medium", duration_minutes: 25 },
  { id: "ct_dsa_1", title: "Data Structures & Algorithms", description: "Core algorithm scenario tests utilizing optimal time/space complexity.", category: "Data Structures", difficulty: "hard", duration_minutes: 25 }
];

export default function CodingChallenges() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignedChallenges, setAssignedChallenges] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadAssignments = () => {
      const stored = JSON.parse(localStorage.getItem('interq_assignments') || '[]');
      // Filter for coding challenges assigned to THIS user
      setAssignedChallenges(stored.filter((a: any) => a.type === 'coding' && a.jobSeekerId === user?.id));
    };

    if (user?.id) {
      loadAssignments();
    }
  }, [user]);

  const filteredPublic = PUBLIC_CHALLENGES.filter((a: any) => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAssigned = assignedChallenges.filter((a: any) => 
    a.resourceName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Coding Challenges <Code2 className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Complete assigned tests or practice with high-impact coding scenarios.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search topics or categories..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-9 h-12 bg-white border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* 1. Assigned Challenges Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          <h2 className="text-xl font-bold text-slate-900">Assigned by Recruiters</h2>
          {assignedChallenges.length > 0 && (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none ml-2">
              {assignedChallenges.length} Actions Required
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssigned.length > 0 ? (
            filteredAssigned.map((assign) => (
              <Card key={assign.id} className="hover:shadow-lg transition-all border-l-4 border-l-amber-500 overflow-hidden group hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="p-3 bg-amber-50 rounded-2xl">
                        <Code2 className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{assign.resourceName}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5" /> Deadline: ASAP
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none">
                      <Clock className="w-3 h-3 mr-1" /> 90 Mins
                    </Badge>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none font-bold">
                      Assigned Resource
                    </Badge>
                  </div>

                  <Button 
                    className="w-full h-12 gap-2 bg-slate-900 hover:bg-primary transition-all font-black rounded-xl shadow-lg shadow-slate-200"
                    onClick={() => navigate(`/coding-test/${assign.resourceId}`)}
                  >
                    <Play className="w-4 h-4" /> Start Official Test <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-muted-foreground font-medium">No urgent assignments from recruiters.</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Public / Practice Challenges Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-slate-900">Practice Challenges Library</h2>
          <Badge variant="outline" className="ml-2 font-bold">{PUBLIC_CHALLENGES.length} Available</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublic.map((challenge) => (
            <Card 
              key={challenge.id} 
              className="hover:shadow-md transition-all border-slate-200 group cursor-pointer hover:border-primary/50"
              onClick={() => navigate(`/coding-test/${challenge.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${
                    challenge.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600' :
                    challenge.difficulty === 'medium' ? 'bg-blue-50 text-blue-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    <Code2 className="w-5 h-5" />
                  </div>
                  <Badge className={`uppercase text-[10px] font-black border-none ${
                    challenge.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                    challenge.difficulty === 'medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{challenge.title}</h3>
                <p className="text-xs text-slate-500 mb-4 h-8 overflow-hidden line-clamp-2">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> {challenge.duration_minutes} MINS
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
