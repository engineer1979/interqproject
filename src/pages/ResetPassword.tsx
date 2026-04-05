import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Loader2 } from "lucide-react";

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlbmx0emxzbmxiendsaXptaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzQxNDgsImV4cCI6MjA3OTkxMDE0OH0.O0y6JNNuUo9WOdd-Yq12M9sTwTc8YduaY1p_AG3NpCE';
const SUPABASE_URL = 'https://lenltzlsnlbzwlizmijc.supabase.co';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const t = params.get('access_token');
    const type = params.get('type');
    
    if (t && type === 'recovery') {
      setToken(t);
    } else {
      setError("Invalid link");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Minimum 6 characters");
      return;
    }

    setLoading(true);

    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_KEY
      },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      alert("Password reset successful!");
      navigate('/auth');
    } else {
      const data = await res.json();
      setError(data.msg || "Error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-blue-100 p-3 rounded-full">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reset Password
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/auth/forgot-password" className="text-sm text-gray-600">← Request new link</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

