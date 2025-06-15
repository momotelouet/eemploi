
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutTab from "./AboutTab";
import JobsTab from "./JobsTab";
import ReviewsTab from "./ReviewsTab";

type Job = {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    postedAt: string;
};

type CompanyContentProps = {
  company: {
    name: string;
    description: string;
    values: string[];
    benefits: string[];
    reviews: number;
  };
  companyJobs: Job[];
};

const CompanyContent = ({ company, companyJobs }: CompanyContentProps) => {
  return (
    <Tabs defaultValue="about" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about">À propos</TabsTrigger>
        <TabsTrigger value="jobs">Postes ({companyJobs.length})</TabsTrigger>
        <TabsTrigger value="reviews">Avis ({company.reviews})</TabsTrigger>
      </TabsList>

      <TabsContent value="about">
        <AboutTab company={company} />
      </TabsContent>

      <TabsContent value="jobs">
        <JobsTab jobs={companyJobs} />
      </TabsContent>

      <TabsContent value="reviews">
        <ReviewsTab />
      </TabsContent>
    </Tabs>
  );
};

export default CompanyContent;
