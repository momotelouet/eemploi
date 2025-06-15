import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CandidateProfile } from '@/hooks/useCandidateProfile';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

type Project = {
    id: string;
    name: string;
    url?: string;
    description: string;
};

interface ProjectsEditorProps {
    profile: CandidateProfile;
    onUpdate: (updates: Partial<CandidateProfile>) => Promise<any>;
}

const ProjectForm = ({ item, onSave, onCancel }: { item?: Project | null, onSave: (item: Project) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Project>(item || { id: uuidv4(), name: '', description: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nom du projet</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="url">URL du projet</Label>
                <Input id="url" name="url" value={formData.url || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button></DialogClose>
                <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
        </form>
    );
};

const ProjectsEditor = ({ profile, onUpdate }: ProjectsEditorProps) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Project | null>(null);

    const handleSave = async (updated: Project[]) => {
        try {
            await onUpdate({ projects: updated });
            toast({ title: "Projets mis à jour" });
            setIsOpen(false);
        } catch (error) {
            toast({ title: "Erreur", variant: "destructive" });
        }
    };

    const addOrUpdate = (item: Project) => {
        const current = (profile.projects as Project[] | null) || [];
        const existingIndex = current.findIndex(i => i.id === item.id);
        const updated = [...current];
        if (existingIndex > -1) updated[existingIndex] = item;
        else updated.push(item);
        handleSave(updated);
    };

    const deleteItem = (id: string) => {
        const updated = ((profile.projects as Project[] | null) || []).filter(i => i.id !== id);
        handleSave(updated);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projets</CardTitle>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editingItem ? 'Modifier' : 'Ajouter'} un projet</DialogTitle></DialogHeader>
                        <ProjectForm item={editingItem} onSave={addOrUpdate} onCancel={() => setIsOpen(false)} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
                {((profile.projects as Project[] | null) || []).map(item => (
                    <div key={item.id} className="p-4 border rounded-md flex justify-between items-start">
                        <div>
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="text-sm">{item.description}</p>
                            {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">Voir le projet</a>}
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsOpen(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default ProjectsEditor;
