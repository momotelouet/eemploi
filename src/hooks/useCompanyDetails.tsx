import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export const useCompanyDetails = (id: string | undefined) => {
  const [company, setCompany] = useState<Tables<'companies'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setCompany(null);
        } else {
          setCompany(data);
        }
        setLoading(false);
      });
  }, [id]);

  return { company, loading, error };
};
