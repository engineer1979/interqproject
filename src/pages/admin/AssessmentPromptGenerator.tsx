import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download, RefreshCw, Zap, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { canAccessAdmin } from "@/contexts/SimpleAuthContext";

const ASSESSMENT_TYPES = [
  "Networking Fundamentals",
  "Cloud Architecture (AWS)",
  "Cloud Architecture (Azure)",
  "Active Directory / Identity Management",
  "AWS Solutions Architect",
  "Azure Administrator",
  "Python Programming",
  "SQL / Database Management",
  "Linux Administration",
  "Windows Administration",
  "ITIL Foundations",
  "CISSP (Information Security)",
  "Kubernetes Orchestration",
  "Behavioral Interviews (Competency-Based)",
];

const QUESTION_TYPES = [
  { name: "Multiple Choice", weight: 60 },
  { name: "Multiple Select", weight: 15 },
  { name: "Short Answer", weight: 15 },
  { name: "Matching/Ordering", weight: 10 },
];

const DIFFICULTY_LEVELS = [
  { level: "Easy", range: "Q1-Q60", concepts: "Recall & Understanding" },
  { level: "Medium", range: "Q61-Q120", concepts: "Apply & Analyze" },
  { level: "Hard", range: "Q121-Q180", concepts: "Evaluate & Synthesize" },
];

interface ContentFocus {
  topic: string;
  percentage: number;
}

interface LearningObjective {
  difficulty: string;
  objective: string;
}

export default function AssessmentPromptGenerator() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Prevent mounting if not admin or loading
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!canAccessAdmin(user)) {
    toast({
      title: "Access Denied",
      description: "You must be an admin to access this page",
      variant: "destructive",
    });
    navigate("/dashboard");
    return null;
  }

  // ... rest of the component

  const [contentFocuses, setContentFocuses] = useState<ContentFocus[]>([
    { topic: "Core Concepts", percentage: 40 },
    { topic: "Applied Scenarios", percentage: 35 },
    { topic: "Advanced Topics", percentage: 25 },
  ]);

  const [newContentTopic, setNewContentTopic] = useState("");
  const [newContentPercentage, setNewContentPercentage] = useState(0);

  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(
    QUESTION_TYPES.map((q) => q.name)
  );

const [learningObjectives, setLearningObjectives] = useState<LearningObjective[]>([
    { difficulty: "Easy", objective: "Understand core concepts and definitions" },
    { difficulty: "Medium", objective: "Apply knowledge in practical scenarios" },
    { difficulty: "Hard", objective: "Analyze complex situations and design solutions" },
  ]);

  const [newObjective, setNewObjective] = useState({ difficulty: "Easy", text: "" });
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [showPreview, setShowPreview] = useState(false);

// Bulk import state
const [bulkConfig, setBulkConfig] = useState<any>(null);
const [isBulkProcessing, setIsBulkProcessing] = useState(false);
const [originalAssessments, setOriginalAssessments] = useState<any[]>([]);

// Keep old isBulkImporting for compatibility if used elsewhere
const [isBulkImporting, setIsBulkImporting] = useState(false);

  // Add content focus
  const handleAddContentFocus = () => { ... };

  // Remove content focus
  const handleRemoveContentFocus = (index: number) => { ... };

  // Add learning objective
  const handleAddObjective = () => { ... };

  // Toggle question type
  const handleToggleQuestionType = (typeName: string) => { ... };

  // Generate master prompt
  const handleGeneratePrompt = () => { ... };

// Bulk import handler
  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File too large. Maximum size is 1MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await file.text();
      const assessments: any[] = JSON.parse(text);
      if (assessments.length === 0) throw new Error("No assessments found in file");
      
      // Store original assessments and start with first
      setOriginalAssessments(assessments);
      setBulkConfig(assessments[0]);
      setIsBulkProcessing(true);
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to parse JSON file: ${err}`,
        variant: "destructive",
      });
    } finally {
      // Reset file input
      e.target.value = "";
    }
  };

  // Effect to handle bulk import processing
  useEffect(() => {
    if (!bulkConfig || !isBulkProcessing) return;

    const generateNext = async () => {
      try {
        setFormData(bulkConfig);
        // Wait for state update
        await new Promise(resolve => setTimeout(resolve, 500));
        await handleGeneratePrompt();
        
        // Show success toast
        toast({
          title: "Success",
          description: `Generated: ${bulkConfig.assessmentName}`,
          duration: 2000,
        });

        // Find next assessment in the original array
        const originalAssessments = getBulkAssessments(); // Need to store original array
        const currentIdx = originalAssessments.indexOf(bulkConfig);
        if (currentIdx !== -1 && currentIdx < originalAssessments.length - 1) {
          const nextConfig = originalAssessments[currentIdx + 1];
          setBulkConfig(nextConfig);
        } else {
          setIsBulkProcessing(false);
          toast({
            title: "Bulk Import Complete",
            description: `Successfully generated all assessments!`,
            duration: 5000,
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: `Failed to generate ${bulkConfig?.assessmentName}: ${err}`,
          variant: "destructive",
          duration: 3000,
        });
        // Move to next assessment even if one fails
        const originalAssessments = getBulkAssessments();
        const currentIdx = originalAssessments.indexOf(bulkConfig);
        if (currentIdx !== -1 && currentIdx < originalAssessments.length - 1) {
          const nextConfig = originalAssessments[currentIdx + 1];
          setBulkConfig(nextConfig);
        } else {
          setIsBulkProcessing(false);
        }
      }
    };

    generate();
  }, [bulkConfig]);

  // Copy to clipboard
  const handleCopyToClipboard = () => { ... };

  // Download as file
  const handleDownload = () => { ... };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Zap className="w-10 h-10 text-yellow-500" />
          Assessment Prompt Generator
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Create custom master prompts for generating 180-question assessments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
              <CardDescription>Configure your assessment properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Assessment Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., AWS Solutions Architect Professional"
                  value={formData.assessmentName}
                  onChange={(e) =>
                    setFormData({ ...formData, assessmentName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="type">Assessment Type *</Label>
                <Select
                  value={formData.assessmentType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assessmentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSESSMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="e.g., Cloud architects, system administrators"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passing">Passing Score (%)</Label>
                  <Input
                    id="passing"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passingScore: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Types */}
          <Card>
            <CardHeader>
              <CardTitle>Question Type Mix</CardTitle>
              <CardDescription>Select which question types to include</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {QUESTION_TYPES.map((qType) => (
                <div key={qType.name} className="flex items-center gap-3">
                  <Checkbox
                    id={qType.name}
                    checked={selectedQuestionTypes.includes(qType.name)}
                    onCheckedChange={() => handleToggleQuestionType(qType.name)}
                  />
                  <Label htmlFor={qType.name} className="cursor-pointer flex-1">
                    {qType.name}
                    <span className="text-muted-foreground text-sm ml-2">({qType.weight}%)</span>
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Content Focus Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Content Focus Areas</CardTitle>
              <CardDescription>Define what topics to emphasize</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentFocuses.map((focus, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{focus.topic}</p>
                    <p className="text-sm text-muted-foreground">
                      {focus.percentage}% (~{Math.round(focus.percentage * 1.8)} questions)
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveContentFocus(idx)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <Label htmlFor="topic">Add Content Area</Label>
                <div className="flex gap-2">
                  <Input
                    id="topic"
                    placeholder="Topic name"
                    value={newContentTopic}
                    onChange={(e) => setNewContentTopic(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="%"
                    min="0"
                    max="100"
                    className="w-20"
                    value={newContentPercentage}
                    onChange={(e) => setNewContentPercentage(parseInt(e.target.value))}
                  />
                  <Button onClick={handleAddContentFocus} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

{/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
          <CardDescription>Define what each difficulty level should assess</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {learningObjectives.map((lo, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <p className="font-medium text-sm">{lo.difficulty}</p>
              <p className="text-sm text-muted-foreground mt-1">{lo.objective}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setLearningObjectives(learningObjectives.filter((_, i) => i !== idx))
                }
                className="mt-2"
              >
                Remove
              </Button>
            </div>
          ))}

          <div className="border-t pt-4 space-y-2">
            <div>
              <Label htmlFor="objDifficulty">Difficulty Level</Label>
              <Select value={newObjective.difficulty} onValueChange={(value) =>
                setNewObjective({ ...newObjective, difficulty: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((d) => (
                    <SelectItem key={d.level} value={d.level}>
                      {d.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
<div>
  <Label htmlFor="objective">Learning Objective</Label>
  <Textarea
    id="objective"
    placeholder="What should students be able to do?"
    value={newObjective.text}
    onChange={(e) =>
      setNewObjective({ ...newObjective, text: e.target.value })
    }
  />
  <Button onClick={handleAddObjective} size="sm" className="mt-2">
    Add Objective
  </Button>
</div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Import */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Import</CardTitle>
          <CardDescription>Import multiple assessment configurations at once</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Upload JSON file with assessment configurations</p>
            <p className="text-xs text-muted-foreground mt-2">
              Format: Array of objects with assessmentName, assessmentType, targetAudience, passingScore, duration
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="file"
              id="bulkImport"
              accept=".json"
              onChange={handleBulkImport}
              disabled={isBulkImporting}
              className="flex-1"
            />
            <Button variant="outline" onClick={() => document.getElementById('bulkImport')?.click()} disabled={isBulkImporting}>
              Browse
            </Button>
            {isBulkImporting && (
              <div className="flex items-center ml-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Importing...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button onClick={handleGeneratePrompt} size="lg" className="w-full">
        <Zap className="w-5 h-5 mr-2" />
        Generate Master Prompt
      </Button>
    </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div>
                  <Label htmlFor="objDifficulty">Difficulty Level</Label>
                  <Select value={newObjective.difficulty} onValueChange={(value) =>
                    setNewObjective({ ...newObjective, difficulty: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map((d) => (
                        <SelectItem key={d.level} value={d.level}>
                          {d.level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="objective">Learning Objective</Label>
                  <Textarea
                    id="objective"
                    placeholder="What should students be able to do?"
                    value={newObjective.text}
                    onChange={(e) =>
                      setNewObjective({ ...newObjective, text: e.target.value })
                    }
                  />
                  <Button onClick={handleAddObjective} size="sm" className="mt-2">
                    Add Objective
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button onClick={handleGeneratePrompt} size="lg" className="w-full">
            <Zap className="w-5 h-5 mr-2" />
            Generate Master Prompt
          </Button>
        </div>

        {/* Right Panel: Preview & Actions */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Total Questions:</span>
                  <span>180</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Easy (Q1-Q60):</span>
                  <span>60 @ 20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Medium (Q61-Q120):</span>
                  <span>60 @ 30%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Hard (Q121-Q180):</span>
                  <span>60 @ 50%</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Passing Score:</span>
                  <span>{formData.passingScore}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Prompt Preview */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Generated Prompt</CardTitle>
                <CardDescription>Ready to copy or download</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted p-3 rounded-lg max-h-48 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap break-words">
                    {generatedPrompt.substring(0, 300)}...
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToClipboard}
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  ✅ Prompt is ready to paste into Claude, ChatGPT, or your AI assistant
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 text-sm text-blue-900">
              <h4 className="font-semibold mb-2">💡 How to Use</h4>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Fill out the form on the left</li>
                <li>Click "Generate Master Prompt"</li>
                <li>Copy or download the prompt</li>
                <li>Paste into Claude, ChatGPT, or your AI</li>
                <li>Get 180-question assessment!</li>
              </ol>
            </CardContent>
          </Card>

          {/* Reference Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assessment Standards</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div>
                <p className="font-semibold">Difficulty Breakdown:</p>
                <ul className="ml-2 space-y-1 mt-1">
                  <li>• Easy: Recall & Understanding</li>
                  <li>• Medium: Application & Analysis</li>
                  <li>• Hard: Evaluation & Synthesis</li>
                </ul>
              </div>
              <div className="pt-2">
                <p className="font-semibold">Question Coverage:</p>
                <ul className="ml-2 space-y-1 mt-1">
                  <li>• Core Concepts: 40%</li>
                  <li>• Applied: 35%</li>
                  <li>• Advanced: 25%</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
