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

interface Company {
  id: string;
  name: string;
  validation_status: string;
  legal_doc_url?: string;
}

type CompanyRaw = { id?: string; name?: string; validation_status?: string; legal_doc_url?: string };

const CompanyValidation = () => {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [status, setStatus] = useState('');
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [editCompany, setEditCompany] = useState<Company | null>(null);
	const [editForm, setEditForm] = useState<{ name?: string; validation_status?: string; legal_doc_url?: string }>({});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchCompanies = async () => {
			setLoading(true);
			let query = supabase.from('companies').select('*');
			if (status) query = query.eq('validation_status', status);
			if (search) query = query.ilike('name', `%${search}%`);
			const { data, error } = await query;
			if (!error && data) setCompanies((data as CompanyRaw[]).map(c => ({
        id: c.id ?? '',
        name: c.name ?? '',
        validation_status: c.validation_status ?? '',
        legal_doc_url: c.legal_doc_url
      })));
			setLoading(false);
		};
		fetchCompanies();
	}, [status, search]);

	const handleDelete = async (companyId: string) => {
		if (!window.confirm('Confirmer la suppression de cette entreprise ?')) return;
		setLoading(true);
		await supabase.from('companies').delete().eq('id', companyId);
		setCompanies(companies => companies.filter(c => c.id !== companyId));
		setLoading(false);
	};
	const openEdit = (company: Company) => {
		setEditCompany(company);
		setEditForm({ name: company.name, validation_status: company.validation_status, legal_doc_url: company.legal_doc_url });
	};
	const closeEdit = () => { setEditCompany(null); setEditForm({}); };
	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setEditForm((f) => ({ ...f, [e.target.name]: e.target.value }));
	};
	const handleEditSave = async () => {
		setSaving(true);
		await supabase.from('companies').update(editForm).eq('id', editCompany.id);
		setCompanies(companies => companies.map(c => c.id === editCompany.id ? { ...c, ...editForm } : c));
		setSaving(false);
		closeEdit();
	};

	return (
		<div>
			<div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
				<select
					className="border rounded px-3 py-2"
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
					className="border rounded px-3 py-2 flex-1"
					placeholder="Recherche entreprise, recruteur..."
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<Button size="sm" variant="outline" onClick={() => exportToCSV(companies, 'entreprises.csv')}>
					Exporter CSV
				</Button>
				<Button size="sm" variant="outline" onClick={() => exportToPDF(companies, 'entreprises.pdf')}>
					Exporter PDF
				</Button>
			</div>
			<div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="bg-gray-100 dark:bg-gray-800">
							<th className="p-3 text-left">Nom</th>
							<th className="p-3 text-left">Statut</th>
							<th className="p-3 text-left">Documents</th>
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
						) : companies.length === 0 ? (
							<tr>
								<td colSpan={4} className="p-4 text-center">
									Aucune entreprise
								</td>
							</tr>
						) : (
							companies.map(company => (
								<tr key={company.id} className="border-b">
									<td className="p-3">{company.name}</td>
									<td className="p-3">
										<span
											className={`px-2 py-1 rounded text-xs font-semibold ${
												company.validation_status === 'approved'
													? 'bg-green-100 text-green-700'
													: company.validation_status === 'pending'
													? 'bg-yellow-100 text-yellow-700'
													: 'bg-red-100 text-red-700'
											}`}
										>
											{company.validation_status}
										</span>
									</td>
									<td className="p-3">
										{company.legal_doc_url ? (
											<a
												href={company.legal_doc_url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary underline"
											>
												Voir
											</a>
										) : (
											'—'
										)}
									</td>
									<td className="p-3 flex gap-2">
										<Button size="sm" variant="default">
											Valider
										</Button>
										<Button size="sm" variant="destructive" onClick={() => handleDelete(company.id)}>
											Rejeter
										</Button>
										<Button size="sm" variant="outline" onClick={() => openEdit(company)}>
											Éditer
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Modale édition entreprise */}
			<Dialog open={!!editCompany} onClose={closeEdit} className="fixed z-50 inset-0 flex items-center justify-center">
				<Dialog.Overlay className="fixed inset-0 bg-black/30" />
				<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
					<Dialog.Title className="text-lg font-bold mb-4">Éditer entreprise</Dialog.Title>
					<div className="space-y-3">
						<input className="border rounded px-3 py-2 w-full" name="name" value={editForm.name || ''} onChange={handleEditChange} placeholder="Nom" />
						<select className="border rounded px-3 py-2 w-full" name="validation_status" value={editForm.validation_status || ''} onChange={handleEditChange}>
							<option value="approved">Validé</option>
							<option value="pending">En attente</option>
							<option value="rejected">Rejeté</option>
						</select>
						<input className="border rounded px-3 py-2 w-full" name="legal_doc_url" value={editForm.legal_doc_url || ''} onChange={handleEditChange} placeholder="URL document légal" />
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

export default CompanyValidation;
