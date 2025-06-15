
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Wallet } from "lucide-react";
import type { JobWithCompany } from "@/hooks/useRecruiterJobs";
import { useRecruiterProfile } from "@/hooks/useRecruiterProfile";
import { useAuth } from "@/contexts/AuthContext";

interface JobsTabContentProps {
  jobs: (JobWithCompany & { price?: number; paid?: boolean })[];
  onPublishOfferClick: () => void;
}

const UNPAID_THRESHOLD = 500;

const JobsTabContent = ({ jobs, onPublishOfferClick }: JobsTabContentProps) => {
  const { user } = useAuth();
  const { profile } = useRecruiterProfile(user?.id ?? null);

  const isPublicationBlocked = profile?.status === 'suspended' || (profile?.unpaid_balance ?? 0) >= UNPAID_THRESHOLD;
  const unpaidBalance = profile?.unpaid_balance ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="font-semibold text-lg">Mes offres d'emploi</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-1.5">
            <Wallet className="w-5 h-5" />
            <span>Solde impayé : {unpaidBalance} DH</span>
          </div>
          <Button 
            className="bg-eemploi-primary hover:bg-eemploi-primary/90"
            onClick={onPublishOfferClick}
            disabled={isPublicationBlocked}
            title={isPublicationBlocked ? `Publication bloquée (solde > ${UNPAID_THRESHOLD} DH)` : "Publier une nouvelle offre"}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle offre
          </Button>
        </div>
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
            disabled={isPublicationBlocked}
            title={isPublicationBlocked ? `Publication bloquée (solde > ${UNPAID_THRESHOLD} DH)` : "Publier une nouvelle offre"}
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
                    <div className="flex items-center gap-4 mb-2">
                       <h4 className="font-semibold text-lg">{job.title}</h4>
                       {job.paid ? (
                         <Badge className="bg-green-100 text-green-800">Payée</Badge>
                       ) : (
                         <Badge className="bg-yellow-100 text-yellow-800">À payer</Badge>
                       )}
                    </div>
                    <p className="text-muted-foreground mb-2">{job.location}</p>
                    <p className="text-sm text-eemploi-primary font-medium">
                      {job.price} DH
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
