
-- Table pour les questions du test
CREATE TABLE public.assessment_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'personality', 'skills', 'qualities'
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'scale', -- 'scale', 'choice', 'boolean'
  options JSONB, -- Pour les questions à choix multiples
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les évaluations des candidats
CREATE TABLE public.candidate_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL DEFAULT 'complete', -- 'personality', 'skills', 'qualities', 'complete'
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_score INTEGER DEFAULT 0,
  personality_score JSONB DEFAULT '{}',
  skills_score JSONB DEFAULT '{}',
  qualities_score JSONB DEFAULT '{}',
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les réponses individuelles
CREATE TABLE public.assessment_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.candidate_assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
  response_value JSONB NOT NULL,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

-- Policies pour assessment_questions (lecture publique)
CREATE POLICY "Anyone can view assessment questions" 
  ON public.assessment_questions 
  FOR SELECT 
  USING (true);

-- Policies pour candidate_assessments
CREATE POLICY "Users can view their own assessments" 
  ON public.candidate_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
  ON public.candidate_assessments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
  ON public.candidate_assessments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policies pour assessment_responses
CREATE POLICY "Users can view their own responses" 
  ON public.assessment_responses 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.candidate_assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own responses" 
  ON public.assessment_responses 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.candidate_assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own responses" 
  ON public.assessment_responses 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.candidate_assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

-- Insérer quelques questions d'exemple
INSERT INTO public.assessment_questions (category, question_text, question_type, options) VALUES
-- Questions de personnalité
('personality', 'Je préfère travailler en équipe plutôt que seul(e)', 'scale', '{"min": 1, "max": 5, "labels": ["Pas du tout d''accord", "Pas d''accord", "Neutre", "D''accord", "Tout à fait d''accord"]}'),
('personality', 'Je suis à l''aise pour prendre des décisions rapidement', 'scale', '{"min": 1, "max": 5, "labels": ["Pas du tout d''accord", "Pas d''accord", "Neutre", "D''accord", "Tout à fait d''accord"]}'),
('personality', 'J''aime relever de nouveaux défis', 'scale', '{"min": 1, "max": 5, "labels": ["Pas du tout d''accord", "Pas d''accord", "Neutre", "D''accord", "Tout à fait d''accord"]}'),
('personality', 'Je reste calme sous pression', 'scale', '{"min": 1, "max": 5, "labels": ["Pas du tout d''accord", "Pas d''accord", "Neutre", "D''accord", "Tout à fait d''accord"]}'),
('personality', 'Je communique facilement avec les autres', 'scale', '{"min": 1, "max": 5, "labels": ["Pas du tout d''accord", "Pas d''accord", "Neutre", "D''accord", "Tout à fait d''accord"]}'),

-- Questions de compétences
('skills', 'Évaluez votre niveau en communication', 'scale', '{"min": 1, "max": 5, "labels": ["Débutant", "Basique", "Intermédiaire", "Avancé", "Expert"]}'),
('skills', 'Évaluez votre niveau en leadership', 'scale', '{"min": 1, "max": 5, "labels": ["Débutant", "Basique", "Intermédiaire", "Avancé", "Expert"]}'),
('skills', 'Évaluez votre niveau en résolution de problèmes', 'scale', '{"min": 1, "max": 5, "labels": ["Débutant", "Basique", "Intermédiaire", "Avancé", "Expert"]}'),
('skills', 'Évaluez votre niveau en gestion du temps', 'scale', '{"min": 1, "max": 5, "labels": ["Débutant", "Basique", "Intermédiaire", "Avancé", "Expert"]}'),
('skills', 'Évaluez votre niveau en adaptabilité', 'scale', '{"min": 1, "max": 5, "labels": ["Débutant", "Basique", "Intermédiaire", "Avancé", "Expert"]}'),

-- Questions de qualités
('qualities', 'Quelle est votre principale qualité professionnelle ?', 'choice', '{"options": ["Rigueur", "Créativité", "Empathie", "Détermination", "Polyvalence"]}'),
('qualities', 'Dans quelle situation excellez-vous le mieux ?', 'choice', '{"options": ["Travail en autonomie", "Collaboration en équipe", "Gestion de crise", "Innovation", "Formation d''autres"]}'),
('qualities', 'Quel type de responsabilité vous motive le plus ?', 'choice', '{"options": ["Gestion d''équipe", "Projets techniques", "Relations clients", "Stratégie", "Opérations"]}');
