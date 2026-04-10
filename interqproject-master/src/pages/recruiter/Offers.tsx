import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Calendar, User, Mail, Phone, Download, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Offer } from '@/types/recruiter';

const mockCandidates = [
  "Sarah Johnson", "Michael Chen", "Emily Davis", "James Wilson"
];

const Offers = () => {
  const { toast } = useToast();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([
    { 
      id: 1, 
      candidate: "Sarah Johnson", 
      position: "Senior Frontend Developer", 
      salary: "$85,000 - $95,000", 
      equity: "0.5%", 
      startDate: "2024-02-15", 
      status: "Sent" 
    },
    { 
      id: 2, 
      candidate: "Michael Chen", 
      position: "DevOps Engineer", 
      salary: "$110,000 - $130,000", 
      equity: "0.8%", 
      startDate: "2024-02-20", 
      status: "Accepted" 
    },
  ]);
  const [formData, setFormData] = useState({
    candidate: '',
    position: '',
    salary: '',
    equity: '',
    bonus: '',
    startDate: '',
    notes: '',
  });
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.candidate || !formData.position) return;

    const newOffer: Offer = {
      id: Date.now(),
      ...formData,
      status: 'Draft',
    };

    if (editingOffer) {
      setOffers(offers.map(o => o.id === editingOffer.id ? newOffer : o));
    } else {
      setOffers([...offers, newOffer]);
    }

    setShowOfferModal(false);
    setEditingOffer(null);
    setFormData({
      candidate: '',
      position: '',
      salary: '',
      equity: '',
      bonus: '',
      startDate: '',
      notes: '',
    });
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      candidate: offer.candidate,
      position: offer.position,
      salary: offer.salary,
      equity: offer.equity,
      bonus: offer.bonus || '',
      startDate: offer.startDate,
      notes: offer.notes || '',
    });
    setShowOfferModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this offer?')) {
      setOffers(offers.filter(o => o.id !== id));
      toast({ title: 'Offer Deleted', description: 'The offer has been removed' });
    }
  };

  const handleDownload = (offer: Offer) => {
    toast({ title: 'Downloading Offer', description: `Generating PDF for ${offer.candidate}` });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Accepted': return 'default';
      case 'Rejected': return 'destructive';
      case 'Sent': return 'secondary';
      case 'Draft': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Job Offers</h2>
          <p className="text-gray-600">Track and manage candidate offers</p>
        </div>
        <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
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
                  <Label>Position</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Job title"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Salary Range
                  </Label>
                  <Input
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="$80,000 - $100,000"
                  />
                </div>
                <div>
                  <Label>Equity</Label>
                  <Input
                    value={formData.equity}
                    onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                    placeholder="0.5%"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bonus</Label>
                  <Input
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                    placeholder="$10,000"
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Internal Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Offer negotiation notes..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{editingOffer ? 'Update' : 'Send Offer'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-emerald-600">{offers.filter(o => o.status === 'Accepted').length}</div>
            <p className="text-sm text-muted-foreground mt-1">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-destructive">{offers.filter(o => o.status === 'Rejected').length}</div>
            <p className="text-sm text-muted-foreground mt-1">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-600">{offers.filter(o => o.status === 'Sent').length}</div>
            <p className="text-sm text-muted-foreground mt-1">Pending Response</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-muted-foreground">{offers.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Total Offers</p>
          </CardContent>
        </Card>
      </div>

      {/* Offers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Equity</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.candidate}</TableCell>
                  <TableCell>{offer.position}</TableCell>
                  <TableCell className="font-mono">{offer.salary}</TableCell>
                  <TableCell>{offer.equity}</TableCell>
                  <TableCell>{offer.startDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(offer.status)}>{offer.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(offer)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(offer.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(offer)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {offers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No offers created yet. Create your first one!
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

export default Offers;

