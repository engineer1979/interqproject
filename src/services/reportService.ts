import { DetailedCandidate } from '@/data/candidateEvaluationsMock';
import { CandidateEvaluation } from '@/types/candidateEvaluation';
import { toast } from 'sonner';

export const generateCSV = (candidates: DetailedCandidate[], filename = `report_${new Date().toISOString().split('T')[0]}.csv`) => {
  const headers = ['ID', 'Name', 'Position', 'Email', 'Interviewer', 'Date', 'Overall Score', 'Status', 'Recommendation'];
  const rows = candidates.map(c => [
    c.id,
    `"${c.name}"`,
    `"${c.position}"`,
    c.email,
    c.interviewer,
    c.date,
    c.overallScore.toFixed(1),
    c.status,
    `"${c.recommendation}"`
  ]);

  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  toast.success('CSV exported successfully!');
};

export const mockGeneratePDF = (candidates: DetailedCandidate[]) => {
  toast.loading('Generating PDF...');
  setTimeout(() => {
    toast.success('PDF generated and downloaded!');
    // Mock - in production use jsPDF or backend
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO...'; // Mock PDF base64
    document.body.appendChild(iframe);
  }, 2000);
};

export const mockGenerateExcel = (candidates: DetailedCandidate[]) => {
  toast.loading('Generating Excel...');
  setTimeout(() => {
    toast.success('Excel generated and downloaded!');
    // Mock - use xlsx lib or backend in production
  }, 1500);
};

export const getDashboardStats = (candidates: DetailedCandidate[]) => {
  const stats = { approved: 0, hold: 0, rejected: 0, pending: 0, total: candidates.length };
  candidates.forEach(c => stats[c.status]++);
  return stats;
};

