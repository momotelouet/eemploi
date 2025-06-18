import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Users, Briefcase, FileText, CreditCard } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState([
    { label: 'Utilisateurs', value: '...', icon: <Users className="w-5 h-5" />, change: '', color: 'text-blue-600' },
    { label: "Offres d'emploi", value: '...', icon: <Briefcase className="w-5 h-5" />, change: '', color: 'text-green-600' },
    { label: 'Candidatures', value: '...', icon: <FileText className="w-5 h-5" />, change: '', color: 'text-yellow-600' },
    { label: 'Paiements', value: '...', icon: <CreditCard className="w-5 h-5" />, change: '', color: 'text-purple-600' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      // Utilisateurs
      const { count: usersCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      // Offres
      const { count: jobsCount } = await supabase.from('jobs').select('id', { count: 'exact', head: true });
      // Candidatures
      const { count: applicationsCount } = await supabase.from('applications').select('id', { count: 'exact', head: true });
      // Paiements
      const { count: paymentsCount } = await supabase.from('payments').select('id', { count: 'exact', head: true });

      setStats([
        { label: 'Utilisateurs', value: usersCount?.toLocaleString() ?? '0', icon: <Users className="w-5 h-5" />, change: '', color: 'text-blue-600' },
        { label: "Offres d'emploi", value: jobsCount?.toLocaleString() ?? '0', icon: <Briefcase className="w-5 h-5" />, change: '', color: 'text-green-600' },
        { label: 'Candidatures', value: applicationsCount?.toLocaleString() ?? '0', icon: <FileText className="w-5 h-5" />, change: '', color: 'text-yellow-600' },
        { label: 'Paiements', value: paymentsCount?.toLocaleString() ?? '0', icon: <CreditCard className="w-5 h-5" />, change: '', color: 'text-purple-600' },
      ]);
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={stat.color}>{stat.icon}</div>
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* TODO: Ajouter les graphiques, logs récents, etc. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Croissance des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Graphique de croissance (à implémenter) */}
            <div className="h-48 flex items-center justify-center text-muted-foreground">[Graphique]</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tendances des offres</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Graphique des offres (à implémenter) */}
            <div className="h-48 flex items-center justify-center text-muted-foreground">[Graphique]</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dernières notifications / logs</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Liste des logs récents (à implémenter) */}
          <div className="space-y-2 text-muted-foreground">[Logs récents]</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
