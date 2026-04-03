import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobSeekerDashboard } from "@/contexts/JobSeekerDashboardContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Video, Award, Users, CheckCircle, Clock, TrendingUp, 
  AlertCircle, Download, Share2, ExternalLink, ArrowRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function IntegratedJobSeekerHub() {
  const navigate = useNavigate();
  const { data, isLoading, getCertificateEligibility } = useJobSeekerDashboard();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </motion.div>
    );
  }

  const certEligibility = getCertificateEligibility();
  const stats = [
    {
      label: "Assessments Completed",
      value: data?.assessmentResults?.length || 0,
      icon: FileText,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Interviews Done",
      value: data?.interviews?.filter((i) => i.status === "completed").length || 0,
      icon: Video,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Certificates Earned",
      value: data?.certificates?.length || 0,
      icon: Award,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Profile Completion",
      value: `${data?.profileCompletion || 0}%`,
      icon: Users,
      color: "bg-purple-500/10 text-purple-600",
    },
  ];

  // Get recent activities
  const recentActivities = [
    ...(data?.assessmentResults?.slice(0, 2)?.map((r) => ({
      type: "assessment",
      title: r.assessments?.title || "Assessment",
      status: r.score >= 70 ? "passed" : "completed",
      score: r.score,
      date: new Date(r.completed_at),
      icon: FileText,
    })) || []),
    ...(data?.interviews?.slice(0, 2)?.map((i) => ({
      type: "interview",
      title: i.title || "Interview",
      status: i.status,
      date: new Date(i.created_at),
      icon: Video,
    })) || []),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">Welcome, {data?.profile?.full_name || "Job Seeker"}!</h1>
        <p className="text-muted-foreground mt-2">Manage your assessments, interviews, and certifications all in one place</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => navigate(`/jobseeker/${stat.label.toLowerCase().replace(/ /g, "-")}`)}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-lg", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs for Integrated View */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest assessments and interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(activity.type === "assessment" ? "/jobseeker/results" : "/jobseeker/interviews")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.score !== undefined && (
                        <Badge className={activity.score >= 70 ? "bg-green-500" : "bg-orange-500"}>
                          {activity.score}%
                        </Badge>
                      )}
                      <Badge variant="outline">{activity.status}</Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to stand out to employers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Completion</span>
                  <span className="font-semibold">{data?.profileCompletion || 0}%</span>
                </div>
                <Progress value={data?.profileCompletion || 0} className="h-2" />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/jobseeker/profile")}
              >
                Complete Profile <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Results</CardTitle>
              <CardDescription>Your completed assessments and scores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.assessmentResults && data.assessmentResults.length > 0 ? (
                data.assessmentResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{result.assessments?.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Score: {result.score}% • Difficulty: {result.assessments?.difficulty}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={result.score >= 70 ? "bg-green-500" : "bg-orange-500"}>
                          {result.score >= 70 ? "Passed" : "Review"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(result.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No assessment results yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/jobseeker/assessments")}
                  >
                    Start an Assessment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interviews Tab */}
        <TabsContent value="interviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Sessions</CardTitle>
              <CardDescription>Your interview history and upcoming sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.interviews && data.interviews.length > 0 ? (
                data.interviews.map((interview, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{interview.title || interview.job_role}</h4>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(interview.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={
                          interview.status === "completed"
                            ? "bg-green-500"
                            : interview.status === "in-progress"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }
                      >
                        {interview.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Video className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No interviews yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/jobseeker/interviews")}
                  >
                    Start an Interview
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
              <CardDescription>Your earned certificates and eligible achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.certificates && data.certificates.length > 0 ? (
                data.certificates.map((cert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-500" />
                          {cert.title || "Certificate"}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Issued: {new Date(cert.issued_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No certificates earned yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Score 70% or higher on assessments to earn certificates
                  </p>
                </div>
              )}

              {/* Certificate Eligibility */}
              {certEligibility.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">You're Eligible For:</h4>
                  <ul className="space-y-2">
                    {certEligibility.map((cert, idx) => (
                      <li key={idx} className="text-sm text-blue-800 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {cert.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal and professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.profile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-muted-foreground">{data.profile.full_name || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{data.profile.email || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Headline</label>
                    <p className="text-muted-foreground">{data.profile.headline || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Skills</label>
                    <p className="text-muted-foreground">
                      {data.profile.skills?.length > 0 ? data.profile.skills.join(", ") : "Not set"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No profile information</p>
              )}
              <Button
                className="w-full"
                onClick={() => navigate("/jobseeker/profile")}
              >
                Edit Profile <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
