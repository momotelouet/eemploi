import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false);

  const handleToggleMaintenance = () => {
    setMaintenance((prev) => !prev);
    toast.success('Mode maintenance ' + (!maintenance ? 'activé' : 'désactivé'));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Configuration système</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <span>Mode maintenance :</span>
          <Button variant={maintenance ? 'destructive' : 'outline'} onClick={handleToggleMaintenance}>
            {maintenance ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">(Démo : ce bouton ne change pas l’état réel du serveur)</div>
      </CardContent>
    </Card>
  );
}
