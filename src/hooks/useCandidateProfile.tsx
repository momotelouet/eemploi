
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type CandidateProfile = Tables<'candidate_profiles'>;

export const useCandidateProfile = (candidateId: string | null = null) => {
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

        if (error) {
          console.error('Error fetching candidate profile:', error);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching candidate profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [candidateId]);

  const updateProfile = async (updates: Partial<CandidateProfile>) => {
    if (!candidateId) return;

    try {
      const { data, error } = await supabase
        .from('candidate_profiles')
        .upsert({
          user_id: candidateId,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { profile, loading, error, updateProfile };
};
