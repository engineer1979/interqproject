import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Settings, Bell, Moon, Globe, Shield, LogOut, ChevronRight } from "lucide-react";

type Tab = "account" | "notifications" | "appearance" | "privacy";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("account");
  const [notifications, setNotifications] = useState({
    email: true, push: true, sms: false,
    newApplication: true, interviewReminder: true, offerUpdate: true, platformNews: false,
  });
  const [appearance, setAppearance] = useState({ theme: "system", language: "en", timezone: "Asia/Karachi", density: "comfortable" });
  const [privacy, setPrivacy] = useState({ profileVisible: true, showEmail: false, showPhone: false, dataCollection: true });

  const save = (label: string) => toast({ title: "Settings Saved", description: `${label} updated successfully.` });

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "account", label: "Account", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Moon },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <t.icon className="h-4 w-4" />{t.label}
              </button>
            ))}
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut className="h-4 w-4" />Sign Out
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {tab === "account" && (
            <>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Account Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                    </div>
                    <div>
                      <div className="font-semibold">{user?.name}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                      <Badge variant="outline" className="capitalize mt-1">{user?.role}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Display Name</Label><Input defaultValue={user?.name || ""} /></div>
                    <div><Label>Email</Label><Input defaultValue={user?.email || ""} type="email" /></div>
                  </div>
                  <Button onClick={() => save("Account information")}>Save Changes</Button>
                </CardContent>
              </Card>
              <Card className="border-red-200">
                <CardHeader className="pb-3"><CardTitle className="text-base text-red-600">Danger Zone</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
                    <div><p className="font-medium text-sm">Deactivate Account</p><p className="text-xs text-muted-foreground">Temporarily disable your account</p></div>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => toast({ title: "Account Deactivated", description: "Your account has been deactivated.", variant: "destructive" })}>Deactivate</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
                    <div><p className="font-medium text-sm">Delete Account</p><p className="text-xs text-muted-foreground">Permanently delete all your data</p></div>
                    <Button size="sm" variant="destructive" onClick={() => toast({ title: "Confirmation Required", description: "Please contact support to delete your account." })}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "notifications" && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="font-medium text-sm mb-3">Channels</p>
                  {[
                    { key: "email", label: "Email notifications", desc: "Receive notifications via email" },
                    { key: "push", label: "Push notifications", desc: "Browser push notifications" },
                    { key: "sms", label: "SMS notifications", desc: "Text message alerts (charges may apply)" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div><p className="font-medium text-sm">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                      <Switch checked={notifications[item.key as keyof typeof notifications] as boolean} onCheckedChange={v => setNotifications({ ...notifications, [item.key]: v })} />
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <p className="font-medium text-sm mb-3">Activity Alerts</p>
                  {[
                    { key: "newApplication", label: "New applications", desc: "When a candidate applies to your job" },
                    { key: "interviewReminder", label: "Interview reminders", desc: "Reminders before scheduled interviews" },
                    { key: "offerUpdate", label: "Offer updates", desc: "When offer status changes" },
                    { key: "platformNews", label: "Platform news", desc: "Product updates and announcements" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div><p className="font-medium text-sm">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                      <Switch checked={notifications[item.key as keyof typeof notifications] as boolean} onCheckedChange={v => setNotifications({ ...notifications, [item.key]: v })} />
                    </div>
                  ))}
                </div>
                <Button onClick={() => save("Notification preferences")}>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {tab === "appearance" && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Appearance & Language</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <Select value={appearance.theme} onValueChange={v => setAppearance({ ...appearance, theme: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={appearance.language} onValueChange={v => setAppearance({ ...appearance, language: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ur">Urdu</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select value={appearance.timezone} onValueChange={v => setAppearance({ ...appearance, timezone: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Karachi">Asia/Karachi (PKT)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => save("Appearance settings")}>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {tab === "privacy" && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Privacy Controls</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "profileVisible", label: "Public profile", desc: "Allow others to view your profile" },
                  { key: "showEmail", label: "Show email address", desc: "Display your email on your public profile" },
                  { key: "showPhone", label: "Show phone number", desc: "Display your phone on your public profile" },
                  { key: "dataCollection", label: "Analytics & Improvements", desc: "Help us improve by sharing usage data" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="font-medium text-sm">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={privacy[item.key as keyof typeof privacy]} onCheckedChange={v => setPrivacy({ ...privacy, [item.key]: v })} />
                  </div>
                ))}
                <Button onClick={() => save("Privacy settings")}>Save Privacy Settings</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
