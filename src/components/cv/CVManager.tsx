
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Edit } from 'lucide-react';
import { useCVPDF } from '@/hooks/useCVPDF';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

const CVManager = () => {
  const { generatePDF } = useCVPDF();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();

  const handleGeneratePDF = () => {
    if (!user) {
      toast({
        title: 'Erreur d\'authentification',
        description: 'Vous devez être connecté pour générer votre CV.',
        variant: 'destructive'
      });
      return;
    }

    if (!profile) {
      toast({
        title: 'Profil incomplet',
        description: 'Veuillez compléter votre profil avant de générer votre CV.',
        variant: 'destructive'
      });
      return;
    }

    try {
      generatePDF();
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

  const handleEditCV = () => {
    toast({
      title: 'Édition du CV',
      description: 'L\'éditeur de CV sera bientôt disponible.',
    });
  };

  const isDisabled = !user || !profile || loading;

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
            disabled={isDisabled}
            className="bg-eemploi-primary hover:bg-eemploi-primary/90 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Chargement...' : 'Générer PDF'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleEditCV}
          >
            <Edit className="w-4 h-4 mr-2" />
            Éditer CV
          </Button>
        </div>

        {isDisabled && (
          <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
            <p className="text-sm text-yellow-800">
              {!user 
                ? 'Connectez-vous pour générer votre CV.' 
                : !profile 
                  ? 'Complétez votre profil pour générer votre CV.'
                  : 'Chargement de votre profil...'
              }
            </p>
          </div>
        )}

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
