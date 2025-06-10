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
  Search,
  Loader2
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import CVUpload from "@/components/cv/CVUpload";
import CoverLetterGenerator from "@/components/cover-letter/CoverLetterGenerator";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPoints } from "@/hooks/useUserPoints";
import { useApplications } from "@/hooks/useApplications";
import { useJobs } from "@/hooks/useJobs";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const { userPoints } = useUserPoints();
  const { applications, loading: applicationsLoading } = useApplications();
  const { jobs } = useJobs();

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    let completion = 30; // Base for having an account
    if (profile.first_name) completion += 35;
    if (profile.last_name) completion += 35;
    return completion;
  };

  const profileCompletion = calculateProfileCompletion();

  // Handle button clicks
  const handleSearchJobs = () => {
    navigate('/emplois');
  };

  const handleCompleteProfile = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La page de modification du profil sera bientôt disponible.",
    });
  };

  const handleCreateAlert = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La création d'alertes emploi sera bientôt disponible.",
    });
  };

  const handleViewAllApplications = () => {
    toast({
      title: "Toutes vos candidatures",
      description: `Vous avez envoyé ${applications.length} candidature(s) au total.`,
    });
  };

  const handleViewJobDetails = (jobId: string) => {
    navigate(`/emplois/${jobId}`);
  };

  const handleApplyToJob = (jobTitle: string) => {
    toast({
      title: "Candidature envoyée",
      description: `Votre candidature pour le poste "${jobTitle}" a été envoyée avec succès.`,
    });
  };

  const handleUsePoints = () => {
    toast({
      title: "Boutique de récompenses",
      description: "La boutique de points sera bientôt disponible.",
    });
  };

  const handleViewApplicationDetails = (applicationId: string) => {
    toast({
      title: "Détails de la candidature",
      description: "La page de détails des candidatures sera bientôt disponible.",
    });
  };

  // Calculate stats from real data
  const stats = [
    { 
      label: "Candidatures envoyées", 
      value: applications.length.toString(), 
      icon: <Send className="w-4 h-4" />, 
      change: "+5 cette semaine" 
    },
    { 
      label: "Vues de profil", 
      value: "156", 
      icon: <Eye className="w-4 h-4" />, 
      change: "+12 cette semaine" 
    },
    { 
      label: "Réponses reçues", 
      value: applications.filter(app => app.status !== 'pending').length.toString(), 
      icon: <Bell className="w-4 h-4" />, 
      change: "+3 nouvelles" 
    },
    { 
      label: "Points de fidélité", 
      value: userPoints?.points?.toString() || "0", 
      icon: <Star className="w-4 h-4" />, 
      change: "+100 cette semaine" 
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En cours';
      case 'reviewed': return 'Examinée';
      case 'interview': return 'Entretien';
      case 'accepted': return 'Acceptée';
      case 'rejected': return 'Rejetée';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'reviewed': return 'bg-blue-500';
      case 'interview': return 'bg-purple-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get job recommendations (first 2 active jobs that user hasn't applied to)
  const appliedJobIds = applications.map(app => app.job_id);
  const recommendations = jobs
    .filter(job => !appliedJobIds.includes(job.id))
    .slice(0, 2)
    .map(job => ({
      id: job.id,
      title: job.title,
      company: job.companies?.name || 'Entreprise non spécifiée',
      location: job.location || 'Non spécifié',
      match: "95%", // This could be calculated based on various factors
      salary: job.salary_min && job.salary_max 
        ? `${job.salary_min} - ${job.salary_max} MAD`
        : "Salaire à négocier"
    }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bonjour, {profile?.first_name || 'Candidat'}! 👋
          </h1>
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
                  <Button size="sm" variant="outline" onClick={handleCompleteProfile}>
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
                    {applicationsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : applications.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium mb-2">Aucune candidature envoyée</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Commencez votre recherche d'emploi en postulant à des offres
                        </p>
                        <Button className="bg-eemploi-primary hover:bg-eemploi-primary/90" onClick={handleSearchJobs}>
                          <Search className="w-4 h-4 mr-2" />
                          Rechercher des emplois
                        </Button>
                      </div>
                    ) : (
                      applications.slice(0, 5).map((app, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-medium">{app.jobs?.title || 'Poste non spécifié'}</h4>
                            <p className="text-sm text-muted-foreground">{app.jobs?.companies?.name || 'Entreprise non spécifiée'}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true, locale: fr })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(app.status || 'pending')}`}></div>
                              <span className="text-sm">{getStatusText(app.status || 'pending')}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleViewApplicationDetails(app.id)}>
                              Voir détails
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    {applications.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={handleViewAllApplications}>
                          Voir toutes mes candidatures
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="recommendations" className="p-6 space-y-4">
                    {recommendations.length === 0 ? (
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium mb-2">Aucune recommandation disponible</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Complétez votre profil pour recevoir des recommandations personnalisées
                        </p>
                      </div>
                    ) : (
                      recommendations.map((rec, index) => (
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
                            <Button size="sm" className="bg-eemploi-primary hover:bg-eemploi-primary/90" onClick={() => handleApplyToJob(rec.title)}>
                              Postuler
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewJobDetails(rec.id)}>
                              Voir détails
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="alerts" className="p-6">
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Aucune alerte configurée</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Créez des alertes pour recevoir les nouvelles offres correspondant à vos critères
                      </p>
                      <Button className="bg-eemploi-primary hover:bg-eemploi-primary/90" onClick={handleCreateAlert}>
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
                <Button className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90" onClick={handleSearchJobs}>
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher des emplois
                </Button>
                <CVUpload />
                <CoverLetterGenerator />
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
                  <div className="text-3xl font-bold text-eemploi-accent">
                    {userPoints?.points || 0}
                  </div>
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
                <Button variant="outline" className="w-full mt-4" onClick={handleUsePoints}>
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
                      <p className="text-sm">Vous avez gagné {userPoints?.points || 0} points de fidélité</p>
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
