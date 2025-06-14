
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, TrendingUp, Users, Star } from 'lucide-react';
import AssessmentTest from '@/components/assessment/AssessmentTest';
import AssessmentResults from '@/components/assessment/AssessmentResults';

const Assessment = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Test de Personnalité et Compétences</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez votre profil professionnel complet et obtenez un certificat personnalisé 
            pour valoriser vos candidatures
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analyse Complète</h3>
              <p className="text-muted-foreground">
                Évaluation de votre personnalité, compétences et qualités professionnelles
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Certificat PDF</h3>
              <p className="text-muted-foreground">
                Obtenez un certificat officiel à joindre à vos candidatures
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Reconnu par les RH</h3>
              <p className="text-muted-foreground">
                Format apprécié par les recruteurs et équipes RH
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="test" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="test" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Passer le test</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Mes résultats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-6">
            <AssessmentTest />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <AssessmentResults />
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Pourquoi passer ce test ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="text-left">
                  <h3 className="font-semibold mb-2">✨ Pour vous</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Mieux vous connaître professionnellement</li>
                    <li>• Identifier vos forces et axes d'amélioration</li>
                    <li>• Valoriser votre profil dans vos candidatures</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-2">🎯 Pour les recruteurs</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Avoir une vision objective de votre profil</li>
                    <li>• Faciliter la prise de décision</li>
                    <li>• Gagner du temps dans le processus de recrutement</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;
