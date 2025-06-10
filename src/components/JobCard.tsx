
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

type JobWithCompany = Tables<'jobs'> & {
  companies?: Tables<'companies'> | null;
};

interface JobCardProps {
  job: JobWithCompany;
}

const JobCard = ({ job }: JobCardProps) => {
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Salaire à négocier";
    if (min && max) return `${min} - ${max} MAD`;
    if (min) return `À partir de ${min} MAD`;
    if (max) return `Jusqu'à ${max} MAD`;
    return "Salaire à négocier";
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return 'Temps plein';
      case 'part-time': return 'Temps partiel';
      case 'contract': return 'Contrat';
      case 'internship': return 'Stage';
      default: return type;
    }
  };

  // Safe access to company data
  const companyName = job.companies?.name || 'Entreprise non spécifiée';
  const companyLogo = job.companies?.logo_url;

  return (
    <Card className="hover-lift border-l-4 border-l-eemploi-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-lg flex items-center justify-center text-white font-bold">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt={companyName} 
                  className="w-full h-full object-cover rounded-lg" 
                />
              ) : (
                companyName[0] || 'E'
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{job.title}</h3>
              <p className="text-muted-foreground">{companyName}</p>
            </div>
          </div>
          <Badge variant="secondary">{getJobTypeLabel(job.job_type || 'full-time')}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location || 'Non spécifié'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: fr })}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/emplois/${job.id}`}>Voir plus</Link>
          </Button>
          <Button size="sm" className="bg-eemploi-primary hover:bg-eemploi-primary/90">
            Postuler
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
