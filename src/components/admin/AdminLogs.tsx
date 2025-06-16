import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Démo : logs statiques
    setLogs([
      { id: 1, message: 'Nouvel utilisateur inscrit', date: '2025-06-16 10:12' },
      { id: 2, message: 'Offre d\'emploi approuvée', date: '2025-06-16 09:55' },
      { id: 3, message: 'Entreprise suspendue', date: '2025-06-15 18:30' },
      { id: 4, message: 'Candidature supprimée', date: '2025-06-15 17:10' },
    ]);
    setLoading(false);
  }, []);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Logs d'activité</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <ul className="space-y-2">
            {logs.map(log => (
              <li key={log.id} className="text-sm flex justify-between border-b pb-1">
                <span>{log.message}</span>
                <span className="text-xs text-muted-foreground">{log.date}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
