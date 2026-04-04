import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const JobSeekerInterviews = () => {
  const { user } = useAuth();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["js-interview-sessions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase.from("interview_sessions")
        .select("* , interviews(title, job_role, duration_minutes, description)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user?.id,
  });

  const upcoming = sessions.filter((s: any) => !s.completed && s.status !== "completed");
  const completed = sessions.filter((s: any) => s.completed || s.status === "completed");

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Interviews</h2>
        <p className="text-sm text-muted-foreground">Schedule and manage your live interviews</p>
      </div>

      {/* Upcoming */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Upcoming
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No upcoming interviews scheduled.
            </p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((s: any) => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {(s as any).interviews?.title || "Interview"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(s as any).interviews?.job_role} • {new Date(s.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completed.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No completed interviews yet.
            </p>
          ) : (
            <div className="space-y-3">
              {completed.map((s: any) => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {(s as any).interviews?.title || "Interview"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.completed_at || s.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {s.final_score && (
                      <p className="font-bold text-sm">{s.final_score}%</p>
                    )}
                    <Badge variant="default" className="text-[10px]">
                      Done
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobSeekerInterviews;

