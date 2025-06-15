
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import JobSearchAI from '@/components/ai/JobSearchAI';
import AssessmentResults from '@/components/assessment/AssessmentResults';
import CandidateDashboardHeader from './CandidateDashboardHeader';
import CandidateQuickStats from './CandidateQuickStats';
import CandidateQuickActions from './CandidateQuickActions';
import CandidateDialogs from './CandidateDialogs';
import { Award, Bot, Briefcase, FileText, Search, Star, TrendingUp, User } from 'lucide-react';

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

  const calculateProfileCompletion = () => {
    if (!candidateProfile) return 0;
    const profileData = candidateProfile as any;
    const profileFields = [
      profileData.phone,
      profileData.address,
      profileData.city,
      profileData.country,
      profileData.professional_summary,
      profileData.bio,
      profileData.experience && profileData.experience.length > 0 ? 'experience' : null,
      profileData.education_structured && profileData.education_structured.length > 0 ? 'education' : null,
      profileData.certifications && profileData.certifications.length > 0 ? 'certifications' : null,
      profileData.projects && profileData.projects.length > 0 ? 'projects' : null,
      profileData.experience_years,
      profileData.skills && profileData.skills.length > 0 ? 'skills' : null,
      profileData.languages && profileData.languages.length > 0 ? 'languages' : null,
      profileData.education,
      profileData.linkedin_url,
      profileData.portfolio_url,
      profileData.profile_picture_url,
      profileData.cv_file_url,
    ];
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

  const interviewCount = applications.filter(app => 
    app.status === 'interview' || app.status === 'interview_scheduled'
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <CandidateDashboardHeader
          firstName={profile?.first_name}
          email={user?.email}
        />

        <CandidateQuickStats
          cvCount={cvProfiles.length}
          applicationsCount={applications.length}
          interviewCount={interviewCount}
          profileCompletion={calculateProfileCompletion()}
          loading={loading}
          applicationsLoading={applicationsLoading}
          candidateLoading={candidateLoading}
          cvLoading={cvLoading}
        />

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
              
              <div className="mt-4">
                <CandidateQuickActions
                  isMobile={isMobile}
                  onCreateCV={handleCreateCV}
                  onSearchJobs={handleSearchJobs}
                  onInterviewSimulation={handleInterviewSimulation}
                  onStartAssessment={handleStartAssessment}
                />
              </div>
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

        <CandidateQuickActions
          isMobile={isMobile}
          onCreateCV={handleCreateCV}
          onSearchJobs={handleSearchJobs}
          onInterviewSimulation={handleInterviewSimulation}
          onStartAssessment={handleStartAssessment}
        />

        <CandidateDialogs
          showCreateCV={showCreateCV}
          setShowCreateCV={setShowCreateCV}
          showInterviewSimulator={showInterviewSimulator}
          setShowInterviewSimulator={setShowInterviewSimulator}
          showAssessmentTest={showAssessmentTest}
          setShowAssessmentTest={setShowAssessmentTest}
          userProfile={profile}
          onAssessmentComplete={() => {
            setShowAssessmentTest(false);
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
};

export default CandidateDashboard;
