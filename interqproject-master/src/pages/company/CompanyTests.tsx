import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardList, Eye, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { mockAssessments } from "@/data/adminModuleData";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CompanyTests() {
  const outletContext = useOutletContext<{ company: { id: string } }>();
  const company = outletContext?.company || { id: "demo" };
  const navigate = useNavigate();

  const [allTests, setAllTests] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTest, setNewTest] = useState({ title: "", category: "Technical", questions: 10, duration: 30 });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('companyTests');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      if (parsed && parsed.length > 0) {
        setAllTests(parsed);
      } else {
        const mocks = (mockAssessments as any[]).map(a => ({
          ...a,
          is_published: true,
          assessment_questions: Array(a.questions || 0).fill({}),
          duration_minutes: a.duration,
          passing_score: 70
        }));
        setAllTests(mocks);
        localStorage.setItem('companyTests', JSON.stringify(mocks));
      }
    } catch (e) {
      localStorage.removeItem('companyTests');
    }
    setIsLoading(false);
  }, []);

  const handleCreateTest = () => {
    if (!newTest.title) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    const testToAdd = {
      id: "test-" + Date.now(),
      ...newTest,
      is_published: false,
      assessment_questions: Array(newTest.questions).fill({}),
      duration_minutes: newTest.duration,
      passing_score: 70,
      difficulty: "Intermediate",
      created_at: new Date().toISOString()
    };
    const updated = [testToAdd, ...allTests];
    setAllTests(updated);
    localStorage.setItem('companyTests', JSON.stringify(updated));
    setIsModalOpen(false);
    setNewTest({ title: "", category: "Technical", questions: 10, duration: 30 });
    toast({ title: "Test Created", description: "Successfully added to your bank." });
  };

  const handleDeleteTest = (id: string) => {
    const updated = allTests.filter(t => t.id !== id);
    setAllTests(updated);
    localStorage.setItem('companyTests', JSON.stringify(updated));
    toast({ title: "Test Deleted", description: "Assessment removed from bank." });
  };

  const togglePublished = (id: string) => {
    const updated = allTests.map(t => t.id === id ? { ...t, is_published: !t.is_published } : t);
    setAllTests(updated);
    localStorage.setItem('companyTests', JSON.stringify(updated));
    toast({ title: "Status Updated", description: "Publication status changed." });
  };


  return (
    <>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tests & Question Bank</h1>
          <p className="text-sm text-muted-foreground">{allTests.length} tests created</p>
        </div>
        <Button className="bg-[#00BCD4] hover:bg-[#00acc1] text-white border-none" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Test
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)}</div>
      ) : allTests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tests yet</h3>
            <p className="text-muted-foreground mb-4">Build your first assessment test for candidates.</p>
            <Button className="bg-[#00BCD4] hover:bg-[#00acc1] text-white border-none" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Test
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allTests.map((test: any) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{test.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{test.category} • {test.difficulty}</p>
                  </div>
                  <Badge variant={test.is_published ? "default" : "secondary"}>
                    {test.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{test.assessment_questions?.length ?? 0} questions</span>
                  <span>{test.duration_minutes} min • {test.passing_score}% pass</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: "Preview", description: "Loading assessment preview..." })}>
                    <Eye className="h-3 w-3 mr-1" /> Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 hover:text-red-700" 
                    onClick={() => handleDeleteTest(test.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
                <div className="pt-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full text-xs" 
                    onClick={() => togglePublished(test.id)}
                  >
                    {test.is_published ? "Unpublish" : "Publish Test"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Test</DialogTitle>
            <DialogDescription>Define the basic structure for your new assessment.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-slate-800">
            <div className="grid gap-2">
              <Label htmlFor="tTitle">Test Title</Label>
              <Input 
                id="tTitle" 
                placeholder="e.g. Senior Backend Architect" 
                value={newTest.title}
                onChange={(e) => setNewTest({...newTest, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tCat">Category</Label>
                <select 
                  id="tCat" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTest.category}
                  onChange={(e) => setNewTest({...newTest, category: e.target.value})}
                >
                  <option value="Technical">Technical</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Management">Management</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tDur">Duration (min)</Label>
                <Input 
                  id="tDur" 
                  type="number" 
                  value={newTest.duration}
                  onChange={(e) => setNewTest({...newTest, duration: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTest}>Create Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
