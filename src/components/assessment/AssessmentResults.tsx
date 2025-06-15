
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUserAssessments, Assessment, useDeleteAssessment } from '@/hooks/useAssessment';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NoAssessmentFound from './NoAssessmentFound';
import AssessmentResultHeader from './AssessmentResultHeader';
import AssessmentList from './AssessmentList';

interface AssessmentResultsProps {
  onStartNewAssessment?: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ onStartNewAssessment }) => {
  const { data: assessments, isLoading } = useUserAssessments();
  const deleteAssessmentMutation = useDeleteAssessment();
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const completedAssessments = assessments?.filter(a => a.status === 'completed') || [];

  if (completedAssessments.length === 0) {
    return <NoAssessmentFound />;
  }
  
  const handleDeleteRequest = (assessment: Assessment) => {
    setAssessmentToDelete(assessment);
  };

  const confirmDeletion = () => {
    if (assessmentToDelete) {
      deleteAssessmentMutation.mutate(assessmentToDelete.id);
      setAssessmentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <AssessmentResultHeader />

      <AssessmentList 
        assessments={completedAssessments}
        onStartNewAssessment={onStartNewAssessment}
        onDelete={handleDeleteRequest}
      />

      <AlertDialog open={!!assessmentToDelete} onOpenChange={(open) => !open && setAssessmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Votre résultat d'évaluation sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAssessmentToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletion}
              disabled={deleteAssessmentMutation.isPending}
            >
              {deleteAssessmentMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssessmentResults;
