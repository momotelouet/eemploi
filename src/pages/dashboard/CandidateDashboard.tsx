
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Briefcase, User, Star, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import ProfessionalProfileManager from '@/components/cv/ProfessionalProfileManager';
import ImprovedCandidateProfileManager from '@/components/candidate/ImprovedCandidateProfileManager';
import ApplicationsList from '@/components/applications/ApplicationsList';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête du dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bonjour {profile?.first_name || user?.email?.split('@')[0]} ! 👋
          </h1>
          <p className="text-muted-foreground">
            Gérez votre profil professionnel et vos candidatures depuis votre tableau de bord
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
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">12</p>
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
                  <p className="text-2xl font-bold">4</p>
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
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="cv" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
              <span>Mes Candidatures</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cv" className="mt-6">
            <ProfessionalProfileManager />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ImprovedCandidateProfileManager />
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <ApplicationsList />
          </TabsContent>
        </Tabs>

        {/* Actions rapides */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <FileText className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium">Créer un nouveau CV</h4>
                <p className="text-sm text-muted-foreground">Utilisez nos templates modernes</p>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <Briefcase className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="font-medium">Rechercher des emplois</h4>
                <p className="text-sm text-muted-foreground">Trouvez votre prochain défi</p>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-medium">Simuler un entretien</h4>
                <p className="text-sm text-muted-foreground">Préparez-vous efficacement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateDashboard;
