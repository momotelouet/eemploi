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

// Support both the database job structure and the mock data structure
interface JobCardProps {
  job?: JobWithCompany; // For database jobs
  // For mock data (backwards compatibility)
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  salary?: string;
  description?: string;
  postedAt?: string;
}

const JobCard = ({ job, id, title, company, location, type, salary, description, postedAt }: JobCardProps) => {
  // Handle both database job and mock data
  const jobData = job ? {
    id: job.id,
    title: job.title,
    company: job.companies?.name || 'Entreprise non spécifiée',
    location: job.location || 'Non spécifié',
    type: job.job_type || 'full-time',
    salary: formatSalary(job.salary_min, job.salary_max),
    description: job.description,
    postedAt: formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: fr }),
    companyLogo: job.companies?.logo_url
  } : {
    id: id || '',
    title: title || '',
    company: company || '',
    location: location || '',
    type: type || '',
    salary: salary || '',
    description: description || '',
    postedAt: postedAt || '',
    companyLogo: null
  };

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
      case 'CDI': return 'CDI';
      default: return type;
    }
  };

  return (
    <Card className="hover-lift border-l-4 border-l-eemploi-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-lg flex items-center justify-center text-white font-bold">
              {jobData.companyLogo ? (
                <img 
                  src={jobData.companyLogo} 
                  alt={jobData.company} 
                  className="w-full h-full object-cover rounded-lg" 
                />
              ) : (
                jobData.company[0] || 'E'
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{jobData.title}</h3>
              <p className="text-muted-foreground">{jobData.company}</p>
            </div>
          </div>
          <Badge variant="secondary">{getJobTypeLabel(jobData.type)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{jobData.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{jobData.salary}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{jobData.postedAt}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{jobData.description}</p>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/emplois/${jobData.id}`}>Voir plus</Link>
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
