
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Sparkles, Loader2, Copy } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

const JobDescriptionGenerator = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState('');
  const [requirements, setRequirements] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const { askAI, loading } = useAI();
  const { toast } = useToast();

  const generateDescription = async () => {
    if (!jobTitle.trim()) return;

    const prompt = `Génère une description de poste complète et attractive pour :

Titre du poste: ${jobTitle}
Entreprise: ${company || 'Non spécifiée'}
Secteur: ${industry || 'Non spécifié'}
Niveau d'expérience: ${experience || 'Non spécifié'}
Exigences spécifiques: ${requirements || 'Aucune'}

La description doit inclure :
- Une présentation attrayante du poste
- Les missions principales
- Le profil recherché
- Les compétences requises
- Les avantages proposés
- Les conditions de travail

Utilise un ton professionnel mais engageant.`;

    try {
      const response = await askAI(prompt, undefined, 'job-description');
      setGeneratedDescription(response);
    } catch (error) {
      console.error('Erreur génération description:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDescription);
    toast({
      title: "Copié !",
      description: "La description a été copiée dans le presse-papiers",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-eemploi-primary" />
            Générateur de Description de Poste IA
            <Badge variant="secondary">AI</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Titre du poste *
              </label>
              <Input
                placeholder="Ex: Développeur Full Stack"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Entreprise
              </label>
              <Input
                placeholder="Nom de l'entreprise"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Secteur d'activité
              </label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technologie</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="healthcare">Santé</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="retail">Commerce</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Niveau d'expérience
              </label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau requis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Débutant (0-2 ans)</SelectItem>
                  <SelectItem value="mid">Intermédiaire (2-5 ans)</SelectItem>
                  <SelectItem value="senior">Senior (5+ ans)</SelectItem>
                  <SelectItem value="lead">Lead/Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Exigences spécifiques (optionnel)
            </label>
            <Textarea
              placeholder="Compétences techniques, soft skills, diplômes requis..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={generateDescription}
            disabled={!jobTitle.trim() || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer la description
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedDescription && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Description générée</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                {generatedDescription}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDescriptionGenerator;
