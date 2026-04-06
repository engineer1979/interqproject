import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Calendar,
  Clock,
  Star,
  User,
  Briefcase,
  ChevronRight,
  X,
} from "lucide-react";
import { mockCandidates } from "@/data/adminModuleData";
import { pipelineStages } from "@/data/atsData";

export default function PipelineDashboard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({ stage: 'all', dateRange: 'all' });

  const filteredApplications = mockCandidates.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.appliedRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === "all" || app.jobId === selectedJob;
    const matchesStage = filterData.stage === 'all' || app.stage === filterData.stage;
    return matchesSearch && matchesJob && matchesStage;
  });

  const handleAddCandidate = () => {
    toast({ title: 'Add Candidate', description: 'Opening add candidate form...' });
  };

  const handleViewAll = (stageName: string) => {
    toast({ title: 'View All', description: `Showing all candidates in ${stageName}` });
  };

  const handleBulkActions = (stageName: string) => {
    toast({ title: 'Bulk Actions', description: `Perform bulk actions for ${stageName}` });
  };

  const handleExport = (stageName: string) => {
    toast({ title: 'Export', description: `Exporting ${stageName} candidates` });
  };

  const getApplicationsByStage = (stage: string) => {
    return filteredApplications.filter((app) => app.stage === stage);
  };

  const stageColors: Record<string, string> = {
    applied: "bg-blue-50 border-blue-200",
    screening: "bg-indigo-50 border-indigo-200",
    assessment_assigned: "bg-purple-50 border-purple-200",
    assessment_completed: "bg-violet-50 border-violet-200",
    shortlisted: "bg-amber-50 border-amber-200",
    interview_scheduled: "bg-orange-50 border-orange-200",
    interview_completed: "bg-cyan-50 border-cyan-200",
    offer_sent: "bg-emerald-50 border-emerald-200",
    hired: "bg-green-50 border-green-200",
    rejected: "bg-red-50 border-red-200",
  };

  const badgeColors: Record<string, string> = {
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

  const getStageName = (stage: string) => {
    return stage.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Pipeline</h1>
          <p className="text-gray-500">Track and manage candidates through hiring stages</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowFilter(!showFilter)}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleAddCandidate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {showFilter && (
        <Card>
          <CardContent className="p-4 flex gap-4 items-center">
            <span className="text-sm font-medium">Filters:</span>
            <select 
              className="px-3 py-2 border rounded-lg" 
              value={filterData.stage}
              onChange={(e) => setFilterData({ ...filterData, stage: e.target.value })}
            >
              <option value="all">All Stages</option>
              {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select 
              className="px-3 py-2 border rounded-lg"
              value={filterData.dateRange}
              onChange={(e) => setFilterData({ ...filterData, dateRange: e.target.value })}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
        >
          <option value="all">All Jobs</option>
          <option value="job_001">Senior Frontend Engineer</option>
          <option value="job_002">Backend Developer</option>
          <option value="job_003">Product Manager</option>
        </select>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => {
          const count = getApplicationsByStage(stage.id).length;
          return (
            <div
              key={stage.id}
              className={`px-4 py-2 rounded-full border cursor-pointer transition whitespace-nowrap ${
                stageColors[stage.id] || "bg-gray-50 border-gray-200"
              }`}
              onClick={() => setSelectedJob(stage.id)}
            >
              <span className="text-sm font-medium">{stage.name}</span>
              <Badge variant="secondary" className="ml-2">
                {count}
              </Badge>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-5 gap-4 overflow-x-auto">
        {pipelineStages.map((stage) => {
          const stageApps = getApplicationsByStage(stage.id);
          return (
            <Card
              key={stage.id}
              className={`min-w-[280px] ${stageColors[stage.id] || "bg-gray-50 border-gray-200"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center">
                    {stage.name}
                    <Badge variant="secondary" className="ml-2">
                      {stageApps.length}
                    </Badge>
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewAll(stage.name)}>View All</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkActions(stage.name)}>Bulk Actions</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(stage.name)}>Export</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageApps.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No candidates</p>
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-indigo-600">
                              {app.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {app.fullName}
                            </p>
                            <p className="text-xs text-gray-500">{app.appliedRole}</p>
                          </div>
                        </div>
                        {app.rating && (
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs ml-1">{app.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span className="flex items-center">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {app.companyName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-400 space-x-2">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {app.appliedAt}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-indigo-600"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {app.tags && app.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {app.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {stageApps.length > 0 && (
                  <Button variant="ghost" className="w-full h-8 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Add to stage
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Summary</h2>
        <div className="grid grid-cols-5 gap-4">
          {pipelineStages.map((stage) => {
            const count = getApplicationsByStage(stage.id).length;
            const percentage = filteredApplications.length > 0 
              ? Math.round((count / filteredApplications.length) * 100) 
              : 0;
            return (
              <div key={stage.id} className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  stageColors[stage.id]?.replace("bg-", "bg-").replace("-50", "-100") || "bg-gray-100"
                }`}>
                  <span className="text-lg font-bold text-gray-700">{count}</span>
                </div>
                <p className="text-sm text-gray-600">{stage.name}</p>
                <p className="text-xs text-gray-400">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
