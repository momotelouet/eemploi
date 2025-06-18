import AdminLayout from '@/components/admin/dashboard/AdminLayout';
import Topbar from '@/components/admin/dashboard/Topbar';
import Overview from '@/components/admin/dashboard/Overview';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from 'react';
import { AlertTriangle } from "lucide-react";
import { useLocation } from 'react-router-dom';
import UserManagement from '@/components/admin/dashboard/UserManagement';
import JobManagement from '@/components/admin/dashboard/JobManagement';
import ApplicationMonitoring from '@/components/admin/dashboard/ApplicationMonitoring';
import CompanyValidation from '@/components/admin/dashboard/CompanyValidation';
import PaymentManagement from '@/components/admin/dashboard/PaymentManagement';
import PlansManagement from '@/components/admin/dashboard/PlansManagement';
import NotificationsCenter from '@/components/admin/dashboard/NotificationsCenter';
import ReportsAnalytics from '@/components/admin/dashboard/ReportsAnalytics';
import SystemLogs from '@/components/admin/dashboard/SystemLogs';
import AdminRoles from '@/components/admin/dashboard/AdminRoles';
import SiteSettings from '@/components/admin/dashboard/SiteSettings';
import SupportFeedback from '@/components/admin/dashboard/SupportFeedback';

const AdminDashboard = () => {
  const stats = [
    { 
      label: "Utilisateurs total", 
      value: "12,456", 
      icon: "👤", 
      change: "+245 ce mois",
      color: "text-blue-600"
    },
    { 
      label: "Offres d'emploi", 
      value: "3,892", 
      icon: "💼", 
      change: "+89 cette semaine",
      color: "text-green-600"
    },
    { 
      label: "Entreprises", 
      value: "1,234", 
      icon: "🏢", 
      change: "+12 ce mois",
      color: "text-purple-600"
    },
    { 
      label: "Candidatures", 
      value: "45,678", 
      icon: "📈", 
      change: "+1,245 cette semaine",
      color: "text-yellow-600"
    }
  ];

  const tabsRef = useRef<any>(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');

  let content = <Overview />;
  switch (tab) {
    case 'users':
      content = <UserManagement />; break;
    case 'jobs':
      content = <JobManagement />; break;
    case 'applications':
      content = <ApplicationMonitoring />; break;
    case 'companies':
      content = <CompanyValidation />; break;
    case 'payments':
      content = <PaymentManagement />; break;
    case 'plans':
      content = <PlansManagement />; break;
    case 'notifications':
      content = <NotificationsCenter />; break;
    case 'reports':
      content = <ReportsAnalytics />; break;
    case 'logs':
      content = <SystemLogs />; break;
    case 'roles':
      content = <AdminRoles />; break;
    case 'settings':
      content = <SiteSettings />; break;
    case 'support':
      content = <SupportFeedback />; break;
    default:
      content = <Overview />;
  }

  // Fonction pour changer d'onglet depuis la sidebar
  const goToTab = (tab: string) => {
    const tabs = document.querySelectorAll('[role="tab"]');
    tabs.forEach((el: any) => {
      if (el.getAttribute('data-state') !== undefined && el.getAttribute('data-value') === tab) {
        el.click();
      }
    });
  };

  return (
    <AdminLayout>
      <Topbar />
      <div className="mt-6">
        {content}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
