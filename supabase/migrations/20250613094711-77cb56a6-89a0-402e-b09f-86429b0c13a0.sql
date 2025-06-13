
-- Create candidate_profiles table to store detailed candidate information
CREATE TABLE public.candidate_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  skills TEXT[],
  experience_years INTEGER,
  education TEXT,
  languages TEXT[],
  cv_file_url TEXT,
  cv_file_name TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own candidate profile" 
  ON public.candidate_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own candidate profile" 
  ON public.candidate_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own candidate profile" 
  ON public.candidate_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own candidate profile" 
  ON public.candidate_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('candidate-files', 'candidate-files', true);

-- Storage policies for candidate files
CREATE POLICY "Users can upload their own files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'candidate-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'candidate-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'candidate-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'candidate-files' AND auth.uid()::text = (storage.foldername(name))[1]);
