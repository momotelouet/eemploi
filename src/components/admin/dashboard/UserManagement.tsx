import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';

const roles = [
	{ label: 'Tous', value: '' },
	{ label: 'Candidat', value: 'candidat' },
	{ label: 'Recruteur', value: 'recruteur' },
	{ label: 'Admin', value: 'admin' },
];

const UserManagement = () => {
	const [users, setUsers] = useState<any[]>([]);
	const [role, setRole] = useState('');
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [editUser, setEditUser] = useState<any>(null);
	const [editForm, setEditForm] = useState<any>({});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			let query = supabase.from('profiles').select('*');
			if (role) query = query.eq('user_type', role);
			if (search) query = query.ilike('email', `%${search}%`);
			const { data, error } = await query;
			if (!error && data) setUsers(data);
			setLoading(false);
		};
		fetchUsers();
	}, [role, search]);

	const handleDelete = async (userId: string) => {
		if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;
		setLoading(true);
		await supabase.from('profiles').delete().eq('id', userId);
		setUsers(users => users.filter(u => u.id !== userId));
		setLoading(false);
	};

	const openEdit = (user: any) => {
		setEditUser(user);
		setEditForm({ first_name: user.first_name, last_name: user.last_name, email: user.email, user_type: user.user_type });
	};
	const closeEdit = () => { setEditUser(null); setEditForm({}); };
	const handleEditChange = (e: any) => {
		setEditForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
	};
	const handleEditSave = async () => {
		setSaving(true);
		await supabase.from('profiles').update(editForm).eq('id', editUser.id);
		setUsers(users => users.map(u => u.id === editUser.id ? { ...u, ...editForm } : u));
		setSaving(false);
		closeEdit();
	};

	return (
		<div>
			<div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
				<select
					className="border rounded px-3 py-2"
					value={role}
					onChange={e => setRole(e.target.value)}
				>
					{roles.map(r => (
						<option key={r.value} value={r.value}>
							{r.label}
						</option>
					))}
				</select>
				<input
					className="border rounded px-3 py-2 flex-1"
					placeholder="Recherche email, nom..."
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<Button size="sm" variant="outline" onClick={() => exportToCSV(users, 'utilisateurs.csv')}>Exporter CSV</Button>
				<Button size="sm" variant="outline" onClick={() => exportToPDF(users, 'utilisateurs.pdf')}>Exporter PDF</Button>
			</div>
			<div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="bg-gray-100 dark:bg-gray-800">
							<th className="p-3 text-left">Nom</th>
							<th className="p-3 text-left">Email</th>
							<th className="p-3 text-left">Rôle</th>
							<th className="p-3 text-left">Date inscription</th>
							<th className="p-3 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={5} className="p-4 text-center">
									Chargement...
								</td>
							</tr>
						) : users.length === 0 ? (
							<tr>
								<td colSpan={5} className="p-4 text-center">
									Aucun utilisateur
								</td>
							</tr>
						) : (
							users.map(user => (
								<tr key={user.id} className="border-b">
									<td className="p-3">
										{user.first_name} {user.last_name}
									</td>
									<td className="p-3">{user.email}</td>
									<td className="p-3">
										<span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold">
											{user.user_type}
										</span>
									</td>
									<td className="p-3">
										{user.created_at
											? new Date(user.created_at).toLocaleDateString()
											: '-'}
									</td>
									<td className="p-3 flex gap-2">
										<Button size="sm" variant="outline" onClick={() => openEdit(user)}>Profil</Button>
										<Button size="sm" variant="outline">
											Activer/Désactiver
										</Button>
										<Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>Supprimer</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Modale édition utilisateur */}
			<Dialog open={!!editUser} onClose={closeEdit} className="fixed z-50 inset-0 flex items-center justify-center">
				<Dialog.Overlay className="fixed inset-0 bg-black/30" />
				<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
					<Dialog.Title className="text-lg font-bold mb-4">Éditer utilisateur</Dialog.Title>
					<div className="space-y-3">
						<input className="border rounded px-3 py-2 w-full" name="first_name" value={editForm.first_name || ''} onChange={handleEditChange} placeholder="Prénom" />
						<input className="border rounded px-3 py-2 w-full" name="last_name" value={editForm.last_name || ''} onChange={handleEditChange} placeholder="Nom" />
						<input className="border rounded px-3 py-2 w-full" name="email" value={editForm.email || ''} onChange={handleEditChange} placeholder="Email" />
						<select className="border rounded px-3 py-2 w-full" name="user_type" value={editForm.user_type || ''} onChange={handleEditChange}>
							<option value="candidat">Candidat</option>
							<option value="recruteur">Recruteur</option>
							<option value="admin">Admin</option>
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

export default UserManagement;
