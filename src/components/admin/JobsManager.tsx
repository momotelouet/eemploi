import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Job {
  id: string;
  title: string;
  company_id: string;
  status: string;
}
type JobRaw = { id: string; title: string; company_id: string; status: string };

export default function JobsManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setJobs((data || []).map((j: JobRaw) => ({
      id: j.id,
      title: j.title,
      company_id: j.company_id,
      status: j.status
    })));
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('jobs').update({ status: 'active' }).eq('id', id);
    fetchJobs();
  };
  const handleReject = async (id: string) => {
    await supabase.from('jobs').update({ status: 'rejected' }).eq('id', id);
    fetchJobs();
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette offre ?')) return;
    await supabase.from('jobs').delete().eq('id', id);
    fetchJobs();
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Modération des offres d'emploi</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Titre</th>
            <th className="p-2">Entreprise</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id} className="border-b">
              <td className="p-2">{j.title}</td>
              <td className="p-2">{j.company_id}</td>
              <td className="p-2">
                <Badge className={j.status === 'active' ? 'bg-green-100 text-green-800' : j.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                  {j.status}
                </Badge>
              </td>
              <td className="p-2 space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleApprove(j.id)} disabled={j.status === 'active'}>Approuver</Button>
                <Button size="sm" variant="outline" onClick={() => handleReject(j.id)} disabled={j.status === 'rejected'}>Rejeter</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(j.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
