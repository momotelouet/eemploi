
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Heart, MessageSquare } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
];

const FooterBottom = () => {
    const { openChat } = useChat();
    const currentYear = new Date().getFullYear();

    return (
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
    );
};

export default FooterBottom;
