
import { Card, CardContent } from "@/components/ui/card";

type CompanyStatsProps = {
  stats: {
    openJobs: number;
    avgSalary: string;
    responseTime: string;
    hiringRate: string;
  };
};

const CompanyStats = ({ stats }: CompanyStatsProps) => {
  return (
    <section className="py-8 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-eemploi-primary mb-1">
                {stats.openJobs}
              </div>
              <div className="text-sm text-muted-foreground">Postes ouverts</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-eemploi-primary mb-1">
                {stats.avgSalary}
              </div>
              <div className="text-sm text-muted-foreground">Salaire moyen</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-eemploi-primary mb-1">
                {stats.responseTime}
              </div>
              <div className="text-sm text-muted-foreground">Temps de réponse</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-eemploi-primary mb-1">
                {stats.hiringRate}
              </div>
              <div className="text-sm text-muted-foreground">Taux d'embauche</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CompanyStats;
