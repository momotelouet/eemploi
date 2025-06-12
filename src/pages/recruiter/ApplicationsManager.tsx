
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useJobApplications } from '@/hooks/useJobApplications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, Download, Mail, Phone, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ApplicationsManager = () => {
  const { applications, loading } = useJobApplications();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');

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
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir le profil
                  </Button>
                  {application.cv_url && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger CV
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsManager;
