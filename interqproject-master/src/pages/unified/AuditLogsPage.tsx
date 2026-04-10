import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockAuditLogs } from "@/data/adminModuleData";
import { ScrollText, Search, Download, Filter, User, Building2, Briefcase, FileText, Shield } from "lucide-react";

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  approve: "bg-purple-100 text-purple-700",
  login: "bg-gray-100 text-gray-700",
  export: "bg-yellow-100 text-yellow-700",
};

const moduleIcons: Record<string, any> = {
  jobs: Briefcase,
  companies: Building2,
  candidates: User,
  auth: Shield,
  reports: FileText,
  offers: FileText,
};

export default function AuditLogsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");

  const filtered = mockAuditLogs.filter(log => {
    const matchSearch = log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.entityName.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const matchModule = moduleFilter === "all" || log.module === moduleFilter;
    return matchSearch && matchAction && matchModule;
  });

  const uniqueActions = [...new Set(mockAuditLogs.map(l => l.action))];
  const uniqueModules = [...new Set(mockAuditLogs.map(l => l.module))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Track all actions and changes on the platform</p>
        </div>
        <Button variant="outline" onClick={() => toast({ title: "Exported", description: "Audit logs exported as CSV." })}>
          <Download className="h-4 w-4 mr-2" />Export Logs
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by user or entity..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Action" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map(a => <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Module" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {uniqueModules.map(m => <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card><CardContent className="p-12 text-center text-muted-foreground">No audit logs found.</CardContent></Card>
        ) : filtered.map(log => {
          const ModuleIcon = moduleIcons[log.module] || ScrollText;
          return (
            <Card key={log.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ModuleIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{log.userName}</span>
                      <Badge className={`text-xs capitalize ${actionColors[log.action] || "bg-gray-100 text-gray-700"}`}>{log.action}</Badge>
                      <span className="text-sm text-muted-foreground">{log.entityName}</span>
                    </div>
                    <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span className="capitalize">{log.module} module</span>
                      {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    {log.changes && log.changes.length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground bg-muted rounded px-2 py-1 inline-block">
                        {log.changes.map((c: any) => `${c.field}: "${c.oldValue}" → "${c.newValue}"`).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
