
-- Cette commande s'assure que le 'bucket' (dossier de stockage) nommé 'candidate-files' existe,
-- qu'il est public, et qu'il accepte les fichiers HTML.
-- Être public est crucial pour que le navigateur affiche le certificat comme une page web.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('candidate-files', 'candidate-files', true, 5242880, ARRAY['text/html', 'application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE 
SET public = true,
    allowed_mime_types = COALESCE(storage.buckets.allowed_mime_types, '{}'::text[]) || ARRAY['text/html', 'application/pdf', 'image/jpeg', 'image/png'];

-- Cette politique de sécurité autorise la lecture publique de n'importe quel fichier
-- dans 'candidate-files'. C'est ce qui permet à n'importe qui possédant le lien de voir le certificat.
DROP POLICY IF EXISTS "Public read access for candidate files" ON storage.objects;
CREATE POLICY "Public read access for candidate files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'candidate-files' );

-- Cette politique de sécurité s'assure que les utilisateurs connectés ne peuvent
-- ajouter, modifier ou supprimer que les fichiers qui se trouvent dans leur propre dossier (identifié par leur user_id).
DROP POLICY IF EXISTS "Users can manage their own files" ON storage.objects;
CREATE POLICY "Users can manage their own files"
ON storage.objects FOR ALL
USING ( auth.uid()::text = (storage.foldername(name))[1] )
WITH CHECK ( auth.uid()::text = (storage.foldername(name))[1] );

