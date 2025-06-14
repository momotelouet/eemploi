
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FileText, Wand2, Copy, Download, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CoverLetterTemplates from './CoverLetterTemplates';

interface CoverLetterForm {
  companyName: string;
  jobTitle: string;
  personalMotivation: string;
  relevantExperience: string;
}

const CoverLetterGenerator = () => {
  const { toast } = useToast();
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  const form = useForm<CoverLetterForm>({
    defaultValues: {
      companyName: '',
      jobTitle: '',
      personalMotivation: '',
      relevantExperience: ''
    }
  });

  const onSubmit = async (data: CoverLetterForm) => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let generatedContent = '';
      
      if (selectedTemplate) {
        // Use selected template
        generatedContent = selectedTemplate
          .replace(/\{jobTitle\}/g, data.jobTitle)
          .replace(/\{companyName\}/g, data.companyName)
          .replace(/\{personalMotivation\}/g, data.personalMotivation)
          .replace(/\{relevantExperience\}/g, data.relevantExperience);
      } else {
        // Use default template
        generatedContent = `Objet : Candidature pour le poste de ${data.jobTitle}

Madame, Monsieur,

Je me permets de vous adresser ma candidature pour le poste de ${data.jobTitle} au sein de ${data.companyName}.

${data.personalMotivation}

Fort(e) de mon expérience en ${data.relevantExperience}, je suis convaincu(e) que mon profil correspond parfaitement aux exigences de ce poste. Mon parcours m'a permis de développer des compétences solides et une approche méthodique qui seraient un atout pour votre équipe.

Je serais ravi(e) de pouvoir échanger avec vous lors d'un entretien pour vous présenter plus en détail ma motivation et mes compétences.

Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Cordialement,
[Votre nom]`;
      }

      setGeneratedLetter(generatedContent);
      
      toast({
        title: "Lettre générée avec succès",
        description: "Votre lettre de motivation a été créée. Vous pouvez la modifier si nécessaire.",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la génération",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
    toast({
      title: "Template sélectionné",
      description: "Le template a été appliqué. Remplissez maintenant les informations.",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copié dans le presse-papiers",
      description: "La lettre a été copiée avec succès.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lettre_motivation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargement lancé",
      description: "Votre lettre de motivation a été téléchargée.",
    });
  };

  const resetForm = () => {
    setGeneratedLetter('');
    setSelectedTemplate('');
    setShowTemplates(false);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="w-4 h-4 mr-2" />
          Générer une lettre de motivation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Générateur de lettre de motivation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {showTemplates ? (
            <CoverLetterTemplates 
              onSelectTemplate={handleTemplateSelect}
              onClose={() => setShowTemplates(false)}
            />
          ) : !generatedLetter ? (
            <div className="space-y-4">
              {/* Template selection button */}
              <div className="flex justify-center">
                <Button 
                  onClick={() => setShowTemplates(true)}
                  variant="outline"
                  className="mb-4"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  {selectedTemplate ? 'Changer de template' : 'Choisir un template'}
                </Button>
              </div>

              {selectedTemplate && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    ✓ Template sélectionné ! Remplissez maintenant vos informations.
                  </p>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'entreprise</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: TechCorp Maroc"
                            {...field}
                            rows={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intitulé du poste</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Développeur Full Stack"
                            {...field}
                            rows={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personalMotivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Votre motivation personnelle</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Expliquez pourquoi ce poste vous intéresse et ce qui vous motive..."
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="relevantExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expérience pertinente</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez brièvement votre expérience la plus pertinente pour ce poste..."
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90"
                    disabled={isGenerating}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Génération en cours...' : 'Générer la lettre'}
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Votre lettre de motivation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
              
              <div className="flex space-x-2">
                <Button onClick={handleCopy} variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copier
                </Button>
                <Button onClick={handleDownload} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                <Button 
                  onClick={resetForm} 
                  className="flex-1 bg-eemploi-primary hover:bg-eemploi-primary/90"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Nouvelle lettre
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverLetterGenerator;
