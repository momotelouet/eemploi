import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CompaniesManager() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setCompanies(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleSuspend = async (id: string, suspended: boolean) => {
    await supabase.from('companies').update({ suspended }).eq('id', id);
    fetchCompanies();
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette entreprise ?')) return;
    await supabase.from('companies').delete().eq('id', id);
    fetchCompanies();
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Gestion des entreprises</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nom</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.name}</td>
              <td className="p-2">
                {c.suspended ? <Badge className="bg-red-100 text-red-800">Suspendue</Badge> : <Badge className="bg-green-100 text-green-800">Active</Badge>}
              </td>
              <td className="p-2 space-x-2">
                <Button size="sm" variant={c.suspended ? 'outline' : 'destructive'} onClick={() => handleSuspend(c.id, !c.suspended)}>
                  {c.suspended ? 'Réactiver' : 'Suspendre'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
