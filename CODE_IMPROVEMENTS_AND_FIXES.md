# 🛠️ InterQ Authentication Code Improvements & Fixes

**Date**: April 5, 2026  
**Focus**: Enhanced Error Handling, Security, and User Experience

---

## 📋 Overview

This document provides specific code improvements to enhance your authentication system:
- Better error messages
- Improved validation
- Enhanced security
- Better user experience

---

## Fix #1: Enhanced AuthContext with Better Error Handling

### Current Issues
- Generic error messages
- No email verification status feedback
- Missing password validation

### Improved Code

**File**: `src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: Error | null; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Friendly error messages for common issues
const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Email or password is incorrect. Please try again.",
  "Email not confirmed": "Please verify your email before logging in. Check your inbox for verification link.",
  "User already registered": "This email is already registered. Try signing in or reset your password.",
  "Password should be at least 6 characters": "Password must be at least 6 characters long.",
  "Invalid email": "Please enter a valid email address.",
  "Weak password": "Password is too weak. Use at least: 8 characters, 1 uppercase, 1 number, 1 special character.",
  "SMTP not configured": "Email system is not set up yet. Please contact support.",
};

function getErrorMessage(error: AuthError | null): string {
  if (!error) return "An unexpected error occurred";
  
  // Check for exact match
  if (ERROR_MESSAGES[error.message]) {
    return ERROR_MESSAGES[error.message];
  }
  
  // Check for partial match
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (error.message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return error.message || "An unexpected error occurred";
}

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

        // Handle different auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'USER_UPDATED') {
          console.log('User updated');
        }
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

  const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signUp = async (email: string, password: string, fullName: string, role?: string) => {
    try {
      // Validate inputs
      if (!email || !validateEmail(email)) {
        const error = new Error("Please enter a valid email address");
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return { error };
      }

      if (!password || password.length < 6) {
        const error = new Error("Password must be at least 6 characters");
        toast({
          title: "Invalid Password",
          description: "Password must be at least 6 characters",
          variant: "destructive",
        });
        return { error };
      }

      if (!fullName || fullName.trim().length < 2) {
        const error = new Error("Please enter your full name");
        toast({
          title: "Invalid Name",
          description: "Please enter a valid full name",
          variant: "destructive",
        });
        return { error };
      }

      // Attempt signup
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        const friendlyError = getErrorMessage(error);
        toast({
          title: "Sign up failed",
          description: friendlyError,
          variant: "destructive",
        });
        return { error };
      }

      // Handle role assignment
      if (data.user && role) {
        try {
          await supabase.from('user_roles').upsert({
            user_id: data.user.id,
            role: role === 'job_seeker' ? 'job_seeker' : role
          } as any, { onConflict: 'user_id' });
        } catch (roleError) {
          console.error('Error assigning role:', roleError);
          // Don't fail signup if role assignment fails
        }
      }

      // Check if instant login (no email confirmation needed)
      if (data.session) {
        // User was auto-confirmed (email confirmation disabled)
        toast({ 
          title: "Welcome!", 
          description: "Account created successfully. Redirecting..." 
        });
        
        // Navigate based on role
        if (data.user?.id) {
          try {
            const { data: roleData } = await supabase.rpc('get_user_role', { _user_id: data.user.id });
            if (roleData === 'admin') navigate("/admin", { replace: true });
            else if (roleData === 'company') navigate("/company", { replace: true });
            else if (roleData === 'recruiter') navigate("/recruiter", { replace: true });
            else navigate("/jobseeker", { replace: true });
          } catch (navError) {
            console.error('Navigation error:', navError);
            navigate("/jobseeker", { replace: true });
          }
        }

        return { error: null, needsVerification: false };
      } else {
        // Email verification required
        toast({ 
          title: "Verification email sent!", 
          description: "Check your inbox (and spam folder) for a verification link. You have 24 hours to verify." 
        });

        return { error: null, needsVerification: true };
      }
    } catch (error: any) {
      const friendlyError = getErrorMessage(error);
      toast({ 
        title: "Sign up failed", 
        description: friendlyError, 
        variant: "destructive" 
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!email || !validateEmail(email)) {
        const error = new Error("Invalid email address");
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return { error };
      }

      if (!password) {
        const error = new Error("Password is required");
        toast({
          title: "Missing Password",
          description: "Please enter your password",
          variant: "destructive",
        });
        return { error };
      }

      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        const friendlyError = getErrorMessage(error);
        toast({
          title: "Sign in failed",
          description: friendlyError,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Route based on role
      const userId = signInData.user?.id;
      
      if (userId) {
        try {
          const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', { _user_id: userId });
          
          if (roleError) {
            console.warn('Could not fetch role, defaulting to jobseeker:', roleError);
            navigate("/jobseeker", { replace: true });
          } else {
            // Navigate based on role
            switch(roleData) {
              case 'admin':
                navigate("/admin", { replace: true });
                break;
              case 'company':
                navigate("/company", { replace: true });
                break;
              case 'recruiter':
                navigate("/recruiter", { replace: true });
                break;
              default:
                navigate("/jobseeker", { replace: true });
            }
          }
        } catch (navError) {
          console.error('Navigation error:', navError);
          navigate("/jobseeker", { replace: true });
        }
      } else {
        navigate("/jobseeker", { replace: true });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      const friendlyError = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({ 
        title: "Sign in failed", 
        description: friendlyError, 
        variant: "destructive" 
      });
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!email || !validateEmail(email)) {
        const error = new Error("Invalid email address");
        return { error };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        const friendlyError = getErrorMessage(error);
        toast({
          title: "Failed to send reset email",
          description: friendlyError,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Reset email sent",
        description: "Check your inbox for a password reset link. Links expire after 24 hours.",
      });

      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const validation = validatePassword(newPassword);
      if (!validation.valid) {
        const error = new Error(validation.errors.join(", "));
        toast({
          title: "Weak Password",
          description: validation.errors.join(", "),
          variant: "destructive",
        });
        return { error };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        const friendlyError = getErrorMessage(error);
        toast({
          title: "Password update failed",
          description: friendlyError,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate("/auth", { replace: true });
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      resetPassword,
      updatePassword,
    }}>
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
```

---

## Fix #2: Enhanced ResetPassword Page

### Current Issues
- Hardcoded credentials (security risk)
- No email request form
- No recovery status feedback

### Improved Code

**File**: `src/pages/ResetPassword.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Loader2, Mail, CheckCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

enum ResetMode {
  REQUEST = 'request',      // User requesting password reset
  VERIFY = 'verify',        // User clicking recovery link
  UPDATE = 'update',        // User entering new password
  SUCCESS = 'success'       // Password updated successfully
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, updatePassword } = useAuth();
  
  // State management
  const [mode, setMode] = useState<ResetMode>(ResetMode.REQUEST);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check for recovery token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const t = params.get('access_token');
    const type = params.get('type');
    
    if (t && type === 'recovery') {
      setToken(t);
      setMode(ResetMode.UPDATE);
      setSuccessMessage("Recovery link verified! Enter your new password below.");
    }
  }, [location]);

  // Request password reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const result = await resetPassword(email);
    
    if (result.error) {
      setError(result.error.message || "Failed to send reset email");
    } else {
      setMode(ResetMode.VERIFY);
      setSuccessMessage("Check your email for a password reset link");
      setEmail(""); // Clear email for security
    }
    
    setLoading(false);
  };

  // Update password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await updatePassword(password);
    
    if (result.error) {
      setError(result.error.message || "Failed to update password");
    } else {
      setMode(ResetMode.SUCCESS);
      setPassword("");
      setConfirmPassword("");
    }
    
    setLoading(false);
  };

  // Request mode
  if (mode === ResetMode.REQUEST) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto mb-4 bg-blue-100 p-3 rounded-full w-fit">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestReset} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verify mode
  if (mode === ResetMode.VERIFY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-fit">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We've sent a password reset link to your email address.
            </p>
            <p className="text-gray-600 text-sm">
              • Click the link in the email to reset your password<br/>
              • Links expire after 24 hours<br/>
              • Check your spam folder if you don't see it
            </p>
            <Button
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Back to Sign In
            </Button>
            <button
              type="button"
              onClick={() => {
                setMode(ResetMode.REQUEST);
                setEmail("");
              }}
              className="w-full text-blue-600 hover:underline text-sm"
            >
              Try another email
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Update password mode
  if (mode === ResetMode.UPDATE) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto mb-4 bg-blue-100 p-3 rounded-full w-fit">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Create New Password</CardTitle>
            <CardDescription>Enter a strong password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {successMessage}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500">
                  At least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success mode
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-fit">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Password Updated!</CardTitle>
          <CardDescription>Your password has been changed successfully</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            You can now sign in with your new password.
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Fix #3: Email Verification Page

### New Component: Email Verification Page

**Create File**: `src/pages/VerifyEmail.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react";

enum VerifyMode {
  PENDING = 'pending',      // Waiting for email click
  LOADING = 'loading',      // Processing verification
  SUCCESS = 'success',      // Email verified
  ERROR = 'error'          // Verification failed
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<VerifyMode>(VerifyMode.PENDING);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // Get email from URL params or session storage
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }

    // Check if verification link was used
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    if (urlParams.get('access_token') && urlParams.get('type') === 'recovery') {
      setMode(VerifyMode.LOADING);
      // Email already verified by Supabase, show success
      setTimeout(() => setMode(VerifyMode.SUCCESS), 2000);
    }
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (mode === VerifyMode.PENDING && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, mode]);

  const handleResendEmail = async () => {
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    setCountdown(60);
    // Implement resend logic here if needed
  };

  // Pending verification
  if (mode === VerifyMode.PENDING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto mb-4 bg-blue-100 p-3 rounded-full w-fit animate-bounce">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>Check your inbox for a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {email && (
              <p className="text-center text-gray-700">
                We sent a verification email to:<br/>
                <span className="font-semibold">{email}</span>
              </p>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-gray-700">
                <strong>What to do:</strong><br/>
                1. Open your email<br/>
                2. Find the email from InterQ<br/>
                3. Click "Confirm my email" button<br/>
                4. You'll be automatically signed in
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-center text-sm text-gray-600">
                Didn't receive the email?
              </p>
              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Check your spam/junk folder if you don't see the email
            </p>

            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="w-full"
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading/processing
  if (mode === VerifyMode.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-blue-100 p-3 rounded-full w-fit">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Verifying Email...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Please wait while we confirm your email address.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success
  if (mode === VerifyMode.SUCCESS) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-fit">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Email Verified!</CardTitle>
            <CardDescription>Your account is now active</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 text-center">
              Thank you for verifying your email. Your account has been activated and you can now access all features.
            </p>
            <Button
              onClick={() => navigate('/jobseeker')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 bg-red-100 p-3 rounded-full w-fit">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Verification Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            {error || "The verification link is invalid or has expired."}
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Fix #4: Update Routes in App.tsx

Add these routes for email verification and improved password reset:

```typescript
// Add to your router configuration
import VerifyEmail from '@/pages/VerifyEmail';
import ResetPassword from '@/pages/ResetPassword';

// In your route definitions:
{
  path: '/auth/verify',
  element: <VerifyEmail />
},
{
  path: '/auth/reset-password',
  element: <ResetPassword />
},
{
  path: '/reset-password',  // Alternative route for backward compatibility
  element: <ResetPassword />
}
```

---

## Fix #5: Environment Variables (.env.local)

Update with proper SMTP configuration:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://lenltzlsnlbzwlizmijc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Email Configuration (Optional - for custom email in app)
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your-email@gmail.com
# Note: Password should be set in Supabase Dashboard, not in .env

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_AUTH_REDIRECT_TO=/auth/verify
```

---

## Fix #6: Add Type Safety for Auth

Create: `src/types/auth.ts`

```typescript
export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role?: 'admin' | 'company' | 'recruiter' | 'job_seeker';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordUpdateData {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthResponse<T = null> {
  success: boolean;
  data?: T;
  error?: AuthError;
  needsVerification?: boolean;
}
```

---

## Implementation Priority

### Phase 1: CRITICAL (Do First)
- [ ] Configure SMTP in Supabase (5 min)
- [ ] Update `.env.local` (2 min)

### Phase 2: HIGH (Week 1)
- [ ] Update AuthContext with improved error handling (30 min)
- [ ] Update ResetPassword component (20 min)
- [ ] Add VerifyEmail page (20 min)

### Phase 3: MEDIUM (Week 2)
- [ ] Add type safety for auth (15 min)
- [ ] Update routes in App.tsx (10 min)
- [ ] Test all flows (30 min)

### Phase 4: OPTIONAL (Later)
- [ ] Implement email resend functionality
- [ ] Add multi-factor authentication
- [ ] Implement password strength meter
- [ ] Add passwordless login (magic links)

---

## Security Recommendations

1. **Never hardcode API keys** - Use environment variables only
2. **Use HTTPS in production** - Required for auth redirects
3. **Validate all inputs** - Both client and server-side
4. **Implement rate limiting** - Prevent brute force attacks
5. **Use secure cookies** - Enable HttpOnly and Secure flags
6. **Monitor auth logs** - Track failed login attempts
7. **Implement CSRF protection** - Use token-based validation

---

## Testing Checklist

- [ ] Sign up with valid email → Email verification sent
- [ ] Click email verification link → Account activated
- [ ] Sign in with correct credentials → Dashboard loads
- [ ] Sign in with wrong password → Error message shown
- [ ] Click "Forgot Password" → Reset email sent
- [ ] Click reset link → Password update form shows
- [ ] Update password → Success message shown
- [ ] Sign in with new password → Works
- [ ] Sign out → Back to login page
- [ ] Access protected route without auth → Redirected to login

---

## Performance Tips

1. Use password debouncing for validation
2. Implement loading skeletons while checking session
3. Cache user role to avoid repeated RPC calls
4. Use React.memo for auth components
5. Implement automatic session refresh before expiry

---

## Monitoring & Logging

Add to AuthContext:

```typescript
// Log auth events
const logAuthEvent = (event: string, data?: any) => {
  console.log(`[AUTH] ${event}:`, data);
  // Send to logging service (e.g., Sentry, LogRocket)
};
```

---

**Version**: 1.0  
**Last Updated**: April 5, 2026  
**Status**: Ready for Implementation ✅
