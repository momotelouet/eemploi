
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles, Loader2 } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

const CVOptimizer = () => {
  const [cvContent, setCvContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const { askAI, loading } = useAI();

  const optimizeCV = async () => {
    if (!cvContent.trim()) return;

    const context = jobDescription ? `Description du poste: ${jobDescription}` : '';
    const prompt = `Analyse ce CV et donne des suggestions d'amélioration pour le rendre plus attractif :

${cvContent}

Donne des conseils spécifiques sur :
- Le format et la structure
- Les compétences à mettre en avant
- Les expériences à valoriser
- Les mots-clés à ajouter
- La présentation générale`;

    try {
      const response = await askAI(prompt, context, 'cv-optimization');
      setSuggestions(response);
    } catch (error) {
      console.error('Erreur optimisation CV:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-eemploi-primary" />
            Optimiseur de CV IA
            <Badge variant="secondary">AI</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Contenu de votre CV
            </label>
            <Textarea
              placeholder="Collez ici le contenu de votre CV ou décrivez votre profil..."
              value={cvContent}
              onChange={(e) => setCvContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Description du poste visé (optionnel)
            </label>
            <Textarea
              placeholder="Collez la description du poste pour des conseils personnalisés..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={optimizeCV}
            disabled={!cvContent.trim() || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Optimiser mon CV
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggestions d'amélioration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm">{suggestions}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CVOptimizer;
