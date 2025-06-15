
import CreateJobModal from "@/components/recruiter/CreateJobModal";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRecruiterJobs } from "@/hooks/useRecruiterJobs";
import { useJobApplications } from "@/hooks/useJobApplications";
import { useAuth } from "@/contexts/AuthContext";
import { useRecruiterProfile } from "@/hooks/useRecruiterProfile";
import RecruiterHubHeader from "@/components/recruiter/hub/RecruiterHubHeader";
import QuickActions from "@/components/recruiter/hub/QuickActions";
import QuickStats from "@/components/recruiter/hub/QuickStats";
import RecruiterHubTabs from "@/components/recruiter/hub/RecruiterHubTabs";

const RecruiterHub = () => {
  const location = useLocation();
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  const { user } = useAuth();
  const { jobs } = useRecruiterJobs();
  const { applications } = useJobApplications();
  const { profile } = useRecruiterProfile(user?.id ?? null);

  const openCreateJobModal = () => setIsCreateJobModalOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <RecruiterHubHeader onPublishOfferClick={openCreateJobModal} />
        
        <QuickActions 
          onPublishOfferClick={openCreateJobModal}
          onTabChange={setActiveTab}
        />

        <QuickStats 
          jobCount={jobs.length}
          applicationCount={applications.length}
          companyProfileCount={profile ? 1 : 0}
        />
        
        <RecruiterHubTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          jobs={jobs}
          applications={applications}
          onPublishOfferClick={openCreateJobModal}
        />
      </div>

      <CreateJobModal 
        open={isCreateJobModalOpen}
        onOpenChange={setIsCreateJobModalOpen}
      />
    </div>
  );
};

export default RecruiterHub;
