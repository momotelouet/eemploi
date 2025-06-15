
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type CompanyWithJobCount = Tables<'companies'> & {
  openJobs: number;
};

export const useCompanies = () => {
  const [companies, setCompanies] = useState<CompanyWithJobCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('company_id')
          .eq('status', 'active');
        
        if (jobsError) {
          console.error('Supabase error fetching jobs:', jobsError);
          throw jobsError;
        }

        if (!jobsData || jobsData.length === 0) {
            setCompanies([]);
            setLoading(false);
            return;
        }

        const companyJobCounts = jobsData.reduce((acc, job) => {
          if (job.company_id) {
            acc[job.company_id] = (acc[job.company_id] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        const companyIdsWithJobs = Object.keys(companyJobCounts);

        if (companyIdsWithJobs.length === 0) {
            setCompanies([]);
            setLoading(false);
            return;
        }

        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*')
          .in('id', companyIdsWithJobs);
        
        if (companiesError) {
          console.error('Supabase error fetching companies:', companiesError);
          throw companiesError;
        }

        if (companiesData) {
            const companiesWithCounts = companiesData.map(company => ({
              ...company,
              openJobs: companyJobCounts[company.id] || 0,
            }));
            setCompanies(companiesWithCounts);
        }

      } catch (err) {
        console.error('Error fetching companies:', err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading };
};
