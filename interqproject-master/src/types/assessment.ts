
export interface Assessment {
  id: string;
  title: string;
  domain?: string | null;
  description?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | string;
  duration_minutes?: number;
  passing_score?: number;
  total_questions?: number;
  tags?: string[];
  is_active?: boolean;
  created_at: string;
  created_by?: string;
}

export interface AssessmentWithQuestions extends Assessment {
  questions: {
    count: number;
  } | null;
}


export interface FilterState {
  search: string;
  category: string;
  difficulty: string;
}

export type Role = 'jobseeker' | 'recruiter' | 'company' | 'admin';

export interface AssessmentLibraryProps {
  role: Role;
  viewMode?: 'library' | 'results' | 'assigned';
  className?: string;
}

