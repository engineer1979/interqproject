import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, Clock, User, Briefcase, Calendar } from "lucide-react";
import { mockNotifications } from "@/data/adminModuleData";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2 } from "lucide-react";

export default function CompanyNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('companyNotifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(mockNotifications);
      localStorage.setItem('companyNotifications', JSON.stringify(mockNotifications));
    }
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('companyNotifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('companyNotifications', JSON.stringify(updated));
    toast({ title: "All Marked as Read" });
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('companyNotifications', JSON.stringify(updated));
    toast({ title: "Notification Removed" });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem('companyNotifications', JSON.stringify([]));
    toast({ title: "Inbox Cleared" });
  };

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
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={notifications.every(n => n.read)}>
            <CheckCircle2 className="h-4 w-4 mr-2" /> Mark All as Read
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-2" /> Clear All
          </Button>
          <Badge variant="outline" className="px-3 py-1 bg-white">
            {notifications.filter(n => !n.read).length} Unread
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`hover:bg-muted/50 transition-all cursor-pointer group ${!notification.read ? 'border-l-4 border-l-primary shadow-sm' : 'opacity-80'}`}
            onClick={() => markAsRead(notification.id)}
          >
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${!notification.read ? 'bg-primary/10' : 'bg-muted'}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notification.title}
                    </p>
                    {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600"
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className={`text-sm ${!notification.read ? 'text-slate-700' : 'text-slate-500'}`}>
                  {notification.message}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
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
