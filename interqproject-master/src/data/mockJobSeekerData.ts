
export interface InterviewSession {
  id: string;
  title: string;
  job_role: string;
  status: 'scheduled' | 'completed';
  created_at: string;
  completed_at?: string;
  final_score?: number;
}

export interface AvailableInterview {
  id: string;
  title: string;
  job_role: string;
  duration_minutes: number;
}

export const mockInterviewSessions: InterviewSession[] = [
  {
    id: "1",
    title: "Technical Interview - Frontend",
    job_role: "Frontend Engineer",
    status: "scheduled",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "HR Screening",
    job_role: "Product Manager",
    status: "completed",
    created_at: "2024-01-12T14:30:00Z",
    completed_at: "2024-01-12T15:15:00Z",
    final_score: 85,
  },
  {
    id: "3",
    title: "Final Round",
    job_role: "Senior Developer",
    status: "scheduled",
    created_at: "2024-01-18T09:00:00Z",
  },
  {
    id: "4",
    title: "Technical Assessment Review",
    job_role: "Backend Engineer",
    status: "completed",
    created_at: "2024-01-10T16:00:00Z",
    completed_at: "2024-01-10T17:00:00Z",
    final_score: 92,
  }
];

export const mockAvailableInterviews: AvailableInterview[] = [
  {
    id: "avail1",
    title: "React Developer Interview",
    job_role: "Frontend Developer",
    duration_minutes: 60,
  },
  {
    id: "avail2",
    title: "Node.js Backend",
    job_role: "Backend Developer",
    duration_minutes: 45,
  },
  {
    id: "avail3",
    title: "Full Stack Assessment",
    job_role: "Full Stack Engineer",
    duration_minutes: 90,
  },
  {
    id: "avail4",
    title: "DevOps Engineer",
    job_role: "DevOps Engineer",
    duration_minutes: 75,
  },
];

