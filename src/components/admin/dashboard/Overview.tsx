import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Users, Briefcase, FileText, CreditCard } from 'lucide-react';

const Overview = () => {
  // TODO: Récupérer les vraies stats via Supabase
  const stats = [
    { label: 'Utilisateurs', value: '12,456', icon: <Users className="w-5 h-5" />, change: '+245 ce mois', color: 'text-blue-600' },
    { label: "Offres d'emploi", value: '3,892', icon: <Briefcase className="w-5 h-5" />, change: '+89 cette semaine', color: 'text-green-600' },
    { label: 'Candidatures', value: '45,678', icon: <FileText className="w-5 h-5" />, change: '+1,245 cette semaine', color: 'text-yellow-600' },
    { label: 'Paiements', value: '1,234', icon: <CreditCard className="w-5 h-5" />, change: '+12 ce mois', color: 'text-purple-600' },
  ];

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
