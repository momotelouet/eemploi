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
	created_at?: string;
};

const AdminRoles = () => {
	const [admins, setAdmins] = useState<Admin[]>([]);
	const [role, setRole] = useState('');
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
	const [editForm, setEditForm] = useState<{ email?: string; admin_role?: string }>({});
	const [saving, setSaving] = useState(false);

	const fetchAdmins = async (role: string, search: string) => {
		setLoading(true);
		let query = supabase.from('profiles').select('*').eq('user_type', 'admin');
		// @ts-expect-error: Typage Supabase incomplet, à corriger lors de la régénération des types
		if (role) query = query.eq('admin_role', role);
		if (search) query = query.ilike('email', `%${search}%`);
		const { data, error } = await query;
		if (error) {
			toast.error("Erreur lors du chargement des admins");
			setAdmins([]);
		} else {
			setAdmins(
				(data as AdminRaw[]).map((a) => ({
					id: a.id ?? '',
					email: a.email ?? '',
					admin_role: a.admin_role ?? '',
					created_at: a.created_at ?? '',
				}))
			);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchAdmins(role, search);
	}, [role, search]);

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
		setSaving(true);
		// @ts-expect-error: Typage Supabase incomplet, à corriger lors de la régénération des types
		const { error } = await supabase.from('profiles').update(editForm).eq('id', editAdmin?.id);
		if (error) toast.error("Erreur lors de la mise à jour");
		else {
			setAdmins((admins) =>
				admins.map((a) =>
					a.id === editAdmin?.id ? { ...a, ...editForm } : a
				)
			);
			toast.success("Admin mis à jour");
			closeEdit();
		}
		setSaving(false);
	};

	return (
		<div>
			<div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
				<select
					className="border rounded px-3 py-2"
					value={role}
					onChange={(e) => setRole(e.target.value)}
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
				<Button size="sm" variant="default" onClick={() => toast.info("Formulaire de création à implémenter")}>Créer admin</Button>
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
							<th className="p-3 text-left">Email</th>
							<th className="p-3 text-left">Rôle</th>
							<th className="p-3 text-left">Date création</th>
							<th className="p-3 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={4} className="p-4 text-center">
									Chargement...
								</td>
							</tr>
						) : admins.length === 0 ? (
							<tr>
								<td colSpan={4} className="p-4 text-center">
									Aucun admin trouvé
								</td>
							</tr>
						) : (
							admins.map((admin) => (
								<tr key={admin.id} className="border-b">
									<td className="p-3">{admin.email}</td>
									<td className="p-3">{admin.admin_role || 'admin'}</td>
									<td className="p-3">{admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '-'}</td>
									<td className="p-3 flex gap-2">
										<Button size="sm" variant="outline" onClick={() => openEdit(admin)}>
											Permissions
										</Button>
										<Button size="sm" variant="outline" onClick={() => toast("Pas encore implémenté")}>Logs</Button>
										<Button size="sm" variant="destructive" onClick={() => handleDelete(admin.id)}>
											Supprimer
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Modale d'édition */}
			<Dialog open={!!editAdmin} onClose={closeEdit} className="fixed z-50 inset-0 flex items-center justify-center">
				<div className="fixed inset-0 bg-black/30" />
				<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
					<Dialog.Title className="text-lg font-bold mb-4">Éditer admin</Dialog.Title>
					<div className="space-y-3">
						<input
							className="border rounded px-3 py-2 w-full"
							name="email"
							value={editForm.email || ''}
							onChange={handleEditChange}
							placeholder="Email"
							disabled
						/>
						<select
							className="border rounded px-3 py-2 w-full"
							name="admin_role"
							value={editForm.admin_role || ''}
							onChange={handleEditChange}
						>
							<option value="superadmin">Super admin</option>
							<option value="admin">Admin</option>
							<option value="readonly">Lecture seule</option>
						</select>
					</div>
					<div className="flex gap-2 mt-6">
						<Button onClick={closeEdit} variant="outline">
							Annuler
						</Button>
						<Button onClick={handleEditSave} disabled={saving}>
							{saving ? 'Sauvegarde...' : 'Enregistrer'}
						</Button>
					</div>
				</div>
			</Dialog>
		</div>
	);
};

export default AdminRoles;
