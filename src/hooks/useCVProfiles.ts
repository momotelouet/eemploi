
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
  created_at?: string;
  updated_at?: string;
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
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(profile => ({
        id: profile.id,
        template_id: profile.template_id,
        personal_info: typeof profile.personal_info === 'object' && profile.personal_info !== null 
          ? profile.personal_info as CVProfileData['personal_info']
          : {
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              address: '',
              professionalTitle: '',
              summary: '',
              photoUrl: ''
            },
        experience: Array.isArray(profile.experience) ? profile.experience as CVProfileData['experience'] : [],
        education: Array.isArray(profile.education) ? profile.education as CVProfileData['education'] : [],
        skills: Array.isArray(profile.skills) ? profile.skills as CVProfileData['skills'] : [],
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }));
      
      setProfiles(transformedData);
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
        
        const transformedData = {
          id: data.id,
          template_id: data.template_id,
          personal_info: data.personal_info as CVProfileData['personal_info'],
          experience: data.experience as CVProfileData['experience'],
          education: data.education as CVProfileData['education'],
          skills: data.skills as CVProfileData['skills'],
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setProfiles(prev => prev.map(p => p.id === profileData.id ? transformedData : p));
        return transformedData;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('cv_profiles')
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        
        const transformedData = {
          id: data.id,
          template_id: data.template_id,
          personal_info: data.personal_info as CVProfileData['personal_info'],
          experience: data.experience as CVProfileData['experience'],
          education: data.education as CVProfileData['education'],
          skills: data.skills as CVProfileData['skills'],
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setProfiles(prev => [transformedData, ...prev]);
        return transformedData;
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
