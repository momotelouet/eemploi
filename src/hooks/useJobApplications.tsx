
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
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            jobs (
              *,
              companies (*)
            )
          `)
          .eq('jobs.posted_by', user.id)
          .order('applied_at', { ascending: false });

        if (applicationsError) {
          console.error('Error fetching applications:', applicationsError);
          throw applicationsError;
        }

        console.log('Applications fetched:', applicationsData);

        if (!applicationsData || applicationsData.length === 0) {
          setApplications([]);
          return;
        }

        // Récupérer les profils des candidats séparément
        const candidateIds = applicationsData.map(app => app.candidate_id);
        const { data: candidateProfiles, error: profilesError } = await supabase
          .from('candidate_profiles')
          .select(`
            *,
            profiles (
              first_name,
              last_name
            )
          `)
          .in('user_id', candidateIds);

        if (profilesError) {
          console.error('Error fetching candidate profiles:', profilesError);
        }

        // Combiner les données
        const applicationsWithProfiles = applicationsData.map(app => ({
          ...app,
          candidate_profiles: candidateProfiles?.find(profile => profile.user_id === app.candidate_id) || undefined
        }));

        setApplications(applicationsWithProfiles);
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
