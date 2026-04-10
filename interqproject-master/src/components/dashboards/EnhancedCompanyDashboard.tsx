import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DepartmentStats {
  name: string;
  openPositions: number;
  filledPositions: number;
  avgTimeToHire: number;
  avgSalary: number;
  candidateQuality: number;
}

interface HiringMetrics {
  totalApplications: number;
  interviewsConducted: number;
  offersMade: number;
  hires: number;
  offerAcceptanceRate: number;
  avgTimeToHire: number;
  costPerHire: number;
  candidateSatisfaction: number;
}

interface BudgetAnalysis {
  allocated: number;
  spent: number;
  remaining: number;
  breakdown: {
    advertising: number;
    recruiterFees: number;
    assessmentTools: number;
    interviewCosts: number;
    onboarding: number;
  };
}

export function EnhancedCompanyDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const departmentStats: DepartmentStats[] = [
    {
      name: 'Engineering',
      openPositions: 8,
      filledPositions: 12,
      avgTimeToHire: 21,
      avgSalary: 95000,
      candidateQuality: 88
    },
    {
      name: 'Product',
      openPositions: 3,
      filledPositions: 5,
      avgTimeToHire: 18,
      avgSalary: 85000,
      candidateQuality: 92
    },
    {
      name: 'Marketing',
      openPositions: 4,
      filledPositions: 6,
      avgTimeToHire: 25,
      avgSalary: 70000,
      candidateQuality: 79
    },
    {
      name: 'Sales',
      openPositions: 6,
      filledPositions: 8,
      avgTimeToHire: 16,
      avgSalary: 75000,
      candidateQuality: 85
    }
  ];

  const hiringMetrics: HiringMetrics = {
    totalApplications: 245,
    interviewsConducted: 48,
    offersMade: 18,
    hires: 12,
    offerAcceptanceRate: 67,
    avgTimeToHire: 19,
    costPerHire: 8500,
    candidateSatisfaction: 89
  };

  const budgetAnalysis: BudgetAnalysis = {
    allocated: 200000,
    spent: 145000,
    remaining: 55000,
    breakdown: {
      advertising: 35000,
      recruiterFees: 60000,
      assessmentTools: 25000,
      interviewCosts: 15000,
      onboarding: 10000
    }
  };

  const getTrendIcon = (value: number, benchmark: number = 0) => {
    if (value > benchmark) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (value < benchmark) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <TrendingUp className="w-4 h-4 text-blue-600" />;
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
          <h1 className="text-3xl font-bold tracking-tight">Company Hiring Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive hiring analytics and insights</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{hiringMetrics.totalApplications}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(245, 200)}
                  <span className="text-xs text-green-600">+22%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hires</p>
                <p className="text-2xl font-bold">{hiringMetrics.hires}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(12, 10)}
                  <span className="text-xs text-green-600">+20%</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Time to Hire</p>
                <p className="text-2xl font-bold">{hiringMetrics.avgTimeToHire}d</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(19, 25)}
                  <span className="text-xs text-green-600">-24%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost per Hire</p>
                <p className="text-2xl font-bold">{formatCurrency(hiringMetrics.costPerHire)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(8500, 10000)}
                  <span className="text-xs text-green-600">-15%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hiring Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Hiring Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Applications', value: hiringMetrics.totalApplications, percentage: 100 },
                    { label: 'Interviews', value: hiringMetrics.interviewsConducted, percentage: (hiringMetrics.interviewsConducted / hiringMetrics.totalApplications) * 100 },
                    { label: 'Offers Made', value: hiringMetrics.offersMade, percentage: (hiringMetrics.offersMade / hiringMetrics.interviewsConducted) * 100 },
                    { label: 'Hires', value: hiringMetrics.hires, percentage: (hiringMetrics.hires / hiringMetrics.offersMade) * 100 }
                  ].map((stage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{stage.label}</span>
                        <span className="text-muted-foreground">
                          {stage.value} ({stage.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={stage.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {hiringMetrics.offerAcceptanceRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">Offer Acceptance Rate</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {hiringMetrics.candidateSatisfaction}%
                    </div>
                    <p className="text-sm text-muted-foreground">Candidate Satisfaction</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {hiringMetrics.avgTimeToHire} days
                    </div>
                    <p className="text-sm text-muted-foreground">Average Time to Hire</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Department Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {departmentStats.map((dept, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-semibold text-lg mb-3">{dept.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Open Positions:</span>
                        <span className="font-semibold">{dept.openPositions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Filled Positions:</span>
                        <span className="font-semibold text-green-600">{dept.filledPositions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Time to Hire:</span>
                        <span className="font-semibold">{dept.avgTimeToHire}d</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Candidate Quality:</span>
                        <span className="font-semibold text-blue-600">{dept.candidateQuality}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Hiring Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-xl mb-4">{dept.name} Department</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{dept.openPositions}</div>
                        <p className="text-sm text-muted-foreground">Open Positions</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{dept.filledPositions}</div>
                        <p className="text-sm text-muted-foreground">Filled Positions</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{dept.avgTimeToHire}d</div>
                        <p className="text-sm text-muted-foreground">Avg Time to Hire</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{dept.candidateQuality}%</div>
                        <p className="text-sm text-muted-foreground">Candidate Quality</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Position Breakdown</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Senior Roles:</span>
                            <span className="font-semibold">4</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mid-level Roles:</span>
                            <span className="font-semibold">6</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Junior Roles:</span>
                            <span className="font-semibold">2</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Salary Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Average Salary:</span>
                            <span className="font-semibold">{formatCurrency(dept.avgSalary)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Salary Range:</span>
                            <span className="font-semibold">
                              {formatCurrency(dept.avgSalary * 0.7)} - {formatCurrency(dept.avgSalary * 1.3)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Budget Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(budgetAnalysis.allocated)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Allocated</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(budgetAnalysis.spent)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatCurrency(budgetAnalysis.remaining)}
                      </div>
                      <p className="text-sm text-muted-foreground">Remaining Budget</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Budget Breakdown */}
                <div>
                  <h4 className="font-semibold mb-4">Budget Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(budgetAnalysis.breakdown).map(([category, amount]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium capitalize">{category}</span>
                          <span className="font-semibold">{formatCurrency(amount)}</span>
                        </div>
                        <Progress 
                          value={(amount / budgetAnalysis.spent) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Efficiency */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Budget Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(hiringMetrics.costPerHire)}
                        </div>
                        <p className="text-muted-foreground">Cost per Hire</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {((budgetAnalysis.spent / hiringMetrics.hires) / hiringMetrics.costPerHire * 100).toFixed(1)}%
                        </div>
                        <p className="text-muted-foreground">Budget Utilization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Hiring Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Advanced analytics including predictive hiring models, candidate sourcing effectiveness, 
                 and ROI analysis will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}