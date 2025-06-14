
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  Eye, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  Star,
  Building
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecruiterJobs } from "@/hooks/useRecruiterJobs";
import { useJobApplications } from "@/hooks/useJobApplications";
import CreateJobModal from "@/components/recruiter/CreateJobModal";
import { useState } from "react";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const { jobs } = useRecruiterJobs();
  const { applications } = useJobApplications();
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);

  // Calculate stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;

  const stats = [
    { 
      label: "Offres publiées", 
      value: totalJobs.toString(), 
      icon: <Briefcase className="w-4 h-4" />, 
      change: "+2 ce mois",
      color: "text-blue-600"
    },
    { 
      label: "Offres actives", 
      value: activeJobs.toString(), 
      icon: <TrendingUp className="w-4 h-4" />, 
      change: `${activeJobs}/${totalJobs} actives`,
      color: "text-green-600"
    },
    { 
      label: "Candidatures reçues", 
      value: totalApplications.toString(), 
      icon: <Users className="w-4 h-4" />, 
      change: "+15 cette semaine",
      color: "text-purple-600"
    },
    { 
      label: "En attente", 
      value: pendingApplications.toString(), 
      icon: <Eye className="w-4 h-4" />, 
      change: "À traiter",
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Tableau de bord recruteur 👋
            </h1>
            <p className="text-muted-foreground">Gérez vos offres d'emploi et candidatures</p>
          </div>
          <Button 
            className="bg-eemploi-primary hover:bg-eemploi-primary/90"
            onClick={() => setIsCreateJobModalOpen(true)}
          >
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
                <Tabs defaultValue="jobs" className="w-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-3 bg-transparent">
                      <TabsTrigger value="jobs">Mes offres</TabsTrigger>
                      <TabsTrigger value="applications">Candidatures</TabsTrigger>
                      <TabsTrigger value="analytics">Statistiques</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="jobs" className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Mes offres d'emploi</h3>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtrer
                          </Button>
                          <Button variant="outline" size="sm">
                            <Search className="w-4 h-4 mr-2" />
                            Rechercher
                          </Button>
                        </div>
                      </div>
                      
                      {jobs.length === 0 ? (
                        <div className="text-center py-8">
                          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="font-medium mb-2">Aucune offre publiée</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Commencez par publier votre première offre d'emploi
                          </p>
                          <Button 
                            className="bg-eemploi-primary hover:bg-eemploi-primary/90"
                            onClick={() => setIsCreateJobModalOpen(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Publier une offre
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {jobs.map((job) => (
                            <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-medium">{job.title}</h4>
                                  <p className="text-sm text-muted-foreground">{job.location}</p>
                                  <p className="text-sm text-eemploi-primary font-medium">
                                    {job.salary_min && job.salary_max 
                                      ? `${job.salary_min} - ${job.salary_max} MAD`
                                      : "Salaire à négocier"
                                    }
                                  </p>
                                </div>
                                <Badge 
                                  variant={job.status === 'active' ? 'default' : 'secondary'}
                                  className={job.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                                >
                                  {job.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Modifier
                                </Button>
                                <Button size="sm" variant="outline">
                                  Voir les candidatures
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="applications" className="p-6">
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Candidatures</h3>
                      <p className="text-sm text-muted-foreground">
                        Gérez les candidatures reçues pour vos offres
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics" className="p-6">
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Statistiques détaillées</h3>
                      <p className="text-sm text-muted-foreground">
                        Analysez les performances de vos offres d'emploi
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90"
                  onClick={() => setIsCreateJobModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Publier une offre
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Rechercher des candidats
                </Button>
                <Button variant="outline" className="w-full">
                  <Building className="w-4 h-4 mr-2" />
                  Gérer mon entreprise
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conseils du jour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Star className="w-4 h-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Optimisez vos offres</p>
                      <p className="text-xs text-muted-foreground">
                        Les offres avec description détaillée reçoivent 3x plus de candidatures
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Star className="w-4 h-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Répondez rapidement</p>
                      <p className="text-xs text-muted-foreground">
                        Les candidats apprécient une réponse sous 48h
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateJobModal 
        open={isCreateJobModalOpen}
        onOpenChange={setIsCreateJobModalOpen}
      />
    </div>
  );
};

export default RecruiterDashboard;
