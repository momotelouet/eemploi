
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ApplicationWithJobAndProfile = Tables<'applications'> & {
  jobs: Tables<'jobs'>;
  profiles?: Tables<'profiles'>;
};

export const useJobApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJobAndProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const fetchJobApplications = async () => {
      try {
        // First get jobs posted by the recruiter
        const { data: recruiterJobs, error: jobsError } = await supabase
          .from('jobs')
          .select('id')
          .eq('posted_by', user.id);

        if (jobsError) throw jobsError;

        const jobIds = recruiterJobs?.map(job => job.id) || [];

        if (jobIds.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }

        // Then get applications for those jobs
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            jobs (*)
          `)
          .in('job_id', jobIds)
          .order('applied_at', { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } catch (err) {
        console.error('Error fetching job applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobApplications();
  }, [user]);

  return { applications, loading };
};
