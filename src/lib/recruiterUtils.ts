import type { ApplicationWithJobAndProfile } from "@/hooks/useJobApplications";

export const getCandidateName = (application: ApplicationWithJobAndProfile) => {
  if (application.candidate_profiles?.profiles) {
    const profile = application.candidate_profiles.profiles;
    // Affiche le nom complet si disponible, sinon fallback
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return 'Candidat anonyme';
  }
  return 'Candidat anonyme';
};
