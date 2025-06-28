import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  users: number;
  jobs: number;
  companies: number;
  applications: number;
  payments?: number; // Optionnel, ajoute si tu veux
}

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const [{ count: users }, { count: jobs }, { count: companies }, { count: applications }, { count: payments }] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('jobs').select('id', { count: 'exact', head: true }),
      supabase.from('companies').select('id', { count: 'exact', head: true }),
      supabase.from('applications').select('id', { count: 'exact', head: true }),
      supabase.from('payments').select('id', { count: 'exact', head: true }),
    ]);

    return {
      users: users ?? 0,
      jobs: jobs ?? 0,
      companies: companies ?? 0,
      applications: applications ?? 0,
      payments: payments ?? 0,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques admin:', error);
    return {
      users: 0,
      jobs: 0,
      companies: 0,
      applications: 0,
      payments: 0,
    };
  }
};
