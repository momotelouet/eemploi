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

type Education = {
    id: string;
    institution: string;
    degree: string;
    field_of_study?: string;
    start_date: string;
    end_date?: string;
    description?: string;
};

interface EducationEditorProps {
    profile: CandidateProfile;
    onUpdate: (updates: Partial<CandidateProfile>) => Promise<any>;
}

const EducationForm = ({ education, onSave, onCancel }: { education?: Education | null, onSave: (edu: Education) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Education>(education || { id: uuidv4(), institution: '', degree: '', start_date: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="institution">Établissement</Label>
                <Input id="institution" name="institution" value={formData.institution} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="degree">Diplôme</Label>
                <Input id="degree" name="degree" value={formData.degree} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="field_of_study">Domaine d'études</Label>
                <Input id="field_of_study" name="field_of_study" value={formData.field_of_study} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="start_date">Date de début</Label>
                    <Input id="start_date" name="start_date" type="month" value={formData.start_date} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end_date">Date de fin</Label>
                    <Input id="end_date" name="end_date" type="month" value={formData.end_date} onChange={handleChange} />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button></DialogClose>
                <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
        </form>
    );
};

const EducationEditor = ({ profile, onUpdate }: EducationEditorProps) => {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);

    const handleSave = async (updated: Education[]) => {
        try {
            await onUpdate({ education_structured: updated });
            toast({ title: "Formations mises à jour" });
            setIsDialogOpen(false);
        } catch (error) {
            toast({ title: "Erreur", variant: "destructive" });
        }
    };

    const addOrUpdate = (edu: Education) => {
        const current = (profile.education_structured as Education[] | null) || [];
        const existingIndex = current.findIndex(e => e.id === edu.id);
        const updated = [...current];
        if (existingIndex > -1) {
            updated[existingIndex] = edu;
        } else {
            updated.push(edu);
        }
        handleSave(updated);
    };

    const deleteItem = (id: string) => {
        const current = (profile.education_structured as Education[] | null) || [];
        const updated = current.filter(e => e.id !== id);
        handleSave(updated);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Formation</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingEducation(null)}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingEducation ? "Modifier la formation" : "Ajouter une formation"}</DialogTitle>
                        </DialogHeader>
                        <EducationForm 
                            education={editingEducation}
                            onSave={addOrUpdate}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
                {((profile.education_structured as Education[] | null) || []).map(edu => (
                    <div key={edu.id} className="p-4 border rounded-md flex justify-between items-start">
                        <div>
                            <h4 className="font-bold">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                             <p className="text-xs text-muted-foreground">{edu.start_date} - {edu.end_date || 'Présent'}</p>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingEducation(edu); setIsDialogOpen(true); }}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteItem(edu.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default EducationEditor;
