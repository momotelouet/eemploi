
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type JobWithCompany = Tables<'jobs'> & {
  companies: Tables<'companies'>;
};

export const useRecruiterJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    const fetchRecruiterJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            companies (*)
          `)
          .eq('posted_by', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (err) {
        console.error('Error fetching recruiter jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterJobs();
  }, [user]);

  return { jobs, loading };
};
