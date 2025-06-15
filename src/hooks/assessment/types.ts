
export interface AssessmentQuestion {
  id: string;
  category: string;
  question_text: string;
  question_type: string;
  options: any;
  weight: number;
}

export interface AssessmentResponse {
  question_id: string;
  response_value: any;
  score: number;
}

export interface Assessment {
  id: string;
  user_id: string;
  assessment_type: string;
  status: string;
  started_at: string;
  completed_at?: string;
  total_score: number;
  personality_score: any;
  skills_score: any;
  qualities_score: any;
  certificate_url?: string;
}
