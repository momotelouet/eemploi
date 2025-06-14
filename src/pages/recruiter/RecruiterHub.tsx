
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Briefcase, Building, Search, Bot } from "lucide-react";
import CreateJobModal from "@/components/recruiter/CreateJobModal";
import CompanyManagement from "@/components/recruiter/CompanyManagement";
import ProfileSearch from "@/components/recruiter/ProfileSearch";
import JobDescriptionGenerator from "@/components/ai/JobDescriptionGenerator";
import AIChat from "@/components/ai/AIChat";
import { useState } from "react";
import { useRecruiterJobs } from "@/hooks/useRecruiterJobs";

const RecruiterHub = () => {
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const { jobs } = useRecruiterJobs();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hub Recruteur</h1>
            <p className="text-muted-foreground">
              Gérez vos recrutements et trouvez les meilleurs talents
            </p>
          </div>
          <Button 
            className="bg-eemploi-primary hover:bg-eemploi-primary/90"
            onClick={() => setIsCreateJobModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Publier une offre
          </Button>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center space-y-2"
            onClick={() => setIsCreateJobModalOpen(true)}
          >
            <Plus className="w-8 h-8 text-eemploi-primary" />
            <span className="font-semibold">Publier une offre</span>
            <span className="text-sm text-muted-foreground text-center">
              Créez et publiez une nouvelle offre d'emploi
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center space-y-2"
            onClick={() => setActiveTab("search")}
          >
            <Search className="w-8 h-8 text-eemploi-primary" />
            <span className="font-semibold">Rechercher des candidats</span>
            <span className="text-sm text-muted-foreground text-center">
              Trouvez les profils qui correspondent à vos besoins
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center space-y-2"
            onClick={() => setActiveTab("company")}
          >
            <Building className="w-8 h-8 text-eemploi-primary" />
            <span className="font-semibold">Gérer mon entreprise</span>
            <span className="text-sm text-muted-foreground text-center">
              Modifiez les informations de votre entreprise
            </span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                  <p className="text-sm text-muted-foreground">Offres publiées</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Candidatures reçues</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">Profil entreprise</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-5 bg-transparent h-auto p-1">
                  <TabsTrigger 
                    value="jobs" 
                    className="flex items-center justify-center px-4 py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Mes offres
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Mes offres d'emploi</h3>
                    <Button 
                      className="bg-eemploi-primary hover:bg-eemploi-primary/90"
                      onClick={() => setIsCreateJobModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle offre
                    </Button>
                  </div>
                  
                  {jobs.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucune offre publiée</h3>
                      <p className="text-muted-foreground mb-6">
                        Commencez par publier votre première offre d'emploi pour attirer les meilleurs talents.
                      </p>
                      <Button 
                        className="bg-eemploi-primary hover:bg-eemploi-primary/90"
                        onClick={() => setIsCreateJobModalOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Publier ma première offre
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-2">{job.title}</h4>
                                <p className="text-muted-foreground mb-2">{job.location}</p>
                                <p className="text-sm text-eemploi-primary font-medium">
                                  {job.salary_min && job.salary_max 
                                    ? `${job.salary_min} - ${job.salary_max} MAD`
                                    : "Salaire à négocier"
                                  }
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  Modifier
                                </Button>
                                <Button variant="outline" size="sm">
                                  Candidatures
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
      </div>

      <CreateJobModal 
        open={isCreateJobModalOpen}
        onOpenChange={setIsCreateJobModalOpen}
      />
    </div>
  );
};

export default RecruiterHub;
