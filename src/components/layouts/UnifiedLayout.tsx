import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  UserCheck,
  Calendar,
  FileText,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  CreditCard,
  BarChart3,
  Plug,
  ScrollText,
  MessageSquare,
  Kanban,
  XCircle,
  Star,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth, AccountRole } from "@/contexts/SimpleAuthContext";
import { NotificationBell } from "@/components/NotificationBell";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  roles: AccountRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard", roles: ["admin", "company", "recruiter", "jobseeker"] },
  { label: "Companies", icon: <Building2 className="h-5 w-5" />, href: "/companies", roles: ["admin"] },
  { label: "Users", icon: <Users className="h-5 w-5" />, href: "/users", roles: ["admin"] },
  { label: "Jobs", icon: <Briefcase className="h-5 w-5" />, href: "/jobs", roles: ["admin", "company", "recruiter"] },
  { label: "Candidates", icon: <UserCheck className="h-5 w-5" />, href: "/candidates", roles: ["admin", "company", "recruiter"] },
  { label: "Interviews", icon: <Calendar className="h-5 w-5" />, href: "/interviews", roles: ["admin", "company", "recruiter", "jobseeker"] },
  { label: "Offers", icon: <FileText className="h-5 w-5" />, href: "/offers", roles: ["admin", "company", "recruiter"] },
  { label: "Applications", icon: <FileText className="h-5 w-5" />, href: "/applications", roles: ["jobseeker", "company"] },
  { label: "Pipeline", icon: <Kanban className="h-5 w-5" />, href: "/pipeline", roles: ["recruiter"] },
  { label: "Talent Pool", icon: <Star className="h-5 w-5" />, href: "/talent-pool", roles: ["recruiter"] },
  { label: "My Jobs", icon: <Briefcase className="h-5 w-5" />, href: "/my-jobs", roles: ["jobseeker"] },
  { label: "Saved Jobs", icon: <Bookmark className="h-5 w-5" />, href: "/saved-jobs", roles: ["jobseeker"] },
  { label: "Profile", icon: <Users className="h-5 w-5" />, href: "/profile", roles: ["jobseeker"] },
  { label: "Team", icon: <Users className="h-5 w-5" />, href: "/team", roles: ["company"] },
  { label: "Messages", icon: <MessageSquare className="h-5 w-5" />, href: "/messages", roles: ["admin", "company", "recruiter", "jobseeker"] },
  { label: "Reports", icon: <BarChart3 className="h-5 w-5" />, href: "/reports", roles: ["admin", "company", "recruiter"] },
  { label: "Billing", icon: <CreditCard className="h-5 w-5" />, href: "/billing", roles: ["admin", "company"] },
  { label: "Integrations", icon: <Plug className="h-5 w-5" />, href: "/integrations", roles: ["admin"] },
  { label: "Audit Logs", icon: <ScrollText className="h-5 w-5" />, href: "/audit-logs", roles: ["admin"] },
  { label: "Security", icon: <Shield className="h-5 w-5" />, href: "/security", roles: ["admin"] },
  { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/settings", roles: ["admin", "company", "recruiter", "jobseeker"] },
  { label: "Certificates", icon: <Award className="h-5 w-5" />, href: "/jobseeker/certificates", roles: ["jobseeker"] },
];

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

export function UnifiedLayout({ children }: UnifiedLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, loginWithDemo } = useAuth();
  const location = useLocation();

  const currentRole = user?.role || "jobseeker";
  const roleColor = user?.role === "admin" ? "bg-red-500" : user?.role === "company" ? "bg-blue-500" : user?.role === "recruiter" ? "bg-green-500" : "bg-purple-500";
  const roleLabel = user?.role === "admin" ? "Admin" : user?.role === "company" ? "Company" : user?.role === "recruiter" ? "Recruiter" : "Job Seeker";

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole as AccountRole));

  const roleSwitcher = (
    <div className="p-4 border-b border-border">
      <div className="text-xs font-medium text-muted-foreground mb-2">Switch Role (Demo)</div>
      <div className="grid grid-cols-2 gap-2">
        {(["admin", "company", "recruiter", "jobseeker"] as AccountRole[]).map((role) => (
          <Button
            key={role}
            variant={currentRole === role ? "default" : "outline"}
            size="sm"
            onClick={() => loginWithDemo(role)}
            className="text-xs capitalize justify-start"
          >
            {role === "admin" && <Shield className="h-3 w-3 mr-1" />}
            {role === "company" && <Building2 className="h-3 w-3 mr-1" />}
            {role === "recruiter" && <Users className="h-3 w-3 mr-1" />}
            {role === "jobseeker" && <Users className="h-3 w-3 mr-1" />}
            {role}
          </Button>
        ))}
      </div>
    </div>
  );

  const getInitials = (role: string) => {
    switch (role) {
      case "admin": return "SA";
      case "company": return "CA";
      case "recruiter": return "RC";
      case "jobseeker": return "JS";
      default: return "U";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/interq-logo.svg" alt="InterQ" className="h-10 w-auto" />
            </Link>
            <Badge variant="outline" className={`${roleColor} text-white border-0 hidden md:flex`}>
              {roleLabel}
            </Badge>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 bg-muted/50" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(currentRole)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium capitalize">{currentRole} User</p>
                    <p className="text-xs text-muted-foreground">{currentRole}@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Users className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`hidden md:flex flex-col border-r border-border bg-background ${collapsed ? "w-16" : "w-64"} transition-all duration-300 fixed left-0 top-16 bottom-0 z-40`}>
          {roleSwitcher}
          
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>}
                        </>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              );
            })}
          </nav>

          <div className="p-2 border-t border-border">
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="w-full">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-background border-r border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl">RecruitHub</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              
              {roleSwitcher}
              
              <nav className="space-y-1">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      location.pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <main className="flex-1 min-h-[calc(100vh-4rem)] md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}

export default UnifiedLayout;
