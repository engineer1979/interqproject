import { 
  Users, FileText, Calendar, Clock, TrendingUp, 
  ArrowRight, CheckCircle, AlertCircle, Target, Briefcase 
} from "lucide-react";
import { mockRecruiterStats, mockApplications, mockInterviews, mockAssessmentAssignments } from "@/data/atsData";

export default function RecruiterDashboard() {
  const stats = mockRecruiterStats;
  const candidates = mockApplications.slice(0, 5);
  const upcomingInterviews = mockInterviews.slice(0, 3);
  const pendingAssessments = mockAssessmentAssignments.filter(a => a.status !== "completed").slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-500">Manage your recruitment pipeline</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Add Candidate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assigned Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.assignedJobs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Candidates in Pipeline</p>
              <p className="text-3xl font-bold text-gray-900">{stats.candidatesInPipeline}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12 this week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Assessments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingAssessments}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-amber-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>Review needed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Interviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.upcomingInterviews}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Feedback Pending</p>
              <p className="text-3xl font-bold mt-1">{stats.feedbackPending}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-amber-100 mt-2">Complete within 48 hours</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Offers in Process</p>
              <p className="text-3xl font-bold mt-1">{stats.offersInProcess}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-emerald-100 mt-2">Active negotiations</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Hires This Month</p>
              <p className="text-3xl font-bold mt-1">{stats.hiresThisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-100 mt-2">Great progress!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Candidates</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                View Pipeline <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-indigo-600">
                            {candidate.jobSeekerName.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{candidate.jobSeekerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{candidate.jobTitle}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                        {candidate.stage.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {candidate.rating ? (
                        <span className="text-sm font-medium text-gray-900">{candidate.rating}/5</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
          </div>
          <div className="p-4 space-y-3">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{interview.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    interview.status === "scheduled" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {interview.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{interview.candidateName}</p>
                <div className="flex items-center text-xs text-gray-400 space-x-3">
                  <span>{new Date(interview.scheduledAt).toLocaleDateString()}</span>
                  <span>{interview.duration}min</span>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
              View All Interviews
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Pending Assessments Review</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {pendingAssessments.map((assessment) => (
            <div key={assessment.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{assessment.candidateName}</h3>
                <p className="text-sm text-gray-500">{assessment.assessmentTitle}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  assessment.status === "in_progress" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {assessment.status.replace(/_/g, " ")}
                </span>
                <button className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
