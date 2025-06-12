
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus,
  Users,
  Building,
  FileText,
  Search,
  BarChart3
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import JobForm from "@/components/jobs/JobForm";
import ProfileSearch from "@/components/recruiter/ProfileSearch";
import CompanyManagement from "@/components/recruiter/CompanyManagement";
import CreateJobModal from "@/components/recruiter/CreateJobModal";

const RecruiterHub = () => {
  const [activeTab, setActiveTab] = useState("create-job");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleJobCreated = () => {
    // Rafraîchir les données ou rediriger vers la liste des offres
    setActiveTab("jobs");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Hub Recruteur 🚀
            </h1>
            <p className="text-muted-foreground">
              Gérez vos recrutements et trouvez les meilleurs talents
            </p>
          </div>
          <Button 
            size="lg" 
            onClick={() => setShowCreateModal(true)}
            className="bg-eemploi-primary hover:bg-eemploi-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une offre
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("create-job")}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-eemploi-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-eemploi-primary" />
              </div>
              <h3 className="font-medium mb-1">Créer une offre</h3>
              <p className="text-sm text-muted-foreground">Publier un nouveau poste</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("search")}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Rechercher profils</h3>
              <p className="text-sm text-muted-foreground">Trouver des candidats</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("company")}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-1">Mon entreprise</h3>
              <p className="text-sm text-muted-foreground">Gérer les informations</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("analytics")}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Analytics</h3>
              <p className="text-sm text-muted-foreground">Voir les statistiques</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-4 bg-transparent">
                  <TabsTrigger value="create-job" className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Créer une offre
                  </TabsTrigger>
                  <TabsTrigger value="search" className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Recherche profils
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Mon entreprise
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="create-job" className="p-6">
                <JobForm />
              </TabsContent>

              <TabsContent value="search" className="p-6">
                <ProfileSearch />
              </TabsContent>

              <TabsContent value="company" className="p-6">
                <CompanyManagement />
              </TabsContent>

              <TabsContent value="analytics" className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Analytics détaillées</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Fonctionnalité en cours de développement
                  </p>
                  <Button variant="outline">
                    En savoir plus
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Footer />

      <CreateJobModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};

export default RecruiterHub;
