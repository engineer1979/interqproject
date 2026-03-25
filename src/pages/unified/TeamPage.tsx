import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/data/adminModuleData";
import { Users, Plus, Search, Mail, Phone, Edit, Trash2, UserCheck } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function TeamPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ name: "", email: "", role: "Recruiter" });

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = () => {
    if (!invite.name || !invite.email) {
      toast({ title: "Error", description: "Name and email required.", variant: "destructive" });
      return;
    }
    toast({ title: "Invitation Sent", description: `Invite sent to ${invite.email}.` });
    setShowInvite(false);
    setInvite({ name: "", email: "", role: "Recruiter" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and their roles</p>
        </div>
        <Button onClick={() => setShowInvite(true)}><Plus className="h-4 w-4 mr-2" />Invite Member</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Members", value: mockUsers.length, color: "text-blue-600" },
          { label: "Active", value: mockUsers.filter(u => u.status === "active").length, color: "text-green-600" },
          { label: "Pending", value: mockUsers.filter(u => u.status === "pending").length, color: "text-yellow-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4"><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-sm text-muted-foreground">{s.label}</div></CardContent></Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search team members..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map(member => (
          <Card key={member.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{member.name}</span>
                    <Badge className={`text-xs ${statusColors[member.status]}`}>{member.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{member.role} · {member.department}</div>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{member.email}</span>
                    {member.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{member.phone}</span>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {member.lastLogin ? `Last login: ${new Date(member.lastLogin).toLocaleDateString()}` : "Never logged in"}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast({ title: "Edit Member", description: `Editing ${member.name}.` })}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast({ title: "Member Removed", description: `${member.name} removed from team.` })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Full Name</Label><Input placeholder="John Smith" value={invite.name} onChange={e => setInvite({ ...invite, name: e.target.value })} /></div>
            <div><Label>Email Address</Label><Input type="email" placeholder="john@company.com" value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} /></div>
            <div>
              <Label>Role</Label>
              <Select value={invite.role} onValueChange={val => setInvite({ ...invite, role: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recruiter">Recruiter</SelectItem>
                  <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
                  <SelectItem value="Interviewer">Interviewer</SelectItem>
                  <SelectItem value="HR Executive">HR Executive</SelectItem>
                  <SelectItem value="Company Admin">Company Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
