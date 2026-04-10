import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollText, Search, Download } from "lucide-react";
import { format } from "date-fns";
import { mockAuditLogs } from "@/data/adminModuleData";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompanyAuditLogs() {
  const outletContext = useOutletContext<{ company: { id: string } }>();
  const company = outletContext?.company || { id: "demo" };
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('companyAuditLogs');
    if (saved) {
      setLogs(JSON.parse(saved));
    } else {
      const initialLogs = (mockAuditLogs as any[]).map(l => ({
        ...l,
        created_at: l.timestamp,
        entity_type: l.entityType,
        action: l.action.toUpperCase(),
        details: l.changes || { message: `${l.userName} performed ${l.action} on ${l.entityName}` }
      }));
      setLogs(initialLogs);
      localStorage.setItem('companyAuditLogs', JSON.stringify(initialLogs));
    }
    setIsLoading(false);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.entity_type).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.userName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action: string) => {
    if (action.includes("CREATE")) return "bg-green-100 text-green-700";
    if (action.includes("DELETE")) return "bg-red-100 text-red-700";
    if (action.includes("UPDATE")) return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Track all company actions and changes</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Download className="h-4 w-4 mr-2" /> Export Logs
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search logs by action, user, or entity..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ScrollText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No activity matches</h3>
              <p className="text-muted-foreground">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="rounded-md border-t border-slate-100">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log: any) => (
                    <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-900">{log.userName || "System"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getActionColor(log.action)} border-none text-[10px] font-bold tracking-wider`}>
                          {log.action.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 font-medium">{log.entity_type}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[300px]">
                        {typeof log.details === 'string' ? log.details : 
                         Array.isArray(log.details) ? `Updated ${log.details.length} fields` :
                         log.details?.message || JSON.stringify(log.details)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-slate-400 font-mono">
                        {format(new Date(log.created_at), "MMM d, HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
