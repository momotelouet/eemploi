
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Briefcase, User, Star, TrendingUp, Calendar, MapPin, Bot, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/hooks/useApplications';
import { useCVProfiles } from '@/hooks/useCVProfiles';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import ProfessionalProfileManager from '@/components/cv/ProfessionalProfileManager';
import AIEnhancedProfileManager from '@/components/candidate/AIEnhancedProfileManager';
import ApplicationsList from '@/components/applications/ApplicationsList';
import CVOptimizer from '@/components/ai/CVOptimizer';
import AIChat from '@/components/ai/AIChat';
import InterviewAI from '@/components/ai/InterviewAI';
import JobSearchAI from '@/components/ai/JobSearchAI';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();
  const { applications, loading: applicationsLoading } = useApplications();
  const { profiles: cvProfiles, loading: cvLoading } = useCVProfiles();
  const { profile: candidateProfile, loading: candidateLoading } = useCandidateProfile(user?.id);
  const navigate = useNavigate();
  const [showCreateCV, setShowCreateCV] = useState(false);
  const [showInterviewSimulator, setShowInterviewSimulator] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  const handleCreateCV = () => {
    setShowCreateCV(true);
  };

  const handleSearchJobs = () => {
    navigate('/emplois');
  };

  const handleInterviewSimulation = () => {
    setShowInterviewSimulator(true);
  };

  // Calculate profile completion percentage based on candidate profile
  const calculateProfileCompletion = () => {
    if (!candidateProfile) return 0;
    
    const profileFields = [
      // Informations personnelles de base
      candidateProfile.phone,
      candidateProfile.address,
      candidateProfile.city,
      candidateProfile.country,
      
      // Profil professionnel
      candidateProfile.professional_summary,
      candidateProfile.bio,
      candidateProfile.experience_years,
      
      // Compétences et formation
      candidateProfile.skills && candidateProfile.skills.length > 0 ? 'skills' : null,
      candidateProfile.languages && candidateProfile.languages.length > 0 ? 'languages' : null,
      candidateProfile.education,
      
      // Liens professionnels
      candidateProfile.linkedin_url,
      candidateProfile.portfolio_url,
      
      // Photo de profil
      candidateProfile.profile_picture_url,
      
      // CV
      candidateProfile.cv_file_url
    ];

    // Informations de base du profil utilisateur
    const basicFields = [
      profile?.first_name,
      profile?.last_name
    ];

    const allFields = [...profileFields, ...basicFields];
    const completedFields = allFields.filter(field => field && field !== '').length;
    
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
          <h1 className="text-3xl font-bold mb-2">
            Bonjour {profile?.first_name || user?.email?.split('@')[0]} ! 👋
          </h1>
          <p className="text-muted-foreground">
            Gérez votre profil professionnel et vos candidatures avec l'aide de l'IA
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">CV Créés</p>
                  <p className="text-2xl font-bold">
                    {cvLoading ? '...' : cvProfiles.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Candidatures</p>
                  <p className="text-2xl font-bold">
                    {applicationsLoading ? '...' : applications.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Entretiens</p>
                  <p className="text-2xl font-bold">
                    {applicationsLoading ? '...' : interviewCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Profil Complété</p>
                  <p className="text-2xl font-bold">
                    {candidateLoading ? '...' : `${calculateProfileCompletion()}%`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="cv" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="cv" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Mes CV</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Mon Profil</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Candidatures</span>
            </TabsTrigger>
            <TabsTrigger value="job-search" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Recherche IA</span>
            </TabsTrigger>
            <TabsTrigger value="ai-optimizer" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>Optimiseur IA</span>
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>Assistant IA</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cv" className="mt-6">
            <ProfessionalProfileManager />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <AIEnhancedProfileManager />
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <ApplicationsList />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={handleCreateCV}
              >
                <FileText className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium">Créer un nouveau CV</h4>
                <p className="text-sm text-muted-foreground">Utilisez nos templates modernes</p>
              </div>
              
              <div 
                className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={handleSearchJobs}
              >
                <Briefcase className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="font-medium">Rechercher des emplois</h4>
                <p className="text-sm text-muted-foreground">Trouvez votre prochain défi</p>
              </div>
              
              <div 
                className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={handleInterviewSimulation}
              >
                <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-medium">Simuler un entretien</h4>
                <p className="text-sm text-muted-foreground">Préparez-vous efficacement</p>
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
      </div>
    </div>
  );
};

export default CandidateDashboard;
