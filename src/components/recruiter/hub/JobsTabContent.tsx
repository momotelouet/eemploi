
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase } from "lucide-react";
import type { JobWithCompany } from "@/hooks/useRecruiterJobs";

interface JobsTabContentProps {
  jobs: JobWithCompany[];
  onPublishOfferClick: () => void;
}

const JobsTabContent = ({ jobs, onPublishOfferClick }: JobsTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Mes offres d'emploi</h3>
        <Button 
          className="bg-eemploi-primary hover:bg-eemploi-primary/90"
          onClick={onPublishOfferClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle offre
        </Button>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune offre publiée</h3>
          <p className="text-muted-foreground mb-6">
            Commencez par publier votre première offre d'emploi pour attirer les meilleurs talents.
          </p>
          <Button 
            className="bg-eemploi-primary hover:bg-eemploi-primary/90"
            onClick={onPublishOfferClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Publier ma première offre
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{job.title}</h4>
                    <p className="text-muted-foreground mb-2">{job.location}</p>
                    <p className="text-sm text-eemploi-primary font-medium">
                      {job.salary_min && job.salary_max 
                        ? `${job.salary_min} - ${job.salary_max} MAD`
                        : "Salaire à négocier"
                      }
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm">
                      Candidatures
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsTabContent;
