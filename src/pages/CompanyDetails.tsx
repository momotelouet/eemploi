import { useParams } from "react-router-dom";
import CompanyHeader from "@/components/company-details/CompanyHeader";
import CompanyStats from "@/components/company-details/CompanyStats";
import CompanyContent from "@/components/company-details/CompanyContent";
import CompanySidebar from "@/components/company-details/CompanySidebar";
import { useCompanyDetails } from '@/hooks/useCompanyDetails';
import { useCompanyJobs } from '@/hooks/useCompanyJobs';

const CompanyDetails = () => {
  const { id } = useParams();
  const { company, loading, error } = useCompanyDetails(id);
  const { jobs: companyJobs, loading: jobsLoading } = useCompanyJobs(company?.id);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !company) return <div className="text-center py-12 text-red-500">Entreprise introuvable.</div>;

  // Adapter les données pour les composants enfants
  const companyData = {
    id: company.id,
    name: company.name,
    logo: company.logo_url || '',
    sector: company.industry || '',
    location: company.location || '',
    employees: company.size || '',
    founded: company.created_at ? new Date(company.created_at).getFullYear().toString() : '',
    website: company.website || '',
    phone: '',
    email: '',
    rating: 0,
    reviews: 0,
    description: company.description || '',
    values: [],
    benefits: [],
    stats: { openJobs: 0, avgSalary: '', responseTime: '', hiringRate: '' }
  };

  return (
    <div className="bg-background">
      
      <CompanyHeader company={companyData} />
      <CompanyStats stats={companyData.stats} />

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <CompanyContent company={companyData} companyJobs={companyJobs} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <CompanySidebar company={companyData} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CompanyDetails;
