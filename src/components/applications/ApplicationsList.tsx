
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, Download } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useNavigate } from 'react-router-dom';

const ApplicationsList = () => {
  const { applications, loading } = useApplications();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des candidatures...</div>
        </CardContent>
      </Card>
    );
  }

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

  const handleViewJob = (jobId: string) => {
    navigate(`/emplois/${jobId}`);
  };

  const handleDownloadCV = (cvUrl: string) => {
    window.open(cvUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes candidatures</CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune candidature envoyée pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {application.jobs?.title || 'Poste non spécifié'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {application.jobs?.companies?.name || 'Entreprise non spécifiée'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Candidature envoyée {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  <Badge 
                    className={`${getStatusColor(application.status || 'pending')} text-white`}
                  >
                    {getStatusText(application.status || 'pending')}
                  </Badge>
                </div>
                
                {application.jobs?.location && (
                  <p className="text-sm text-muted-foreground mb-3">
                    📍 {application.jobs.location}
                  </p>
                )}

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewJob(application.job_id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir l'offre
                  </Button>
                  {application.cv_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadCV(application.cv_url)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger CV
                    </Button>
                  )}
                </div>

                {application.cover_letter && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                    <strong>Lettre de motivation:</strong>
                    <p className="mt-1">{application.cover_letter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationsList;
