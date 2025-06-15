
-- Add new JSONB columns to candidate_profiles for detailed information
ALTER TABLE public.candidate_profiles ADD COLUMN experience JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.candidate_profiles ADD COLUMN education_structured JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.candidate_profiles ADD COLUMN certifications JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.candidate_profiles ADD COLUMN projects JSONB NOT NULL DEFAULT '[]'::jsonb;
