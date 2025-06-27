import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CandidateCard from '@/components/candidate/CandidateCard';
import JobCard from '@/components/JobCard';
import { useJobs } from '@/hooks/useJobs';
import { useCompanies } from '@/hooks/useCompanies';
import { Building, Search, CheckCircle } from 'lucide-react';

const Index = () => {
  const { jobs, loading: jobsLoading } = useJobs();
  const { companies, loading: companiesLoading } = useCompanies();
  const featuredJobs = jobs.slice(0, 6);
  const topCompanies = companies.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white text-center py-20 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Trouvez l'emploi ou le talent idéal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            eemploi connecte les talents et les recruteurs à travers le Maroc. Créez votre profil ou publiez une offre gratuitement.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="bg-eemploi-primary hover:bg-eemploi-primary/90 text-white font-semibold px-8 py-4 rounded-lg">
                Créer un compte
              </Button>
            </Link>
            <Link to="/emplois">
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-800 px-8 py-4 rounded-lg">
                Voir les offres
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Profils Recommandés */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            Profils recommandés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[{
              firstName: 'Sara', lastName: 'El Amrani', professionalTitle: 'Développeuse React', city: 'Casablanca', photoUrl: '',
            }, {
              firstName: 'Yassine', lastName: 'Benali', professionalTitle: 'Chef de projet IT', city: 'Rabat', photoUrl: '',
            }, {
              firstName: 'Imane', lastName: 'Berrada', professionalTitle: 'Data Analyst', city: 'Marrakech', photoUrl: '',
            }, {
              firstName: 'Omar', lastName: 'Kabbaj', professionalTitle: 'UX/UI Designer', city: 'Tanger', photoUrl: '',
            }].map((cand, i) => (
              <CandidateCard key={i} {...cand} onViewProfile={() => {}} />
            ))}
          </div>
        </div>
      </section>

      {/* Offres en vedette */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="bg-eemploi-primary/10 text-eemploi-primary px-6 py-2 text-lg">
              Offres en vedette
            </Badge>
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">
              Postes actuellement disponibles
            </h2>
          </div>
          {jobsLoading ? (
            <div className="text-center">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-100 to-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Rejoignez la plateforme de recrutement de confiance
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Plus de 50,000 utilisateurs ont trouvé leur emploi ou candidat avec eemploi.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="bg-eemploi-primary hover:bg-eemploi-primary/90 text-white font-semibold px-8 py-4 rounded-lg">
                <CheckCircle className="w-5 h-5 mr-2" /> Créer un compte
              </Button>
            </Link>
            <Link to="/emplois">
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-800 px-8 py-4 rounded-lg">
                <Search className="w-5 h-5 mr-2" /> Voir les offres
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
