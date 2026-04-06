import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, XCircle, CheckCircle } from 'lucide-react';
import { DashboardStats } from '@/hooks/useEvaluationReports';

interface StatusCardProps {
  title: string;
  count: number;
  color: 'green' | 'yellow' | 'red' | 'gray';
  icon: React.ReactNode;
  change?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count, color, icon, change }) => {
  const bgColor = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  }[color];

  const iconBg = {
    green: 'bg-green-500/10',
    yellow: 'bg-yellow-500/10',
    red: 'bg-red-500/10',
    gray: 'bg-gray-500/10'
  }[color];

  return (
    <Card className="hover:shadow-lg transition-all border-0 shadow-sm group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <p className={`text-3xl font-bold mt-1 text-foreground group-hover:text-primary/90`}>
              {count.toLocaleString()}
            </p>
            {change && (
              <Badge className={`mt-2 text-xs ${bgColor}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {change}
              </Badge>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default StatusCard;

