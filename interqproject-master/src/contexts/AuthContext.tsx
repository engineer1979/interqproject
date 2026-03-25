import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Insert role into user_roles
      if (data.user && role) {
        await supabase.from('user_roles').upsert({
          user_id: data.user.id,
          role: role === 'job_seeker' ? 'job_seeker' : role
        } as any, { onConflict: 'user_id' });
      }

      if (data.session) {
        // Auto sign-in (email confirmation disabled in Supabase)
        const userId = data.user?.id;
        if (userId) {
          const { data: roleData } = await supabase.rpc('get_user_role', { _user_id: userId });
          if (roleData === 'admin') navigate("/admin");
          else if (roleData === 'company') navigate("/company");
          else if (roleData === 'recruiter') navigate("/recruiter");
          else navigate("/jobseeker");
        }
        toast({ title: "Welcome!", description: "Account created successfully." });
      } else {
        toast({ title: "Verification email sent!", description: "Check your email to verify account." });
      }

      return { error: null };
    } catch (error: any) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('signIn called with email:', email);
    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('signInWithPassword result:', { error });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      console.log('About to show toast and navigate');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Route based on role
      const userId = signInData.user?.id;
      console.log('Sign in success, userId:', userId);
      
      // Show role on screen for debugging
      document.title = `Signed in as ${userId?.slice(0,8)}...`;
      
      if (userId) {
        const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', { _user_id: userId });
        console.log('Role data:', roleData, 'error:', roleError);
        
        // Navigate based on role
        if (roleData === 'admin') {
          console.log('Navigating to /admin');
          navigate("/admin", { replace: true });
        } else if (roleData === 'company') {
          console.log('Navigating to /company');
          navigate("/company", { replace: true });
        } else if (roleData === 'recruiter') {
          console.log('Navigating to /recruiter');
          navigate("/recruiter", { replace: true });
        } else {
          console.log('Navigating to /jobseeker (default)');
          navigate("/jobseeker", { replace: true });
        }
      } else {
        console.log('Navigating to /jobseeker (no user id)');
        navigate("/jobseeker", { replace: true });
      }
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    console.log('signOut called');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    console.log('signOut - about to navigate to /auth');
    navigate("/auth");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
