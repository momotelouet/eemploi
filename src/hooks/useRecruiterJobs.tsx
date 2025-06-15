
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type JobWithCompany = Tables<'jobs'> & {
  companies?: Tables<'companies'> | null;
};

const fetchRecruiterJobs = async (userId: string | undefined) => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      companies (*)
    `)
    .eq('posted_by', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  
  console.log('Fetched recruiter jobs data:', data);
  return data || [];
};

export const useRecruiterJobs = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['recruiterJobs', user?.id],
    queryFn: () => fetchRecruiterJobs(user?.id),
    enabled: !!user?.id
  });

  if (error) {
    console.error('Error fetching recruiter jobs:', error);
  }

  return { jobs: data ?? [], loading: isLoading };
};
