
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";

const ApplicationsHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestion des candidatures</h1>
        <p className="text-muted-foreground">
          Suivez et gérez toutes les candidatures reçues
        </p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>
    </div>
  );
};

export default ApplicationsHeader;
