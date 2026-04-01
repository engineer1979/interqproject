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

