
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCVProfile, setSelectedCVProfile] = useState<string>('');

  useEffect(() => {
    if (selectedOption === 'platform' && cvProfiles.length > 0) {
      const firstCV = cvProfiles[0];
      setSelectedCVProfile(firstCV.id);
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
        alert('Format non supporté. Veuillez utiliser un fichier PDF ou Word.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Fichier trop volumineux. La taille maximale autorisée est de 5 MB.');
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

  return (
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
                              <RadioGroupItem value={profile.id} id={profile.id} />
                              <div>
                                <Label htmlFor={profile.id} className="font-medium cursor-pointer">
                                  {profile.template_name || 'CV Professionnel'}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Créé le {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {/* TODO: Implement preview */}}
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
  );
};

export default CVSelector;
