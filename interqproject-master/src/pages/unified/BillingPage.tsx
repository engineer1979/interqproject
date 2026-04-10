import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Check, Download, AlertCircle } from "lucide-react";

const PLANS = [
  { id: "basic", name: "Basic", price: 99, features: ["5 Job Postings", "100 Candidates", "Email Support", "Basic Analytics"], current: false },
  { id: "pro", name: "Professional", price: 299, features: ["25 Job Postings", "1,000 Candidates", "Priority Support", "Advanced Analytics", "API Access"], current: true },
  { id: "enterprise", name: "Enterprise", price: 799, features: ["Unlimited Jobs", "Unlimited Candidates", "24/7 Support", "Custom Analytics", "SSO", "Dedicated Manager"], current: false },
];

const INVOICES = [
  { id: "INV-001", date: "Mar 1, 2026", amount: "$299.00", status: "Paid" },
  { id: "INV-002", date: "Feb 1, 2026", amount: "$299.00", status: "Paid" },
  { id: "INV-003", date: "Jan 1, 2026", amount: "$299.00", status: "Paid" },
];

export default function BillingPage() {
  const { toast } = useToast();
  const handleUpgrade = (plan: any) => {
    toast({ title: "Plan Changed", description: `Switched to ${plan.name} plan. Changes take effect next billing cycle.` });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map(plan => (
          <Card key={plan.id} className={plan.current ? "border-blue-500 border-2" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.current && <Badge className="bg-blue-100 text-blue-700">Current</Badge>}
              </div>
              <div className="text-3xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-3 w-3 text-green-500" />{f}</li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.current ? "outline" : "default"} onClick={() => !plan.current && handleUpgrade(plan)}>
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" />Payment Method</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
              <div><div className="font-medium text-sm">Visa ending in 4242</div><div className="text-xs text-muted-foreground">Expires 12/27</div></div>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast({ title: "Update Payment", description: "Payment update form would open here." })}>Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Invoice History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {INVOICES.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div><div className="font-medium text-sm">{inv.id}</div><div className="text-xs text-muted-foreground">{inv.date}</div></div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">{inv.amount}</span>
                  <Badge className="bg-green-100 text-green-700 text-xs">{inv.status}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => toast({ title: "Downloaded", description: `${inv.id} downloaded.` })}><Download className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
