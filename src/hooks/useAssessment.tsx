import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { generateAndStoreCertificate } from '@/lib/assessmentUtils';

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
        .order('completed_at', { ascending: false, nullsFirst: false });

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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      assessmentId, 
      responses 
    }: { 
      assessmentId: string; 
      responses: AssessmentResponse[] 
    }) => {
      console.log('Submitting responses:', responses);

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

      if (responsesError) {
        console.error('Error inserting responses:', responsesError);
        throw responsesError;
      }

      // Récupérer les questions pour connaître leurs catégories
      const { data: questions, error: questionsError } = await supabase
        .from('assessment_questions')
        .select('id, category')
        .in('id', responses.map(r => r.question_id));

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw questionsError;
      }

      // Créer un map pour associer question_id à catégorie
      const questionCategories = questions.reduce((acc, question) => {
        acc[question.id] = question.category;
        return acc;
      }, {} as Record<string, string>);

      // Calculer les scores par catégorie en utilisant les vraies catégories
      const personalityScore = responses
        .filter(r => questionCategories[r.question_id] === 'personality')
        .reduce((sum, r) => sum + r.score, 0);
      
      const skillsScore = responses
        .filter(r => questionCategories[r.question_id] === 'skills')
        .reduce((sum, r) => sum + r.score, 0);
      
      const qualitiesScore = responses
        .filter(r => questionCategories[r.question_id] === 'qualities')
        .reduce((sum, r) => sum + r.score, 0);

      const totalScore = personalityScore + skillsScore + qualitiesScore;

      console.log('Calculated scores:', {
        personality: personalityScore,
        skills: skillsScore,
        qualities: qualitiesScore,
        total: totalScore
      });

      // Mettre à jour l'évaluation avec les scores
      const { data: updatedAssessment, error } = await supabase
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

      if (error) {
        console.error('Error updating assessment:', error);
        throw error;
      }

      console.log('Updated assessment:', updatedAssessment);

      // Automatically generate and store the certificate
      if (updatedAssessment) {
        const certResult = await generateAndStoreCertificate(updatedAssessment);
        if (certResult?.publicUrl) {
          console.log('Certificate automatically generated and stored:', certResult.publicUrl);
        } else {
          console.warn('Failed to auto-generate certificate for assessment:', assessmentId);
          toast.warning("L'évaluation est complétée, mais la génération automatique du certificat a échoué. Vous pourrez le regénérer plus tard depuis votre dashboard.");
        }
      }

      return updatedAssessment as Assessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-assessments'] });
      // Invalidate the candidate profile to pick up the new certificate_url
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['candidate-profile', user.id] });
      }
      toast.success('Évaluation complétée avec succès ! Votre certificat est maintenant disponible.');
    },
    onError: (error) => {
      toast.error('Erreur lors de la soumission de l\'évaluation');
      console.error('Error submitting assessment:', error);
    },
  });
};

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (assessmentId: string) => {
      // First, delete related responses to avoid foreign key constraint errors
      const { error: responsesError } = await supabase
        .from('assessment_responses')
        .delete()
        .eq('assessment_id', assessmentId);

      if (responsesError) {
        console.error('Error deleting assessment responses:', responsesError);
        throw responsesError;
      }

      // Then, delete the assessment itself
      const { error } = await supabase
        .from('candidate_assessments')
        .delete()
        .eq('id', assessmentId);

      if (error) {
        throw error;
      }
      return assessmentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-assessments', user?.id] });
      toast.success('Évaluation supprimée avec succès.');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression : ${error.message}`);
      console.error('Error deleting assessment:', error);
    },
  });
};
