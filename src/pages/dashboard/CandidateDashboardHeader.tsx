
import React from "react";

interface CandidateDashboardHeaderProps {
  firstName?: string;
  email?: string;
}

const CandidateDashboardHeader: React.FC<CandidateDashboardHeaderProps> = ({
  firstName,
  email,
}) => (
  <div className="mb-8">
    <h1 className="text-2xl md:text-3xl font-bold mb-2">
      Bonjour {firstName || email?.split("@")[0] || "Candidat"} ! 👋
    </h1>
    <p className="text-muted-foreground text-sm md:text-base">
      Gérez votre profil professionnel et vos candidatures avec l&apos;aide de l&apos;IA
    </p>
  </div>
);

export default CandidateDashboardHeader;
