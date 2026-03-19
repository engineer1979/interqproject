import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AccountRole = "admin" | "company" | "recruiter" | "jobseeker";

export interface User {
  id: string;
  email: string;
  name: string;
  role: AccountRole;
  isVerified: boolean;
  avatar?: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
}

export interface DemoUser {
  email: string;
  password: string;
  role: AccountRole;
  name: string;
  description: string;
}

export const DEMO_USERS: DemoUser[] = [
  { 
    email: "admin.demo@hireflow.com", 
    password: "Admin@123", 
    role: "admin", 
    name: "Sarah Admin",
    description: "Full platform access with analytics, billing, and user management"
  },
  { 
    email: "company.demo@hireflow.com", 
    password: "Company@123", 
    role: "company", 
    name: "Alex Manager",
    description: "Manage jobs, candidates, interviews, and team"
  },
  { 
    email: "recruiter.demo@hireflow.com", 
    password: "Recruiter@123", 
    role: "recruiter", 
    name: "John Recruiter",
    description: "Track candidates, manage pipeline, and schedule interviews"
  },
  { 
    email: "jobseeker.demo@hireflow.com", 
    password: "JobSeeker@123", 
    role: "jobseeker", 
    name: "Emily Jobseeker",
    description: "Browse jobs, track applications, and manage profile"
  },
];

interface DemoData {
  profileComplete: number;
  appliedJobs?: number;
  savedJobs?: number;
  interviews?: number;
  offers?: number;
  profileViews?: number;
  activeJobs?: number;
  totalApplicants?: number;
  shortlisted?: number;
  hires?: number;
  pipelineCandidates?: number;
  pendingFeedback?: number;
}

const DEMO_DATA: Record<AccountRole, DemoData> = {
  jobseeker: { profileComplete: 85, appliedJobs: 12, savedJobs: 8, interviews: 3, offers: 1, profileViews: 48 },
  company: { profileComplete: 100, activeJobs: 18, totalApplicants: 234, shortlisted: 45, interviews: 12, offers: 5, hires: 8 },
  recruiter: { profileComplete: 100, activeJobs: 8, pipelineCandidates: 156, interviews: 4, shortlisted: 28, pendingFeedback: 7, offers: 3, hires: 5 },
  admin: { profileComplete: 100 },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  demoData: DemoData | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  loginWithDemo: (role: AccountRole) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signOut: () => void;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  requestVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: AccountRole;
  companyName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("hireflow_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("hireflow_user");
      }
    }
    setIsLoading(false);
  }, []);

  const generateUserId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const demoUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (demoUser && demoUser.password === password) {
      const newUser: User = {
        id: generateUserId(),
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        isVerified: true,
        companyId: demoUser.role === "company" ? "comp_demo_001" : undefined,
        companyName: demoUser.role === "company" ? "TechCorp Solutions" : undefined,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem("hireflow_user", JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    }

    if (email.includes("@") && password.length >= 6) {
      const newUser: User = {
        id: generateUserId(),
        email,
        name: email.split("@")[0],
        role: "jobseeker",
        isVerified: false,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem("hireflow_user", JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true, needsVerification: true };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid email or password" };
  }, []);

  const loginWithDemo = useCallback(async (role: AccountRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const demoUser = DEMO_USERS.find(u => u.role === role);
    if (demoUser) {
      const newUser: User = {
        id: generateUserId(),
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        isVerified: true,
        companyId: demoUser.role === "company" ? "comp_demo_001" : undefined,
        companyName: demoUser.role === "company" ? "TechCorp Solutions" : undefined,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem("hireflow_user", JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Demo account not found" };
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!data.email || !data.password || !data.name) {
      setIsLoading(false);
      return { success: false, error: "All fields are required" };
    }

    if (data.password.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const newUser: User = {
      id: generateUserId(),
      email: data.email,
      name: data.name,
      role: data.role,
      isVerified: false,
      companyId: data.role === "company" ? generateUserId() : undefined,
      companyName: data.companyName,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem("hireflow_user", JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  }, []);

  const { toast } = useToast();

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("hireflow_user");
    navigate("/auth");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  }, [navigate, toast]);

  const verifyEmail = useCallback(async (token: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (token === "demo" || token.length > 0) {
      if (user) {
        const updatedUser = { ...user, isVerified: true };
        setUser(updatedUser);
        localStorage.setItem("hireflow_user", JSON.stringify(updatedUser));
      }
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid verification token" };
  }, [user]);

  const requestVerification = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    return { success: true };
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otp === "123456" || otp.length === 6) {
      if (user) {
        const updatedUser = { ...user, isVerified: true };
        setUser(updatedUser);
        localStorage.setItem("hireflow_user", JSON.stringify(updatedUser));
      }
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid OTP code" };
  }, [user]);

  const getDashboardPath = (role: AccountRole): string => {
    switch (role) {
      case "admin": return "/admin";
      case "company": return "/company";
      case "recruiter": return "/recruiter";
      case "jobseeker": return "/jobseeker";
      default: return "/dashboard";
    }
  };

  useEffect(() => {
    if (user?.isVerified) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [user, navigate]);

  const demoData = user ? DEMO_DATA[user.role] : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        demoData,
        login,
        loginWithDemo,
        signup,
        logout,
        signOut: logout,
        verifyEmail,
        requestVerification,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within SimpleAuthProvider");
  return context;
};

export const useRole = () => {
  const { user } = useAuth();
  return {
    currentRole: user?.role || "jobseeker",
    roleLabel: user?.role === "admin" ? "Admin" : user?.role === "company" ? "Company" : user?.role === "recruiter" ? "Recruiter" : "Job Seeker",
    roleColor: user?.role === "admin" ? "bg-red-500" : user?.role === "company" ? "bg-blue-500" : user?.role === "recruiter" ? "bg-green-500" : "bg-purple-500",
  };
};
