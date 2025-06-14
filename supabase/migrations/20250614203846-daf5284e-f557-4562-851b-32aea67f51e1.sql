
-- Supprimer les anciennes politiques s'il y en a
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Recruiters can view applications for their jobs" ON public.applications;
DROP POLICY IF EXISTS "Users can create applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update their applications" ON public.applications;
DROP POLICY IF EXISTS "Recruiters can update applications for their jobs" ON public.applications;

-- Créer les nouvelles politiques RLS pour les candidatures
CREATE POLICY "Candidates can view their own applications" ON public.applications 
  FOR SELECT USING (candidate_id = auth.uid());

CREATE POLICY "Recruiters can view applications for their jobs" ON public.applications 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE id = job_id AND posted_by = auth.uid()
    )
  );

CREATE POLICY "Candidates can create applications" ON public.applications 
  FOR INSERT WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Candidates can update their own applications" ON public.applications 
  FOR UPDATE USING (candidate_id = auth.uid());

CREATE POLICY "Recruiters can update applications for their jobs" ON public.applications 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE id = job_id AND posted_by = auth.uid()
    )
  );

-- Ajouter une politique pour que les admins puissent tout voir
CREATE POLICY "Admins can manage all applications" ON public.applications 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
