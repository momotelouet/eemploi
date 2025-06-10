
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus,
  Users,
  Eye,
  Send,
  Calendar,
  TrendingUp,
  Building,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const RecruiterDashboard = () => {
  // Mock data
  const stats = [
    { label: "Offres actives", value: "12", icon: <FileText className="w-4 h-4" />, change: "+3 ce mois" },
    { label: "Candidatures reçues", value: "147", icon: <Send className="w-4 h-4" />, change: "+23 cette semaine" },
    { label: "Vues d'offres", value: "2,456", icon: <Eye className="w-4 h-4" />, change: "+156 cette semaine" },
    { label: "Points de fidélité", value: "850", icon: <Star className="w-4 h-4" />, change: "+75 cette semaine" }
  ];

  const activeJobs = [
    {
      title: "Développeur Full Stack",
      posted: "Il y a 3 jours",
      applications: 23,
      views: 156,
      status: "active",
      deadline: "15 Jan 2025"
    },
    {
      title: "UX Designer Senior",
      posted: "Il y a 1 semaine", 
      applications: 18,
      views: 98,
      status: "active",
      deadline: "20 Jan 2025"
    },
    {
      title: "Chef de Projet IT",
      posted: "Il y a 2 semaines",
      applications: 31,
      views: 203,
      status: "expiring",
      deadline: "Demain"
    }
  ];

  const recentApplications = [
    {
      candidate: "Youssef Benali",
      job: "Développeur Full Stack",
      date: "Il y a 2 heures",
      experience: "5 ans",
      status: "new",
      match: "95%"
    },
    {
      candidate: "Amal Tazi",
      job: "UX Designer Senior", 
      date: "Il y a 1 jour",
      experience: "3 ans", 
      status: "reviewed",
      match: "88%"
    },
    {
      candidate: "Karim Alaoui",
      job: "Chef de Projet IT",
      date: "Il y a 2 jours",
      experience: "7 ans",
      status: "interviewed", 
      match: "92%"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">Nouveau</Badge>;
      case "reviewed":
        return <Badge className="bg-yellow-100 text-yellow-800">Examiné</Badge>;
      case "interviewed":
        return <Badge className="bg-green-100 text-green-800">Entretien</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expiring":
        return <Badge className="bg-red-100 text-red-800">Expire bientôt</Badge>;
      default:
        return <Badge variant="secondary">Inconnue</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de bord recruteur 💼</h1>
            <p className="text-muted-foreground">Gérez vos offres et trouvez les meilleurs talents</p>
          </div>
          <Button size="lg" className="bg-eemploi-primary hover:bg-eemploi-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Publier une offre
          </Button>
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
                <Tabs defaultValue="jobs" className="w-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-3 bg-transparent">
                      <TabsTrigger value="jobs">Mes offres</TabsTrigger>
                      <TabsTrigger value="applications">Candidatures</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="jobs" className="p-6 space-y-4">
                    {activeJobs.map((job, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">Publié {job.posted}</p>
                          </div>
                          {getJobStatusBadge(job.status)}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{job.applications} candidats</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{job.views} vues</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Expire {job.deadline}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Voir candidatures
                          </Button>
                          <Button size="sm" variant="outline">
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline">
                            Statistiques
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Button variant="outline">
                        Voir toutes mes offres
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="applications" className="p-6 space-y-4">
                    {recentApplications.map((app, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{app.candidate}</h4>
                            <p className="text-sm text-muted-foreground">{app.job}</p>
                            <p className="text-xs text-muted-foreground">{app.date} • {app.experience} d'expérience</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-800">
                              {app.match} match
                            </Badge>
                            {getStatusBadge(app.status)}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                            Voir profil
                          </Button>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accepter
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="w-4 h-4 mr-1" />
                            Refuser
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="analytics" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Performance des offres</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Taux de candidature</span>
                              <span className="font-medium">6.2%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Temps de réponse moyen</span>
                              <span className="font-medium">2.3 jours</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Taux d'embauche</span>
                              <span className="font-medium">12%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Ce mois-ci</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Offres publiées</span>
                              <span className="font-medium">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Candidatures reçues</span>
                              <span className="font-medium">72</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Entretiens programmés</span>
                              <span className="font-medium">8</span>
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
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une offre
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Rechercher des profils
                </Button>
                <Button variant="outline" className="w-full">
                  <Building className="w-4 h-4 mr-2" />
                  Gérer mon entreprise
                </Button>
              </CardContent>
            </Card>

            {/* Points & Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Star className="w-5 h-5 mr-2 text-eemploi-accent" />
                  Points & Récompenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-eemploi-accent">850</div>
                  <div className="text-sm text-muted-foreground">Points disponibles</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Mise en avant offre</span>
                    <span className="font-medium">300 pts</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Suggestions IA profils</span>
                    <span className="font-medium">200 pts</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Analytics premium</span>
                    <span className="font-medium">400 pts</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Utiliser mes points
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Nouvelle candidature pour <span className="font-medium">Développeur Full Stack</span></p>
                      <p className="text-xs text-muted-foreground">Il y a 1 heure</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Votre offre a été consultée 23 fois aujourd'hui</p>
                      <p className="text-xs text-muted-foreground">Il y a 3 heures</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Vous avez gagné 25 points de fidélité</p>
                      <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conseils performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">💡 Astuce</p>
                    <p className="text-blue-700">Répondez rapidement aux candidatures pour améliorer votre taux d'embauche</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">📈 Opportunité</p>
                    <p className="text-green-700">Utilisez des mots-clés populaires pour augmenter la visibilité de vos offres</p>
                  </div>
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

export default RecruiterDashboard;
