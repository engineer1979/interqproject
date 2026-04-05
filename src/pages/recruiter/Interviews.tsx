import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Video, MapPin, Phone, MoreHorizontal, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DayPicker } from 'react-day-picker';
import { Interview } from '@/types/recruiter';

const mockCandidates = [
  "Sarah Johnson", "Michael Chen", "Emily Davis", "James Wilson"
];

const Interviews = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([
    { 
      id: 1, 
      candidate: "Sarah Johnson", 
      interviewer: "John Smith", 
      position: "Senior Frontend Developer", 
      date: "2024-01-25", 
      time: "10:00 AM", 
      mode: "Video", 
      status: "Scheduled" 
    },
    { 
      id: 2, 
      candidate: "David Martinez", 
      interviewer: "Jane Doe", 
      position: "Marketing Specialist", 
      date: "2024-01-25", 
      time: "02:00 PM", 
      mode: "In-person", 
      status: "Scheduled" 
    },
  ]);
  const [formData, setFormData] = useState({
    candidate: '',
    interviewer: '',
    position: '',
    date: new Date(),
    time: '',
    mode: 'Video' as 'Video' | 'In-person' | 'Phone',
  });
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.candidate || !formData.interviewer || !formData.position || !formData.time) return;

    const newInterview: Interview = {
      id: Date.now(),
      ...formData,
      date: format(formData.date, 'yyyy-MM-dd'),
      status: 'Scheduled',
    };

    if (editingInterview) {
      setInterviews(interviews.map(i => i.id === editingInterview.id ? newInterview : i));
    } else {
      setInterviews([...interviews, newInterview]);
    }

    setShowScheduleModal(false);
    setEditingInterview(null);
    setFormData({
      candidate: '',
      interviewer: '',
      position: '',
      date: new Date(),
      time: '',
      mode: 'Video',
    });
  };

  const handleEdit = (interview: Interview) => {
    setEditingInterview(interview);
    setFormData({
      candidate: interview.candidate,
      interviewer: interview.interviewer,
      position: interview.position,
      date: new Date(interview.date),
      time: interview.time,
      mode: interview.mode,
    });
    setShowScheduleModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this interview?')) {
      setInterviews(interviews.filter(i => i.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Interviews</h2>
          <p className="text-gray-600">Schedule and track candidate interviews</p>
        </div>
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingInterview ? 'Edit Interview' : 'Schedule New Interview'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Candidate</Label>
                  <Select value={formData.candidate} onValueChange={(value) => setFormData({ ...formData, candidate: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCandidates.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Interviewer</Label>
                  <Input
                    value={formData.interviewer}
                    onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                    placeholder="Interviewer name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Position</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Job position"
                  />
                </div>
                <div>
                  <Label htmlFor="mode">Mode</Label>
                  <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="In-person">In-person</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <DayPicker
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({ ...formData, date: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{editingInterview ? 'Update' : 'Schedule'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">{interviews.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Total Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-600">{interviews.filter(i => i.status === 'Scheduled').length}</div>
            <p className="text-sm text-muted-foreground mt-1">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600">{interviews.filter(i => i.status === 'Completed').length}</div>
            <p className="text-sm text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-orange-600">{interviews.filter(i => i.date === format(new Date(), 'yyyy-MM-dd')).length}</div>
            <p className="text-sm text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Interviews List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium text-sm">Candidate</th>
                  <th className="text-left p-4 font-medium text-sm">Position</th>
                  <th className="text-left p-4 font-medium text-sm">Interviewer</th>
                  <th className="text-left p-4 font-medium text-sm">Date & Time</th>
                  <th className="text-left p-4 font-medium text-sm">Mode</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="w-24 text-right p-4"></th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{interview.candidate}</td>
                    <td className="p-4">{interview.position}</td>
                    <td className="p-4">{interview.interviewer}</td>
                    <td className="p-4">{interview.date} {interview.time}</td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {interview.mode === 'Video' ? <Video className="w-3 h-3 mr-1" /> : 
                         interview.mode === 'In-person' ? <MapPin className="w-3 h-3 mr-1" /> : 
                         <Phone className="w-3 h-3 mr-1" />}
                        {interview.mode}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(interview)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(interview.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {interviews.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      No interviews scheduled. Create your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Interviews;

