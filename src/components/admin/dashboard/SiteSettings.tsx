import { useState } from 'react';
import { Button } from '@/components/ui/button';

const defaultSettings = {
  maintenance: false,
  smtp_host: '',
  smtp_user: '',
  smtp_pass: '',
  supabase_key: '',
  banner: '',
};

const SiteSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);

  // TODO: Charger et sauvegarder les settings depuis/vers Supabase

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setSettings(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    setLoading(true);
    // TODO: Enregistrer dans Supabase
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <div className="font-bold mb-2">Mode maintenance</div>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="maintenance" checked={settings.maintenance} onChange={handleChange} />
          Activer la maintenance (affiche une bannière sur tout le site)
        </label>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <div className="font-bold mb-2">Bannière d'information</div>
        <input
          className="border rounded px-3 py-2 w-full"
          name="banner"
          value={settings.banner}
          onChange={handleChange}
          placeholder="Message de bannière (optionnel)"
        />
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <div className="font-bold mb-2">Intégration Supabase</div>
        <input
          className="border rounded px-3 py-2 w-full"
          name="supabase_key"
          value={settings.supabase_key}
          onChange={handleChange}
          placeholder="Clé API Supabase"
        />
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <div className="font-bold mb-2">SMTP (envoi d'emails)</div>
        <input
          className="border rounded px-3 py-2 w-full mb-2"
          name="smtp_host"
          value={settings.smtp_host}
          onChange={handleChange}
          placeholder="Hôte SMTP"
        />
        <input
          className="border rounded px-3 py-2 w-full mb-2"
          name="smtp_user"
          value={settings.smtp_user}
          onChange={handleChange}
          placeholder="Utilisateur SMTP"
        />
        <input
          className="border rounded px-3 py-2 w-full"
          name="smtp_pass"
          value={settings.smtp_pass}
          onChange={handleChange}
          placeholder="Mot de passe SMTP"
        />
      </div>
      <Button onClick={handleSave} disabled={loading} className="w-full mt-4">
        {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
      </Button>
    </div>
  );
};

export default SiteSettings;
