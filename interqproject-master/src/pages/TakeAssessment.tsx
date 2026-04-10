import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Timer,
  Trophy,
  RotateCcw,
  List,
  ChevronUp,
} from "lucide-react";
import { assessmentsData, Assessment } from "@/data/assessments";
import { useAssessmentQuestions, TOTAL_QUESTIONS, ASSESSMENT_DURATION_MINUTES } from "@/hooks/useAssessmentQuestions";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { CertificateTemplate } from "@/components/certificate/CertificateTemplate";
import { useJobSeekerDashboard } from "@/contexts/JobSeekerDashboardContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type Answers = Record<string, string>; // questionId → "A" | "B" | "C" | "D"
type ViewState = "instructions" | "in-progress" | "submitted";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (seconds: number): { text: string; urgent: boolean } => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return {
    text: `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    urgent: seconds <= 120, // last 2 minutes
  };
};

const difficultyColor = (d?: string) => {
  switch (d) {
    case "easy":   return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
    case "hard":   return "bg-red-100 text-red-700 border-red-200";
    default:       return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TimerBadgeProps { seconds: number }
function TimerBadge({ seconds }: TimerBadgeProps) {
  const { text, urgent } = formatTime(seconds);
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold border-2 transition-all duration-300",
        urgent
          ? "bg-red-50 border-red-400 text-red-600 animate-pulse"
          : "bg-slate-50 border-slate-200 text-slate-700"
      )}
    >
      <Clock className={cn("w-5 h-5", urgent && "text-red-500")} />
      {text}
    </div>
  );
}

// ─── Instructions Screen ──────────────────────────────────────────────────────

interface InstructionsProps {
  assessment: Assessment;
  onStart: () => void;
}
function InstructionsScreen({ assessment, onStart }: InstructionsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-2xl border-0 overflow-hidden">
        {/* Header band */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 opacity-80" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Assessment</span>
          </div>
          <h1 className="text-2xl font-bold">{assessment.title}</h1>
          <p className="text-sm text-blue-100 mt-1">{assessment.description}</p>
        </div>

        <CardContent className="p-8 space-y-8">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: List, label: "Questions", value: TOTAL_QUESTIONS },
              { icon: Timer, label: "Duration", value: `${ASSESSMENT_DURATION_MINUTES} min` },
              { icon: Target, label: "To Pass", value: "70%" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                <Icon className="w-5 h-5 mx-auto text-indigo-500 mb-2" />
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="flex gap-3 flex-wrap">
            <Badge className={cn("border", difficultyColor(assessment.difficulty))}>
              {assessment.difficulty?.toUpperCase()}
            </Badge>
            <Badge variant="outline">{assessment.category}</Badge>
          </div>

          {/* Rules */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Important Rules
            </h3>
            <ul className="text-sm text-amber-700 space-y-2">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">•</span>Answer all {TOTAL_QUESTIONS} questions within {ASSESSMENT_DURATION_MINUTES} minutes.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">•</span>The assessment auto-submits when the timer reaches zero.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">•</span>Navigate freely between questions using Previous / Next or the grid.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">•</span>Your answers are saved automatically as you select them.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">•</span>A score of 70% or above is required to pass.</li>
            </ul>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700"
            onClick={onStart}
          >
            Start Assessment
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────

interface ResultProps {
  score: number;
  answers: Answers;
  totalQuestions: number;
  correctCount: number;
  timeTaken: number; // seconds
  assessmentTitle: string;
  onRetry: () => void;
  onBack: () => void;
}
function ResultScreen({ score, totalQuestions, correctCount, timeTaken, assessmentTitle, onRetry, onBack }: ResultProps) {
  const passed = score >= 70;
  const { text: timeTakenText } = formatTime(timeTaken);
  const { addCertificate } = useJobSeekerDashboard();
  const [showCertificate, setShowCertificate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const id = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setGeneratedId(id);
    
    await addCertificate({
      id,
      title: assessmentTitle,
      assessment_id: "demo",
      status: "issued",
      issued_at: new Date().toISOString()
    });
    
    setIsGenerating(false);
    setShowCertificate(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl shadow-2xl border-0 overflow-hidden">
        {/* Header */}
        <div className={cn(
          "px-8 py-8 text-white text-center",
          passed ? "bg-gradient-to-r from-emerald-500 to-green-600" : "bg-gradient-to-r from-orange-500 to-amber-600"
        )}>
          <div className="flex justify-center mb-4">
            {passed
              ? <Trophy className="w-16 h-16 opacity-90" />
              : <AlertCircle className="w-16 h-16 opacity-90" />}
          </div>
          <h1 className="text-2xl font-bold">{passed ? "Congratulations!" : "Keep Practicing!"}</h1>
          <p className="mt-1 opacity-80 text-sm">{assessmentTitle}</p>
        </div>

        <CardContent className="p-8 space-y-6">
          {/* Score circle */}
          <div className="flex justify-center">
            <div className={cn(
              "w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center",
              passed ? "border-emerald-400 text-emerald-600" : "border-orange-400 text-orange-600"
            )}>
              <span className="text-4xl font-black">{score}%</span>
              <span className="text-xs font-medium">{passed ? "PASS" : "FAIL"}</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Answered", value: Object.values({}).length !== undefined ? totalQuestions : totalQuestions, color: "text-slate-700" },
              { label: "Correct", value: correctCount, color: "text-emerald-600" },
              { label: "Incorrect", value: totalQuestions - correctCount, color: "text-red-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className={cn("text-2xl font-bold", color)}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Time taken */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            Time taken: <span className="font-semibold text-slate-700 font-mono">{timeTakenText}</span>
          </div>

          {/* Progress bar of score */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Score</span><span>{score}% / 100%</span>
            </div>
            <Progress value={score} className="h-3" />
            <div className="text-xs text-slate-400 text-right">Pass mark: 70%</div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            {passed && (
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !!generatedId}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black h-12 shadow-lg shadow-amber-200"
              >
                <Award className="w-5 h-4 mr-2" />
                {isGenerating ? "Generating..." : generatedId ? "Certificate Generated" : "Generate Certificate"}
              </Button>
            )}
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onBack}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Library
              </Button>
              <Button className="flex-1 bg-slate-900 hover:bg-slate-800" onClick={onRetry}>
                <RotateCcw className="w-4 h-4 mr-1" /> Retake
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-slate-100">
          <DialogHeader className="p-6 bg-white border-b">
            <DialogTitle className="text-2xl font-black">Verified Certificate</DialogTitle>
          </DialogHeader>
          <div className="p-8 max-h-[80vh] overflow-y-auto">
            <CertificateTemplate 
              id={generatedId || ""}
              userName="Candidate"
              courseName={assessmentTitle}
              date={new Date().toLocaleDateString()}
              type="Assessment"
              score={score}
              onClose={() => setShowCertificate(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TakeAssessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [view, setView]                         = useState<ViewState>("instructions");
  const [currentIndex, setCurrentIndex]         = useState(0);
  const [answers, setAnswers]                   = useState<Answers>({});
  const [timeRemaining, setTimeRemaining]       = useState(ASSESSMENT_DURATION_MINUTES * 60);
  const [score, setScore]                       = useState(0);
  const [correctCount, setCorrectCount]         = useState(0);
  const [timeTaken, setTimeTaken]               = useState(0);
  const [isSubmitting, setIsSubmitting]         = useState(false);
  const startTimeRef                            = useRef<number>(0);

  // ── Data ───────────────────────────────────────────────────────────────────
  const assessment = assessmentsData.find(a => a.id === id) ?? null;

  // Override duration to always enforce 25 min timer
  const { data: questions = [], isLoading: questionsLoading, isError } = useAssessmentQuestions(id);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (view !== "in-progress") return;
    if (timeRemaining <= 0) { handleSubmit(); return; }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, timeRemaining]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleStart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setTimeRemaining(ASSESSMENT_DURATION_MINUTES * 60);
    startTimeRef.current = Date.now();
    setView("in-progress");
    toast({ title: "Assessment started", description: `You have ${ASSESSMENT_DURATION_MINUTES} minutes. Good luck!` });
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || view === "submitted") return;
    setIsSubmitting(true);

    const taken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setTimeTaken(taken);

    // Calculate score
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct_answer) correct++; });
    const finalScore = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    setScore(finalScore);
    setCorrectCount(correct);

    // Persist to Supabase results table
    try {
      await supabase.from("results").insert({
        candidate_id: user?.id ?? null,
        assessment_id: id ?? null,
        overall_score: finalScore,
        max_score: 100,
        status: finalScore >= 70 ? "pass" : "fail",
        notes: JSON.stringify({ answers, total_questions: questions.length, correct, time_taken_seconds: taken }),
        evaluated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Could not save result to Supabase:", err);
    }

    setView("submitted");
    setIsSubmitting(false);

    toast({
      title: "Assessment submitted!",
      description: `Your score: ${finalScore}% — ${finalScore >= 70 ? "You passed! 🎉" : "Keep practicing!"}`,
    });
  }, [answers, questions, id, user, view, isSubmitting]);

  const handleRetry = () => {
    setView("instructions");
    setAnswers({});
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTimeRemaining(ASSESSMENT_DURATION_MINUTES * 60);
  };

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Assessment Not Found</h2>
          <p className="text-slate-500">The requested assessment does not exist.</p>
          <Button onClick={() => navigate("/jobseeker/assessments")}>← Back to Assessments</Button>
        </div>
      </div>
    );
  }

  if (view === "instructions") {
    return <InstructionsScreen assessment={assessment} onStart={handleStart} />;
  }

  if (view === "submitted") {
    return (
      <ResultScreen
        score={score}
        answers={answers}
        totalQuestions={questions.length}
        correctCount={correctCount}
        timeTaken={timeTaken}
        assessmentTitle={assessment.title}
        onRetry={handleRetry}
        onBack={() => navigate("/jobseeker/assessments")}
      />
    );
  }

  // ── In-Progress View ───────────────────────────────────────────────────────
  if (questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 animate-pulse">
          <BookOpen className="w-12 h-12 text-indigo-400 mx-auto" />
          <p className="text-slate-600">Loading questions…</p>
        </div>
      </div>
    );
  }

  if (isError || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-orange-400 mx-auto" />
          <h2 className="text-lg font-semibold text-slate-700">Could not load questions</h2>
          <Button variant="outline" onClick={() => setView("instructions")}>← Back</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount   = Object.keys(answers).length;
  const progressPct     = Math.round((answeredCount / questions.length) * 100);
  const isLastQuestion  = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  const optionLabels: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
  const optionValues = [
    currentQuestion.option_a,
    currentQuestion.option_b,
    currentQuestion.option_c,
    currentQuestion.option_d,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Title & question number */}
          <div className="min-w-0">
            <h1 className="font-bold text-slate-800 truncate text-sm md:text-base">{assessment.title}</h1>
            <p className="text-xs text-slate-400">
              Q{currentIndex + 1} of {questions.length} &nbsp;·&nbsp; {answeredCount} answered
            </p>
          </div>

          {/* Timer */}
          <TimerBadge seconds={timeRemaining} />

          {/* Submit early button */}
          <Button
            size="sm"
            variant="outline"
            className="hidden md:flex border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting…" : "Submit Early"}
          </Button>
        </div>

        {/* Progress bar */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Completion</span>
            <span>{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 grid md:grid-cols-[1fr_220px] gap-6">

        {/* Question card */}
        <Card className="shadow-md border border-slate-100 self-start">
          <CardHeader className="pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Question {currentIndex + 1} / {questions.length}
              </CardTitle>
              <Badge className={cn("border text-xs", difficultyColor(currentQuestion.difficulty))}>
                {currentQuestion.difficulty}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Question text */}
            <p className="text-lg md:text-xl font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">
              {currentQuestion.question}
            </p>

            {/* Options */}
            <RadioGroup
              value={answers[currentQuestion.id] ?? ""}
              onValueChange={(val) => handleAnswer(currentQuestion.id, val)}
            >
              <div className="space-y-3">
                {optionLabels.map((label, idx) => {
                  const isSelected = answers[currentQuestion.id] === label;
                  return (
                    <div
                      key={label}
                      onClick={() => handleAnswer(currentQuestion.id, label)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none",
                        isSelected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                      )}
                    >
                      {/* Letter badge */}
                      <span className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border-2",
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-slate-200 text-slate-600"
                      )}>
                        {label}
                      </span>

                      <Label
                        htmlFor={`opt-${label}`}
                        className="flex-1 cursor-pointer text-slate-700 font-medium"
                      >
                        {optionValues[idx]}
                      </Label>

                      {/* Hidden radio for a11y */}
                      <RadioGroupItem value={label} id={`opt-${label}`} className="sr-only" />

                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting…" : "Submit Assessment"}
                  <CheckCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleNext}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Sidebar: Question Grid ──────────────────────────────────── */}
        <aside className="space-y-4 self-start">
          <Card className="shadow-sm border border-slate-100">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Question Navigator
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent  = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      title={`Q${idx + 1}${isAnswered ? " (answered)" : ""}`}
                      className={cn(
                        "w-9 h-9 rounded-lg text-xs font-bold border-2 transition-all duration-150",
                        isCurrent && "ring-2 ring-offset-1 ring-indigo-400",
                        isCurrent
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : isAnswered
                          ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                          : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                {[
                  { color: "bg-indigo-600",   label: "Current" },
                  { color: "bg-emerald-100 border border-emerald-300", label: "Answered" },
                  { color: "bg-white border border-slate-200",          label: "Unanswered" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className={cn("w-4 h-4 rounded", color)} />
                    {label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary card */}
          <Card className="shadow-sm border border-slate-100">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total</span>
                <span className="font-bold text-slate-700">{questions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Answered</span>
                <span className="font-bold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Remaining</span>
                <span className="font-bold text-red-500">{questions.length - answeredCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Mobile submit */}
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 md:hidden"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting…" : "Submit Assessment"}
          </Button>
        </aside>
      </main>
    </div>
  );
}