// ATS Core Types and Data Models

export type UserRole = "admin" | "company" | "recruiter" | "jobseeker";

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  industry: string;
  size: string;
  location: string;
  description?: string;
  benefits?: string[];
  status: "active" | "inactive" | "pending" | "suspended";
  subscriptionPlan: "basic" | "professional" | "enterprise";
  createdAt: string;
}

export interface JobSeeker {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  resumeUrl?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
  portfolioLinks: string[];
  profileComplete: number;
  isVerified: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear?: string;
}

// Job Types
export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  department: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  employmentType: "full_time" | "part_time" | "contract" | "internship" | "freelance";
  workplaceType: "remote" | "on_site" | "hybrid";
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "executive";
  skills: string[];
  description: string;
  requirements: string[];
  openings: number;
  deadline?: string;
  status: "draft" | "open" | "closed" | "pending_approval";
  createdAt: string;
  publishedAt?: string;
  applicationsCount: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobSeekerId: string;
  jobSeekerName: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  stage: CandidateStage;
  appliedAt: string;
  source: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  notes?: string;
  rating?: number;
  tags: string[];
}

export type CandidateStage = 
  | "applied" 
  | "screening" 
  | "assessment_assigned" 
  | "assessment_completed"
  | "shortlisted"
  | "interview_scheduled"
  | "interview_completed"
  | "offer_sent"
  | "hired"
  | "rejected";

export type ApplicationStatus = "active" | "withdrawn" | "rejected" | "hired";

// Pipeline Types
export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  count: number;
}

export interface PipelineCard {
  id: string;
  application: JobApplication;
  candidate: JobSeeker;
  assignedTo?: string;
  lastActivity: string;
}

// Assessment Types
export interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number; // minutes
  passingScore: number;
  questionsCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  type: "mcq" | "true_false" | "short_answer" | "code" | "video";
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
}

export interface AssessmentAssignment {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  candidateId: string;
  candidateName: string;
  jobId?: string;
  jobTitle?: string;
  companyId: string;
  recruiterId?: string;
  status: "pending" | "in_progress" | "completed" | "expired";
  score?: number;
  totalPoints?: number;
  percentage?: number;
  passed?: boolean;
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  timeSpent?: number; // minutes
}

export interface AssessmentResult {
  id: string;
  assignmentId: string;
  candidateId: string;
  candidateName: string;
  assessmentId: string;
  assessmentTitle: string;
  jobId?: string;
  jobTitle?: string;
  companyId: string;
  recruiterId?: string;
  answers: AnswerRecord[];
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  completedAt: string;
  proctoringFlags: string[];
}

export interface AnswerRecord {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  pointsEarned: number;
}

// Interview Types
export interface Interview {
  id: string;
  title: string;
  candidateId: string;
  candidateName: string;
  jobId?: string;
  jobTitle?: string;
  companyId: string;
  companyName: string;
  recruiterId?: string;
  type: "video" | "phone" | "in_person";
  stage: "initial" | "technical" | "hr" | "final" | "panel";
  status: InterviewStatus;
  scheduledAt: string;
  duration: number; // minutes
  timezone: string;
  meetingLink?: string;
  interviewerIds: string[];
  interviewers: string[];
  instructions?: string;
  notes?: string;
  createdAt: string;
}

export type InterviewStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "rescheduled" | "no_show";

export interface InterviewFeedback {
  id: string;
  interviewId: string;
  interviewerId: string;
  interviewerName: string;
  overallRating: number; // 1-5
  technicalRating?: number;
  communicationRating?: number;
  problemSolvingRating?: number;
  cultureFitRating?: number;
  recommendation: "strong_yes" | "yes" | "neutral" | "no" | "strong_no";
  strengths: string;
  weaknesses: string;
  comments: string;
  submittedAt: string;
}

export interface InterviewScorecard {
  id: string;
  interviewId: string;
  criteria: ScorecardCriteria[];
  totalScore: number;
  maxScore: number;
}

export interface ScorecardCriteria {
  name: string;
  description: string;
  weight: number;
  score: number; // 1-5
  notes?: string;
}

// Offer Types
export interface Offer {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  salary: number;
  currency: string;
  startDate: string;
  expiryDate: string;
  status: OfferStatus;
  createdAt: string;
  sentAt?: string;
  respondedAt?: string;
  response?: "accepted" | "declined" | "expired";
  benefits?: string[];
  notes?: string;
}

export type OfferStatus = "draft" | "pending_approval" | "sent" | "accepted" | "declined" | "expired" | "withdrawn";

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 
  | "application_received"
  | "assessment_invite"
  | "assessment_completed"
  | "interview_scheduled"
  | "interview_reminder"
  | "interview_completed"
  | "offer_sent"
  | "offer_accepted"
  | "offer_declined"
  | "stage_changed"
  | "message_received"
  | "system";

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
}

export interface ConversationParticipant {
  userId: string;
  userName: string;
  userRole: UserRole;
  avatar?: string;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details?: string;
  entityId?: string;
  entityType?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Dashboard Stats Types
export interface AdminDashboardStats {
  totalJobSeekers: number;
  totalCompanies: number;
  totalRecruiters: number;
  totalActiveJobs: number;
  totalApplications: number;
  totalAssessmentsAssigned: number;
  totalInterviewsScheduled: number;
  totalOffersSent: number;
  totalHires: number;
  activeCompanies: number;
  pendingApprovals: number;
}

export interface CompanyDashboardStats {
  activeJobs: number;
  totalApplicants: number;
  assessmentsInProgress: number;
  interviewsScheduled: number;
  offersSent: number;
  hiresCompleted: number;
  pipelineByStage: Record<CandidateStage, number>;
  recentApplications: JobApplication[];
}

export interface RecruiterDashboardStats {
  assignedJobs: number;
  candidatesInPipeline: number;
  pendingAssessments: number;
  upcomingInterviews: number;
  feedbackPending: number;
  offersInProcess: number;
  hiresThisMonth: number;
}

export interface JobSeekerDashboardStats {
  profileViews: number;
  applicationsSent: number;
  savedJobs: number;
  interviewsScheduled: number;
  assessmentsPending: number;
  profileComplete: number;
  recentActivity: ActivityLog[];
}
