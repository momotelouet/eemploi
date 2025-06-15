
import PageLayout from '@/components/Layout/PageLayout';
import { Link } from 'react-router-dom';

const Press = () => {
  return (
    <PageLayout title="Espace Presse" subtitle="Retrouvez nos communiqués de presse et notre kit média.">
      <p>
        Bienvenue dans l'espace dédié aux journalistes et professionnels des médias.
      </p>
      
      <h2>Derniers Communiqués</h2>
      <p>
        <strong>10 Juin 2025:</strong> eemploi lève 2 millions de dirhams pour accélérer son développement au Maroc.
      </p>
      <p>
        <strong>15 Mai 2025:</strong> Lancement du simulateur de salaire intelligent basé sur l'IA.
      </p>
      
      <h2>Kit Média</h2>
      <p>
        Notre kit média contient notre logo, des photos de l'équipe de direction et des informations clés sur notre entreprise. Il est disponible sur demande.
      </p>

      <h2>Contact Presse</h2>
      <p>
        Pour toute demande d'interview, d'information ou pour recevoir notre kit média, veuillez contacter notre équipe relations presse.
      </p>
      <p>
        <Link to="/contact" className="text-eemploi-primary font-bold hover:underline">Contactez notre service presse</Link>
      </p>
    </PageLayout>
  );
};

export default Press;
