
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type CandidateProfile = Tables<'candidate_profiles'>;
type UserProfile = Tables<'profiles'>;
type Assessment = Tables<'candidate_assessments'>;
type Application = Tables<'applications'>;

export interface CandidateDetails {
  profile: CandidateProfile | null;
  userProfile: UserProfile | null;
  assessments: Assessment[];
  application: Application | null;
}

const fetchCandidateData = async (candidateId: string, applicationId: string): Promise<CandidateDetails> => {
    console.log(`Fetching details for candidate: ${candidateId}, application: ${applicationId}`);

    const profileRes = await supabase.from('candidate_profiles').select('*').eq('user_id', candidateId).maybeSingle();
    if (profileRes.error) {
        console.error('Error fetching candidate profile:', profileRes.error);
        toast.error("Erreur lors de la récupération du profil du candidat.");
    }

    const userProfileRes = await supabase.from('profiles').select('*').eq('id', candidateId).maybeSingle();
    if (userProfileRes.error) {
        console.error('Error fetching user profile:', userProfileRes.error);
        toast.error("Erreur lors de la récupération du profil utilisateur.");
    }

    const assessmentsRes = await supabase.from('candidate_assessments').select('*').eq('user_id', candidateId).eq('status', 'completed').order('completed_at', { ascending: false });
    if (assessmentsRes.error) {
        console.error('Error fetching assessments:', assessmentsRes.error);
        toast.error("Erreur lors de la récupération des évaluations.");
    }

    const applicationRes = await supabase.from('applications').select('*').eq('id', applicationId).maybeSingle();
    if (applicationRes.error) {
        console.error('Error fetching application:', applicationRes.error);
        toast.error("Erreur lors de la récupération de la candidature.");
    }

    return {
        profile: profileRes.data || null,
        userProfile: userProfileRes.data || null,
        assessments: assessmentsRes.data || [],
        application: applicationRes.data || null,
    };
};

export const useCandidateDetails = (candidateId: string | null, applicationId: string | null, enabled: boolean) => {
  const { data, isLoading } = useQuery({
    queryKey: ['candidateDetails', candidateId, applicationId],
    queryFn: () => {
        if (!candidateId || !applicationId) {
            return Promise.resolve({
                profile: null,
                userProfile: null,
                assessments: [],
                application: null,
            });
        }
        return fetchCandidateData(candidateId, applicationId);
    },
    enabled: enabled && !!candidateId && !!applicationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on error, we are showing toasts
  });

  return { 
      profile: data?.profile ?? null,
      userProfile: data?.userProfile ?? null,
      assessments: data?.assessments ?? [],
      application: data?.application ?? null,
      loading: isLoading 
  };
};
