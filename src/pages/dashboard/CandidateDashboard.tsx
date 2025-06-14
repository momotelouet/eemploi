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
  Search,
  Award,
  Target,
  Briefcase
} from "lucide-react";
import CandidateProfileManager from "@/components/candidate/CandidateProfileManager";
import ApplicationsList from "@/components/applications/ApplicationsList";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPoints } from "@/hooks/useUserPoints";
import { useApplications } from "@/hooks/useApplications";
import { useJobs } from "@/hooks/useJobs";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { profile: candidateProfile } = useCandidateProfile(user?.id);
  const { userPoints } = useUserPoints();
  const { applications } = useApplications();
  const { jobs } = useJobs();

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    let completion = 30; // Base for having an account
    
    if (profile.first_name) completion += 20;
    if (profile.last_name) completion += 20;
    
    if (candidateProfile) {
      if (candidateProfile.phone) completion += 5;
      if (candidateProfile.bio) completion += 10;
      if (candidateProfile.cv_file_url) completion += 10;
      if (candidateProfile.skills && candidateProfile.skills.length > 0) completion += 5;
    }
    
    return Math.min(completion, 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const handleSearchJobs = () => {
    navigate('/emplois');
  };

  const handleCreateAlert = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La création d'alertes emploi sera bientôt disponible.",
    });
  };

  const handleUsePoints = () => {
    toast({
      title: "Boutique de récompenses",
      description: "La boutique de points sera bientôt disponible.",
    });
  };

  // Calculate stats from real data
  const stats = [
    { 
      label: "Candidatures envoyées", 
      value: applications.length.toString(), 
      icon: <Send className="w-4 h-4" />, 
      change: "+5 cette semaine",
      color: "text-blue-600"
    },
    { 
      label: "Profil complété", 
      value: `${profileCompletion}%`, 
      icon: <User className="w-4 h-4" />, 
      change: "Continuez !",
      color: "text-green-600"
    },
    { 
      label: "Réponses reçues", 
      value: applications.filter(app => app.status !== 'pending').length.toString(), 
      icon: <Bell className="w-4 h-4" />, 
      change: "+3 nouvelles",
      color: "text-purple-600"
    },
    { 
      label: "Points de fidélité", 
      value: userPoints?.points?.toString() || "0", 
      icon: <Star className="w-4 h-4" />, 
      change: "+100 cette semaine",
      color: "text-yellow-600"
    }
  ];

  // Get job recommendations (first 3 active jobs that user hasn't applied to)
  const appliedJobIds = applications.map(app => app.job_id);
  const recommendations = jobs
    .filter(job => !appliedJobIds.includes(job.id))
    .slice(0, 3)
    .map(job => ({
      id: job.id,
      title: job.title,
      company: job.companies?.name || 'Entreprise non spécifiée',
      location: job.location || 'Non spécifié',
      salary: job.salary_min && job.salary_max 
        ? `${job.salary_min} - ${job.salary_max} MAD`
        : "Salaire à négocier"
    }));

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bonjour, {profile?.first_name || 'Candidat'}! 👋
          </h1>
          <p className="text-muted-foreground">Gérez votre carrière professionnelle en toute simplicité</p>
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

        {/* Profile Completion Alert */}
        {profileCompletion < 80 && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Target className="w-6 h-6 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">Complétez votre profil</h3>
                  <p className="text-blue-700 mb-4">
                    Un profil complet augmente vos chances d'être recruté de 70% !
                  </p>
                  <div className="flex items-center space-x-3">
                    <Progress value={profileCompletion} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-blue-900">{profileCompletion}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs Section */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="profile" className="w-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent">
                      <TabsTrigger value="profile">Mon Profil</TabsTrigger>
                      <TabsTrigger value="applications">Candidatures</TabsTrigger>
                      <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
                      <TabsTrigger value="alerts">Alertes</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="profile" className="p-6">
                    <CandidateProfileManager />
                  </TabsContent>

                  <TabsContent value="applications" className="p-6">
                    <ApplicationsList />
                  </TabsContent>

                  <TabsContent value="recommendations" className="p-6 space-y-4">
                    {recommendations.length === 0 ? (
                      <div className="text-center py-8">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium mb-2">Aucune recommandation disponible</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Complétez votre profil pour recevoir des recommandations personnalisées
                        </p>
                        <Button onClick={handleSearchJobs} className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                          <Search className="w-4 h-4 mr-2" />
                          Voir toutes les offres
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <h3 className="font-semibold text-lg">Offres recommandées pour vous</h3>
                          <p className="text-sm text-muted-foreground">Basées sur votre profil et vos compétences</p>
                        </div>
                        {recommendations.map((rec, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium">{rec.title}</h4>
                                <p className="text-sm text-muted-foreground">{rec.company} • {rec.location}</p>
                                <p className="text-sm text-eemploi-primary font-medium">{rec.salary}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Recommandé
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-eemploi-primary hover:bg-eemploi-primary/90" onClick={() => navigate(`/emplois/${rec.id}`)}>
                                Voir l'offre
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
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
                        <Bell className="w-4 h-4 mr-2" />
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
                <Button variant="outline" className="w-full" onClick={handleCreateAlert}>
                  <Bell className="w-4 h-4 mr-2" />
                  Créer une alerte emploi
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
                      <p className="text-sm">Profil consulté par <span className="font-medium">TechCorp</span></p>
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

    </div>
  );
};

export default CandidateDashboard;
