import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  Building, 
  TrendingUp,
  Shield,
  Settings,
  Activity,
  AlertTriangle
} from "lucide-react";
import UsersManager from '@/components/admin/UsersManager';
import JobsManager from '@/components/admin/JobsManager';
import CompaniesManager from '@/components/admin/CompaniesManager';
import ReportsManager from '@/components/admin/ReportsManager';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminLogs from '@/components/admin/AdminLogs';
import { useRef } from 'react';

const AdminDashboard = () => {
  const stats = [
    { 
      label: "Utilisateurs total", 
      value: "12,456", 
      icon: <Users className="w-4 h-4" />, 
      change: "+245 ce mois",
      color: "text-blue-600"
    },
    { 
      label: "Offres d'emploi", 
      value: "3,892", 
      icon: <Briefcase className="w-4 h-4" />, 
      change: "+89 cette semaine",
      color: "text-green-600"
    },
    { 
      label: "Entreprises", 
      value: "1,234", 
      icon: <Building className="w-4 h-4" />, 
      change: "+12 ce mois",
      color: "text-purple-600"
    },
    { 
      label: "Candidatures", 
      value: "45,678", 
      icon: <TrendingUp className="w-4 h-4" />, 
      change: "+1,245 cette semaine",
      color: "text-yellow-600"
    }
  ];

  const tabsRef = useRef<any>(null);

  // Fonction pour changer d'onglet depuis la sidebar
  const goToTab = (tab: string) => {
    const tabs = document.querySelectorAll('[role="tab"]');
    tabs.forEach((el: any) => {
      if (el.getAttribute('data-state') !== undefined && el.getAttribute('data-value') === tab) {
        el.click();
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Administration eemploi 🛡️
            </h1>
            <p className="text-muted-foreground">Tableau de bord administrateur</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alertes système
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="users" className="w-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent">
                      <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                      <TabsTrigger value="jobs">Emplois</TabsTrigger>
                      <TabsTrigger value="companies">Entreprises</TabsTrigger>
                      <TabsTrigger value="reports">Rapports</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="users" className="p-6">
                    <UsersManager />
                  </TabsContent>

                  <TabsContent value="jobs" className="p-6">
                    <JobsManager />
                  </TabsContent>

                  <TabsContent value="companies" className="p-6">
                    <CompaniesManager />
                  </TabsContent>

                  <TabsContent value="reports" className="p-6">
                    <ReportsManager />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Actions Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => goToTab('users')}>
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les utilisateurs
                </Button>
                <AdminSettings />
                <AdminLogs />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Serveur</span>
                    <Badge className="bg-green-100 text-green-800">En ligne</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Base de données</span>
                    <Badge className="bg-green-100 text-green-800">Opérationnelle</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stockage</span>
                    <Badge className="bg-yellow-100 text-yellow-800">75% utilisé</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API</span>
                    <Badge className="bg-green-100 text-green-800">Stable</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Nouvel utilisateur inscrit</p>
                      <p className="text-xs text-muted-foreground">Il y a 5 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Offre d'emploi approuvée</p>
                      <p className="text-xs text-muted-foreground">Il y a 15 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Signalement traité</p>
                      <p className="text-xs text-muted-foreground">Il y a 1 heure</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
