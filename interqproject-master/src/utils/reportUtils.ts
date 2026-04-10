
// reportUtils.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CandidateEvaluation } from '@/types/candidateEvaluation';
import autoTable from 'jspdf-autotable';

export const generatePDF = async (report: CandidateEvaluation): Promise<Blob> => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Evaluation Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Candidate: ${report.candidate_name}`, 20, 35);
  doc.text(`Role: ${report.role}`, 20, 45);
  doc.text(`Overall Score: ${report.overallScore}%`, 20, 55);

  autoTable(doc, {
    startY: 65,
    head: [['Category', 'Score']],
    body: Object.entries(report.scores).map(([k, v]) => [k, `${v}%`]),
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Skill', 'Level', 'Score']],
    body: report.skills.map(s => [s.name, s.level, `${s.score}%`]),
  });

  doc.text('AI Recommendation:', 20, doc.lastAutoTable.finalY + 20);
  doc.text(report.aiRecommendation.decision, 20, doc.lastAutoTable.finalY + 30);
  doc.text(report.aiRecommendation.reasoning, 20, doc.lastAutoTable.finalY + 40);

  return new Promise<Blob>((resolve) => {
    const pdfOutput = doc.output('blob');
    resolve(pdfOutput);
  });
};

export const generateCSV = (reports: CandidateEvaluation[]): string => {
  const headers = ['id', 'candidate', 'role', 'score', 'status'];
  const csv = [
    headers.join(','),
    ...reports.map(r => [r.id, r.candidate_name, r.role, r.overallScore, r.status].join(','))
  ].join('\n');
  return csv;
};

export const downloadPDF = async (report: CandidateEvaluation, filename = 'evaluation-report.pdf') => {
  const blob = await generatePDF(report);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadCSV = (reports: CandidateEvaluation[], filename = 'reports.csv') => {
  const csv = generateCSV(reports);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

