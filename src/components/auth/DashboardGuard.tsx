import { ReactNode, useEffect } from "react";
import { useAuth, AccountRole } from "@/contexts/SimpleAuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DashboardGuardProps {
  children: ReactNode;
  allowedRole: AccountRole;
}

export const DashboardGuard = ({ children, allowedRole }: DashboardGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate("/auth", { state: { from: location } });
      return;
    }

    if (user && user.role !== allowedRole) {
      toast({
        title: "Access Denied",
        description: `You do not have permission to access the ${allowedRole} dashboard.`,
        variant: "destructive",
      });
      
      // Redirect to their own dashboard
      switch (user.role) {
        case "admin": navigate("/admin"); break;
        case "company": navigate("/company"); break;
        case "recruiter": navigate("/recruiter"); break;
        case "jobseeker": navigate("/jobseeker"); break;
        default: navigate("/");
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRole, navigate, location, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
};
