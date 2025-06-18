import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';

const PaymentManagement = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editPayment, setEditPayment] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      let query = supabase.from('payments').select('*');
      if (search) query = query.ilike('recruiter_email', `%${search}%`);
      const { data, error } = await query;
      if (!error && data) setPayments(data);
      setLoading(false);
    };
    fetchPayments();
  }, [search]);

  const handleDelete = async (paymentId: string) => {
    if (!window.confirm('Confirmer la suppression de ce paiement ?')) return;
    setLoading(true);
    await supabase.from('payments').delete().eq('id', paymentId);
    setPayments(payments => payments.filter(p => p.id !== paymentId));
    setLoading(false);
  };
  const openEdit = (payment: any) => {
    setEditPayment(payment);
    setEditForm({ plan_name: payment.plan_name, amount: payment.amount, status: payment.status });
  };
  const closeEdit = () => { setEditPayment(null); setEditForm({}); };
  const handleEditChange = (e: any) => {
    setEditForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleEditSave = async () => {
    setSaving(true);
    await supabase.from('payments').update(editForm).eq('id', editPayment.id);
    setPayments(payments => payments.map(p => p.id === editPayment.id ? { ...p, ...editForm } : p));
    setSaving(false);
    closeEdit();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Recherche recruteur, plan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button size="sm" variant="outline" onClick={() => exportToCSV(payments, 'paiements.csv')}>Exporter CSV</Button>
        <Button size="sm" variant="outline" onClick={() => exportToPDF(payments, 'paiements.pdf')}>Exporter PDF</Button>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left">Recruteur</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Montant</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center">Chargement...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center">Aucun paiement</td></tr>
            ) : payments.map(payment => (
              <tr key={payment.id} className="border-b">
                <td className="p-3">{payment.recruiter_email || '-'}</td>
                <td className="p-3">{payment.plan_name || '-'}</td>
                <td className="p-3">{payment.amount} DH</td>
                <td className="p-3">{payment.created_at ? new Date(payment.created_at).toLocaleDateString() : '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(payment)}>Voir</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(payment.id)}>Impayé</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modale édition paiement */}
      <Dialog open={!!editPayment} onClose={closeEdit} className="fixed z-50 inset-0 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
          <Dialog.Title className="text-lg font-bold mb-4">Éditer paiement</Dialog.Title>
          <div className="space-y-3">
            <input className="border rounded px-3 py-2 w-full" name="plan_name" value={editForm.plan_name || ''} onChange={handleEditChange} placeholder="Plan" />
            <input className="border rounded px-3 py-2 w-full" name="amount" value={editForm.amount || ''} onChange={handleEditChange} placeholder="Montant" type="number" />
            <select className="border rounded px-3 py-2 w-full" name="status" value={editForm.status || ''} onChange={handleEditChange}>
              <option value="paid">Payé</option>
              <option value="unpaid">Impayé</option>
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

export default PaymentManagement;
