export interface CandidateEvaluation {
  id: string;
  candidate_id: string;
  candidate_name: string;
  role: string;
  overallScore: number;
status: 'draft' | 'final' | 'archived' | 'Complete' | 'Partial' | 'Pending';
  assessment_title: string;
  scores: Record<string, number>;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    score: number;
  }>;
  interviews: Array<{
    round: string;
    interviewer: string;
    score: number;
    notes: string;
    date: string;
    flags?: string[];
  }>;
  behavioral: {
    workStyle: string;
    traits: string[];
    communication: string;
  };
  ranking: {
    rank: number;
    totalApplicants: number;
    percentile: number;
  };
  risks: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  aiRecommendation: {
    decision: 'HIRE' | 'HOLD' | 'REJECT';
    confidence: number;
    nextStep: string;
    reasoning: string;
  };
  recruiterNotes?: string;
  adminTags?: string[];
  auditLog: Array<{
    action: string;
    by: string;
    timestamp: string;
  }>;
  created_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  interviewer: string;
  date: string;
  created_at: string;
  overallScore: number;
  status: 'advance' | 'advance-reserve' | 'reject';
  recommendation?: string;
}

export interface EvaluationItem {
  id: string;
  candidate_id: string;
  category: string;
  rating: number;
  comments?: string;
  created_at: string;
}

export interface FinalDecision {
  id: string;
  candidate_id: string;
  education: boolean;
  recommendation: 'Advance' | 'Advance with Reservations' | 'Do Not Advance';
  overallComments?: string;
  created_at: string;
}

export const evaluationCategories = [
  'Prior Work Experience',
  'Technical Qualifications',
  'Teambuilding / Interpersonal Skills',
  'Initiative',
  'Time Management',
  'Customer Service',
] as const;

export type CategoryType = typeof evaluationCategories[number];

