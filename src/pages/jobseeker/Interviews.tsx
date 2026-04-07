import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Search,
  Calendar,
  Clock,
  Play,
  CheckCircle,
  AlertCircle,
  FileText,
  Star,
  Users,
  Plus,
} from "lucide-react";
import { useJobSeekerDashboard } from "@/contexts/JobSeekerDashboardContext";

export default function JobSeekerInterviews() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data, generateInterviews } = useJobSeekerDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [generating, setGenerating] = useState(false);

  const interviews = data?.interviews || [];
  
  const filteredInterviews = interviews.filter((interview: any) => {
    const matchesSearch =
      !searchTerm || 
      interview.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
  };

  const stats = {
    upcoming: interviews.filter((i: any) => i.status === "upcoming").length,
    inProgress: interviews.filter((i: any) => i.status === "in_progress").length,
    completed: interviews.filter((i: any) => i.status === "completed").length,
    total: interviews.length,
  };

  const upcomingInterviews = interviews.filter((i: any) => i.status === "upcoming");

  const handleGenerateInterviews = async () => {
    setGenerating(true);
    try {
      await generateInterviews();
      toast({ title: "Success", description: "6 IT Technical Interviews generated!" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to generate interviews", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleStartInterview = (interview: any) => {
    navigate(`/jobseeker/interview/${interview.id}`);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
          <p className="text-gray-500">Practice technical interviews in IT domains</p>
        </div>
        {stats.total < 6 && (
          <Button onClick={handleGenerateInterviews} disabled={generating}>
            <Plus className="w-4 h-4 mr-2" />
            {generating ? "Generating..." : "Generate Interviews"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-yellow-600" />
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

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>Start practicing your technical interviews</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingInterviews.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No interviews available</p>
              <Button onClick={handleGenerateInterviews} disabled={generating}>
                <Plus className="w-4 h-4 mr-2" />
                Generate 6 IT Technical Interviews
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingInterviews.map((interview: any) => (
                <Card key={interview.id} className="border-2 hover:border-blue-300 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">{interview.category}</Badge>
                      <Badge className={statusColors[interview.status]}>
                        {interview.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{interview.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {interview.description || `${interview.total_questions || 20} questions`}
                    </p>
                    <Button className="w-full" onClick={() => handleStartInterview(interview)}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Interview
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                <option value="upcoming">Upcoming</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Interview</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No interviews found
                </TableCell>
              </TableRow>
            ) : (
              filteredInterviews.map((interview: any) => (
                <TableRow key={interview.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{interview.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{interview.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{interview.total_questions || 20}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {interview.created_at ? new Date(interview.created_at).toLocaleDateString() : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[interview.status]}>
                      {interview.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {interview.status === 'upcoming' && (
                      <Button size="sm" onClick={() => handleStartInterview(interview)}>
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {interview.status === 'in_progress' && (
                      <Button size="sm" variant="outline" onClick={() => handleStartInterview(interview)}>
                        <Play className="w-4 h-4 mr-1" />
                        Continue
                      </Button>
                    )}
                    {interview.status === 'completed' && (
                      <Button size="sm" variant="ghost">
                        <FileText className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}