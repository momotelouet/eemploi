import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';

const statuses = [
	{ label: 'Tous', value: '' },
	{ label: 'Ouvert', value: 'open' },
	{ label: 'Résolu', value: 'resolved' },
	{ label: 'En attente', value: 'pending' },
];

const SupportFeedback = () => {
	const [tickets, setTickets] = useState<any[]>([]);
	const [status, setStatus] = useState('');
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [editTicket, setEditTicket] = useState<any>(null);
	const [editForm, setEditForm] = useState<any>({});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchTickets = async () => {
			setLoading(true);
			let query = supabase.from('support_tickets').select('*');
			if (status) query = query.eq('status', status);
			if (search) query = query.ilike('user_email', `%${search}%`);
			const { data, error } = await query;
			if (!error && data) setTickets(data);
			setLoading(false);
		};
		fetchTickets();
	}, [status, search]);

	const handleDelete = async (ticketId: string) => {
		if (!window.confirm('Confirmer la suppression de ce ticket ?')) return;
		setLoading(true);
		await supabase.from('support_tickets').delete().eq('id', ticketId);
		setTickets(tickets => tickets.filter(t => t.id !== ticketId));
		setLoading(false);
	};
	const openEdit = (ticket: any) => {
		setEditTicket(ticket);
		setEditForm({ subject: ticket.subject, status: ticket.status });
	};
	const closeEdit = () => { setEditTicket(null); setEditForm({}); };
	const handleEditChange = (e: any) => {
		setEditForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
	};
	const handleEditSave = async () => {
		setSaving(true);
		await supabase.from('support_tickets').update(editForm).eq('id', editTicket.id);
		setTickets(tickets => tickets.map(t => t.id === editTicket.id ? { ...t, ...editForm } : t));
		setSaving(false);
		closeEdit();
	};

	return (
		<div>
			<div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
				<select
					className='border rounded px-3 py-2'
					value={status}
					onChange={e => setStatus(e.target.value)}
				>
					{statuses.map(s => (
						<option key={s.value} value={s.value}>
							{s.label}
						</option>
					))}
				</select>
				<input
					className='border rounded px-3 py-2 flex-1'
					placeholder='Recherche utilisateur, sujet...'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<Button size='sm' variant='outline' onClick={() => exportToCSV(tickets, 'support.csv')}>
					Exporter CSV
				</Button>
				<Button size='sm' variant='outline' onClick={() => exportToPDF(tickets, 'support.pdf')}>
					Exporter PDF
				</Button>
			</div>
			<div className='overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900'>
				<table className='min-w-full text-sm'>
					<thead>
						<tr className='bg-gray-100 dark:bg-gray-800'>
							<th className='p-3 text-left'>Utilisateur</th>
							<th className='p-3 text-left'>Sujet</th>
							<th className='p-3 text-left'>Statut</th>
							<th className='p-3 text-left'>Date</th>
							<th className='p-3 text-left'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={5} className='p-4 text-center'>
									Chargement...
								</td>
							</tr>
						) : tickets.length === 0 ? (
							<tr>
								<td colSpan={5} className='p-4 text-center'>
									Aucun ticket
								</td>
							</tr>
						) : (
							tickets.map(ticket => (
								<tr key={ticket.id} className='border-b'>
									<td className='p-3'>{ticket.user_email}</td>
									<td className='p-3'>{ticket.subject}</td>
									<td className='p-3'>
										<span
											className={`px-2 py-1 rounded text-xs font-semibold ${
												ticket.status === 'resolved'
													? 'bg-green-100 text-green-700'
													: ticket.status === 'pending'
													? 'bg-yellow-100 text-yellow-700'
													: 'bg-red-100 text-red-700'
											}`}
										>
											{ticket.status}
										</span>
									</td>
									<td className='p-3'>
										{ticket.created_at
											? new Date(ticket.created_at).toLocaleDateString()
											: '-'}
									</td>
									<td className='p-3 flex gap-2'>
										<Button size="sm" variant="outline" onClick={() => openEdit(ticket)}>Voir</Button>
										<Button size="sm" variant="success">Résoudre</Button>
										<Button size="sm" variant="destructive" onClick={() => handleDelete(ticket.id)}>Supprimer</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
			<div className='mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6'>
				<div className='font-bold mb-2'>Feedback utilisateurs</div>
				<div className='h-32 flex items-center justify-center text-muted-foreground'>
					[Feedback, notes, commentaires]
				</div>
			</div>

			{/* Modale édition ticket support */}
			<Dialog open={!!editTicket} onClose={closeEdit} className="fixed z-50 inset-0 flex items-center justify-center">
				<Dialog.Overlay className="fixed inset-0 bg-black/30" />
				<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
					<Dialog.Title className="text-lg font-bold mb-4">Éditer ticket support</Dialog.Title>
					<div className="space-y-3">
						<input className="border rounded px-3 py-2 w-full" name="subject" value={editForm.subject || ''} onChange={handleEditChange} placeholder="Sujet" />
						<select className="border rounded px-3 py-2 w-full" name="status" value={editForm.status || ''} onChange={handleEditChange}>
							<option value="open">Ouvert</option>
							<option value="pending">En attente</option>
							<option value="resolved">Résolu</option>
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

export default SupportFeedback;
