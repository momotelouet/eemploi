
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Linkedin, 
  Download, 
  FileText,
  Award,
  GraduationCap,
  Briefcase,
  Languages,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type CandidateProfile = Tables<'candidate_profiles'>;
type UserProfile = Tables<'profiles'>;
type Assessment = Tables<'candidate_assessments'>;

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  applicationId: string;
}

const CandidateDetailModal = ({ isOpen, onClose, candidateId, applicationId }: CandidateDetailModalProps) => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && candidateId && applicationId) {
      fetchCandidateData();
    }
  }, [isOpen, candidateId, applicationId]);

  const fetchCandidateData = async () => {
    setLoading(true);
    try {
      // Récupérer le profil candidat
      const { data: candidateProfile, error: profileError } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('user_id', candidateId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching candidate profile:', profileError);
      } else {
        setProfile(candidateProfile);
      }

      // Récupérer le profil utilisateur de base
      const { data: basicProfile, error: basicError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', candidateId)
        .single();

      if (basicError) {
        console.error('Error fetching basic profile:', basicError);
      } else {
        setUserProfile(basicProfile);
      }

      // Récupérer les évaluations
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('candidate_assessments')
        .select('*')
        .eq('user_id', candidateId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (assessmentError) {
        console.error('Error fetching assessments:', assessmentError);
      } else {
        setAssessments(assessmentData || []);
      }

      // Récupérer les détails de la candidature
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (applicationError) {
        console.error('Error fetching application:', applicationError);
      } else {
        setApplication(applicationData);
      }
    } catch (error) {
      console.error('Error fetching candidate data:', error);
      toast.error('Erreur lors du chargement des données du candidat');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = async () => {
    if (!profile?.cv_file_url) {
      toast.error('Aucun CV disponible');
      return;
    }

    try {
      const response = await fetch(profile.cv_file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = profile.cv_file_name || 'CV_candidat.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('CV téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Erreur lors du téléchargement du CV');
    }
  };

  const handleDownloadCertificate = async (certificateUrl: string) => {
    try {
      const response = await fetch(certificateUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificat_evaluation.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Certificat téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Erreur lors du téléchargement du certificat');
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <p>Chargement des données du candidat...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const fullName = userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : 'Candidat';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Profil détaillé du candidat</span>
            <div className="flex space-x-2">
              {profile?.cv_file_url && (
                <Button onClick={handleDownloadCV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger CV
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête du profil */}
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.profile_picture_url || undefined} />
              <AvatarFallback>
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{fullName}</h2>
              {profile?.bio && (
                <p className="text-muted-foreground mt-2">{profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                {profile?.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {profile.phone}
                  </div>
                )}
                {(profile?.city || profile?.country) && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contenu principal avec onglets */}
          <Tabs defaultValue="application" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="application">Candidature</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="assessments">Évaluations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="application" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Détails de la candidature
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Date de candidature :</p>
                    <p className="text-muted-foreground">
                      {application?.applied_at ? new Date(application.applied_at).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                    </p>
                  </div>
                  
                  {application?.cover_letter && (
                    <div>
                      <p className="font-medium mb-2">Lettre de motivation :</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">{application.cover_letter}</p>
                      </div>
                    </div>
                  )}
                  
                  {application?.cv_url && (
                    <div>
                      <p className="font-medium mb-2">CV joint à la candidature :</p>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(application.cv_url, '_blank')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Voir le CV
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expérience */}
                {profile?.experience_years && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Expérience
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{profile.experience_years} ans d'expérience</p>
                    </CardContent>
                  </Card>
                )}

                {/* Formation */}
                {profile?.education && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <GraduationCap className="w-5 h-5 mr-2" />
                        Formation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{profile.education}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Compétences */}
              {profile?.skills && profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Compétences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Langues */}
              {profile?.languages && profile.languages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Languages className="w-5 h-5 mr-2" />
                      Langues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Liens */}
              <Card>
                <CardHeader>
                  <CardTitle>Liens professionnels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {profile?.linkedin_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {profile?.portfolio_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Portfolio
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessments" className="space-y-4">
              {assessments.length > 0 ? (
                assessments.map((assessment, index) => (
                  <Card key={assessment.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Award className="w-5 h-5 mr-2" />
                          Évaluation #{index + 1}
                        </span>
                        {assessment.certificate_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadCertificate(assessment.certificate_url!)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Certificat
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{assessment.total_score}</p>
                          <p className="text-sm text-muted-foreground">Score total</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-semibold text-green-600">
                            {assessment.personality_score?.score || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Personnalité</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-semibold text-purple-600">
                            {assessment.skills_score?.score || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Compétences</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-semibold text-orange-600">
                            {assessment.qualities_score?.score || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Qualités</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-4 h-4 mr-1" />
                        Complétée le {new Date(assessment.completed_at!).toLocaleDateString('fr-FR')}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Aucune évaluation complétée</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CV */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      CV
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.cv_file_url ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {profile.cv_file_name || 'CV disponible'}
                        </p>
                        <Button onClick={handleDownloadCV} variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Aucun CV disponible</p>
                    )}
                  </CardContent>
                </Card>

                {/* Certificats d'évaluation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Certificats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessments.some(a => a.certificate_url) ? (
                      <div className="space-y-2">
                        {assessments
                          .filter(a => a.certificate_url)
                          .map((assessment, index) => (
                            <Button 
                              key={assessment.id}
                              onClick={() => handleDownloadCertificate(assessment.certificate_url!)}
                              variant="outline" 
                              size="sm"
                              className="w-full justify-start"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Certificat #{index + 1}
                            </Button>
                          ))
                        }
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Aucun certificat disponible</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailModal;
