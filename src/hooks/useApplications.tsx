
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ApplicationWithJob = Tables<'applications'> & {
  jobs?: (Tables<'jobs'> & {
    companies?: Tables<'companies'> | null;
  }) | null;
};

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            jobs (
              *,
              companies (*)
            )
          `)
          .eq('candidate_id', user.id)
          .order('applied_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Fetched applications data:', data);
        setApplications(data || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setApplications([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  return { applications, loading };
};
