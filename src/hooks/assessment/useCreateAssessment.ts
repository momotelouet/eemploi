
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Assessment } from './types';

export const useCreateAssessment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentType: string = 'complete') => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('candidate_assessments')
        .insert({
          user_id: user.id,
          assessment_type: assessmentType,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      return data as Assessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-assessments'] });
      toast.success('Évaluation créée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de l\'évaluation');
      console.error('Error creating assessment:', error);
    },
  });
};
