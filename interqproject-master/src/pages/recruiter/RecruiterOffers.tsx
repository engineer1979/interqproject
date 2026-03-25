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
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Clock,
  Users,
  MoreHorizontal,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const offerStatusOptions = [
  { value: "all", label: "All Offers" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
  { value: "withdrawn", label: "Withdrawn" },
];

const offers = [
  {
    id: 1,
    candidate: "Michael Chen",
    position: "Product Manager",
    salary: "$125,000",
    status: "Pending",
    sentDate: "2024-01-24",
    responseDate: "-",
    equity: "0.1%",
    bonus: "$15,000",
    startDate: "2024-02-01",
    notes: "Waiting for candidate's decision",
  },
  {
    id: 2,
    candidate: "Lisa Anderson",
    position: "Sales Representative",
    salary: "$72,000",
    status: "Accepted",
    sentDate: "2024-01-20",
    responseDate: "2024-01-22",
    equity: "0.05%",
    bonus: "$5,000",
    startDate: "2024-02-15",
    notes: "Candidate accepted the offer",
  },
  {
    id: 3,
    candidate: "Alex Thompson",
    position: "Senior Developer",
    salary: "$145,000",
    status: "Declined",
    sentDate: "2024-01-18",
    responseDate: "2024-01-21",
    equity: "0.15%",
    bonus: "$20,000",
    startDate: "2024-02-01",
    notes: "Candidate accepted another offer",
  },
  {
    id: 4,
    candidate: "Jennifer Lee",
    position: "UX Designer",
    salary: "$105,000",
    status: "Pending",
    sentDate: "2024-01-23",
    responseDate: "-",
    equity: "0.08%",
    bonus: "$10,000",
    startDate: "2024-03-01",
    notes: "Offer sent, waiting for response",
  },
  {
    id: 5,
    candidate: "David Martinez",
    position: "Marketing Specialist",
    salary: "$85,000",
    status: "Withdrawn",
    sentDate: "2024-01-22",
    responseDate: "2024-01-23",
    equity: "0.05%",
    bonus: "$5,000",
    startDate: "2024-03-15",
    notes: "Offer withdrawn due to budget constraints",
  },
];

export default function RecruiterOffers() {
  const navigate = useNavigate();
  const [offerStatus, setOfferStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [editingOffer, setEditingOffer] = useState(false);

  const filteredOffers = offers
    .filter(offer =>
      offerStatus === "all" || offer.status.toLowerCase() === offerStatus
    )
    .filter(offer =>
      offer.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Accepted": return "bg-green-100 text-green-800";
      case "Declined": return "bg-red-100 text-red-800";
      case "Withdrawn": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateOffer = () => {
    setShowCreateOffer(true);
  };

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setEditingOffer(true);
    setShowCreateOffer(true);
  };

  const handleWithdrawOffer = (id) => {
    // In a real app, this would make an API call
    alert(`Offer ${id} would be withdrawn`);
  };

  const handleResendOffer = (offer) => {
    // In a real app, this would resend the offer email
    alert(`Resending offer to ${offer.candidate}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground">
            Manage and track job offers to candidates
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={handleCreateOffer} className="gap-2">
            <Plus className="h-4 w-4" /> New Offer
          </Button>
          <Select value={offerStatus} onValueChange={setOfferStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {offerStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Input
              placeholder="Search offers..."
              className="pl-10 bg-muted/50 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredOffers.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No offers found</p>
            {offerStatus !== "all" && (
              <Button variant="outline" onClick={() => setOfferStatus("all")}>
                Show all offers
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
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow key={offer.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                            {offer.candidate.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{offer.candidate}</p>
                          <p className="text-xs text-muted-foreground">{offer.position}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{offer.position}</TableCell>
                    <TableCell>{offer.salary}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{offer.sentDate}</TableCell>
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
                            onClick={() => {
                              setSelectedOffer(offer);
                              setEditingOffer(false);
                              setShowCreateOffer(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleEditOffer(offer)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleResendOffer(offer)}
                          >
                            <Mail className="h-4 w-4 mr-2" /> Resend
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setSelectedOffer(offer);
                              setShowCreateOffer(false);
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" /> View Candidate
                          </Button>
                          <Separator className="my-2" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-destructive"
                            onClick={() => handleWithdrawOffer(offer.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Withdraw
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

      {/* Create/Edit Offer Modal */}
      <Dialog open={showCreateOffer} onOpenChange={setShowCreateOffer}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Offer</Button>
        </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] sm:mx-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOffer ? "Edit Offer" : "Create New Offer"}
              </DialogTitle>
              <DialogDescription>
                {editingOffer
                  ? `Edit the offer for "${selectedOffer?.candidate}"`
                  : "Fill in the details to create a new job offer."}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="candidate">Candidate</Label>
                <Input
                  id="candidate"
                  placeholder="Candidate name"
                  defaultValue={selectedOffer?.candidate || ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="Job position"
                  defaultValue={selectedOffer?.position || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    placeholder="e.g., $80,000"
                    defaultValue={selectedOffer?.salary || ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="equity">Equity</Label>
                  <Input
                    id="equity"
                    placeholder="e.g., 0.1%"
                    defaultValue={selectedOffer?.equity || ""}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bonus">Bonus</Label>
                  <Input
                    id="bonus"
                    placeholder="e.g., $15,000"
                    defaultValue={selectedOffer?.bonus || ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    defaultValue={selectedOffer?.startDate || ""}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes..."
                  className="min-h-[80px]"
                  defaultValue={selectedOffer?.notes || ""}
                />
              </div>
            </form>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowCreateOffer(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateOffer(false)}>
                {editingOffer ? "Update Offer" : "Create Offer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}