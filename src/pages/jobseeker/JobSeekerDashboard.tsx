import { JobSeekerAssignments } from "@/components/dashboard/JobSeekerAssignments";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ShieldCheck, Mail, Code2, ArrowRight } from "lucide-react";
import { LiveInterviewPlatforms } from "@/components/dashboard/LiveInterviewPlatforms";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Welcome back, <span className="text-primary">{user?.name || "Job Seeker"}</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Track your assigned evaluations and upcoming technical interviews in one place.
          </p>
        </div>
        <Card className="w-full md:w-auto bg-slate-50 border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-white rounded-full border border-slate-200 shadow-sm">
              <User className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Candidate
              </p>
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <JobSeekerAssignments />
          <LiveInterviewPlatforms />
        </div>
        <div className="space-y-8">
          <Card className="bg-slate-900 text-white border-none overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/30 transition-colors" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Practice Coding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-6">
                Build your skills with our library of front-end, back-end, and AI challenges.
              </p>
              <Button 
                onClick={() => navigate("/jobseeker/coding-challenges")}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold border-none"
              >
                Start Practicing <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="pt-12 pb-8 text-center border-t border-slate-100">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-sm">
          <Mail className="w-4 h-4" /> Need help? Contact Support at <span className="font-semibold text-primary">support@interq.com</span>
        </div>
      </footer>
    </div>
  );
}
