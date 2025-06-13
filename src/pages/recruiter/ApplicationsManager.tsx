
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useJobApplications } from '@/hooks/useJobApplications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, Download, Mail, Phone, MapPin, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CandidateProfileModal from '@/components/recruiter/CandidateProfileModal';

const ApplicationsManager = () => {
  const { applications, loading } = useJobApplications();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<{id: string, email?: string} | null>(null);

  const filteredApplications = applications.filter(app => {
    const statusMatch = statusFilter === 'all' || app.status === statusFilter;
    const jobMatch = selectedJobFilter === 'all' || app.job_id === selectedJobFilter;
    return statusMatch && jobMatch;
  });

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast.success('Statut de la candidature mis à jour');
      // The hook should automatically refresh the data
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'reviewed': return 'bg-blue-500';
      case 'interview': return 'bg-purple-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'reviewed': return 'Examinée';
      case 'interview': return 'Entretien';
      case 'accepted': return 'Acceptée';
      case 'rejected': return 'Rejetée';
      default: return status;
    }
  };

  const handleViewProfile = async (candidateId: string) => {
    try {
      // Get candidate email from auth.users via profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', candidateId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      }

      // For now, we'll open the modal with the candidate ID
      // The email will be fetched inside the modal if needed
      setSelectedCandidate({ id: candidateId });
    } catch (error) {
      console.error('Error fetching candidate info:', error);
      toast.error('Erreur lors du chargement du profil');
    }
  };

  const handleDownloadCV = async (cvUrl: string, fileName?: string) => {
    if (!cvUrl) {
      toast.error('Aucun CV disponible');
      return;
    }

    try {
      const response = await fetch(cvUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'CV_candidat.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('CV téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Erreur lors du téléchargement du CV');
    }
  };

  const handleContactCandidate = async (candidateId: string) => {
    try {
      // Get candidate email from profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', candidateId)
        .single();

      if (error || !profile) {
        toast.error('Impossible de récupérer les informations de contact');
        return;
      }

      // For now, we'll assume we can get the email from somewhere
      // In a real implementation, you might need to store this differently
      const email = `${profile.first_name?.toLowerCase()}.${profile.last_name?.toLowerCase()}@example.com`;
      window.open(`mailto:${email}`, '_blank');
    } catch (error) {
      console.error('Error contacting candidate:', error);
      toast.error('Erreur lors de l\'ouverture du client email');
    }
  };

  const uniqueJobs = [...new Set(applications.map(app => app.jobs?.title).filter(Boolean))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement des candidatures...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des candidatures</h1>
          <p className="text-muted-foreground">
            {applications.length} candidature{applications.length > 1 ? 's' : ''} reçue{applications.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="reviewed">Examinée</SelectItem>
                  <SelectItem value="interview">Entretien</SelectItem>
                  <SelectItem value="accepted">Acceptée</SelectItem>
                  <SelectItem value="rejected">Rejetée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Offre d'emploi</label>
              <Select value={selectedJobFilter} onValueChange={setSelectedJobFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les offres</SelectItem>
                  {uniqueJobs.map((job, index) => (
                    <SelectItem key={index} value={applications.find(app => app.jobs?.title === job)?.job_id || ''}>
                      {job}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des candidatures */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {applications.length === 0 
                  ? "Aucune candidature reçue pour le moment." 
                  : "Aucune candidature ne correspond aux filtres sélectionnés."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {application.jobs?.title || 'Poste non spécifié'}
                      </h3>
                      <Badge 
                        className={`${getStatusColor(application.status || 'pending')} text-white`}
                      >
                        {getStatusText(application.status || 'pending')}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <span>Candidature reçue {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true, locale: fr })}</span>
                      {application.jobs?.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{application.jobs.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Select 
                      value={application.status || 'pending'} 
                      onValueChange={(value) => updateApplicationStatus(application.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="reviewed">Examinée</SelectItem>
                        <SelectItem value="interview">Entretien</SelectItem>
                        <SelectItem value="accepted">Acceptée</SelectItem>
                        <SelectItem value="rejected">Rejetée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {application.cover_letter && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Lettre de motivation:</h4>
                    <p className="text-sm">{application.cover_letter}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(application.candidate_id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir le profil
                  </Button>
                  {application.cv_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadCV(application.cv_url!, 'CV_candidat.pdf')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger CV
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleContactCandidate(application.candidate_id)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal du profil candidat */}
      <CandidateProfileModal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        candidateId={selectedCandidate?.id || ''}
        candidateEmail={selectedCandidate?.email}
      />
    </div>
  );
};

export default ApplicationsManager;
