
import PageLayout from '@/components/Layout/PageLayout';
import { Link } from 'react-router-dom';

const HRSolutions = () => {
  return (
    <PageLayout title="Solutions RH" subtitle="Des outils et services conçus pour optimiser votre recrutement.">
      <p>
        Chez eemploi, nous comprenons les défis du recrutement. C'est pourquoi nous avons développé une gamme de solutions pour vous aider à trouver les meilleurs talents.
      </p>
      
      <h2>Sourcing de Candidats</h2>
      <p>
        Accédez à notre CVthèque de milliers de professionnels qualifiés et utilisez nos outils de recherche avancée pour cibler les profils qui vous intéressent.
      </p>
      
      <h2>Marque Employeur</h2>
      <p>
        Mettez en avant votre culture d'entreprise avec nos pages entreprises personnalisables. Attirez les talents qui partagent vos valeurs.
      </p>

      <h2>Gestion des Candidatures</h2>
      <p>
        Simplifiez votre processus de recrutement avec notre tableau de bord intuitif. Suivez les candidatures, communiquez avec les candidats et collaborez avec votre équipe.
      </p>

      <p>
        Prêt à transformer votre recrutement ? <Link to="/contact" className="text-eemploi-primary font-bold hover:underline">Contactez-nous</Link> pour une démo personnalisée.
      </p>
    </PageLayout>
  );
};

export default HRSolutions;
