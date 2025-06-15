
import { Briefcase, Building, Wrench, Info, Phone } from 'lucide-react';
import React from 'react';

export interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

export const navigationItems: NavItem[] = [
  { label: 'Emplois', href: '/emplois', icon: <Briefcase className="w-4 h-4" /> },
  { label: 'Entreprises', href: '/entreprises', icon: <Building className="w-4 h-4" /> },
  { label: 'Outils', href: '/outils', icon: <Wrench className="w-4 h-4" /> },
  { label: 'À propos', href: '/about', icon: <Info className="w-4 h-4" /> },
  { label: 'Contact', href: '/contact', icon: <Phone className="w-4 h-4" /> },
];
