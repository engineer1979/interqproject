import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { mockRoles, mockUsers, mockAuditLogs, mockMetrics, chartData } from '@/data/roleManagementData';
import { Role, User, AuditLog, MODULES, PermissionAction, ModuleType } from '@/types/roleManagement';
import { format } from 'date-fns';
import {
  Shield, Users, Plus, MoreHorizontal, Search, Filter,
  Edit, Trash2, Power, Eye, ChevronDown, ChevronRight,
  LayoutDashboard, BarChart3, CheckCircle2, XCircle,
  Download, Calendar, Clock, UserCog, Settings,
  Network, ClipboardList, AlertTriangle, TrendingUp,
  UserPlus, UserMinus, ShieldCheck, ShieldAlert,
  ArrowUpRight, ArrowDownRight, RefreshCw,
  Briefcase, Users as UsersIcon, Calendar as CalendarIcon,
  FileText, BarChart, Settings as SettingsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  PieChart, Pie, Cell, BarChart as RechartsBar, Bar, XAxis,
  YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line,
  Legend, AreaChart, Area
} from 'recharts';

const moduleIcons: Record<ModuleType, typeof Briefcase> = {
  jobOpenings: Briefcase,
  candidates: UsersIcon,
  interviews: CalendarIcon,
  offers: FileText,
  reports: BarChart,
  settings: SettingsIcon
};

export default function RoleManagementDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState(false);
  const [roles, setRoles] = useState(mockRoles);
  const [users, setUsers] = useState(mockUsers);
  const [auditLogs] = useState(mockAuditLogs);
  const [userFilters, setUserFilters] = useState({ role: 'all', department: 'all', status: 'all' });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user => {
    if (userFilters.role !== 'all' && !user.roles.includes(userFilters.role)) return false;
    if (userFilters.department !== 'all' && user.department !== userFilters.department) return false;
    if (userFilters.status !== 'all' && user.status !== userFilters.status) return false;
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const departments = [...new Set(users.map(u => u.department))];

  const handlePermissionToggle = (roleId: string, module: ModuleType, action: PermissionAction) => {
    setRoles(roles.map(role => {
      if (role.id !== roleId) return role;
      return {
        ...role,
        permissions: role.permissions.map(perm => {
          if (perm.module !== module) return perm;
          return {
            ...perm,
            actions: {
              ...perm.actions,
              [action]: !perm.actions[action]
            }
          };
        })
      };
    }));
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'inactive': return 'bg-gray-500/10 text-gray-600 border-gray-200';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'UPDATE': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'DELETE': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'DEACTIVATE': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'ASSIGN_ROLE': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const RoleCard = ({ role }: { role: Role }) => (
    <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", role.color)}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">{role.name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-xs", getStatusColor(role.status))}>
            {role.status === 'active' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
            {role.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{role.userCount} users assigned</span>
          </div>
          <div className="text-muted-foreground text-xs">
            Updated {format(new Date(role.updatedAt), 'MMM d, yyyy')}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Module Access</p>
          <div className="flex flex-wrap gap-1.5">
            {role.permissions.slice(0, 4).map(perm => {
              const moduleInfo = MODULES.find(m => m.key === perm.module);
              const ModuleIcon = moduleIcons[perm.module];
              return (
                <Tooltip key={perm.module} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs",
                      perm.actions.view ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <ModuleIcon className="h-3 w-3" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p className="font-medium">{moduleInfo?.label}</p>
                    <p className="text-muted-foreground">
                      {perm.actions.view ? 'Has access' : 'No access'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            {role.permissions.length > 4 && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                    +{role.permissions.length - 4}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p>{role.permissions.length - 4} more modules</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={() => {
              setSelectedRole(role);
              setIsEditPermissionsOpen(true);
            }}
          >
            <Shield className="h-3 w-3 mr-1" />
            Permissions
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCog className="h-4 w-4 mr-2" />
                Assign Users
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-orange-600">
                <Power className="h-4 w-4 mr-2" />
                {role.status === 'active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage organizational roles, permissions, and user access levels
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Add a new role and configure its permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input id="name" placeholder="e.g., Team Lead" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe the role's purpose..." />
                  </div>
                  <div className="grid gap-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'].map(color => (
                        <div key={color} className={cn("w-8 h-8 rounded-md cursor-pointer border-2", color)} />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddRoleOpen(false)}>Create Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.totalRoles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2 this month
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Roles</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.activeRoles}</div>
              <Progress value={(mockMetrics.activeRoles / mockMetrics.totalRoles) * 100} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +3 this week
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Permission Gaps</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.permissionGaps}</div>
              <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Roles</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden md:inline">Hierarchy</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden md:inline">Audit</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoles.map(role => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            {/* Filters & Bulk Actions */}
            <div className="flex flex-col md:flex-row justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <select
                  className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                  value={userFilters.role}
                  onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
                >
                  <option value="all">All Roles</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
                <select
                  className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                  value={userFilters.department}
                  onChange={(e) => setUserFilters({ ...userFilters, department: e.target.value })}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                  value={userFilters.status}
                  onChange={(e) => setUserFilters({ ...userFilters, status: e.target.value })}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedUsers.length} selected
                  </span>
                  <Button variant="outline" size="sm" className="gap-1">
                    <UserPlus className="h-4 w-4" />
                    Assign Role
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-orange-600">
                    <UserMinus className="h-4 w-4" />
                    Remove Role
                  </Button>
                  <Button variant="outline" size="sm">
                    Activate/Deactivate
                  </Button>
                </div>
              )}
            </div>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id} className={cn(selectedUsers.includes(user.id) && "bg-muted/50")}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="text-xs">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{user.department}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map(roleName => (
                              <Badge key={roleName} variant="secondary" className="text-xs">
                                {roleName}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-xs", getStatusColor(user.status))}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(user.lastActive), 'MMM d, h:mm a')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Roles</DropdownMenuItem>
                              <DropdownMenuItem>View Activity</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-orange-600">
                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hierarchy Tab */}
          <TabsContent value="hierarchy" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Organization Hierarchy</CardTitle>
                    <CardDescription>Visual representation of role reporting lines</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-8 overflow-x-auto">
                  {/* Level 0 - Admin */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="w-48 p-4 rounded-xl border-2 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/30 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mb-2">
                            <Shield className="h-6 w-6 text-white" />
                          </div>
                          <p className="font-semibold text-sm">Administrator</p>
                          <p className="text-xs text-muted-foreground">3 users</p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connecting Line */}
                    <div className="w-0.5 h-8 bg-border" />
                    
                    {/* Level 1 - Direct Reports */}
                    <div className="flex flex-wrap justify-center gap-4">
                      {roles.filter(r => r.status === 'active').slice(0, 4).map(role => (
                        <div key={role.id} className="flex flex-col items-center gap-2">
                          <div className="relative group">
                            <div className="w-40 p-3 rounded-xl border bg-card hover:shadow-lg transition-all cursor-pointer hover:border-primary/30">
                              <div className="flex flex-col items-center text-center">
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-2", role.color)}>
                                  <Shield className="h-5 w-5 text-white" />
                                </div>
                                <p className="font-medium text-sm">{role.name}</p>
                                <p className="text-xs text-muted-foreground">{role.userCount} users</p>
                              </div>
                            </div>
                            <div className="absolute -right-4 top-1/2 w-4 h-0.5 bg-border opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Connecting Lines */}
                    <div className="w-0.5 h-8 bg-border" />
                    
                    {/* Level 2 - Extended Roles */}
                    <div className="flex flex-wrap justify-center gap-4">
                      {['Interviewer', 'HR Assistant'].map((name, i) => (
                        <div key={i} className="relative group">
                          <div className="w-36 p-3 rounded-lg border bg-card hover:shadow-md transition-all cursor-pointer hover:border-primary/30">
                            <div className="flex flex-col items-center text-center">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-1.5">
                                <Users className="h-4 w-4 text-purple-500" />
                              </div>
                              <p className="text-sm font-medium">{name}</p>
                              <p className="text-xs text-muted-foreground">
                                {name === 'Interviewer' ? '15 users' : '5 users'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Drag & Drop Hint */}
                  <div className="mt-8 p-4 border-2 border-dashed rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Drag and drop</span> roles to reassign hierarchy
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Changes will be reflected immediately in permissions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Audit & Logs</CardTitle>
                    <CardDescription>Track all role and permission changes</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Changes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-xs", getActionBadgeColor(log.action))}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{log.entityName}</p>
                            <p className="text-xs text-muted-foreground capitalize">{log.entityType}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {log.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{log.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.changes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {log.changes.map((change, i) => (
                                <Tooltip key={i} delayDuration={0}>
                                  <TooltipTrigger>
                                    <Badge variant="secondary" className="text-xs">
                                      {change.field}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    <p><span className="text-red-500">{change.oldValue}</span> → <span className="text-green-500">{change.newValue}</span></p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Users by Role */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Users by Role</CardTitle>
                  <CardDescription>Distribution of users across roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="users"
                          label={({ name, users }) => `${name}: ${users}`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Role Activity Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Role Activity</CardTitle>
                  <CardDescription>Permission changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { month: 'Jan', changes: 12 },
                        { month: 'Feb', changes: 18 },
                        { month: 'Mar', changes: 25 },
                        { month: 'Apr', changes: 15 },
                        { month: 'May', changes: 22 },
                        { month: 'Jun', changes: 30 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Area type="monotone" dataKey="changes" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Active vs Inactive */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Active vs Inactive Roles</CardTitle>
                  <CardDescription>Current role status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBar data={[
                        { status: 'Active', count: 5 },
                        { status: 'Inactive', count: 1 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      </RechartsBar>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Permission Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Permission Usage</CardTitle>
                  <CardDescription>Most used permissions across roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MODULES.map(module => (
                      <div key={module.key} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{module.label}</span>
                          <span className="text-muted-foreground">
                            {Math.floor(Math.random() * 40 + 60)}%
                          </span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 40 + 60)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
                <CardDescription>Configure system-wide RBAC settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Enable RBAC System</p>
                      <p className="text-sm text-muted-foreground">Control access based on user roles</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <ShieldAlert className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium">Permission Inheritance</p>
                      <p className="text-sm text-muted-foreground">Child roles inherit parent permissions</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">Require Approval for Role Changes</p>
                      <p className="text-sm text-muted-foreground">Admin approval needed for permission updates</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Permissions</CardTitle>
                <CardDescription>Configure default permissions for new roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MODULES.map(module => (
                    <div key={module.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const ModuleIcon = moduleIcons[module.key];
                          return <ModuleIcon className="h-5 w-5 text-muted-foreground" />;
                        })()}
                        <span className="font-medium">{module.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox defaultChecked />
                          View
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox />
                          Create
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox />
                          Edit
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox />
                          Delete
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4">Save Default Permissions</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure when to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Role Changes</p>
                    <p className="text-sm text-muted-foreground">Notify when roles are created, updated, or deleted</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Permission Updates</p>
                    <p className="text-sm text-muted-foreground">Notify when permissions are modified</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">User Assignments</p>
                    <p className="text-sm text-muted-foreground">Notify when users are assigned or removed from roles</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify on suspicious access patterns</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Permission Edit Dialog */}
        <Dialog open={isEditPermissionsOpen} onOpenChange={setIsEditPermissionsOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Edit Permissions for {selectedRole?.name}
              </DialogTitle>
              <DialogDescription>
                Configure module access and actions for this role
              </DialogDescription>
            </DialogHeader>
            {selectedRole && (
              <div className="space-y-4 py-4">
                {MODULES.map(module => {
                  const perm = selectedRole.permissions.find(p => p.module === module.key);
                  const ModuleIcon = moduleIcons[module.key];
                  return (
                    <div key={module.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <ModuleIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{module.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {perm?.actions.view ? 'Access granted' : 'No access'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={perm?.actions.view || false}
                          onCheckedChange={(checked) => 
                            handlePermissionToggle(selectedRole.id, module.key, 'view')
                          }
                        />
                      </div>
                      
                      {perm?.actions.view && (
                        <div className="grid grid-cols-4 gap-4 ml-13">
                          {(['view', 'create', 'edit', 'delete'] as PermissionAction[]).map(action => (
                            <label key={action} className="flex items-center gap-2 text-sm cursor-pointer">
                              <Checkbox
                                checked={perm.actions[action]}
                                onCheckedChange={() => 
                                  handlePermissionToggle(selectedRole.id, module.key, action)
                                }
                              />
                              <span className="capitalize">{action}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditPermissionsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditPermissionsOpen(false)}>
                Save Permissions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
