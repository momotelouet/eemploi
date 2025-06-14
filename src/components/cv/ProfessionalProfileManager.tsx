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
import { useIsMobile } from '@/hooks/use-mobile';

interface SimpleTemplate {
  id: string;
  name: string;
  color: string;
  style: 'modern' | 'classic' | 'creative' | 'minimal';
}

const ProfessionalProfileManager = () => {
  const { profiles, loading, saveProfile, deleteProfile } = useCVProfiles();
  const { generatePDF } = useCVPDF();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);

  const templates: SimpleTemplate[] = [
    { id: 'modern-blue', name: 'Professionnel Moderne', color: 'bg-blue-500', style: 'modern' },
    { id: 'classic-elegant', name: 'Classique Élégant', color: 'bg-gray-700', style: 'classic' },
    { id: 'creative-orange', name: 'Créatif Dynamique', color: 'bg-orange-500', style: 'creative' },
    { id: 'minimal-green', name: 'Minimaliste Vert', color: 'bg-green-500', style: 'minimal' }
  ];

  const getTemplateById = (templateId: string): SimpleTemplate => {
    return templates.find(t => t.id === templateId) || templates[0];
  };

  const convertToFullTemplate = (simpleTemplate: SimpleTemplate): CVTemplate => {
    return {
      ...simpleTemplate,
      description: `Template ${simpleTemplate.style} avec design ${simpleTemplate.name.toLowerCase()}`,
      preview: `photo-1649972904349-6e44c42644a7`,
      isPremium: false
    };
  };

  const convertProfileForPreview = (profile: any) => {
    return {
      personalInfo: profile.personal_info || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        professionalTitle: '',
        summary: '',
        photoUrl: ''
      },
      experience: profile.experience || [],
      education: profile.education || [],
      skills: profile.skills || []
    };
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
    const simpleTemplate = getTemplateById(profile.template_id);
    setSelectedTemplate(convertToFullTemplate(simpleTemplate));
    setShowEditor(true);
  };

  const handlePreview = (profile: any) => {
    setSelectedProfile(profile);
    const simpleTemplate = getTemplateById(profile.template_id);
    setSelectedTemplate(convertToFullTemplate(simpleTemplate));
    setShowPreview(true);
  };

  const handleSave = async (data: any) => {
    try {
      const profileData = {
        ...selectedProfile,
        personal_info: data.personalInfo,
        experience: data.experience,
        education: data.education,
        skills: data.skills
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
      const formattedProfile = convertProfileForPreview(profile);
      const template = getTemplateById(profile.template_id);
      const fullTemplate = convertToFullTemplate(template);
      
      generatePDF(formattedProfile, fullTemplate);
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
          <CardTitle className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
            <span className={isMobile ? 'text-lg' : ''}>Mes Profils Professionnels</span>
            <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
              <DialogTrigger asChild>
                <Button className={isMobile ? 'w-full text-sm' : ''}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isMobile ? 'Nouveau profil' : 'Créer un nouveau profil'}
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
        <CardContent className={isMobile ? 'p-3' : ''}>
          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <Palette className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto text-muted-foreground mb-4`} />
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-2`}>Aucun profil créé</h3>
              <p className={`${isMobile ? 'text-sm' : ''} text-muted-foreground mb-6`}>
                Créez votre premier profil professionnel avec nos templates modernes
              </p>
              <Button onClick={() => setShowTemplates(true)} className={isMobile ? 'text-sm' : ''}>
                <Plus className="w-4 h-4 mr-2" />
                Créer mon premier profil
              </Button>
            </div>
          ) : (
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
              {profiles.map((profile) => {
                const template = getTemplateById(profile.template_id);
                return (
                  <Card key={profile.id} className="overflow-hidden">
                    <div className={`${isMobile ? 'h-24' : 'h-32'} ${template.color} relative`}>
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="text-white text-center px-2">
                          <h4 className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                            {profile.personal_info?.firstName} {profile.personal_info?.lastName}
                          </h4>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-90`}>
                            {profile.personal_info?.professionalTitle || 'Profil professionnel'}
                          </p>
                        </div>
                      </div>
                      <Badge className={`absolute top-2 right-2 bg-white/20 text-white ${isMobile ? 'text-xs px-1 py-0' : ''}`}>
                        {isMobile ? template.name.split(' ')[0] : template.name}
                      </Badge>
                    </div>
                    <CardContent className={isMobile ? 'p-3' : 'p-4'}>
                      <div className={`space-y-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                        <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                          {profile.experience?.length || 0} expérience(s) • {profile.education?.length || 0} formation(s)
                        </div>
                        <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                          Modifié le {new Date(profile.updated_at || Date.now()).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      <div className={`flex ${isMobile ? 'flex-wrap gap-1' : 'gap-2'}`}>
                        <Button
                          variant="outline"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => handleEdit(profile)}
                          className={isMobile ? 'text-xs px-2 py-1 flex-1' : ''}
                        >
                          <Edit className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3 mr-1'}`} />
                          {!isMobile && 'Modifier'}
                        </Button>
                        <Button
                          variant="outline"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => handlePreview(profile)}
                          className={isMobile ? 'text-xs px-2 py-1 flex-1' : ''}
                        >
                          <Eye className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3 mr-1'}`} />
                          {!isMobile && 'Voir'}
                        </Button>
                        <Button
                          variant="outline"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => handleGeneratePDF(profile)}
                          className={isMobile ? 'text-xs px-2 py-1 flex-1' : ''}
                        >
                          <Download className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3 mr-1'}`} />
                          {!isMobile && 'PDF'}
                        </Button>
                        <Button
                          variant="outline"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => handleDelete(profile.id!)}
                          className={`${isMobile ? 'text-xs px-2 py-1' : ''} text-red-600 hover:text-red-700`}
                        >
                          <Trash2 className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3'}`} />
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
                const updatedProfile = {
                  ...selectedProfile,
                  personal_info: data.personalInfo,
                  experience: data.experience,
                  education: data.education,
                  skills: data.skills
                };
                setSelectedProfile(updatedProfile);
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
            <TemplatePreview 
              data={convertProfileForPreview(selectedProfile)} 
              template={selectedTemplate} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalProfileManager;
