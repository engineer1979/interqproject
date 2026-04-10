import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseClient, refreshSupabaseConfig } from "@/integrations/supabase/client";
import { Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"request" | "update">("request");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace("#", ""));
    const accessToken = params.get("access_token") || hashParams.get("access_token");
    const refreshToken = params.get("refresh_token") || hashParams.get("refresh_token");
    const emailFromQuery = params.get("email") || hashParams.get("email");
    const recovery = params.get("type") === "recovery" || Boolean(accessToken);

    if (emailFromQuery) {
      setResetEmail(emailFromQuery);
    }

    if (recovery) {
      setMode("update");
      if (accessToken) {
        (async () => {
          setLoading(true);
          const supabaseClient = getSupabaseClient();
          const { error } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

          if (error) {
            console.warn("Supabase setSession failed:", error.message);
            setError("Unable to attach reset session. Please refresh and try again with the exact link.");
          } else {
            setMessage("Recovery session initialized. Enter new password below.");
          }
          setLoading(false);
        })();
      } else {
        setLoading(false);
        setMessage("Recovery link detected, but no token was found. Please open the exact email link or request another reset.");
      }
    }
  }, [location.search, location.hash]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email to receive password reset instructions.");
      return;
    }

    setLoading(true);
    setResetEmail(email);

    // Local fallback for demo & local accounts (offline mode)
    const localUsersJson = localStorage.getItem("interq_local_users");
    const localUsers = localUsersJson ? (JSON.parse(localUsersJson) as Array<{ email: string; password: string }>) : [];
    const localAccount = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (localAccount) {
      setMode("update");
      setMessage("Local account found. Enter a new password below to reset.");
      setLoading(false);
      return;
    }

    // Keep request mode for standard email flow unless local fallback applies
    setMode("request");

    try {
      const supabaseClient = getSupabaseClient();
      let { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      // Retry once while auto-updating from localStorage/ env if connection fails
      if (error?.message === "Failed to fetch") {
        refreshSupabaseConfig();
        const retryClient = getSupabaseClient();
        const retryResult = await retryClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        error = retryResult.error;
      }

      if (error) {
        console.error("Password reset error:", {
          message: error.message,
          status: error.status,
          code: error.code,
        });

        let fallbackMessage = error.message || "Unable to send reset link.";
        
        // Provide diagnostic hints based on error type
        if (error.message?.includes("email") || error.message?.includes("mail")) {
          fallbackMessage = `Email service error: ${error.message}. Check Supabase email configuration.`;
        } else if (error.message === "Failed to fetch") {
          fallbackMessage = "Unable to reach authentication service. Check network/Supabase config.";
        }

        setError(fallbackMessage);

        // Allow local reset as fallback if email fails
        setMode("update");
        setMessage("Email delivery unavailable. You can still reset using local mode.\nEnter a new password below.");
      } else {
        setError("");
        setMessage("An email has been sent with instructions to reset your password. Please check your inbox.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to send reset link.";
      setError(message);
      setMode("update");
      setMessage("Supabase request failed; enter new password to perform local reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const localUsersJson = localStorage.getItem("interq_local_users");
    const localUsers = localUsersJson ? (JSON.parse(localUsersJson) as Array<{ email: string; password: string }>) : [];
    const localIndex = localUsers.findIndex((u) => u.email.toLowerCase() === resetEmail.toLowerCase());

    if (localIndex !== -1) {
      localUsers[localIndex].password = password;
      localStorage.setItem("interq_local_users", JSON.stringify(localUsers));
      setSuccess(true);
      setLoading(false);
      setMessage("Local account password updated. Log in with your new password.");
      return;
    }

    try {
      const supabaseClient = getSupabaseClient();
      const session = await supabaseClient.auth.getSession();
      if (!session?.data?.session) {
        setError("Auth session missing. Please use password recovery link or request a new reset email.");
        setMessage("If this is a local account, enter email in request mode and use local reset.");
        setLoading(false);

        // if resetEmail exists and local DB is missing, still allow server attempt in case setSession happens afterwards
        if (resetEmail) {
          setMode("request");
        }
        return;
      }

      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
          <div className="flex justify-center mb-6">
            <img src="/interq-logo.png" alt="InterQ" className="h-12 object-contain" />
          </div>

          {success ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold mb-1">Password Updated!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Your password has been reset successfully.
              </p>
              <Button className="rounded-xl" onClick={() => navigate("/auth")}>Back to Sign In</Button>
            </div>
          ) : mode === "update" ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-1">Set New Password</h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Enter your new password below after following the link from your email.
              </p>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/10 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                  </div>
                )}

                <Button type="submit" className="w-full rounded-xl h-11" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-1">Forgot Password</h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Enter your email and we will send a password reset link.
              </p>

              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <Label htmlFor="recovery-email">Email</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="rounded-xl"
                  />
                </div>

                {message && (
                  <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/10 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                    </div>
                    {error.includes("email") || error.includes("Email") ? (
                      <div className="text-xs text-muted-foreground bg-muted/50 border border-muted rounded-xl px-4 py-3">
                        <p className="font-semibold mb-2">💡 Email Configuration Required</p>
                        <p>To enable password reset emails, configure an SMTP provider in Supabase:</p>
                        <ol className="list-decimal list-inside mt-2 space-y-1">
                          <li>Go to Supabase Dashboard → Project Settings</li>
                          <li>Find "Email Templates" or "Email Configuration"</li>
                          <li>Connect SendGrid, Resend, or another SMTP provider</li>
                          <li>Set redirect URL: <code className="text-xs bg-background px-1 rounded">{window.location.origin}/reset-password</code></li>
                        </ol>
                      </div>
                    ) : null}
                  </div>
                )}

                <Button type="submit" className="w-full rounded-xl h-11" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
