
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Heart } from "lucide-react";

type AboutTabProps = {
    company: {
        name: string;
        description: string;
        values: string[];
        benefits: string[];
    };
};

const AboutTab = ({ company }: AboutTabProps) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>À propos de {company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose max-w-none">
                        {company.description.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-4 text-muted-foreground">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2 text-eemploi-primary" />
                        Nos valeurs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {company.values.map((value, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-eemploi-primary rounded-full"></div>
                                <span className="text-sm">{value}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-eemploi-secondary" />
                        Avantages employés
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {company.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-eemploi-secondary rounded-full"></div>
                                <span className="text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AboutTab;
