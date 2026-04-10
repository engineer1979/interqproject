import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  ClipboardList,
  Code2,
  Video,
  BarChart3
} from "lucide-react";
import { useRecruiter } from "@/contexts/RecruiterContext";
import { AssignmentSystem } from "@/components/dashboard/AssignmentSystem";
import { mockAssessments } from "@/data/adminModuleData";
import { LiveInterviewPlatforms } from "@/components/dashboard/LiveInterviewPlatforms";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { state } = useRecruiter();
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage assignments and track candidate progress.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/recruiter/evaluation-reports")} className="gap-2">
            <BarChart3 className="h-4 w-4" /> View All Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignment Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          <AssignmentSystem />
          <LiveInterviewPlatforms />
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Review Results</h2>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {state.candidates.slice(0, 5).map((candidate: any) => (
                    <div key={candidate.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          {candidate.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{candidate.fullName}</p>
                          <p className="text-xs text-muted-foreground">{candidate.appliedRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">{candidate.rating ? `${candidate.rating * 20}%` : 'Pending'}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/recruiter/evaluation-reports`)}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Available Resources List - Read Only */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold text-slate-900">Available Resources</h2>
            </div>
            <div className="space-y-4">
              <Card className="bg-blue-50/30 border-blue-100">
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-600" /> MCQ Assessments
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white border-none">{mockAssessments.length}</Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-slate-500">Standard technical assessments across 3,400+ skills.</p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50/30 border-purple-100">
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-600" /> Coding Tests
                  </CardTitle>
                  <Badge className="bg-purple-600 text-white border-none">12</Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-slate-500">Interactive coding challenges and scenario tests.</p>
                </CardContent>
              </Card>

              <Card className="bg-emerald-50/30 border-emerald-100">
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600" /> Live Interviews
                  </CardTitle>
                  <Badge className="bg-emerald-600 text-white border-none">8</Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-slate-500">Scheduled video sessions with technical experts.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Card className="bg-slate-900 text-white border-none overflow-hidden shadow-elegant-blue">
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">Hiring Tip</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Candidates who complete assessments within 24 hours of assignment have a 40% higher chance of being hired.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
