
import { Button } from "@/components/ui/button";
import { Plus, Search, Building } from "lucide-react";

interface QuickActionsProps {
  onPublishOfferClick: () => void;
  onTabChange: (tab: string) => void;
}

const QuickActions = ({ onPublishOfferClick, onTabChange }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Button 
        variant="outline" 
        className="h-auto p-6 flex flex-col items-center space-y-2"
        onClick={onPublishOfferClick}
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
