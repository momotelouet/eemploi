
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Star, Briefcase, Users, Code } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  template: string;
  isPopular?: boolean;
}

interface CoverLetterTemplatesProps {
  onSelectTemplate: (template: string) => void;
  onClose: () => void;
}

const CoverLetterTemplates = ({ onSelectTemplate, onClose }: CoverLetterTemplatesProps) => {
  const templates: Template[] = [
    {
      id: 'general',
      name: 'Template Général',
      description: 'Template polyvalent pour tous types de postes',
      category: 'Général',
      icon: <FileText className="w-5 h-5" />,
      isPopular: true,
      template: `Objet : Candidature pour le poste de {jobTitle}

Madame, Monsieur,

Je me permets de vous adresser ma candidature pour le poste de {jobTitle} au sein de {companyName}.

{personalMotivation}

Fort(e) de mon expérience en {relevantExperience}, je suis convaincu(e) que mon profil correspond parfaitement aux exigences de ce poste. Mon parcours m'a permis de développer des compétences solides et une approche méthodique qui seraient un atout pour votre équipe.

Je serais ravi(e) de pouvoir échanger avec vous lors d'un entretien pour vous présenter plus en détail ma motivation et mes compétences.

Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Cordialement,
[Votre nom]`
    },
    {
      id: 'tech',
      name: 'Template Tech/IT',
      description: 'Spécialement conçu pour les postes techniques',
      category: 'Technologie',
      icon: <Code className="w-5 h-5" />,
      template: `Objet : Candidature pour le poste de {jobTitle}

Madame, Monsieur,

Passionné(e) par les technologies et l'innovation, je souhaite rejoindre votre équipe en tant que {jobTitle} chez {companyName}.

{personalMotivation}

Mon expertise technique en {relevantExperience} m'a permis de maîtriser les dernières technologies et méthodologies de développement. Je suis particulièrement attiré(e) par les défis techniques et l'opportunité de contribuer à des projets innovants.

Mes compétences en résolution de problèmes complexes et ma capacité à travailler en équipe agile font de moi un candidat idéal pour ce poste.

Je serais ravi(e) de discuter de vos projets techniques et de la façon dont je peux contribuer à leur succès.

Cordialement,
[Votre nom]`
    },
    {
      id: 'management',
      name: 'Template Management',
      description: 'Pour les postes de management et leadership',
      category: 'Management',
      icon: <Users className="w-5 h-5" />,
      template: `Objet : Candidature pour le poste de {jobTitle}

Madame, Monsieur,

Leader expérimenté(e) et orienté(e) résultats, je suis très intéressé(e) par le poste de {jobTitle} au sein de {companyName}.

{personalMotivation}

Mon expérience en {relevantExperience} m'a permis de développer une expertise solide en management d'équipes et en gestion de projets stratégiques. J'ai notamment réussi à transformer des équipes et à atteindre des objectifs ambitieux grâce à ma capacité à fédérer et à motiver.

Ma vision stratégique et mon approche collaborative me permettent de créer un environnement de travail performant et épanouissant pour les équipes.

Je serais honoré(e) de pouvoir contribuer au développement de votre organisation et d'échanger sur vos défis managériaux.

Cordialement,
[Votre nom]`
    },
    {
      id: 'commercial',
      name: 'Template Commercial',
      description: 'Optimisé pour les postes commerciaux et vente',
      category: 'Commercial',
      icon: <Briefcase className="w-5 h-5" />,
      template: `Objet : Candidature pour le poste de {jobTitle}

Madame, Monsieur,

Commercial(e) dynamique et orienté(e) résultats, je suis très motivé(e) à l'idée de rejoindre {companyName} en tant que {jobTitle}.

{personalMotivation}

Grâce à mon expérience en {relevantExperience}, j'ai développé une approche client centrée sur la création de valeur et la construction de relations durables. Mes résultats commerciaux témoignent de ma capacité à identifier les opportunités et à concrétiser les ventes.

Mon sens de l'écoute, ma persévérance et ma capacité à négocier font de moi un atout pour votre équipe commerciale.

Je serais ravi(e) de vous présenter mes réalisations et de discuter de la façon dont je peux contribuer à vos objectifs commerciaux.

Cordialement,
[Votre nom]`
    }
  ];

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choisissez un template</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez un template adapté à votre secteur d'activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-eemploi-primary">
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {template.name}
                      {template.isPopular && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Populaire
                        </Badge>
                      )}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-3">
                {template.description}
              </p>
              <Button 
                onClick={() => onSelectTemplate(template.template)}
                className="w-full text-xs"
                size="sm"
              >
                Utiliser ce template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Retour
        </Button>
      </div>
    </div>
  );
};

export default CoverLetterTemplates;
