
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Search,
  Download,
  Mail
} from "lucide-react";
import { useJobApplications } from "@/hooks/useJobApplications";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ApplicationsManager = () => {
  const { applications, loading } = useJobApplications();
  const { toast } = useToast();

  // Calculer les statistiques
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  const stats = [
    { 
      label: "Total candidatures", 
      value: applications.length.toString(), 
      icon: <Users className="w-4 h-4" />, 
      change: "+5 cette semaine",
      color: "text-blue-600"
    },
    { 
      label: "En attente", 
      value: pendingApplications.length.toString(), 
      icon: <Clock className="w-4 h-4" />, 
      change: "À traiter",
      color: "text-yellow-600"
    },
    { 
      label: "Acceptées", 
      value: acceptedApplications.length.toString(), 
      icon: <CheckCircle className="w-4 h-4" />, 
      change: "+2 ce mois",
      color: "text-green-600"
    },
    { 
      label: "Refusées", 
      value: rejectedApplications.length.toString(), 
      icon: <XCircle className="w-4 h-4" />, 
      change: "+1 ce mois",
      color: "text-red-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Acceptée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Refusée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCandidateName = (application: any) => {
    if (application.candidate_profiles?.profiles) {
      const profile = application.candidate_profiles.profiles;
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Candidat anonyme';
    }
    return `Candidat #${application.candidate_id.slice(0, 8)}`;
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: 'Statut mis à jour',
        description: `La candidature a été ${newStatus === 'accepted' ? 'acceptée' : 'refusée'}`,
      });

      // Recharger la page pour actualiser les données
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut de la candidature',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-eemploi-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Chargement des candidatures...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des candidatures</h1>
            <p className="text-muted-foreground">
              Suivez et gérez toutes les candidatures reçues
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
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
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-4 bg-transparent">
                  <TabsTrigger value="all">Toutes ({applications.length})</TabsTrigger>
                  <TabsTrigger value="pending">En attente ({pendingApplications.length})</TabsTrigger>
                  <TabsTrigger value="accepted">Acceptées ({acceptedApplications.length})</TabsTrigger>
                  <TabsTrigger value="rejected">Refusées ({rejectedApplications.length})</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Toutes les candidatures</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Search className="w-4 h-4 mr-2" />
                        Rechercher
                      </Button>
                    </div>
                  </div>
                  
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucune candidature reçue</h3>
                      <p className="text-muted-foreground">
                        Les candidatures pour vos offres d'emploi apparaîtront ici.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <Card key={application.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold">{getCandidateName(application)}</h4>
                                  {getStatusBadge(application.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  <strong>Offre :</strong> {application.jobs?.title || 'Offre supprimée'}
                                </p>
                                <p className="text-sm text-muted-foreground mb-1">
                                  <strong>Entreprise :</strong> {application.jobs?.companies?.name || 'Non spécifiée'}
                                </p>
                                <p className="text-sm text-muted-foreground mb-2">
                                  <strong>Candidature :</strong> {new Date(application.applied_at).toLocaleDateString('fr-FR')}
                                </p>
                                {application.cover_letter && (
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-2">
                                    <strong>Lettre de motivation :</strong><br />
                                    {application.cover_letter.substring(0, 150)}...
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Voir
                                </Button>
                                {application.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-green-600 hover:text-green-700"
                                      onClick={() => updateApplicationStatus(application.id, 'accepted')}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Accepter
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Refuser
                                    </Button>
                                  </>
                                )}
                                <Button variant="outline" size="sm">
                                  <Mail className="w-4 h-4 mr-2" />
                                  Contacter
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Candidatures en attente</h3>
                  {pendingApplications.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune candidature en attente</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingApplications.map((application) => (
                        <Card key={application.id} className="border-yellow-200">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{getCandidateName(application)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {application.jobs?.title || 'Offre supprimée'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(application.applied_at).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => updateApplicationStatus(application.id, 'accepted')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Accepter
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600"
                                  onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Refuser
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="accepted" className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Candidatures acceptées</h3>
                  {acceptedApplications.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune candidature acceptée</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {acceptedApplications.map((application) => (
                        <Card key={application.id} className="border-green-200">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{getCandidateName(application)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {application.jobs?.title || 'Offre supprimée'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Acceptée le {new Date(application.updated_at).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Mail className="w-4 h-4 mr-2" />
                                Contacter
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rejected" className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Candidatures refusées</h3>
                  {rejectedApplications.length === 0 ? (
                    <div className="text-center py-8">
                      <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune candidature refusée</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rejectedApplications.map((application) => (
                        <Card key={application.id} className="border-red-200">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{getCandidateName(application)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {application.jobs?.title || 'Offre supprimée'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Refusée le {new Date(application.updated_at).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Voir
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationsManager;
