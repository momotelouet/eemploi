
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-xl font-bold">eemploi</span>
            </div>
            <p className="text-gray-400 text-sm">
              La plateforme marocaine leader pour la mise en relation entre candidats et recruteurs.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Candidats</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/emplois" className="hover:text-white transition-colors">Rechercher un emploi</Link></li>
              <li><Link to="/inscription" className="hover:text-white transition-colors">Créer mon CV</Link></li>
              <li><Link to="/dashboard/candidat" className="hover:text-white transition-colors">Mon espace</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Recruteurs</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/dashboard/recruteur" className="hover:text-white transition-colors">Publier une offre</Link></li>
              <li><Link to="/entreprises" className="hover:text-white transition-colors">Profil entreprise</Link></li>
              <li><Link to="/inscription" className="hover:text-white transition-colors">Espace recruteur</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/a-propos" className="hover:text-white transition-colors">À propos</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 eemploi.com - Tous droits réservés. Fait avec ❤️ au Maroc</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
