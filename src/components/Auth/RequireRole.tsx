import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface RequireRoleProps {
  role: string; // Exemple: "admin", "recruteur", "candidat"
  children: JSX.Element;
}

export const RequireRole = ({ role, children }: RequireRoleProps) => {
  const { userType, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userType && userType !== role) {
      router.replace("/"); // Redirection vers la page d’accueil si non autorisé
    }
  }, [userType, loading]);

  if (loading || userType !== role) {
    return null; // Attendre pendant le chargement ou bloquer si mauvais rôle
  }

  return children;
};

