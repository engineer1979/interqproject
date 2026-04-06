import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  BarChart3, Download, FileText, User, Calendar, Star, Target, Zap,
  Shield, Users, TrendingUp, Award 
} from 'lucide-react';
import { DetailedCandidate, CandidateEvaluationFeature } from '@/data/candidateEvaluationsMock';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface EvaluationReportViewProps {
  candidate: DetailedCandidate;
  onClose?: () => void;
}

const FEATURE_ICONS = {
  'Overall Score': TrendingUp,
  'Technical Skills': Zap,
  'Behavioral Fit': Users,
  'Communication Skills': Shield,
  'Problem Solving': Target,
  'Cultural Fit': Users,
  'Experience Match': Calendar,
  'Growth Potential': TrendingUp,
  'Team Collaboration': Users,
  'Recommendation': Award
} as Record<string, React.ComponentType<{ className?: string }>>;

const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({ candidate, onClose }) => {
  const generatePDF = async () => {
    const element = document.getElementById('report-content');
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${candidate.name}_Evaluation_Report.pdf`);
    }
  };

  const getCategoryColor = (category: CandidateEvaluationFeature['category']) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'behavioral': return 'bg-green-100 text-green-800 border-green-200';
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: DetailedCandidate['status']) => {
    switch (status) {
      case 'advance': return 'bg-green-100 text-green-800';
      case 'advance-reserve': return 'bg-yellow-100 text-yellow-800';
      case 'reject': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const averageScore = (features: CandidateEvaluationFeature[]) => {
    const total = features.reduce((sum, f) => sum + f.score, 0);
    return (total / features.length).toFixed(1);
  };

const IconComponent = ({ featureName }: { featureName: string }) => {
    const Icon = FEATURE_ICONS[featureName as keyof typeof FEATURE_ICONS] || User;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            {candidate.name.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              {candidate.name} - {candidate.position}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(candidate.status)}>{candidate.status.toUpperCase()}</Badge>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                {candidate.overallScore.toFixed(1)}/5.0
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePDF} className="gap-2">
            <Download className="h-4 w-4" />
            PDF Download
          </Button>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent id="report-content" className="space-y-8 p-0">
        {/* Summary */}
        <div className="p-8 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Interviewer</p>
              <p className="font-semibold">{candidate.interviewer}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Interview Date</p>
              <p className="font-semibold">{new Date(candidate.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Average Feature Score</p>
              <p className="font-semibold">{averageScore(candidate.features)}/5.0</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <p className="text-sm font-medium mb-2">Recommendation</p>
            <p className="text-lg font-semibold text-primary">{candidate.recommendation}</p>
          </div>
        </div>

        {/* 10 Feature Breakdown */}
        <div className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            10 Assessment Features
          </h3>
          <div className="space-y-4">
            {candidate.features.map((feature, index) => (
              <div key={index} className="group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
<div className={`p-2 rounded-lg ${getCategoryColor(feature.category)}`}>
                      <IconComponent featureName={feature.name} />
                    </div>
                    <div>
                      <p className="font-semibold">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">{feature.comments}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {feature.score}/{feature.maxScore}
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${feature.score === feature.maxScore ? 'bg-green-100 text-green-800' : feature.score >= feature.maxScore * 0.8 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {((feature.score / feature.maxScore) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <Progress value={(feature.score / feature.maxScore) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationReportView;
