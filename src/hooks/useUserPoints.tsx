
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export const useUserPoints = () => {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<Tables<'user_points'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserPoints(null);
      setLoading(false);
      return;
    }

    const fetchUserPoints = async () => {
      try {
        const { data, error } = await supabase
          .from('user_points')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        // If no points record exists, create one
        if (!data) {
          const { data: newPoints, error: insertError } = await supabase
            .from('user_points')
            .insert({ user_id: user.id, points: 0, total_earned: 0 })
            .select()
            .single();

          if (insertError) throw insertError;
          setUserPoints(newPoints);
        } else {
          setUserPoints(data);
        }
      } catch (err) {
        console.error('Error fetching user points:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, [user]);

  return { userPoints, loading };
};
