import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  users: number;
  jobs: number;
  companies: number;
  applications: number;
}

export default function ReportsManager() {
  const [stats, setStats] = useState<Stats>({ users: 0, jobs: 0, companies: 0, applications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [{ count: users }, { count: jobs }, { count: companies }, { count: applications }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ users, jobs, companies, applications });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div>Chargement des statistiques...</div>;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Statistiques globales</h3>
      <ul className="space-y-2">
        <li>Utilisateurs : <b>{stats.users}</b></li>
        <li>Offres d'emploi : <b>{stats.jobs}</b></li>
        <li>Entreprises : <b>{stats.companies}</b></li>
        <li>Candidatures : <b>{stats.applications}</b></li>
      </ul>
    </div>
  );
}
