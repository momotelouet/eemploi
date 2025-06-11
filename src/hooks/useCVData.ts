
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from './useUserProfile';

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

  const loadOrInitializeCVData = () => {
    try {
      // Try to load existing CV data from localStorage
      const saved = localStorage.getItem(`cvData_${user?.id}`);
      
      if (saved) {
        const parsedData = JSON.parse(saved);
        setCVData(parsedData);
      } else {
        // Initialize CV data from user profile
        const profileData = profile as any;
        const initialCVData: CVData = {
          personalInfo: {
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            email: user?.email || '',
            phone: profileData?.phone || '',
            address: `${profileData?.city || ''}, ${profileData?.country || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
            professionalTitle: profileData?.professional_title || '',
            summary: profileData?.bio || '',
            photoUrl: profileData?.avatar_url || ''
          },
          experience: [],
          education: [],
          skills: []
        };
        setCVData(initialCVData);
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
      // Fallback to basic data
      const initialCVData: CVData = {
        personalInfo: {
          firstName: '',
          lastName: '',
          email: user?.email || '',
          phone: '',
          address: '',
          professionalTitle: '',
          summary: '',
          photoUrl: ''
        },
        experience: [],
        education: [],
        skills: []
      };
      setCVData(initialCVData);
    } finally {
      setLoading(false);
    }
  };

  const saveCVData = (data: CVData) => {
    setCVData(data);
    
    try {
      // Save to localStorage with user-specific key
      if (user) {
        localStorage.setItem(`cvData_${user.id}`, JSON.stringify(data));
      } else {
        localStorage.setItem('cvData', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving CV data:', error);
    }
  };

  return {
    cvData,
    saveCVData,
    loading
  };
};
