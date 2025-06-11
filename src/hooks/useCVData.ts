
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from './useUserProfile';
import { supabase } from '@/integrations/supabase/client';

interface CVData {
  personalInfo: {
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

export const useCVData = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      loadOrInitializeCVData();
    } else if (!user) {
      setLoading(false);
    }
  }, [user, profile]);

  const loadOrInitializeCVData = async () => {
    try {
      // Try to load existing CV data from database
      const { data: existingCV, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (existingCV && !error) {
        setCVData(existingCV.data);
      } else {
        // Initialize CV data from user profile
        const initialCVData: CVData = {
          personalInfo: {
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: user?.email || '',
            phone: (profile as any).phone || '',
            address: `${(profile as any).city || ''}, ${(profile as any).country || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
            professionalTitle: (profile as any).professional_title || '',
            summary: (profile as any).bio || '',
            photoUrl: (profile as any).avatar_url || ''
          },
          experience: [],
          education: [],
          skills: []
        };
        setCVData(initialCVData);
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
      // Fallback to localStorage
      loadCVDataFromLocal();
    } finally {
      setLoading(false);
    }
  };

  const saveCVData = async (data: CVData) => {
    setCVData(data);
    
    if (user) {
      try {
        // Save to database
        const { error } = await supabase
          .from('cv_data')
          .upsert({
            user_id: user.id,
            data: data,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving CV to database:', error);
          // Fallback to localStorage
          localStorage.setItem('cvData', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error saving CV data:', error);
        localStorage.setItem('cvData', JSON.stringify(data));
      }
    } else {
      localStorage.setItem('cvData', JSON.stringify(data));
    }
  };

  const loadCVDataFromLocal = () => {
    try {
      const saved = localStorage.getItem('cvData');
      if (saved) {
        const parsedData = JSON.parse(saved);
        setCVData(parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error('Error loading CV data from localStorage:', error);
    }
    return null;
  };

  return {
    cvData,
    saveCVData,
    loading
  };
};
