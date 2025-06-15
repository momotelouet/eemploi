
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (assessmentId: string) => {
      if (!user?.id) {
        throw new Error("Utilisateur non authentifié.");
      }
      
      // 1. Delete certificate from storage first.
      const filePath = `${user.id}/certificates/certificat-${assessmentId}.pdf`;
      const { error: storageError } = await supabase.storage
        .from('candidate-files')
        .remove([filePath]);

      // It's okay if the file doesn't exist, but other errors should be logged as warnings.
      if (storageError && storageError.message !== 'The resource was not found') {
        console.warn('Impossible de supprimer le certificat du stockage, il est possible qu\'il n\'existe pas ou qu\'une erreur soit survenue:', storageError.message);
      }

      // 2. Delete the assessment from the database.
      // Related responses are deleted automatically due to `ON DELETE CASCADE`.
      const { error: dbError } = await supabase
        .from('candidate_assessments')
        .delete()
        .eq('id', assessmentId);

      if (dbError) {
        console.error('Erreur lors de la suppression de l\'évaluation de la base de données:', dbError);
        throw dbError;
      }

      return assessmentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-assessments', user?.id] });
      toast.success('Évaluation et certificat associé supprimés avec succès.');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression de l'évaluation : ${error.message}`);
      console.error('Error deleting assessment:', error);
    },
  });
};
