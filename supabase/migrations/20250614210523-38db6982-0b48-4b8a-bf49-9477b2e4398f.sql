
-- Ajouter la colonne cv_profile_id à la table applications
ALTER TABLE public.applications 
ADD COLUMN cv_profile_id UUID REFERENCES public.cv_profiles(id);

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.applications.cv_profile_id IS 'Reference to CV profile created on platform';
