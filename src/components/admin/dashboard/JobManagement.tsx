import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';

const statuses = [
	{ label: 'Tous', value: '' },
	{ label: 'Validé', value: 'approved' },
	{ label: 'En attente', value: 'pending' },
	{ label: 'Rejeté', value: 'rejected' },
];

const JobManagement = () => {
	const [jobs, setJobs] = useState<any[]>([]);
	const [status, setStatus] = useState('');
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [editJob, setEditJob] = useState<any>(null);
	const [editForm, setEditForm] = useState<any>({});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchJobs = async () => {
			setLoading(true);
			let query = supabase.from('jobs').select('*');
			if (status) query = query.eq('validation_status', status);
			if (search) query = query.ilike('title', `%${search}%`);
			const { data, error } = await query;
			if (!error && data) setJobs(data);
			setLoading(false);
		};
		fetchJobs();
	}, [status, search]);

	const handleDelete = async (jobId: string) => {
		if (!window.confirm('Confirmer la suppression de cette offre ?')) return;
		setLoading(true);
		await supabase.from('jobs').delete().eq('id', jobId);
		setJobs(jobs => jobs.filter(j => j.id !== jobId));
		setLoading(false);
	};
	const openEdit = (job: any) => {
		setEditJob(job);
		setEditForm({ title: job.title, company_name: job.company_name, validation_status: job.validation_status, expiration_date: job.expiration_date });
	};
	const closeEdit = () => { setEditJob(null); setEditForm({}); };
	const handleEditChange = (e: any) => {
		setEditForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
	};
	const handleEditSave = async () => {
		setSaving(true);
		await supabase.from('jobs').update(editForm).eq('id', editJob.id);
		setJobs(jobs => jobs.map(j => j.id === editJob.id ? { ...j, ...editForm } : j));
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
					placeholder='Recherche titre, entreprise...'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<Button size='sm' variant='outline' onClick={() => exportToCSV(jobs, 'offres.csv')}>
					Exporter CSV
				</Button>
				<Button size='sm' variant='outline' onClick={() => exportToPDF(jobs, 'offres.pdf')}>
					Exporter PDF
				</Button>
			</div>
			<div className='overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900'>
				<table className='min-w-full text-sm'>
					<thead>
						<tr className='bg-gray-100 dark:bg-gray-800'>
							<th className='p-3 text-left'>Titre</th>
							<th className='p-3 text-left'>Entreprise</th>
							<th className='p-3 text-left'>Statut</th>
							<th className='p-3 text-left'>Expiration</th>
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
						) : jobs.length === 0 ? (
							<tr>
								<td colSpan={5} className='p-4 text-center'>
									Aucune offre
								</td>
							</tr>
						) : (
							jobs.map(job => (
								<tr key={job.id} className='border-b'>
									<td className='p-3'>{job.title}</td>
									<td className='p-3'>{job.company_name || '-'}</td>
									<td className='p-3'>
										<span
											className={`px-2 py-1 rounded text-xs font-semibold ${
												job.validation_status === 'approved'
													? 'bg-green-100 text-green-700'
													: job.validation_status === 'pending'
													? 'bg-yellow-100 text-yellow-700'
													: 'bg-red-100 text-red-700'
											}`}
										>
											{job.validation_status}
										</span>
									</td>
									<td className='p-3'>
										{job.expiration_date
											? new Date(job.expiration_date).toLocaleDateString()
											: '-'}
									</td>
									<td className='p-3 flex gap-2'>
										<Button size='sm' variant='outline' onClick={() => openEdit(job)}>Voir</Button>
										<Button size='sm' variant='success'>Approuver</Button>
										<Button size='sm' variant='destructive' onClick={() => handleDelete(job.id)}>Rejeter</Button>
										<Button size='sm' variant='outline'>Candidatures</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Modale édition offre */}
			<Dialog open={!!editJob} onClose={closeEdit} className="fixed z-50 inset-0 flex items-center justify-center">
				<Dialog.Overlay className="fixed inset-0 bg-black/30" />
				<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
					<Dialog.Title className="text-lg font-bold mb-4">Éditer offre</Dialog.Title>
					<div className="space-y-3">
						<input className="border rounded px-3 py-2 w-full" name="title" value={editForm.title || ''} onChange={handleEditChange} placeholder="Titre" />
						<input className="border rounded px-3 py-2 w-full" name="company_name" value={editForm.company_name || ''} onChange={handleEditChange} placeholder="Entreprise" />
						<select className="border rounded px-3 py-2 w-full" name="validation_status" value={editForm.validation_status || ''} onChange={handleEditChange}>
							<option value="approved">Validé</option>
							<option value="pending">En attente</option>
							<option value="rejected">Rejeté</option>
						</select>
						<input className="border rounded px-3 py-2 w-full" name="expiration_date" value={editForm.expiration_date || ''} onChange={handleEditChange} placeholder="Date d'expiration" type="date" />
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

export default JobManagement;
