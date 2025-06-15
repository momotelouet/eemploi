
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Star } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Assessment = Tables<'candidate_assessments'>;

interface AssessmentsInfoTabProps {
  assessments: Assessment[];
  onDownloadCertificate: (url: string) => void;
}

const getScoreFromJson = (jsonData: any): number => {
  if (!jsonData) return 0;
  if (typeof jsonData === 'object' && jsonData.score !== undefined) {
    return Number(jsonData.score) || 0;
  }
  return 0;
};

export const AssessmentsInfoTab = ({ assessments, onDownloadCertificate }: AssessmentsInfoTabProps) => {
  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Aucune évaluation complétée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment, index) => (
        <Card key={assessment.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center"><Award className="w-5 h-5 mr-2" />Évaluation #{index + 1}</span>
              {assessment.certificate_url && (
                <Button variant="outline" size="sm" onClick={() => onDownloadCertificate(assessment.certificate_url!)}>
                  <Download className="w-4 h-4 mr-2" />Certificat
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center"><p className="text-2xl font-bold text-blue-600">{assessment.total_score}</p><p className="text-sm text-muted-foreground">Score total</p></div>
              <div className="text-center"><p className="text-xl font-semibold text-green-600">{getScoreFromJson(assessment.personality_score)}</p><p className="text-sm text-muted-foreground">Personnalité</p></div>
              <div className="text-center"><p className="text-xl font-semibold text-purple-600">{getScoreFromJson(assessment.skills_score)}</p><p className="text-sm text-muted-foreground">Compétences</p></div>
              <div className="text-center"><p className="text-xl font-semibold text-orange-600">{getScoreFromJson(assessment.qualities_score)}</p><p className="text-sm text-muted-foreground">Qualités</p></div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="w-4 h-4 mr-1" />Complétée le {new Date(assessment.completed_at!).toLocaleDateString('fr-FR')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
