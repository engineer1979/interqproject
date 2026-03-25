import { useState } from "react";
import { 
  Briefcase, FileText, Calendar, Clock, TrendingUp, 
  Star, ArrowRight, CheckCircle, AlertCircle, Users, BarChart3 
} from "lucide-react";
import { mockKPIs, mockCandidates, mockInterviews, mockNotifications } from "@/data/adminModuleData";

export default function JobSeekerDashboard() {
  const stats = {
    totalApplications: mockCandidates.length,
    pendingApplications: mockCandidates.filter(c=>c.stage==="applied").length,
    interviewsScheduled: mockInterviews.filter(i=>i.status==="scheduled").length,
    offersReceived: mockKPIs.offersSent,
    profileViews: 0,
    profileStrength: 0,
    savedJobs: 0,
    assessmentsCompleted: 0,
  };
  const recentApps = mockCandidates.slice(0, 3);
  const upcomingInterviews = mockInterviews.slice(0, 2);
  const notifications = mockNotifications.slice(0, 3);

  const stageColors: Record<string, string> = {
    applied: "bg-blue-100 text-blue-700",
    screening: "bg-indigo-100 text-indigo-700",
    assessment_assigned: "bg-purple-100 text-purple-700",
    assessment_completed: "bg-violet-100 text-violet-700",
    shortlisted: "bg-amber-100 text-amber-700",
    interview_scheduled: "bg-orange-100 text-orange-700",
    interview_completed: "bg-cyan-100 text-cyan-700",
    offer_sent: "bg-emerald-100 text-emerald-700",
    hired: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const stageLabels: Record<string, string> = {
    applied: "Applied",
    screening: "Screening",
    assessment_assigned: "Assessment Assigned",
    assessment_completed: "Assessment Completed",
    shortlisted: "Shortlisted",
    interview_scheduled: "Interview Scheduled",
    interview_completed: "Interview Completed",
    offer_sent: "Offer Sent",
    hired: "Hired",
    rejected: "Rejected",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Emily!</h1>
          <p className="text-gray-500">Track your job search progress</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Browse Jobs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile Views</p>
              <p className="text-3xl font-bold text-gray-900">{stats.profileViews}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% this week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Applications Sent</p>
              <p className="text-3xl font-bold text-gray-900">{stats.applicationsSent}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <span>3 in progress</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Interviews Scheduled</p>
              <p className="text-3xl font-bold text-gray-900">{stats.interviewsScheduled}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <span>Next in 5 days</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assessments Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.assessmentsPending}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 mr-1" />
            <span className="text-amber-600">Complete soon</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
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
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{app.appliedRole}</h3>
                    <p className="text-sm text-gray-500">{app.companyName}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${stageColors[app.stage] || "bg-gray-100 text-gray-700"}`}>
                      {stageLabels[app.stage] || app.stage}
                    </span>
                    {app.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm text-gray-600 ml-1">{app.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Applied on {app.appliedAt}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
          </div>
          <div className="p-4 space-y-4">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{interview.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    interview.status === "scheduled" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {interview.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{interview.companyName}</p>
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(interview.scheduledAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {interview.duration}min
                  </span>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
              View All Interviews
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 flex items-start space-x-3 ${!notif.isRead ? "bg-blue-50/50" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notif.isRead ? "bg-gray-100" : "bg-blue-100"
                }`}>
                  {notif.isRead ? (
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Profile Strength</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#6366F1"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${stats.profileComplete * 3.52} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{stats.profileComplete}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Personal Info</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Work Experience</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Education</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Skills</span>
                <span className="text-amber-500 text-xs">Add more</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Portfolio</span>
                <span className="text-amber-500 text-xs">Add links</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
