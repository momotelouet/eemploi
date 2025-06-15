
import LegalPageLayout from '@/components/legal/LegalPageLayout';

const CookiePolicy = () => {
  return (
    <LegalPageLayout title="Politique sur les Cookies" lastUpdated="15 juin 2025">
      <p>
        Notre site web, eemploi, utilise des cookies pour améliorer votre expérience utilisateur. Cette politique fournit des informations détaillées sur la manière dont nous utilisons les cookies.
      </p>
      
      <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-2">1. Que sont les cookies ?</h2>
      <p>
        Les cookies sont de petits fichiers texte stockés sur votre ordinateur ou votre appareil mobile lorsque vous visitez un site web. Ils sont largement utilisés pour faire fonctionner les sites web, ou pour travailler plus efficacement, ainsi que pour fournir des informations aux propriétaires du site.
      </p>
      
      <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-2">2. Comment utilisons-nous les cookies ?</h2>
      <p>
        Nous utilisons des cookies pour :
      </p>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li>Assurer le fonctionnement de base du site, comme la gestion de votre session de connexion.</li>
        <li>Analyser le trafic et le comportement des utilisateurs pour améliorer notre site.</li>
        <li>Personnaliser le contenu et mémoriser vos préférences.</li>
        <li>Fournir des fonctionnalités de médias sociaux et analyser notre trafic.</li>
      </ul>
      
      <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-2">3. Types de Cookies Utilisés</h2>
      <p>
        <strong>Cookies Essentiels :</strong> Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
        <br />
        <strong>Cookies de Performance :</strong> Ces cookies nous permettent de compter les visites et les sources de trafic afin que nous puissions mesurer et améliorer la performance de notre site.
        <br />
        <strong>Cookies de Fonctionnalité :</strong> Ces cookies permettent au site de fournir des fonctionnalités et une personnalisation améliorées.
      </p>
      
      <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-2">4. Comment gérer les cookies</h2>
      <p>
        Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez supprimer tous les cookies qui sont déjà sur votre ordinateur et vous pouvez configurer la plupart des navigateurs pour les empêcher d'être placés. Si vous faites cela, cependant, vous pourriez avoir à ajuster manuellement certaines préférences chaque fois que vous visitez un site et certains services et fonctionnalités peuvent ne pas fonctionner.
      </p>
    </LegalPageLayout>
  );
};

export default CookiePolicy;
