import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Download,
  Calendar,
  Filter,
  FileText,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { mockKPIs, mockCompanies } from "@/data/adminModuleData";

export default function AdminReports() {
  const stats = {
    totalJobSeekers: mockKPIs.totalCandidates,
    activeCompanies: mockCompanies.filter(c => c.status === "active").length,
    totalApplications: mockKPIs.totalCandidates * 3,
    totalHires: mockKPIs.hiresCompleted,
    totalOffersSent: mockKPIs.offersSent,
    totalRecruiters: mockKPIs.totalRecruiters,
    activeJobs: mockKPIs.activeJobs,
  };
  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Reports</h1>
          <p className="text-gray-500">Analytics and insights across the platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Job Seekers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalJobSeekers.toLocaleString()}</p>
                <div className="flex items-center mt-1 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12.5%</span>
                  <span className="text-gray-400 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Companies</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeCompanies}</p>
                <div className="flex items-center mt-1 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+8.2%</span>
                  <span className="text-gray-400 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalApplications.toLocaleString()}</p>
                <div className="flex items-center mt-1 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+18.7%</span>
                  <span className="text-gray-400 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Hires</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalHires}</p>
                <div className="flex items-center mt-1 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+15.3%</span>
                  <span className="text-gray-400 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Growth</CardTitle>
              <Badge variant="outline">Monthly</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around space-x-2">
              {[65, 72, 68, 78, 85, 82, 88, 92, 95, 88, 94, 100].map((value, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Breakdown</CardTitle>
              <Badge variant="outline">Q4 2024</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Enterprise Plans</span>
                  <span className="text-sm text-gray-500">45%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Professional Plans</span>
                  <span className="text-sm text-gray-500">32%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "32%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Starter Plans</span>
                  <span className="text-sm text-gray-500">15%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "15%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Add-ons</span>
                  <span className="text-sm text-gray-500">8%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "8%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Hiring Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Technology", count: 1245, percentage: 35 },
                { name: "Healthcare", count: 876, percentage: 25 },
                { name: "Finance", count: 654, percentage: 18 },
                { name: "Education", count: 432, percentage: 12 },
                { name: "Retail", count: 321, percentage: 10 },
              ].map((industry) => (
                <div key={industry.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{industry.name}</span>
                      <span className="text-xs text-gray-500">{industry.count} hires</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${industry.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiring Pipeline Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Applications</p>
                  <p className="text-xs text-gray-500">Total received</p>
                </div>
                <p className="text-xl font-bold text-blue-600">{stats.totalApplications.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Screenings</p>
                  <p className="text-xs text-gray-500">68% conversion</p>
                </div>
                <p className="text-xl font-bold text-purple-600">{Math.round(stats.totalApplications * 0.68).toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Offers Extended</p>
                  <p className="text-xs text-gray-500">{Math.round((456 / stats.totalApplications) * 100)}% conversion</p>
                </div>
                <p className="text-xl font-bold text-emerald-600">{stats.totalOffersSent}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Successful Hires</p>
                  <p className="text-xs text-gray-500">{Math.round((stats.totalHires / stats.totalOffersSent) * 100)}% acceptance</p>
                </div>
                <p className="text-xl font-bold text-green-600">{stats.totalHires}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-500">Avg Days to Hire</p>
              </div>
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">73%</p>
                <p className="text-sm text-gray-500">Offer Acceptance Rate</p>
              </div>
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">4.2</p>
                <p className="text-sm text-gray-500">Avg Interview Rounds</p>
              </div>
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">68%</p>
                <p className="text-sm text-gray-500">Candidate Retention 6mo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Report Downloads</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Monthly User Activity Report", date: "Dec 15, 2024", size: "2.4 MB" },
              { name: "Q4 Hiring Analytics", date: "Dec 12, 2024", size: "5.1 MB" },
              { name: "Company Performance Summary", date: "Dec 10, 2024", size: "1.8 MB" },
              { name: "Assessment Completion Rates", date: "Dec 8, 2024", size: "1.2 MB" },
            ].map((report) => (
              <div key={report.name} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
