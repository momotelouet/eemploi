
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ApplicationWithJobAndProfile = Tables<'applications'> & {
  jobs: Tables<'jobs'> & {
    companies?: Tables<'companies'>;
  };
  candidate_profiles?: Tables<'candidate_profiles'> & {
    profiles?: {
      first_name: string;
      last_name: string;
    };
  };
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
        console.log('Fetching applications for recruiter:', user.id);
        
        // Récupérer toutes les candidatures pour les offres du recruteur
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            jobs (
              *,
              companies (*)
            ),
            candidate_profiles!applications_candidate_id_fkey (
              *,
              profiles (
                first_name,
                last_name
              )
            )
          `)
          .eq('jobs.posted_by', user.id)
          .order('applied_at', { ascending: false });

        if (error) {
          console.error('Error fetching applications:', error);
          throw error;
        }

        console.log('Applications fetched:', data);
        setApplications(data || []);
      } catch (err) {
        console.error('Error fetching job applications:', err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobApplications();
  }, [user]);

  return { applications, loading };
};
