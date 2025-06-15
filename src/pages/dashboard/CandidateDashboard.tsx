import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Briefcase, User, Star, TrendingUp, Calendar, MapPin, Bot, Search, Award } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/hooks/useApplications';
import { useCVProfiles } from '@/hooks/useCVProfiles';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfessionalProfileManager from '@/components/cv/ProfessionalProfileManager';
import CandidateProfileManager from '@/components/candidate/CandidateProfileManager';
import ApplicationsList from '@/components/applications/ApplicationsList';
import CVOptimizer from '@/components/ai/CVOptimizer';
import AIChat from '@/components/ai/AIChat';
import InterviewAI from '@/components/ai/InterviewAI';
import JobSearchAI from '@/components/ai/JobSearchAI';
import AssessmentTest from '@/components/assessment/AssessmentTest';
import AssessmentResults from '@/components/assessment/AssessmentResults';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();
  const { applications, loading: applicationsLoading } = useApplications();
  const { profiles: cvProfiles, loading: cvLoading } = useCVProfiles();
  const { profile: candidateProfile, loading: candidateLoading } = useCandidateProfile(user?.id);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'cv';
  const [showCreateCV, setShowCreateCV] = useState(false);
  const [showInterviewSimulator, setShowInterviewSimulator] = useState(false);
  const [showAssessmentTest, setShowAssessmentTest] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleCreateCV = () => {
    setShowCreateCV(true);
  };

  const handleSearchJobs = () => {
    navigate('/emplois');
  };

  const handleInterviewSimulation = () => {
    setShowInterviewSimulator(true);
  };

  const handleStartAssessment = () => {
    setShowAssessmentTest(true);
  };

  // Calculate profile completion percentage based on candidate profile
  const calculateProfileCompletion = () => {
    if (!candidateProfile) return 0;
    
    // Cast to any to access newly added columns
    const profileData = candidateProfile as any;

    const profileFields = [
      // Informations personnelles de base
      profileData.phone,
      profileData.address,
      profileData.city,
      profileData.country,
      
      // Profil professionnel
      profileData.professional_summary,
      profileData.bio,
      
      // Structured data
      profileData.experience && profileData.experience.length > 0 ? 'experience' : null,
      profileData.education_structured && profileData.education_structured.length > 0 ? 'education' : null,
      profileData.certifications && profileData.certifications.length > 0 ? 'certifications' : null,
      profileData.projects && profileData.projects.length > 0 ? 'projects' : null,

      // Existing fields
      profileData.experience_years,
      profileData.skills && profileData.skills.length > 0 ? 'skills' : null,
      profileData.languages && profileData.languages.length > 0 ? 'languages' : null,
      profileData.education,
      
      // Liens professionnels
      profileData.linkedin_url,
      profileData.portfolio_url,
      
      // Photo de profil
      profileData.profile_picture_url,
      
      // CV
      profileData.cv_file_url
    ];

    // Informations de base du profil utilisateur
    const basicFields = [
      profile?.first_name,
      profile?.last_name
    ];

    const allFields = [...profileFields, ...basicFields];
    const completedFields = allFields.filter(field => {
      if (!field) return false;
      if (Array.isArray(field)) return field.length > 0;
      return field !== '';
    }).length;
    
    return Math.round((completedFields / allFields.length) * 100);
  };

  // Count interviews (applications with status 'interview' or similar)
  const interviewCount = applications.filter(app => 
    app.status === 'interview' || app.status === 'interview_scheduled'
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête du dashboard */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Bonjour {profile?.first_name || user?.email?.split('@')[0]} ! 👋
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gérez votre profil professionnel et vos candidatures avec l'aide de l'IA
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                <div className="ml-2 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">CV Créés</p>
                  <p className="text-lg md:text-2xl font-bold">
                    {cvLoading ? '...' : cvProfiles.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                <div className="ml-2 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Candidatures</p>
                  <p className="text-lg md:text-2xl font-bold">
                    {applicationsLoading ? '...' : applications.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                <div className="ml-2 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Entretiens</p>
                  <p className="text-lg md:text-2xl font-bold">
                    {applicationsLoading ? '...' : interviewCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
                <div className="ml-2 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Profil Complété</p>
                  <p className="text-lg md:text-2xl font-bold">
                    {candidateLoading ? '...' : `${calculateProfileCompletion()}%`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className={`w-full ${isMobile ? 'grid-cols-2 h-auto flex-wrap' : 'grid-cols-7'} grid gap-1`}>
            <TabsTrigger value="cv" className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2' : 'space-x-2'}`}>
              <FileText className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : ''}>Mes CV</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2' : 'space-x-2'}`}>
              <User className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : ''}>Mon Profil</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2' : 'space-x-2'}`}>
              <Briefcase className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : ''}>Candidatures</span>
            </TabsTrigger>
            <TabsTrigger value="assessment" className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2' : 'space-x-2'}`}>
              <Award className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : ''}>Évaluation</span>
            </TabsTrigger>
            <TabsTrigger value="job-search" className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2' : 'space-x-2'}`}>
              <Search className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : ''}>Recherche IA</span>
            </TabsTrigger>
            <TabsTrigger value="ai-optimizer" className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2' : 'space-x-2'}`}>
              <Bot className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : ''}>Optimiseur IA</span>
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2' : 'space-x-2'}`}>
              <Bot className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : ''}>Assistant IA</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cv" className="mt-6">
            <ProfessionalProfileManager />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <CandidateProfileManager />
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <ApplicationsList />
          </TabsContent>

          <TabsContent value="assessment" className="mt-6">
            <div className="space-y-6">
              <AssessmentResults />
              
              <Card>
                <CardHeader>
                  <CardTitle>Nouveau Test d'Évaluation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Passez un test complet de personnalité et compétences pour obtenir votre certificat professionnel
                    </p>
                    <div 
                      className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={handleStartAssessment}
                    >
                      <Award className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
                      <h4 className="font-medium">Commencer une nouvelle évaluation</h4>
                      <p className="text-sm text-muted-foreground">Durée: 5-10 minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="job-search" className="mt-6">
            <JobSearchAI />
          </TabsContent>

          <TabsContent value="ai-optimizer" className="mt-6">
            <CVOptimizer />
          </TabsContent>

          <TabsContent value="ai-assistant" className="mt-6">
            <AIChat
              title="Assistant Carrière IA"
              placeholder="Posez vos questions sur votre carrière, recherche d'emploi, préparation d'entretien..."
              type="interview-prep"
            />
          </TabsContent>
        </Tabs>

        {/* Actions rapides */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-4 gap-4'}`}>
              <div 
                className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors text-center"
                onClick={handleCreateCV}
              >
                <FileText className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
                <h4 className="font-medium text-sm md:text-base">Créer un nouveau CV</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Utilisez nos templates modernes</p>
              </div>
              
              <div 
                className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors text-center"
                onClick={handleSearchJobs}
              >
                <Briefcase className="w-6 h-6 text-green-600 mb-2 mx-auto" />
                <h4 className="font-medium text-sm md:text-base">Rechercher des emplois</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Trouvez votre prochain défi</p>
              </div>
              
              <div 
                className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors text-center"
                onClick={handleInterviewSimulation}
              >
                <Calendar className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
                <h4 className="font-medium text-sm md:text-base">Simuler un entretien</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Préparez-vous efficacement</p>
              </div>

              <div 
                className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors text-center"
                onClick={handleStartAssessment}
              >
                <Award className="w-6 h-6 text-yellow-600 mb-2 mx-auto" />
                <h4 className="font-medium text-sm md:text-base">Test de personnalité</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Obtenez votre certificat</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialog pour créer un CV */}
        <Dialog open={showCreateCV} onOpenChange={setShowCreateCV}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau CV</DialogTitle>
            </DialogHeader>
            <ProfessionalProfileManager />
          </DialogContent>
        </Dialog>

        {/* Dialog pour simuler un entretien */}
        <Dialog open={showInterviewSimulator} onOpenChange={setShowInterviewSimulator}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Simulateur d'entretien IA</DialogTitle>
            </DialogHeader>
            <InterviewAI 
              jobTitle="Poste généraliste"
              candidateProfile={profile ? `${profile.first_name} ${profile.last_name}` : 'Candidat'}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog pour le test d'évaluation */}
        <Dialog open={showAssessmentTest} onOpenChange={setShowAssessmentTest}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Test de Personnalité et Compétences</DialogTitle>
            </DialogHeader>
            <AssessmentTest 
              onComplete={() => {
                setShowAssessmentTest(false);
                window.location.reload(); // Recharger pour voir les nouveaux résultats
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CandidateDashboard;
