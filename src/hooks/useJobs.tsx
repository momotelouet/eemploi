
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type JobWithCompany = Tables<'jobs'> & {
  companies?: Tables<'companies'> | null;
};

export const useJobs = () => {
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            companies (*)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Fetched jobs data:', data);
        setJobs(data || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setJobs([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, loading };
};
