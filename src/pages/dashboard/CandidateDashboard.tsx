import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/hooks/useApplications';
import { useCVProfiles } from '@/hooks/useCVProfiles';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfessionalProfileManager from '@/components/cv/ProfessionalProfileManager';
import DetailedCandidateProfileManager from '@/components/candidate/DetailedCandidateProfileManager';
import ApplicationsList from '@/components/applications/ApplicationsList';
import CVOptimizer from '@/components/ai/CVOptimizer';
import AIChat from '@/components/ai/AIChat';
import JobSearchAI from '@/components/ai/JobSearchAI';
import AssessmentResults from '@/components/assessment/AssessmentResults';
import CandidateDashboardHeader from './CandidateDashboardHeader';
import CandidateQuickStats from './CandidateQuickStats';
import CandidateQuickActions from './CandidateQuickActions';
import CandidateDialogs from './CandidateDialogs';
import CandidateLayout from '@/components/candidate/CandidateLayout';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();
  const { applications, loading: applicationsLoading } = useApplications();
  const { profiles: cvProfiles, loading: cvLoading } = useCVProfiles();
  const { profile: candidateProfile, loading: candidateLoading } = useCandidateProfile(user?.id);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const activeTab = searchParams.get('tab') || 'cv';
  const [showCreateCV, setShowCreateCV] = useState(false);
  const [showInterviewSimulator, setShowInterviewSimulator] = useState(false);
  const [showAssessmentTest, setShowAssessmentTest] = useState(false);

  useEffect(() => {
    if (location.state?.openCreateCVModal) {
      setShowCreateCV(true);
      // Clear location state to prevent modal from re-opening on refresh
      const { state, ...rest } = location;
      navigate(rest, { replace: true });
    }
    // Ouvre le popup du test de personnalité si le paramètre est présent
    if (searchParams.get('openPersonalityTest') === '1') {
      setShowAssessmentTest(true);
    }
    if (searchParams.get('openInterviewSimulator') === '1') {
      setShowInterviewSimulator(true);
    }
  }, [location, navigate, searchParams]);

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
    <CandidateLayout>
      <div className="w-full">
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
        {/* Affichage du contenu selon l'onglet actif */}
        {activeTab === 'cv' && (
          <div className="mt-6"><ProfessionalProfileManager /></div>
        )}
        {activeTab === 'profile' && (
          <div className="mt-6"><DetailedCandidateProfileManager /></div>
        )}
        {activeTab === 'applications' && (
          <div className="mt-6"><ApplicationsList /></div>
        )}
        {activeTab === 'assessment' && (
          <div className="mt-6"><AssessmentResults onStartNewAssessment={handleStartAssessment} /></div>
        )}
        {activeTab === 'job-search' && (
          <div className="mt-6"><JobSearchAI /></div>
        )}
        {activeTab === 'ai-optimizer' && (
          <div className="mt-6"><CVOptimizer /></div>
        )}
        {activeTab === 'ai-assistant' && (
          <div className="mt-6">
            <AIChat
              title="Assistant Carrière IA"
              placeholder="Posez vos questions sur votre carrière, recherche d'emploi, préparation d'entretien..."
              type="interview-prep"
            />
          </div>
        )}
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
    </CandidateLayout>
  );
};

export default CandidateDashboard;
