// Mock data for offline candidate evaluation module - Enhanced with 10 assessment/interview features

export interface CandidateEvaluationFeature {
  name: string;
  score: number;
  maxScore: number;
  comments: string;
  category: 'technical' | 'behavioral' | 'interview';
}

export interface DetailedCandidate {
  id: string;
  name: string;
  position: string;
  email: string;
  interviewer: string;
  date: string;
  overallScore: number;
  status: 'advance' | 'advance-reserve' | 'reject' | 'pending';
  recommendation: string;
  features: CandidateEvaluationFeature[];
}

export const mockCandidates: DetailedCandidate[] = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Senior Frontend Developer',
    email: 'john.doe@tech.com',
    interviewer: 'Jane Smith',
    date: '2025-01-15',
    overallScore: 4.2,
    status: 'advance',
    recommendation: 'Advance - Excellent technical + cultural fit',
    features: [
      { name: 'Overall Score', score: 84, maxScore: 100, comments: 'Top 10%', category: 'interview' },
      { name: 'Technical Skills', score: 5, maxScore: 5, comments: 'React/Next.js expert', category: 'technical' },
      { name: 'Behavioral Fit', score: 4, maxScore: 5, comments: 'Strong ownership', category: 'behavioral' },
      { name: 'Communication Skills', score: 4, maxScore: 5, comments: 'Clear articulate', category: 'interview' },
      { name: 'Problem Solving', score: 5, maxScore: 5, comments: 'Optimized complex algorithms', category: 'technical' },
      { name: 'Cultural Fit', score: 4, maxScore: 5, comments: 'Team player', category: 'behavioral' },
      { name: 'Experience Match', score: 4, maxScore: 5, comments: '8+ years production', category: 'technical' },
      { name: 'Growth Potential', score: 5, maxScore: 5, comments: 'Lead-ready', category: 'behavioral' },
      { name: 'Team Collaboration', score: 4, maxScore: 5, comments: 'Mentored juniors', category: 'behavioral' },
      { name: 'Recommendation', score: 5, maxScore: 5, comments: 'Hire immediately', category: 'interview' }
    ]
  },
  {
    id: '2',
    name: 'Mike Johnson',
    position: 'DevOps Engineer',
    email: 'mike.johnson@cloud.com',
    interviewer: 'Bob Wilson',
    date: '2025-01-14',
    overallScore: 3.8,
    status: 'advance-reserve',
    recommendation: 'Advance with reservations - Strong tech, monitor ramp-up',
    features: [
      { name: 'Overall Score', score: 76, maxScore: 100, comments: 'Solid mid-tier', category: 'interview' },
      { name: 'Technical Skills', score: 5, maxScore: 5, comments: 'Kubernetes/Docker expert', category: 'technical' },
      { name: 'Behavioral Fit', score: 3, maxScore: 5, comments: 'Needs coaching', category: 'behavioral' },
      { name: 'Communication Skills', score: 3, maxScore: 5, comments: 'Technical focus', category: 'interview' },
      { name: 'Problem Solving', score: 4, maxScore: 5, comments: 'Infrastructure automation', category: 'technical' },
      { name: 'Cultural Fit', score: 3, maxScore: 5, comments: 'Individual contributor', category: 'behavioral' },
      { name: 'Experience Match', score: 4, maxScore: 5, comments: 'Cloud infra specialist', category: 'technical' },
      { name: 'Growth Potential', score: 4, maxScore: 5, comments: 'Good trajectory', category: 'behavioral' },
      { name: 'Team Collaboration', score: 3, maxScore: 5, comments: 'Process oriented', category: 'behavioral' },
      { name: 'Recommendation', score: 4, maxScore: 5, comments: 'Advance with reservations', category: 'interview' }
    ]
  },
  {
    id: '3',
    name: 'Sarah Lee',
    position: 'Data Analyst',
    email: 'sarah.lee@example.com',
    interviewer: 'Alice Brown',
    date: '2025-01-13',
    overallScore: 2.8,
    status: 'reject',
    recommendation: 'Do Not Advance - Limited analytical experience',
    features: [
      { name: 'Overall Score', score: 56, maxScore: 100, comments: 'Below benchmark', category: 'interview' },
      { name: 'Technical Skills', score: 3, maxScore: 5, comments: 'Basic SQL/Python knowledge', category: 'technical' },
      { name: 'Behavioral Fit', score: 2, maxScore: 5, comments: 'Limited examples', category: 'behavioral' },
      { name: 'Communication Skills', score: 3, maxScore: 5, comments: 'Clear but not engaging', category: 'interview' },
      { name: 'Problem Solving', score: 2, maxScore: 5, comments: 'Struggled with case study', category: 'technical' },
      { name: 'Cultural Fit', score: 4, maxScore: 5, comments: 'Good values alignment', category: 'behavioral' },
      { name: 'Experience Match', score: 2, maxScore: 5, comments: 'Junior experience for mid-level role', category: 'technical' },
      { name: 'Growth Potential', score: 3, maxScore: 5, comments: 'Eager to learn', category: 'behavioral' },
      { name: 'Team Collaboration', score: 3, maxScore: 5, comments: 'Individual contributor focus', category: 'behavioral' },
      { name: 'Recommendation', score: 2, maxScore: 5, comments: 'Do not advance', category: 'interview' }
    ]
  },
  {
    id: '20',
    name: 'David Kim',
    position: 'Cloud Architect',
    email: 'david.kim@tech.com',
    interviewer: 'Michael Chen',
    date: '2025-01-20',
    overallScore: 4.7,
    status: 'advance',
    recommendation: 'Strong advance - Hire immediately',
    features: [
      { name: 'Overall Score', score: 94, maxScore: 100, comments: 'Exceptional', category: 'interview' },
      { name: 'Technical Skills', score: 5, maxScore: 5, comments: 'AWS/GCP/Azure expert', category: 'technical' },
      { name: 'Behavioral Fit', score: 5, maxScore: 5, comments: 'Perfect match', category: 'behavioral' },
      { name: 'Communication Skills', score: 4, maxScore: 5, comments: 'Excellent presenter', category: 'interview' },
      { name: 'Problem Solving', score: 5, maxScore: 5, comments: 'Complex architecture scenarios mastered', category: 'technical' },
      { name: 'Cultural Fit', score: 5, maxScore: 5, comments: 'Ideal for team', category: 'behavioral' },
      { name: 'Experience Match', score: 5, maxScore: 5, comments: '10+ years enterprise cloud', category: 'technical' },
      { name: 'Growth Potential', score: 4, maxScore: 5, comments: 'Architect to CTO trajectory', category: 'behavioral' },
      { name: 'Team Collaboration', score: 5, maxScore: 5, comments: 'Led cross-functional teams', category: 'behavioral' },
      { name: 'Recommendation', score: 5, maxScore: 5, comments: 'Hire immediately', category: 'interview' }
    ]
  }
];

export const mockEvaluations = [
  {
    id: 'e1',
    candidate_id: '1',
    category: 'Prior Work Experience',
    rating: 5,
    comments: '10+ years React/Vue experience at Fortune 500 companies'
  },
  {
    id: 'e2',
    candidate_id: '1',
    category: 'Technical Qualifications',
    rating: 4,
    comments: 'Strong TypeScript, knows Next.js and Tailwind'
  }
];

export const mockFinalDecisions = [
  {
    id: 'fd1',
    candidate_id: '1',
    education: true,
    recommendation: 'Advance',
    overall_comments: 'Excellent candidate. Strong technical skills and great cultural fit.'
  }
];
