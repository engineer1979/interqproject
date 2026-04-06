import React, { useState, useMemo, useCallback } from 'react';
import { useReports, Report } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, Plus, Eye, Trash2, FileText, BarChart3, Loader2, ChevronLeft, ChevronRight, ArrowUpDown, RefreshCw, Filter, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const CHART_COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

const STATUS_COLORS: Record<string, string> = {
  pass: 'bg-green-100 text-green-800',
  fail: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

interface GenerateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: {
    candidate_name: string;
    candidate_email?: string;
    job_title?: string;
    score: number;
    max_score?: number;
    status: 'pass' | 'fail' | 'pending';
    details?: Record<string, any>;
  }) => Promise<{ success: boolean; error?: string }>;
  candidates: { id: string; name: string; email: string; jobTitle?: string }[];
}

function GenerateReportModal({ open, onOpenChange, onGenerate, candidates }: GenerateReportModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidate_id: '',
    candidate_name: '',
    candidate_email: '',
    job_title: '',
    score: 0,
    max_score: 100,
    status: 'pending' as 'pass' | 'fail' | 'pending',
    comments: '',
  });

  const handleCandidateSelect = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      setFormData(prev => ({
        ...prev,
        candidate_id: candidateId,
        candidate_name: candidate.name,
        candidate_email: candidate.email,
        job_title: candidate.jobTitle || '',
      }));
    }
  };

  const calculateStatus = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 70) return 'pass';
    if (percentage < 50) return 'fail';
    return 'pending';
  };

  const handleSubmit = async () => {
    if (!formData.candidate_name.trim()) return;

    setLoading(true);
    try {
      const status = calculateStatus(formData.score, formData.max_score);
      const result = await onGenerate({
        candidate_name: formData.candidate_name,
        candidate_email: formData.candidate_email || undefined,
        job_title: formData.job_title || undefined,
        score: formData.score,
        max_score: formData.max_score,
        status,
        details: formData.comments ? { comments: formData.comments } : undefined,
      });

      if (result.success) {
        setFormData({
          candidate_id: '',
          candidate_name: '',
          candidate_email: '',
          job_title: '',
          score: 0,
          max_score: 100,
          status: 'pending',
          comments: '',
        });
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Evaluation Report</DialogTitle>
          <DialogDescription>Create a new candidate evaluation report</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Candidate</Label>
            <Select value={formData.candidate_id} onValueChange={handleCandidateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Score</Label>
              <Input
                type="number"
                min={0}
                max={formData.max_score}
                value={formData.score}
                onChange={e => setFormData(prev => ({ ...prev, score: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Score</Label>
              <Input
                type="number"
                min={1}
                value={formData.max_score}
                onChange={e => setFormData(prev => ({ ...prev, max_score: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input
              value={formData.job_title}
              onChange={e => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
              placeholder="Position applied for"
            />
          </div>

          <div className="space-y-2">
            <Label>Comments</Label>
            <Textarea
              value={formData.comments}
              onChange={e => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Evaluation comments..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm">Auto Status:</span>
            <Badge className={STATUS_COLORS[calculateStatus(formData.score, formData.max_score)]}>
              {calculateStatus(formData.score, formData.max_score).toUpperCase()}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !formData.candidate_name.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ReportDetailModalProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ReportDetailModal({ report, open, onOpenChange }: ReportDetailModalProps) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>Evaluation report for {report.candidate_name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Candidate</p>
              <p className="font-medium">{report.candidate_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{report.candidate_email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Job Title</p>
              <p className="font-medium">{report.job_title || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interview Date</p>
              <p className="font-medium">{new Date(report.interview_date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold">{report.score}/{report.max_score}</p>
            </div>
            <Badge className={`text-lg px-4 py-2 ${STATUS_COLORS[report.status]}`}>
              {report.status.toUpperCase()}
            </Badge>
          </div>

          {report.details?.comments && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Comments</p>
              <p className="text-sm">{report.details.comments}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ReportsPage() {
  const {
    reports,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    sortConfig,
    setSortConfig,
    fetchReports,
    generateReport,
    deleteReport,
    exportToCSV,
    getStats,
  } = useReports();

  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const stats = useMemo(() => getStats(), [getStats]);

  const chartData = useMemo(() => [
    { name: 'Pass', value: stats.passCount, color: '#22c55e' },
    { name: 'Fail', value: stats.failCount, color: '#ef4444' },
    { name: 'Pending', value: stats.pendingCount, color: '#f59e0b' },
  ], [stats]);

  const debouncedSearch = useCallback((value: string) => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleGenerateReport = async (data: Parameters<typeof generateReport>[0] extends infer T ? T : never) => {
    const result = await generateReport(data as any);
    if (result.success) {
      toast({ title: 'Report generated successfully', description: `${data.candidate_name}'s report has been created.` });
      return { success: true };
    } else {
      toast({ title: 'Failed to generate report', description: result.error, variant: 'destructive' });
      return { success: false, error: result.error };
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setDetailModalOpen(true);
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const result = await deleteReport(reportId);
      if (result.success) {
        toast({ title: 'Report deleted successfully' });
      } else {
        toast({ title: 'Failed to delete report', description: result.error, variant: 'destructive' });
      }
    }
  };

  const handleExportCSV = () => {
    exportToCSV(reports);
    toast({ title: 'Reports exported', description: `${reports.length} reports exported to CSV.` });
  };

  const handleExportFiltered = () => {
    const filteredReports = reports.filter(r => {
      if (filters.status !== 'all' && r.status !== filters.status) return false;
      if (filters.dateFrom && new Date(r.interview_date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(r.interview_date) > new Date(filters.dateTo)) return false;
      return true;
    });
    exportToCSV(filteredReports, `reports_filtered_${Date.now()}.csv`);
    toast({ title: 'Filtered reports exported', description: `${filteredReports.length} reports exported to CSV.` });
  };

  const handleSort = (key: keyof Report) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  const mockCandidates = [
    { id: '1', name: 'John Doe', email: 'john@example.com', jobTitle: 'Frontend Developer' },
    { id: '2', name: 'Sarah Wilson', email: 'sarah@example.com', jobTitle: 'Backend Developer' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', jobTitle: 'Product Manager' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Evaluation Reports</h1>
            <p className="text-muted-foreground">View and manage candidate evaluation reports</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" onClick={handleExportFiltered}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setGenerateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pass">Pass</SelectItem>
                      <SelectItem value="fail">Fail</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date From</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date To</Label>
                  <Input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFilters({ search: '', status: 'all' });
                      setSearchInput('');
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pagination.total > 0 ? ((stats.passCount / pagination.total) * 100).toFixed(1) : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-green-100 text-green-800">{stats.passCount} Pass</Badge>
                <Badge className="bg-red-100 text-red-800">{stats.failCount} Fail</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">{stats.pendingCount} Pending</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Reports Table</CardTitle>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchInput}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive">{error}</p>
                  <Button variant="outline" onClick={fetchReports} className="mt-4">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reports found</p>
                  <Button onClick={() => setGenerateModalOpen(true)} className="mt-4">
                    Generate First Report
                  </Button>
                </div>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">
                            <Button variant="ghost" size="sm" onClick={() => handleSort('candidate_name')}>
                              Candidate
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </th>
                          <th className="text-left py-3 px-2">Job Title</th>
                          <th className="text-left py-3 px-2">
                            <Button variant="ghost" size="sm" onClick={() => handleSort('score')}>
                              Score
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </th>
                          <th className="text-left py-3 px-2">
                            <Button variant="ghost" size="sm" onClick={() => handleSort('status')}>
                              Status
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </th>
                          <th className="text-left py-3 px-2">
                            <Button variant="ghost" size="sm" onClick={() => handleSort('interview_date')}>
                              Date
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </th>
                          <th className="text-right py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report) => (
                          <tr key={report.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-medium">{report.candidate_name}</p>
                                <p className="text-xs text-muted-foreground">{report.candidate_email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-2">{report.job_title || 'N/A'}</td>
                            <td className="py-3 px-2">
                              <span className="font-medium">{report.score}/{report.max_score}</span>
                              <span className="text-xs text-muted-foreground ml-1">
                                ({((report.score / report.max_score) * 100).toFixed(0)}%)
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <Badge className={STATUS_COLORS[report.status]}>
                                {report.status.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="py-3 px-2">{new Date(report.interview_date).toLocaleDateString()}</td>
                            <td className="py-3 px-2 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-4">
                    {reports.map((report) => (
                      <Card key={report.id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{report.candidate_name}</p>
                              <p className="text-xs text-muted-foreground">{report.candidate_email}</p>
                            </div>
                            <Badge className={STATUS_COLORS[report.status]}>
                              {report.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground">Job</p>
                              <p>{report.job_title || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Score</p>
                              <p>{report.score}/{report.max_score}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p>{new Date(report.interview_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewReport(report)}>
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDeleteReport(report.id)}>
                              <Trash2 className="mr-1 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {pagination.page} of {totalPages} ({pagination.total} total)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page >= totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <GenerateReportModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
        onGenerate={handleGenerateReport}
        candidates={mockCandidates}
      />

      <ReportDetailModal
        report={selectedReport}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  );
}
