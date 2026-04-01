// Mock data for offline candidate evaluation module
export const mockCandidates = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Senior Frontend Developer',
    interviewer: 'Jane Smith',
    date: '2025-01-15',
    overallScore: 4.2,
    status: 'advance' as const,
    recommendation: 'Advance'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    position: 'DevOps Engineer',
    interviewer: 'Bob Wilson',
    date: '2025-01-14',
    overallScore: 3.5,
    status: 'advance-reserve' as const,
    recommendation: 'Advance with Reservations'
  },
  {
    id: '3',
    name: 'Sarah Lee',
    position: 'Data Analyst',
    interviewer: 'Alice Brown',
    date: '2025-01-13',
    overallScore: 2.8,
    status: 'reject' as const,
    recommendation: 'Do Not Advance'
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
  },
  // Add more for full dataset...
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

