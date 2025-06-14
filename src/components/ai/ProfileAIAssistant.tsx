
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

interface ProfileAIAssistantProps {
  onSuggestion: (suggestion: string) => void;
  context?: string;
  fieldType: 'summary' | 'bio' | 'experience' | 'skills' | 'education';
}

const ProfileAIAssistant = ({ onSuggestion, context, fieldType }: ProfileAIAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const { askAI, loading } = useAI();

  const getFieldPrompt = (type: string, userPrompt: string) => {
    const prompts = {
      summary: `Écris un résumé professionnel accrocheur basé sur ces informations : ${userPrompt}. Maximum 3-4 lignes.`,
      bio: `Écris une bio personnelle et professionnelle engageante basée sur : ${userPrompt}. Ton amical et humain.`,
      experience: `Aide à formuler cette expérience professionnelle de manière impactante : ${userPrompt}. Mets l'accent sur les réalisations.`,
      skills: `Suggère des compétences pertinentes et recherchées pour ce profil : ${userPrompt}. Liste 5-8 compétences.`,
      education: `Aide à présenter cette formation de manière valorisante : ${userPrompt}. Mets en avant les aspects pertinents.`
    };
    return prompts[type] || userPrompt;
  };

  const handleGetSuggestion = async () => {
    if (!prompt.trim()) return;

    try {
      const aiPrompt = getFieldPrompt(fieldType, prompt);
      const response = await askAI(aiPrompt, context, 'cv-optimization');
      setSuggestion(response);
    } catch (error) {
      console.error('Erreur AI:', error);
    }
  };

  const handleAcceptSuggestion = () => {
    onSuggestion(suggestion);
    setSuggestion('');
    setPrompt('');
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-600" />
          Assistant IA
          <Badge variant="secondary" className="text-xs">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Décrivez vos informations et l'IA vous aidera à les formuler..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="text-sm"
        />
        
        <Button
          onClick={handleGetSuggestion}
          disabled={!prompt.trim() || loading}
          size="sm"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 mr-2" />
              Obtenir une suggestion IA
            </>
          )}
        </Button>

        {suggestion && (
          <div className="space-y-2">
            <div className="p-3 bg-white border rounded text-sm">
              {suggestion}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAcceptSuggestion}
                size="sm"
                className="flex-1"
              >
                Utiliser cette suggestion
              </Button>
              <Button
                onClick={() => setSuggestion('')}
                variant="outline"
                size="sm"
              >
                Ignorer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileAIAssistant;
