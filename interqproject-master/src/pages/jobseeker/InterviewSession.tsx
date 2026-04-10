import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { getInterviewDomainById, itInterviewDomains } from "@/data/itInterviewQuestions";
import { CertificateTemplate } from "@/components/certificate/CertificateTemplate";
import { useJobSeekerDashboard } from "@/contexts/JobSeekerDashboardContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Award } from "lucide-react";

interface InterviewQuestion {
  id: string;
  question_text: string;
  question_type: string;
  difficulty: string;
  category: string;
  order_index: number;
  points: number;
  user_answer?: string;
}

export default function InterviewSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [interview, setInterview] = useState<any>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { addCertificate } = useJobSeekerDashboard();
  const [showCertificate, setShowCertificate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const handleGenerateCertificate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const certId = `CERT-INT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setGeneratedId(certId);
    await addCertificate({
      id: certId,
      title: interview?.title || "Technical Interview",
      assessment_id: "int-demo",
      status: "issued",
      issued_at: new Date().toISOString()
    });
    setIsGenerating(false);
    setShowCertificate(true);
  };

  useEffect(() => {
    loadInterview();
  }, [id]);

  const loadInterview = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: interviewData, error: interviewError } = await supabase
        .from("ai_interviews")
        .select("*, interview_questions(*)")
        .eq("id", id)
        .single();

      if (interviewError) throw interviewError;
      
      if (interviewData?.interview_questions) {
        const sorted = [...interviewData.interview_questions].sort((a, b) => a.order_index - b.order_index);
        setQuestions(sorted);
        const existingAnswers: Record<string, string> = {};
        sorted.forEach((q: InterviewQuestion) => {
          if (q.user_answer) existingAnswers[q.id] = q.user_answer;
        });
        setAnswers(existingAnswers);
      } else {
        const domain = itInterviewDomains.find(d => d.name === interviewData?.category);
        if (domain) {
          setQuestions(domain.questions);
        }
      }
      setInterview(interviewData);
    } catch (err) {
      console.error("Error loading interview:", err);
      toast({ title: "Error", description: "Failed to load interview", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    const question = questions[currentIndex];
    setAnswers(prev => ({ ...prev, [question.id]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStart = async () => {
    if (!id || !user) return;
    try {
      await supabase
        .from("ai_interviews")
        .update({ status: "in_progress", started_at: new Date().toISOString() })
        .eq("id", id);
    } catch (err) {
      console.error("Error starting interview:", err);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      let correctCount = 0;
      for (const question of questions) {
        const answer = answers[question.id] || "";
        await supabase
          .from("interview_questions")
          .upsert({
            interview_id: id,
            question_text: question.question_text,
            question_type: question.question_type,
            difficulty: question.difficulty,
            category: question.category,
            order_index: question.order_index,
            points: question.points,
            user_answer: answer,
            is_correct: answer.length > 10,
          }, { onConflict: "interview_id,order_index" });
        if (answer.length > 10) correctCount++;
      }

      const percentage = Math.round((correctCount / questions.length) * 100);
      await supabase
        .from("ai_interviews")
        .update({ 
          status: "completed", 
          completed_at: new Date().toISOString(),
          score: percentage,
          correct_answers: correctCount,
        })
        .eq("id", id);

      setCompleted(true);
      toast({ title: "Interview Completed!", description: `You answered ${correctCount}/${questions.length} questions. Score: ${percentage}%` });

      // Generate certificate if assessment also completed
      try {
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user?.id).single();
        const userName = profile?.full_name || user?.email?.split('@')[0] || "Candidate";
        
        // Get assessment score from assessment_results
        const { data: assessmentData } = await supabase
          .from("assessment_results")
          .select("score")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        
        const assessmentScore = assessmentData?.score || 0;
        
        if (assessmentScore >= 70 && percentage >= 70) {
          await supabase.rpc("generate_certificate_after_completion", {
            p_user_id: user?.id,
            p_user_name: userName,
            p_assessment_score: assessmentScore,
            p_interview_score: percentage,
          });
          toast({ title: "Certificate Generated!", description: "Congratulations! You've earned your IT Technical Interview Certification." });
        }
      } catch (certErr) {
        console.error("Certificate generation error:", certErr);
      }
    } catch (err) {
      console.error("Error submitting interview:", err);
      toast({ title: "Error", description: "Failed to submit interview", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading interview...</span>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-2xl">Interview Completed!</CardTitle>
            <CardDescription>Great job completing the technical interview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold">{interview?.score || 0}%</p>
              <p className="text-muted-foreground">
                {interview?.correct_answers || 0} out of {questions.length} questions answered
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleGenerateCertificate}
                disabled={isGenerating || !!generatedId || (interview?.score || 0) < 70}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-black h-12"
              >
                <Award className="w-4 h-4 mr-2" />
                {(interview?.score || 0) < 70 ? "Retake to earn Certificate" : (isGenerating ? "Generating..." : generatedId ? "Certificate Generated" : "Generate Certificate")}
              </Button>
              <Button variant="outline" className="w-full h-12" onClick={() => navigate("/jobseeker/interviews")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Interviews
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
          <DialogContent className="max-w-5xl p-0 overflow-hidden bg-slate-100 border-none">
            <DialogHeader className="p-6 bg-white border-b">
              <DialogTitle className="text-2xl font-black text-slate-900 font-jakarta">Technical Excellence Certificate</DialogTitle>
            </DialogHeader>
            <div className="p-8 max-h-[80vh] overflow-y-auto">
              <CertificateTemplate 
                id={generatedId || ""}
                userName={user?.name || "Candidate"}
                courseName={interview?.title || "Technical Interview"}
                date={new Date().toLocaleDateString()}
                type="Live Interview"
                score={interview?.score || 0}
                onClose={() => setShowCertificate(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/jobseeker/interviews")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Badge variant="outline">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{interview?.title || "Technical Interview"}</CardTitle>
            <Badge className={
              currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              currentQuestion?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }>
              {currentQuestion?.difficulty}
            </Badge>
          </div>
          <CardDescription>{interview?.category}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-right">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Question:</h3>
            <p className="text-lg">{currentQuestion?.question_text}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Answer:</label>
            <Textarea
              value={answers[currentQuestion?.id] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Points: {currentQuestion?.points}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentIndex === 0 && !interview?.started_at && (
            <Button onClick={handleStart}>
              Start Interview
            </Button>
          )}
          {currentIndex < questions.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}