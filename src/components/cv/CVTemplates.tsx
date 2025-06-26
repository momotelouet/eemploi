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
  { id: 'modern-blue', name: 'Professionnel Moderne', description: 'Design épuré avec des accents bleus, parfait pour les métiers du tech', preview: '/api/placeholder/300/400', color: 'bg-blue-500', style: 'modern' },
  { id: 'classic-elegant', name: 'Classique Élégant', description: 'Template traditionnel et raffiné, idéal pour tous secteurs', preview: '/api/placeholder/300/400', color: 'bg-gray-700', style: 'classic' },
  { id: 'creative-orange', name: 'Créatif Dynamique', description: 'Design coloré et original pour les métiers créatifs', preview: '/api/placeholder/300/400', color: 'bg-orange-500', style: 'creative' },
  { id: 'minimal-green', name: 'Minimaliste Vert', description: 'Design épuré et moderne avec des touches vertes', preview: '/api/placeholder/300/400', color: 'bg-green-500', style: 'minimal' },
  { id: 'executive-dark', name: 'Exécutif Sombre', description: 'Design premium pour les postes de direction', preview: '/api/placeholder/300/400', color: 'bg-slate-800', style: 'modern', isPremium: true },
  { id: 'modern-purple', name: 'Moderne Violet', description: 'Template contemporain avec des accents violets', preview: '/api/placeholder/300/400', color: 'bg-purple-500', style: 'modern' },
  { id: 'clean-teal', name: 'Clean Turquoise', description: 'Design propre et professionnel en turquoise', preview: '/api/placeholder/300/400', color: 'bg-teal-500', style: 'minimal' },
  { id: 'artistic-red', name: 'Artistique Rouge', description: 'Template créatif pour les profils artistiques', preview: '/api/placeholder/300/400', color: 'bg-red-500', style: 'creative', isPremium: true },
  { id: 'corporate-navy', name: 'Corporate Marine', description: 'Design corporate classique en bleu marine', preview: '/api/placeholder/300/400', color: 'bg-blue-900', style: 'classic' },
  { id: 'modern-gradient', name: 'Gradient Moderne', description: 'Design tendance avec des dégradés colorés', preview: '/api/placeholder/300/400', color: 'bg-gradient-to-r from-pink-500 to-violet-500', style: 'creative', isPremium: true }
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
    <div className="min-h-screen py-10 px-2 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Choisissez votre template CV</h2>
          <p className="text-lg text-gray-600">
            Sélectionnez un design qui correspond à votre secteur d'activité.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {templates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            const isLocked = template.isPremium && !userIsPremium;

            return (
              <Card
                key={template.id}
                className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2
                  ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-400' : 'border-transparent'}
                  ${isLocked ? 'opacity-75 pointer-events-none' : ''}
                `}
                onClick={() => {
                  if (!isLocked) onSelectTemplate(template);
                }}
              >
                <CardContent className="p-0">
                  {/* Preview Area */}
                  <div className={`h-48 w-full ${template.color} flex items-center justify-center relative group rounded-t-xl`}>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                    {/* Minimalist mockup */}
                    <div className="absolute inset-0 p-4 text-white pointer-events-none select-none">
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
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 font-semibold">
                        Premium
                      </Badge>
                    )}

                    {/* Selected check */}
                    {isSelected && (
                      <div className="absolute bottom-2 left-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">{template.name}</h3>
                      <Badge variant="outline" className="text-xs capitalize">
                        {template.style}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                    <Button
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors
                        ${isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        ${isLocked ? 'cursor-not-allowed opacity-70' : ''}
                      `}
                      disabled={isLocked}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLocked) onSelectTemplate(template);
                      }}
                    >
                      {isLocked
                        ? 'Premium requis'
                        : isSelected
                          ? 'Sélectionné'
                          : 'Choisir ce template'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Premium CTA */}
        {!userIsPremium && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Débloquez tous les templates</h3>
              <p className="text-gray-600 mb-4">
                Accédez aux templates premium et créez un CV qui se démarque.
              </p>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-medium px-6 py-2 rounded-md transition-colors">
                Passer à Premium
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CVTemplates;
