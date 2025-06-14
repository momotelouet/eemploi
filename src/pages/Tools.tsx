
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Mail, 
  Calculator, 
  MessageCircle,
  Download,
  Edit,
  TrendingUp,
  Users
} from 'lucide-react';
import CVManager from '@/components/cv/CVManager';
import CoverLetterGenerator from '@/components/cover-letter/CoverLetterGenerator';
import SalarySimulator from '@/components/tools/SalarySimulator';
import InterviewSimulator from '@/components/tools/InterviewSimulator';

const Tools = () => {
  const [activeTab, setActiveTab] = useState('cv');

  const tools = [
    {
      id: 'cv',
      title: 'Créateur de CV',
      description: 'Créez votre CV professionnel en quelques minutes avec nos modèles',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-500',
      component: <CVManager />
    },
    {
      id: 'cover-letter',
      title: 'Lettre de motivation',
      description: 'Rédigez une lettre de motivation percutante et personnalisée',
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-green-500',
      component: <CoverLetterGenerator />
    },
    {
      id: 'salary',
      title: 'Simulateur de salaire',
      description: 'Calculez votre salaire brut/net et négociez en toute confiance',
      icon: <Calculator className="w-6 h-6" />,
      color: 'bg-purple-500',
      component: <SalarySimulator />
    },
    {
      id: 'interview',
      title: 'Préparation entretien',
      description: 'Préparez-vous aux questions d\'entretien avec notre simulateur',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-orange-500',
      component: <InterviewSimulator />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Outils Carrière</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos outils gratuits pour booster votre recherche d'emploi 
            et développer votre carrière professionnelle
          </p>
        </div>

        {/* Tools Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tools.map((tool) => (
            <Card 
              key={tool.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                activeTab === tool.id ? 'ring-2 ring-eemploi-primary' : ''
              }`}
              onClick={() => setActiveTab(tool.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`${tool.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  {tool.icon}
                </div>
                <h3 className="font-semibold mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {tools.map((tool) => (
              <TabsTrigger key={tool.id} value={tool.id} className="flex items-center space-x-2">
                <span className="hidden sm:inline">{tool.icon}</span>
                <span className="text-xs sm:text-sm">{tool.title.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tools.map((tool) => (
            <TabsContent key={tool.id} value={tool.id} className="space-y-6">
              <div className="text-center mb-8">
                <div className={`${tool.color} text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4`}>
                  {tool.icon}
                </div>
                <h2 className="text-3xl font-bold mb-2">{tool.title}</h2>
                <p className="text-lg text-muted-foreground">{tool.description}</p>
              </div>
              
              {tool.component}
            </TabsContent>
          ))}
        </Tabs>

        {/* Success Stats */}
        <div className="mt-16 bg-eemploi-primary/5 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Nos outils vous aident à réussir</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-eemploi-primary mb-2">85%</div>
              <p className="text-muted-foreground">des utilisateurs trouvent un emploi dans les 3 mois</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-eemploi-primary mb-2">2x</div>
              <p className="text-muted-foreground">plus de réponses positives avec nos CV</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-eemploi-primary mb-2">50+</div>
              <p className="text-muted-foreground">modèles et outils disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
