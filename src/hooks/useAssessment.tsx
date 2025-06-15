
// This file is now a barrel file to re-export hooks from their new locations.
// This is to maintain backward compatibility with components that import from this file.

export type { Assessment, AssessmentQuestion, AssessmentResponse } from './assessment/types';
export { useAssessmentQuestions } from './assessment/useAssessmentQuestions';
export { useUserAssessments } from './assessment/useUserAssessments';
export { useCreateAssessment } from './assessment/useCreateAssessment';
export { useSubmitAssessmentResponse } from './assessment/useSubmitAssessmentResponse';
export { useDeleteAssessment } from './assessment/useDeleteAssessment';
