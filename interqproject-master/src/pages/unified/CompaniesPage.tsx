import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockCompanies } from "@/data/adminModuleData";
import { Building2, Search, Plus, Globe, Users, Briefcase, Eye, Edit, MoreHorizontal } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  trial: "bg-blue-100 text-blue-700",
  suspended: "bg-red-100 text-red-700",
};

const planColors: Record<string, string> = {
  enterprise: "bg-purple-100 text-purple-700",
  professional: "bg-blue-100 text-blue-700",
  basic: "bg-gray-100 text-gray-700",
};

export default function CompaniesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", industry: "", contactEmail: "", plan: "basic" });

  const filtered = mockCompanies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newCompany.name) { toast({ title: "Error", description: "Company name required.", variant: "destructive" }); return; }
    toast({ title: "Company Added", description: `${newCompany.name} added to platform.` });
    setShowAdd(false);
    setNewCompany({ name: "", industry: "", contactEmail: "", plan: "basic" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage all companies on the platform</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" />Add Company</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: mockCompanies.length, color: "text-blue-600" },
          { label: "Active", value: mockCompanies.filter(c => c.status === "active").length, color: "text-green-600" },
          { label: "Trial", value: mockCompanies.filter(c => c.status === "trial").length, color: "text-yellow-600" },
          { label: "Enterprise", value: mockCompanies.filter(c => c.subscriptionPlan === "enterprise").length, color: "text-purple-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4"><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-sm text-muted-foreground">{s.label}</div></CardContent></Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search companies..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map(company => (
          <Card key={company.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold">{company.name}</span>
                    <Badge className={`text-xs ${statusColors[company.status]}`}>{company.status}</Badge>
                    <Badge className={`text-xs ${planColors[company.subscriptionPlan]}`}>{company.subscriptionPlan}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{company.industry} · {company.size} employees · {company.country}</p>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{company.recruiterCount} recruiters</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{company.jobCount} jobs</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{company.candidateCount} candidates</span>
                    {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600"><Globe className="h-3 w-3" />Website</a>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast({ title: company.name, description: `Viewing ${company.name} details.` })}>
                    <Eye className="h-3 w-3 mr-1" />View
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast({ title: "Edit", description: `Editing ${company.name}.` })}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Company</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Company Name *</Label><Input placeholder="TechCorp Inc." value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} /></div>
            <div><Label>Industry</Label><Input placeholder="Technology" value={newCompany.industry} onChange={e => setNewCompany({ ...newCompany, industry: e.target.value })} /></div>
            <div><Label>Contact Email</Label><Input type="email" placeholder="contact@company.com" value={newCompany.contactEmail} onChange={e => setNewCompany({ ...newCompany, contactEmail: e.target.value })} /></div>
            <div><Label>Plan</Label>
              <Select value={newCompany.plan} onValueChange={val => setNewCompany({ ...newCompany, plan: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
