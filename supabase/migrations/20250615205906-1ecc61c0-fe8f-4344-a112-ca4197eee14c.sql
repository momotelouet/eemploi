
-- Ajoute la politique de sécurité autorisant un utilisateur à supprimer sa propre évaluation.
CREATE POLICY "Users can delete their own assessments"
  ON public.candidate_assessments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Ajoute la politique de sécurité pour la suppression des réponses.
-- Bien que la base de données soit configurée pour supprimer automatiquement les réponses
-- lorsqu'une évaluation est supprimée (ON DELETE CASCADE), cette politique ajoute une
-- sécurité supplémentaire et rend le comportement plus explicite.
CREATE POLICY "Users can delete their own responses"
  ON public.assessment_responses
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.candidate_assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));
