
import LegalPageLayout from '@/components/legal/LegalPageLayout';

const TermsOfUse = () => {
  return (
    <LegalPageLayout title="Conditions d'Utilisation" lastUpdated="15 juin 2025">
      <p>
        En accédant au site web eemploi, vous acceptez de vous conformer aux présentes conditions d'utilisation, à toutes les lois et réglementations applicables, et vous convenez que vous êtes responsable du respect de toutes les lois locales applicables.
      </p>
      
      <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-2">1. Utilisation de la Licence</h2>
      <p>
        Il est permis de télécharger temporairement une copie des documents (information ou logiciel) sur le site web d'eemploi pour une visualisation transitoire personnelle et non commerciale seulement. Il s'agit de l'octroi d'une licence, non d'un transfert de titre.
      </p>
      
      <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-2">2. Responsabilité de l'Utilisateur</h2>
      <p>
        En tant qu'utilisateur, vous êtes responsable de l'exactitude des informations fournies sur votre profil et dans vos candidatures. Vous vous engagez à ne pas publier de contenu faux, trompeur, illégal ou offensant.
      </p>
      
      <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-2">3. Limitations</h2>
      <p>
        En aucun cas, eemploi ou ses fournisseurs ne seront responsables de tout dommage (y compris, sans limitation, les dommages pour perte de données ou de profit, ou en raison d'une interruption d'activité) découlant de l'utilisation ou de l'impossibilité d'utiliser les matériaux sur le site web d'eemploi.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-2">4. Modifications</h2>
      <p>
        eemploi peut réviser ces conditions d'utilisation de son site web à tout moment sans préavis. En utilisant ce site web, vous acceptez d'être lié par la version alors en vigueur de ces conditions d'utilisation.
      </p>
    </LegalPageLayout>
  );
};

export default TermsOfUse;
