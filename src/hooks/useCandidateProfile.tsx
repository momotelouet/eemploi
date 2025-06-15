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
        console.log('Fetching profile for user:', candidateId);
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('user_id', candidateId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching candidate profile:', error);
          setError(error);
          setProfile(null);
        } else {
          console.log('Profile fetched successfully:', data);
          setProfile(data);
          setError(null);
        }
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error('Error fetching candidate profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [candidateId]);

  const updateProfile = async (updates: Partial<CandidateProfile>) => {
    if (!candidateId) {
      throw new Error('User ID is required');
    }

    try {
      console.log('Updating profile with data:', updates);
      
      const profileData = {
        user_id: candidateId,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('candidate_profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      setProfile(data);
      setError(null);
      return data;
    } catch (err) {
      const error = err as Error;
      console.error('Error updating profile:', error);
      setError(error);
      throw error;
    }
  };

  return { profile, loading, error, updateProfile };
};
