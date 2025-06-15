
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Search, Building, Bot, Users } from "lucide-react";
import CompanyManagement from "@/components/recruiter/CompanyManagement";
import ProfileSearch from "@/components/recruiter/ProfileSearch";
import JobDescriptionGenerator from "@/components/ai/JobDescriptionGenerator";
import AIChat from "@/components/ai/AIChat";
import JobsTabContent from "@/components/recruiter/hub/JobsTabContent";
import type { JobWithCompany } from "@/hooks/useRecruiterJobs";
import type { ApplicationWithJobAndProfile } from "@/hooks/useJobApplications";
import ApplicationListCard from "@/components/recruiter/ApplicationListCard";
import { useNavigate } from "react-router-dom";

interface RecruiterHubTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  jobs: JobWithCompany[];
  applications: ApplicationWithJobAndProfile[];
  onPublishOfferClick: () => void;
}

const RecruiterHubTabs = ({ activeTab, onTabChange, jobs, applications, onPublishOfferClick }: RecruiterHubTabsProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (_application: ApplicationWithJobAndProfile) => {
    navigate('/recruteur/candidatures');
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="border-b">
            <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-1">
              <TabsTrigger 
                value="jobs" 
                className="flex items-center justify-center px-4 py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Mes offres
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="flex items-center justify-center px-4 py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Candidatures ({applications.length})
              </TabsTrigger>
              <TabsTrigger 
                value="search" 
                className="flex items-center justify-center px-4 py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Search className="w-4 h-4 mr-2" />
                Rechercher des profils
              </TabsTrigger>
              <TabsTrigger 
                value="company" 
                className="flex items-center justify-center px-4 py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Building className="w-4 h-4 mr-2" />
                Mon entreprise
              </TabsTrigger>
              <TabsTrigger 
                value="ai-generator" 
                className="flex items-center justify-center px-4 py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Bot className="w-4 h-4 mr-2" />
                Générateur IA
              </TabsTrigger>
              <TabsTrigger 
                value="ai-assistant" 
                className="flex items-center justify-center px-4 py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Bot className="w-4 h-4 mr-2" />
                Assistant IA
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobs" className="p-6">
            <JobsTabContent jobs={jobs} onPublishOfferClick={onPublishOfferClick} />
          </TabsContent>

          <TabsContent value="applications" className="p-6">
            <div className="space-y-4">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <ApplicationListCard
                    key={app.id}
                    application={app}
                    onViewDetails={() => handleViewDetails(app)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune candidature reçue</h3>
                  <p className="text-muted-foreground">
                    Les candidatures pour vos offres d'emploi apparaîtront ici.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search" className="p-6">
            <ProfileSearch />
          </TabsContent>

          <TabsContent value="company" className="p-6">
            <CompanyManagement />
          </TabsContent>

          <TabsContent value="ai-generator" className="p-6">
            <JobDescriptionGenerator />
          </TabsContent>

          <TabsContent value="ai-assistant" className="p-6">
            <AIChat
              title="Assistant Recrutement IA"
              placeholder="Posez vos questions sur le recrutement, l'analyse de candidats, les stratégies RH..."
              type="candidate-analysis"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecruiterHubTabs;
