import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Terminal, FileCode2, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { CertificateTemplate } from "@/components/certificate/CertificateTemplate";
import { useJobSeekerDashboard } from "@/contexts/JobSeekerDashboardContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock Data
const CODING_TEST_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  id: `q${i + 1}`,
  question: `Scenario ${i + 1}: You are tasked with optimizing a function that currently runs in O(n^2) time. Which of the following approaches is most likely to reduce the time complexity to O(n log n)?`,
  option_a: "Applying a nested loop structure to carefully index elements.",
  option_b: "Utilizing a hash map to count frequencies in O(1) time.",
  option_c: "Implementing a divide-and-conquer algorithm like Merge Sort.",
  option_d: "Caching all results indiscriminately into memory.",
  correct_answer: "C"
}));

export default function TakeCodingTest() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [codeNotes, setCodeNotes] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 mins
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { addCertificate } = useJobSeekerDashboard();
  const [showCertificate, setShowCertificate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const handleGenerateCertificate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const certId = `CERT-CODE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setGeneratedId(certId);
    await addCertificate({
      id: certId,
      title: "Full Stack Coding Challenge",
      assessment_id: "coding-demo",
      status: "issued",
      issued_at: new Date().toISOString()
    });
    setIsGenerating(false);
    setShowCertificate(true);
  };

  useEffect(() => {
    if (timeRemaining <= 0 && !isSubmitted) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timeRemaining, isSubmitted]);

  const handleAnswer = (val: string) => {
    setAnswers(prev => ({ ...prev, [CODING_TEST_QUESTIONS[currentIndex].id]: val }));
  };

  const handleCodeNote = (val: string) => {
    setCodeNotes(prev => ({ ...prev, [CODING_TEST_QUESTIONS[currentIndex].id]: val }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    let correct = 0;
    CODING_TEST_QUESTIONS.forEach(q => { if (answers[q.id] === q.correct_answer) correct++; });
    setScore(Math.round((correct / 10) * 100));
    setIsSubmitted(true);
    setIsSubmitting(false);
    toast({ title: "Coding Test Submitted", description: "Your logic and code have been analyzed." });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-50">
        <Card className="w-full max-w-xl shadow-2xl border-slate-800 bg-slate-800">
          <CardContent className="p-8 text-center space-y-6">
            <CheckCircle className="w-16 h-16 text-cyan-400 mx-auto" />
            <h1 className="text-3xl font-bold text-white">Test Completed</h1>
            <p className="text-slate-400">Score: <span className="text-2xl text-cyan-400 font-bold">{score}%</span></p>
            
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleGenerateCertificate}
                disabled={isGenerating || !!generatedId || score < 70}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-black"
              >
                <Award className="w-4 h-4 mr-2" />
                {score < 70 ? "Retake to earn Certificate" : (isGenerating ? "Generating..." : generatedId ? "Certificate Generated" : "Generate Certificate")}
              </Button>
              <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white" onClick={() => navigate("/jobseeker/coding-challenges")}>
                Back to Coding Tests
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
          <DialogContent className="max-w-5xl p-0 overflow-hidden bg-slate-100 text-slate-900 border-none shadow-2xl">
            <DialogHeader className="p-6 bg-white border-b">
              <DialogTitle className="text-2xl font-black">Coding Excellence Certificate</DialogTitle>
            </DialogHeader>
            <div className="p-8 max-h-[80vh] overflow-y-auto">
              <CertificateTemplate 
                id={generatedId || ""}
                userName="Candidate"
                courseName="Full Stack Coding Challenge"
                date={new Date().toLocaleDateString()}
                type="Coding Challenge"
                score={score}
                onClose={() => setShowCertificate(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const currentQ = CODING_TEST_QUESTIONS[currentIndex];
  const progressPct = Object.keys(answers).length * 10;
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-slate-300">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#161b22]">
        <div className="flex items-center gap-3">
          <FileCode2 className="text-cyan-400" />
          <h1 className="font-bold text-white tracking-wide">Take Coding Test</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-cyan-400 font-semibold bg-slate-900 px-4 py-1.5 rounded-full border border-cyan-900/50">
            <Clock className="w-4 h-4" />
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleSubmit}>
            Submit Test
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 grid lg:grid-cols-2">
        {/* Left Panel: Question & MCQ */}
        <div className="p-8 border-r border-slate-800 space-y-8 flex flex-col">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Question {currentIndex + 1} of 10
              </span>
              <span className="text-xs font-semibold text-cyan-500">{progressPct}% Answered</span>
            </div>
            <Progress value={progressPct} className="h-1 bg-slate-800 [&>div]:bg-cyan-500 mb-8" />
            
            <h2 className="text-xl font-medium text-slate-100 leading-relaxed mb-6">
              {currentQ.question}
            </h2>
          </div>

          <div className="flex-1">
            <RadioGroup value={answers[currentQ.id] || ""} onValueChange={handleAnswer} className="space-y-4">
              {[ { l: "A", o: currentQ.option_a }, { l: "B", o: currentQ.option_b }, { l: "C", o: currentQ.option_c }, { l: "D", o: currentQ.option_d } ].map(opt => (
                <div
                  key={opt.l}
                  onClick={() => handleAnswer(opt.l)}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border border-slate-800 cursor-pointer transition-all",
                    answers[currentQ.id] === opt.l ? "bg-cyan-500/10 border-cyan-500/50" : "hover:bg-slate-800"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-xs font-bold border",
                    answers[currentQ.id] === opt.l ? "bg-cyan-500 border-cyan-500 text-[#0d1117]" : "bg-slate-800 border-slate-700 text-slate-400"
                  )}>
                    {opt.l}
                  </div>
                  <Label className="cursor-pointer text-slate-300 leading-snug pt-0.5">{opt.o}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(i => i - 1)}
              className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            {currentIndex === 9 ? (
              <Button onClick={handleSubmit} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Submit Test
              </Button>
            ) : (
              <Button onClick={() => setCurrentIndex(i => i + 1)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Next Logic <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Right Panel: Integrated Code Editor Notepad */}
        <div className="bg-[#161b22] flex flex-col">
          <div className="px-6 py-3 border-b border-slate-800 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-mono text-slate-400">Integrated Scratchpad (Auto-saves)</span>
          </div>
          <textarea
            value={codeNotes[currentQ.id] || ""}
            onChange={(e) => handleCodeNote(e.target.value)}
            placeholder="// Write your logic, pseudocode, or scratch notes here..."
            className="flex-1 w-full bg-transparent p-6 text-sm font-mono text-slate-300 outline-none resize-none placeholder:text-slate-700"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
