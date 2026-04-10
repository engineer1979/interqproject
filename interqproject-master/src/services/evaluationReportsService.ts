import { supabase } from '@/integrations/supabase/client';

export interface EvaluationFeature {
  id?: string;
  name: string;
  score: number;
  maxScore: number;
  comments: string;
  category: 'technical' | 'behavioral' | 'interview' | 'soft_skills';
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  currentTitle?: string;
  location?: string;
  avatarUrl?: string;
}

export interface EvaluationReport {
  id: string;
  candidateId: string;
  jobId?: string;
  interviewerId?: string;
  positionApplied: string;
  interviewerName: string;
  interviewDate: string;
  overallScore: number;
  overallScoreMax: number;
  status: 'pending' | 'advance' | 'advance_reserve' | 'reject';
  
  technicalScore: number;
  technicalMax: number;
  behavioralScore: number;
  behavioralMax: number;
  communicationScore: number;
  communicationMax: number;
  problemSolvingScore: number;
  problemSolvingMax: number;
  culturalFitScore: number;
  culturalFitMax: number;
  experienceScore: number;
  experienceMax: number;
  
  features: EvaluationFeature[];
  recommendation?: string;
  finalComments?: string;
  createdAt: string;
  updatedAt: string;
  
  candidate?: CandidateProfile;
  job?: { title: string; department?: string };
}

export interface CreateReportData {
  candidateId: string;
  jobId?: string;
  positionApplied: string;
  interviewerName: string;
  interviewDate: string;
  technicalScore: number;
  behavioralScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  culturalFitScore?: number;
  experienceScore?: number;
  features?: EvaluationFeature[];
  recommendation?: string;
  finalComments?: string;
}

export interface UpdateReportData {
  technicalScore?: number;
  behavioralScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  culturalFitScore?: number;
  experienceScore?: number;
  status?: 'pending' | 'advance' | 'advance_reserve' | 'reject';
  recommendation?: string;
  finalComments?: string;
  features?: EvaluationFeature[];
}

const SCORE_WEIGHTS = {
  technical: 0.4,
  behavioral: 0.2,
  communication: 0.2,
  problemSolving: 0.2
};

export function calculateOverallScore(
  technical: number,
  behavioral: number,
  communication: number,
  problemSolving: number,
  maxScore: number = 5
): number {
  const technicalNorm = (technical / maxScore) * 100;
  const behavioralNorm = (behavioral / maxScore) * 100;
  const communicationNorm = (communication / maxScore) * 100;
  const problemNorm = (problemSolving / maxScore) * 100;
  
  return Number((
    (technicalNorm * SCORE_WEIGHTS.technical) +
    (behavioralNorm * SCORE_WEIGHTS.behavioral) +
    (communicationNorm * SCORE_WEIGHTS.communication) +
    (problemNorm * SCORE_WEIGHTS.problemSolving)
  ).toFixed(2));
}

export function determineStatus(score: number): 'pending' | 'advance' | 'advance_reserve' | 'reject' {
  if (score >= 80) return 'advance';
  if (score >= 60) return 'advance_reserve';
  return 'reject';
}

export async function fetchEvaluationReports(filters?: {
  status?: string;
  search?: string;
  minScore?: number;
  sortBy?: 'score' | 'date' | 'name';
  sortOrder?: 'asc' | 'desc';
}): Promise<EvaluationReport[]> {
  try {
    let query = supabase
      .from('evaluation_reports_with_details')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    let reports = (data || []).map(transformReportFromDb);

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      reports = reports.filter(r => 
        r.candidate?.fullName.toLowerCase().includes(searchLower) ||
        r.positionApplied.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.minScore) {
      reports = reports.filter(r => r.overallScore >= filters.minScore!);
    }

    if (filters?.sortBy) {
      reports.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case 'score':
            comparison = a.overallScore - b.overallScore;
            break;
          case 'date':
            comparison = new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime();
            break;
          case 'name':
            comparison = (a.candidate?.fullName || '').localeCompare(b.candidate?.fullName || '');
            break;
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return reports;
  } catch (error) {
    console.error('Error fetching evaluation reports:', error);
    throw error;
  }
}

export async function fetchReportById(id: string): Promise<EvaluationReport | null> {
  try {
    const { data, error } = await supabase
      .from('evaluation_reports_with_details')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return transformReportFromDb(data);
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    throw error;
  }
}

export async function createEvaluationReport(reportData: CreateReportData): Promise<EvaluationReport> {
  try {
    const overallScore = calculateOverallScore(
      reportData.technicalScore,
      reportData.behavioralScore,
      reportData.communicationScore,
      reportData.problemSolvingScore
    );

    const status = determineStatus(overallScore);

    const { data: report, error: reportError } = await supabase
      .from('evaluation_reports')
      .insert({
        candidate_id: reportData.candidateId,
        job_id: reportData.jobId,
        position_applied: reportData.positionApplied,
        interviewer_name: reportData.interviewerName,
        interview_date: reportData.interviewDate,
        technical_score: reportData.technicalScore,
        technical_max: 5,
        behavioral_score: reportData.behavioralScore,
        behavioral_max: 5,
        communication_score: reportData.communicationScore,
        communication_max: 5,
        problem_solving_score: reportData.problemSolvingScore,
        problem_solving_max: 5,
        cultural_fit_score: reportData.culturalFitScore || 0,
        cultural_fit_max: 5,
        experience_score: reportData.experienceScore || 0,
        experience_max: 5,
        overall_score: overallScore,
        overall_score_max: 100,
        status,
        recommendation: reportData.recommendation,
        final_comments: reportData.finalComments,
        features: reportData.features || []
      })
      .select()
      .single();

    if (reportError) throw reportError;

    await logActivity(report.id, null, 'created', null, `Report created for ${reportData.positionApplied}`);

    return transformReportFromDb(report);
  } catch (error) {
    console.error('Error creating evaluation report:', error);
    throw error;
  }
}

export async function updateEvaluationReport(id: string, updateData: UpdateReportData): Promise<EvaluationReport> {
  try {
    const existingReport = await fetchReportById(id);
    if (!existingReport) throw new Error('Report not found');

    const technicalScore = updateData.technicalScore ?? existingReport.technicalScore;
    const behavioralScore = updateData.behavioralScore ?? existingReport.behavioralScore;
    const communicationScore = updateData.communicationScore ?? existingReport.communicationScore;
    const problemSolvingScore = updateData.problemSolvingScore ?? existingReport.problemSolvingScore;

    const overallScore = calculateOverallScore(
      technicalScore,
      behavioralScore,
      communicationScore,
      problemSolvingScore
    );

    const status = updateData.status ?? determineStatus(overallScore);

    const { data: updatedReport, error: updateError } = await supabase
      .from('evaluation_reports')
      .update({
        technical_score: technicalScore,
        behavioral_score: behavioralScore,
        communication_score: communicationScore,
        problem_solving_score: problemSolvingScore,
        cultural_fit_score: updateData.culturalFitScore ?? existingReport.culturalFitScore,
        experience_score: updateData.experienceScore ?? existingReport.experienceScore,
        overall_score: overallScore,
        status,
        recommendation: updateData.recommendation,
        final_comments: updateData.finalComments,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    await logActivity(id, null, 'updated', existingReport.status, status);

    return transformReportFromDb(updatedReport);
  } catch (error) {
    console.error('Error updating evaluation report:', error);
    throw error;
  }
}

export async function updateReportStatus(id: string, newStatus: 'pending' | 'advance' | 'advance_reserve' | 'reject'): Promise<EvaluationReport> {
  try {
    const existingReport = await fetchReportById(id);
    if (!existingReport) throw new Error('Report not found');

    const { data: updatedReport, error: updateError } = await supabase
      .from('evaluation_reports')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    await logActivity(id, null, 'status_changed', existingReport.status, newStatus);

    return transformReportFromDb(updatedReport);
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}

export async function deleteEvaluationReport(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('evaluation_reports')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    await logActivity(id, null, 'deleted', null, 'Report deleted');
  } catch (error) {
    console.error('Error deleting evaluation report:', error);
    throw error;
  }
}

export async function exportReportsToCSV(reports: EvaluationReport[]): Promise<string> {
  const headers = [
    'Candidate Name',
    'Email',
    'Position',
    'Interview Date',
    'Technical Score',
    'Behavioral Score',
    'Communication Score',
    'Problem Solving',
    'Cultural Fit',
    'Experience',
    'Overall Score',
    'Status',
    'Recommendation'
  ];

  const rows = reports.map(r => [
    r.candidate?.fullName || '',
    r.candidate?.email || '',
    r.positionApplied,
    r.interviewDate,
    `${r.technicalScore}/${r.technicalMax}`,
    `${r.behavioralScore}/${r.behavioralMax}`,
    `${r.communicationScore}/${r.communicationMax}`,
    `${r.problemSolvingScore}/${r.problemSolvingMax}`,
    `${r.culturalFitScore}/${r.culturalFitMax}`,
    `${r.experienceScore}/${r.experienceMax}`,
    `${r.overallScore}%`,
    r.status,
    r.recommendation || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
}

export async function logActivity(
  reportId: string,
  userId: string | null,
  action: string,
  oldValue: string | null,
  newValue: string | null
): Promise<void> {
  try {
    await supabase
      .from('evaluation_activity_logs')
      .insert({
        report_id: reportId,
        user_id: userId,
        action,
        old_value: oldValue,
        new_value: newValue
      });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

function transformReportFromDb(data: any): EvaluationReport {
  return {
    id: data.id,
    candidateId: data.candidate_id,
    jobId: data.job_id,
    interviewerId: data.interviewer_id,
    positionApplied: data.position_applied,
    interviewerName: data.interviewer_name,
    interviewDate: data.interview_date,
    overallScore: Number(data.overall_score),
    overallScoreMax: Number(data.overall_score_max),
    status: data.status,
    technicalScore: Number(data.technical_score),
    technicalMax: Number(data.technical_max),
    behavioralScore: Number(data.behavioral_score),
    behavioralMax: Number(data.behavioral_max),
    communicationScore: Number(data.communication_score),
    communicationMax: Number(data.communication_max),
    problemSolvingScore: Number(data.problem_solving_score),
    problemSolvingMax: Number(data.problem_solving_max),
    culturalFitScore: Number(data.cultural_fit_score),
    culturalFitMax: Number(data.cultural_fit_max),
    experienceScore: Number(data.experience_score),
    experienceMax: Number(data.experience_max),
    features: data.features_list || [],
    recommendation: data.recommendation,
    finalComments: data.final_comments,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    candidate: data.full_name ? {
      id: data.candidate_id,
      fullName: data.full_name,
      email: data.email,
      avatarUrl: data.avatar_url
    } : undefined,
    job: data.job_title ? {
      title: data.job_title,
      department: data.job_department
    } : undefined
  };
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generatePDFData(report: EvaluationReport): any {
  return {
    candidate: report.candidate,
    position: report.positionApplied,
    interviewDate: report.interviewDate,
    interviewer: report.interviewerName,
    scores: {
      overall: report.overallScore,
      technical: { score: report.technicalScore, max: report.technicalMax },
      behavioral: { score: report.behavioralScore, max: report.behavioralMax },
      communication: { score: report.communicationScore, max: report.communicationMax },
      problemSolving: { score: report.problemSolvingScore, max: report.problemSolvingMax },
      culturalFit: { score: report.culturalFitScore, max: report.culturalFitMax },
      experience: { score: report.experienceScore, max: report.experienceMax }
    },
    features: report.features,
    status: report.status,
    recommendation: report.recommendation,
    finalComments: report.finalComments
  };
}