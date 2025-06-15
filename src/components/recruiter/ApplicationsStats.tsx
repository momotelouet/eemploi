
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  color: string;
}

interface ApplicationsStatsProps {
  stats: Stat[];
}

const ApplicationsStats = ({ stats }: ApplicationsStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((stat, index) => (
      <Card key={index} className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color}`}>
              {stat.icon}
            </div>
            <Badge variant="secondary" className="text-xs">
              {stat.change}
            </Badge>
          </div>
          <div className="text-2xl font-bold mb-2">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default ApplicationsStats;
