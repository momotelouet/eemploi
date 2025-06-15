
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CandidateProfile } from '@/hooks/useCandidateProfile';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

type Certification = {
    id: string;
    name: string;
    authority: string;
    issue_date: string;
};

interface CertificationsEditorProps {
    profile: CandidateProfile & { certifications?: Certification[] };
    onUpdate: (updates: Partial<CandidateProfile> & { certifications?: Certification[] }) => Promise<any>;
}

const CertificationForm = ({ item, onSave, onCancel }: { item?: Certification | null, onSave: (item: Certification) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Certification>(item || { id: uuidv4(), name: '', authority: '', issue_date: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nom de la certification</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="authority">Organisme de délivrance</Label>
                <Input id="authority" name="authority" value={formData.authority} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="issue_date">Date de délivrance</Label>
                <Input id="issue_date" name="issue_date" type="month" value={formData.issue_date} onChange={handleChange} required />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button></DialogClose>
                <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
        </form>
    );
};

const CertificationsEditor = ({ profile, onUpdate }: CertificationsEditorProps) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Certification | null>(null);

    const handleSave = async (updated: Certification[]) => {
        try {
            await onUpdate({ certifications: updated });
            toast({ title: "Certifications mises à jour" });
            setIsOpen(false);
        } catch (error) {
            toast({ title: "Erreur", variant: "destructive" });
        }
    };

    const addOrUpdate = (item: Certification) => {
        const current = profile.certifications || [];
        const existingIndex = current.findIndex(i => i.id === item.id);
        const updated = [...current];
        if (existingIndex > -1) updated[existingIndex] = item;
        else updated.push(item);
        handleSave(updated);
    };

    const deleteItem = (id: string) => {
        const updated = (profile.certifications || []).filter(i => i.id !== id);
        handleSave(updated);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Certifications</CardTitle>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editingItem ? 'Modifier' : 'Ajouter'} une certification</DialogTitle></DialogHeader>
                        <CertificationForm item={editingItem} onSave={addOrUpdate} onCancel={() => setIsOpen(false)} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
                {(profile.certifications || []).map(item => (
                    <div key={item.id} className="p-4 border rounded-md flex justify-between items-start">
                        <div>
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.authority}</p>
                            <p className="text-xs text-muted-foreground">Obtenu en {item.issue_date}</p>
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

export default CertificationsEditor;
