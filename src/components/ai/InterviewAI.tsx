
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Bot, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

interface InterviewAIProps {
  jobTitle?: string;
  candidateProfile?: string;
}

const InterviewAI = ({ jobTitle, candidateProfile }: InterviewAIProps) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [step, setStep] = useState<'question' | 'answer' | 'feedback'>('question');
  const { askAI, loading } = useAI();

  const generateQuestion = async () => {
    setStep('question');
    try {
      const context = `Poste: ${jobTitle || 'Poste généraliste'}\nProfil candidat: ${candidateProfile || 'Candidat généraliste'}`;
      const prompt = `Génère une question d'entretien pertinente et professionnelle pour ce contexte. La question doit être claire et permettre d'évaluer les compétences du candidat.`;
      
      const response = await askAI(prompt, context, 'interview-prep');
      setCurrentQuestion(response);
      setStep('answer');
      setUserAnswer('');
      setFeedback('');
    } catch (error) {
      console.error('Erreur génération question:', error);
    }
  };

  const analyzeAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;

    setStep('feedback');
    try {
      const context = `Question: ${currentQuestion}\nRéponse du candidat: ${userAnswer}`;
      const prompt = `Analyse cette réponse d'entretien et donne un feedback constructif :

1. Points forts de la réponse
2. Points à améliorer
3. Suggestions concrètes pour une meilleure réponse
4. Note sur 10 avec justification

Sois bienveillant mais précis dans tes conseils.`;
      
      const response = await askAI(prompt, context, 'interview-prep');
      setFeedback(response);
    } catch (error) {
      console.error('Erreur analyse réponse:', error);
    }
  };

  const resetInterview = () => {
    setStep('question');
    setCurrentQuestion('');
    setUserAnswer('');
    setFeedback('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-purple-600" />
          Coach d'entretien IA
          <Badge variant="secondary">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'question' && (
          <div className="text-center space-y-4">
            <div className="p-6 bg-purple-50 rounded-lg">
              <Bot className="w-12 h-12 mx-auto text-purple-600 mb-3" />
              <h4 className="font-medium mb-2">Prêt pour votre simulation ?</h4>
              <p className="text-sm text-muted-foreground">
                L'IA va générer une question d'entretien personnalisée pour vous
              </p>
            </div>
            <Button
              onClick={generateQuestion}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Générer une question
                </>
              )}
            </Button>
          </div>
        )}

        {step === 'answer' && currentQuestion && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Question :</h4>
              <p className="text-blue-800">{currentQuestion}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Votre réponse :</label>
              <Textarea
                placeholder="Tapez votre réponse ici..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={analyzeAnswer}
                disabled={!userAnswer.trim() || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Analyser ma réponse
                  </>
                )}
              </Button>
              <Button
                onClick={resetInterview}
                variant="outline"
              >
                Nouvelle question
              </Button>
            </div>
          </div>
        )}

        {step === 'feedback' && feedback && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Feedback de l'IA :
              </h4>
              <div className="text-yellow-800 text-sm whitespace-pre-wrap">
                {feedback}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={generateQuestion}
                className="flex-1"
              >
                Question suivante
              </Button>
              <Button
                onClick={resetInterview}
                variant="outline"
              >
                Recommencer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewAI;
