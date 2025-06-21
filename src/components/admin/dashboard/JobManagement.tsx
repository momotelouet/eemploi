import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  company_name: string;
  status: string;
  expires_at?: string;
}

type JobRaw = Partial<Job>;

const statuses = [
  { label: 'Tous', value: '' },
  { label: 'Actif', value: 'active' },
  { label: 'En pause', value: 'paused' },
  { label: 'Clôturé', value: 'closed' },
];

const JobManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState<Partial<Job>>({});
  const [saving, setSaving] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    let query = supabase.from('jobs').select('*');
    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);
    const { data, error } = await query;
    if (!error && data) {
      setJobs((data as JobRaw[]).map(j => ({
        id: j.id ?? '',
        title: j.title ?? '',
        company_name: j.company_name ?? '',
        status: j.status ?? '',
        expires_at: j.expires_at,
      })));
    } else {
      toast.error('Erreur lors du chargement des offres');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [status, search]);

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Confirmer la suppression de cette offre ?')) return;
    setLoading(true);
    await supabase.from('jobs').delete().eq('id', jobId);
    setJobs(jobs => jobs.filter(j => j.id !== jobId));
    setLoading(false);
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    setLoading(true);
    const { error } = await supabase.from('jobs').update({ status: newStatus }).eq('id', jobId);
    if (!error) {
      setJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
      toast.success(`Offre ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}`);
    } else {
      toast.error("Erreur lors de la mise à jour du statut");
    }
    setLoading(false);
  };

  const openEdit = (job: Job) => {
    setEditJob(job);
    setEditForm({
      id: job.id,
      title: job.title,
      company_name: job.company_name,
      status: job.status,
      expires_at: job.expires_at,
    });
  };

  const closeEdit = () => {
    setEditJob(null);
    setEditForm({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    if (!editJob) return;
    setSaving(true);
    await supabase.from('jobs').update(editForm).eq('id', editJob.id);
    setJobs(jobs => jobs.map(j => j.id === editJob.id ? { ...j, ...editForm } : j));
    setSaving(false);
    closeEdit();
    toast.success("Offre mise à jour");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Recherche titre, entreprise..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button size="sm" variant="outline" onClick={() => exportToCSV(jobs, 'offres.csv')}>Exporter CSV</Button>
        <Button size="sm" variant="outline" onClick={() => exportToPDF(jobs, 'offres.pdf')}>Exporter PDF</Button>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left">Titre</th>
              <th className="p-3 text-left">Entreprise</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Expiration</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Chargement...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">Aucune offre</td></tr>
            ) : (
              jobs.map(job => (
                <tr key={job.id} className="border-b">
                  <td className="p-3">{job.title}</td>
                  <td className="p-3">{job.company_name || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      job.status === 'active' ? 'bg-green-100 text-green-700'
                      : job.status === 'paused' ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                    }`}>
                  {job.status === 'active' ? 'Actif' : job.status === 'paused' ? 'En pause' : 'Clôturé'}
                </span>
                  </td>
                  <td className="p-3">{job.expires_at ? new Date(job.expires_at).toLocaleDateString() : '-'}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(job)}>Voir</Button>
                    <Button size="sm" className="bg-green-500 text-white hover:bg-green-600" onClick={() => handleStatusChange(job.id, 'active')}>Activer</Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(job.id, 'paused')}>Mettre en pause</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(job.id, 'closed')}>Clôturer</Button>
                    <Button size="sm" variant="outline" onClick={() => alert(`Rediriger vers /jobs/${job.id}/applications`)}>Candidatures</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modale édition offre */}
      <Dialog open={!!editJob} onClose={closeEdit}>
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-4">Éditer offre</Dialog.Title>
            <div className="space-y-3">
              <input className="border rounded px-3 py-2 w-full" name="title" value={editForm.title || ''} onChange={handleEditChange} placeholder="Titre" />
              <input className="border rounded px-3 py-2 w-full" name="company_name" value={editForm.company_name || ''} onChange={handleEditChange} placeholder="Entreprise" />
              <select className="border rounded px-3 py-2 w-full" name="status" value={editForm.status || ''} onChange={handleEditChange}>
                <option value="active">Actif</option>
                <option value="paused">En pause</option>
                <option value="closed">Clôturé</option>
              </select>
              <input className="border rounded px-3 py-2 w-full" type="date" name="expires_at" value={editForm.expires_at || ''} onChange={handleEditChange} />
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={closeEdit} variant="outline">Annuler</Button>
              <Button onClick={handleEditSave} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default JobManagement;
