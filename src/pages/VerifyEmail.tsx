import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { 
  Mail, Lock, ArrowLeft, ArrowRight, CheckCircle, Loader2, 
  MessageSquare, Shield, Smartphone, RefreshCw, AlertCircle, Sparkles,
  Clock, Zap
} from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, verifyEmail, verifyOTP, requestVerification } = useAuth();
  
  const [mode, setMode] = useState<"magic" | "otp">("magic");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailChanged, setEmailChanged] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || "");
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (mode === "otp" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [mode]);

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit) && newOtp.join("").length === 6) {
      handleOTPVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPVerify = async (otpCode: string) => {
    setError("");
    setIsVerifying(true);
    
    const result = await verifyOTP(user?.email || "", otpCode);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      setError(result.error || "Invalid verification code");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
    setIsVerifying(false);
  };

  const handleMagicLinkVerify = async () => {
    setError("");
    setIsVerifying(true);
    
    const result = await verifyEmail("demo_token");
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      setError(result.error || "Verification failed");
    }
    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setError("");
    setIsResending(true);
    
    const result = await requestVerification(user?.email || "");
    
    if (result.success) {
      setResendCooldown(60);
    } else {
      setError(result.error || "Failed to resend");
    }
    setIsResending(false);
  };

  const handleChangeEmail = () => {
    setEmailChanged(true);
    setNewEmail("");
  };

  const handleConfirmEmailChange = () => {
    if (newEmail.includes("@")) {
      setEmailChanged(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-6">Redirecting you to your dashboard...</p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2"
          onClick={() => navigate("/auth")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </Button>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {emailChanged ? "Update Email Address" : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-center">
              {emailChanged 
                ? "Enter your new email address"
                : mode === "magic"
                  ? `We've sent a verification link to`
                  : `Enter the 6-digit code sent to`
              }
            </CardDescription>
            {!emailChanged && (
              <p className="font-semibold text-gray-900 text-center">{user?.email}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {emailChanged ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="new@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setEmailChanged(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleConfirmEmailChange}>
                    Update Email
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Button
                    variant={mode === "magic" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setMode("magic")}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Magic Link
                  </Button>
                  <Button
                    variant={mode === "otp" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setMode("otp")}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    SMS / OTP
                  </Button>
                </div>

                {mode === "magic" ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                      <Mail className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <p className="text-sm text-blue-800 mb-4">
                        Click the button below to automatically verify your email address. 
                        This works instantly for demo accounts.
                      </p>
                      <Button onClick={handleMagicLinkVerify} disabled={isVerifying} className="w-full">
                        {isVerifying ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Zap className="w-4 h-4 mr-2" />
                        )}
                        Verify Email Instantly
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-center block">Enter 6-digit code</label>
                      <div className="flex gap-2 justify-center">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-center text-gray-500">
                        Demo tip: Use code <Badge variant="outline" className="font-mono">123456</Badge>
                      </p>
                    </div>

                    {isVerifying && (
                      <div className="flex items-center justify-center gap-2 text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Verifying...</span>
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}
                  </div>
                )}

                {error && mode === "magic" && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="ghost" size="sm" onClick={handleChangeEmail}>
                    <Mail className="w-4 h-4 mr-1" />
                    Change email
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleResend}
                    disabled={isResending || resendCooldown > 0}
                  >
                    {isResending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-1" />
                    )}
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                  </Button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800">Verification expires in 24 hours</p>
                      <p className="text-amber-700 mt-1">
                        If you don't see the email, check your spam folder or use the OTP option.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal">
            Contact Support
          </Button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
