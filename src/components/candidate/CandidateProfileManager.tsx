
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  Plus,
  X,
  Save,
  Upload,
  FileText,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CandidateProfileManager = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useCandidateProfile(user?.id);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || '',
    linkedin_url: profile?.linkedin_url || '',
    portfolio_url: profile?.portfolio_url || '',
    bio: profile?.bio || '',
    experience_years: profile?.experience_years || 0,
    education: profile?.education || '',
    skills: profile?.skills || [],
    languages: profile?.languages || []
  });

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: 'Profil mis à jour',
        description: 'Votre profil a été sauvegardé avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le profil.',
        variant: 'destructive'
      });
    }
  };

  const handleCVUpload = async () => {
    if (!cvFile || !user) return;

    setUploading(true);
    try {
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${user.id}/cv.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(fileName, cvFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(fileName);

      await updateProfile({
        cv_file_url: publicUrl,
        cv_file_name: cvFile.name
      });

      toast({
        title: 'CV uploadé',
        description: 'Votre CV a été uploadé avec succès.',
      });

      setCvFile(null);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader le CV.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement du profil...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-eemploi-primary" />
              Mon Profil Professionnel
            </CardTitle>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-eemploi-primary hover:bg-eemploi-primary/90"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              ) : (
                'Modifier'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations de contact */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Informations de contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Paris"
                />
              </div>
              <div>
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="France"
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="123 rue de la Paix"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Liens professionnels */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Liens professionnels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="https://monportfolio.com"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Bio et expérience */}
          <div>
            <h3 className="font-semibold mb-3">Présentation</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio professionnelle</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Décrivez votre parcours et vos objectifs professionnels..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Années d'expérience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="education">Formation</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Master en Informatique, École..."
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CV et Compétences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gestion du CV */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-eemploi-primary" />
              Mon CV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.cv_file_url ? (
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-900">CV actuel</p>
                    <p className="text-sm text-green-700">{profile.cv_file_name}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(profile.cv_file_url!, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <p className="text-blue-900 font-medium">Aucun CV uploadé</p>
                <p className="text-sm text-blue-700">Uploadez votre CV pour améliorer votre profil</p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <Label htmlFor="cv-file">Nouveau CV (PDF, DOC, DOCX)</Label>
                <Input
                  id="cv-file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                />
              </div>
              {cvFile && (
                <Button
                  onClick={handleCVUpload}
                  disabled={uploading}
                  className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Upload en cours...' : 'Uploader CV'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Compétences et Langues */}
        <Card>
          <CardHeader>
            <CardTitle>Compétences & Langues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compétences */}
            <div>
              <Label className="text-base font-medium">Compétences</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    {isEditing && (
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeSkill(index)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Nouvelle compétence"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Langues */}
            <div>
              <Label className="text-base font-medium">Langues</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {formData.languages.map((language, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {language}
                    {isEditing && (
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeLanguage(index)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Nouvelle langue"
                    onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                  />
                  <Button onClick={addLanguage} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfileManager;
