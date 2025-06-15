
import PageLayout from '@/components/Layout/PageLayout';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <PageLayout title="Tarifs" subtitle="Des offres flexibles adaptées à tous vos besoins de recrutement.">
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="border rounded-lg p-6 shadow-lg flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Essentiel</h3>
                <p className="text-4xl font-bold mb-4">990 DH</p>
                <p className="text-muted-foreground mb-6">Par offre / mois</p>
                <ul className="space-y-2 text-left mb-8 flex-grow">
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> 1 publication d'offre</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Visibilité 30 jours</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Gestion des candidatures</li>
                </ul>
                <Link to="/auth/register" className="btn-secondary w-full text-center">Choisir ce plan</Link>
            </div>
            <div className="border-2 border-eemploi-primary rounded-lg p-6 shadow-2xl relative flex flex-col">
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-eemploi-primary text-white px-4 py-1 rounded-full text-sm font-bold">Le plus populaire</div>
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <p className="text-4xl font-bold mb-4">2490 DH</p>
                <p className="text-muted-foreground mb-6">Par mois</p>
                <ul className="space-y-2 text-left mb-8 flex-grow">
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> 3 publications d'offres</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Accès à la CVthèque (50 profils)</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Logo sur la page d'accueil</li>
                </ul>
                 <Link to="/auth/register" className="btn-primary w-full text-center">Choisir ce plan</Link>
            </div>
            <div className="border rounded-lg p-6 shadow-lg flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Entreprise</h3>
                <p className="text-4xl font-bold mb-4">Sur devis</p>
                <p className="text-muted-foreground mb-6">Plan annuel</p>
                <ul className="space-y-2 text-left mb-8 flex-grow">
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Publications illimitées</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Accès complet à la CVthèque</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Accompagnement dédié</li>
                </ul>
                <Link to="/contact" className="btn-secondary w-full text-center">Nous contacter</Link>
            </div>
        </div>
    </PageLayout>
  );
};

export default Pricing;
