import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';

const types = [
	{ label: 'Tous', value: '' },
	{ label: 'Action', value: 'action' },
	{ label: 'Connexion', value: 'login' },
	{ label: 'Erreur', value: 'error' },
];

const SystemLogs = () => {
	const [logs, setLogs] = useState<any[]>([]);
	const [type, setType] = useState('');
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchLogs = async () => {
			setLoading(true);
			let query = supabase.from('admin_logs').select('*');
			if (type) query = query.eq('log_type', type);
			if (search) query = query.ilike('admin_email', `%${search}%`);
			const { data, error } = await query;
			if (!error && data) setLogs(data);
			setLoading(false);
		};
		fetchLogs();
	}, [type, search]);

	return (
		<div>
			<div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
				<select
					className='border rounded px-3 py-2'
					value={type}
					onChange={e => setType(e.target.value)}
				>
					{types.map(t => (
						<option key={t.value} value={t.value}>
							{t.label}
						</option>
					))}
				</select>
				<input
					className='border rounded px-3 py-2 flex-1'
					placeholder='Recherche admin, message...'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<Button size='sm' variant='outline' onClick={() => exportToCSV(logs, 'logs.csv')}>
					Exporter CSV
				</Button>
				<Button size='sm' variant='outline' onClick={() => exportToPDF(logs, 'logs.pdf')}>
					Exporter PDF
				</Button>
			</div>
			<div className='overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900'>
				<table className='min-w-full text-sm'>
					<thead>
						<tr className='bg-gray-100 dark:bg-gray-800'>
							<th className='p-3 text-left'>Date</th>
							<th className='p-3 text-left'>Admin</th>
							<th className='p-3 text-left'>Type</th>
							<th className='p-3 text-left'>Message</th>
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
						) : logs.length === 0 ? (
							<tr>
								<td colSpan={5} className='p-4 text-center'>
									Aucun log
								</td>
							</tr>
						) : (
							logs.map(log => (
								<tr key={log.id} className='border-b'>
									<td className='p-3'>
										{log.created_at
											? new Date(log.created_at).toLocaleString()
											: '-'}
									</td>
									<td className='p-3'>{log.admin_email || '-'}</td>
									<td className='p-3'>{log.log_type}</td>
									<td className='p-3'>{log.message}</td>
									<td className='p-3 flex gap-2'>
										<Button size='sm' variant='outline'>
											Détails
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default SystemLogs;
