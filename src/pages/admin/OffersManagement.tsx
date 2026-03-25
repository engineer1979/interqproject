import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  FileText,
  Send,
  XCircle,
  CheckCircle,
  Download,
  Filter,
  X,
  Calendar,
  DollarSign,
  Building2,
  User,
  Briefcase,
  Clock,
  TrendingUp,
  FileCheck,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Offer, OfferStatus } from "@/types/adminModule";
import { mockOffers, mockCompanies, mockJobs, mockCandidates } from "@/data/adminModuleData";

const statusConfig: Record<OfferStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; color: string }> = {
  draft: { label: "Draft", variant: "secondary", color: "bg-gray-100 text-gray-700" },
  pending_approval: { label: "Pending Approval", variant: "secondary", color: "bg-yellow-100 text-yellow-700" },
  sent: { label: "Sent", variant: "default", color: "bg-blue-100 text-blue-700" },
  accepted: { label: "Accepted", variant: "default", color: "bg-green-100 text-green-700" },
  declined: { label: "Declined", variant: "destructive", color: "bg-red-100 text-red-700" },
  expired: { label: "Expired", variant: "outline", color: "bg-gray-50 text-gray-500" },
};

const statusProgression = ["draft", "pending_approval", "sent", "accepted"];

const ITEMS_PER_PAGE = 10;

interface OfferFormData {
  candidateId: string;
  jobId: string;
  companyId: string;
  salary: string;
  joiningDate: string;
  expiryDate: string;
  notes: string;
}

const initialFormData: OfferFormData = {
  candidateId: "",
  jobId: "",
  companyId: "",
  salary: "",
  joiningDate: "",
  expiryDate: "",
  notes: "",
};

export default function OffersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState<OfferFormData>(initialFormData);
  const [offers, setOffers] = useState<Offer[]>(mockOffers);

  const [filters, setFilters] = useState({
    companyId: "",
    status: "" as OfferStatus | "",
    dateFrom: "",
    dateTo: "",
  });

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesSearch =
        offer.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.companyName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCompany = !filters.companyId || offer.companyId === filters.companyId;
      const matchesStatus = !filters.status || offer.status === filters.status;
      
      let matchesDate = true;
      if (filters.dateFrom) {
        matchesDate = new Date(offer.createdAt) >= new Date(filters.dateFrom);
      }
      if (filters.dateTo && matchesDate) {
        matchesDate = new Date(offer.createdAt) <= new Date(filters.dateTo);
      }

      return matchesSearch && matchesCompany && matchesStatus && matchesDate;
    });
  }, [offers, searchTerm, filters]);

  const paginatedOffers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOffers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOffers, currentPage]);

  const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);

  const statistics = useMemo(() => {
    const total = offers.length;
    const accepted = offers.filter(o => o.status === "accepted").length;
    const declined = offers.filter(o => o.status === "declined").length;
    const pending = offers.filter(o => o.status === "pending_approval" || o.status === "sent").length;
    const expired = offers.filter(o => o.status === "expired").length;
    const totalValue = offers.reduce((sum, o) => sum + o.salary, 0);
    const avgSalary = total > 0 ? Math.round(totalValue / total) : 0;
    const acceptanceRate = pending + accepted > 0 ? Math.round((accepted / (pending + accepted + declined || 1)) * 100) : 0;

    return { total, accepted, declined, pending, expired, totalValue, avgSalary, acceptanceRate };
  }, [offers]);

  const handleCreateOffer = () => {
    const newOffer: Offer = {
      id: `offer_${Date.now()}`,
      candidateId: formData.candidateId,
      candidateName: mockCandidates.find(c => c.id === formData.candidateId)?.fullName || "",
      jobId: formData.jobId,
      jobTitle: mockJobs.find(j => j.id === formData.jobId)?.title || "",
      companyId: formData.companyId,
      companyName: mockCompanies.find(c => c.id === formData.companyId)?.name || "",
      salary: parseInt(formData.salary, 10) || 0,
      joiningDate: formData.joiningDate,
      expiryDate: formData.expiryDate,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    setOffers([newOffer, ...offers]);
    setIsCreateDialogOpen(false);
    setFormData(initialFormData);
  };

  const handleEditOffer = () => {
    if (!selectedOffer) return;
    setOffers(offers.map(o => o.id === selectedOffer.id ? { ...o, ...formData, salary: parseInt(formData.salary, 10) || o.salary } : o));
    setIsEditDialogOpen(false);
    setSelectedOffer(null);
    setFormData(initialFormData);
  };

  const handleStatusChange = (offerId: string, newStatus: OfferStatus) => {
    setOffers(offers.map(o => o.id === offerId ? { ...o, status: newStatus } : o));
  };

  const getAvailableActions = (offer: Offer) => {
    const actions: { label: string; action: () => void; icon: React.ReactNode; disabled?: boolean }[] = [];

    if (offer.status === "draft") {
      actions.push(
        { label: "Edit", action: () => { setSelectedOffer(offer); setFormData({ candidateId: offer.candidateId, jobId: offer.jobId, companyId: offer.companyId, salary: offer.salary.toString(), joiningDate: offer.joiningDate, expiryDate: offer.expiryDate, notes: "" }); setIsEditDialogOpen(true); }, icon: <Edit className="h-4 w-4" /> },
        { label: "Approve", action: () => handleStatusChange(offer.id, "pending_approval"), icon: <FileCheck className="h-4 w-4" /> }
      );
    } else if (offer.status === "pending_approval") {
      actions.push(
        { label: "Send Offer", action: () => handleStatusChange(offer.id, "sent"), icon: <Send className="h-4 w-4" /> }
      );
    } else if (offer.status === "sent") {
      actions.push(
        { label: "Mark Accepted", action: () => handleStatusChange(offer.id, "accepted"), icon: <CheckCircle className="h-4 w-4" /> },
        { label: "Mark Declined", action: () => handleStatusChange(offer.id, "declined"), icon: <XCircle className="h-4 w-4" /> },
        { label: "Withdraw", action: () => handleStatusChange(offer.id, "expired"), icon: <RefreshCw className="h-4 w-4" /> }
      );
    }

    actions.push({ label: "Download Letter", action: () => {}, icon: <Download className="h-4 w-4" /> });
    return actions;
  };

  const clearFilters = () => {
    setFilters({ companyId: "", status: "", dateFrom: "", dateTo: "" });
    setSearchTerm("");
  };

  const hasActiveFilters = filters.companyId || filters.status || filters.dateFrom || filters.dateTo || searchTerm;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offers Management</h1>
          <p className="text-muted-foreground">Track and manage all offer letters across companies</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">+{statistics.pending} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.accepted}</div>
            <p className="text-xs text-muted-foreground">{statistics.acceptanceRate}% acceptance rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.declined}</div>
            <p className="text-xs text-muted-foreground">{statistics.expired} expired</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(statistics.avgSalary / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Total: ${(statistics.totalValue / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Status Progression</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {statusProgression.map((status, index) => {
              const count = offers.filter(o => o.status === status || (status === "accepted" && offers.some(oo => oo.status === "accepted"))).length;
              const isActive = offers.some(o => o.status === status);
              return (
                <div key={status} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? statusConfig[status].color : "bg-gray-100"}`}>
                      {index === 0 && <FileText className="h-5 w-5" />}
                      {index === 1 && <FileCheck className="h-5 w-5" />}
                      {index === 2 && <Send className="h-5 w-5" />}
                      {index === 3 && <CheckCircle className="h-5 w-5" />}
                    </div>
                    <span className="text-xs mt-1 font-medium">{statusConfig[status].label}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                  {index < statusProgression.length - 1 && (
                    <div className={`w-20 h-1 mx-2 rounded ${offers.some(o => o.status === statusProgression[index + 1]) ? "bg-green-500" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Offers</CardTitle>
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-8 w-[250px]"
                />
              </div>
              <Select value={filters.companyId} onValueChange={(v) => { setFilters({ ...filters, companyId: v }); setCurrentPage(1); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={(v) => { setFilters({ ...filters, status: v as OfferStatus }); setCurrentPage(1); }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => { setFilters({ ...filters, dateFrom: e.target.value }); setCurrentPage(1); }}
                className="w-[150px]"
                placeholder="From"
              />
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => { setFilters({ ...filters, dateTo: e.target.value }); setCurrentPage(1); }}
                className="w-[150px]"
                placeholder="To"
              />
              {hasActiveFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOffers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No offers found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{offer.candidateName}</div>
                          <div className="text-xs text-muted-foreground">{offer.candidateId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{offer.jobTitle}</div>
                          <div className="text-xs text-muted-foreground">{offer.jobId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {offer.companyName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${offer.salary.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(offer.joiningDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${offer.status === "expired" ? "text-red-600" : ""}`}>
                        <Clock className="h-4 w-4" />
                        {new Date(offer.expiryDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[offer.status].color} variant={statusConfig[offer.status].variant}>
                        {statusConfig[offer.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {getAvailableActions(offer).map((action) => (
                            <DropdownMenuItem key={action.label} onClick={action.action}>
                              {action.icon}
                              <span className="ml-2">{action.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredOffers.length)} of {filteredOffers.length} offers
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Offer</DialogTitle>
            <DialogDescription>Create a new offer letter for a candidate</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select value={formData.companyId} onValueChange={(v) => setFormData({ ...formData, companyId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job">Job Position</Label>
                <Select value={formData.jobId} onValueChange={(v) => setFormData({ ...formData, jobId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select job" /></SelectTrigger>
                  <SelectContent>
                    {mockJobs.filter(j => !formData.companyId || j.companyId === formData.companyId).map((j) => (
                      <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidate">Candidate</Label>
              <Select value={formData.candidateId} onValueChange={(v) => setFormData({ ...formData, candidateId: v })}>
                <SelectTrigger><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  {mockCandidates.filter(c => !formData.jobId || c.jobId === formData.jobId).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary ($)</Label>
                <Input id="salary" type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joining">Joining Date</Label>
                <Input id="joining" type="date" value={formData.joiningDate} onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateOffer}>Create Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
            <DialogDescription>Update offer details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Select value={formData.companyId} onValueChange={(v) => setFormData({ ...formData, companyId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Position</Label>
                <Select value={formData.jobId} onValueChange={(v) => setFormData({ ...formData, jobId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {mockJobs.map((j) => (<SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Candidate</Label>
              <Select value={formData.candidateId} onValueChange={(v) => setFormData({ ...formData, candidateId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockCandidates.map((c) => (<SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Salary ($)</Label>
                <Input type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Joining Date</Label>
                <Input type="date" value={formData.joiningDate} onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedOffer(null); }}>Cancel</Button>
            <Button onClick={handleEditOffer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
