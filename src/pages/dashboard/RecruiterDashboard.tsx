
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  Eye, 
  Plus,
  TrendingUp,
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRecruiterJobs } from '@/hooks/useRecruiterJobs';
import { useJobApplications } from '@/hooks/useJobApplications';
import { supabase } from '@/integrations/supabase/client';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const { jobs, loading: jobsLoading } = useRecruiterJobs();
  const { applications, loading: applicationsLoading } = useJobApplications();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0
  });

  useEffect(() => {
    if (!jobsLoading && !applicationsLoading) {
      const activeJobsCount = jobs.filter(job => job.status === 'active').length;
      const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
      
      setStats({
        totalJobs: jobs.length,
        activeJobs: activeJobsCount,
        totalApplications: applications.length,
        totalViews
      });
    }
  }, [jobs, applications, jobsLoading, applicationsLoading]);

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return 'Temps plein';
      case 'part-time': return 'Temps partiel';
      case 'contract': return 'Contrat';
      case 'internship': return 'Stage';
      default: return type;
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Non spécifié";
    if (min && max) return `${min} - ${max} MAD`;
    if (min) return `À partir de ${min} MAD`;
    if (max) return `Jusqu'à ${max} MAD`;
    return "Non spécifié";
  };

  const recentJobs = jobs.slice(0, 5);
  const recentApplications = applications.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord recruteur</h1>
          <p className="text-muted-foreground">
            Gérez vos offres d'emploi et candidatures
          </p>
        </div>
        <div className="flex space-x-4">
          <Button asChild>
            <Link to="/recruteur/hub">
              <Plus className="w-4 h-4 mr-2" />
              Créer une offre
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offres publiées</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeJobs} actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Toutes offres confondues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Sur toutes vos offres
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews > 0 ? Math.round((stats.totalApplications / stats.totalViews) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Candidatures / Vues
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Mes offres récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <p>Chargement...</p>
            ) : recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.companies?.name || 'Entreprise non spécifiée'}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {getJobTypeLabel(job.job_type || 'full-time')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{job.views || 0} vues</p>
                      <p>{formatSalary(job.salary_min, job.salary_max)}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" asChild className="w-full">
                  <Link to="/recruteur/hub">Voir toutes mes offres</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Aucune offre d'emploi publiée</p>
                <Button asChild>
                  <Link to="/recruteur/hub">Créer votre première offre</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Candidatures récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <p>Chargement...</p>
            ) : recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{application.jobs?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Candidature reçue le {new Date(application.applied_at).toLocaleDateString('fr-FR')}
                      </p>
                      <Badge 
                        variant={
                          application.status === 'pending' ? 'secondary' :
                          application.status === 'accepted' ? 'default' : 'destructive'
                        }
                        className="mt-2"
                      >
                        {application.status === 'pending' ? 'En attente' :
                         application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" asChild className="w-full">
                  <Link to="/recruteur/hub">Voir toutes les candidatures</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune candidature reçue</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-20 flex-col space-y-2">
              <Link to="/recruteur/hub">
                <Plus className="w-6 h-6" />
                <span>Créer une offre</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 flex-col space-y-2">
              <Link to="/recruteur/hub">
                <Users className="w-6 h-6" />
                <span>Rechercher des profils</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 flex-col space-y-2">
              <Link to="/recruteur/hub">
                <BarChart3 className="w-6 h-6" />
                <span>Gérer mon entreprise</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterDashboard;
