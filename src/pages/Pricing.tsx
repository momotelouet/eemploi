import PageLayout from '@/components/Layout/PageLayout';
import { Link } from 'react-router-dom';
import { Check, CreditCard } from 'lucide-react';

const Pricing = () => {
  return (
    <PageLayout title="Tarifs" subtitle="Une tarification simple et transparente pour publier vos offres.">
        <div className="flex justify-center animate-fade-in">
            <div className="border-2 border-eemploi-primary rounded-lg p-8 shadow-2xl relative flex flex-col w-full max-w-md text-center">
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-eemploi-primary text-white px-4 py-1 rounded-full text-sm font-bold">Pay-per-Post</div>
                <h3 className="text-2xl font-bold mb-4">Publication à l'unité</h3>
                <p className="text-5xl font-bold mb-4">249 DH</p>
                <p className="text-muted-foreground mb-6">Par offre publiée</p>
                <p className="text-eemploi-dark font-medium mb-8">Publiez maintenant, payez plus tard. Votre offre est en ligne immédiatement.</p>
                <ul className="space-y-3 text-left mb-8 flex-grow">
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> 1 publication d'offre</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Visibilité 30 jours</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Gestion des candidatures</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Facturation groupée possible</li>
                </ul>
                 <Link to="/auth/register" className="btn-primary w-full text-center flex items-center justify-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Commencer à publier
                </Link>
            </div>
        </div>
    </PageLayout>
  );
};

export default Pricing;
