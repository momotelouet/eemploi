
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CVProfileData {
  id?: string;
  template_id: string;
  personal_info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    professionalTitle: string;
    summary: string;
    photoUrl?: string;
  };
  experience: Array<{
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
}

export const useCVProfiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<CVProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfiles = async () => {
    if (!user) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cv_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error fetching CV profiles:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: CVProfileData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const dataToSave = {
        user_id: user.id,
        template_id: profileData.template_id,
        personal_info: profileData.personal_info,
        experience: profileData.experience,
        education: profileData.education,
        skills: profileData.skills,
        updated_at: new Date().toISOString()
      };

      if (profileData.id) {
        // Update existing profile
        const { data, error } = await supabase
          .from('cv_profiles')
          .update(dataToSave)
          .eq('id', profileData.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        setProfiles(prev => prev.map(p => p.id === profileData.id ? data : p));
        return data;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('cv_profiles')
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        
        setProfiles(prev => [data, ...prev]);
        return data;
      }
    } catch (err) {
      console.error('Error saving CV profile:', err);
      throw err;
    }
  };

  const deleteProfile = async (profileId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('cv_profiles')
        .delete()
        .eq('id', profileId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setProfiles(prev => prev.filter(p => p.id !== profileId));
      toast({
        title: 'Profil supprimé',
        description: 'Le profil CV a été supprimé avec succès.',
      });
    } catch (err) {
      console.error('Error deleting CV profile:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  return {
    profiles,
    loading,
    error,
    saveProfile,
    deleteProfile,
    refetch: fetchProfiles
  };
};
