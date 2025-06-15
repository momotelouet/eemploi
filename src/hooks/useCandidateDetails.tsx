
import { useState, useEffect } from 'react';
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

export const useCandidateDetails = (candidateId: string | null, applicationId: string | null, enabled: boolean) => {
  const [details, setDetails] = useState<CandidateDetails>({
    profile: null,
    userProfile: null,
    assessments: [],
    application: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !candidateId || !applicationId) {
      setDetails({ profile: null, userProfile: null, assessments: [], application: null });
      setLoading(false);
      return;
    }

    const fetchCandidateData = async () => {
      setLoading(true);
      try {
        const [profileRes, userProfileRes, assessmentsRes, applicationRes] = await Promise.all([
          supabase.from('candidate_profiles').select('*').eq('user_id', candidateId!).maybeSingle(),
          supabase.from('profiles').select('*').eq('id', candidateId!).maybeSingle(),
          supabase.from('candidate_assessments').select('*').eq('user_id', candidateId!).eq('status', 'completed').order('completed_at', { ascending: false }),
          supabase.from('applications').select('*').eq('id', applicationId!).maybeSingle(),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (userProfileRes.error) throw userProfileRes.error;
        if (assessmentsRes.error) throw assessmentsRes.error;
        if (applicationRes.error) throw applicationRes.error;

        setDetails({
          profile: profileRes.data,
          userProfile: userProfileRes.data,
          assessments: assessmentsRes.data || [],
          application: applicationRes.data,
        });

      } catch (err) {
        console.error('Error fetching candidate data:', err);
        toast.error('Erreur lors du chargement des données du candidat');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [candidateId, applicationId, enabled]);

  return { ...details, loading };
};
