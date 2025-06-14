
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ApplicationModal from "@/components/applications/ApplicationModal";
import { 
  MapPin, 
  Clock, 
  Building, 
  User, 
  Star, 
  Share, 
  Bookmark,
  CheckCircle,
  Calendar,
  DollarSign
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useJobApplication } from "@/hooks/useJobApplication";
import type { Tables } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type JobWithCompany = Tables<'jobs'> & {
  companies?: Tables<'companies'> | null;
};

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<JobWithCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<JobWithCompany[]>([]);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { applyToJob, isApplying } = useJobApplication();

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      try {
        // Fetch the specific job
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            companies (*)
          `)
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (error) throw error;
        setJob(data);

        // Check if user has already applied
        if (user) {
          const { data: application } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', id)
            .eq('candidate_id', user.id)
            .single();
          
          setHasApplied(!!application);
        }

        // Fetch similar jobs (same company or similar industry)
        if (data) {
          const { data: similar } = await supabase
            .from('jobs')
            .select(`
              *,
              companies (*)
            `)
            .neq('id', id)
            .eq('status', 'active')
            .limit(3);

          setSimilarJobs(similar || []);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user]);

  const handleQuickApply = async () => {
    if (!job) return;
    const success = await applyToJob(job.id);
    if (success) {
      setHasApplied(true);
    }
  };

  const handleApplicationSubmit = () => {
    setHasApplied(true);
    setIsApplicationModalOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Chargement de l'offre d'emploi...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Offre d'emploi non trouvée</h1>
          <p className="text-muted-foreground">Cette offre d'emploi n'existe pas ou a été supprimée.</p>
        </div>
      </div>
    );
  }

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Salaire à négocier";
    if (min && max) return `${min} - ${max} MAD`;
    if (min) return `À partir de ${min} MAD`;
    if (max) return `Jusqu'à ${max} MAD`;
    return "Salaire à négocier";
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return 'Temps plein';
      case 'part-time': return 'Temps partiel';
      case 'contract': return 'Contrat';
      case 'internship': return 'Stage';
      default: return type;
    }
  };

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case 'entry': return 'Débutant (0-2 ans)';
      case 'mid': return 'Intermédiaire (2-5 ans)';
      case 'senior': return 'Senior (5+ ans)';
      case 'lead': return 'Lead/Manager';
      default: return level;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {job.companies?.logo_url ? (
                      <img 
                        src={job.companies.logo_url} 
                        alt={job.companies.name} 
                        className="w-full h-full object-cover rounded-xl" 
                      />
                    ) : (
                      (job.companies?.name?.[0] || 'E')
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                    <p className="text-lg text-muted-foreground">{job.companies?.name || 'Entreprise non spécifiée'}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                {job.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Building className="w-4 h-4" />
                  <span>{getJobTypeLabel(job.job_type || 'full-time')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{getExperienceLabel(job.experience_level || 'mid')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: fr })}</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description du poste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{job.description}</div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Exigences du poste</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{job.requirements}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Info */}
          {job.companies && (
            <Card>
              <CardHeader>
                <CardTitle>À propos de l'entreprise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{job.companies.name}</h3>
                    {job.companies.description && (
                      <p className="text-muted-foreground mt-2">{job.companies.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {job.companies.industry && (
                      <div>
                        <span className="font-medium">Secteur:</span>
                        <span className="ml-2 text-muted-foreground">{job.companies.industry}</span>
                      </div>
                    )}
                    {job.companies.size && (
                      <div>
                        <span className="font-medium">Taille:</span>
                        <span className="ml-2 text-muted-foreground">{job.companies.size}</span>
                      </div>
                    )}
                    {job.companies.location && (
                      <div>
                        <span className="font-medium">Localisation:</span>
                        <span className="ml-2 text-muted-foreground">{job.companies.location}</span>
                      </div>
                    )}
                    {job.companies.website && (
                      <div>
                        <span className="font-medium">Site web:</span>
                        <a 
                          href={job.companies.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-eemploi-primary hover:underline"
                        >
                          {job.companies.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Apply Card */}
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="space-y-4">
                {hasApplied ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">Candidature envoyée</p>
                    <p className="text-sm text-muted-foreground mt-1">Votre candidature a été transmise à l'entreprise</p>
                  </div>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90"
                      onClick={handleQuickApply}
                      disabled={isApplying || !user}
                    >
                      {isApplying ? 'Envoi en cours...' : 'Postuler maintenant'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      onClick={() => setIsApplicationModalOpen(true)}
                      disabled={!user}
                    >
                      Postuler avec mon CV
                    </Button>

                    {!user && (
                      <p className="text-xs text-muted-foreground text-center">
                        Vous devez être connecté pour postuler
                      </p>
                    )}
                  </>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  {job.expires_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date limite:</span>
                      <span className="font-medium">
                        {new Date(job.expires_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vues:</span>
                    <span className="font-medium">{job.views || 0} vues</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails du poste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type de contrat:</span>
                <Badge>{getJobTypeLabel(job.job_type || 'full-time')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expérience:</span>
                <span className="font-medium">{getExperienceLabel(job.experience_level || 'mid')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Salaire:</span>
                <span className="font-medium text-eemploi-primary">
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offres similaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarJobs.map((similarJob) => (
                  <div key={similarJob.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-medium text-sm">{similarJob.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {similarJob.companies?.name} • {similarJob.location}
                    </p>
                    <div className="flex items-center mt-2">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs">
                        {formatSalary(similarJob.salary_min, similarJob.salary_max)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.companies?.name || 'Entreprise non spécifiée'}
      />
    </div>
  );
};

export default JobDetails;
