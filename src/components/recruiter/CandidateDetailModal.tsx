
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCandidateDetails } from '@/hooks/useCandidateDetails';
import { CandidateDetailHeader } from './candidate-detail/CandidateDetailHeader';
import { ApplicationInfoTab } from './candidate-detail/ApplicationInfoTab';
import { ProfileInfoTab } from './candidate-detail/ProfileInfoTab';
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
          <Tabs defaultValue="application" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="application">Candidature</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="assessments">Évaluations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="application"><ApplicationInfoTab application={application} /></TabsContent>
            <TabsContent value="profile"><ProfileInfoTab profile={profile} /></TabsContent>
            <TabsContent value="assessments"><AssessmentsInfoTab assessments={assessments} onDownloadCertificate={handleDownloadCertificate} /></TabsContent>
            <TabsContent value="documents"><DocumentsInfoTab application={application} profile={profile} assessments={assessments} onDownloadCV={handleDownloadCV} onDownloadCertificate={handleDownloadCertificate} /></TabsContent>
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
