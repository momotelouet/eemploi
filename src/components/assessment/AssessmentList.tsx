
import React from 'react';
import { Assessment } from '@/hooks/useAssessment';
import AssessmentCard from './AssessmentCard';

interface AssessmentListProps {
  assessments: Assessment[];
  onStartNewAssessment?: () => void;
  onDelete: (assessment: Assessment) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ assessments, onStartNewAssessment, onDelete }) => {
  return (
    <div className="space-y-6">
      {assessments.map((assessment) => (
        <AssessmentCard 
          key={assessment.id}
          assessment={assessment}
          onStartNewAssessment={onStartNewAssessment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AssessmentList;
