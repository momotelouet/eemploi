import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';

const types = [
	{ label: 'Toutes', value: '' },
	{ label: 'Candidat', value: 'candidat' },
	{ label: 'Recruteur', value: 'recruteur' },
	{ label: 'Tous', value: 'all' },
];

const NotificationsCenter = () => {
	const [notifications, setNotifications] = useState<any[]>([]);
	const [target, setTarget] = useState('');
	const [loading, setLoading] = useState(false);
	const [editNotif, setEditNotif] = useState<any>(null);
	const [editForm, setEditForm] = useState<any>({});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchNotifications = async () => {
			setLoading(true);
			let query = supabase.from('notifications').select('*');
			if (target) query = query.eq('target', target);
			const { data, error } = await query;
			if (!error && data) setNotifications(data);
			setLoading(false);
		};
		fetchNotifications();
	}, [target]);

	const handleDelete = async (notifId: string) => {
		if (!window.confirm('Confirmer la suppression de cette notification ?')) return;
		setLoading(true);
		await supabase.from('notifications').delete().eq('id', notifId);
		setNotifications(notifs => notifs.filter(n => n.id !== notifId));
		setLoading(false);
	};
	const openEdit = (notif: any) => {
		setEditNotif(notif);
		setEditForm({ title: notif.title, message: notif.message, target: notif.target });
	};
	const closeEdit = () => { setEditNotif(null); setEditForm({}); };
	const handleEditChange = (e: any) => {
		setEditForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
	};
	const handleEditSave = async () => {
		setSaving(true);
		await supabase.from('notifications').update(editForm).eq('id', editNotif.id);
		setNotifications(notifs => notifs.map(n => n.id === editNotif.id ? { ...n, ...editForm } : n));
		setSaving(false);
		closeEdit();
	};

	return (
		<div>
			<div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
				<select
					className="border rounded px-3 py-2"
					value={target}
					onChange={e => setTarget(e.target.value)}
				>
					{types.map(t => (
						<option key={t.value} value={t.value}>
							{t.label}
						</option>
					))}
				</select>
				<Button size="sm" variant="success">
					Créer notification
				</Button>
				<Button size="sm" variant="outline" onClick={() => exportToCSV(notifications, 'notifications.csv')}>
					Exporter CSV
				</Button>
				<Button size="sm" variant="outline" onClick={() => exportToPDF(notifications, 'notifications.pdf')}>
					Exporter PDF
				</Button>
			</div>
			<div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="bg-gray-100 dark:bg-gray-800">
							<th className="p-3 text-left">Titre</th>
							<th className="p-3 text-left">Message</th>
							<th className="p-3 text-left">Cible</th>
							<th className="p-3 text-left">Date</th>
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
						) : notifications.length === 0 ? (
							<tr>
								<td colSpan={5} className="p-4 text-center">
									Aucune notification
								</td>
							</tr>
						) : (
							notifications.map(notif => (
								<tr key={notif.id} className="border-b">
									<td className="p-3">{notif.title}</td>
									<td className="p-3">{notif.message}</td>
									<td className="p-3">{notif.target}</td>
									<td className="p-3">
										{notif.created_at
											? new Date(
													notif.created_at
											  ).toLocaleString()
											: '-'}
									</td>
									<td className="p-3 flex gap-2">
										<Button size="sm" variant="outline" onClick={() => openEdit(notif)}>Voir</Button>
										<Button size="sm" variant="destructive" onClick={() => handleDelete(notif.id)}>Supprimer</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Modale édition notification */}
			<Dialog open={!!editNotif} onClose={closeEdit} className="fixed z-50 inset-0 flex items-center justify-center">
				<Dialog.Overlay className="fixed inset-0 bg-black/30" />
				<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
					<Dialog.Title className="text-lg font-bold mb-4">Éditer notification</Dialog.Title>
					<div className="space-y-3">
						<input className="border rounded px-3 py-2 w-full" name="title" value={editForm.title || ''} onChange={handleEditChange} placeholder="Titre" />
						<input className="border rounded px-3 py-2 w-full" name="message" value={editForm.message || ''} onChange={handleEditChange} placeholder="Message" />
						<select className="border rounded px-3 py-2 w-full" name="target" value={editForm.target || ''} onChange={handleEditChange}>
							<option value="all">Tous</option>
							<option value="candidat">Candidat</option>
							<option value="recruteur">Recruteur</option>
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

export default NotificationsCenter;
