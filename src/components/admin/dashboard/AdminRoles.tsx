import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';
import { toast } from 'sonner';

const roles = [
  { label: 'Tous', value: '' },
  { label: 'Super admin', value: 'superadmin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Lecture seule', value: 'readonly' },
];

interface Admin {
  id: string;
  email: string;
  admin_role: string;
  created_at?: string;
}

type AdminRaw = {
  id?: string;
  email?: string;
  admin_role?: string;
  user_type?: string;
  created_at?: string;
};

const AdminRoles = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminRoleFilter, setAdminRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [editForm, setEditForm] = useState<{ email?: string; admin_role?: string }>({});
  const [saving, setSaving] = useState(false);

  const fetchAdmins = async (adminRole: string, searchTerm: string) => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('id, email, user_type, admin_role, created_at')
      .eq('user_type', 'admin');

    if (adminRole) {
      query = query.eq('admin_role', adminRole);
    }

    if (searchTerm) {
      query = query.ilike('email', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Erreur lors du chargement des admins");
      setAdmins([]);
    } else {
      setAdmins(
        (data as AdminRaw[]).map((a) => ({
          id: a.id ?? '',
          email: a.email ?? '',
          admin_role: a.admin_role ?? 'admin',
          created_at: a.created_at ?? '',
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins(adminRoleFilter, search);
  }, [adminRoleFilter, search]);

  const handleDelete = async (adminId: string) => {
    if (!window.confirm('Confirmer la suppression de cet admin ?')) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').delete().eq('id', adminId);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      setAdmins((admins) => admins.filter((a) => a.id !== adminId));
      toast.success("Admin supprimé");
    }
    setLoading(false);
  };

  const openEdit = (admin: Admin) => {
    setEditAdmin(admin);
    setEditForm({ email: admin.email, admin_role: admin.admin_role });
  };

  const closeEdit = () => {
    setEditAdmin(null);
    setEditForm({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    if (!editAdmin) return;
    setSaving(true);

    try {
      // Met à jour admin_role dans Supabase
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({ admin_role: editForm.admin_role })
        .eq('id', editAdmin.id);

      if (supabaseError) throw supabaseError;

      // Met à jour aussi user_type via API (au cas où on souhaite modifier cela plus tard)
      const res = await fetch('/api/update-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editAdmin.id, userType: 'admin' }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Erreur inconnue');
      }

      setAdmins((admins) =>
        admins.map((a) =>
          a.id === editAdmin.id ? { ...a, admin_role: editForm.admin_role || 'admin' } : a
        )
      );
      toast.success("Admin mis à jour");
      closeEdit();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <select
          className="border rounded px-3 py-2"
          value={adminRoleFilter}
          onChange={(e) => setAdminRoleFilter(e.target.value)}
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Recherche email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button size="sm" variant="default" onClick={() => toast.info("Formulaire de création à implémenter")}>
          Créer admin
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportToCSV(admins, 'admins.csv')}>
          Exporter CSV
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportToPDF(admins, 'admins.pdf')}>
          Exporter PDF
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th cl
