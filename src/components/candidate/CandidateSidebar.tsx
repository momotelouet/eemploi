import { FileText, User, Briefcase, Award, Search, Bot } from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const sections = [
  { label: 'Mes CV', icon: <FileText />, tab: 'cv' },
  { label: 'Mon Profil', icon: <User />, tab: 'profile' },
  { label: 'Candidatures', icon: <Briefcase />, tab: 'applications' },
  { label: 'Évaluation', icon: <Award />, tab: 'assessment' },
  { label: 'Recherche IA', icon: <Search />, tab: 'job-search' },
  { label: 'Optimiseur IA', icon: <Bot />, tab: 'ai-optimizer' },
  { label: 'Assistant IA', icon: <Bot />, tab: 'ai-assistant' },
];

const CandidateSidebar = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'cv';

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-border min-h-screen p-4 flex flex-col gap-2">
      <div className="mb-6 text-2xl font-bold text-primary">Candidat</div>
      <nav className="flex flex-col gap-1">
        {sections.map((section) => (
          <Link
            key={section.label}
            to={`/dashboard/candidat?tab=${section.tab}`}
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-colors font-medium hover:bg-primary/10 hover:text-primary ${activeTab === section.tab ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-200'}`}
          >
            {section.icon}
            <span>{section.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default CandidateSidebar;
