
import { Link } from 'react-router-dom';

const footerSections = [
    {
      title: 'Pour les candidats',
      links: [
        { label: 'Rechercher un emploi', href: '/emplois' },
        { label: 'Créer un CV', href: '/dashboard/candidat' },
        { label: 'Conseils carrière', href: '/conseils-carriere' },
        { label: 'Simulateur de salaire', href: '/outils' },
      ]
    },
    {
      title: 'Pour les entreprises',
      links: [
        { label: 'Publier une offre', href: '/auth/register' },
        { label: 'Rechercher des candidats', href: '/auth/register' },
        { label: 'Solutions RH', href: '/solutions-rh' },
        { label: 'Tarifs', href: '/tarifs' },
      ]
    },
    {
      title: 'Ressources',
      links: [
        { label: 'Blog emploi', href: '/blog' },
        { label: 'Guide entretien', href: '/outils' },
        { label: 'Tendances secteurs', href: '/tendances' },
        { label: 'FAQ', href: '/faq' },
      ]
    },
    {
      title: 'À propos',
      links: [
        { label: 'Notre mission', href: '/about' },
        { label: 'Équipe', href: '/about' },
        { label: 'Carrières', href: '/emplois' },
        { label: 'Presse', href: '/presse' },
      ]
    }
  ];

const FooterLinks = () => {
    return (
        <>
            {footerSections.map((section, sectionIndex) => (
                <div 
                    key={section.title} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${(sectionIndex + 1) * 0.1}s` }}
                >
                    <h3 className="font-semibold text-lg mb-4 text-white">
                        {section.title}
                    </h3>
                    <ul className="space-y-3">
                        {section.links.map((link) => (
                            <li key={link.label}>
                                <Link
                                to={link.href}
                                className="text-gray-300 hover:text-eemploi-primary transition-all duration-300 hover:translate-x-1 hover:scale-105 inline-block"
                                >
                                {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
};

export default FooterLinks;
