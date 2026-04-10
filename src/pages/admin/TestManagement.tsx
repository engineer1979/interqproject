import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { mockTests } from "@/data/adminModuleData";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function TestManagement() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('adminTests');
    if (saved) {
      setAssessments(JSON.parse(saved));
    } else {
      setAssessments(mockTests);
      localStorage.setItem('adminTests', JSON.stringify(mockTests));
    }
    setIsLoading(false);
  }, []);

  const categories = ["all", ...Array.from(new Set(assessments?.map((a) => a.category || "General") ?? [])).sort()];

  const filtered = assessments?.filter((a) => {
    const title = a.title || "";
    const category = a.category || "";
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || category === categoryFilter;
    return matchSearch && matchCat;
  }) ?? [];

  const handleDelete = (id: string) => {
    const updated = assessments.filter(a => a.id !== id);
    setAssessments(updated);
    localStorage.setItem('adminTests', JSON.stringify(updated));
    toast({ title: "Test deleted" });
  };

  const handleTogglePublish = (id: string, currentState: boolean) => {
    const updated = assessments.map(a => a.id === id ? { ...a, is_published: !currentState } : a);
    setAssessments(updated);
    localStorage.setItem('adminTests', JSON.stringify(updated));
    toast({ title: currentState ? "Test unpublished" : "Test published" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Test Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} tests found in global bank</p>
        </div>
        <Button onClick={() => window.location.href = "/create-assessment"}>
          <Plus className="h-4 w-4 mr-2" /> Create Custom Test
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search global test bank..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{test.title}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{test.category || "General"}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={test.difficulty === "Hard" ? "destructive" : test.difficulty === "Medium" ? "secondary" : "default"} className="text-[10px]">
                        {test.difficulty || "Medium"}
                      </Badge>
                    </TableCell>
                    <TableCell>{test.questionCount || 20}</TableCell>
                    <TableCell>{test.duration_minutes || test.timeLimit || 30}m</TableCell>
                    <TableCell>
                      <Badge
                        variant={test.is_published ? "default" : "outline"}
                        className="text-[10px] cursor-pointer"
                        onClick={() => handleTogglePublish(test.id, !!test.is_published)}
                      >
                        {test.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Test?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{test.title}" and all its questions. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(test.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!filtered.length && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No tests found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
