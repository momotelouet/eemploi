import RecruiterLayout from '@/components/recruiter/RecruiterLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  Eye, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  Star,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Wallet
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecruiterJobs } from "@/hooks/useRecruiterJobs";
import { useJobApplications, type ApplicationWithJobAndProfile } from "@/hooks/useJobApplications";
import CreateJobModal from "@/components/recruiter/CreateJobModal";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CandidateDetailModal from "@/components/recruiter/CandidateDetailModal";
import CompanyManagement from '@/components/recruiter/CompanyManagement';
import AIChat from '@/components/ai/AIChat';
import ApplicationListCard from '@/components/recruiter/ApplicationListCard';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';
import { useRecruiterProfile } from '@/hooks/useRecruiterProfile';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const { jobs } = useRecruiterJobs();
  const { applications } = useJobApplications();
  const { profile: recruiterProfile } = useRecruiterProfile(user?.id ?? null);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJobAndProfile | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');

  // Calculate stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;

  const balance = recruiterProfile?.unpaid_balance ?? 0; // Remplacer par la vraie source si besoin

  const stats = [
    { 
      label: "Offres publiées", 
      value: totalJobs.toString(), 
      icon: <Briefcase className="w-4 h-4" />, 
      change: "+2 ce mois",
      color: "text-blue-600"
    },
    { 
      label: "Offres actives", 
      value: activeJobs.toString(), 
      icon: <TrendingUp className="w-4 h-4" />, 
      change: `${activeJobs}/${totalJobs} actives`,
      color: "text-green-600"
    },
    { 
      label: "Candidatures reçues", 
      value: totalApplications.toString(), 
      icon: <Users className="w-4 h-4" />, 
      change: "+15 cette semaine",
      color: "text-purple-600"
    },
    { 
      label: "En attente", 
      value: pendingApplications.toString(), 
      icon: <Eye className="w-4 h-4" />, 
      change: "À traiter",
      color: "text-yellow-600"
    }
  ];

  const updateApplicationStatus = async (applicationId: string, candidateId: string | undefined, jobTitle: string | undefined, newStatus: 'accepted' | 'rejected') => {
    if (!candidateId || !jobTitle) {
      toast.error('Erreur', {
        description: 'Informations sur le candidat ou l\'offre manquantes.',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      // Create notification for candidate
      const { error: notificationError } = await supabase.from('notifications').insert({
        user_id: candidateId,
        title: 'Statut de votre candidature mis à jour',
        message: `Votre candidature pour le poste "${jobTitle}" a été ${newStatus === 'accepted' ? 'acceptée' : 'refusée'}.`,
        type: 'application_status'
      });

      if (notificationError) {
        console.error('Failed to create notification:', notificationError);
        toast.warning("Mise à jour réussie, mais impossible de notifier le candidat.", {
          description: "Le candidat ne recevra pas de notification pour ce changement."
        });
      }

      toast.success('Statut mis à jour', {
        description: `La candidature a été ${newStatus === 'accepted' ? 'acceptée' : 'refusée'}.`,
      });

      await queryClient.invalidateQueries({ queryKey: ['jobApplications', user?.id] });
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur', {
        description: error.message || 'Impossible de mettre à jour le statut de la candidature.',
      });
    }
  };

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

  const handleViewApplications = () => {
    navigate('/recruteur/candidatures');
  };

  // Suppression d'une offre
  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette offre ?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) {
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Offre supprimée');
      queryClient.invalidateQueries({ queryKey: ['recruiterJobs', user?.id] });
    }
  };

  // Export offres
  const handleExportJobsCSV = () => {
    if (!jobs.length) return;
    const data = jobs.map(job => ({
      Titre: job.title,
      Entreprise: job.companies?.name || '',
      Lieu: job.location,
      Statut: job.status,
      Salaire: job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : '',
      Créée_le: job.created_at
    }));
    exportToCSV(data, 'offres.csv');
  };
  const handleExportJobsPDF = () => {
    if (!jobs.length) return;
    const data = jobs.map(job => ({
      Titre: job.title,
      Entreprise: job.companies?.name || '',
      Lieu: job.location,
      Statut: job.status,
      Salaire: job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : '',
      Créée_le: job.created_at
    }));
    exportToPDF(data, 'offres.pdf');
  };

  // Suppression d'une candidature
  const handleDeleteApplication = async (applicationId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette candidature ?')) return;
    const { error } = await supabase.from('applications').delete().eq('id', applicationId);
    if (error) {
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Candidature supprimée');
      queryClient.invalidateQueries({ queryKey: ['jobApplications', user?.id] });
    }
  };

  // Export candidatures
  const handleExportApplicationsCSV = () => {
    if (!applications.length) return;
    const data = applications.map(app => ({
      Candidat: getCandidateName(app),
      Offre: app.jobs?.title || '',
      Entreprise: app.jobs?.companies?.name || '',
      Statut: app.status,
      Date: app.applied_at
    }));
    exportToCSV(data, 'candidatures.csv');
  };
  const handleExportApplicationsPDF = () => {
    if (!applications.length) return;
    const data = applications.map(app => ({
      Candidat: getCandidateName(app),
      Offre: app.jobs?.title || '',
      Entreprise: app.jobs?.companies?.name || '',
      Statut: app.status,
      Date: app.applied_at
    }));
    exportToPDF(data, 'candidatures.pdf');
  };

  let content = null;
  switch (tab) {
    case 'jobs':
    default:
      content = (
        <>
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Tableau de bord recruteur 👋
              </h1>
              <p className="text-muted-foreground">Gérez vos offres d'emploi et candidatures</p>
            </div>
            <Button 
              className="bg-eemploi-primary hover:bg-eemploi-primary/90"
              onClick={() => setIsCreateJobModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Publier une offre
            </Button>
          </div>
          {/* Solde de la balance */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-6 rounded-2xl shadow-lg border-4 border-white">
              <Wallet className="w-10 h-10 text-yellow-300" />
              <div>
                <div className="text-3xl font-bold">{balance} DH</div>
                <div className="text-lg font-semibold">Solde à payer</div>
              </div>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color}`}>{stat.icon}</div>
                    <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                  </div>
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Jobs List */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Mes offres d'emploi</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportJobsCSV}>
                Exporter CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJobsPDF}>
                Exporter PDF
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Aucune offre publiée</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Commencez par publier votre première offre d'emploi
                </p>
                <Button 
                  className="bg-eemploi-primary hover:bg-eemploi-primary/90"
                  onClick={() => setIsCreateJobModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Publier une offre
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.location}</p>
                        <p className="text-sm text-eemploi-primary font-medium">
                          {job.salary_min && job.salary_max 
                            ? `${job.salary_min} - ${job.salary_max} MAD`
                            : "Salaire à négocier"
                          }
                        </p>
                      </div>
                      <Badge 
                        variant={job.status === 'active' ? 'default' : 'secondary'}
                        className={job.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {job.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Modifier
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteJob(job.id)}>
                        Supprimer
                      </Button>
                      <Button size="sm" variant="outline">
                        Voir les candidatures
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
      break;
    case 'applications':
      content = (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold mb-2">Candidatures reçues</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportApplicationsCSV}>
                Exporter CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportApplicationsPDF}>
                Exporter PDF
              </Button>
            </div>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Aucune candidature reçue</h3>
              <p className="text-sm text-muted-foreground">
                Les candidatures pour vos offres d'emploi apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 10).map((application) => (
                <ApplicationListCard
                  key={application.id}
                  application={application}
                  onViewDetails={() => setSelectedApplication(application)}
                  onDelete={() => handleDeleteApplication(application.id)}
                  onAccept={() => updateApplicationStatus(application.id, application.candidate_id, application.jobs?.title, 'accepted')}
                  onReject={() => updateApplicationStatus(application.id, application.candidate_id, application.jobs?.title, 'rejected')}
                />
              ))}
              {applications.length > 10 && (
                <div className="text-center">
                  <Button 
                    variant="outline"
                    onClick={handleViewApplications}
                  >
                    Voir toutes les candidatures ({applications.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      );
      break;
    case 'company':
      content = <CompanyManagement />;
      break;
    case 'ai':
      content = (
        <AIChat
          title="Assistant Recruteur IA"
          placeholder="Posez vos questions sur le recrutement, l'analyse de candidats, les stratégies RH..."
          type="candidate-analysis"
        />
      );
      break;
  }

  return (
    <RecruiterLayout>
      <div className="container mx-auto px-4 py-8">
        {content}
      </div>
      <CreateJobModal 
        open={isCreateJobModalOpen}
        onOpenChange={setIsCreateJobModalOpen}
      />
      {selectedApplication && (
        <CandidateDetailModal
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          candidateId={selectedApplication.candidate_id}
          applicationId={selectedApplication.id}
          applicationStatus={selectedApplication.status}
          onStatusUpdate={(newStatus) => {
            if(selectedApplication){
              updateApplicationStatus(selectedApplication.id, selectedApplication.candidate_id, selectedApplication.jobs?.title, newStatus);
            }
            setSelectedApplication(null);
          }}
        />
      )}
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
