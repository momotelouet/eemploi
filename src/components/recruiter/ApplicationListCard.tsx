import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Mail, XCircle, CheckCircle, Trash2 } from "lucide-react";
import { getCandidateName } from "@/lib/recruiterUtils";
import { StatusBadge } from "./StatusBadge";
import type { ApplicationWithJobAndProfile } from "@/hooks/useJobApplications";

interface ApplicationListCardProps {
  application: ApplicationWithJobAndProfile;
  onViewDetails: (application: ApplicationWithJobAndProfile) => void;
  onDelete?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const ApplicationListCard = ({ application, onViewDetails, onDelete, onAccept, onReject }: ApplicationListCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold">{getCandidateName(application)}</h4>
            <StatusBadge status={application.status} />
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            <strong>Offre :</strong> {application.jobs?.title || 'Offre supprimée'}
          </p>
          <p className="text-sm text-muted-foreground mb-1">
            <strong>Entreprise :</strong> {application.jobs?.companies?.name || 'Non spécifiée'}
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Candidature :</strong> {new Date(application.applied_at).toLocaleDateString('fr-FR')}
          </p>
          {application.cover_letter && (
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-2">
              <strong>Lettre de motivation :</strong><br />
              {application.cover_letter.substring(0, 150)}...
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2 ml-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(application)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir détails
          </Button>
          <Button variant="outline" size="sm" onClick={onAccept} disabled={application.status === 'accepted' || application.status === 'rejected'}>
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Accepter
          </Button>
          <Button variant="outline" size="sm" onClick={onReject} disabled={application.status === 'rejected' || application.status === 'accepted'}>
            <XCircle className="w-4 h-4 mr-2 text-red-600" />
            Refuser
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ApplicationListCard;
