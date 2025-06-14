
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, Clock, Award } from 'lucide-react';
import { 
  useAssessmentQuestions, 
  useCreateAssessment, 
  useSubmitAssessmentResponse,
  AssessmentQuestion,
  AssessmentResponse 
} from '@/hooks/useAssessment';

interface AssessmentTestProps {
  onComplete?: (assessmentId: string) => void;
}

const AssessmentTest: React.FC<AssessmentTestProps> = ({ onComplete }) => {
  const { data: questions, isLoading: questionsLoading } = useAssessmentQuestions();
  const createAssessment = useCreateAssessment();
  const submitResponse = useSubmitAssessmentResponse();

  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [currentResponse, setCurrentResponse] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const groupedQuestions = questions ? {
    personality: questions.filter(q => q.category === 'personality'),
    skills: questions.filter(q => q.category === 'skills'),
    qualities: questions.filter(q => q.category === 'qualities')
  } : null;

  const allQuestions = questions || [];
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = allQuestions.length > 0 ? ((currentQuestionIndex + 1) / allQuestions.length) * 100 : 0;

  const startAssessment = async () => {
    try {
      const assessment = await createAssessment.mutateAsync('complete');
      setCurrentAssessmentId(assessment.id);
      setIsStarted(true);
    } catch (error) {
      console.error('Error starting assessment:', error);
    }
  };

  const handleResponseChange = (value: any) => {
    setCurrentResponse(value);
  };

  const calculateScore = (question: AssessmentQuestion, response: any): number => {
    console.log('Calculating score for question:', question.category, 'response:', response);
    
    if (question.question_type === 'scale') {
      const score = parseInt(response) || 0;
      console.log('Scale score:', score);
      return score;
    } else if (question.question_type === 'choice') {
      // Pour les questions à choix multiple, on donne 3 points
      const score = 3;
      console.log('Choice score:', score);
      return score;
    }
    return 0;
  };

  const nextQuestion = () => {
    if (currentResponse !== null && currentQuestion) {
      const score = calculateScore(currentQuestion, currentResponse);
      
      const newResponse: AssessmentResponse = {
        question_id: currentQuestion.id,
        response_value: currentResponse,
        score: score
      };

      console.log('Adding response:', newResponse);
      setResponses(prev => [...prev, newResponse]);
      setCurrentResponse(null);

      if (currentQuestionIndex < allQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        completeAssessment([...responses, newResponse]);
      }
    }
  };

  const completeAssessment = async (finalResponses: AssessmentResponse[]) => {
    if (!currentAssessmentId) return;

    console.log('Completing assessment with responses:', finalResponses);

    try {
      await submitResponse.mutateAsync({
        assessmentId: currentAssessmentId,
        responses: finalResponses
      });
      
      setIsCompleted(true);
      if (onComplete) {
        onComplete(currentAssessmentId);
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    if (currentQuestion.question_type === 'scale') {
      const options = currentQuestion.options as { min: number; max: number; labels: string[] };
      
      return (
        <div className="space-y-6">
          <div className="px-4">
            <Slider
              value={[currentResponse || options.min]}
              onValueChange={(value) => handleResponseChange(value[0])}
              min={options.min}
              max={options.max}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            {options.labels.map((label, index) => (
              <span key={index} className="text-center flex-1">
                {label}
              </span>
            ))}
          </div>
          {currentResponse && (
            <div className="text-center text-lg font-medium">
              Réponse sélectionnée: {options.labels[currentResponse - 1]}
            </div>
          )}
        </div>
      );
    }

    if (currentQuestion.question_type === 'choice') {
      const options = currentQuestion.options as { options: string[] };
      
      return (
        <RadioGroup 
          value={currentResponse} 
          onValueChange={handleResponseChange}
          className="space-y-3"
        >
          {options.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    return null;
  };

  if (questionsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p>Chargement du questionnaire...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Évaluation Complétée !</h2>
          <p className="text-muted-foreground mb-6">
            Félicitations ! Vous avez terminé votre évaluation de personnalité et de compétences.
            Votre certificat est en cours de génération.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => window.location.reload()}>
              Passer un nouveau test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Test de Personnalité et Compétences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg">
              Découvrez votre profil professionnel et obtenez votre certificat personnalisé
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-600">Personnalité</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {groupedQuestions?.personality.length || 0} questions
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600">Compétences</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {groupedQuestions?.skills.length || 0} questions
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-purple-600">Qualités</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {groupedQuestions?.qualities.length || 0} questions
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
              <span>Durée estimée: 5-10 minutes</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
              <span>Certificat PDF généré automatiquement</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
              <span>Utilisable dans vos candidatures</span>
            </div>
          </div>

          <Button 
            onClick={startAssessment} 
            className="w-full" 
            size="lg"
            disabled={createAssessment.isPending}
          >
            {createAssessment.isPending ? 'Démarrage...' : 'Commencer le test'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Question {currentQuestionIndex + 1} sur {allQuestions.length}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {currentQuestion?.category === 'personality' && '🧠 Personnalité'}
            {currentQuestion?.category === 'skills' && '🎯 Compétences'}
            {currentQuestion?.category === 'qualities' && '⭐ Qualités'}
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentQuestion && (
          <>
            <div className="text-lg font-medium">
              {currentQuestion.question_text}
            </div>
            
            {renderQuestionInput()}
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Précédent
              </Button>
              
              <Button 
                onClick={nextQuestion}
                disabled={currentResponse === null || submitResponse.isPending}
              >
                {currentQuestionIndex === allQuestions.length - 1 
                  ? (submitResponse.isPending ? 'Finalisation...' : 'Terminer') 
                  : 'Suivant'
                }
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentTest;
