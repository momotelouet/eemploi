import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  suspended: boolean;
}
type UserRaw = { id: string; email?: string; first_name: string; last_name: string; user_type: string; suspended?: boolean };

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setUsers((data || []).map((u: UserRaw) => ({
      id: u.id,
      email: u.email ?? '',
      first_name: u.first_name,
      last_name: u.last_name,
      user_type: u.user_type,
      suspended: u.suspended ?? false
    })));
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id: string, user_type: string) => {
    await supabase.from('profiles').update({ user_type }).eq('id', id);
    fetchUsers();
  };

  const handleSuspend = async (id: string, suspended: boolean) => {
    await supabase.from('profiles').update({ suspended } as Partial<User>).eq('id', id);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    fetchUsers();
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Liste des utilisateurs</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Email</th>
            <th className="p-2">Nom</th>
            <th className="p-2">Type</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.first_name} {u.last_name}</td>
              <td className="p-2">
                <select value={u.user_type} onChange={e => handleRoleChange(u.id, e.target.value)} className="border rounded px-2 py-1">
                  <option value="candidat">Candidat</option>
                  <option value="recruteur">Recruteur</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2">
                {u.suspended ? <Badge className="bg-red-100 text-red-800">Suspendu</Badge> : <Badge className="bg-green-100 text-green-800">Actif</Badge>}
              </td>
              <td className="p-2 space-x-2">
                <Button size="sm" variant={u.suspended ? 'outline' : 'destructive'} onClick={() => handleSuspend(u.id, !u.suspended)}>
                  {u.suspended ? 'Réactiver' : 'Suspendre'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(u.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
