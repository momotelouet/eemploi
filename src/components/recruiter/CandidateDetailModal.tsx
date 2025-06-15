import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  CheckCircle, 
  XCircle,
  Calendar,
  Info,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { useCandidateDetails } from '@/hooks/useCandidateDetails';

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  applicationId: string;
  applicationStatus?: string;
  onStatusUpdate?: (newStatus: 'accepted' | 'rejected') => void;
}

const getStatusBadge = (status: string | undefined | null) => {
  if (!status) return <Badge variant="secondary">Inconnu</Badge>;
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

const CandidateDetailModal = ({ isOpen, onClose, candidateId, applicationId, applicationStatus, onStatusUpdate }: CandidateDetailModalProps) => {
  const { profile, userProfile, assessments, application, loading } = useCandidateDetails(candidateId, applicationId, isOpen);

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Document téléchargé avec succès');
    } catch (error) {
      console.error(`Error downloading ${fileName}:`, error);
      toast.error('Erreur lors du téléchargement du document');
    }
  };

  const handleOpenUrl = (url: string) => window.open(url, '_blank');

  if (loading && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-eemploi-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const fullName = userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : 'Candidat';

  const hasApplicationDocuments = application?.cv_url || application?.cover_letter || application?.certificate_url;
  const hasProfileDocuments = profile?.cv_file_url || assessments?.some(a => a.certificate_url);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Candidature de {fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto pr-6 flex-1">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Info className="w-5 h-5 mr-2" />
                  Récapitulatif de la candidature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p>
                    <span className="font-medium">Date de candidature : </span>
                    <span className="text-muted-foreground">
                      {application?.applied_at ? new Date(application.applied_at).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                   <p className="font-medium">Statut :</p>
                   {getStatusBadge(application?.status)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg"><FileText className="w-5 h-5 mr-2" />Documents</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {hasApplicationDocuments && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-muted-foreground">Documents de la candidature</h4>
                      {application?.cv_url && (
                        <div className="flex items-center justify-between p-3 rounded-md border">
                            <span className="font-medium">CV soumis</span>
                            <Button variant="outline" size="sm" onClick={() => handleOpenUrl(application.cv_url!)}><Download className="w-4 h-4 mr-2" /> Voir</Button>
                        </div>
                      )}
                      {application?.cover_letter && (
                        <div className="p-3 rounded-md border">
                          <p className="font-medium mb-2">Lettre de motivation</p>
                          <div className="bg-muted/50 p-3 rounded-md text-sm whitespace-pre-wrap border">{application.cover_letter}</div>
                        </div>
                      )}
                       {application?.certificate_url && (
                        <div className="flex items-center justify-between p-3 rounded-md border">
                            <span className="font-medium">Certificat soumis</span>
                            <Button variant="outline" size="sm" onClick={() => handleOpenUrl(application.certificate_url!)}><Download className="w-4 h-4 mr-2" /> Voir</Button>
                        </div>
                      )}
                    </div>
                  )}

                  {hasApplicationDocuments && hasProfileDocuments && <Separator />}

                  {hasProfileDocuments && (
                     <div className="space-y-3">
                      <h4 className="font-medium text-muted-foreground">Documents du profil</h4>
                      {profile?.cv_file_url && (
                        <div className="flex items-center justify-between p-3 rounded-md border">
                            <span className="font-medium">{profile.cv_file_name || "CV du profil"}</span>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadFile(profile.cv_file_url!, profile.cv_file_name || 'cv_candidat.pdf')}><Download className="w-4 h-4 mr-2" /> Télécharger</Button>
                        </div>
                      )}
                      {assessments?.filter(a => a.certificate_url).map((assessment, index) => (
                          <div key={assessment.id} className="flex items-center justify-between p-3 rounded-md border">
                              <span className="font-medium">Certificat d'évaluation #{index + 1}</span>
                              <Button variant="outline" size="sm" onClick={() => handleDownloadFile(assessment.certificate_url!, `certificat_evaluation_${index + 1}.pdf`)}><Download className="w-4 h-4 mr-2" /> Télécharger</Button>
                          </div>
                      ))}
                    </div>
                  )}
                    
                  {!hasApplicationDocuments && !hasProfileDocuments && (
                       <div className="text-center py-8">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">Aucun document disponible.</p>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <DialogFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          {applicationStatus === 'pending' && onStatusUpdate && (
            <>
              <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => onStatusUpdate('rejected')}>
                <XCircle className="w-4 h-4 mr-2" />Refuser
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => onStatusUpdate('accepted')}>
                <CheckCircle className="w-4 h-4 mr-2" />Accepter la candidature
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailModal;
