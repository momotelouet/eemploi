import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';

const PlansManagement = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editPlan, setEditPlan] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      let query = supabase.from('subscriptions').select('*');
      if (search) query = query.ilike('user_email', `%${search}%`);
      const { data, error } = await query;
      if (!error && data) setPlans(data);
      setLoading(false);
    };
    fetchPlans();
  }, [search]);

  const handleDelete = async (planId: string) => {
    if (!window.confirm('Confirmer la suppression de cet abonnement ?')) return;
    setLoading(true);
    await supabase.from('subscriptions').delete().eq('id', planId);
    setPlans(plans => plans.filter(p => p.id !== planId));
    setLoading(false);
  };
  const openEdit = (plan: any) => {
    setEditPlan(plan);
    setEditForm({ plan_name: plan.plan_name, status: plan.status, start_date: plan.start_date, end_date: plan.end_date });
  };
  const closeEdit = () => { setEditPlan(null); setEditForm({}); };
  const handleEditChange = (e: any) => {
    setEditForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleEditSave = async () => {
    setSaving(true);
    await supabase.from('subscriptions').update(editForm).eq('id', editPlan.id);
    setPlans(plans => plans.map(p => p.id === editPlan.id ? { ...p, ...editForm } : p));
    setSaving(false);
    closeEdit();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Recherche utilisateur, plan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button size="sm" variant="outline" onClick={() => exportToCSV(plans, 'abonnements.csv')}>Exporter CSV</Button>
        <Button size="sm" variant="outline" onClick={() => exportToPDF(plans, 'abonnements.pdf')}>Exporter PDF</Button>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left">Utilisateur</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Début</th>
              <th className="p-3 text-left">Fin</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center">Chargement...</td></tr>
            ) : plans.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center">Aucun abonnement</td></tr>
            ) : plans.map(plan => (
              <tr key={plan.id} className="border-b">
                <td className="p-3">{plan.user_email || '-'}</td>
                <td className="p-3">{plan.plan_name || '-'}</td>
                <td className="p-3">{plan.start_date ? new Date(plan.start_date).toLocaleDateString() : '-'}</td>
                <td className="p-3">{plan.end_date ? new Date(plan.end_date).toLocaleDateString() : '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${plan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {plan.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(plan)}>Voir</Button>
                  <Button size="sm" variant="success">Assigner</Button>
                  <Button size="sm" variant="outline">Modifier</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)}>Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modale édition abonnement */}
      <Dialog open={!!editPlan} onClose={closeEdit} className="fixed z-50 inset-0 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
          <Dialog.Title className="text-lg font-bold mb-4">Éditer abonnement</Dialog.Title>
          <div className="space-y-3">
            <input className="border rounded px-3 py-2 w-full" name="plan_name" value={editForm.plan_name || ''} onChange={handleEditChange} placeholder="Plan" />
            <input className="border rounded px-3 py-2 w-full" name="start_date" value={editForm.start_date || ''} onChange={handleEditChange} placeholder="Début" type="date" />
            <input className="border rounded px-3 py-2 w-full" name="end_date" value={editForm.end_date || ''} onChange={handleEditChange} placeholder="Fin" type="date" />
            <select className="border rounded px-3 py-2 w-full" name="status" value={editForm.status || ''} onChange={handleEditChange}>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex gap-2 mt-6">
            <Button onClick={closeEdit} variant="outline">Annuler</Button>
            <Button onClick={handleEditSave} disabled={saving}>{saving ? 'Sauvegarde...' : 'Enregistrer'}</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PlansManagement;
