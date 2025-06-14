
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Eye, Download, Trash2, Palette } from 'lucide-react';
import { useCVProfiles } from '@/hooks/useCVProfiles';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import CVEditor from './CVEditor';
import CVTemplates, { CVTemplate } from './CVTemplates';
import TemplatePreview from './TemplatePreview';
import { useCVPDF } from '@/hooks/useCVPDF';

const ProfessionalProfileManager = () => {
  const { profiles, loading, saveProfile, deleteProfile } = useCVProfiles();
  const { generatePDF } = useCVPDF();
  const { toast } = useToast();
  
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);

  const templates = [
    { id: 'modern-blue', name: 'Professionnel Moderne', color: 'bg-blue-500', style: 'modern' as const },
    { id: 'classic-elegant', name: 'Classique Élégant', color: 'bg-gray-700', style: 'classic' as const },
    { id: 'creative-orange', name: 'Créatif Dynamique', color: 'bg-orange-500', style: 'creative' as const },
    { id: 'minimal-green', name: 'Minimaliste Vert', color: 'bg-green-500', style: 'minimal' as const }
  ];

  const getTemplateById = (templateId: string) => {
    return templates.find(t => t.id === templateId) || templates[0];
  };

  const handleCreateNew = (template: CVTemplate) => {
    const newProfile = {
      template_id: template.id,
      personal_info: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        professionalTitle: '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: []
    };
    
    setSelectedProfile(newProfile);
    setSelectedTemplate(template);
    setShowTemplates(false);
    setShowEditor(true);
  };

  const handleEdit = (profile: any) => {
    setSelectedProfile(profile);
    setSelectedTemplate(getTemplateById(profile.template_id));
    setShowEditor(true);
  };

  const handlePreview = (profile: any) => {
    setSelectedProfile(profile);
    setSelectedTemplate(getTemplateById(profile.template_id));
    setShowPreview(true);
  };

  const handleSave = async (data: any) => {
    try {
      const profileData = {
        ...selectedProfile,
        ...data
      };
      
      await saveProfile(profileData);
      setShowEditor(false);
      toast({
        title: 'Profil sauvegardé',
        description: 'Votre profil professionnel a été sauvegardé avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Impossible de sauvegarder le profil. Veuillez réessayer.',
        variant: 'destructive'
      });
    }
  };

  const handleGeneratePDF = (profile: any) => {
    try {
      generatePDF(profile);
      toast({
        title: 'CV généré',
        description: 'Votre CV a été téléchargé avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le CV.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (profileId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
      try {
        await deleteProfile(profileId);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer le profil.',
          variant: 'destructive'
        });
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement de vos profils...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Mes Profils Professionnels
            <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un nouveau profil
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Choisissez un template pour votre CV</DialogTitle>
                </DialogHeader>
                <CVTemplates
                  selectedTemplate=""
                  onSelectTemplate={handleCreateNew}
                  userIsPremium={false}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <Palette className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun profil créé</h3>
              <p className="text-muted-foreground mb-6">
                Créez votre premier profil professionnel avec nos templates modernes
              </p>
              <Button onClick={() => setShowTemplates(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer mon premier profil
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => {
                const template = getTemplateById(profile.template_id);
                return (
                  <Card key={profile.id} className="overflow-hidden">
                    <div className={`h-32 ${template.color} relative`}>
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="text-white text-center">
                          <h4 className="font-bold text-lg">
                            {profile.personal_info?.firstName} {profile.personal_info?.lastName}
                          </h4>
                          <p className="text-sm opacity-90">
                            {profile.personal_info?.professionalTitle || 'Profil professionnel'}
                          </p>
                        </div>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-white/20 text-white">
                        {template.name}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-muted-foreground">
                          {profile.experience?.length || 0} expérience(s) • {profile.education?.length || 0} formation(s)
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Modifié le {new Date(profile.updated_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(profile)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(profile)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Voir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGeneratePDF(profile)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(profile.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProfile?.id ? 'Modifier le profil' : 'Créer un nouveau profil'}
            </DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <CVEditor
              initialData={selectedProfile}
              onSave={handleSave}
              onPreview={(data) => {
                setSelectedProfile({ ...selectedProfile, ...data });
                setShowEditor(false);
                setShowPreview(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu de votre CV</DialogTitle>
          </DialogHeader>
          {selectedProfile && selectedTemplate && (
            <TemplatePreview data={selectedProfile} template={selectedTemplate} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalProfileManager;
