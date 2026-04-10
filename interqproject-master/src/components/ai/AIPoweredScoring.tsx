import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  Brain,
  TrendingUp,
  Target,
  Award,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Star,
  Crown,
  Lightbulb,
  ShieldCheck,
  Rocket,
  Cpu
} from 'lucide-react';
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

interface CandidateScore {
  name: string;
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
  culturalFit: number;
  experience: number;
}

interface ScoringWeights {
  technical: number;
  communication: number;
  problemSolving: number;
  culturalFit: number;
  experience: number;
}

interface AIFeature {
  id: string;
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

interface ScoreDistribution {
  range: string;
  count: number;
  color: string;
}

interface TrendData {
  month: string;
  score: number;
  candidates: number;
}

const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4'
};

const SCORE_COLORS = {
  excellent: 'text-emerald-500',
  good: 'text-green-500',
  average: 'text-yellow-500',
  belowAverage: 'text-orange-500',
  poor: 'text-red-500'
};

export function AIPoweredScoring() {
  const weights: ScoringWeights = {
    technical: 35,
    communication: 20,
    problemSolving: 25,
    culturalFit: 10,
    experience: 10
  };

  const candidates: CandidateScore[] = [
    {
      name: 'Alex Sterling',
      overall: 92,
      technical: 95,
      communication: 88,
      problemSolving: 94,
      culturalFit: 85,
      experience: 90
    },
    {
      name: 'Sarah Wilson',
      overall: 87,
      technical: 82,
      communication: 92,
      problemSolving: 85,
      culturalFit: 95,
      experience: 88
    },
    {
      name: 'Mike Johnson',
      overall: 78,
      technical: 80,
      communication: 75,
      problemSolving: 82,
      culturalFit: 70,
      experience: 85
    }
  ];

  const scoreDistribution: ScoreDistribution[] = [
    { range: '90-100', count: 45, color: CHART_COLORS.success },
    { range: '80-89', count: 120, color: CHART_COLORS.primary },
    { range: '70-79', count: 85, color: CHART_COLORS.info },
    { range: '60-69', count: 35, color: CHART_COLORS.warning },
    { range: 'Below 60', count: 15, color: CHART_COLORS.danger }
  ];

  const trendData: TrendData[] = [
    { month: 'Jan', score: 72, candidates: 45 },
    { month: 'Feb', score: 75, candidates: 52 },
    { month: 'Mar', score: 78, candidates: 48 },
    { month: 'Apr', score: 76, candidates: 61 },
    { month: 'May', score: 82, candidates: 58 },
    { month: 'Jun', score: 85, candidates: 67 }
  ];

  const aiFeatures: AIFeature[] = [
    {
      id: '1',
      name: 'Resume Screening',
      description: 'AI-powered CV analysis and ranking',
      impact: 'high',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: '2',
      name: 'Skill Assessment',
      description: 'Automated technical skill evaluation',
      impact: 'high',
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: '3',
      name: 'Interview Analysis',
      description: 'Sentiment and communication scoring',
      impact: 'medium',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: '4',
      name: 'Predictive Hiring',
      description: 'Success probability modeling',
      impact: 'high',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: '5',
      name: 'Bias Detection',
      description: 'Fair hiring practice monitoring',
      impact: 'high',
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      id: '6',
      name: 'Talent Matching',
      description: 'Role-candidate fit optimization',
      impact: 'medium',
      icon: <Target className="w-5 h-5" />
    }
  ];

  const radarData = [
    { subject: 'Technical', A: 92, B: 85, fullMark: 100 },
    { subject: 'Communication', A: 88, B: 90, fullMark: 100 },
    { subject: 'Problem Solving', A: 94, B: 80, fullMark: 100 },
    { subject: 'Cultural Fit', A: 85, B: 95, fullMark: 100 },
    { subject: 'Experience', A: 90, B: 88, fullMark: 100 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return SCORE_COLORS.excellent;
    if (score >= 80) return SCORE_COLORS.good;
    if (score >= 70) return SCORE_COLORS.average;
    if (score >= 60) return SCORE_COLORS.belowAverage;
    return SCORE_COLORS.poor;
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">High Impact</Badge>;
      case 'medium': return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Medium Impact</Badge>;
      case 'low': return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20">Low Impact</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI-Powered Scoring System
          </h2>
          <p className="text-muted-foreground mt-1">
            Advanced machine learning models for candidate evaluation
          </p>
        </div>
        <Button className="gap-2">
          <Cpu className="w-4 h-4" />
          Configure AI Models
        </Button>
      </div>

      {/* AI Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiFeatures.map((feature) => (
          <Card key={feature.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {feature.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{feature.name}</h3>
                  {getImpactBadge(feature.impact)}
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Scoring Weights Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Scoring Weights Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{value}%</div>
                <p className="text-sm text-muted-foreground capitalize mt-1">
                  {key.replace(/([A-Z])/g, ' $1')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Comparison Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Candidate Comparison (Radar)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Alex Sterling"
                  dataKey="A"
                  stroke={CHART_COLORS.primary}
                  fill={CHART_COLORS.primary}
                  fillOpacity={0.6}
                />
                <Radar
                  name="Sarah Wilson"
                  dataKey="B"
                  stroke={CHART_COLORS.secondary}
                  fill={CHART_COLORS.secondary}
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  label={({ range, count }) => `${range}: ${count}`}
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {scoreDistribution.map((item) => (
                <div key={item.range} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.range}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Score Trend Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" domain={[60, 100]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="score"
                  stroke={CHART_COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  name="Avg Score"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="candidates"
                  stroke={CHART_COLORS.secondary}
                  name="Candidates"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Top Ranked Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidates.map((candidate, index) => (
                <div key={candidate.name} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-slate-400 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{candidate.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className={`text-lg font-bold ${getScoreColor(candidate.overall)}`}>
                        {candidate.overall}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <div className={getScoreColor(candidate.technical)}>{candidate.technical}%</div>
                      <div className="text-muted-foreground">Tech</div>
                    </div>
                    <div className="text-center">
                      <div className={getScoreColor(candidate.communication)}>{candidate.communication}%</div>
                      <div className="text-muted-foreground">Comm</div>
                    </div>
                    <div className="text-center">
                      <div className={getScoreColor(candidate.problemSolving)}>{candidate.problemSolving}%</div>
                      <div className="text-muted-foreground">Prob</div>
                    </div>
                    <div className="text-center">
                      <div className={getScoreColor(candidate.culturalFit)}>{candidate.culturalFit}%</div>
                      <div className="text-muted-foreground">Fit</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-600">Hiring Success Rate</span>
              </div>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-sm text-muted-foreground mt-1">
                Candidates scoring above 80% have 87% success rate
              </p>
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-600">Time Saved</span>
              </div>
              <div className="text-2xl font-bold">45%</div>
              <p className="text-sm text-muted-foreground mt-1">
                Average reduction in screening time with AI assistance
              </p>
            </div>

            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-600">Prediction Accuracy</span>
              </div>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-sm text-muted-foreground mt-1">
                AI model accuracy in predicting candidate success
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function MessageSquare(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}