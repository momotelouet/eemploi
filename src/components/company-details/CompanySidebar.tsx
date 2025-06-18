import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Mail, Phone, Star } from "lucide-react";
import { useCompanies } from '@/hooks/useCompanies';
import { useParams } from 'react-router-dom';

type CompanySidebarProps = {
  company: {
    website: string;
    phone: string;
    email: string;
    sector: string;
  };
};

const CompanySidebar = ({ company }: CompanySidebarProps) => {
    const { id } = useParams();
    const { companies, loading } = useCompanies();
    // Exclure l'entreprise courante et prendre les 3 premières similaires (même secteur si possible)
    const similarCompanies = companies
        .filter(c => c.id !== id && c.industry === company.sector)
        .slice(0, 3);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-eemploi-primary" />
                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-eemploi-primary hover:underline">
                            {company.website}
                        </a>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-eemploi-primary" />
                        <span className="text-sm">{company.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-eemploi-primary" />
                        <span className="text-sm">{company.email}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Candidature spontanée</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Envoyez votre candidature même si aucun poste ne vous correspond actuellement.
                    </p>
                    <Button className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90">
                        Envoyer ma candidature
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Entreprises similaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div>Chargement...</div>
                    ) : similarCompanies.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Aucune entreprise similaire trouvée.</div>
                    ) : similarCompanies.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {item.name[0]}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <p className="text-xs text-muted-foreground">{item.industry} • {item.location}</p>
                                <div className="flex items-center mt-1">
                                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                    <span className="text-xs">{item.rating ? item.rating : '4.0'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default CompanySidebar;
