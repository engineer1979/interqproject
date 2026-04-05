import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye, MoreHorizontal, Plus } from 'lucide-react';
import { useRecruiter } from '@/contexts/RecruiterContext';
import { JobOpening } from '@/types/recruiter';

const JobOpenings = () => {
  const { state, dispatch } = useRecruiter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    salary: '',
    description: '',
    type: 'Full-time',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingJob) {
      dispatch({ type: 'UPDATE_JOB' as any, payload: { ...editingJob, ...formData } });
    } else {
      const newJob: JobOpening = {
        id: Date.now(),
        ...formData,
        status: 'Draft' as const,
        postedDate: new Date().toISOString().split('T')[0],
      };
      dispatch({ type: 'ADD_JOB' as any, payload: newJob });
    }
    setShowAddModal(false);
    setEditingJob(null);
    setFormData({ title: '', department: '', location: '', salary: '', description: '', type: 'Full-time' });
  };

  const handleEdit = (job: JobOpening) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      salary: job.salary,
      description: job.description,
      type: job.type,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this job opening?')) {
      dispatch({ type: 'DELETE_JOB' as any, payload: id });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Job Openings</h2>
          <p className="text-gray-600 mt-1">Manage your active job postings (Full CRUD)</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Job Opening
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit Job Opening' : 'Create New Job Opening'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Employment Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{editingJob ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell className="font-mono">{job.salary}</TableCell>
                  <TableCell>
                    <Badge variant={job.status === 'Open' ? 'default' : 'secondary'}>{job.status}</Badge>
                  </TableCell>
                  <TableCell>{job.postedDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {state.jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No job openings. Create your first job!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobOpenings;

