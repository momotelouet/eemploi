import { useAuth } from "@/contexts/AuthContext";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import ExperienceEditor from './profile-editors/ExperienceEditor';
import EducationEditor from './profile-editors/EducationEditor';
import CertificationsEditor from "./profile-editors/CertificationsEditor";
import ProjectsEditor from "./profile-editors/ProjectsEditor";
import SkillsLanguagesEditor from "./profile-editors/SkillsLanguagesEditor";
import CVUploadManager from "./profile-editors/CVUploadManager";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useState, useEffect } from "react";
import type { CandidateProfile } from "@/hooks/useCandidateProfile";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import { MOROCCO_CITIES } from '../ui/cities';


const PersonalInfoEditor = ({ profile, onUpdate, loading }: { profile: CandidateProfile, onUpdate: (updates: Partial<CandidateProfile>) => Promise<any>, loading: boolean }) => {
  const [formData, setFormData] = useState({
    phone: profile.phone || '',
    address: profile.address || '',
    city: profile.city || '',
    country: profile.country || '',
    linkedin_url: profile.linkedin_url || '',
    portfolio_url: profile.portfolio_url || '',
    professional_summary: profile.professional_summary || '',
    bio: profile.bio || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      country: profile.country || '',
      linkedin_url: profile.linkedin_url || '',
      portfolio_url: profile.portfolio_url || '',
      professional_summary: profile.professional_summary || '',
      bio: profile.bio || '',
    });
  }, [profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(formData);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations personnelles ont été sauvegardées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "La sauvegarde a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Suppression de l'affichage de la photo de profil ou de l'initiale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Select value={formData.city} onValueChange={value => handleInputChange('city', value)}>
              <SelectTrigger id="city">
                <SelectValue placeholder="Votre ville" />
              </SelectTrigger>
              <SelectContent>
                {MOROCCO_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input id="country" value={formData.country} onChange={e => handleInputChange('country', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">Profil LinkedIn</Label>
            <Input id="linkedin_url" value={formData.linkedin_url} onChange={e => handleInputChange('linkedin_url', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio_url">Portfolio/Site web</Label>
            <Input id="portfolio_url" value={formData.portfolio_url} onChange={e => handleInputChange('portfolio_url', e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="professional_summary">Résumé Professionnel</Label>
            <Textarea id="professional_summary" value={formData.professional_summary} onChange={e => handleInputChange('professional_summary', e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={formData.bio} onChange={e => handleInputChange('bio', e.target.value)} />
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  )
}

const DetailedCandidateProfileManager = () => {
    const { user } = useAuth();
    const { profile, loading, updateProfile } = useCandidateProfile(user?.id);

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }
    
    if (!profile) {
        return <div className="p-8 text-center">Profil non trouvé. Veuillez réessayer.</div>;
    }

    return (
        <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 mb-4">
                <TabsTrigger value="personal">Personnel</TabsTrigger>
                <TabsTrigger value="experience">Expériences</TabsTrigger>
                <TabsTrigger value="education">Formation</TabsTrigger>
                <TabsTrigger value="skills">Compétences</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="projects">Projets</TabsTrigger>
                <TabsTrigger value="cv">CV</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
                <PersonalInfoEditor profile={profile} onUpdate={updateProfile} loading={loading}/>
            </TabsContent>
            <TabsContent value="experience">
                <ExperienceEditor profile={profile} onUpdate={updateProfile} />
            </TabsContent>
            <TabsContent value="education">
                <EducationEditor profile={profile} onUpdate={updateProfile} />
            </TabsContent>
            <TabsContent value="skills">
                <SkillsLanguagesEditor profile={profile} onUpdate={updateProfile} />
            </TabsContent>
            <TabsContent value="certifications">
                <CertificationsEditor profile={profile} onUpdate={updateProfile} />
            </TabsContent>
            <TabsContent value="projects">
                <ProjectsEditor profile={profile} onUpdate={updateProfile} />
            </TabsContent>
            <TabsContent value="cv">
                <CVUploadManager profile={profile} onUpdate={updateProfile} user={user} />
            </TabsContent>
        </Tabs>
    );
};

export default DetailedCandidateProfileManager;
