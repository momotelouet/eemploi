
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Edit } from 'lucide-react';
import { useCVPDF } from '@/hooks/useCVPDF';
import { useToast } = '@/hooks/use-toast';

const CVManager = () => {
  const { generatePDF } = useCVPDF();
  const { toast } = useToast();

  const handleGeneratePDF = () => {
    try {
      generatePDF();
      toast({
        title: 'CV généré',
        description: 'Votre CV a été généré et téléchargé avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la génération du CV.',
        variant: 'destructive'
      });
    }
  };

  const handleEditCV = () => {
    toast({
      title: 'Édition du CV',
      description: 'L\'éditeur de CV sera bientôt disponible.',
    });
  };

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
          Créez et gérez votre CV professionnel. Générez une version PDF à jour de votre profil.
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleGeneratePDF}
            className="bg-eemploi-primary hover:bg-eemploi-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Générer PDF
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleEditCV}
          >
            <Edit className="w-4 h-4 mr-2" />
            Éditer CV
          </Button>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-2">Aperçu de votre CV</h4>
          <p className="text-sm text-muted-foreground">
            Votre CV inclut automatiquement les informations de votre profil, 
            votre expérience professionnelle et vos compétences.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVManager;
