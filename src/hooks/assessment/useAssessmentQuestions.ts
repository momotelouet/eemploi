
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AssessmentQuestion } from './types';

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
