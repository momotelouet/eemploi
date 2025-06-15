import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Heart, MessageSquare } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

const Footer = () => {
  const { openChat } = useChat();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Pour les candidats',
      links: [
        { label: 'Rechercher un emploi', href: '/emplois' },
        { label: 'Créer un CV', href: '/dashboard/candidat' },
        { label: 'Conseils carrière', href: '/about' },
        { label: 'Simulateur de salaire', href: '/outils' },
      ]
    },
    {
      title: 'Pour les entreprises',
      links: [
        { label: 'Publier une offre', href: '/auth/register' },
        { label: 'Rechercher des candidats', href: '/auth/register' },
        { label: 'Solutions RH', href: '/contact' },
        { label: 'Tarifs', href: '/contact' },
      ]
    },
    {
      title: 'Ressources',
      links: [
        { label: 'Blog emploi', href: '/about' },
        { label: 'Guide entretien', href: '/outils' },
        { label: 'Tendances secteurs', href: '/about' },
        { label: 'FAQ', href: '/contact' },
      ]
    },
    {
      title: 'À propos',
      links: [
        { label: 'Notre mission', href: '/about' },
        { label: 'Équipe', href: '/about' },
        { label: 'Carrières', href: '/emplois' },
        { label: 'Presse', href: '/contact' },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-eemploi-primary/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-eemploi-secondary/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-eemploi-accent/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 animate-fade-in">
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <img 
                src="/lovable-uploads/0fbb8218-73e4-4b7b-bdfd-4c239752a7b4.png" 
                alt="eemploi logo" 
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              La plateforme de référence pour l'emploi au Maroc. Nous connectons 
              les talents marocains avec les meilleures opportunités professionnelles.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 hover:text-eemploi-primary transition-colors duration-300">
                <MapPin className="w-4 h-4 mr-3 text-eemploi-primary" />
                Casablanca, Maroc
              </div>
              <div className="flex items-center text-gray-300 hover:text-eemploi-primary transition-colors duration-300">
                <Mail className="w-4 h-4 mr-3 text-eemploi-primary" />
                contact@eemploi.com
              </div>
              <div className="flex items-center text-gray-300 hover:text-eemploi-primary transition-colors duration-300">
                <Phone className="w-4 h-4 mr-3 text-eemploi-primary" />
                +212 5 22 XX XX XX
              </div>
            </div>
          </div>

          {/* Footer Links */}
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
                {section.links.map((link, linkIndex) => (
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
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 pt-8 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Restez informé des dernières opportunités
            </h3>
            <p className="text-gray-300 mb-6">
              Recevez chaque semaine les meilleures offres d'emploi directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-eemploi-primary focus:ring-1 focus:ring-eemploi-primary transition-all duration-300 hover:border-gray-500"
              />
              <button className="px-6 py-3 bg-eemploi-primary text-white rounded-lg hover:bg-eemploi-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-sm animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <p className="flex items-center">
                © {currentYear} eemploi. Fait avec 
                <Heart className="w-4 h-4 mx-1 text-red-500 animate-bounce-gentle" /> 
                au Maroc. Tous droits réservés.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-eemploi-primary transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
                <button
                  onClick={openChat}
                  aria-label="Ouvrir le chat en direct"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-eemploi-primary transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  style={{ animationDelay: `${socialLinks.length * 0.1}s` }}
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <Link to="/legal/privacy" className="hover:text-eemploi-primary transition-colors duration-300">
                Politique de confidentialité
              </Link>
              <Link to="/legal/terms" className="hover:text-eemploi-primary transition-colors duration-300">
                Conditions d'utilisation
              </Link>
              <Link to="/legal/cookies" className="hover:text-eemploi-primary transition-colors duration-300">
                Politique des cookies
              </Link>
              <Link to="/contact" className="hover:text-eemploi-primary transition-colors duration-300">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
