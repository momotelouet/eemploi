
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Trash2, Save, Upload, Bot } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCVImages } from '@/hooks/useCVImages';
import ProfileAIAssistant from '@/components/ai/ProfileAIAssistant';

const AIEnhancedProfileManager = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useCandidateProfile(user?.id);
  const { uploadImage } = useCVImages();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    linkedin_url: '',
    portfolio_url: '',
    experience_years: 0,
    education: '',
    professional_summary: '',
    profile_picture_url: '',
    skills: [] as string[],
    languages: [] as string[]
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAI, setShowAI] = useState({
    summary: false,
    bio: false,
    education: false,
    skills: false
  });

  // Synchroniser les données du profil avec le formulaire
  useEffect(() => {
    if (profile) {
      console.log('Profile loaded:', profile);
      setFormData({
        bio: profile.bio || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        linkedin_url: profile.linkedin_url || '',
        portfolio_url: profile.portfolio_url || '',
        experience_years: profile.experience_years || 0,
        education: profile.education || '',
        professional_summary: profile.professional_summary || '',
        profile_picture_url: profile.profile_picture_url || '',
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        languages: Array.isArray(profile.languages) ? profile.languages : []
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: any) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAISuggestion = (field: string, suggestion: string) => {
    handleInputChange(field, suggestion);
    setShowAI(prev => ({ ...prev, [field]: false }));
    toast({
      title: 'Suggestion IA appliquée',
      description: 'La suggestion a été intégrée à votre profil.',
    });
  };

  const toggleAI = (field: string) => {
    setShowAI(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const photoUrl = await uploadImage(file);
      handleInputChange('profile_picture_url', photoUrl);
      toast({
        title: 'Photo ajoutée',
        description: 'Votre photo de profil a été ajoutée avec succès.',
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la photo.',
        variant: 'destructive'
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...formData.skills, newSkill.trim()];
      handleInputChange('skills', updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = formData.skills.filter(skill => skill !== skillToRemove);
    handleInputChange('skills', updatedSkills);
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      const updatedLanguages = [...formData.languages, newLanguage.trim()];
      handleInputChange('languages', updatedLanguages);
      setNewLanguage('');
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    const updatedLanguages = formData.languages.filter(lang => lang !== languageToRemove);
    handleInputChange('languages', updatedLanguages);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Utilisateur non connecté.',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    console.log('Saving profile data:', formData);
    
    try {
      const result = await updateProfile(formData);
      console.log('Profile updated successfully:', result);
      
      toast({
        title: 'Profil sauvegardé',
        description: 'Votre profil a été mis à jour avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur de sauvegarde',
        description: `Impossible de sauvegarder le profil: ${error.message || 'Erreur inconnue'}`,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement de votre profil...</div>
        </CardContent>
      </Card>
    );
  }

  const profileContext = `Profil: ${formData.professional_summary || ''} | Expérience: ${formData.experience_years} ans | Éducation: ${formData.education || ''} | Compétences: ${formData.skills.join(', ')}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Mon Profil Professionnel
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Bot className="w-3 h-3 mr-1" />
              Assistant IA
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Photo de profil */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.profile_picture_url} />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="photo">Photo de profil</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file);
                  }}
                  className="hidden"
                  id="photo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Ajouter une photo
                </Button>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Votre numéro de téléphone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Votre ville"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Votre pays"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience_years">Années d'expérience</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Votre adresse complète"
            />
          </div>

          {/* URLs professionnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/votre-profil"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio/Site web</Label>
              <Input
                id="portfolio_url"
                value={formData.portfolio_url}
                onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                placeholder="https://votre-portfolio.com"
              />
            </div>
          </div>

          {/* Résumé professionnel avec IA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="professional_summary">Résumé professionnel</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleAI('summary')}
                className="text-blue-600"
              >
                <Bot className="w-3 h-3 mr-1" />
                Assistant IA
              </Button>
            </div>
            <Textarea
              id="professional_summary"
              value={formData.professional_summary}
              onChange={(e) => handleInputChange('professional_summary', e.target.value)}
              placeholder="Décrivez brièvement votre parcours et vos objectifs professionnels..."
              rows={4}
            />
            {showAI.summary && (
              <ProfileAIAssistant
                fieldType="summary"
                context={profileContext}
                onSuggestion={(suggestion) => handleAISuggestion('professional_summary', suggestion)}
              />
            )}
          </div>

          {/* Bio avec IA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio">Bio</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleAI('bio')}
                className="text-blue-600"
              >
                <Bot className="w-3 h-3 mr-1" />
                Assistant IA
              </Button>
            </div>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Parlez de vous, vos passions, votre personnalité..."
              rows={3}
            />
            {showAI.bio && (
              <ProfileAIAssistant
                fieldType="bio"
                context={profileContext}
                onSuggestion={(suggestion) => handleAISuggestion('bio', suggestion)}
              />
            )}
          </div>

          {/* Formation avec IA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="education">Formation</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleAI('education')}
                className="text-blue-600"
              >
                <Bot className="w-3 h-3 mr-1" />
                Assistant IA
              </Button>
            </div>
            <Textarea
              id="education"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="Décrivez votre parcours académique..."
              rows={3}
            />
            {showAI.education && (
              <ProfileAIAssistant
                fieldType="education"
                context={profileContext}
                onSuggestion={(suggestion) => handleAISuggestion('education', suggestion)}
              />
            )}
          </div>

          {/* Compétences avec IA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Compétences</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleAI('skills')}
                className="text-blue-600"
              >
                <Bot className="w-3 h-3 mr-1" />
                Suggestions IA
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Ajouter une compétence"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button onClick={addSkill} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} type="button">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {showAI.skills && (
              <ProfileAIAssistant
                fieldType="skills"
                context={profileContext}
                onSuggestion={(suggestion) => {
                  const skills = suggestion.split(',').map(s => s.trim()).filter(s => s);
                  const newSkills = skills.filter(skill => !formData.skills.includes(skill));
                  if (newSkills.length > 0) {
                    handleInputChange('skills', [...formData.skills, ...newSkills]);
                    toast({
                      title: 'Compétences ajoutées',
                      description: `${newSkills.length} nouvelle(s) compétence(s) ajoutée(s).`,
                    });
                  }
                  setShowAI(prev => ({ ...prev, skills: false }));
                }}
              />
            )}
          </div>

          {/* Langues */}
          <div className="space-y-4">
            <Label>Langues</Label>
            <div className="flex gap-2">
              <Input
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Ajouter une langue"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
              />
              <Button onClick={addLanguage} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((language) => (
                <Badge key={language} variant="secondary" className="flex items-center gap-1">
                  {language}
                  <button onClick={() => removeLanguage(language)} type="button">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleSave} 
              disabled={saving || !user}
              className="bg-eemploi-primary hover:bg-eemploi-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder le profil'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIEnhancedProfileManager;
