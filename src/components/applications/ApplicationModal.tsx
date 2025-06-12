
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useJobApplication } from '@/hooks/useJobApplication';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
}

const ApplicationModal = ({ isOpen, onClose, jobId, jobTitle, companyName }: ApplicationModalProps) => {
  const [coverLetter, setCoverLetter] = useState('');
  const { applyToJob, isApplying } = useJobApplication();

  const handleSubmit = async () => {
    const success = await applyToJob(jobId, coverLetter);
    if (success) {
      onClose();
      setCoverLetter('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Postuler à l'offre</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{jobTitle}</h3>
            <p className="text-muted-foreground">{companyName}</p>
          </div>

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
            <Button variant="outline" onClick={onClose} disabled={isApplying}>
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
