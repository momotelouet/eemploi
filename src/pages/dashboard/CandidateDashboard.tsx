
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  FileText, 
  Bell, 
  Star, 
  TrendingUp, 
  Eye,
  Send,
  Calendar,
  Award,
  Settings,
  Upload,
  Search
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const CandidateDashboard = () => {
  const [profileCompletion] = useState(75);

  // Mock data
  const stats = [
    { label: "Candidatures envoyées", value: "23", icon: <Send className="w-4 h-4" />, change: "+5 cette semaine" },
    { label: "Vues de profil", value: "156", icon: <Eye className="w-4 h-4" />, change: "+12 cette semaine" },
    { label: "Réponses reçues", value: "8", icon: <Bell className="w-4 h-4" />, change: "+3 nouvelles" },
    { label: "Points de fidélité", value: "1,250", icon: <Star className="w-4 h-4" />, change: "+100 cette semaine" }
  ];

  const recentApplications = [
    {
      job: "Développeur Full Stack",
      company: "TechCorp Maroc",
      date: "Il y a 2 jours",
      status: "En cours",
      statusColor: "bg-yellow-500"
    },
    {
      job: "UX Designer",
      company: "Creative Agency", 
      date: "Il y a 1 semaine",
      status: "Acceptée",
      statusColor: "bg-green-500"
    },
    {
      job: "Chef de Projet",
      company: "Innovation Labs",
      date: "Il y a 2 semaines", 
      status: "Rejetée",
      statusColor: "bg-red-500"
    }
  ];

  const recommendations = [
    {
      title: "Développeur Frontend React",
      company: "WebAgency",
      location: "Casablanca",
      match: "95%",
      salary: "25,000 - 35,000 MAD"
    },
    {
      title: "Designer UX/UI",
      company: "StartupTech",
      location: "Rabat", 
      match: "88%",
      salary: "22,000 - 30,000 MAD"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bonjour, Ahmed! 👋</h1>
          <p className="text-muted-foreground">Voici un aperçu de votre activité récente</p>
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
            
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-eemploi-primary" />
                  Complétion du profil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Progression</span>
                    <span className="text-sm font-medium">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    Complétez votre profil pour augmenter vos chances d'être recruté
                  </div>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Compléter mon profil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="applications" className="w-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-3 bg-transparent">
                      <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
                      <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
                      <TabsTrigger value="alerts">Alertes emploi</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="applications" className="p-6 space-y-4">
                    {recentApplications.map((app, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium">{app.job}</h4>
                          <p className="text-sm text-muted-foreground">{app.company}</p>
                          <p className="text-xs text-muted-foreground">{app.date}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${app.statusColor}`}></div>
                            <span className="text-sm">{app.status}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Button variant="outline">
                        Voir toutes mes candidatures
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="p-6 space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.company} • {rec.location}</p>
                            <p className="text-sm text-eemploi-primary font-medium">{rec.salary}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {rec.match} match
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                            Postuler
                          </Button>
                          <Button variant="outline" size="sm">
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="alerts" className="p-6">
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Aucune alerte configurée</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Créez des alertes pour recevoir les nouvelles offres correspondant à vos critères
                      </p>
                      <Button className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                        <Search className="w-4 h-4 mr-2" />
                        Créer une alerte
                      </Button>
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
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher des emplois
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Mettre à jour mon CV
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer une lettre de motivation
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
                  <div className="text-3xl font-bold text-eemploi-accent">1,250</div>
                  <div className="text-sm text-muted-foreground">Points disponibles</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Mise en avant profil</span>
                    <span className="font-medium">500 pts</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyse CV par IA</span>
                    <span className="font-medium">200 pts</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Lettre motivation premium</span>
                    <span className="font-medium">300 pts</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Award className="w-4 h-4 mr-2" />
                  Utiliser mes points
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Votre profil a été consulté par <span className="font-medium">TechCorp</span></p>
                      <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Nouvelle offre correspondant à vos critères</p>
                      <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Vous avez gagné 50 points de fidélité</p>
                      <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
                    </div>
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

export default CandidateDashboard;
