import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  mockCandidates, 
  mockAssessments, 
} from "@/data/adminModuleData";
import { UserPlus, ClipboardList, Code2, Video, Send } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  type: 'assessment' | 'coding' | 'interview';
}

export const AssignmentSystem = () => {
  const { toast } = useToast();
  const [selectedJobSeeker, setSelectedJobSeeker] = useState<string>("");
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [resourceType, setResourceType] = useState<'assessment' | 'coding' | 'interview'>('assessment');
  const [isAssigning, setIsAssigning] = useState(false);

  // Mock available resources
  const resources: Resource[] = [
    ...mockAssessments.map(a => ({ id: a.id, title: a.title, type: 'assessment' as const })),
    { id: 'coding_1', title: 'Frontend React Challenge', type: 'coding' as const },
    { id: 'coding_2', title: 'Backend Node.js Challenge', type: 'coding' as const },
    { id: 'interview_1', title: 'Technical Interview (Standard)', type: 'interview' as const },
  ];

  const filteredResources = resources.filter(r => r.type === resourceType);

  const handleAssign = () => {
    if (!selectedJobSeeker || !selectedResource) {
      toast({
        title: "Missing Information",
        description: "Please select both a job seeker and a resource to assign.",
        variant: "destructive",
      });
      return;
    }

    setIsAssigning(true);
    
    // Simulate API call
    setTimeout(() => {
      const jobSeekerName = mockCandidates.find(c => c.id === selectedJobSeeker)?.fullName || "Job Seeker";
      const resourceName = resources.find(r => r.id === selectedResource)?.title || "Resource";

      // Store assignment in localStorage for demo purposes
      const existingAssignments = JSON.parse(localStorage.getItem('interq_assignments') || '[]');
      const newAssignment = {
        id: `assign_${Date.now()}`,
        jobSeekerId: selectedJobSeeker,
        jobSeekerName,
        resourceId: selectedResource,
        resourceName,
        type: resourceType,
        status: 'pending',
        assignedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('interq_assignments', JSON.stringify([...existingAssignments, newAssignment]));

      toast({
        title: "Success! 🚀",
        description: `Successfully assigned ${resourceName} to ${jobSeekerName}.`,
      });
      
      setSelectedJobSeeker("");
      setSelectedResource("");
      setIsAssigning(false);
    }, 1000);
  };

  return (
    <Card className="border-primary/20 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <CardTitle>Assign Assessment or Test</CardTitle>
        </div>
        <CardDescription>
          Select a candidate and assign them a specific assessment, coding test, or live interview slot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>1. Select Job Seeker</Label>
            <Select value={selectedJobSeeker} onValueChange={setSelectedJobSeeker}>
              <SelectTrigger>
                <SelectValue placeholder="Choose candidate..." />
              </SelectTrigger>
              <SelectContent>
                {mockCandidates.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.fullName} ({c.appliedRole})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>2. Select Type</Label>
            <div className="flex gap-2">
              <Button 
                variant={resourceType === 'assessment' ? "default" : "outline"} 
                size="sm" 
                className="flex-1 gap-1"
                onClick={() => { setResourceType('assessment'); setSelectedResource(""); }}
              >
                <ClipboardList className="w-4 h-4" /> MCQ
              </Button>
              <Button 
                variant={resourceType === 'coding' ? "default" : "outline"} 
                size="sm" 
                className="flex-1 gap-1"
                onClick={() => { setResourceType('coding'); setSelectedResource(""); }}
              >
                <Code2 className="w-4 h-4" /> Coding
              </Button>
              <Button 
                variant={resourceType === 'interview' ? "default" : "outline"} 
                size="sm" 
                className="flex-1 gap-1"
                onClick={() => { setResourceType('interview'); setSelectedResource(""); }}
              >
                <Video className="w-4 h-4" /> Live
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>3. Select Specific {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}</Label>
          <Select value={selectedResource} onValueChange={setSelectedResource}>
            <SelectTrigger>
              <SelectValue placeholder={`Choose ${resourceType}...`} />
            </SelectTrigger>
            <SelectContent>
              {filteredResources.map(r => (
                <SelectItem key={r.id} value={r.id}>
                  {r.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full gap-2 mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-6 shadow-elegant-blue" 
          onClick={handleAssign}
          disabled={isAssigning}
        >
          {isAssigning ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Assigning...
            </div>
          ) : (
            <>
              <Send className="w-4 h-4" /> Confirm Assignment
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
