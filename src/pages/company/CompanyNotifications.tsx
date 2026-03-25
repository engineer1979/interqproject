import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, Clock, User, Briefcase, Calendar } from "lucide-react";
import { mockNotifications } from "@/data/adminModuleData";
import { Badge } from "@/components/ui/badge";

export default function CompanyNotifications() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'application': return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'interview': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'offer': return <Check className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">Manage automated and manual candidate notifications</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {mockNotifications.filter(n => !n.read).length} Unread
        </Badge>
      </div>

      <div className="grid gap-4">
        {mockNotifications.map((notification) => (
          <Card key={notification.id} className={`hover:bg-muted/50 transition-colors ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notification.title}
                  </p>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockNotifications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Notification Center</h3>
            <p className="text-muted-foreground">Configure automated triggers and send manual messages to candidates.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
