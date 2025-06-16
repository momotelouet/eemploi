import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RecruiterHubHeaderProps {
  onPublishOfferClick: () => void;
  isPublicationBlocked?: boolean;
  profile?: any;
}

const UNPAID_THRESHOLD = 1000;

const RecruiterHubHeader = ({ onPublishOfferClick, isPublicationBlocked, profile }: RecruiterHubHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Hub Recruteur</h1>
        <p className="text-muted-foreground">
          Gérez vos recrutements et trouvez les meilleurs talents
        </p>
      </div>
      <Button 
        className="bg-eemploi-primary hover:bg-eemploi-primary/90"
        onClick={onPublishOfferClick}
        disabled={isPublicationBlocked}
        title={isPublicationBlocked ? (profile?.status === 'suspended' ? 'Votre compte est suspendu. Veuillez contacter le support.' : `Votre solde impayé de ${profile?.unpaid_balance} DH a atteint le seuil de ${UNPAID_THRESHOLD} DH. Veuillez le régler pour continuer.`) : 'Publier une offre'}
      >
        <Plus className="w-4 h-4 mr-2" />
        Publier une offre
      </Button>
    </div>
  );
};

export default RecruiterHubHeader;
