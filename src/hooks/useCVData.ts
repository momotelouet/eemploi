
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
      // Initialize CV data from user profile with safe property access
      const initialCVData: CVData = {
        personalInfo: {
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: user.email || '',
          phone: (profile as any).phone || '',
          address: `${(profile as any).city || ''}, ${(profile as any).country || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
          professionalTitle: (profile as any).professional_title || '',
          summary: (profile as any).bio || ''
        },
        experience: [],
        education: [],
        skills: []
      };
      
      setCVData(initialCVData);
      setLoading(false);
    } else if (!user) {
      setLoading(false);
    }
  }, [user, profile]);

  const saveCVData = (data: CVData) => {
    setCVData(data);
    // Here you could save to localStorage or send to backend
    localStorage.setItem('cvData', JSON.stringify(data));
  };

  const loadCVData = () => {
    try {
      const saved = localStorage.getItem('cvData');
      if (saved) {
        const parsedData = JSON.parse(saved);
        setCVData(parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
    }
    return null;
  };

  useEffect(() => {
    if (!cvData) {
      loadCVData();
    }
  }, []);

  return {
    cvData,
    saveCVData,
    loadCVData,
    loading
  };
};
