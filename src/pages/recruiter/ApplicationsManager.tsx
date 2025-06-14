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
import { useRecruiterJobs } from "@/hooks/useRecruiterJobs";

const ApplicationsManager = () => {
  const { applications } = useJobApplications();
  const { jobs } = useRecruiterJobs();

  // Filter applications for recruiter's jobs
  const recruiterJobIds = jobs.map(job => job.id);
  const recruiterApplications = applications.filter(app => 
    recruiterJobIds.includes(app.job_id)
  );

  const pendingApplications = recruiterApplications.filter(app => app.status === 'pending');
  const acceptedApplications = recruiterApplications.filter(app => app.status === 'accepted');
  const rejectedApplications = recruiterApplications.filter(app => app.status === 'rejected');

  const stats = [
    { 
      label: "Total candidatures", 
      value: recruiterApplications.length.toString(), 
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

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Offre supprimée';
  };

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
                  <TabsTrigger value="all">Toutes ({recruiterApplications.length})</TabsTrigger>
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
                  
                  {recruiterApplications.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucune candidature reçue</h3>
                      <p className="text-muted-foreground">
                        Les candidatures pour vos offres d'emploi apparaîtront ici.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recruiterApplications.map((application) => (
                        <Card key={application.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold">Candidat #{application.id.slice(0, 8)}</h4>
                                  {getStatusBadge(application.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  <strong>Offre :</strong> {getJobTitle(application.job_id)}
                                </p>
                                <p className="text-sm text-muted-foreground mb-2">
                                  <strong>Candidature :</strong> {new Date(application.applied_at).toLocaleDateString('fr-FR')}
                                </p>
                                {application.cover_letter && (
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-2">
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
                                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Accepter
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
                                <h4 className="font-semibold">Candidat #{application.id.slice(0, 8)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {getJobTitle(application.job_id)}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Accepter
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600">
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
                                <h4 className="font-semibold">Candidat #{application.id.slice(0, 8)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {getJobTitle(application.job_id)}
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
                                <h4 className="font-semibold">Candidat #{application.id.slice(0, 8)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {getJobTitle(application.job_id)}
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
