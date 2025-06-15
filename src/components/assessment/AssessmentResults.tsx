import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Download, Calendar, TrendingUp } from 'lucide-react';
import { useUserAssessments, Assessment } from '@/hooks/useAssessment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { generateAndStoreCertificate } from '@/lib/assessmentUtils';

const AssessmentResults = () => {
  const { data: assessments, isLoading } = useUserAssessments();
  const queryClient = useQueryClient();

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLevel = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Bon';
    if (percentage >= 40) return 'Moyen';
    return 'À améliorer';
  };

  const downloadCertificate = async (assessment: Assessment) => {
    // If URL exists, just open it. User can re-download if they want by generating again.
    if (assessment.certificate_url) {
      window.open(assessment.certificate_url, '_blank');
      toast.info("Le certificat s'ouvre dans un nouvel onglet.");
      return;
    }

    const toastId = toast.loading('Génération de votre certificat...');

    try {
      const result = await generateAndStoreCertificate(assessment);

      if (result) {
        const { htmlContent } = result;
        
        // Invalidate query cache to refresh data with the new URL
        await queryClient.invalidateQueries({ queryKey: ['user-assessments', assessment.user_id] });

        // Trigger download for user
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `certificat-evaluation-${assessment.id.slice(0, 8)}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Certificat téléchargé et sauvegardé sur votre profil !', { id: toastId });
      } else {
        toast.error('Erreur lors de la génération du certificat', { id: toastId });
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du certificat:', error);
      toast.error('Erreur lors du téléchargement du certificat', { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const completedAssessments = assessments?.filter(a => a.status === 'completed') || [];

  if (completedAssessments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune évaluation complétée</h3>
          <p className="text-muted-foreground mb-4">
            Passez votre premier test de personnalité et compétences pour obtenir votre certificat
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Mes Évaluations</h2>
        <p className="text-muted-foreground">
          Consultez vos résultats et téléchargez vos certificats
        </p>
      </div>

      {completedAssessments.map((assessment) => {
        const personalityScore = assessment.personality_score?.score || 0;
        const skillsScore = assessment.skills_score?.score || 0;
        const qualitiesScore = assessment.qualities_score?.score || 0;
        const maxScore = 25; // 5 questions max par catégorie * 5 points max

        return (
          <Card key={assessment.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span>Évaluation Complète</span>
                  </CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(assessment.completed_at!), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Complétée
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {assessment.total_score}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Score total
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Score Personnalité */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-blue-600">🧠 Personnalité</h4>
                    <span className={`font-bold ${getScoreColor(personalityScore, maxScore)}`}>
                      {personalityScore}/{maxScore}
                    </span>
                  </div>
                  <Progress 
                    value={(personalityScore / maxScore) * 100} 
                    className="h-2"
                  />
                  <div className="text-sm text-muted-foreground">
                    {getScoreLevel(personalityScore, maxScore)}
                  </div>
                </div>

                {/* Score Compétences */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-green-600">🎯 Compétences</h4>
                    <span className={`font-bold ${getScoreColor(skillsScore, maxScore)}`}>
                      {skillsScore}/{maxScore}
                    </span>
                  </div>
                  <Progress 
                    value={(skillsScore / maxScore) * 100} 
                    className="h-2"
                  />
                  <div className="text-sm text-muted-foreground">
                    {getScoreLevel(skillsScore, maxScore)}
                  </div>
                </div>

                {/* Score Qualités */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-purple-600">⭐ Qualités</h4>
                    <span className={`font-bold ${getScoreColor(qualitiesScore, 15)}`}>
                      {qualitiesScore}/15
                    </span>
                  </div>
                  <Progress 
                    value={(qualitiesScore / 15) * 100} 
                    className="h-2"
                  />
                  <div className="text-sm text-muted-foreground">
                    {getScoreLevel(qualitiesScore, 15)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>Résultats détaillés disponibles dans le certificat</span>
                </div>
                
                <Button 
                  onClick={() => downloadCertificate(assessment)}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{assessment.certificate_url ? 'Voir le certificat' : 'Télécharger le certificat'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AssessmentResults;
