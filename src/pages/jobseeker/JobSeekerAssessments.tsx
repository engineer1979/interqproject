import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Search, Clock, ChevronRight, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useAssessments } from "@/hooks/useAssessments";
import { cn } from "@/lib/utils";

const categories = ["All", "Development", "Security", "Infrastructure", "Data & AI", "CCNA", "AWS", "Azure", "CISSP", "Python", "Linux", "Windows", "ITIL"];
const difficulties = ["All", "easy", "medium", "hard"];

const JobSeekerAssessments = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: assessments = [], isLoading } = useAssessments();

  console.log('🔍 Debug - raw assessments:', assessments.length, assessments.slice(0,2));
  const completedIds = []; // Offline mode - no DB tracking

  const filtered = assessments.filter((a: any) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a.domain || a.category || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || (a.domain || a.category || '').toLowerCase() === category.toLowerCase();
    const matchDifficulty = difficulty === "All" || (a.difficulty || '').toLowerCase() === difficulty.toLowerCase();
    return matchSearch && matchCategory && matchDifficulty;
  });

  console.log('🔍 Debug - filtered:', filtered.length, 'search:', search, 'category:', category, 'difficulty:', difficulty);

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case "easy": return "bg-green-500/10 text-green-700";
      case "medium": return "bg-amber-500/10 text-amber-700";
      case "hard": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Assessment Library</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} assessments available</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search assessments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Difficulty:</span>
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize",
              difficulty === d ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {d === "All" ? "All" : d}
          </button>
        ))}
      </div>

      {/* Assessment Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No assessments match current filters</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Try clearing filters or search</p>
            <p>• Default fallback data: Software Development, Cybersecurity, DevOps</p>
            <p>• <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All'); }}>Clear All Filters</Button></p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((a: any) => {
            const isCompleted = completedIds.includes(a.id);
            return (
              <Card key={a.id} className="shadow-soft hover:shadow-elegant transition-all cursor-pointer" onClick={() => navigate(`/assessment/${a.id}`)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{a.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description || "Professional skill assessment"}</p>
                    </div>
                    {isCompleted && <Badge variant="default" className="ml-2 text-[10px]">Completed</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">{a.domain || a.category || 'IT'}</Badge>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium capitalize", getDifficultyColor(a.difficulty || ''))}>
                      {a.difficulty || 'mixed'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {a.duration_minutes || 60} min
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isCompleted ? "Retake" : "Start Assessment"}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default JobSeekerAssessments;

