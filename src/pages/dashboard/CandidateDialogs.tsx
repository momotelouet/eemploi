
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProfessionalProfileManager from '@/components/cv/ProfessionalProfileManager';
import InterviewAI from '@/components/ai/InterviewAI';
import AssessmentTest from '@/components/assessment/AssessmentTest';

interface CandidateDialogsProps {
  showCreateCV: boolean;
  setShowCreateCV: (open: boolean) => void;
  showInterviewSimulator: boolean;
  setShowInterviewSimulator: (open: boolean) => void;
  showAssessmentTest: boolean;
  setShowAssessmentTest: (open: boolean) => void;
  userProfile: { first_name?: string; last_name?: string } | null;
  onAssessmentComplete?: () => void;
}

const CandidateDialogs: React.FC<CandidateDialogsProps> = ({
  showCreateCV,
  setShowCreateCV,
  showInterviewSimulator,
  setShowInterviewSimulator,
  showAssessmentTest,
  setShowAssessmentTest,
  userProfile,
  onAssessmentComplete
}) => (
  <>
    {/* Dialog pour créer un CV */}
    <Dialog open={showCreateCV} onOpenChange={setShowCreateCV}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau CV</DialogTitle>
        </DialogHeader>
        <ProfessionalProfileManager />
      </DialogContent>
    </Dialog>

    {/* Dialog pour simuler un entretien */}
    <Dialog open={showInterviewSimulator} onOpenChange={setShowInterviewSimulator}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Simulateur d&apos;entretien IA</DialogTitle>
        </DialogHeader>
        <InterviewAI 
          jobTitle="Poste généraliste"
          candidateProfile={
            userProfile
              ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || "Candidat"
              : "Candidat"
          }
        />
      </DialogContent>
    </Dialog>

    {/* Dialog pour le test d&apos;évaluation */}
    <Dialog open={showAssessmentTest} onOpenChange={setShowAssessmentTest}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test de Personnalité et Compétences</DialogTitle>
        </DialogHeader>
        <AssessmentTest 
          onComplete={onAssessmentComplete}
        />
      </DialogContent>
    </Dialog>
  </>
);

export default CandidateDialogs;
