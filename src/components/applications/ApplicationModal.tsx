
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useJobApplication } from '@/hooks/useJobApplication';
import { useUserAssessments } from '@/hooks/useAssessment';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FileText, Award, CheckCircle } from 'lucide-react';
import CVSelector from './CVSelector';
import CoverLetterGenerator from '@/components/cover-letter/CoverLetterGenerator';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
}

const ApplicationModal = ({ isOpen, onClose, jobId, jobTitle, companyName }: ApplicationModalProps) => {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedCVOption, setSelectedCVOption] = useState('platform');
  const [platformCVUrl, setPlatformCVUrl] = useState<string | undefined>();
  const [uploadedCVFile, setUploadedCVFile] = useState<File | undefined>();
  const [selectedCVProfileId, setSelectedCVProfileId] = useState<string | undefined>();

  const { applyToJob, isApplying } = useJobApplication();
  const { data: assessments } = useUserAssessments();

  // Get the latest completed assessment with certificate
  const latestCertificate = assessments?.find(
    assessment => assessment.status === 'completed' && assessment.certificate_url
  );

  const handleCVSelect = (data: {
    type: 'platform' | 'upload' | 'profile';
    cvUrl?: string;
    cvFile?: File;
    cvProfileId?: string;
  }) => {
    // Reset all CV data first
    setPlatformCVUrl(undefined);
    setUploadedCVFile(undefined);
    setSelectedCVProfileId(undefined);

    // Set the one that was selected
    if (data.type === 'platform') {
      setPlatformCVUrl(data.cvUrl);
    } else if (data.type === 'upload') {
      setUploadedCVFile(data.cvFile);
    } else if (data.type === 'profile') {
      setSelectedCVProfileId(data.cvProfileId);
    }
  };

  const handleSubmit = async () => {
    if (!platformCVUrl && !uploadedCVFile && !selectedCVProfileId) {
      toast.error('Veuillez sélectionner un CV avant de postuler.');
      return;
    }

    const success = await applyToJob(
      jobId, 
      coverLetter,
      platformCVUrl,
      uploadedCVFile,
      selectedCVProfileId
    );
    
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setCoverLetter('');
    setPlatformCVUrl(undefined);
    setUploadedCVFile(undefined);
    setSelectedCVProfileId(undefined);
    setSelectedCVOption('platform');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Postuler à l'offre</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">{jobTitle}</h3>
            <p className="text-muted-foreground">{companyName}</p>
          </div>

          {/* Aperçu des fichiers qui seront attachés */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Fichiers qui seront attachés à votre candidature :</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>CV</span>
                  {(platformCVUrl || uploadedCVFile || selectedCVProfileId) && (
                    <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                  )}
                </div>
                
                {coverLetter.trim() && (
                  <div className="flex items-center space-x-2 text-sm">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>Lettre de motivation</span>
                    <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                  </div>
                )}
                
                {latestCertificate ? (
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <span>Certificat d'évaluation</span>
                    <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4" />
                    <span>Certificat d'évaluation (non disponible)</span>
                    <span className="text-xs ml-2">Passez un test d'évaluation dans votre dashboard</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sélecteur de CV */}
          <CVSelector
            onCVSelect={handleCVSelect}
            selectedOption={selectedCVOption}
            onOptionChange={setSelectedCVOption}
          />

          {/* Lettre de motivation */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Lettre de motivation</Label>
            <div className="space-y-3">
              <CoverLetterGenerator />
              <Textarea
                id="coverLetter"
                placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isApplying}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isApplying || (!platformCVUrl && !uploadedCVFile && !selectedCVProfileId)}>
              {isApplying ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
