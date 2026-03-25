import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mockIntegrations } from "@/data/adminModuleData";
import { Plug, Search, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  connected: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Connected" },
  disconnected: { color: "bg-gray-100 text-gray-600", icon: XCircle, label: "Disconnected" },
  pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending" },
  failed: { color: "bg-red-100 text-red-700", icon: AlertTriangle, label: "Failed" },
  expired: { color: "bg-orange-100 text-orange-700", icon: AlertTriangle, label: "Expired" },
};

const categoryIcons: Record<string, string> = {
  Calendar: "📅",
  Communication: "💬",
  "Job Boards": "🌐",
  Video: "📹",
  HRMS: "🏢",
};

export default function IntegrationsPageUnified() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [integrations, setIntegrations] = useState(mockIntegrations);

  const filtered = integrations.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (integration: any) => {
    const newStatus = integration.status === "connected" ? "disconnected" : "connected";
    setIntegrations(prev => prev.map(i => i.id === integration.id ? { ...i, status: newStatus } : i));
    toast({
      title: newStatus === "connected" ? `${integration.name} Connected` : `${integration.name} Disconnected`,
      description: newStatus === "connected" ? "Integration is now active." : "Integration has been disconnected.",
    });
  };

  const sync = (integration: any) => {
    toast({ title: "Syncing...", description: `${integration.name} sync started.` });
    setTimeout(() => toast({ title: "Sync Complete", description: `${integration.name} synced successfully.` }), 1500);
  };

  const grouped = filtered.reduce<Record<string, typeof integrations>>((acc, i) => {
    acc[i.category] = [...(acc[i.category] || []), i];
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect third-party tools and services</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Connected", value: integrations.filter(i => i.status === "connected").length, color: "text-green-600" },
          { label: "Issues", value: integrations.filter(i => ["failed", "expired"].includes(i.status)).length, color: "text-red-600" },
          { label: "Available", value: integrations.length, color: "text-blue-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4"><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-sm text-muted-foreground">{s.label}</div></CardContent></Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search integrations..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <span>{categoryIcons[category] || "🔌"}</span>{category}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {items.map(integration => {
              const cfg = statusConfig[integration.status] || statusConfig.disconnected;
              const Icon = cfg.icon;
              return (
                <Card key={integration.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                          {categoryIcons[integration.category] || "🔌"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm">{integration.name}</span>
                            <Badge className={`text-xs ${cfg.color}`}>
                              <Icon className="h-2.5 w-2.5 mr-0.5" />{cfg.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{integration.description}</p>
                          {integration.lastSync && (
                            <p className="text-xs text-muted-foreground mt-1">Last sync: {new Date(integration.lastSync).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button size="sm" variant={integration.status === "connected" ? "outline" : "default"} className="text-xs" onClick={() => toggle(integration)}>
                          {integration.status === "connected" ? "Disconnect" : "Connect"}
                        </Button>
                        {integration.status === "connected" && (
                          <Button size="sm" variant="ghost" className="text-xs" onClick={() => sync(integration)}>
                            <RefreshCw className="h-3 w-3 mr-0.5" />Sync
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
