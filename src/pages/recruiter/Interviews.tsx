import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
  Plus,
  MoreVertical,
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  FileText,
  Star,
} from "lucide-react";
import { mockInterviews } from "@/data/adminModuleData";

export default function RecruiterInterviews() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInterviews = mockInterviews.filter((interview) => {
    const matchesSearch =
      interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    no_show: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
  };

  const stageColors: Record<string, string> = {
    screening: "bg-indigo-100 text-indigo-700",
    technical: "bg-purple-100 text-purple-700",
    hr: "bg-cyan-100 text-cyan-700",
    final: "bg-emerald-100 text-emerald-700",
  };

  const typeIcons: Record<string, React.ReactNode> = {
    video: <Video className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
    in_person: <MapPin className="w-4 h-4" />,
  };

  const stats = {
    total: mockInterviews.length,
    scheduled: mockInterviews.filter((i) => i.status === "scheduled").length,
    completed: mockInterviews.filter((i) => i.status === "completed").length,
    inProgress: mockInterviews.filter((i) => i.status === "in_progress").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-500">Schedule and manage candidate interviews</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Feedback</p>
                <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Interviews</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search interviews..."
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
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Interview Details</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {interview.candidateName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{interview.candidateName}</p>
                      <p className="text-xs text-gray-500">{interview.companyName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{interview.title}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    {interview.interviewers.join(", ")}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{interview.jobTitle}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center w-fit">
                    {typeIcons[interview.type]}
                    <span className="ml-1 capitalize">{interview.type.replace("_", " ")}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={stageColors[interview.stage] || "bg-gray-100 text-gray-700"}>
                    {interview.stage.charAt(0).toUpperCase() + interview.stage.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[interview.status]}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium">
                      {new Date(interview.scheduledAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(interview.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" • "}
                      {interview.duration}min
                    </p>
                  </div>
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
                        <Calendar className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {interview.meetingLink && (
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Join Meeting
                        </DropdownMenuItem>
                      )}
                      {interview.status === "completed" && (
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Submit Feedback
                        </DropdownMenuItem>
                      )}
                      {interview.status === "scheduled" && (
                        <>
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInterviews
                .filter((i) => i.status === "scheduled")
                .slice(0, 3)
                .map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {typeIcons[interview.type]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{interview.candidateName}</p>
                      <p className="text-xs text-gray-500">{interview.title}</p>
                      <p className="text-xs text-indigo-600 mt-1">
                        {new Date(interview.scheduledAt).toLocaleDateString()} at{" "}
                        {new Date(interview.scheduledAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 border border-amber-100 bg-amber-50/50 rounded-lg">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Lisa Anderson</p>
                  <p className="text-xs text-gray-500">HR Interview - Product Manager</p>
                  <p className="text-xs text-amber-600 mt-1">Feedback due in 24 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border border-amber-100 bg-amber-50/50 rounded-lg">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">David Park</p>
                  <p className="text-xs text-gray-500">Final Round - Backend</p>
                  <p className="text-xs text-amber-600 mt-1">Feedback due in 48 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Technical Interview</p>
                    <p className="text-xs text-gray-500">60 min • Video call</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Use</Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">HR Interview</p>
                    <p className="text-xs text-gray-500">45 min • Video call</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Use</Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Final Round</p>
                    <p className="text-xs text-gray-500">90 min • In-person</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Use</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
