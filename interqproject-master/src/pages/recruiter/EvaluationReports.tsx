import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { DetailedCandidate, mockCandidates } from '@/data/candidateEvaluationsMock';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'sonner';
import { BarChart3, FileText, Download, Eye, Users, Filter, Search, Calendar, TrendingUp } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import EvaluationReportView from '@/components/reports/EvaluationReportView';

const EvaluationReports = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    minScore: 0,
  });
  const [selectedCandidate, setSelectedCandidate] = useState<DetailedCandidate | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState<string | null>(null);

useEffect(() => {
    import('@/data/candidateEvaluationsMock').then(({ mockCandidates }: { mockCandidates: DetailedCandidate[] }) => {
      // Update local state if needed
    });
  }, []);

  const candidates = useMemo(() => {
    let filtered = mockCandidates as DetailedCandidate[];

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.minScore) {
      filtered = filtered.filter(c => (c.overallScore / 5) * 100 >= filters.minScore);
    }
    if (filters.search) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        c.position.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return filtered;
  }, [filters, mockCandidates]);

  const statusColors = {
    'advance': '#10b981',
    'advance-reserve': '#f59e0b',
    'reject': '#ef4444',
    'pending': '#6b7280',
  };

  const chartData = [
    { name: 'Advance', value: candidates.filter(c => c.status === 'advance').length, fill: '#10b981' },
    { name: 'Advance-Reserve', value: candidates.filter(c => c.status === 'advance-reserve').length, fill: '#f59e0b' },
    { name: 'Reject', value: candidates.filter(c => c.status === 'reject').length, fill: '#ef4444' },
    { name: 'Pending', value: candidates.filter(c => c.status === 'pending').length, fill: '#6b7280' },
  ];

  const handleBulkExport = () => {
    setLoadingExport(true);
    const headers = ['Name', 'Position', 'Score', 'Status'];
    const csvRows = [headers.join(',')];
    candidates.forEach(c => {
      csvRows.push([c.name, c.position, ((c.overallScore / 5) * 100).toFixed(0) + '%', c.status].join(','));
    });
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evaluation_reports.csv';
    a.click();
    setTimeout(() => setLoadingExport(false), 1000);
  };

  const handleDownloadPDF = async (candidate: DetailedCandidate) => {
    setLoadingPDF(candidate.id);
    // Render the report view to a hidden element for PDF
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    tempDiv.innerHTML = `<div id='pdf-report'><h2>${candidate.name} - ${candidate.position}</h2><p>Score: ${((candidate.overallScore / 5) * 100).toFixed(0)}%</p><p>Status: ${candidate.status}</p></div>`;
    const element = tempDiv.querySelector('#pdf-report');
    if (element) {
      const canvas = await html2canvas(element as HTMLElement, { scale: 2 });
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
    document.body.removeChild(tempDiv);
    setLoadingPDF(null);
  };

  const handleViewReport = (candidate: DetailedCandidate) => {
    setSelectedCandidate(candidate);
    setViewModal(true);
  };

  const handleGenerateReport = () => {
    setShowGenerateModal(true);
  };

  if (candidates.length === 0) {
    return <div className="p-12 text-center text-muted-foreground">
      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <h3 className="text-xl font-semibold mb-2">No evaluation reports</h3>
      <p className="mb-6">Reports will appear here after candidate assessments</p>
      <Button onClick={() => window.location.reload()}>Refresh</Button>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Reports</h1>
          <p className="text-muted-foreground">Manage candidate assessments and reports ({candidates.length})</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleBulkExport} variant="outline" disabled={loadingExport}>
            <Download className="mr-2 h-4 w-4" />
            {loadingExport ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Candidate name..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advance">Advance</SelectItem>
                <SelectItem value="advance-reserve">Advance-Reserve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Min Score</Label>
            <Slider
              value={[filters.minScore]}
              onValueChange={([v]) => setFilters({...filters, minScore: v})}
              max={100}
              step={5}
            />
            <div className="text-sm text-muted-foreground">{filters.minScore}%</div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports ({candidates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-all group">
                <Checkbox 
                  checked={selectedReports.includes(candidate.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedReports([...selectedReports, candidate.id]);
                    } else {
                      setSelectedReports(selectedReports.filter(id => id !== candidate.id));
                    }
                  }}
                  className="mr-4"
                />
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold">
                    {candidate.name.slice(0,2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{candidate.name} - {candidate.position}</p>
                    <p className="text-sm text-muted-foreground truncate">{candidate.interviewer} · {new Date(candidate.date).toLocaleDateString()}</p>
                  </div>
                  <Badge>{candidate.status}</Badge>
                  <div className="w-20 bg-muted rounded-full h-6 flex items-center justify-center font-mono text-sm">
                    {(candidate.overallScore / 5 * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewReport(candidate)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Full Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(candidate)} disabled={loadingPDF === candidate.id}>
                    <Download className="h-4 w-4 mr-1" />
                    {loadingPDF === candidate.id ? 'Downloading...' : 'Download PDF'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Modal */}
      {viewModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setViewModal(false)}>&times;</button>
            <EvaluationReportView 
              candidate={selectedCandidate} 
              onClose={() => setViewModal(false)}
            />
          </div>
        </div>
      )}

      {/* Generate Report Modal (placeholder) */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setShowGenerateModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Generate New Report</h2>
            <p className="mb-4">(Report generation form/modal integration goes here.)</p>
            <Button onClick={() => setShowGenerateModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationReports;

