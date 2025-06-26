import React from 'react';

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

const App: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');
  const [userIsPremium] = React.useState<boolean>(false); // Change to true for testing

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Choisissez votre Template CV</h2>
          <p className="mt-2 text-lg text-gray-600">
            Sélectionnez un design qui correspond à votre secteur d’activité.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
                selectedTemplate === template.id ? 'ring-2 ring-indigo-500' : ''
              } ${template.isPremium && !userIsPremium ? 'opacity-80' : ''}`}
              onClick={() => {
                if (!template.isPremium || userIsPremium) {
                  setSelectedTemplate(template.id);
                }
              }}
            >
              {/* Preview Area */}
              <div className={`h-48 w-full ${template.color} flex items-center justify-center relative group`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity bg-black"></div>
                <span className="text-white font-semibold z-10 pointer-events-none">Aperçu</span>

                {/* Premium Badge */}
                {template.isPremium && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}

                {/* Selected Checkmark */}
                {selectedTemplate === template.id && (
                  <div className="absolute bottom-2 left-2 bg-indigo-600 text-white p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-800">{template.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {template.style}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                <button
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    selectedTemplate === template.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${template.isPremium && !userIsPremium ? 'cursor-not-allowed opacity-70' : ''}`}
                  disabled={template.isPremium && !userIsPremium}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!template.isPremium || userIsPremium) {
                      setSelectedTemplate(template.id);
                    }
                  }}
                >
                  {selectedTemplate === template.id
                    ? 'Sélectionné'
                    : template.isPremium && !userIsPremium
                    ? 'Premium requis'
                    : 'Choisir ce template'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA */}
        {!userIsPremium && (
          <div className="rounded-xl bg-gradient-to-r from-yellow-100 via-amber-50 to-orange-100 border border-yellow-200 p-6 text-center shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Débloquez tous les templates</h3>
            <p className="text-gray-600 mb-4">Accédez aux templates premium et créez un CV qui se démarque.</p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-medium px-6 py-2 rounded-md transition-colors">
              Passer à Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
