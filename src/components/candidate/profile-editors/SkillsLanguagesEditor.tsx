
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { CandidateProfile } from "@/hooks/useCandidateProfile";

interface SkillsLanguagesEditorProps {
  profile: CandidateProfile;
  onUpdate: (updates: Partial<CandidateProfile>) => Promise<any>;
}

const SkillsLanguagesEditor = ({ profile, onUpdate }: SkillsLanguagesEditorProps) => {
  const [skills, setSkills] = useState(profile.skills || []);
  const [languages, setLanguages] = useState(profile.languages || []);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSkills(profile.skills || []);
    setLanguages(profile.languages || []);
  }, [profile]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };
  
  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages(prev => [...prev, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (langToRemove: string) => {
    setLanguages(prev => prev.filter(lang => lang !== langToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate({ skills, languages });
      toast({
        title: "Profil mis à jour",
        description: "Vos compétences et langues ont été sauvegardées.",
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
        <CardTitle>Compétences et Langues</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Compétences</Label>
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
          </div>
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
        </div>

        <div>
          <Label className="text-base font-medium">Langues</Label>
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {languages.map((language, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {language}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeLanguage(language)}
                />
              </Badge>
            ))}
          </div>
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
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  );
};

export default SkillsLanguagesEditor;
