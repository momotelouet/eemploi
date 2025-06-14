
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import CandidateDetailModal from "./CandidateDetailModal";

interface ApplicationsTableProps {
  applications: any[];
  onStatusUpdate?: () => void;
}

const ApplicationsTable = ({ applications, onStatusUpdate }: ApplicationsTableProps) => {
  const { toast } = useToast();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCandidateName = (application: any) => {
    if (application.candidate_profiles?.profiles) {
      const profile = application.candidate_profiles.profiles;
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Candidat anonyme';
    }
    return `Candidat #${application.candidate_id.slice(0, 8)}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Acceptée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Refusée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: 'Statut mis à jour',
        description: `La candidature a été ${newStatus === 'accepted' ? 'acceptée' : 'refusée'}`,
      });

      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut de la candidature',
        variant: 'destructive'
      });
    }
  };

  const handleViewCandidate = (application: any) => {
    setSelectedCandidateId(application.candidate_id);
    setSelectedApplicationId(application.id);
    setIsModalOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidat</TableHead>
            <TableHead>Offre</TableHead>
            <TableHead>Date de candidature</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">
                {getCandidateName(application)}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{application.jobs?.title || 'Offre supprimée'}</p>
                  <p className="text-sm text-muted-foreground">
                    {application.jobs?.companies?.name || 'Entreprise non spécifiée'}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {new Date(application.applied_at).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                {getStatusBadge(application.status)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewCandidate(application)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                  {application.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => updateApplicationStatus(application.id, 'accepted')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accepter
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Refuser
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CandidateDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidateId={selectedCandidateId || ''}
        applicationId={selectedApplicationId || ''}
      />
    </>
  );
};

export default ApplicationsTable;
