
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RecruiterHubHeaderProps {
  onPublishOfferClick: () => void;
}

const RecruiterHubHeader = ({ onPublishOfferClick }: RecruiterHubHeaderProps) => {
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
      >
        <Plus className="w-4 h-4 mr-2" />
        Publier une offre
      </Button>
    </div>
  );
};

export default RecruiterHubHeader;
