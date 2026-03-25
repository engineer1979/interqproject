import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mockCandidates } from "@/data/adminModuleData";
import { Star, Search, Mail, Phone, UserPlus, Filter } from "lucide-react";

export default function TalentPoolPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const pool = mockCandidates.filter(c => (c.rating || 0) >= 4);
  const filtered = pool.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.appliedRole?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talent Pool</h1>
          <p className="text-muted-foreground">High-rated candidates ready for opportunities</p>
        </div>
        <Button onClick={() => toast({ title: "Add to Pool", description: "Import candidates form would open." })}>
          <UserPlus className="h-4 w-4 mr-2" />Add to Pool
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total in Pool", value: pool.length, color: "text-blue-600" },
          { label: "Avg Rating", value: (pool.reduce((s, c) => s + (c.rating || 0), 0) / pool.length).toFixed(1) + "★", color: "text-yellow-600" },
          { label: "Available Now", value: pool.filter(c => c.status === "active").length, color: "text-green-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4"><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-sm text-muted-foreground">{s.label}</div></CardContent></Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search talent pool..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(candidate => (
          <Card key={candidate.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {candidate.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold">{candidate.fullName}</span>
                    {candidate.rating && (
                      <span className="flex items-center gap-0.5 text-yellow-500 text-sm font-medium">
                        <Star className="h-3 w-3 fill-current" />{candidate.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.appliedRole}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(candidate.tags || []).map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1" onClick={() => toast({ title: "Invite Sent", description: `Job opportunity sent to ${candidate.fullName}.` })}>
                      Invite to Job
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Email Sent", description: `Email sent to ${candidate.email}.` })}>
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2"><Card><CardContent className="p-12 text-center text-muted-foreground">No candidates found in talent pool.</CardContent></Card></div>
        )}
      </div>
    </div>
  );
}
