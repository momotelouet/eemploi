
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const FooterBrand = () => {
  return (
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
  );
};

export default FooterBrand;
