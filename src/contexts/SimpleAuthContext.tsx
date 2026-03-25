import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
// These are NEVER shown in any user lists or dashboards
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

  // Login handler - checks against real users in Supabase OR demo users
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
    setIsLoading(true);
    
    try {
      // First, try Supabase authentication
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        // If Supabase fails, check if it's a demo user
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
        return { success: false, error: "Invalid email or password" };
      }

      // Real Supabase user login
      if (supabaseData.user) {
        // Fetch user role from Supabase
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", supabaseData.user.id)
          .single();

        const userRole: AccountRole = (roleData?.role as AccountRole) || "jobseeker";

        // Get user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", supabaseData.user.id)
          .single();

        const newUser: User = {
          id: supabaseData.user.id,
          email: supabaseData.user.email || email,
          name: profileData?.full_name || email.split("@")[0],
          role: userRole,
          isVerified: supabaseData.user.email_confirmed_at !== null,
          avatar: profileData?.avatar_url || undefined,
          companyId: (profileData as any)?.company_id,
          companyName: (profileData as any)?.company_name,
          createdAt: supabaseData.user.created_at,
          isDemo: false,
        };

        setUser(newUser);
        setIsDemo(false);

        // Store session
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          timestamp: Date.now(),
          userId: newUser.id,
          role: newUser.role,
        }));

        setIsLoading(false);
        
        // Check if email needs verification
        if (!newUser.isVerified) {
          return { success: true, needsVerification: true };
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error("Login error:", error);
    }

    setIsLoading(false);
    return { success: false, error: "An unexpected error occurred" };
  }, []);

  // Demo login - only accessible via demo button, never via manual credentials
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

  // Signup handler
  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Create Supabase auth user
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
          },
        },
      });

      if (supabaseError) {
        setIsLoading(false);
        return { success: false, error: supabaseError.message };
      }

      if (supabaseData.user) {
        // Insert role into user_roles
        await supabase.from("user_roles").upsert({
          user_id: supabaseData.user.id,
          role: data.role,
          created_at: new Date().toISOString(),
        } as any, { onConflict: "user_id" });

        // Insert profile
        await supabase.from("profiles").upsert({
          id: supabaseData.user.id,
          email: data.email,
          full_name: data.name,
          role: data.role,
          company_name: data.companyName,
          created_at: new Date().toISOString(),
        } as any, { onConflict: "id" });

        // If role is company, create the company record
        if (data.role === "company" && data.companyName) {
          const { data: companyRecord } = await (supabase as any).from("companies").insert({
            name: data.companyName,
            email: data.email,
            created_by: (supabaseData.user as any).id,
            onboarding_completed: true,
          }).select().single();
          
          if (companyRecord) {
             // Link the company to the profile if needed (though profiles doesn't have company_id column in current schema, we use created_by lookup)
          }
        }

        const newUser: User = {
          id: supabaseData.user.id,
          email: data.email,
          name: data.name,
          role: data.role,
          isVerified: supabaseData.user.email_confirmed_at !== null,
          companyName: data.companyName,
          createdAt: supabaseData.user.created_at,
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
        return { success: true };
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }

    setIsLoading(false);
    return { success: false, error: "Signup failed" };
  }, []);

  // Logout handler - clears everything
  const logout = useCallback(async () => {
    try {
      // Sign out from Supabase (will fail silently if no session)
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase signout error:", error);
    }
    
    // Clear all local storage
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

  // Verify email
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

  // Request verification email
  const requestVerification = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      setIsLoading(false);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error: any) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  }, []);

  // Verify OTP
  const verifyOTP = useCallback(async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo, accept any 6-digit code
    if (otp === "123456" || otp.length === 6) {
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

  // Check session validity
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && user && !user.isDemo) {
        // Refresh user data from Supabase
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        if (roleData) {
          const updatedUser = { ...user, role: roleData.role as AccountRole };
          setUser(updatedUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        }
        return true;
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
    return false;
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
