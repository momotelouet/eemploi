
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Briefcase, Calendar, Award } from 'lucide-react';

interface CandidateQuickActionsProps {
  isMobile: boolean;
  onCreateCV: () => void;
  onSearchJobs: () => void;
  onInterviewSimulation: () => void;
  onStartAssessment: () => void;
}

const CandidateQuickActions: React.FC<CandidateQuickActionsProps> = ({
  isMobile,
  onCreateCV,
  onSearchJobs,
  onInterviewSimulation,
  onStartAssessment
}) => (
  <Card className="mt-8">
    <CardHeader>
      <CardTitle>Actions Rapides</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-4 gap-4'}`}>
        <div 
          className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors text-center"
          onClick={onCreateCV}
        >
          <FileText className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
          <h4 className="font-medium text-sm md:text-base">Créer un nouveau CV</h4>
          <p className="text-xs md:text-sm text-muted-foreground">Utilisez nos templates modernes</p>
        </div>
        
        <div 
          className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors text-center"
          onClick={onSearchJobs}
        >
          <Briefcase className="w-6 h-6 text-green-600 mb-2 mx-auto" />
          <h4 className="font-medium text-sm md:text-base">Rechercher des emplois</h4>
          <p className="text-xs md:text-sm text-muted-foreground">Trouvez votre prochain défi</p>
        </div>
        
        <div 
          className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors text-center"
          onClick={onInterviewSimulation}
        >
          <Calendar className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
          <h4 className="font-medium text-sm md:text-base">Simuler un entretien</h4>
          <p className="text-xs md:text-sm text-muted-foreground">Préparez-vous efficacement</p>
        </div>

        <div 
          className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors text-center"
          onClick={onStartAssessment}
        >
          <Award className="w-6 h-6 text-yellow-600 mb-2 mx-auto" />
          <h4 className="font-medium text-sm md:text-base">Test de personnalité</h4>
          <p className="text-xs md:text-sm text-muted-foreground">Obtenez votre certificat</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default CandidateQuickActions;
