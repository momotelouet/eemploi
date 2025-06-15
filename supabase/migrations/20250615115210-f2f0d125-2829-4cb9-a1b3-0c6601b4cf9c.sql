
-- 1. Create the new table for recruiter profiles
CREATE TABLE public.recruiter_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  company_website TEXT,
  company_logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security on recruiter_profiles and add policies
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view their own profile" 
  ON public.recruiter_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can update their own profile" 
  ON public.recruiter_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- 3. Enable Row Level Security on candidate_profiles and add policies
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view their own profile"
  ON public.candidate_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates can update their own profile"
  ON public.candidate_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Update the handle_new_user function to create specific profiles on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_type_text TEXT;
BEGIN
  -- First, insert into the base profiles table
  INSERT INTO public.profiles (id, first_name, last_name, user_type)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'candidat')
  );

  -- Get the user type from the metadata
  user_type_text := COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'candidat');

  -- Create a corresponding profile in the specific table based on user type
  IF user_type_text = 'candidat' THEN
    INSERT INTO public.candidate_profiles (user_id)
    VALUES (NEW.id);
  ELSIF user_type_text = 'recruteur' THEN
    INSERT INTO public.recruiter_profiles (user_id)
    VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$;
