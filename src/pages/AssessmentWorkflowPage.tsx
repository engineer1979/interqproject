import React, { useState } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import EnhancedFooter from "@/components/EnhancedFooter";
import { AssessmentWorkflow, AssessmentResults as AssessmentResultsType } from "@/components/assessment/AssessmentWorkflow";
import { AssessmentResults as AssessmentResultsComponent } from "@/components/assessment/AssessmentResults";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AssessmentWorkflowPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isStarted, setIsStarted] = useState(false);
  const [completedResults, setCompletedResults] = useState<AssessmentResultsType | null>(null);

  const handleAssessmentComplete = async (results: AssessmentResultsType) => {
    setCompletedResults(results);
    toast({
      title: 'Assessment Completed!',
      description: `You scored ${results.percentage}% on the assessment.`,
    });
    try {
      const supabase = await import("@/integrations/supabase/client");
      if (user?.id) {
        // Save assessment result
        await supabase.from("assessment_results").insert({
          user_id: user.id,
          assessment_id: results.assessmentId,
          score: results.percentage,
          total_questions: results.totalQuestions || 20,
          correct_answers: results.correctAnswers || Math.round(results.percentage / 5),
          status: results.percentage >= 70 ? "passed" : "failed",
          completed_at: new Date().toISOString(),
        });

        const domains = ["Web Development", "Data Structures", "Databases", "AI", "DevOps", "System Design"];
        for (const category of domains) {
          const { data: existing } = await supabase
            .from("ai_interviews")
            .select("id")
            .eq("user_id", user.id)
            .eq("category", category)
            .limit(1);
          if (!existing?.length) {
            const { itInterviewDomains } = await import("@/data/itInterviewQuestions");
            const title = `${category} Technical Interview`;
            const { data: interview } = await supabase
              .from("ai_interviews")
              .insert({
                user_id: user.id,
                title,
                category,
                description: `Technical interview covering ${category} topics. 20 questions.`,
                status: "upcoming",
                total_questions: 20,
              })
              .select()
              .single();
            if (interview) {
              const domain = itInterviewDomains.find(d => d.name === category);
              if (domain) {
                const questions = domain.questions.map((q, i) => ({
                  interview_id: interview.id,
                  question_text: q.question_text,
                  question_type: q.question_type,
                  difficulty: q.difficulty,
                  category: q.category,
                  order_index: i + 1,
                  points: q.points,
                }));
                await supabase.from("interview_questions").insert(questions);
              }
            }
          }
        }
        toast({
          title: 'Interviews Generated!',
          description: '6 IT Technical Interviews are now available for practice.',
        });
      }
    } catch (err) {
      console.error("Error generating interviews:", err);
    }
  };

  const handleAssessmentCancel = () => {
    setIsStarted(false);
    navigate('/assessments');
  };

  const startAssessment = () => setIsStarted(true);

  const features = [
    { icon: <CheckCircle className="w-6 h-6 text-green-600" />, title: 'Comprehensive Evaluation', description: 'Multi-step assessment process with detailed analysis' },
    { icon: <Clock className="w-6 h-6 text-blue-600" />, title: 'Timed Assessment', description: 'Real-time timer with auto-save and session management' },
    { icon: <Award className="w-6 h-6 text-purple-600" />, title: 'Instant Results', description: 'Immediate feedback with detailed performance analytics' },
    { icon: <Users className="w-6 h-6 text-orange-600" />, title: 'Secure & Fair', description: 'Proctoring features ensure academic integrity' }
  ];

  if (isStarted && !completedResults) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <AssessmentWorkflow userId={user?.id || ''} onComplete={handleAssessmentComplete} onCancel={handleAssessmentCancel} />
        </div>
      </ProtectedRoute>
    );
  }

  if (completedResults) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="max-w-6xl mx-auto p-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Assessment Complete!</h1>
              <p className="text-xl text-muted-foreground">Great job on completing your assessment.</p>
            </div>
            <AssessmentResultsComponent
              results={completedResults}
              assessment={{ id: completedResults.assessmentId, title: 'Assessment', description: '', duration_minutes: 60, passing_score: 70, difficulty: 'medium', category: 'General' }}
              onFinish={() => { setCompletedResults(null); setIsStarted(false); navigate('/assessments'); }}
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedNavigation />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Assessment Workflow</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Experience our comprehensive 5-step assessment process.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Card className="p-8 bg-primary text-primary-foreground">
            <h3 className="text-3xl font-bold mb-4">Ready to Start?</h3>
            <p className="text-xl mb-6 opacity-90">Take your assessment with our advanced 5-step workflow.</p>
            <Button onClick={startAssessment} size="lg" variant="secondary" className="text-lg px-8 py-3">
              Begin Assessment Workflow <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
