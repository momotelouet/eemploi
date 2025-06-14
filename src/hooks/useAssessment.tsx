
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AssessmentQuestion {
  id: string;
  category: string;
  question_text: string;
  question_type: string;
  options: any;
  weight: number;
}

export interface AssessmentResponse {
  question_id: string;
  response_value: any;
  score: number;
}

export interface Assessment {
  id: string;
  user_id: string;
  assessment_type: string;
  status: string;
  started_at: string;
  completed_at?: string;
  total_score: number;
  personality_score: any;
  skills_score: any;
  qualities_score: any;
  certificate_url?: string;
}

export const useAssessmentQuestions = () => {
  return useQuery({
    queryKey: ['assessment-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assessment_questions')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data as AssessmentQuestion[];
    },
  });
};

export const useUserAssessments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-assessments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('candidate_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Assessment[];
    },
    enabled: !!user?.id,
  });
};

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

export const useSubmitAssessmentResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      assessmentId, 
      responses 
    }: { 
      assessmentId: string; 
      responses: AssessmentResponse[] 
    }) => {
      // Insérer toutes les réponses
      const { error: responsesError } = await supabase
        .from('assessment_responses')
        .insert(
          responses.map(response => ({
            assessment_id: assessmentId,
            question_id: response.question_id,
            response_value: response.response_value,
            score: response.score
          }))
        );

      if (responsesError) throw responsesError;

      // Calculer les scores par catégorie
      const personalityScore = responses
        .filter(r => r.question_id.includes('personality'))
        .reduce((sum, r) => sum + r.score, 0);
      
      const skillsScore = responses
        .filter(r => r.question_id.includes('skills'))
        .reduce((sum, r) => sum + r.score, 0);
      
      const qualitiesScore = responses
        .filter(r => r.question_id.includes('qualities'))
        .reduce((sum, r) => sum + r.score, 0);

      const totalScore = personalityScore + skillsScore + qualitiesScore;

      // Mettre à jour l'évaluation avec les scores
      const { data, error } = await supabase
        .from('candidate_assessments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_score: totalScore,
          personality_score: { score: personalityScore },
          skills_score: { score: skillsScore },
          qualities_score: { score: qualitiesScore }
        })
        .eq('id', assessmentId)
        .select()
        .single();

      if (error) throw error;
      return data as Assessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-assessments'] });
      toast.success('Évaluation complétée avec succès !');
    },
    onError: (error) => {
      toast.error('Erreur lors de la soumission de l\'évaluation');
      console.error('Error submitting assessment:', error);
    },
  });
};
