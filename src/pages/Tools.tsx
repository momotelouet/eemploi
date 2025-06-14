import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, PenTool, Calculator, MessageSquare, Palette, Star } from 'lucide-react';
import ProfessionalProfileManager from '@/components/cv/ProfessionalProfileManager';
import CoverLetterGenerator from '@/components/cover-letter/CoverLetterGenerator';
import SalarySimulator from '@/components/tools/SalarySimulator';
import InterviewSimulator from '@/components/tools/InterviewSimulator';

const Tools = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Outils de Carrière Professionnelle</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Accédez à tous nos outils pour booster votre recherche d'emploi et réussir votre carrière
          </p>
        </div>

        {/* Featured Tool */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white p-3 rounded-lg">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Nouveau: 10 Templates de CV</h3>
                  <p className="text-muted-foreground">
                    Créez des CV professionnels avec nos nouveaux templates modernes, créatifs et élégants
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">Nouveau</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tools Tabs */}
        <Tabs defaultValue="cv" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="cv" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Créateur de CV</span>
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="flex items-center space-x-2">
              <PenTool className="w-4 h-4" />
              <span>Lettre de motivation</span>
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Simulateur salaire</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Préparation entretien</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cv" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Créateur de CV Professionnel</h2>
              <p className="text-muted-foreground">
                Créez votre CV avec nos 10 templates modernes et téléchargez-le en PDF
              </p>
            </div>
            <ProfessionalProfileManager />
          </TabsContent>

          <TabsContent value="cover-letter" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Générateur de Lettre de Motivation</h2>
              <p className="text-muted-foreground">
                Rédigez une lettre de motivation percutante et personnalisée
              </p>
            </div>
            <CoverLetterGenerator />
          </TabsContent>

          <TabsContent value="salary" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Simulateur de Salaire</h2>
              <p className="text-muted-foreground">
                Calculez votre salaire brut/net et négociez en toute confiance
              </p>
            </div>
            <SalarySimulator />
          </TabsContent>

          <TabsContent value="interview" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Préparation d'Entretien</h2>
              <p className="text-muted-foreground">
                Préparez-vous aux questions d'entretien avec notre simulateur
              </p>
            </div>
            <InterviewSimulator />
          </TabsContent>
        </Tabs>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Templates Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Accédez à encore plus de templates exclusifs et fonctionnalités avancées
              </p>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                Découvrir Premium
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-green-600" />
                Conseils d'experts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consultez nos guides pour optimiser votre CV et lettre de motivation
              </p>
              <Button variant="outline" className="w-full">
                Voir les guides
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Besoin d'aide ? Notre équipe est là pour vous accompagner
              </p>
              <Button variant="outline" className="w-full">
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tools;
