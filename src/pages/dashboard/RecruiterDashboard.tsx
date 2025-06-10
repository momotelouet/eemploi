
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
  FileText,
  Loader2
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPoints } from "@/hooks/useUserPoints";
import { useRecruiterJobs } from "@/hooks/useRecruiterJobs";
import { useJobApplications } from "@/hooks/useJobApplications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const RecruiterDashboard = () => {
  const { profile } = useUserProfile();
  const { userPoints } = useUserPoints();
  const { jobs, loading: jobsLoading } = useRecruiterJobs();
  const { applications, loading: applicationsLoading } = useJobApplications();

  // Calculate stats from real data
  const totalApplications = applications.length;
  const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

  const stats = [
    { 
      label: "Offres actives", 
      value: jobs.filter(job => job.status === 'active').length.toString(), 
      icon: <FileText className="w-4 h-4" />, 
      change: "+3 ce mois" 
    },
    { 
      label: "Candidatures reçues", 
      value: totalApplications.toString(), 
      icon: <Send className="w-4 h-4" />, 
      change: "+23 cette semaine" 
    },
    { 
      label: "Vues d'offres", 
      value: totalViews.toString(), 
      icon: <Eye className="w-4 h-4" />, 
      change: "+156 cette semaine" 
    },
    { 
      label: "Points de fidélité", 
      value: userPoints?.points?.toString() || "0", 
      icon: <Star className="w-4 h-4" />, 
      change: "+75 cette semaine" 
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Nouveau</Badge>;
      case "reviewed":
        return <Badge className="bg-yellow-100 text-yellow-800">Examiné</Badge>;
      case "interview":
        return <Badge className="bg-green-100 text-green-800">Entretien</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepté</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">En pause</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Fermée</Badge>;
      default:
        return <Badge variant="secondary">Inconnue</Badge>;
    }
  };

  const getExpirationStatus = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 1) {
      return { text: "Expire demain", color: "bg-red-100 text-red-800" };
    } else if (diffInDays <= 7) {
      return { text: `Expire dans ${diffInDays} jours`, color: "bg-orange-100 text-orange-800" };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Tableau de bord recruteur 💼
            </h1>
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
                    {jobsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium mb-2">Aucune offre publiée</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Commencez par publier votre première offre d'emploi
                        </p>
                        <Button className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Créer une offre
                        </Button>
                      </div>
                    ) : (
                      jobs.slice(0, 5).map((job, index) => {
                        const expirationStatus = getExpirationStatus(job.expires_at);
                        const applicationCount = applications.filter(app => app.job_id === job.id).length;
                        
                        return (
                          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-lg">{job.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Publié {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: fr })}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                {getJobStatusBadge(job.status)}
                                {expirationStatus && (
                                  <Badge className={expirationStatus.color}>
                                    {expirationStatus.text}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{applicationCount} candidats</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{job.views || 0} vues</span>
                                </div>
                                {job.expires_at && (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      Expire {formatDistanceToNow(new Date(job.expires_at), { addSuffix: true, locale: fr })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Voir candidatures ({applicationCount})
                              </Button>
                              <Button size="sm" variant="outline">
                                Modifier
                              </Button>
                              <Button size="sm" variant="outline">
                                Statistiques
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {jobs.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline">
                          Voir toutes mes offres
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="applications" className="p-6 space-y-4">
                    {applicationsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : applications.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium mb-2">Aucune candidature reçue</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Publiez des offres pour commencer à recevoir des candidatures
                        </p>
                      </div>
                    ) : (
                      applications.slice(0, 5).map((app, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium">Candidat #{app.candidate_id.slice(-8)}</h4>
                              <p className="text-sm text-muted-foreground">{app.jobs.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true, locale: fr })}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">
                                95% match
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
                      ))
                    )}
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
                              <span className="font-medium">
                                {jobs.length > 0 ? (totalApplications / jobs.length * 100).toFixed(1) : 0}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Temps de réponse moyen</span>
                              <span className="font-medium">2.3 jours</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Taux d'embauche</span>
                              <span className="font-medium">
                                {totalApplications > 0 ? 
                                  (applications.filter(app => app.status === 'accepted').length / totalApplications * 100).toFixed(1) 
                                  : 0}%
                              </span>
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
                              <span className="font-medium">{jobs.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Candidatures reçues</span>
                              <span className="font-medium">{totalApplications}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Entretiens programmés</span>
                              <span className="font-medium">
                                {applications.filter(app => app.status === 'interview').length}
                              </span>
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
                  <div className="text-3xl font-bold text-eemploi-accent">
                    {userPoints?.points || 0}
                  </div>
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
                  {applications.slice(0, 3).map((app, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm">
                          Nouvelle candidature pour <span className="font-medium">{app.jobs.title}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm">Aucune activité récente</p>
                        <p className="text-xs text-muted-foreground">Publiez une offre pour commencer</p>
                      </div>
                    </div>
                  )}
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
