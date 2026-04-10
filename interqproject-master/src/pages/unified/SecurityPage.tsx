import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, Key, Lock, AlertTriangle, CheckCircle, Smartphone, Globe } from "lucide-react";

const SESSIONS = [
  { id: "1", device: "Chrome on macOS", location: "Karachi, PK", ip: "103.45.x.x", time: "Active now", current: true },
  { id: "2", device: "Safari on iPhone", location: "Lahore, PK", ip: "42.201.x.x", time: "2 hours ago", current: false },
  { id: "3", device: "Firefox on Windows", location: "Islamabad, PK", ip: "39.57.x.x", time: "Yesterday", current: false },
];

export default function SecurityPage() {
  const { toast } = useToast();
  const [mfa, setMfa] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [suspiciousAlerts, setSuspiciousAlerts] = useState(true);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.new) { toast({ title: "Error", description: "All fields required.", variant: "destructive" }); return; }
    if (passwords.new !== passwords.confirm) { toast({ title: "Error", description: "Passwords don't match.", variant: "destructive" }); return; }
    if (passwords.new.length < 8) { toast({ title: "Error", description: "Password must be at least 8 characters.", variant: "destructive" }); return; }
    toast({ title: "Password Changed", description: "Your password has been updated successfully." });
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground">Manage your account security settings</p>
      </div>

      {/* Security Score */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-5 flex items-center gap-4">
          <CheckCircle className="h-10 w-10 text-green-600 flex-shrink-0" />
          <div>
            <div className="font-semibold text-green-800">Security Score: 72/100</div>
            <div className="text-sm text-green-700">Enable 2FA to reach 100 and fully secure your account.</div>
          </div>
          <Badge className="ml-auto bg-green-100 text-green-700">Good</Badge>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Key className="h-4 w-4" />Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Current Password</Label><Input type="password" placeholder="••••••••" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} /></div>
          <div><Label>New Password</Label><Input type="password" placeholder="Min 8 characters" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} /></div>
          <div><Label>Confirm New Password</Label><Input type="password" placeholder="Repeat new password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} /></div>
          <Button onClick={handlePasswordChange}>Update Password</Button>
        </CardContent>
      </Card>

      {/* Two-Factor Auth */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Smartphone className="h-4 w-4" />Two-Factor Authentication</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-sm">Authenticator App</p>
              <p className="text-xs text-muted-foreground">Use Google Authenticator or similar apps for extra security</p>
            </div>
            <Switch checked={mfa} onCheckedChange={(v) => { setMfa(v); toast({ title: v ? "2FA Enabled" : "2FA Disabled", description: v ? "Two-factor authentication is now active." : "Two-factor authentication disabled." }); }} />
          </div>
          {mfa && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-1">Setup Instructions:</p>
              <ol className="text-muted-foreground space-y-1 list-decimal list-inside text-xs">
                <li>Download Google Authenticator or Authy</li>
                <li>Scan the QR code below with the app</li>
                <li>Enter the 6-digit code to confirm setup</li>
              </ol>
              <div className="mt-3 w-24 h-24 bg-white border rounded flex items-center justify-center text-xs text-muted-foreground">QR Code</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Security Alerts</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Login notifications", desc: "Get emailed when a new device logs in", value: loginAlerts, setter: setLoginAlerts },
            { label: "Suspicious activity alerts", desc: "Alert when unusual activity is detected", value: suspiciousAlerts, setter: setSuspiciousAlerts },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div><p className="font-medium text-sm">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
              <Switch checked={item.value} onCheckedChange={(v) => { item.setter(v); toast({ title: `${item.label} ${v ? "enabled" : "disabled"}` }); }} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" />Active Sessions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {SESSIONS.map(session => (
            <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{session.device}</span>
                  {session.current && <Badge className="text-xs bg-green-100 text-green-700">Current</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{session.location} · {session.ip} · {session.time}</p>
              </div>
              {!session.current && (
                <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => toast({ title: "Session Terminated", description: `Session from ${session.device} terminated.` })}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" className="w-full text-red-600" onClick={() => toast({ title: "All Sessions Terminated", description: "All other sessions have been logged out." })}>
            Terminate All Other Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
