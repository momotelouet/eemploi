
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Mail } from "lucide-react";
import { getCandidateName } from "@/lib/recruiterUtils";
import type { ApplicationWithJobAndProfile } from "@/hooks/useJobApplications";

interface CompactApplicationListCardProps {
  application: ApplicationWithJobAndProfile;
  onViewDetails: (application: ApplicationWithJobAndProfile) => void;
  type: 'pending' | 'accepted' | 'rejected';
}

const CompactApplicationListCard = ({ application, onViewDetails, type }: CompactApplicationListCardProps) => {
  const borderClass = {
    pending: "border-yellow-200",
    accepted: "border-green-200",
    rejected: "border-red-200",
  }[type];

  return (
    <Card className={borderClass}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{getCandidateName(application)}</h4>
            <p className="text-sm text-muted-foreground">
              {application.jobs?.title || 'Offre supprimée'}
            </p>
            <p className="text-xs text-muted-foreground">
              {type === 'pending' && `Le ${new Date(application.applied_at).toLocaleDateString('fr-FR')}`}
              {type === 'accepted' && `Acceptée le ${new Date(application.updated_at).toLocaleDateString('fr-FR')}`}
              {type === 'rejected' && `Refusée le ${new Date(application.updated_at).toLocaleDateString('fr-FR')}`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(application)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir détails
            </Button>
            {type === 'accepted' && (
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Contacter
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactApplicationListCard;
