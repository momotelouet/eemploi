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

type Experience = {
    id: string;
    title: string;
    company: string;
    location?: string;
    start_date: string;
    end_date?: string;
    description: string;
};

interface ExperienceEditorProps {
    profile: CandidateProfile;
    onUpdate: (updates: Partial<CandidateProfile>) => Promise<any>;
}

const ExperienceForm = ({ experience, onSave, onCancel }: { experience?: Experience | null, onSave: (exp: Experience) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Experience>(experience || { id: uuidv4(), title: '', company: '', start_date: '', description: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Titre du poste</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
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
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button></DialogClose>
                <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
        </form>
    );
};


const ExperienceEditor = ({ profile, onUpdate }: ExperienceEditorProps) => {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

    const handleSave = async (updatedExperiences: Experience[]) => {
        try {
            await onUpdate({ experience: updatedExperiences });
            toast({ title: "Expériences mises à jour" });
            setIsDialogOpen(false);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de sauvegarder", variant: "destructive" });
        }
    };

    const addOrUpdateExperience = (exp: Experience) => {
        const currentExperiences = (profile.experience as Experience[] | null) || [];
        const existingIndex = currentExperiences.findIndex(e => e.id === exp.id);
        if (existingIndex > -1) {
            const updated = [...currentExperiences];
            updated[existingIndex] = exp;
            handleSave(updated);
        } else {
            handleSave([...currentExperiences, exp]);
        }
    };

    const deleteExperience = (id: string) => {
        const currentExperiences = (profile.experience as Experience[] | null) || [];
        const updated = currentExperiences.filter(e => e.id !== id);
        handleSave(updated);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expériences Professionnelles</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingExperience(null)}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingExperience ? "Modifier l'expérience" : "Ajouter une expérience"}</DialogTitle>
                        </DialogHeader>
                        <ExperienceForm 
                            experience={editingExperience}
                            onSave={addOrUpdateExperience}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
                {((profile.experience as Experience[] | null) || []).length > 0 ? (
                    ((profile.experience as Experience[] | null) || []).map(exp => (
                        <div key={exp.id} className="p-4 border rounded-md flex justify-between items-start">
                            <div>
                                <h4 className="font-bold">{exp.title}</h4>
                                <p className="text-sm text-muted-foreground">{exp.company}</p>
                                <p className="text-xs text-muted-foreground">{exp.start_date} - {exp.end_date || 'Présent'}</p>
                                <p className="mt-2 text-sm">{exp.description}</p>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingExperience(exp); setIsDialogOpen(true); }}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteExperience(exp.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground text-center py-4">Aucune expérience ajoutée.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default ExperienceEditor;
