import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  Briefcase,
  Star,
  Settings,
  Trash2,
  Check,
  Filter,
} from "lucide-react";
import { mockNotifications } from "@/data/adminModuleData";

export default function JobSeekerNotifications() {
  const [filter, setFilter] = useState<string>("all");
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('jobseekerNotifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(mockNotifications.map(n => ({ ...n, createdAt: n.timestamp })));
      localStorage.setItem('jobseekerNotifications', JSON.stringify(mockNotifications));
    }
  }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('jobseekerNotifications', JSON.stringify(updated));
    toast({ title: "All caught up!", description: "All notifications marked as read." });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem('jobseekerNotifications', JSON.stringify([]));
    toast({ title: "Inbox cleared", description: "All notifications removed." });
  };

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('jobseekerNotifications', JSON.stringify(updated));
  };

  const deleteNotif = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('jobseekerNotifications', JSON.stringify(updated));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notificationIcons: Record<string, React.ReactNode> = {
    interview: <Calendar className="w-5 h-5 text-blue-600" />,
    application: <Briefcase className="w-5 h-5 text-indigo-600" />,
    assessment: <FileText className="w-5 h-5 text-purple-600" />,
    offer: <Star className="w-5 h-5 text-amber-600" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Stay updated with your applications</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Unread
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition cursor-pointer group hover:shadow-md ${
              !notification.read ? "bg-blue-50/50 border-blue-200" : ""
            }`}
            onClick={() => markRead(notification.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    !notification.read ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {notificationIcons[notification.type] || <Bell className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <Badge variant="default" className="ml-2">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.timestamp).toLocaleDateString()} at{" "}
                    {new Date(notification.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                    onClick={(e) => { e.stopPropagation(); deleteNotif(notification.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">
            {filter === "unread"
              ? "You've read all your notifications"
              : "You're all caught up!"}
          </p>
        </div>
      )}
    </div>
  );
}
