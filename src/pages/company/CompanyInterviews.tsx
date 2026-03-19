import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  ExternalLink,
  CheckCircle,
  XCircle,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { mockInterviews } from "@/data/atsData";

export default function CompanyInterviews() {
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
    thisWeek: mockInterviews.filter((i) => {
      const date = new Date(i.scheduledAt);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return date >= now && date <= weekFromNow;
    }).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-500">Manage your candidate interviews</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
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
                <Users className="w-6 h-6 text-indigo-600" />
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
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-purple-600">{stats.thisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
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
              <TableHead>Interview</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
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
                    <span className="font-medium">{interview.candidateName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{interview.title}</p>
                  <p className="text-xs text-gray-500">{interview.interviewers.join(", ")}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{interview.jobTitle}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center w-fit">
                    {typeIcons[interview.type]}
                    <span className="ml-1 capitalize">{interview.type.replace("_", " ")}</span>
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
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[interview.status]}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                  </Badge>
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
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Interviews</h3>
            <div className="space-y-3">
              {mockInterviews
                .filter((i) => i.status === "scheduled")
                .slice(0, 3)
                .map((interview) => (
                  <div
                    key={interview.id}
                    className="p-4 border border-blue-100 bg-blue-50/50 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{interview.candidateName}</p>
                        <p className="text-sm text-gray-500">{interview.title}</p>
                      </div>
                      <Badge variant="outline" className="flex items-center">
                        {typeIcons[interview.type]}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(interview.scheduledAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {interview.duration} min
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Pending Feedback</h3>
            <div className="space-y-3">
              <div className="p-4 border border-amber-100 bg-amber-50/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Lisa Anderson</p>
                    <p className="text-sm text-gray-500">HR Interview - Product Manager</p>
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-200">
                    24h remaining
                  </Badge>
                </div>
                <Button size="sm" className="mt-3">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
              <div className="p-4 border border-amber-100 bg-amber-50/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">David Park</p>
                    <p className="text-sm text-gray-500">Final Round - Backend</p>
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-200">
                    48h remaining
                  </Badge>
                </div>
                <Button size="sm" className="mt-3">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
