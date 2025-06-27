import { Link } from 'react-router-dom';
import { navigationItems } from './navigation.tsx';

const HeaderNavigation = () => {
  return (
    <nav className="hidden lg:flex items-center space-x-3">
      {navigationItems.map((item, index) => (
        <Link
          key={item.href}
          to={item.href}
          className="px-4 py-2 text-sm font-semibold uppercase font-sans text-foreground hover:text-eemploi-primary transition-all duration-300 rounded-lg hover:bg-eemploi-primary/10 hover:scale-105 flex items-center space-x-2 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default HeaderNavigation;
