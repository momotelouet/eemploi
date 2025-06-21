import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type ApplicationWithJobAndProfile = Tables<'applications'> & {
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

const fetchJobApplications = async (recruiterId: string): Promise<ApplicationWithJobAndProfile[]> => {
  console.log('Fetching applications for recruiter:', recruiterId);
  
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
    .eq('jobs.posted_by', recruiterId)
    .order('applied_at', { ascending: false });

  if (applicationsError) {
    console.error('Error fetching applications:', applicationsError);
    throw applicationsError;
  }

  if (!applicationsData || applicationsData.length === 0) {
    return [];
  }

  // Récupérer les profils des candidats séparément
  const candidateIds = applicationsData.map(app => app.candidate_id);
  const { data: candidateProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', candidateIds);

  if (profilesError) {
    console.error('Error fetching candidate profiles:', profilesError);
  }

  // Combiner les données
  const applicationsWithProfiles = applicationsData.map(app => ({
    ...app,
    candidate_profiles: {
      profiles: candidateProfiles?.find(profile => profile.id === app.candidate_id) || undefined
    }
  }));

  return applicationsWithProfiles;
};

export const useJobApplications = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobApplications', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([]);
      return fetchJobApplications(user.id);
    },
    enabled: !!user?.id,
  });

  if (error) {
    console.error('Error fetching job applications via useQuery:', error);
  }

  return { applications: data ?? [], loading: isLoading };
};
