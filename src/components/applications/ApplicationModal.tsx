
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useJobApplication } from '@/hooks/useJobApplication';
import { toast } from 'sonner';
import CVSelector from './CVSelector';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
}

const ApplicationModal = ({ isOpen, onClose, jobId, jobTitle, companyName }: ApplicationModalProps) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedCVOption, setSelectedCVOption] = useState('platform');
  const [cvData, setCvData] = useState<{
    type: 'platform' | 'upload' | 'profile';
    cvUrl?: string;
    cvFile?: File;
    cvProfileId?: string;
  }>({
    type: 'platform'
  });
  const { applyToJob, isApplying } = useJobApplication();

  const handleSubmit = async () => {
    // Vérifier qu'un CV a été sélectionné
    if (!cvData.cvUrl && !cvData.cvFile && !cvData.cvProfileId) {
      toast.error('Veuillez sélectionner un CV avant de postuler.');
      return;
    }

    const success = await applyToJob(
      jobId, 
      coverLetter,
      cvData.cvUrl,
      cvData.cvFile,
      cvData.cvProfileId
    );
    
    if (success) {
      toast.success(`Votre candidature pour le poste "${jobTitle}" chez ${companyName} a été envoyée avec succès ! 🎉`);
      onClose();
      setCoverLetter('');
      setCvData({ type: 'platform' });
    }
  };

  const handleClose = () => {
    onClose();
    setCoverLetter('');
    setCvData({ type: 'platform' });
    setSelectedCVOption('platform');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Postuler à l'offre</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">{jobTitle}</h3>
            <p className="text-muted-foreground">{companyName}</p>
          </div>

          {/* Sélecteur de CV */}
          <CVSelector
            onCVSelect={setCvData}
            selectedOption={selectedCVOption}
            onOptionChange={setSelectedCVOption}
          />

          {/* Lettre de motivation */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Lettre de motivation (optionnelle)</Label>
            <Textarea
              id="coverLetter"
              placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isApplying}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isApplying}>
              {isApplying ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
