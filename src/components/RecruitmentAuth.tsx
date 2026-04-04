import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Google, Phone, Mail, Lock, User, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

enum AuthTab {
  SignIn = 'signin',
  SignUp = 'signup',
  RoleSetup = 'role-setup',
  ApprovalPending = 'approval'
}

interface ProfileFormData {
  full_name: string;
  role: 'candidate' | 'recruiter';
}

const RecruitmentAuth: React.FC = () => {
  const [tab, setTab] = useState<AuthTab>(AuthTab.SignIn);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileData, setProfileData] = useState<ProfileFormData>({ full_name: '', role: 'candidate' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Check if magic link or first login
  useEffect(() => {
    const accessToken = searchParams.get('token');
    const type = searchParams.get('type');
    const error = searchParams.get('error');
    
    if (error === 'Access token expired') {
      toast({ title: "Session expired", description: "Please sign in again", variant: "destructive" });
      return;
    }

    if (accessToken && type === 'recovery') {
      // Password recovery
      setTab(AuthTab.SignIn);
      toast({ title: "Recovery link received", description: "You can now reset your password" });
    } else if (accessToken && type === 'signup') {
      // New user - check profile
      checkNewUserProfile();
    }
  }, [searchParams]);

  const checkNewUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_approved')
        .eq('id', user.id)
        .single();

      if (!profile) {
        setTab(AuthTab.RoleSetup);
      } else if (!profile.is_approved) {
        setTab(AuthTab.ApprovalPending);
      } else {
        navigate('/dashboard');
      }
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setLoading(false);
  };

  const sendPhoneOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+1${phone}`, // Format as needed
      options: {
        channel: 'sms'
      }
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "OTP Sent", description: "Check your phone for the code" });
    }
    setLoading(false);
  };

  const verifyPhoneOtp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+1${phone}`,
      token: otp,
      type: 'sms'
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data.user) {
      checkNewUserProfile();
    }
    setLoading(false);
  };

  const signUpEmailPassword = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: profileData.full_name
        }
      }
    });
    if (error) {
      toast({ title: "Signup Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Account created! Waiting for admin approval." });
      setTab(AuthTab.ApprovalPending);
    }
    setLoading(false);
  };

  const signInEmailPassword = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      toast({ title: "Signin Error", description: error.message, variant: "destructive" });
    } else if (data.user) {
      checkNewUserProfile();
    }
    setLoading(false);
  };

  const forgotPassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?tab=reset`
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Reset link sent", description: "Check your email" });
    }
    setLoading(false);
  };

  const completeProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Profile Complete", description: "Waiting for admin approval..." });
        setTab(AuthTab.ApprovalPending);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <Card className="w-full max-w-md">
        <Tabs value={tab} onValueChange={(v: string) => setTab(v as AuthTab)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">
              <Mail className="mr-2 h-4 w-4" />
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup">
              <User className="mr-2 h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent value="signin" className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={signInWithGoogle} variant="outline" className="w-full gap-2">
                <Google className="h-5 w-5" />
                Continue with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <Button onClick={signInEmailPassword} className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              <Button variant="link" onClick={forgotPassword} className="justify-start p-0 h-auto">
                Forgot Password?
              </Button>
            </CardContent>
          </TabsContent>

          {/* Sign Up */}
          <TabsContent value="signup" className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription>Join as Candidate or Recruiter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={signInWithGoogle} variant="outline" className="w-full gap-2">
                <Google className="h-5 w-5" />
                Continue with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-card text-muted-foreground">Or phone OTP</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
                </div>
                <div>
                  <Button onClick={sendPhoneOtp} variant="outline" className="w-full" disabled={loading || !phone}>
                    Send OTP
                  </Button>
                </div>
              </div>
              {otp && (
                <div className="space-y-2">
                  <Label>OTP Code</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {Array(6).fill(0).map((_, i) => (
                      <Input
                        key={i}
                        maxLength={1}
                        value={otp[i] || ''}
                        onChange={(e) => {
                          const newOtp = otp.split('');
                          newOtp[i] = e.target.value;
                          setOtp(newOtp.join(''));
                        }}
                        className="text-center text-lg font-bold"
                      />
                    ))}
                  </div>
                  <Button onClick={verifyPhoneOtp} className="w-full" disabled={loading || otp.length !== 6}>
                    Verify & Continue
                  </Button>
                </div>
              )}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-card text-muted-foreground">Email + Password (Admin Approval)</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={profileData.full_name} onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={profileData.role} onValueChange={(v: any) => setProfileData({ ...profileData, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div />
              </div>
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Your account will be created. Access requires admin approval.
                </AlertDescription>
              </Alert>
              <Button onClick={signUpEmailPassword} className="w-full" disabled={loading || !email || !password}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up (Pending Approval)
              </Button>
            </CardContent>
          </TabsContent>

          {/* Role Setup */}
          <TabsContent value="role-setup">
            <CardHeader>
              <CardTitle>Complete your profile</CardTitle>
              <CardDescription>Set your role to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profileData.full_name} onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={profileData.role} onValueChange={(v: any) => setProfileData({ ...profileData, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate">Job Candidate</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={completeProfile} className="w-full" disabled={loading || !profileData.full_name}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </CardContent>
          </TabsContent>

          {/* Approval Pending */}
          <TabsContent value="approval">
            <CardHeader>
              <CardTitle>Account Created!</CardTitle>
              <CardDescription>Waiting for admin approval</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <p className="text-lg">Your account is pending approval.</p>
              <p className="text-sm text-muted-foreground">An admin will review and approve your account soon.</p>
              <Button variant="outline" onClick={() => supabase.auth.signOut().then(() => navigate('/'))}>
                Sign Out
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default RecruitmentAuth;

