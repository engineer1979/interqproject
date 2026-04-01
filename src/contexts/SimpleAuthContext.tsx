import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  isDemo?: boolean;
}

export interface DemoUser {
  email: string;
  password: string;
  role: AccountRole;
  name: string;
  description: string;
}

// Demo users - only accessible via specific demo login mechanism
export const DEMO_USERS: DemoUser[] = [
  { 
    email: "admin.demo@interq.com", 
    password: "Admin@123", 
    role: "admin", 
    name: "Sarah Admin",
    description: "Full platform access with analytics, billing, and user management"
  },
  { 
    email: "company.demo@interq.com", 
    password: "Company@123", 
    role: "company", 
    name: "Alex Manager",
    description: "Manage jobs, candidates, interviews, and team"
  },
  { 
    email: "recruiter.demo@interq.com", 
    password: "Recruiter@123", 
    role: "recruiter", 
    name: "John Recruiter",
    description: "Track candidates, manage pipeline, and schedule interviews"
  },
  { 
    email: "jobseeker.demo@interq.com", 
    password: "JobSeeker@123", 
    role: "jobseeker", 
    name: "Emily Jobseeker",
    description: "Browse jobs, track applications, and manage profile"
  },
];

// Storage keys
const STORAGE_KEY = "interq_user";
const SESSION_KEY = "interq_session";
const DEMO_SESSION_KEY = "interq_demo_session";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  loginWithDemo: (role: AccountRole) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  requestVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  checkSession: () => Promise<boolean>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: AccountRole;
  companyName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to generate user ID
const generateUserId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to check if user is a demo user
const isDemoEmail = (email: string): boolean => {
  return DEMO_USERS.some(demo => demo.email.toLowerCase() === email.toLowerCase());
};

// Helper to get dashboard path by role
const getDashboardPath = (role: AccountRole): string => {
  switch (role) {
    case "admin": return "/admin";
    case "company": return "/company";
    case "recruiter": return "/recruiter";
    case "jobseeker": return "/jobseeker";
    default: return "/dashboard";
  }
};

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check localStorage first
        const storedUser = localStorage.getItem(STORAGE_KEY);
        const storedSession = localStorage.getItem(SESSION_KEY);
        
        if (storedUser && storedSession) {
          const parsedUser = JSON.parse(storedUser);
          const sessionData = JSON.parse(storedSession);
          
          // Verify session hasn't expired (24 hours)
          const sessionAge = Date.now() - sessionData.timestamp;
          const sessionExpiry = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < sessionExpiry) {
            setUser(parsedUser);
            setIsDemo(parsedUser.isDemo || false);
          } else {
            // Session expired - clear everything
            clearAllStorage();
          }
        } else if (storedUser) {
          // Has user but no session - check if demo
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.isDemo) {
            // Demo users have longer session (1 hour)
            const demoSession = localStorage.getItem(DEMO_SESSION_KEY);
            if (demoSession) {
              const demoData = JSON.parse(demoSession);
              const sessionAge = Date.now() - demoData.timestamp;
              const demoExpiry = 60 * 60 * 1000; // 1 hour
              
              if (sessionAge < demoExpiry) {
                setUser(parsedUser);
                setIsDemo(true);
              } else {
                clearAllStorage();
              }
            }
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        clearAllStorage();
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  // Clear all storage helper
  const clearAllStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(DEMO_SESSION_KEY);
    localStorage.removeItem("hireflow_user"); // Legacy key
    setUser(null);
    setIsDemo(false);
  };

  // Login handler - demo users only (Supabase removed)
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
    setIsLoading(true);
    
    try {
      // Check if it's a demo user
      const demoUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (demoUser && demoUser.password === password) {
        // Demo login - create local session
        const newUser: User = {
          id: generateUserId(),
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          isVerified: true,
          companyId: demoUser.role === "company" ? "comp_demo_001" : undefined,
          companyName: demoUser.role === "company" ? "TechCorp Solutions" : undefined,
          createdAt: new Date().toISOString(),
          isDemo: true,
        };
        
        setUser(newUser);
        setIsDemo(true);
        
        // Store in localStorage with demo session
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({
          timestamp: Date.now(),
          role: demoUser.role,
        }));
        
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: "Invalid email or password. Use demo accounts or signup for real accounts." };
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  }, []);

  // Demo login - only accessible via demo button
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
        isDemo: true,
      };
      
      setUser(newUser);
      setIsDemo(true);
      
      // Store with demo session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({
        timestamp: Date.now(),
        role: demoUser.role,
      }));
      
      setIsLoading(false);
      toast({
        title: "Demo Mode",
        description: `Logged in as ${demoUser.name}. This is a demo account.`,
      });
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Demo account not found" };
  }, [toast]);

  // Signup handler - pure localStorage (no Supabase)
  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Generate user ID and create local user
      const newUser: User = {
        id: generateUserId(),
        email: data.email,
        name: data.name,
        role: data.role,
        isVerified: false, // Always needs verification in demo mode
        companyName: data.companyName,
        createdAt: new Date().toISOString(),
        isDemo: false,
      };

      setUser(newUser);
      setIsDemo(false);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        timestamp: Date.now(),
        userId: newUser.id,
        role: newUser.role,
      }));

      setIsLoading(false);
      toast({
        title: "Account Created",
        description: "Check your email to verify account! (Demo mode)",
      });
      return { success: true };
    } catch (error: any) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  }, [toast]);

  // Logout handler - clears everything
  const logout = useCallback(async () => {
    clearAllStorage();
    
    // Clear any legacy keys
    localStorage.removeItem("hireflow_user");
    localStorage.removeItem("interq_user");
    
    setUser(null);
    setIsDemo(false);
    
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    
    navigate("/auth");
  }, [navigate, toast]);

  // Alias for signOut
  const signOut = logout;

  // Verify email - demo
  const verifyEmail = useCallback(async (token: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (user) {
      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
    
    setIsLoading(false);
    return { success: true };
  }, [user]);

  // Request verification email - demo
  const requestVerification = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    return { success: true };
  }, []);

  // Verify OTP - demo
  const verifyOTP = useCallback(async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Accept any 6-digit code for demo
    if (otp.length === 6) {
      if (user) {
        const updatedUser = { ...user, isVerified: true };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      }
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid OTP code" };
  }, [user]);

  // Check session validity - local only
  const checkSession = useCallback(async (): Promise<boolean> => {
    return !!user;
  }, [user]);

  // Navigate to dashboard on login
  useEffect(() => {
    const authPages = ["/auth", "/", "/landing", "/verify-email"];
    if (user?.isVerified && authPages.includes(location.pathname)) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [user, navigate, location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isDemo,
        login,
        loginWithDemo,
        signup,
        logout,
        signOut,
        verifyEmail,
        requestVerification,
        verifyOTP,
        checkSession,
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
    isAdmin: user?.role === "admin",
    isCompany: user?.role === "company",
    isRecruiter: user?.role === "recruiter",
    isJobseeker: user?.role === "jobseeker",
    isDemo: user?.isDemo || false,
    roleLabel: user?.role === "admin" ? "Admin" : user?.role === "company" ? "Company" : user?.role === "recruiter" ? "Recruiter" : "Job Seeker",
    roleColor: user?.role === "admin" ? "bg-red-500" : user?.role === "company" ? "bg-blue-500" : user?.role === "recruiter" ? "bg-green-500" : "bg-purple-500",
  };
};

// Helper to check if user can access admin features
export const canAccessAdmin = (user: User | null): boolean => {
  return user?.role === "admin" && !user?.isDemo;
};

// Helper to check if user can see real user data (not demo)
export const canSeeRealUsers = (user: User | null): boolean => {
  return user?.role === "admin" && !user?.isDemo;
};
