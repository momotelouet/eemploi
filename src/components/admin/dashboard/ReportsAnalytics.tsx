import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportCSV';
import { exportToPDF } from '@/lib/exportPDF';

const ReportsAnalytics = () => {
  // TODO: Remplacer [] par les vraies données à exporter
  return (
    <div className="space-y-8">
      <div className="flex gap-4 mb-4">
        <Button size="sm" variant="success">Générer rapport mensuel</Button>
        <Button size="sm" variant="outline" onClick={() => exportToPDF([], 'rapport.pdf')}>Exporter PDF</Button>
        <Button size="sm" variant="outline" onClick={() => exportToCSV([], 'rapport.csv')}>Exporter CSV</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
          <div className="font-bold mb-2">Utilisation de la plateforme</div>
          <div className="h-48 flex items-center justify-center text-muted-foreground">[Graphique d'utilisation]</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
          <div className="font-bold mb-2">Offres les plus performantes</div>
          <div className="h-48 flex items-center justify-center text-muted-foreground">[Graphique jobs]</div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mt-6">
        <div className="font-bold mb-2">Logs d'activité admin</div>
        <div className="h-32 flex items-center justify-center text-muted-foreground">[Logs admin]</div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
