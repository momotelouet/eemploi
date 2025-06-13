
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define custom types for candidate profile since it's not in generated types yet
export interface CandidateProfile {
  id: string;
  user_id: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  skills?: string[];
  experience_years?: number;
  education?: string;
  languages?: string[];
  cv_file_url?: string;
  cv_file_name?: string;
  profile_picture_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

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
        // Use direct SQL query to access candidate_profiles table
        const { data, error } = await supabase
          .rpc('get_candidate_profile', { candidate_user_id: candidateId });

        if (error) {
          // If RPC doesn't exist, fall back to direct query
          const { data: directData, error: directError } = await supabase
            .from('candidate_profiles' as any)
            .select('*')
            .eq('user_id', candidateId)
            .maybeSingle();

          if (directError) throw directError;
          setProfile(directData);
        } else {
          setProfile(data);
        }
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
