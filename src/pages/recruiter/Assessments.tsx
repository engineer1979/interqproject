import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  BarChart3,
  Download,
  Users,
  Calendar,
} from "lucide-react";
import { mockAssessmentAssignments, mockAssessments } from "@/data/atsData";

export default function RecruiterAssessments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAssignments = mockAssessmentAssignments.filter((assignment) => {
    const matchesSearch =
      assignment.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.assessmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    in_progress: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    expired: "bg-red-100 text-red-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4" />,
    in_progress: <FileText className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    expired: <XCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };

  const stats = {
    total: mockAssessmentAssignments.length,
    pending: mockAssessmentAssignments.filter((a) => a.status === "pending").length,
    inProgress: mockAssessmentAssignments.filter((a) => a.status === "in_progress").length,
    completed: mockAssessmentAssignments.filter((a) => a.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Management</h1>
          <p className="text-gray-500">Manage candidate assessments and track results</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Assign Assessment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Assessment Assignments</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Assessment</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-600">
                        {assignment.candidateName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="font-medium">{assignment.candidateName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{assignment.assessmentTitle}</p>
                    <p className="text-xs text-gray-500">ID: {assignment.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{assignment.jobTitle}</p>
                    <p className="text-xs text-gray-500">{assignment.companyId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[assignment.status]}>
                    <span className="flex items-center">
                      {statusIcons[assignment.status]}
                      <span className="ml-1 capitalize">{assignment.status.replace(/_/g, " ")}</span>
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>
                  {assignment.score !== undefined ? (
                    <div className="flex items-center">
                      <span className={`font-medium ${
                        assignment.passed ? "text-green-600" : "text-red-600"
                      }`}>
                        {assignment.score}%
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        / {assignment.totalPoints} pts
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {assignment.completedAt ? (
                    <span className="text-sm text-gray-500">
                      {new Date(assignment.completedAt).toLocaleDateString()}
                    </span>
                  ) : assignment.expiresAt ? (
                    <span className="text-sm text-amber-600">
                      Expires {new Date(assignment.expiresAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {assignment.status === "completed" && (
                        <DropdownMenuItem>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Results
                        </DropdownMenuItem>
                      )}
                      {assignment.status === "pending" && (
                        <DropdownMenuItem>
                          <Send className="w-4 h-4 mr-2" />
                          Send Reminder
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        Download Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Assessment Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{assessment.title}</p>
                      <p className="text-xs text-gray-500">
                        {assessment.questionsCount} questions • {assessment.duration} min
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Assign</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    Michael Chen completed Frontend Developer Assessment
                  </p>
                  <p className="text-xs text-gray-400">Score: 85% • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    David Park started Backend Developer Assessment
                  </p>
                  <p className="text-xs text-gray-400">In progress • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    James Wilson has not started Frontend Assessment yet
                  </p>
                  <p className="text-xs text-gray-400">Pending • 1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
