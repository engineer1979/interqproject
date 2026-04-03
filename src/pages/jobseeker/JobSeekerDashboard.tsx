import { motion } from "framer-motion";
import { useJobSeekerDashboard } from "@/contexts/JobSeekerDashboardContext";
import IntegratedHub from "./IntegratedHub";

const JobSeekerDashboard = () => {
  const { isLoading } = useJobSeekerDashboard();

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </motion.div>
    );
  }

  return <IntegratedHub />;
};

export default JobSeekerDashboard;
