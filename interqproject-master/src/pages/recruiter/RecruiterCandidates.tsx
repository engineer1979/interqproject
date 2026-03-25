import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Button,
} from "@/components/ui/button";
import {
  Badge,
} from "@/components/ui/badge";
import {
  useNavigate,
} from "react-router-dom";
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Phone,
  Star,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Checkbox,
} from "@/components/ui/checkbox";
import {
  Input,
} from "@/components/ui/input";
import {
  Textarea,
} from "@/components/ui/textarea";
import {
  Label,
} from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Separator,
} from "@/components/ui/separator";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

const candidateStages = [
  { value: "all", label: "All Candidates" },
  { value: "applied", label: "Applied" },
  { value: "screened", label: "Screened" },
  { value: "interviewed", label: "Interviewed" },
  { value: "offered", label: "Offered" },
  { value: "hired", label: "Hired" },
];

const candidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Frontend Developer",
    stage: "Interviewed",
    rating: 4.8,
    appliedDate: "2024-01-15",
    resume: "https://example.com/resumes/sarah-johnson.pdf",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    experience: "5 years",
    education: "BS Computer Science",
    notes: "Strong frontend skills, good communication",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+1 (555) 234-5678",
    position: "Product Manager",
    stage: "Offered",
    rating: 4.5,
    appliedDate: "2024-01-12",
    resume: "https://example.com/resumes/michael-chen.pdf",
    skills: ["Product Strategy", "Agile", "Jira", "Analytics"],
    experience: "4 years",
    education: "MBA",
    notes: "Great product sense, leadership experience",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.d@email.com",
    phone: "+1 (555) 345-6789",
    position: "UX Designer",
    stage: "Screened",
    rating: 4.2,
    appliedDate: "2024-01-18",
    resume: "https://example.com/resumes/emily-davis.pdf",
    skills: ["Figma", "User Research", "Prototyping", "Accessibility"],
    experience: "3 years",
    education: "BFA Design",
    notes: "Strong portfolio, user-centered approach",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "j.wilson@email.com",
    phone: "+1 (555) 456-7890",
    position: "DevOps Engineer",
    stage: "Applied",
    rating: 3.8,
    appliedDate: "2024-01-20",
    resume: "https://example.com/resumes/james-wilson.pdf",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    experience: "4 years",
    education: "BS Engineering",
    notes: "Good technical skills, needs cloud experience",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+1 (555) 567-8901",
    position: "Sales Representative",
    stage: "Hired",
    rating: 4.9,
    appliedDate: "2024-01-08",
    resume: "https://example.com/resumes/lisa-anderson.pdf",
    skills: ["Sales", "CRM", "Negotiation", "Presentation"],
    experience: "6 years",
    education: "BS Business",
    notes: "Top performer, exceeded targets",
  },
  {
    id: 6,
    name: "David Martinez",
    email: "d.martinez@email.com",
    phone: "+1 (555) 678-9012",
    position: "Marketing Specialist",
    stage: "Interviewed",
    rating: 4.1,
    appliedDate: "2024-01-14",
    resume: "https://example.com/resumes/david-martinez.pdf",
    skills: ["Digital Marketing", "SEO", "Content", "Analytics"],
    experience: "3 years",
    education: "BS Marketing",
    notes: "Creative thinker, data-driven approach",
  },
];

export default function RecruiterCandidates() {
  const navigate = useNavigate();
  const [candidateStage, setCandidateStage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showActions, setShowActions] = useState(false);

  const filteredCandidates = candidates
    .filter(candidate =>
      candidateStage === "all" || candidate.stage.toLowerCase() === candidateStage
    )
    .filter(candidate =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Applied": return "bg-blue-100 text-blue-800";
      case "Screened": return "bg-yellow-100 text-yellow-800";
      case "Interviewed": return "bg-purple-100 text-purple-800";
      case "Offered": return "bg-orange-100 text-orange-800";
      case "Hired": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleSendEmail = (candidate) => {
    // In a real app, this would open email composer
    alert(`Emailing ${candidate.name} at ${candidate.email}`);
  };

  const handleScheduleInterview = (candidate) => {
    navigate(`/recruiter/interviews?candidate=${candidate.id}`);
  };

  const handleMoveToNextStage = (candidate) => {
    // In a real app, this would update the candidate stage via API
    alert(`Moving ${candidate.name} to next stage`);
  };

  const handleReject = (candidate) => {
    // In a real app, this would update the candidate stage to "Rejected" via API
    alert(`Rejecting ${candidate.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground">
            Manage and track your candidate pipeline
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Tabs value={candidateStage} onValueChange={setCandidateStage}>
            <TabsList className="hidden md:flex">
              {candidateStages.map((stage) => (
                <TabsTrigger
                  key={stage.value}
                  value={stage.value}
                  className="px-3 py-2 text-sm font-medium"
                >
                  {stage.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="outline" size="sm" onClick={() => setCandidateStage("all")} className="md:hidden">
              <Users className="h-4 w-4 mr-2" /> All
            </Button>
          </Tabs>
          <Button onClick={() => navigate("/recruiter/candidates/new")} className="gap-2">
            <Plus className="h-4 w-4" /> Add Candidate
          </Button>
          <div className="relative">
            <Input
              placeholder="Search candidates..."
              className="pl-10 bg-muted/50 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No candidates found</p>
            {candidateStage !== "all" && (
              <Button variant="outline" onClick={() => setCandidateStage("all")}>
                Show all candidates
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell><Checkbox /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>
                      <Badge className={getStageColor(candidate.stage)}>
                        {candidate.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{candidate.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{candidate.appliedDate}</TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-48">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleViewProfile(candidate)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View Profile
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleSendEmail(candidate)}
                          >
                            <Mail className="h-4 w-4 mr-2" /> Send Email
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleScheduleInterview(candidate)}
                          >
                            <Calendar className="h-4 w-4 mr-2" /> Schedule Interview
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleMoveToNextStage(candidate)}
                          >
                            <TrendingUp className="h-4 w-4 mr-2" /> Move to Next Stage
                          </Button>
                          <Separator className="my-2" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-destructive"
                            onClick={() => handleReject(candidate)}
                          >
                            <XCircle className="h-4 w-4 mr-2" /> Reject
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}