
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface AssessmentScoreProps {
  title: string;
  score: number;
  maxScore: number;
  color: string;
}

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

const AssessmentScore: React.FC<AssessmentScoreProps> = ({ title, score, maxScore, color }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className={`font-medium ${color}`}>{title}</h4>
        <span className={`font-bold ${getScoreColor(score, maxScore)}`}>
          {score}/{maxScore}
        </span>
      </div>
      <Progress 
        value={(score / maxScore) * 100} 
        className="h-2"
      />
      <div className="text-sm text-muted-foreground">
        {getScoreLevel(score, maxScore)}
      </div>
    </div>
  );
};

export default AssessmentScore;
