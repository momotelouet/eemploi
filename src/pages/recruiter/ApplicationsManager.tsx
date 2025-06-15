
import { useState } from "react";
import { useJobApplications, ApplicationWithJobAndProfile } from "@/hooks/useJobApplications";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CandidateDetailModal from "@/components/recruiter/CandidateDetailModal";
import ApplicationsHeader from "@/components/recruiter/ApplicationsHeader";
import ApplicationsStats, { Stat } from "@/components/recruiter/ApplicationsStats";
import ApplicationsTabs from "@/components/recruiter/ApplicationsTabs";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";

const ApplicationsManager = () => {
  const { applications, loading } = useJobApplications();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJobAndProfile | null>(null);

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  const stats: Stat[] = [
    { 
      label: "Total candidatures", 
      value: applications.length.toString(), 
      icon: <Users className="w-4 h-4" />, 
      change: "+5 cette semaine",
      color: "text-blue-600"
    },
    { 
      label: "En attente", 
      value: pendingApplications.length.toString(), 
      icon: <Clock className="w-4 h-4" />, 
      change: "À traiter",
      color: "text-yellow-600"
    },
    { 
      label: "Acceptées", 
      value: acceptedApplications.length.toString(), 
      icon: <CheckCircle className="w-4 h-4" />, 
      change: "+2 ce mois",
      color: "text-green-600"
    },
    { 
      label: "Refusées", 
      value: rejectedApplications.length.toString(), 
      icon: <XCircle className="w-4 h-4" />, 
      change: "+1 ce mois",
      color: "text-red-600"
    }
  ];

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

      // Recharger la page pour actualiser les données
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut de la candidature',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-eemploi-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Chargement des candidatures...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ApplicationsHeader />
        <ApplicationsStats stats={stats} />
        <ApplicationsTabs
          applications={applications}
          pendingApplications={pendingApplications}
          acceptedApplications={acceptedApplications}
          rejectedApplications={rejectedApplications}
          onViewDetails={setSelectedApplication}
        />
      </div>
      {selectedApplication && (
        <CandidateDetailModal
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          candidateId={selectedApplication.candidate_id}
          applicationId={selectedApplication.id}
          applicationStatus={selectedApplication.status}
          onStatusUpdate={(newStatus) => {
            if(selectedApplication){
              updateApplicationStatus(selectedApplication.id, newStatus);
            }
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
};

export default ApplicationsManager;
