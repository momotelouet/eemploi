
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Edit, Eye, Palette } from 'lucide-react';
import { useCVPDF } from '@/hooks/useCVPDF';
import { useCVData } from '@/hooks/useCVData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CVEditor from './CVEditor';
import CVPreview from './CVPreview';
import CVTemplates, { CVTemplate } from './CVTemplates';
import TemplatePreview from './TemplatePreview';
import { useState } from 'react';

const CVManager = () => {
  const { generatePDF } = useCVPDF();
  const { cvData, saveCVData, loading: cvLoading } = useCVData();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);

  const handleGeneratePDF = () => {
    if (!user) {
      toast({
        title: 'Erreur d\'authentification',
        description: 'Vous devez être connecté pour générer votre CV.',
        variant: 'destructive'
      });
      return;
    }

    if (!cvData) {
      toast({
        title: 'Données manquantes',
        description: 'Veuillez d\'abord remplir votre CV avant de le générer.',
        variant: 'destructive'
      });
      return;
    }

    try {
      generatePDF(cvData);
      toast({
        title: 'CV généré',
        description: 'Votre CV a été généré et téléchargé avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la génération du CV:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération du CV.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveCVData = (data: any) => {
    saveCVData(data);
    setShowEditor(false);
    toast({
      title: 'CV sauvegardé',
      description: 'Votre CV a été sauvegardé avec succès.',
    });
  };

  const handlePreviewCVData = (data: any) => {
    saveCVData(data);
    setShowEditor(false);
    setShowPreview(true);
  };

  const handleSelectTemplate = (template: CVTemplate) => {
    setSelectedTemplate(template);
    toast({
      title: 'Template sélectionné',
      description: `Le template "${template.name}" a été sélectionné.`,
    });
  };

  const isLoading = profileLoading || cvLoading;
  const isDisabled = !user || isLoading;
  const hasData = cvData && (
    cvData.personalInfo.firstName || 
    cvData.experience.length > 0 || 
    cvData.education.length > 0 || 
    cvData.skills.length > 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Gestion de mon CV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Créez et gérez votre CV professionnel. Choisissez un template, remplissez vos informations et générez une version PDF.
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={isDisabled}>
                <Palette className="w-4 h-4 mr-2" />
                Choisir un template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Templates de CV</DialogTitle>
              </DialogHeader>
              <CVTemplates
                selectedTemplate={selectedTemplate?.id || ''}
                onSelectTemplate={handleSelectTemplate}
                userIsPremium={false}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showEditor} onOpenChange={setShowEditor}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={isDisabled}>
                <Edit className="w-4 h-4 mr-2" />
                {hasData ? 'Modifier mon CV' : 'Créer mon CV'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Éditeur de CV</DialogTitle>
              </DialogHeader>
              {cvData && (
                <CVEditor
                  initialData={cvData}
                  onSave={handleSaveCVData}
                  onPreview={handlePreviewCVData}
                />
              )}
            </DialogContent>
          </Dialog>

          {hasData && (
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Prévisualiser
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Aperçu de votre CV</DialogTitle>
                </DialogHeader>
                {selectedTemplate && cvData ? (
                  <TemplatePreview data={cvData} template={selectedTemplate} />
                ) : (
                  cvData && <CVPreview data={cvData} />
                )}
              </DialogContent>
            </Dialog>
          )}
          
          <Button 
            onClick={handleGeneratePDF}
            disabled={isDisabled || !hasData}
            className="bg-eemploi-primary hover:bg-eemploi-primary/90 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {isLoading ? 'Chargement...' : 'Générer PDF'}
          </Button>
        </div>

        {selectedTemplate && (
          <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Template sélectionné:</strong> {selectedTemplate.name}
            </p>
          </div>
        )}

        {isDisabled && (
          <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
            <p className="text-sm text-yellow-800">
              {!user 
                ? 'Connectez-vous pour gérer votre CV.' 
                : 'Chargement de votre profil...'
              }
            </p>
          </div>
        )}

        {user && !hasData && !isLoading && (
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <h4 className="font-medium mb-2 text-blue-900">Commencez votre CV</h4>
            <p className="text-sm text-blue-800 mb-3">
              Choisissez d'abord un template, puis créez votre CV professionnel en remplissant vos informations personnelles, 
              votre expérience et vos compétences.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowTemplates(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Choisir un template
              </Button>
              <Button 
                onClick={() => setShowEditor(true)}
                variant="outline"
              >
                Créer directement
              </Button>
            </div>
          </div>
        )}

        {hasData && (
          <div className="p-4 border rounded-lg bg-green-50 border-green-200">
            <h4 className="font-medium mb-2 text-green-900">Votre CV est prêt ✓</h4>
            <p className="text-sm text-green-800">
              Votre CV contient vos informations. Vous pouvez choisir un template, le modifier, le prévisualiser ou le télécharger en PDF.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVManager;
