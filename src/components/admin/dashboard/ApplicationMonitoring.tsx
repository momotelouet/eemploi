import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';
import { toast } from 'sonner';

interface Application {
  id: string;
  candidate_id: string;
  job_id?: string;
  status: string;
  applied_at?: string;
}

type ApplicationRaw = Partial<Application>;

const statuses = [
  { label: 'Tous', value: '' },
  { label: 'En cours', value: 'pending' },
  { label: 'Accepté', value: 'accepted' },
  { label: 'Refusé', value: 'rejected' },
  { label: 'Signalé', value: 'flagged' },
];

const ApplicationMonitoring = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [editForm, setEditForm] = useState<{ status?: string }>({});
  const [saving, setSaving] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    let query = supabase.from('applications').select('*');
    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('candidate_id', `%${search}%`);

    const { data, error } = await query;
    if (error) {
      toast.error("Erreur lors du chargement des candidatures");
      setApplications([]);
    } else {
      setApplications((data as ApplicationRaw[]).map(app => ({
        id: app.id ?? '',
        candidate_id: app.candidate_id ?? '',
        job_id: app.job_id ?? '',
        status: app.status ?? '',
        applied_at: app.applied_at ?? '',
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [status, search]);

  const handleDelete = async (appId: string) => {
    if (!window.confirm('Confirmer la suppression de cette candidature ?')) return;
    setLoading(true);
    const { error } = await supabase.from('applications').delete().eq('id', appId);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      setApplications(apps => apps.filter(a => a.id !== appId));
      toast.success("Candidature supprimée");
    }
    setLoading(false);
  };

  const openEdit = (app: Application) => {
    setEditApp(app);
    setEditForm({ status: app.status });
  };

  const closeEdit = () => {
    setEditApp(null);
    setEditForm({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('applications').update(editForm).eq('id', editApp?.id);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      setApplications(apps =>
        apps.map(a => a.id === editApp?.id ? { ...a, ...editForm } : a)
      );
      toast.success("Candidature mise à jour");
      closeEdit();
    }
    setSaving(false);
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
          placeholder="Recherche candidat..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button size="sm" variant="outline" onClick={() => exportToCSV(applications, 'candidatures.csv')}>Exporter CSV</Button>
        <Button size="sm" variant="outline" onClick={() => exportToPDF(applications, 'candidatures.pdf')}>Exporter PDF</Button>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left">Candidat</th>
              <th className="p-3 text-left">Offre</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Chargement...</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">Aucune candidature</td></tr>
            ) : applications.map(app => (
              <tr key={app.id} className="border-b">
                <td className="p-3">{app.candidate_id}</td>
                <td className="p-3">{app.job_id ?? '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    app.status === 'flagged' ? 'bg-red-100 text-red-700' :
                    app.status === 'rejected' ? 'bg-gray-300 text-gray-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-3">{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '-'}</td>
                <td className="p-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(app)}>Voir</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(app.id)}>Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editApp} onClose={closeEdit}>
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
            <Dialog.Title className="text-lg font-bold mb-4">Éditer candidature</Dialog.Title>
            <div className="space-y-3">
              <select
                className="border rounded px-3 py-2 w-full"
                name="status"
                value={editForm.status || ''}
                onChange={handleEditChange}
              >
                <option value="pending">En cours</option>
                <option value="accepted">Accepté</option>
                <option value="rejected">Refusé</option>
                <option value="flagged">Signalé</option>
              </select>
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

export default ApplicationMonitoring;
