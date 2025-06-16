import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserType = () => {
  const { user } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserType(null);
      setLoading(false);
      return;
    }
    const fetchUserType = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setUserType(data.user_type);
      } else {
        setUserType(null);
      }
      setLoading(false);
    };
    fetchUserType();
  }, [user]);

  return { userType, loading };
};
