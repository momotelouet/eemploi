import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Topbar = () => {
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
      <div className="font-bold text-xl">Tableau de bord Admin</div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
