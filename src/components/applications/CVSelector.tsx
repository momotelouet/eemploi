import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileText, Upload, Eye } from 'lucide-react';
import { useCVProfiles } from '@/hooks/useCVProfiles';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCVPDF } from '@/hooks/useCVPDF';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CVSelectorProps {
  onCVSelect: (data: {
    type: 'platform' | 'upload' | 'profile';
    cvUrl?: string;
    cvFile?: File;
    cvProfileId?: string;
  }) => void;
  selectedOption: string;
  onOptionChange: (value: string) => void;
}

const CVSelector = ({ onCVSelect, selectedOption, onOptionChange }: CVSelectorProps) => {
  const { user } = useAuth();
  const { profiles: cvProfiles, loading: cvLoading } = useCVProfiles();
  const { profile: candidateProfile } = useCandidateProfile(user?.id);
  const { generatePDF } = useCVPDF();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCVProfile, setSelectedCVProfile] = useState<string>('');
  const [previewCV, setPreviewCV] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (selectedOption === 'platform' && cvProfiles.length > 0) {
      const firstCV = cvProfiles[0];
      setSelectedCVProfile(firstCV.id!);
      onCVSelect({
        type: 'platform',
        cvProfileId: firstCV.id
      });
    } else if (selectedOption === 'profile' && candidateProfile?.cv_file_url) {
      onCVSelect({
        type: 'profile',
        cvUrl: candidateProfile.cv_file_url
      });
    } else if (selectedOption === 'upload' && selectedFile) {
      onCVSelect({
        type: 'upload',
        cvFile: selectedFile
      });
    }
  }, [selectedOption, selectedCVProfile, selectedFile, cvProfiles, candidateProfile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format non supporté. Veuillez utiliser un fichier PDF ou Word.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Fichier trop volumineux. La taille maximale autorisée est de 5 MB.');
        return;
      }

      setSelectedFile(file);
      onCVSelect({
        type: 'upload',
        cvFile: file
      });
    }
  };

  const handleCVProfileChange = (profileId: string) => {
    setSelectedCVProfile(profileId);
    onCVSelect({
      type: 'platform',
      cvProfileId: profileId
    });
  };

  const handleGeneratePDFFromProfile = async (profileId: string) => {
    try {
      const profile = cvProfiles.find(p => p.id === profileId);
      if (!profile) {
        toast.error('CV non trouvé');
        return;
      }

      // Transform the profile data to match CVData format
      const cvData = {
        personalInfo: {
          firstName: profile.personal_info?.firstName || '',
          lastName: profile.personal_info?.lastName || '',
          email: profile.personal_info?.email || '',
          phone: profile.personal_info?.phone || '',
          address: profile.personal_info?.address || '',
          professionalTitle: profile.personal_info?.professionalTitle || '',
          summary: profile.personal_info?.summary || '',
          photoUrl: profile.personal_info?.photoUrl
        },
        experience: Array.isArray(profile.experience) ? profile.experience : [],
        education: Array.isArray(profile.education) ? profile.education : [],
        skills: Array.isArray(profile.skills) ? profile.skills : []
      };

      await generatePDF(cvData);
      toast.success('CV généré en PDF avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const handlePreviewCV = async (profileId: string) => {
    try {
      const profile = cvProfiles.find(p => p.id === profileId);
      if (profile) {
        setPreviewCV(profile);
        setIsPreviewOpen(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'aperçu du CV:', error);
      toast.error('Erreur lors de l\'aperçu du CV');
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Label className="text-base font-medium">Choisissez votre CV</Label>
        
        <RadioGroup value={selectedOption} onValueChange={onOptionChange} className="space-y-4">
          {/* CV créés sur la plateforme */}
          {cvProfiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="platform" id="platform" />
                <Label htmlFor="platform" className="flex items-center space-x-2 cursor-pointer">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Utiliser un CV créé sur la plateforme</span>
                </Label>
              </div>
              
              {selectedOption === 'platform' && (
                <Card className="ml-6">
                  <CardContent className="p-4">
                    {cvLoading ? (
                      <p className="text-sm text-muted-foreground">Chargement des CV...</p>
                    ) : (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Sélectionnez un CV :</Label>
                        <RadioGroup value={selectedCVProfile} onValueChange={handleCVProfileChange}>
                          {cvProfiles.map((profile) => (
                            <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value={profile.id!} id={profile.id!} />
                                <div>
                                  <Label htmlFor={profile.id!} className="font-medium cursor-pointer">
                                    CV Professionnel ({profile.template_id})
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    Créé le {new Date(profile.created_at!).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGeneratePDFFromProfile(profile.id!)}
                                title="Télécharger en PDF"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* CV du profil candidat */}
          {candidateProfile?.cv_file_url && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="profile" id="profile" />
                <Label htmlFor="profile" className="flex items-center space-x-2 cursor-pointer">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span>Utiliser le CV de mon profil</span>
                </Label>
              </div>
              
              {selectedOption === 'profile' && (
                <Card className="ml-6">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{candidateProfile.cv_file_name || 'Mon CV'}</p>
                        <p className="text-sm text-muted-foreground">CV actuel du profil</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(candidateProfile.cv_file_url!, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Upload nouveau CV */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upload" id="upload" />
              <Label htmlFor="upload" className="flex items-center space-x-2 cursor-pointer">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Télécharger un nouveau CV</span>
              </Label>
            </div>
            
            {selectedOption === 'upload' && (
              <Card className="ml-6">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Label htmlFor="cv-file" className="text-sm font-medium">
                      Choisir un fichier (PDF, DOC, DOCX - max 5MB)
                    </Label>
                    <Input
                      id="cv-file"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-900">
                          Fichier sélectionné : {selectedFile.name}
                        </p>
                        <p className="text-xs text-green-700">
                          Taille : {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </RadioGroup>

        {/* Message d'information si aucun CV n'est disponible */}
        {cvProfiles.length === 0 && !candidateProfile?.cv_file_url && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800">
                💡 Vous pouvez créer un CV professionnel directement sur la plateforme dans votre dashboard !
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog pour l'aperçu du CV */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du CV</DialogTitle>
          </DialogHeader>
          
          {previewCV && (
            <div className="space-y-6">
              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Nom :</p>
                      <p>{previewCV.personal_info?.firstName} {previewCV.personal_info?.lastName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Email :</p>
                      <p>{previewCV.personal_info?.email}</p>
                    </div>
                    <div>
                      <p className="font-medium">Téléphone :</p>
                      <p>{previewCV.personal_info?.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium">Titre professionnel :</p>
                      <p>{previewCV.personal_info?.professionalTitle}</p>
                    </div>
                  </div>
                  {previewCV.personal_info?.summary && (
                    <div className="mt-4">
                      <p className="font-medium">Résumé :</p>
                      <p className="text-sm text-muted-foreground">{previewCV.personal_info.summary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Expérience */}
              {previewCV.experience && previewCV.experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Expérience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {previewCV.experience.map((exp: any, index: number) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-medium">{exp.position}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <p className="text-xs text-muted-foreground">
                            {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                          </p>
                          {exp.description && (
                            <p className="text-sm mt-2">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Formation */}
              {previewCV.education && previewCV.education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Formation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {previewCV.education.map((edu: any, index: number) => (
                        <div key={index} className="border-l-2 border-green-200 pl-4">
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          <p className="text-xs text-muted-foreground">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          {edu.description && (
                            <p className="text-sm mt-2">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Compétences */}
              {previewCV.skills && previewCV.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Compétences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {previewCV.skills.map((skill: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{skill.name}</span>
                          <span className="text-sm font-medium text-blue-600">{skill.level}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CVSelector;
