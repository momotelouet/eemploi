
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS cover_letter_url TEXT,
ADD COLUMN IF NOT EXISTS certificate_url TEXT;
