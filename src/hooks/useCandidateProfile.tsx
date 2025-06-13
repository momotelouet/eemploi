
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type CandidateProfile = Tables<'candidate_profiles'>;

export const useCandidateProfile = (candidateId: string | null) => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!candidateId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('user_id', candidateId)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching candidate profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [candidateId]);

  return { profile, loading, error };
};
