
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Building } from "lucide-react";

interface QuickStatsProps {
  jobCount: number;
  applicationCount: number;
  companyProfileCount: number;
}

const QuickStats = ({ jobCount, applicationCount, companyProfileCount }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{jobCount}</p>
              <p className="text-sm text-muted-foreground">Offres publiées</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{applicationCount}</p>
              <p className="text-sm text-muted-foreground">Candidatures reçues</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{companyProfileCount}</p>
              <p className="text-sm text-muted-foreground">Profil entreprise</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
