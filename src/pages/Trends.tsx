
import PageLayout from '@/components/Layout/PageLayout';

const Trends = () => {
  return (
    <PageLayout title="Tendances des Secteurs" subtitle="Explorez les secteurs qui recrutent le plus au Maroc.">
      <p>
        Le marché du travail est en constante évolution. Découvrez les tendances qui façonnent l'emploi aujourd'hui et demain.
      </p>
      
      <h2>Secteur IT et Tech</h2>
      <p>
        Le digital continue sa croissance exponentielle. Les métiers de développeur, data scientist et expert en cybersécurité sont particulièrement en demande.
      </p>
      
      <h2>Énergies Renouvelables</h2>
      <p>
        Avec les ambitions écologiques du Maroc, le secteur des énergies renouvelables est en plein boom et recherche des ingénieurs et techniciens qualifiés.
      </p>

      <h2>Tourisme et Hôtellerie</h2>
      <p>
        Secteur clé de l'économie marocaine, le tourisme connaît une forte reprise et offre de nombreuses opportunités, de la gestion hôtelière aux guides touristiques.
      </p>
    </PageLayout>
  );
};

export default Trends;
