
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  Building,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  BarChart3,
  Settings,
  Crown
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const AdminDashboard = () => {
  // Mock data
  const stats = [
    { label: "Utilisateurs totaux", value: "52,847", icon: <Users className="w-4 h-4" />, change: "+1,234 ce mois", trend: "up" },
    { label: "Entreprises actives", value: "2,456", icon: <Building className="w-4 h-4" />, change: "+87 ce mois", trend: "up" },
    { label: "Offres publiées", value: "15,123", icon: <FileText className="w-4 h-4" />, change: "+456 cette semaine", trend: "up" },
    { label: "Taux de conversion", value: "12.5%", icon: <TrendingUp className="w-4 h-4" />, change: "+2.3% ce mois", trend: "up" }
  ];

  const pendingReviews = [
    {
      type: "Entreprise",
      name: "TechStart Innovation",
      reason: "Vérification documents",
      date: "Il y a 2 heures",
      priority: "high"
    },
    {
      type: "Offre",
      name: "Développeur Senior - Salaire non conforme",
      reason: "Salaire suspect",
      date: "Il y a 4 heures", 
      priority: "medium"
    },
    {
      type: "Utilisateur",
      name: "Signalement profil suspect",
      reason: "Activité inhabituelle",
      date: "Il y a 1 jour",
      priority: "low"
    }
  ];

  const recentActivities = [
    {
      action: "Nouvelle entreprise inscrite",
      details: "Digital Maroc Solutions",
      timestamp: "Il y a 15 minutes",
      type: "success"
    },
    {
      action: "Offre signalée",
      details: "Contenu inapproprié détecté",
      timestamp: "Il y a 1 heure",
      type: "warning"
    },
    {
      action: "Candidat vérifié",
      details: "Ahmed Benali - Profil approuvé",
      timestamp: "Il y a 2 heures",
      type: "info"
    },
    {
      action: "Maintenance système",
      details: "Mise à jour de sécurité déployée",
      timestamp: "Il y a 4 heures",
      type: "info"
    }
  ];

  const topCompanies = [
    { name: "TechCorp Maroc", jobs: 23, applications: 456, rating: 4.8 },
    { name: "Digital Agency", jobs: 18, applications: 324, rating: 4.6 },
    { name: "Innovation Labs", jobs: 15, applications: 287, rating: 4.7 },
    { name: "StartupTech", jobs: 12, applications: 198, rating: 4.5 }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Faible</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Admin</h1>
              <p className="text-muted-foreground">Vue d'ensemble de la plateforme eemploi</p>
            </div>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
            <Shield className="w-4 h-4 mr-1" />
            Super Admin
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-eemploi-primary">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs Section */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="overview" className="w-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent">
                      <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                      <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                      <TabsTrigger value="moderation">Modération</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Entreprises les plus actives</h3>
                        <div className="space-y-3">
                          {topCompanies.map((company, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {company.name[0]}
                                </div>
                                <div>
                                  <h4 className="font-medium">{company.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {company.jobs} offres • {company.applications} candidatures
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-green-100 text-green-800">
                                  ⭐ {company.rating}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  Voir détails
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="users" className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">47,821</div>
                            <div className="text-sm text-muted-foreground">Candidats</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">2,456</div>
                            <div className="text-sm text-muted-foreground">Recruteurs</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">2,570</div>
                            <div className="text-sm text-muted-foreground">Entreprises</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                          Exporter la liste
                        </Button>
                        <Button variant="outline">
                          Gérer les utilisateurs
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="moderation" className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Éléments en attente de révision</h3>
                        <Badge className="bg-red-100 text-red-800">
                          {pendingReviews.length} en attente
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {pendingReviews.map((item, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {item.type}
                                  </Badge>
                                  {getPriorityBadge(item.priority)}
                                </div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.reason}</p>
                                <p className="text-xs text-muted-foreground">{item.date}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approuver
                              </Button>
                              <Button size="sm" variant="outline">
                                <XCircle className="w-4 h-4 mr-1" />
                                Rejeter
                              </Button>
                              <Button size="sm" variant="outline">
                                Examiner
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Croissance mensuelle
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Nouveaux utilisateurs</span>
                              <span className="font-medium text-green-600">+23.5%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Offres publiées</span>
                              <span className="font-medium text-blue-600">+18.2%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Candidatures envoyées</span>
                              <span className="font-medium text-purple-600">+31.7%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Taux d'embauche</span>
                              <span className="font-medium text-orange-600">+8.9%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Performance système</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Temps de réponse API</span>
                              <span className="font-medium">127ms</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Disponibilité</span>
                              <span className="font-medium text-green-600">99.8%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Utilisateurs actifs</span>
                              <span className="font-medium">12,847</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Stockage utilisé</span>
                              <span className="font-medium">67.3%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer utilisateurs
                </Button>
                <Button variant="outline" className="w-full">
                  <Building className="w-4 h-4 mr-2" />
                  Modérer entreprises
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Réviser offres
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres système
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  État du système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Principal</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Opérationnel</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Base de données</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Opérationnel</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stockage fichiers</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-yellow-600">Lent</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Opérationnel</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
