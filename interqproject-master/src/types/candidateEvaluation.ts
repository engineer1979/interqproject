
export interface CandidateEvaluation {
  id: string;
  candidate_name: string;
  role: string;
  overallScore: number;
  status: string;
  scores: Record<string, number>;
  skills: Array<{
    name: string;
    level: string;
    score: number;
  }>;
  aiRecommendation: {
    decision: string;
    reasoning: string;
  };
}

