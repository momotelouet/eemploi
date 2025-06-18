import { Briefcase, Users, Building, TrendingUp, Bot } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const sections = [
  { label: 'Aperçu', icon: <TrendingUp />, to: '/dashboard/recruteur' },
  { label: 'Offres', icon: <Briefcase />, to: '/dashboard/recruteur?tab=jobs' },
  { label: 'Candidatures', icon: <Users />, to: '/dashboard/recruteur?tab=applications' },
  { label: 'Entreprise', icon: <Building />, to: '/dashboard/recruteur?tab=company' },
  { label: 'Assistant IA', icon: <Bot />, to: '/dashboard/recruteur?tab=ai' },
];

const RecruiterSidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-border min-h-screen p-4 flex flex-col gap-2">
      <div className="mb-6 text-2xl font-bold text-primary">Recruteur</div>
      <nav className="flex flex-col gap-1">
        {sections.map((section) => (
          <Link
            key={section.label}
            to={section.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-colors font-medium hover:bg-primary/10 hover:text-primary ${location.pathname + location.search === section.to ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-200'}`}
          >
            {section.icon}
            <span>{section.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default RecruiterSidebar;
