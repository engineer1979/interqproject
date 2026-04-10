import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { Suspense, lazy } from "react";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { JobSeekerDashboardProvider } from "@/contexts/JobSeekerDashboardContext";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import UnifiedLayout from "@/components/layouts/UnifiedLayout";
import UnifiedDashboard from "@/pages/UnifiedDashboard";
import OffersManagement from "@/pages/admin/OffersManagement";

// Unified feature pages
const JobsPage = lazy(() => import("./pages/unified/JobsPage"));
const CandidatesPage = lazy(() => import("./pages/unified/CandidatesPage"));
const InterviewsPage = lazy(() => import("./pages/unified/InterviewsPage"));
const MessagingPage = lazy(() => import("./pages/unified/MessagingPage"));
const ReportsPage = lazy(() => import("./pages/unified/ReportsPage"));
const BillingPage = lazy(() => import("./pages/unified/BillingPage"));
const TeamPage = lazy(() => import("./pages/unified/TeamPage"));
const ProfilePage = lazy(() => import("./pages/unified/ProfilePage"));
const SavedJobsPage = lazy(() => import("./pages/unified/SavedJobsPage"));
const TalentPoolPage = lazy(() => import("./pages/unified/TalentPoolPage"));
const PipelinePage = lazy(() => import("./pages/unified/PipelinePage"));
const CompaniesPage = lazy(() => import("./pages/unified/CompaniesPage"));
const UsersPage = lazy(() => import("./pages/unified/UsersPage"));
const SecurityPage = lazy(() => import("./pages/unified/SecurityPage"));
const IntegrationsPageUnified = lazy(() => import("./pages/unified/IntegrationsPageUnified"));
const AuditLogsPage = lazy(() => import("./pages/unified/AuditLogsPage"));
const SettingsPage = lazy(() => import("./pages/unified/SettingsPage"));

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Product = lazy(() => import("./pages/Product"));
const Features = lazy(() => import("./pages/Features"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Assessments = lazy(() => import("./pages/Assessments"));
const TakeAssessment = lazy(() => import("./pages/TakeAssessment"));
const CodingTests = lazy(() => import("./pages/CodingTests"));
const TakeCodingTest = lazy(() => import("./pages/TakeCodingTest"));
const LiveInterviews = lazy(() => import("./pages/LiveInterviews"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const PressKit = lazy(() => import("./pages/PressKit"));
const Partners = lazy(() => import("./pages/Partners"));
const Contact = lazy(() => import("./pages/Contact"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Blog = lazy(() => import("./pages/Blog"));
const Documentation = lazy(() => import("./pages/Documentation"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const AdminJobs = lazy(() => import("./pages/admin/Jobs"));
const ApplyPage = lazy(() => import("./pages/candidate/Apply"));
const Careers = lazy(() => import("./pages/Careers"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminResults = lazy(() => import("./pages/admin/AdminResults"));
const AdminResultDetail = lazy(() => import("./pages/admin/AdminResultDetail"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AssessmentPromptGenerator = lazy(() => import("./pages/admin/AssessmentPromptGenerator"));
const CreateAssessment = lazy(() => import("./pages/CreateAssessment"));
const AssessmentWorkflowPage = lazy(() => import("./pages/AssessmentWorkflowPage"));
const ATSScreening = lazy(() => import("./pages/admin/ATSScreening"));
const CollaborativeScoring = lazy(() => import("./pages/admin/CollaborativeScoring"));
const PipelineDashboard = lazy(() => import("./pages/admin/PipelineDashboard"));
const TestManagement = lazy(() => import("./pages/admin/TestManagement"));
const QuestionBank = lazy(() => import("./pages/admin/QuestionBank"));
const InterviewManagement = lazy(() => import("./pages/admin/InterviewManagement"));
const CompanyManagement = lazy(() => import("./pages/admin/CompanyManagement"));
const JobSeekerManagement = lazy(() => import("./pages/admin/JobSeekerManagement"));
const CertificateManagement = lazy(() => import("./pages/admin/CertificateManagement"));
const ActivityLogs = lazy(() => import("./pages/admin/ActivityLogs"));
const RoleManagement = lazy(() => import("./pages/admin/RoleManagement"));
const BookSession = lazy(() => import("./pages/BookSession"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EvaluationReport = lazy(() => import("./pages/EvaluationReport"));
const ProfessionalEvaluationReport = lazy(() => import("./pages/ProfessionalEvaluationReport"));
const Guidelines = lazy(() => import("./pages/Guidelines"));
const ExpertPortal = lazy(() => import("./pages/ExpertPortal"));
const CandidatePortal = lazy(() => import("./pages/CandidatePortal"));
const CompanySignup = lazy(() => import("./pages/company/CompanySignup"));
const CompanyLayout = lazy(() => import("./components/company/CompanyLayout").then(m => ({ default: m.CompanyLayout })));
const CompanyDashboard = lazy(() => import("./pages/company/CompanyDashboard"));
const CompanyJobs = lazy(() => import("./pages/company/CompanyJobs"));
const CompanyCandidates = lazy(() => import("./pages/company/CompanyCandidates"));
const CompanyTests = lazy(() => import("./pages/company/CompanyTests"));
const CompanyInterviews = lazy(() => import("./pages/company/CompanyInterviews"));
const CompanyResults = lazy(() => import("./pages/company/CompanyResults"));
const CompanyNotifications = lazy(() => import("./pages/company/CompanyNotifications"));
const CompanyAuditLogs = lazy(() => import("./pages/company/CompanyAuditLogs"));
const CompanySettings = lazy(() => import("./pages/company/CompanySettings"));
import { RecruiterLayout } from "./components/recruiter/RecruiterLayout";
import UserTeamsDashboard from "./components/admin/UserTeamsDashboard";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: string}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-red-500">{this.state.error}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
const RecruiterDashboard = lazy(() => import("./pages/recruiter/RecruiterDashboard"));
const RecruiterPipeline = lazy(() => import("./pages/recruiter/Pipeline"));
const RecruiterAssessments = lazy(() => import("./pages/recruiter/Assessments"));
const RecruiterInterviews = lazy(() => import("./pages/recruiter/Interviews"));
const EvaluationReports = lazy(() => import("./pages/recruiter/DynamicEvaluationReports"));
const JobSeekerLayout = lazy(() => import("./components/jobseeker/JobSeekerLayout").then(m => ({ default: m.JobSeekerLayout })));
const JobSeekerDashboard = lazy(() => import("./pages/jobseeker/JobSeekerDashboard"));
const JobSeekerAssessments = lazy(() => import("./pages/jobseeker/JobSeekerAssessments"));
const JobSeekerInterviews = lazy(() => import("./pages/jobseeker/Interviews"));
const InterviewSession = lazy(() => import("./pages/jobseeker/InterviewSession"));
const JobSeekerApplications = lazy(() => import("./pages/jobseeker/Applications"));
const JobSeekerResults = lazy(() => import("./pages/jobseeker/JobSeekerResults"));
const JobSeekerCertificates = lazy(() => import("./pages/jobseeker/JobSeekerCertificates"));
const JobSeekerProfile = lazy(() => import("./pages/jobseeker/JobSeekerProfile"));
const JobSeekerPrivacy = lazy(() => import("./pages/jobseeker/JobSeekerPrivacy"));
const JobSeekerGuidelines = lazy(() => import("./pages/jobseeker/JobSeekerGuidelines"));
const JobSeekerNotifications = lazy(() => import("./pages/jobseeker/Notifications"));
const JobSeekerSettings = lazy(() => import("./pages/jobseeker/JobSeekerSettings"));
const CodingChallengesPage = lazy(() => import("./pages/jobseeker/CodingChallenges"));
const LegalPage = ({ title, content }: { title: string; content: string }) => (
  <div className="min-h-screen bg-background">
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-muted-foreground leading-relaxed text-lg">{content}</p>
      </div>
      <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        Last updated: March 2026 · Questions? Contact <a href="mailto:legal@interq.com" className="text-blue-600 hover:underline">legal@interq.com</a>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SimpleAuthProvider>
          <JobSeekerDashboardProvider>
            <Suspense fallback={<div className="p-8 text-center bg-slate-50 min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-slate-400">Loading InterQ Hub...</p>
              </div>
            </div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/company-signup" element={<CompanySignup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/get-started" element={<GetStarted />} />
              
              {/* Unified Routes Protected by Role Logic inside UnifiedLayout or individual guards */}
              <Route path="/unified-dashboard" element={<UnifiedLayout><UnifiedDashboard /></UnifiedLayout>} />
              <Route path="/dashboard" element={<UnifiedLayout><UnifiedDashboard /></UnifiedLayout>} />
              <Route path="/offers" element={<UnifiedLayout><OffersManagement /></UnifiedLayout>} />
              <Route path="/jobs" element={<UnifiedLayout><JobsPage /></UnifiedLayout>} />
              <Route path="/candidates" element={<UnifiedLayout><CandidatesPage /></UnifiedLayout>} />
              <Route path="/interviews" element={<UnifiedLayout><InterviewsPage /></UnifiedLayout>} />
              <Route path="/pipeline" element={<UnifiedLayout><PipelinePage /></UnifiedLayout>} />
              <Route path="/talent-pool" element={<UnifiedLayout><TalentPoolPage /></UnifiedLayout>} />
              <Route path="/profile" element={<UnifiedLayout><ProfilePage /></UnifiedLayout>} />
              <Route path="/team" element={<UnifiedLayout><TeamPage /></UnifiedLayout>} />
              <Route path="/messages" element={<UnifiedLayout><MessagingPage /></UnifiedLayout>} />
              <Route path="/reports" element={<UnifiedLayout><ReportsPage /></UnifiedLayout>} />
              <Route path="/billing" element={<UnifiedLayout><BillingPage /></UnifiedLayout>} />
              <Route path="/integrations" element={<UnifiedLayout><IntegrationsPageUnified /></UnifiedLayout>} />
              <Route path="/settings" element={<UnifiedLayout><SettingsPage /></UnifiedLayout>} />
              <Route path="/companies" element={<UnifiedLayout><CompaniesPage /></UnifiedLayout>} />
              <Route path="/users" element={<UnifiedLayout><UsersPage /></UnifiedLayout>} />
              
              {/* Public Pages */}
              <Route path="/product" element={<Product />} />
              <Route path="/features" element={<Features />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/coding-tests" element={<CodingTests />} />
              <Route path="/live-interviews" element={<LiveInterviews />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Functional Pages */}
              <Route path="/assessment/:id" element={<TakeAssessment />} />
              <Route path="/coding-test/:id" element={<TakeCodingTest />} />

              {/* Company Section (Strict Protection) */}
              <Route path="/company" element={<DashboardGuard allowedRole="company"><CompanyLayout /></DashboardGuard>}>
                <Route index element={<CompanyDashboard />} />
                <Route path="jobs" element={<CompanyJobs />} />
                <Route path="candidates" element={<CompanyCandidates />} />
                <Route path="tests" element={<CompanyTests />} />
                <Route path="interviews" element={<CompanyInterviews />} />
                <Route path="results" element={<CompanyResults />} />
                <Route path="notifications" element={<CompanyNotifications />} />
                <Route path="settings" element={<CompanySettings />} />
              </Route>

              {/* Job Seeker Section (Strict Protection) */}
              <Route path="/jobseeker" element={<DashboardGuard allowedRole="jobseeker"><JobSeekerLayout /></DashboardGuard>}>
                <Route index element={<JobSeekerDashboard />} />
                <Route path="applications" element={<JobSeekerApplications />} />
                <Route path="assessments" element={<JobSeekerAssessments />} />
                <Route path="coding-challenges" element={<CodingChallengesPage />} />
                <Route path="interviews" element={<JobSeekerInterviews />} />
                <Route path="interview/:id" element={<InterviewSession />} />
                <Route path="results" element={<JobSeekerResults />} />
                <Route path="certificates" element={<JobSeekerCertificates />} />
                <Route path="profile" element={<JobSeekerProfile />} />
                <Route path="notifications" element={<JobSeekerNotifications />} />
                <Route path="settings" element={<JobSeekerSettings />} />
              </Route>

              {/* Admin Section (Strict Protection) */}
              <Route path="/admin" element={<DashboardGuard allowedRole="admin"><AdminLayout /></DashboardGuard>}>
                <Route index element={<AdminDashboard />} />
                <Route path="tests" element={<TestManagement />} />
                <Route path="question-bank" element={<QuestionBank />} />
                <Route path="results" element={<AdminResults />} />
                <Route path="interviews" element={<InterviewManagement />} />
                <Route path="companies" element={<CompanyManagement />} />
                <Route path="job-seekers" element={<JobSeekerManagement />} />
                <Route path="role-management" element={<RoleManagement />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="users" element={<UserTeamsDashboard />} />
              </Route>

              {/* Recruiter Section (Strict Protection) */}
              <Route path="/recruiter" element={<DashboardGuard allowedRole="recruiter"><ErrorBoundary><RecruiterLayout /></ErrorBoundary></DashboardGuard>}>
                <Route index element={<RecruiterDashboard />} />
                <Route path="evaluation-reports" element={<EvaluationReports />} />
                <Route path="jobs" element={<RecruiterDashboard />} />
                <Route path="candidates" element={<RecruiterDashboard />} />
                <Route path="assessments" element={<RecruiterAssessments />} />
                <Route path="interviews" element={<RecruiterInterviews />} />
                <Route path="pipeline" element={<RecruiterPipeline />} />
                <Route path="offers" element={<RecruiterDashboard />} />
                <Route path="reports" element={<RecruiterDashboard />} />
                <Route path="settings" element={<RecruiterDashboard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatbotWidget />
          </Suspense>
          </JobSeekerDashboardProvider>
        </SimpleAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

