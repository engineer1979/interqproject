import { 
  Briefcase, Users, FileText, Calendar, TrendingUp, 
  ArrowRight, CheckCircle, Clock, Target, BarChart3 
} from "lucide-react";
import { mockKPIs, mockJobs, mockCandidates, mockInterviews } from "@/data/adminModuleData";

export default function CompanyDashboard() {
  const stats = { activeJobs: mockJobs.filter(j=>j.status==="open").length, totalCandidates: mockCandidates.length, interviewsThisWeek: mockInterviews.filter(i=>i.status==="scheduled").length, offersOut: 5, hiredThisMonth: 8, pendingScreening: 23 };
  const recentApps = mockCandidates.slice(0, 5);
  const activeJobs = mockJobs.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">TechCorp Solutions</h1>
          <p className="text-gray-500">Recruitment overview and analytics</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Jobs</p>
              <p className="text-3xl font-bold mt-1">{stats.activeJobs}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-blue-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+3 this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Total Applicants</p>
              <p className="text-3xl font-bold mt-1">{stats.totalApplicants}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-indigo-100">
            <span>+45 this week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Assessments</p>
              <p className="text-3xl font-bold mt-1">{stats.assessmentsInProgress}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-purple-100">
            <Clock className="w-4 h-4 mr-1" />
            <span>In progress</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Interviews</p>
              <p className="text-3xl font-bold mt-1">{stats.interviewsScheduled}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-emerald-100">
            <span>Scheduled</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Hiring Pipeline</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(stats.pipelineByStage).map(([stage, count]) => (
              <div key={stage} className="text-center">
                <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-indigo-600">{count}</span>
                </div>
                <p className="text-xs text-gray-500 capitalize">{stage.replace(/_/g, " ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentApps.map((app) => (
              <div key={app.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{app.fullName}</h3>
                    <p className="text-sm text-gray-500">{app.appliedRole}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{app.source}</p>
                    <p className="text-xs text-gray-400">{app.appliedAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Active Job Postings</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                Manage <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {activeJobs.map((job) => (
              <div key={job.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.department} • {job.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {job.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{job.applicationsCount} applicants</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Offers Sent</h3>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.offersSent}</p>
          <p className="text-sm text-gray-500 mt-1">Pending responses: 2</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Hires Completed</h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.hiresCompleted}</p>
          <p className="text-sm text-gray-500 mt-1">This quarter</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Time to Hire</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">24 days</p>
          <p className="text-sm text-gray-500 mt-1">Average</p>
        </div>
      </div>
    </div>
  );
}
