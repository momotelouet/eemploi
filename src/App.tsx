
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CandidateDashboard from "./pages/dashboard/CandidateDashboard";
import RecruiterDashboard from "./pages/dashboard/RecruiterDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/emplois" element={<Jobs />} />
          <Route path="/emplois/:id" element={<JobDetails />} />
          <Route path="/entreprises" element={<Companies />} />
          <Route path="/entreprises/:id" element={<CompanyDetails />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/dashboard/candidat" element={<CandidateDashboard />} />
          <Route path="/dashboard/recruteur" element={<RecruiterDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
