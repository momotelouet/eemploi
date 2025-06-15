
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

const NoAssessmentFound = () => {
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
};

export default NoAssessmentFound;
