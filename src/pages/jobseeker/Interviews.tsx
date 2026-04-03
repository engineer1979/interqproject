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
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  ExternalLink,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Star,
  Users,
} from "lucide-react";
import { mockInterviews } from "@/data/adminModuleData";

export default function JobSeekerInterviews() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInterviews = mockInterviews.filter((interview) => {
    const matchesSearch =
      interview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.companyName.toLowerCase().includes(searchTerm.toLowerCase());
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
    upcoming: mockInterviews.filter((i) => i.status === "scheduled").length,
    completed: mockInterviews.filter((i) => i.status === "completed").length,
    total: mockInterviews.length,
  };

  const upcomingInterviews = mockInterviews.filter((i) => i.status === "scheduled");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
          <p className="text-gray-500">View and manage your scheduled interviews</p>
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Calendar View
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
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
              <TableHead>Interview</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{interview.title}</p>
                    <p className="text-xs text-gray-500">{interview.jobTitle}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{interview.companyName}</p>
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
                  <span className="text-sm">{interview.duration} min</span>
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
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        Preparation Tips
                      </DropdownMenuItem>
                      {interview.status === "scheduled" && (
                        <>
                          <DropdownMenuItem onClick={() => toast({ title: "Reschedule Request Sent", description: "The interviewer has been notified." })}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingInterviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No upcoming interviews</p>
            ) : (
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-4 border border-blue-100 bg-blue-50/50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{interview.title}</h3>
                        <p className="text-sm text-gray-500">{interview.companyName}</p>
                      </div>
                      <Badge className={statusColors[interview.status]}>
                        {interview.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(interview.scheduledAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(interview.scheduledAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Duration: {interview.duration} minutes
                    </p>
                    {interview.meetingLink && (
                      <Button className="w-full" size="sm">
                        <Video className="w-4 h-4 mr-2" />
                        Join Meeting
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Preparation Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Test your equipment</p>
                <p className="text-xs text-gray-500">Ensure camera, microphone, and internet are working</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Review the job description</p>
                <p className="text-xs text-gray-500">Be familiar with requirements and responsibilities</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Prepare your talking points</p>
                <p className="text-xs text-gray-500">Have examples ready for common questions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Join 5 minutes early</p>
                <p className="text-xs text-gray-500">Shows punctuality and gives time to settle in</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
