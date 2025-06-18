import { Home, Users, Briefcase, FileText, Building, CreditCard, Bell, BarChart2, Settings, Shield, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const sections = [
  { label: 'Aperçu', icon: <Home />, to: '/dashboard/admin' },
  { label: 'Utilisateurs', icon: <Users />, to: '/dashboard/admin?tab=users' },
  { label: 'Offres', icon: <Briefcase />, to: '/dashboard/admin?tab=jobs' },
  { label: 'Candidatures', icon: <FileText />, to: '/dashboard/admin?tab=applications' },
  { label: 'Entreprises', icon: <Building />, to: '/dashboard/admin?tab=companies' },
  { label: 'Paiements', icon: <CreditCard />, to: '/dashboard/admin?tab=payments' },
  { label: 'Abonnements', icon: <Shield />, to: '/dashboard/admin?tab=plans' },
  { label: 'Notifications', icon: <Bell />, to: '/dashboard/admin?tab=notifications' },
  { label: 'Rapports', icon: <BarChart2 />, to: '/dashboard/admin?tab=reports' },
  { label: 'Logs', icon: <Settings />, to: '/dashboard/admin?tab=logs' },
  { label: 'Rôles', icon: <Shield />, to: '/dashboard/admin?tab=roles' },
  { label: 'Paramètres', icon: <Settings />, to: '/dashboard/admin?tab=settings' },
  { label: 'Support', icon: <HelpCircle />, to: '/dashboard/admin?tab=support' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-border min-h-screen p-4 flex flex-col gap-2">
      <div className="mb-6 text-2xl font-bold text-primary">Admin</div>
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

export default Sidebar;
