import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Button,
} from "@/components/ui/button";
import {
  Badge,
} from "@/components/ui/badge";
import {
  useNavigate,
} from "react-router-dom";
import {
  Settings,
  User,
  Mail,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Moon,
  Sun,
  Zap,
  LayoutDashboard,
  Banknote,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Input,
} from "@/components/ui/input";
import {
  Textarea,
} from "@/components/ui/textarea";
import {
  Label,
} from "@/components/ui/label";
import {
  Switch,
} from "@/components/ui/switch";
import {
  Separator,
} from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Checkbox,
} from "@/components/ui/checkbox";

export default function RecruiterSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [theme, setTheme] = useState("light");

  const notificationSettings = [
    { id: 1, label: "New application notifications", enabled: true },
    { id: 2, label: "Interview scheduled notifications", enabled: true },
    { id: 3, label: "Candidate status updates", enabled: true },
    { id: 4, label: "Offer response notifications", enabled: false },
    { id: 5, label: "Weekly hiring digest", enabled: true },
    { id: 6, label: "System announcements", enabled: true },
  ];

  const integrations = [
    { id: 1, name: "Slack", status: "Connected", icon: <Zap className="h-4 w-4 text-blue-500" /> },
    { id: 2, name: "Microsoft Teams", status: "Disconnected", icon: <Zap className="h-4 w-4 text-gray-400" /> },
    { id: 3, name: "Google Calendar", status: "Connected", icon: <Zap className="h-4 w-4 text-blue-500" /> },
    { id: 4, name: "Outlook Calendar", status: "Disconnected", icon: <Zap className="h-4 w-4 text-gray-400" /> },
    { id: 5, name: "Zoom", status: "Connected", icon: <Zap className="h-4 w-4 text-blue-500" /> },
    { id: 6, name: "Greenhouse ATS", status: "Disconnected", icon: <Zap className="h-4 w-4 text-gray-400" /> },
  ];

  const apiKeys = [
    { id: 1, name: "LinkedIn API", key: "lk_************abcd", created: "2024-01-15" },
    { id: 2, name: "Indeed API", key: "in_************efgh", created: "2024-02-03" },
    { id: 3, name: "Glassdoor API", key: "gl_************ijkl", created: "2024-03-22" },
  ];

  const handleToggleNotification = (id: number) => {
    // In a real app, this would update the setting via API
    console.log(`Toggled notification ${id}`);
  };

  const handleConnectIntegration = (id: number) => {
    // In a real app, this would initiate the connection flow
    console.log(`Connecting integration ${id}`);
  };

  const handleDisconnectIntegration = (id: number) => {
    // In a real app, this would disconnect the integration
    console.log(`Disconnecting integration ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="gap-2">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/recruiter")} className="gap-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      JD
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">john.doe@company.com</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@company.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="Acme Corporation" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" defaultValue="Senior Recruiter" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself..." className="min-h-[80px]" defaultValue="Experienced recruiter with a passion for finding top talent." />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => {}}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                        <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="language">Language</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weekStart">Week Starts On</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="emailUpdates" className="flex items-center gap-2 cursor-pointer">
                      <Switch checked={true} onCheckedChange={() => {}} />
                      Email updates and newsletter
                    </Label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => {}}>
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Stay updated on {setting.label.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => handleToggleNotification(setting.id)}
                    className="ml-4"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Connect your favorite tools to streamline your recruitment workflow
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowIntegrationsModal(true)}
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Integration
                </Button>
              </div>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {integration.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {integration.status === "Connected"
                            ? "Active and syncing data"
                            : "Not connected - enable to use features"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status === "Connected" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisconnectIntegration(integration.id)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnectIntegration(integration.id)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Plan</p>
                    <p className="text-2xl font-bold text-primary">Professional</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowBillingModal(true)}>
                    Change Plan
                  </Button>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm text-muted-foreground">Next Billing Date</p>
                  <p className="font-medium">April 15, 2024</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm text-muted-foreground">Amount Due</p>
                  <p className="font-medium text-green-600">$99.00</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    Visa •••• 4242
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium">Usage This Month</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Job Postings</p>
                      <p className="text-font-medium">8/50</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Active Candidates</p>
                      <p className="text-font-medium">42/500</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => {}}>
                  Update Payment Method
                </Button>
                <Button onClick={() => {}}>
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-xs text-muted-foreground">
                      Last changed: March 10, 2024
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => {}}>
                    Change Password
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">
                      Currently disabled
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => {}}>
                    Enable 2FA
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Active Sessions</p>
                    <p className="text-xs text-muted-foreground">
                      2 active sessions
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => {}}>
                    Review Sessions
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Data Export</p>
                    <p className="text-xs text-muted-foreground">
                      Download your data
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => {}}>
                    Export Data
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete your account
                    </p>
                  </div>
                  <Button variant="destructive" onClick={() => {}}>
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

       {/* Add Integration Modal */}
       <Dialog open={showIntegrationsModal} onOpenChange={setShowIntegrationsModal}>
         <DialogTrigger asChild>
           <Button variant="outline">Add Integration</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[600px] sm:mx-auto">
           <DialogHeader>
             <DialogTitle>Add New Integration</DialogTitle>
             <DialogDescription>
               Connect to third-party services to enhance your recruitment workflow
             </DialogDescription>
           </DialogHeader>
           <DialogContent className="space-y-6">
             <div className="space-y-4">
               <p className="text-muted-foreground">
                 Select the service you want to connect to:
               </p>
               <div className="space-y-3">
                 <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg cursor-pointer" onClick={() => {}}>
                   <div className="w-10 h-10 flex items-center justify-center">
                     <Zap className="h-5 w-5 text-blue-500" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium">Slack</p>
                     <p className="text-xs text-muted-foreground">
                       Get notifications in your Slack workspace
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg cursor-pointer" onClick={() => {}}>
                   <div className="w-10 h-10 flex items-center justify-center">
                     <Zap className="h-5 w-5 text-blue-500" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium">Microsoft Teams</p>
                     <p className="text-xs text-muted-foreground">
                       Receive updates in Teams channels
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg cursor-pointer" onClick={() => {}}>
                   <div className="w-10 h-10 flex items-center justify-center">
                     <Zap className="h-5 w-5 text-blue-500" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium">Google Calendar</p>
                     <p className="text-xs text-muted-foreground">
                       Sync interviews and events
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg cursor-pointer" onClick={() => {}}>
                   <div className="w-10 h-10 flex items-center justify-center">
                     <Zap className="h-5 w-5 text-blue-500" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium">Zoom</p>
                     <p className="text-xs text-muted-foreground">
                       Launch video interviews directly
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </DialogContent>
           <DialogContent>
             <div className="flex justify-end gap-3">
               <Button variant="outline" onClick={() => setShowIntegrationsModal(false)}>
                 Cancel
               </Button>
               <Button onClick={() => setShowIntegrationsModal(false)}>
                 Add Integration
               </Button>
             </div>
           </DialogContent>
         </DialogContent>
       </Dialog>

       {/* Billing Modal */}
       <Dialog open={showBillingModal} onOpenChange={setShowBillingModal}>
         <DialogTrigger asChild>
           <Button variant="outline">Change Plan</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[600px] sm:mx-auto">
           <DialogHeader>
             <DialogTitle>Change Your Plan</DialogTitle>
             <DialogDescription>
               Select the plan that best fits your recruitment needs
             </DialogDescription>
           </DialogHeader>
           <DialogContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {}}>
                 <CardContent className="p-6 text-center">
                   <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
                   <h3 className="font-semibold">Free</h3>
                   <p className="text-muted-foreground mb-4">$0/month</p>
                   <ul className="text-left text-xs space-y-2">
                     <li>• 5 job postings/month</li>
                     <li>• 50 candidate views/month</li>
                     <li>• Basic email support</li>
                     <li>• Limited to 1 user</li>
                   </ul>
                 </CardContent>
               </Card>
               <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary" onClick={() => {}}>
                 <CardContent className="p-6 text-center">
                   <CheckCircle className="h-8 w-8 text-primary mb-4" />
                   <h3 className="font-semibold">Professional</h3>
                   <p className="text-muted-foreground mb-4">$99/month</p>
                   <ul className="text-left text-xs space-y-2">
                     <li>• 50 job postings/month</li>
                     <li>• 500 candidate views/month</li>
                     <li>• Priority email support</li>
                     <li>• Up to 5 users</li>
                     <li>• Advanced reporting</li>
                     <li>• API access</li>
                   </ul>
                 </CardContent>
               </Card>
               <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {}}>
                 <CardContent className="p-6 text-center">
                   <CheckCircle className="h-8 w-8 text-purple-600 mb-4" />
                   <h3 className="font-semibold">Enterprise</h3>
                   <p className="text-muted-foreground mb-4">$299/month</p>
                   <ul className="text-left text-xs space-y-2">
                     <li>• Unlimited job postings</li>
                     <li>• Unlimited candidate views</li>
                     <li>• Dedicated account manager</li>
                     <li>• Unlimited users</li>
                     <li>• Custom integrations</li>
                     <li>• Advanced analytics</li>
                     <li>• SLA guarantee</li>
                   </ul>
                 </CardContent>
               </Card>
             </div>
           </DialogContent>
           <DialogContent>
             <div className="flex justify-end gap-3">
               <Button variant="outline" onClick={() => setShowBillingModal(false)}>
                 Cancel
               </Button>
               <Button onClick={() => setShowBillingModal(false)}>
                 Select Plan
               </Button>
             </div>
           </DialogContent>
         </DialogContent>
       </Dialog>
    </div>
   );
}