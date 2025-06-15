
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';

export type RecruiterProfile = Tables<'recruiter_profiles'>;
export type RecruiterProfileUpdate = TablesUpdate<'recruiter_profiles'>;

export const useRecruiterProfile = (userId: string | null) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['recruiter-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('recruiter_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching recruiter profile:', error);
        throw error;
      }
      
      return data as RecruiterProfile | null;
    },
    enabled: !!userId,
  });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (profileData: RecruiterProfileUpdate) => {
      if (!userId) throw new Error('User not authenticated.');

      // The profile is created by a trigger, so we only need to update it.
      const { data, error } = await supabase
        .from('recruiter_profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as RecruiterProfile;
    },
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(['recruiter-profile', userId], data);
      toast.success('Profil recruteur mis à jour avec succès.');
    },
    onError: (error) => {
      console.error("Error updating recruiter profile:", error);
      toast.error('Erreur lors de la mise à jour du profil.');
    },
  });

  return { profile, isLoading, error, updateProfile, isUpdating };
};
