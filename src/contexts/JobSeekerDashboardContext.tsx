import { createContext, useContext, useCallback, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useAuth } from "./SimpleAuthContext";

export interface JobSeekerProfile {
  id?: string;
  email?: string;
  full_name?: string;
  skills?: string[];
  headline?: string;
  avatar_url?: string;
}

export interface JobSeekerAssessment {
  id?: string;
  title?: string;
  category?: string;
  difficulty?: string;
}

export interface JobSeekerResult {
  id?: string;
  score?: number;
  assessment_id?: string;
  assessments?: { title?: string };
  completed_at?: string;
}

export interface JobSeekerInterview {
  id?: string;
  status?: string;
  created_at?: string;
}

export interface JobSeekerCertificate {
  id?: string;
  assessment_id?: string;
  status?: string;
}

export interface JobSeekerApplication {
  id?: string;
  job?: { title?: string; company_id?: string };
  created_at?: string;
}

export interface JobSeekerNotification {
  id?: string;
  is_read?: boolean;
  created_at?: string;
}

export interface JobSeekerData {
  profile: JobSeekerProfile | null;
  assessments: JobSeekerAssessment[];
  assessmentResults: JobSeekerResult[];
  interviews: JobSeekerInterview[];
  certificates: JobSeekerCertificate[];
  applications: JobSeekerApplication[];
  notifications: JobSeekerNotification[];
  profileCompletion: number;
}

interface DashboardContextType {
  data: JobSeekerData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  updateAssessmentResult: (result: JobSeekerResult) => Promise<void>;
  completeInterview: (interviewId: string) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  getCertificateEligibility: () => Array<{ assessmentId?: string; title?: string; score?: number; completedAt?: string }>;
}

const JobSeekerDashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function JobSeekerDashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);

  // Fetch all data in parallel
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["jobseeker-full-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: assessments = [], isLoading: assessmentsLoading } = useQuery({
    queryKey: ["jobseeker-assessments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from("assessments")
        .select("*")
        .eq("status", "active")
        .limit(20);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: assessmentResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["jobseeker-results", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from("assessment_results")
        .select("*, assessments(title, category, difficulty)")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: interviews = [], isLoading: interviewsLoading } = useQuery({
    queryKey: ["jobseeker-interviews", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from("ai_interviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: certificates = [], isLoading: certificatesLoading } = useQuery({
    queryKey: ["jobseeker-certificates", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "issued");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["jobseeker-applications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from("job_applications")
        .select("*, jobs(title, company_id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ["jobseeker-notifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from("job_seeker_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate profile completion
  const profileCompletion = useCallback(() => {
    if (!profile) return 0;
    const items = [
      !!profile.full_name,
      !!profile.resume_url,
      (profile.skills?.length || 0) > 0,
      !!profile.headline,
      !!profile.avatar_url,
    ];
    return Math.round((items.filter(Boolean).length / items.length) * 100);
  }, [profile]);

  // Update assessment result
  const updateAssessmentResult = useCallback(
    async (result: JobSeekerResult) => {
      if (!user?.id || !result.id) return;
      const supabaseClient = getSupabaseClient();
      const { error } = await supabaseClient
        .from("assessment_results")
        .update(result)
        .eq("id", result.id)
        .eq("user_id", user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["jobseeker-results", user.id] });
    },
    [user?.id, queryClient]
  );

  // Complete interview
  const completeInterview = useCallback(
    async (interviewId: string) => {
      if (!user?.id) return;
      const supabaseClient = getSupabaseClient();
      const { error } = await supabaseClient
        .from("ai_interviews")
        .update({ status: "completed", completed_at: new Date() })
        .eq("id", interviewId)
        .eq("user_id", user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["jobseeker-interviews", user.id] });
    },
    [user?.id, queryClient]
  );

  // Mark notification as read
  const markNotificationRead = useCallback(
    async (notificationId: string) => {
      if (!user?.id) return;
      const supabaseClient = getSupabaseClient();
      const { error } = await supabaseClient
        .from("job_seeker_notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["jobseeker-notifications", user.id] });
    },
    [user?.id, queryClient]
  );

  // Get certificate eligibility
  const getCertificateEligibility = useCallback(() => {
    return assessmentResults
      .filter((result) => (result.score ?? 0) >= 70)
      .filter((result) => !certificates.some((cert) => cert.assessment_id === result.assessment_id))
      .map((result) => ({
        assessmentId: result.assessment_id,
        title: result.assessments?.title,
        score: result.score,
        completedAt: result.completed_at,
      }));
  }, [assessmentResults, certificates]);

  const isLoading =
    profileLoading ||
    assessmentsLoading ||
    resultsLoading ||
    interviewsLoading ||
    certificatesLoading ||
    applicationsLoading ||
    notificationsLoading;

  const data: JobSeekerData | null = user?.id
    ? {
        profile,
        assessments,
        assessmentResults,
        interviews,
        certificates,
        applications,
        notifications,
        profileCompletion: profileCompletion(),
      }
    : null;

  return (
    <JobSeekerDashboardContext.Provider
      value={{
        data,
        isLoading,
        error,
        refetch: () => {
          queryClient.invalidateQueries({ queryKey: ["jobseeker-full-profile"] });
          queryClient.invalidateQueries({ queryKey: ["jobseeker-assessments"] });
          queryClient.invalidateQueries({ queryKey: ["jobseeker-results"] });
          queryClient.invalidateQueries({ queryKey: ["jobseeker-interviews"] });
          queryClient.invalidateQueries({ queryKey: ["jobseeker-certificates"] });
          queryClient.invalidateQueries({ queryKey: ["jobseeker-applications"] });
          queryClient.invalidateQueries({ queryKey: ["jobseeker-notifications"] });
        },
        updateAssessmentResult,
        completeInterview,
        markNotificationRead,
        getCertificateEligibility,
      }}
    >
      {children}
    </JobSeekerDashboardContext.Provider>
  );
}

export const useJobSeekerDashboard = () => {
  const context = useContext(JobSeekerDashboardContext);
  if (!context) {
    throw new Error("useJobSeekerDashboard must be used within JobSeekerDashboardProvider");
  }
  return context;
};
