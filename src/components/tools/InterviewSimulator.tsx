
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, RefreshCw, CheckCircle, Clock, Bot, Sparkles } from 'lucide-react';
import InterviewAI from '@/components/ai/InterviewAI';

interface Question {
  id: number;
  text: string;
  category: string;
  tips: string[];
}

const InterviewSimulator = () => {
  const [jobType, setJobType] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [useAI, setUseAI] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "Parlez-moi de vous et de votre parcours professionnel.",
      category: "Présentation",
      tips: [
        "Préparez un pitch de 2-3 minutes",
        "Mettez l'accent sur vos réalisations",
        "Liez votre expérience au poste visé",
        "Restez professionnel et concis"
      ]
    },
    {
      id: 2,
      text: "Pourquoi souhaitez-vous travailler dans notre entreprise ?",
      category: "Motivation",
      tips: [
        "Montrez que vous connaissez l'entreprise",
        "Expliquez comment vos valeurs s'alignent",
        "Parlez des opportunités de développement",
        "Évitez les réponses génériques"
      ]
    },
    {
      id: 3,
      text: "Quelles sont vos principales forces et faiblesses ?",
      category: "Auto-évaluation",
      tips: [
        "Choisissez des forces pertinentes pour le poste",
        "Pour les faiblesses, montrez comment vous travaillez dessus",
        "Donnez des exemples concrets",
        "Restez honnête mais positif"
      ]
    },
    {
      id: 4,
      text: "Décrivez une situation difficile que vous avez gérée au travail.",
      category: "Expérience",
      tips: [
        "Utilisez la méthode STAR (Situation, Tâche, Action, Résultat)",
        "Choisissez un exemple qui montre vos compétences",
        "Mettez l'accent sur votre rôle dans la résolution",
        "Tirez des leçons de l'expérience"
      ]
    },
    {
      id: 5,
      text: "Où vous voyez-vous dans 5 ans ?",
      category: "Projection",
      tips: [
        "Montrez de l'ambition mais restez réaliste",
        "Alignez vos objectifs avec l'entreprise",
        "Parlez d'évolution de compétences",
        "Évitez de mentionner d'autres entreprises"
      ]
    }
  ];

  const startSimulation = () => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[0]);
      setQuestionIndex(0);
      setUserAnswer('');
      setShowTips(false);
    }
  };

  const nextQuestion = () => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestion(questions[nextIndex]);
      setQuestionIndex(nextIndex);
      setUserAnswer('');
      setShowTips(false);
    } else {
      setCurrentQuestion(null);
      setQuestionIndex(0);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Simulateur d'Entretien
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={useAI ? "default" : "outline"}
              size="sm"
              onClick={() => setUseAI(!useAI)}
              className={useAI ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              <Bot className="w-4 h-4 mr-1" />
              {useAI ? "Mode IA Activé" : "Activer l'IA"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {useAI ? (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-purple-900">Simulation d'entretien avec IA</h3>
              </div>
              <p className="text-sm text-purple-700">
                L'IA va générer des questions personnalisées et analyser vos réponses en temps réel.
              </p>
            </div>
            <InterviewAI 
              jobTitle={jobType || "Poste généraliste"}
              candidateProfile="Candidat en simulation"
            />
          </div>
        ) : (
          <>
            {!currentQuestion ? (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Préparez-vous pour votre entretien</h3>
                  <p className="text-muted-foreground">
                    Entraînez-vous avec nos questions types et recevez des conseils personnalisés.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de poste (optionnel)</label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger className="max-w-xs mx-auto">
                        <SelectValue placeholder="Sélectionnez un type de poste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Informatique/Tech</SelectItem>
                        <SelectItem value="marketing">Marketing/Communication</SelectItem>
                        <SelectItem value="finance">Finance/Comptabilité</SelectItem>
                        <SelectItem value="rh">Ressources Humaines</SelectItem>
                        <SelectItem value="commercial">Commercial/Vente</SelectItem>
                        <SelectItem value="general">Poste généraliste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={startSimulation}
                    className="bg-eemploi-primary hover:bg-eemploi-primary/90"
                    size="lg"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Commencer la simulation
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Questions variées</h4>
                    <p className="text-sm text-blue-700">5 questions essentielles pour tout entretien</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Conseils experts</h4>
                    <p className="text-sm text-green-700">Tips et méthodes pour bien répondre</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Entraînement</h4>
                    <p className="text-sm text-purple-700">Répétez autant que nécessaire</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    Question {questionIndex + 1} / {questions.length}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {currentQuestion.category}
                  </Badge>
                </div>

                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Question :</h3>
                  <p className="text-gray-800">{currentQuestion.text}</p>
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

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowTips(!showTips)}
                  >
                    {showTips ? 'Masquer' : 'Voir'} les conseils
                  </Button>
                  
                  <Button
                    onClick={nextQuestion}
                    className="bg-eemploi-primary hover:bg-eemploi-primary/90"
                  >
                    {questionIndex + 1 < questions.length ? (
                      <>
                        Question suivante
                        <RefreshCw className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Terminer
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {showTips && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-3">💡 Conseils pour cette question :</h4>
                    <ul className="space-y-2">
                      {currentQuestion.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-yellow-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewSimulator;
