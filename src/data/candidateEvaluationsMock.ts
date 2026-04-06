// Mock data for offline candidate evaluation module - Enhanced with 20+ candidates for dashboard stats

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
  status: 'approved' | 'hold' | 'rejected' | 'pending';
  recommendation: string;
  features: CandidateEvaluationFeature[];
}

function generateMockCandidates(): DetailedCandidate[] {
  const positions = [
    'Senior Frontend Developer',
    'DevOps Engineer',
    'Data Analyst',
    'Cloud Architect',
    'Backend Engineer',
    'Product Manager',
    'QA Engineer',
    'Full Stack Developer',
    'Security Engineer',
    'Mobile Developer'
  ];

  const names = [
    'John Doe', 'Mike Johnson', 'Sarah Lee', 'David Kim', 'Lisa Chen',
    'Robert Garcia', 'Emily Davis', 'James Wilson', 'Maria Rodriguez', 'Daniel Brown',
    'Jennifer Taylor', 'Christopher Martinez', 'Amanda Anderson', 'Matthew Thomas', 'Patricia Jackson',
    'Charles White', 'Elizabeth Harris', 'William Martin', 'Samantha Thompson', 'Anthony Garcia',
    'Michelle Lopez', 'Kevin Lee', 'Nicole Walker', 'Brian Hall'
  ];

  const statuses = ['approved', 'hold', 'rejected', 'pending'];
  const statusColors = { approved: 'green', hold: 'yellow', rejected: 'red', pending: 'gray' };

  const candidates: DetailedCandidate[] = [];

  for (let i = 1; i <= 25; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)] as DetailedCandidate['status'];
    const overallScore = status === 'approved' ? 4.0 + Math.random() : 
                        status === 'hold' ? 3.0 + Math.random() : 
                        status === 'rejected' ? 2.0 + Math.random() : 3.5;
    
    candidates.push({
      id: i.toString(),
      name: names[(i-1) % names.length],
      position: positions[Math.floor((i-1) * 7 % positions.length)],
      email: `${names[(i-1) % names.length].toLowerCase().replace(' ', '.')}@tech.com`,
      interviewer: ['Jane Smith', 'Bob Wilson', 'Alice Brown', 'Michael Chen'][Math.floor(i / 6)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      overallScore: Number(overallScore.toFixed(1)),
      status,
      recommendation: `${status.charAt(0).toUpperCase() + status.slice(1)} - ${status === 'approved' ? 'Excellent fit' : status === 'hold' ? 'Review further' : status === 'rejected' ? 'Does not meet criteria' : 'Awaiting feedback'}`,
      features: Array.from({length: 10}, (_, idx) => ({
        name: ['Overall Score', 'Technical Skills', 'Behavioral Fit', 'Communication', 'Problem Solving', 'Cultural Fit', 'Experience Match', 'Growth Potential', 'Team Collaboration', 'Recommendation'][idx],
        score: Math.floor(Math.random() * 3) + 2 + (status === 'approved' ? 1 : 0),
        maxScore: 5,
        comments: 'Mock comment for feature',
category: ['technical', 'behavioral', 'interview'][Math.floor(Math.random() * 3)] as 'technical' | 'behavioral' | 'interview'
      }))
    });
  }

  return candidates;
}

// Stats helper for dashboard
export const getStatsFromCandidates = (candidates: DetailedCandidate[]) => {
  const stats = { approved: 0, hold: 0, rejected: 0, pending: 0 };
  candidates.forEach((c) => stats[c.status]++);
  return stats;
};

export const mockCandidates = generateMockCandidates(); // Legacy export

// Legacy exports kept for compatibility
// export const mockEvaluations = [...];
// export const mockFinalDecisions = [...];

