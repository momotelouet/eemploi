
-- Create table for storing CV data with template information
CREATE TABLE public.cv_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id TEXT NOT NULL,
  personal_info JSONB NOT NULL DEFAULT '{}',
  experience JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cv_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for CV profiles
CREATE POLICY "Users can view their own cv profiles" 
  ON public.cv_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cv profiles" 
  ON public.cv_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cv profiles" 
  ON public.cv_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cv profiles" 
  ON public.cv_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Update candidate_profiles table to fix potential issues
ALTER TABLE public.candidate_profiles 
ADD COLUMN IF NOT EXISTS professional_summary TEXT;

-- Ensure RLS is enabled on candidate_profiles
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for candidate_profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'candidate_profiles' 
    AND policyname = 'Users can view their own candidate profile'
  ) THEN
    CREATE POLICY "Users can view their own candidate profile" 
      ON public.candidate_profiles 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'candidate_profiles' 
    AND policyname = 'Users can create their own candidate profile'
  ) THEN
    CREATE POLICY "Users can create their own candidate profile" 
      ON public.candidate_profiles 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'candidate_profiles' 
    AND policyname = 'Users can update their own candidate profile'
  ) THEN
    CREATE POLICY "Users can update their own candidate profile" 
      ON public.candidate_profiles 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'candidate_profiles' 
    AND policyname = 'Users can delete their own candidate profile'
  ) THEN
    CREATE POLICY "Users can delete their own candidate profile" 
      ON public.candidate_profiles 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END
$$;
