import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Star, 
  TrendingUp, 
  Award, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  User,
  Mail,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  CheckCircle,
  AlertCircle,
  Users,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvaluationData {
  candidate: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    appliedRole: string;
    experience: string;
    location?: string;
    avatar?: string;
  };
  scores: {
    resume: number;
    technical: number;
    aptitude: number;
    communication: number;
    culturalFit: number;
    behavioral: number;
    overall: number;
  };
  assessments: {
    technical: {
      score: number;
      maxScore: number;
      breakdown: Array<{
        skill: string;
        score: number;
        maxScore: number;
      }>;
    };
    aptitude: {
      score: number;
      maxScore: number;
      sections: Array<{
        section: string;
        score: number;
        maxScore: number;
      }>;
    };
  };
  interviews: Array<{
    round: number;
    interviewer: string;
    date: string;
    duration: string;
    feedback: {
      technical: number;
      communication: number;
      problemSolving: number;
      culturalFit: number;
      overall: number;
      comments: string;
    };
  }>;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'hire' | 'strong-hire' | 'hold' | 'reject';
  benchmarkComparison: {
    percentile: number;
    averageScore: number;
    position: number;
    totalCandidates: number;
  };
  performanceTrend: Array<{
    date: string;
    score: number;
    assessment: string;
  }>;
}

interface ComprehensiveEvaluationReportProps {
  data: EvaluationData;
  onExport?: (format: 'pdf' | 'excel') => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'strong-hire': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    case 'hire': return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'hold': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'reject': return 'text-red-500 bg-red-500/10 border-red-500/20';
    default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
  }
};

const getScoreColor = (score: number, maxScore: number = 100) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 85) return 'text-emerald-500';
  if (percentage >= 70) return 'text-green-500';
  if (percentage >= 60) return 'text-yellow-500';
  return 'text-red-500';
};

export function ComprehensiveEvaluationReport({ data, onExport }: ComprehensiveEvaluationReportProps) {
  const {
    candidate,
    scores,
    assessments,
    interviews,
    strengths,
    weaknesses,
    recommendation,
    benchmarkComparison,
    performanceTrend
  } = data;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-none shadow-premium bg-white dark:bg-slate-900">
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-slate-100 dark:border-slate-800 shadow-md">
                <AvatarFallback className="bg-slate-100 text-slate-900 font-bold text-lg dark:bg-slate-800 dark:text-white">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{candidate.name}</h1>
                <p className="text-slate-600 dark:text-slate-300">{candidate.appliedRole}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {candidate.experience} experience
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs font-semibold", getStatusColor(recommendation))}>
                    {recommendation.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onExport?.('excel')}>
                <Download className="w-4 h-4 mr-2" /> Export Excel
              </Button>
              <Button onClick={() => onExport?.('pdf')}>
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Overall Evaluation Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={cn("text-3xl font-bold", getScoreColor(scores.overall))}>
                {scores.overall}%
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Overall Score</p>
            </div>
            <div className="text-center">
              <div className={cn("text-2xl font-bold", getScoreColor(scores.resume))}>
                {scores.resume}%
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Resume Score</p>
            </div>
            <div className="text-center">
              <div className={cn("text-2xl font-bold", getScoreColor(scores.technical))}>
                {scores.technical}%
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Technical Score</p>
            </div>
            <div className="text-center">
              <div className={cn("text-2xl font-bold", getScoreColor(scores.communication))}>
                {scores.communication}%
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Communication</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Assessment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Technical Skills Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.technical.breakdown.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill.skill}</span>
                    <span className={cn("font-bold", getScoreColor(skill.score, skill.maxScore))}>
                      {skill.score}/{skill.maxScore}
                    </span>
                  </div>
                  <Progress value={(skill.score / skill.maxScore) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aptitude Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Aptitude Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.aptitude.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{section.section}</span>
                    <span className={cn("font-bold", getScoreColor(section.score, section.maxScore))}>
                      {section.score}/{section.maxScore}
                    </span>
                  </div>
                  <Progress value={(section.score / section.maxScore) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Interview Feedback Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {interviews.map((interview, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold">Round {interview.round}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Interviewer: {interview.interviewer}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <p>{interview.date}</p>
                    <p>{interview.duration}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {Object.entries(interview.feedback).filter(([key]) => key !== 'comments').map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className={cn("text-lg font-bold", getScoreColor(value))}>
                        {value}%
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </p>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {interview.feedback.comments}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <ThumbsUp className="w-5 h-5" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <ThumbsDown className="w-5 h-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  {weakness}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Benchmark Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {benchmarkComparison.percentile}%
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Percentile Rank</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                #{benchmarkComparison.position}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Position</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {benchmarkComparison.averageScore}%
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Average Score</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {benchmarkComparison.totalCandidates}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Total Candidates</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}