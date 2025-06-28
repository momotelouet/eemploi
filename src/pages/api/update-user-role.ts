import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client'; // ou ajuste ce chemin selon ton projet

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { userId, newUserType } = req.body;

  if (!userId || !newUserType) {
    return res.status(400).json({ error: 'Paramètres manquants : userId ou newUserType' });
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ user_type: newUserType })
      .eq('id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Type d’utilisateur mis à jour avec succès' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
}
