import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, CreditCard } from 'lucide-react';
import getAdminStats from '@/services/admin/getAdminStats';

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Utilisateurs', value: '...', icon: <Users className="w-5 h-5" />, color: 'text-blue-600' },
    { label: "Offres d'emploi", value: '...', icon: <Briefcase className="w-5 h-5" />, color: 'text-green-600' },
    { label: 'Candidatures', value: '...', icon: <FileText className="w-5 h-5" />, color: 'text-yellow-600' },
    { label: 'Paiements', value: '...', icon: <CreditCard className="w-5 h-5" />, color: 'text-purple-600' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats([
          {
            label: 'Utilisateurs',
            value: data.total_users?.toLocaleString() ?? '0',
            icon: <Users className="w-5 h-5" />,
            color: 'text-blue-600',
          },
          {
            label: "Offres d'emploi",
            value: data.total_jobs?.toLocaleString() ?? '0',
            icon: <Briefcase className="w-5 h-5" />,
            color: 'text-green-600',
          },
          {
            label: 'Candidatures',
            value: data.total_applications?.toLocaleString() ?? '0',
            icon: <FileText className="w-5 h-5" />,
            color: 'text-yellow-600',
          },
          {
            label: 'Paiements',
            value: data.total_payments?.toLocaleString() ?? '0',
            icon: <CreditCard className="w-5 h-5" />,
            color: 'text-purple-600',
          },
        ]);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
      } finally {
        setLoading(false);
      }
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
                <span className="text-xs text-muted-foreground">
                  {/* Placeholder pour les changements (% ou évolution) */}
                </span>
              </div>
              <div className="text-2xl font-bold mb-2">{loading ? '...' : stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Croissance des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              [Graphique à implémenter]
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tendances des offres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              [Graphique à implémenter]
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières notifications / logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-muted-foreground">
            [Logs récents à intégrer]
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
