
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useJobApplication } from '@/hooks/useJobApplication';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FileText, Award, CheckCircle } from 'lucide-react';
import CVSelector from './CVSelector';
import CoverLetterGenerator from '@/components/cover-letter/CoverLetterGenerator';
import { Checkbox } from '@/components/ui/checkbox';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
}

const ApplicationModal = ({ isOpen, onClose, onSubmitSuccess, jobId, jobTitle, companyName }: ApplicationModalProps) => {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedCVOption, setSelectedCVOption] = useState('platform');
  const [selectedCvUrl, setSelectedCvUrl] = useState<string | undefined>();
  const [uploadedCVFile, setUploadedCVFile] = useState<File | undefined>();
  const [selectedCVProfileId, setSelectedCVProfileId] = useState<string | undefined>();
  const [attachCertificate, setAttachCertificate] = useState(true);

  const { applyToJob, isApplying } = useJobApplication();
  const { profile: candidateProfile } = useCandidateProfile(user?.id || null);

  // Get certificate URL directly from the candidate's profile
  const latestCertificate = candidateProfile?.certificate_url
    ? { certificate_url: candidateProfile.certificate_url }
    : undefined;

  useEffect(() => {
    // Automatically check the box if a certificate exists
    setAttachCertificate(!!latestCertificate);
  }, [latestCertificate]);

  const handleCVSelect = (data: {
    type: 'platform' | 'upload' | 'profile';
    cvUrl?: string;
    cvFile?: File;
    cvProfileId?: string;
  }) => {
    // Reset all CV data first
    setSelectedCvUrl(undefined);
    setUploadedCVFile(undefined);
    setSelectedCVProfileId(undefined);

    // Set the one that was selected
    if (data.type === 'platform') {
      setSelectedCVProfileId(data.cvProfileId);
    } else if (data.type === 'upload') {
      setUploadedCVFile(data.cvFile);
    } else if (data.type === 'profile') {
      setSelectedCvUrl(data.cvUrl);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCvUrl && !uploadedCVFile && !selectedCVProfileId) {
      toast.error('Veuillez sélectionner un CV avant de postuler.');
      return;
    }

    const certificateUrlToAttach = attachCertificate ? latestCertificate?.certificate_url : undefined;

    const success = await applyToJob(
      jobId, 
      coverLetter,
      selectedCvUrl,
      uploadedCVFile,
      selectedCVProfileId,
      certificateUrlToAttach
    );
    
    if (success) {
      onSubmitSuccess?.();
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setCoverLetter('');
    setSelectedCvUrl(undefined);
    setUploadedCVFile(undefined);
    setSelectedCVProfileId(undefined);
    setSelectedCVOption('platform');
    setAttachCertificate(true);
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
                  {(selectedCvUrl || uploadedCVFile || selectedCVProfileId) && (
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
                  <div className="flex items-center space-x-3 text-sm">
                    <Checkbox
                      id="attach-certificate"
                      checked={attachCertificate}
                      onCheckedChange={(checked) => setAttachCertificate(Boolean(checked))}
                      className="peer"
                    />
                    <label htmlFor="attach-certificate" className="flex items-center space-x-2 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span>Certificat d'évaluation</span>
                    </label>
                    {attachCertificate && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                    )}
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
            <Button onClick={handleSubmit} disabled={isApplying || (!selectedCvUrl && !uploadedCVFile && !selectedCVProfileId)}>
              {isApplying ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
