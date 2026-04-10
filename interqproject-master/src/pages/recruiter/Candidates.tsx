import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Mail, Phone, Calendar } from 'lucide-react';
import { useRecruiter } from '@/contexts/RecruiterContext';
import { Candidate } from '@/types/recruiter';

const stages = ['Applied', 'Screened', 'Interviewed', 'Offered', 'Hired', 'Rejected'];

const Candidates = () => {
  const { state, dispatch } = useRecruiter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stage: 'Applied',
    rating: 4.0,
  });

  const filteredCandidates = state.candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || candidate.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCandidate) {
      dispatch({ type: 'UPDATE_CANDIDATE' as any, payload: { ...editingCandidate, ...formData } });
      toast({ title: 'Candidate updated', description: `${formData.name} has been updated.` });
    } else {
      const newCandidate: Candidate = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        stage: formData.stage as any,
        rating: formData.rating,
        appliedDate: new Date().toISOString().split('T')[0],
      };
      dispatch({ type: 'ADD_CANDIDATE' as any, payload: newCandidate });
      toast({ title: 'Candidate added', description: `${formData.name} has been added to the pipeline.` });
    }
    
    setShowAddModal(false);
    setEditingCandidate(null);
    setFormData({ name: '', email: '', phone: '', stage: 'Applied', rating: 4.0 });
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      email: candidate.email || '',
      phone: candidate.phone || '',
      stage: candidate.stage,
      rating: candidate.rating,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      dispatch({ type: 'DELETE_CANDIDATE' as any, payload: id });
      toast({ title: 'Candidate deleted', description: 'The candidate has been removed.' });
    }
  };

  const handleStageChange = (candidate: Candidate, newStage: string) => {
    dispatch({ type: 'UPDATE_CANDIDATE' as any, payload: { ...candidate, stage: newStage as any } });
    toast({ title: 'Stage updated', description: `${candidate.name} moved to ${newStage}.` });
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'Applied': 'bg-blue-100 text-blue-700',
      'Screened': 'bg-indigo-100 text-indigo-700',
      'Interviewed': 'bg-purple-100 text-purple-700',
      'Offered': 'bg-amber-100 text-amber-700',
      'Hired': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
    };
    return colors[stage] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Candidates</h2>
          <p className="text-gray-600">Manage and track candidates through the pipeline</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Stage</Label>
                  <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rating</Label>
                  <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseFloat(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()}>{n} Stars</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{editingCandidate ? 'Update' : 'Add Candidate'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white border rounded-lg overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Current Quality Score</TableHead>
              <TableHead>Progression</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCandidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    {candidate.email && <p className="text-xs text-muted-foreground">{candidate.email}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{candidate.rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select value={candidate.stage} onValueChange={(value) => handleStageChange(candidate, value)}>
                    <SelectTrigger className={`w-[140px] ${getStageColor(candidate.stage)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {candidate.appliedDate}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(candidate)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(candidate.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredCandidates.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No candidates found. Add your first candidate!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {stages.map(stage => {
          const count = state.candidates.filter(c => c.stage === stage).length;
          return (
            <Card key={stage} className={getStageColor(stage)}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs opacity-80">{stage}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Candidates;

