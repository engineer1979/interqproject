import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Download, Edit3, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { cn } from '@/lib/utils';

interface EvaluationReport {
  report_id: string;
  report_title: string;
  report_summary: string;
  overall_score: number;
  proficiency_level: string;
  status: string;
  assessment_title: string;
  candidate_name: string;
  share_count: number;
}

const mockReport: EvaluationReport = {
  report_id: 'report-001',
  report_title: 'Full Stack Developer Evaluation - John Doe',
  report_summary: 'John demonstrates strong full stack capabilities with excellent React proficiency but needs improvement in backend optimization. Recommended for senior roles with mentorship.',
  overall_score: 87,
  proficiency_level: 'Advanced',
  status: 'final',
  assessment_title: 'Full Stack Developer Assessment',
  candidate_name: 'John Doe',
  share_count: 3,
};

export default function EvaluationReportPage() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id') || mockReport.report_id;
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Mock loading - replace with real API call
    const timer = setTimeout(() => {
      setReport(mockReport);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    // Implement sharing logic
    navigator.clipboard.writeText(window.location.href);
    alert('Report link copied to clipboard!');
  };

  const handleDownload = () => {
    // Trigger PDF download
    window.open(`/api/reports/${reportId}/pdf`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <Share2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-muted-foreground mb-8">The evaluation report you're looking for doesn't exist.</p>
        <Button onClick={() => window.history.back()}>Back to Dashboard</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'final': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{report.report_title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Badge className={cn("px-4 py-1 font-semibold", getStatusColor(report.status))}>
              {report.status.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              {report.share_count} shares
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Candidate: <strong>{report.candidate_name}</strong></span>
            <span>Assessment: <strong>{report.assessment_title}</strong></span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare} size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Report
          </Button>
          <Button onClick={handleDownload} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Overall Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-black text-primary mb-2">{report.overall_score}%</div>
              <div className="text-2xl font-bold capitalize">{report.proficiency_level}</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Recommendation</span>
                <Badge>Hire with Mentorship</Badge>
              </div>
              <div className="text-sm text-muted-foreground line-clamp-4">
                {report.report_summary}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Frontend Development</span>
                      <span>92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Backend Development</span>
                      <span>78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database Design</span>
                      <span>85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DevOps & Deployment</span>
                      <span>89%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="assessment" className="space-y-6 pt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">{report.assessment_title}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Score</span>
                      <span className="font-mono">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Taken</span>
                      <span>47 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Questions Answered</span>
                      <span>28/30</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="interview" className="space-y-6 pt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Technical Interview Notes</h3>
                  <p className="text-muted-foreground mb-4">No interview scheduled for this candidate</p>
                  <Button variant="outline">
                    Schedule Interview
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>Finalized report</span>
              <span className="ml-auto text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Shared with recruiting team</span>
              <span className="ml-auto text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Interview scheduled</span>
              <span className="ml-auto text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
