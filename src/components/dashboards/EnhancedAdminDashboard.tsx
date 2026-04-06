import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Users,
  Building2,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Bell,
  Lock,
  Activity,
  Server,
  Database,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  UserPlus,
  Briefcase,
  FileText,
  Download,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Crown,
  UserCog,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  companies: number;
  recruiters: number;
  jobseekers: number;
  assessmentsTaken: number;
  interviewsConducted: number;
  hires: number;
  revenue: number;
}

interface UserManagement {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'company' | 'jobseeker';
  status: 'active' | 'inactive' | 'suspended';
  joinedDate: string;
  lastActive: string;
  company?: string;
}

interface SystemHealth {
  api: { status: 'healthy' | 'degraded' | 'down'; uptime: number; responseTime: number };
  database: { status: 'healthy' | 'degraded' | 'down'; connections: number; queries: number };
  storage: { used: number; total: number; percentage: number };
  bandwidth: { used: number; total: number; percentage: number };
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

interface FraudAlert {
  id: string;
  type: string;
  candidate: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  detectedAt: string;
  status: 'investigating' | 'resolved' | 'dismissed';
}

export function EnhancedAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  const platformStats: PlatformStats = {
    totalUsers: 12453,
    activeUsers: 8234,
    companies: 156,
    recruiters: 423,
    jobseekers: 11874,
    assessmentsTaken: 4523,
    interviewsConducted: 1847,
    hires: 342,
    revenue: 284500
  };

  const systemHealth: SystemHealth = {
    api: { status: 'healthy', uptime: 99.98, responseTime: 120 },
    database: { status: 'healthy', connections: 847, queries: 12453 },
    storage: { used: 847, total: 2000, percentage: 42.35 },
    bandwidth: { used: 1247, total: 5000, percentage: 24.94 }
  };

  const users: UserManagement[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      role: 'recruiter',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago',
      company: 'TechCorp Solutions'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@enterprise.com',
      role: 'company',
      status: 'active',
      joinedDate: '2023-11-20',
      lastActive: '30 minutes ago',
      company: 'Enterprise Inc'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@mail.com',
      role: 'jobseeker',
      status: 'inactive',
      joinedDate: '2024-02-10',
      lastActive: '3 days ago'
    },
    {
      id: '4',
      name: 'Emily Brown',
      email: 'emily.b@startup.io',
      role: 'admin',
      status: 'active',
      joinedDate: '2023-06-01',
      lastActive: '5 minutes ago'
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: '1',
      action: 'User Login',
      user: 'john.smith@techcorp.com',
      role: 'recruiter',
      timestamp: '2 minutes ago',
      details: 'Successful login from 192.168.1.1',
      severity: 'info'
    },
    {
      id: '2',
      action: 'Role Changed',
      user: 'admin@interq.com',
      role: 'admin',
      timestamp: '15 minutes ago',
      details: 'User role changed from recruiter to company_admin',
      severity: 'warning'
    },
    {
      id: '3',
      action: 'Failed Login Attempt',
      user: 'unknown@fake.com',
      role: 'unknown',
      timestamp: '1 hour ago',
      details: 'Multiple failed login attempts detected',
      severity: 'critical'
    },
    {
      id: '4',
      action: 'Data Export',
      user: 'sarah.j@enterprise.com',
      role: 'company',
      timestamp: '2 hours ago',
      details: 'Exported candidate data report (234 records)',
      severity: 'info'
    }
  ];

  const fraudAlerts: FraudAlert[] = [
    {
      id: '1',
      type: 'Duplicate Account',
      candidate: 'Alex Johnson',
      description: 'Multiple accounts detected with similar profile information',
      severity: 'medium',
      detectedAt: '1 hour ago',
      status: 'investigating'
    },
    {
      id: '2',
      type: 'Suspicious Activity',
      candidate: 'Jane Doe',
      description: 'Unusual assessment completion pattern detected',
      severity: 'high',
      detectedAt: '3 hours ago',
      status: 'investigating'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'resolved': return 'text-green-600 bg-green-500/10';
      case 'degraded':
      case 'inactive': return 'text-yellow-600 bg-yellow-500/10';
      case 'down':
      case 'suspended': return 'text-red-600 bg-red-500/10';
      case 'investigating': return 'text-blue-600 bg-blue-500/10';
      default: return 'text-slate-600 bg-slate-500/10';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-500/10';
      case 'medium': return 'text-yellow-600 bg-yellow-500/10';
      case 'high':
      case 'critical': return 'text-red-600 bg-red-500/10';
      case 'info': return 'text-slate-600 bg-slate-500/10';
      default: return 'text-slate-600 bg-slate-500/10';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'recruiter': return <UserCog className="w-4 h-4" />;
      case 'company': return <Building2 className="w-4 h-4" />;
      case 'jobseeker': return <UserCheck className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System-wide analytics and management</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{Math.round(platformStats.activeUsers / platformStats.totalUsers * 100)}% active</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-2xl font-bold">{platformStats.companies}</p>
                <p className="text-xs text-muted-foreground">Active recruiters: {platformStats.recruiters}</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Job Seekers</p>
                <p className="text-2xl font-bold">{platformStats.jobseekers.toLocaleString()}</p>
                <p className="text-xs text-green-600">Active: {platformStats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assessments</p>
                <p className="text-2xl font-bold">{platformStats.assessmentsTaken.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Interviews: {platformStats.interviewsConducted.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(platformStats.revenue)}</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="security">Security & Audit</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">API Status</p>
                        <p className="text-sm text-muted-foreground">
                          {systemHealth.api.uptime}% uptime • {systemHealth.api.responseTime}ms response
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor('healthy')}>Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Database</p>
                        <p className="text-sm text-muted-foreground">
                          {systemHealth.database.connections} connections • {systemHealth.database.queries.toLocaleString()} queries
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor('healthy')}>Healthy</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage</span>
                      <span className="font-semibold">{systemHealth.storage.percentage}%</span>
                    </div>
                    <Progress value={systemHealth.storage.percentage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bandwidth</span>
                      <span className="font-semibold">{systemHealth.bandwidth.percentage}%</span>
                    </div>
                    <Progress value={systemHealth.bandwidth.percentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fraud Detection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Fraud Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fraudAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{alert.type}</p>
                          <p className="text-sm text-muted-foreground">{alert.candidate}</p>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.detectedAt}</span>
                        <Button variant="outline" size="sm">
                          {alert.status === 'investigating' ? 'Investigate' : alert.status}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-3 bg-slate-500/5 rounded-lg">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {getRoleIcon(log.role)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.user} • {log.role}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getSeverityColor(log.severity)} variant="outline">
                        {log.severity}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="jobseeker">Job Seeker</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Company</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Last Active</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getRoleIcon(user.role)}
                              <span className="text-sm capitalize">{user.role}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={getStatusColor(user.status)} variant="outline">
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{user.company || '-'}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{user.lastActive}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Health & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">99.98%</div>
                      <p className="text-sm text-muted-foreground">API Uptime</p>
                      <div className="mt-2">
                        <TrendingUp className="w-4 h-4 text-green-600 inline" />
                        <span className="text-xs text-green-600 ml-1">+0.02%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">120ms</div>
                      <p className="text-sm text-muted-foreground">Avg Response Time</p>
                      <div className="mt-2">
                        <TrendingDown className="w-4 h-4 text-green-600 inline" />
                        <span className="text-xs text-green-600 ml-1">-15ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">847</div>
                      <p className="text-sm text-muted-foreground">DB Connections</p>
                      <div className="mt-2">
                        <Activity className="w-4 h-4 text-yellow-600 inline" />
                        <span className="text-xs text-yellow-600 ml-1">Normal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">42.4%</div>
                      <p className="text-sm text-muted-foreground">Storage Used</p>
                      <div className="mt-2">
                        <Server className="w-4 h-4 text-blue-600 inline" />
                        <span className="text-xs text-blue-600 ml-1">847GB / 2TB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Audit Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-lg ${getSeverityColor(log.severity)}`}>
                      {log.severity === 'critical' || log.severity === 'warning' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <Activity className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{log.action}</p>
                        <Badge className={getSeverityColor(log.severity)} variant="outline">
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{log.details}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{log.user}</span>
                        <span>•</span>
                        <span>{log.role}</span>
                        <span>•</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Global Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Multi-factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require MFA for all admin accounts</p>
                    </div>
                  </div>
                    <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Session Management</p>
                      <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                    </div>
                  </div>
                    <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Fraud Detection</p>
                      <p className="text-sm text-muted-foreground">Enable AI-powered fraud monitoring</p>
                    </div>
                  </div>
                    <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-semibold">Automated Backups</p>
                      <p className="text-sm text-muted-foreground">Daily backup at 2:00 AM UTC</p>
                    </div>
                  </div>
                    <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}