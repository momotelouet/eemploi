
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

import Layout from '@/components/Layout/Layout';
import Index from '@/pages/Index';
import Jobs from '@/pages/Jobs';
import JobDetails from '@/pages/JobDetails';
import Companies from '@/pages/Companies';
import CompanyDetails from '@/pages/CompanyDetails';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import CandidateDashboard from '@/pages/dashboard/CandidateDashboard';
import RecruiterDashboard from '@/pages/dashboard/RecruiterDashboard';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import RecruiterHub from '@/pages/recruiter/RecruiterHub';
import ApplicationsManager from '@/pages/recruiter/ApplicationsManager';
import { AuthProvider } from '@/contexts/AuthContext';

import Tools from "@/pages/Tools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/emplois" element={<Jobs />} />
              <Route path="/emplois/:id" element={<JobDetails />} />
              <Route path="/entreprises" element={<Companies />} />
              <Route path="/entreprises/:id" element={<CompanyDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/outils" element={<Tools />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute />}>
                <Route path="candidat" element={<CandidateDashboard />} />
                <Route path="recruteur" element={<RecruiterDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
              
              <Route path="/recruteur" element={<ProtectedRoute />}>
                <Route path="hub" element={<RecruiterHub />} />
                <Route path="candidatures" element={<ApplicationsManager />} />
              </Route>
            </Route>
            
            {/* Auth Routes (without layout) */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
