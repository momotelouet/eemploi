
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  CheckCircle, 
  XCircle,
  Briefcase,
  GraduationCap,
  Languages,
  Linkedin,
  Globe,
  User,
  Calendar,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useCandidateDetails } from '@/hooks/useCandidateDetails';
import { CandidateDetailHeader } from './candidate-detail/CandidateDetailHeader';
import { AssessmentsInfoTab } from './candidate-detail/AssessmentsInfoTab';
import { DocumentsInfoTab } from './candidate-detail/DocumentsInfoTab';

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

  const handleDownloadCV = async () => {
    if (!profile?.cv_file_url) {
      toast.error('Aucun CV disponible');
      return;
    }
    try {
      const response = await fetch(profile.cv_file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = profile.cv_file_name || 'CV_candidat.pdf';
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

  const handleDownloadCertificate = async (certificateUrl: string) => {
    try {
      const response = await fetch(certificateUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificat_evaluation.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Certificat téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Erreur lors du téléchargement du certificat');
    }
  };

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

  const isProfileEffectivelyEmpty = 
    profile &&
    profile.experience_years == null &&
    !profile.education &&
    (!profile.skills || profile.skills.length === 0) &&
    (!profile.languages || profile.languages.length === 0) &&
    !profile.linkedin_url &&
    !profile.portfolio_url;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Profil détaillé du candidat</span>
            {profile?.cv_file_url && (
              <Button onClick={handleDownloadCV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger CV
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto pr-6 flex-1">
          <CandidateDetailHeader fullName={fullName} profile={profile} />
          <Separator />
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Informations sur la candidature
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
                <CardTitle className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2" />
                  Profil du candidat
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {!profile ? (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Le profil détaillé de ce candidat n'est pas disponible.</p>
                  </div>
                ) : isProfileEffectivelyEmpty ? (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Ce candidat n'a pas encore complété son profil détaillé.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile.experience_years != null && (
                        <Card>
                          <CardHeader><CardTitle className="flex items-center text-lg"><Briefcase className="w-5 h-5 mr-2" />Expérience</CardTitle></CardHeader>
                          <CardContent><p>{profile.experience_years} ans d'expérience</p></CardContent>
                        </Card>
                      )}
                      {profile.education && (
                        <Card>
                          <CardHeader><CardTitle className="flex items-center text-lg"><GraduationCap className="w-5 h-5 mr-2" />Formation</CardTitle></CardHeader>
                          <CardContent><p>{profile.education}</p></CardContent>
                        </Card>
                      )}
                    </div>
                    {profile.skills && profile.skills.length > 0 && (
                      <Card>
                        <CardHeader><CardTitle>Compétences</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">{profile.skills.map((skill, index) => <Badge key={index} variant="secondary">{skill}</Badge>)}</CardContent>
                      </Card>
                    )}
                    {profile.languages && profile.languages.length > 0 && (
                       <Card>
                        <CardHeader><CardTitle className="flex items-center"><Languages className="w-5 h-5 mr-2" />Langues</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">{profile.languages.map((lang, index) => <Badge key={index} variant="outline">{lang}</Badge>)}</CardContent>
                      </Card>
                    )}
                    {(profile.linkedin_url || profile.portfolio_url) && (
                       <Card>
                        <CardHeader><CardTitle>Liens professionnels</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                          {profile.linkedin_url && (<Button variant="outline" size="sm" asChild><a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4 mr-2" />LinkedIn</a></Button>)}
                          {profile.portfolio_url && (<Button variant="outline" size="sm" asChild><a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4 mr-2" />Portfolio</a></Button>)}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="assessments" className="w-full pt-6 border-t">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assessments">Évaluations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="assessments" className="mt-4"><AssessmentsInfoTab assessments={assessments} onDownloadCertificate={handleDownloadCertificate} /></TabsContent>
            <TabsContent value="documents" className="mt-4"><DocumentsInfoTab application={application} profile={profile} assessments={assessments} onDownloadCV={handleDownloadCV} onDownloadCertificate={handleDownloadCertificate} /></TabsContent>
          </Tabs>
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
