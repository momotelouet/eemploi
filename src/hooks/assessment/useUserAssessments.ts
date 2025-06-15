
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Assessment } from './types';

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
