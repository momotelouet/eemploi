import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export const useCompanyJobs = (companyId: string | undefined) => {
  const [jobs, setJobs] = useState<Tables<'jobs'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId)
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setJobs([]);
        } else {
          setJobs(data || []);
        }
        setLoading(false);
      });
  }, [companyId]);

  return { jobs, loading, error };
};
