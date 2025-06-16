import { Button } from "@/components/ui/button";
import { Plus, Search, Building } from "lucide-react";

interface QuickActionsProps {
  onPublishOfferClick: () => void;
  onTabChange: (tab: string) => void;
  isPublicationBlocked?: boolean;
  profile?: any;
}

const UNPAID_THRESHOLD = 1000;

const QuickActions = ({ onPublishOfferClick, onTabChange, isPublicationBlocked, profile }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Button 
        variant="outline" 
        className="h-auto p-6 flex flex-col items-center space-y-2"
        onClick={onPublishOfferClick}
        disabled={isPublicationBlocked}
        title={isPublicationBlocked ? (profile?.status === 'suspended' ? 'Votre compte est suspendu. Veuillez contacter le support.' : `Votre solde impayé de ${profile?.unpaid_balance} DH a atteint le seuil de ${UNPAID_THRESHOLD} DH. Veuillez le régler pour continuer.`) : 'Publier une offre'}
      >
        <Plus className="w-8 h-8 text-eemploi-primary" />
        <span className="font-semibold">Publier une offre</span>
        <span className="text-sm text-muted-foreground text-center">
          Créez et publiez une nouvelle offre d'emploi
        </span>
      </Button>
      
      <Button 
        variant="outline" 
        className="h-auto p-6 flex flex-col items-center space-y-2"
        onClick={() => onTabChange("search")}
      >
        <Search className="w-8 h-8 text-eemploi-primary" />
        <span className="font-semibold">Rechercher des candidats</span>
        <span className="text-sm text-muted-foreground text-center">
          Trouvez les profils qui correspondent à vos besoins
        </span>
      </Button>
      
      <Button 
        variant="outline" 
        className="h-auto p-6 flex flex-col items-center space-y-2"
        onClick={() => onTabChange("company")}
      >
        <Building className="w-8 h-8 text-eemploi-primary" />
        <span className="font-semibold">Gérer mon entreprise</span>
        <span className="text-sm text-muted-foreground text-center">
          Modifiez les informations de votre entreprise
        </span>
      </Button>
    </div>
  );
};

export default QuickActions;
