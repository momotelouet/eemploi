
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const Companies = lazy(() => import("./pages/Companies"));
const CompanyDetails = lazy(() => import("./pages/CompanyDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/auth/Auth"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Dashboard pages
const CandidateDashboard = lazy(() => import("./pages/dashboard/CandidateDashboard"));
const RecruiterDashboard = lazy(() => import("./pages/dashboard/RecruiterDashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));

// Recruiter pages
const RecruiterHub = lazy(() => import("./pages/recruiter/RecruiterHub"));
const ApplicationsManager = lazy(() => import("./pages/recruiter/ApplicationsManager"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
              <Header />
              <main className="flex-1">
                <Suspense fallback={<div className="flex items-center justify-center h-64">Chargement...</div>}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/emplois" element={<Jobs />} />
                    <Route path="/emplois/:id" element={<JobDetails />} />
                    <Route path="/entreprises" element={<Companies />} />
                    <Route path="/entreprises/:id" element={<CompanyDetails />} />
                    <Route path="/a-propos" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/connexion" element={<Login />} />
                    <Route path="/inscription" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard/candidat" element={
                      <ProtectedRoute>
                        <CandidateDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/recruteur" element={
                      <ProtectedRoute>
                        <RecruiterDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/admin" element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Recruiter Routes */}
                    <Route path="/recruteur/hub" element={
                      <ProtectedRoute>
                        <RecruiterHub />
                      </ProtectedRoute>
                    } />
                    <Route path="/recruteur/candidatures" element={
                      <ProtectedRoute>
                        <ApplicationsManager />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
