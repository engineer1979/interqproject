import { 
  Users, Briefcase, FileText, Calendar, TrendingUp, 
  ArrowRight, CheckCircle, AlertCircle, DollarSign, 
  Building2, UserCheck, Activity, BarChart3, Globe, Shield 
} from "lucide-react";
import { mockAdminStats, mockJobs } from "@/data/atsData";

export default function AdminDashboard() {
  const stats = mockAdminStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Platform overview and management</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Admin Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Job Seekers</p>
              <p className="text-3xl font-bold mt-1">{stats.totalJobSeekers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-blue-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+847 this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Active Companies</p>
              <p className="text-3xl font-bold mt-1">{stats.activeCompanies}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-emerald-100">
            <span>of {stats.totalCompanies} total</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Expert Recruiters</p>
              <p className="text-3xl font-bold mt-1">{stats.totalRecruiters}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Active Jobs</p>
              <p className="text-3xl font-bold mt-1">{stats.totalActiveJobs}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-amber-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+124 this week</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Total Applications</h3>
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalApplications.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Assessments</h3>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalAssessmentsAssigned.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Assigned</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Interviews</h3>
            <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalInterviewsScheduled.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Scheduled</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Offers Sent</h3>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOffersSent}</p>
          <p className="text-sm text-gray-500 mt-1">{stats.totalHires} hires</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-900">Platform Analytics</h2>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Live</span>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
              Detailed Report <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">68%</p>
              <p className="text-sm text-gray-500">Job Seeker Retention</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <Briefcase className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">24 days</p>
              <p className="text-sm text-gray-500">Avg Time to Hire</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">73%</p>
              <p className="text-sm text-gray-500">Offer Acceptance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-3">
                <Globe className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">42</p>
              <p className="text-sm text-gray-500">Countries</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {stats.pendingApprovals} pending
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">TechStart Inc</p>
                  <p className="text-sm text-gray-500">Company verification</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition">
                  Approve
                </button>
                <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                  Reject
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Recruiter certification</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition">
                  Approve
                </button>
                <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">New company registered: DataFlow Systems</p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">247 new job seekers joined today</p>
                <p className="text-xs text-gray-400">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">34 new jobs posted across platform</p>
                <p className="text-xs text-gray-400">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Payment issue reported by FinanceHub Global</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
