
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  color: string;
  style: 'modern' | 'classic' | 'creative' | 'minimal';
  isPremium?: boolean;
}

const templates: CVTemplate[] = [
  {
    id: 'modern-blue',
    name: 'Professionnel Moderne',
    description: 'Design épuré avec des accents bleus, parfait pour les métiers du tech',
    preview: '/api/placeholder/300/400',
    color: 'bg-blue-500',
    style: 'modern'
  },
  {
    id: 'classic-elegant',
    name: 'Classique Élégant',
    description: 'Template traditionnel et raffiné, idéal pour tous secteurs',
    preview: '/api/placeholder/300/400',
    color: 'bg-gray-700',
    style: 'classic'
  },
  {
    id: 'creative-orange',
    name: 'Créatif Dynamique',
    description: 'Design coloré et original pour les métiers créatifs',
    preview: '/api/placeholder/300/400',
    color: 'bg-orange-500',
    style: 'creative'
  },
  {
    id: 'minimal-green',
    name: 'Minimaliste Vert',
    description: 'Design épuré et moderne avec des touches vertes',
    preview: '/api/placeholder/300/400',
    color: 'bg-green-500',
    style: 'minimal'
  },
  {
    id: 'executive-dark',
    name: 'Exécutif Sombre',
    description: 'Design premium pour les postes de direction',
    preview: '/api/placeholder/300/400',
    color: 'bg-slate-800',
    style: 'modern',
    isPremium: true
  },
  {
    id: 'modern-purple',
    name: 'Moderne Violet',
    description: 'Template contemporain avec des accents violets',
    preview: '/api/placeholder/300/400',
    color: 'bg-purple-500',
    style: 'modern'
  },
  {
    id: 'clean-teal',
    name: 'Clean Turquoise',
    description: 'Design propre et professionnel en turquoise',
    preview: '/api/placeholder/300/400',
    color: 'bg-teal-500',
    style: 'minimal'
  },
  {
    id: 'artistic-red',
    name: 'Artistique Rouge',
    description: 'Template créatif pour les profils artistiques',
    preview: '/api/placeholder/300/400',
    color: 'bg-red-500',
    style: 'creative',
    isPremium: true
  },
  {
    id: 'corporate-navy',
    name: 'Corporate Marine',
    description: 'Design corporate classique en bleu marine',
    preview: '/api/placeholder/300/400',
    color: 'bg-blue-900',
    style: 'classic'
  },
  {
    id: 'modern-gradient',
    name: 'Gradient Moderne',
    description: 'Design tendance avec des dégradés colorés',
    preview: '/api/placeholder/300/400',
    color: 'bg-gradient-to-r from-pink-500 to-violet-500',
    style: 'creative',
    isPremium: true
  }
];

interface CVTemplatesProps {
  selectedTemplate: string;
  onSelectTemplate: (template: CVTemplate) => void;
  userIsPremium?: boolean;
}

const CVTemplates: React.FC<CVTemplatesProps> = ({ 
  selectedTemplate, 
  onSelectTemplate, 
  userIsPremium = false 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choisissez votre template CV</h2>
        <p className="text-muted-foreground">
          Sélectionnez un design qui correspond à votre secteur d'activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-eemploi-primary border-eemploi-primary' 
                : 'hover:border-eemploi-primary/50'
            } ${template.isPremium && !userIsPremium ? 'opacity-75' : ''}`}
            onClick={() => {
              if (!template.isPremium || userIsPremium) {
                onSelectTemplate(template);
              }
            }}
          >
            <CardContent className="p-4">
              {/* Template Preview */}
              <div className="relative mb-4">
                <div className={`w-full h-48 rounded-lg ${template.color} flex items-center justify-center relative overflow-hidden`}>
                  {/* Simple preview mockup */}
                  <div className="absolute inset-0 p-4 text-white">
                    <div className="space-y-2">
                      <div className="h-3 bg-white/80 rounded w-3/4"></div>
                      <div className="h-2 bg-white/60 rounded w-1/2"></div>
                      <div className="mt-4 space-y-1">
                        <div className="h-1 bg-white/40 rounded w-full"></div>
                        <div className="h-1 bg-white/40 rounded w-4/5"></div>
                        <div className="h-1 bg-white/40 rounded w-3/5"></div>
                      </div>
                      <div className="mt-4 space-y-1">
                        <div className="h-2 bg-white/60 rounded w-2/3"></div>
                        <div className="h-1 bg-white/40 rounded w-full"></div>
                        <div className="h-1 bg-white/40 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Premium badge */}
                  {template.isPremium && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
                      Premium
                    </Badge>
                  )}
                  
                  {/* Selected indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 left-2 bg-eemploi-primary rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Template Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {template.style}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </div>

              {/* Action Button */}
              <Button 
                className={`w-full mt-4 ${
                  selectedTemplate === template.id 
                    ? 'bg-eemploi-primary hover:bg-eemploi-primary/90' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                disabled={template.isPremium && !userIsPremium}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!template.isPremium || userIsPremium) {
                    onSelectTemplate(template);
                  }
                }}
              >
                {template.isPremium && !userIsPremium 
                  ? 'Premium requis' 
                  : selectedTemplate === template.id 
                    ? 'Sélectionné' 
                    : 'Choisir ce template'
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Premium CTA */}
      {!userIsPremium && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Débloquez tous les templates</h3>
            <p className="text-muted-foreground mb-4">
              Accédez à tous nos templates premium et créez des CV qui se démarquent
            </p>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
              Passer à Premium
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CVTemplates;
plz improve templates design
