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
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  MessageCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Send,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { format, subMonths } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const monthlyHiringData = [
  { month: 'Jan', applications: 45, hires: 3 },
  { month: 'Feb', applications: 52, hires: 5 },
  { month: 'Mar', applications: 68, hires: 7 },
  { month: 'Apr', applications: 74, hires: 4 },
  { month: 'May', applications: 89, hires: 8 },
  { month: 'Jun', applications: 95, hires: 6 },
  { month: 'Jul', applications: 110, hires: 9 },
  { month: 'Aug', applications: 125, hires: 11 },
  { month: 'Sep', applications: 140, hires: 12 },
  { month: 'Oct', applications: 135, hires: 10 },
  { month: 'Nov', applications: 150, hires: 14 },
  { month: 'Dec', applications: 160, hires: 13 },
];

const candidateSources = [
  { name: 'LinkedIn', value: 35, color: '#0077B5' },
  { name: 'Job Portals', value: 28, color: '#10B981' },
  { name: 'Referrals', value: 22, color: '#F59E0B' },
  { name: 'Direct', value: 15, color: '#8B5CF6' },
];

const departmentPositions = [
  { department: 'Engineering', positions: 12, filled: 8 },
  { department: 'Sales', positions: 8, filled: 5 },
  { department: 'Marketing', positions: 5, filled: 3 },
  { department: 'Design', positions: 4, filled: 2 },
  { department: 'Operations', positions: 6, filled: 4 },
  { department: 'HR', positions: 3, filled: 2 },
];

const reportTypes = [
  { value: "hiring", label: "Hiring Overview" },
  { value: "sources", label: "Candidate Sources" },
  { value: "departments", label: "Department Roles" },
  { value: "pipeline", label: "Pipeline Metrics" },
  { value: "activity", label: "Recent Activity" },
];

export default function RecruiterReports() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("hiring");
  const [dateRange, setDateRange] = useState("30");

  const filteredHiringData = monthlyHiringData.slice(0, parseInt(dateRange));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Track hiring performance and recruitment metrics
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="60">60</SelectItem>
                <SelectItem value="90">90</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => {}}>
            <FileText className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {reportType === "hiring" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Hiring Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={filteredHiringData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077B5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0077B5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Area type="monotone" dataKey="applications" stroke="#0077B5" fillOpacity={1} fill="url(#colorApps)" name="Applications" />
                <Area type="monotone" dataKey="hires" stroke="#10B981" fillOpacity={1} fill="url(#colorHires)" name="Hires" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {reportType === "sources" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Candidate Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPie>
                <Pie
                  data={candidateSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {candidateSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {candidateSources.map((source) => (
                <div key={source.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-muted-foreground">{source.name}</span>
                  <span className="font-medium ml-auto">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === "departments" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Department Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={departmentPositions} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="department" type="category" width={100} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Bar dataKey="positions" fill="#0077B5" name="Open Positions" radius={[0, 4, 4, 0]} />
                <Bar dataKey="filled" fill="#10B981" name="Filled" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {reportType === "pipeline" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Pipeline Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Applications This Month</p>
                      <p className="text-2xl font-bold">{filteredHiringData.reduce((sum, d) => sum + d.applications, 0)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm font-muted">Hires This Month</p>
                      <p className="text-2xl font-bold text-green-600">{filteredHiringData.reduce((sum, d) => sum + d.hires, 0)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm font-muted">Offer Acceptance Rate</p>
                      <p className="text-2xl font-bold text-emerald-600">75%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversion Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                      Conversion Funnel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Applications</span>
                        <div className="ml-auto font-mono text-xs">320</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Screened</span>
                        <div className="ml-auto font-mono text-xs">180 (56%)</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Interviews</span>
                        <div className="ml-auto font-mono text-xs">90 (28%)</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Offers</span>
                        <div className="ml-auto font-mono text-xs">45 (14%)</div>
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium text-primary">
                        <span>Hired</span>
                        <div className="ml-auto font-mono">18 (6%)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Time to Hire */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Average Time to Hire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm font-muted">Average Days</p>
                      <p className="text-2xl font-bold text-blue-600">22</p>
                      <p className="text-xs text-muted-foreground">Down 3 days from last month</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === "activity" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">New application received</p>
                  <p className="text-xs text-muted-foreground">Sarah Johnson applied for Senior Frontend Developer</p>
                  <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Interview completed</p>
                  <p className="text-xs text-muted-foreground">David Martinez - Marketing Specialist</p>
                  <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Send className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Offer sent</p>
                  <p className="text-xs text-muted-foreground">Michael Chen - Product Manager</p>
                  <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Interview scheduled</p>
                  <p className="text-xs text-muted-foreground">Emily Davis - UX Designer for tomorrow 11:00 AM</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}