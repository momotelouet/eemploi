
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';

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

import Tools from "@/pages/Tools";
import LiveChatWidget from './components/chat/LiveChatWidget';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfUse from './pages/legal/TermsOfUse';
import CookiePolicy from './pages/legal/CookiePolicy';
import CareerAdvice from './pages/CareerAdvice';
import Blog from './pages/Blog';
import Trends from './pages/Trends';
import HRSolutions from './pages/HRSolutions';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Press from './pages/Press';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
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
                <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                <Route path="/legal/terms" element={<TermsOfUse />} />
                <Route path="/legal/cookies" element={<CookiePolicy />} />
                
                <Route path="/conseils-carriere" element={<CareerAdvice />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/tendances" element={<Trends />} />
                <Route path="/solutions-rh" element={<HRSolutions />} />
                <Route path="/tarifs" element={<Pricing />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/presse" element={<Press />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute />}>
                  <Route path="candidat" element={<CandidateDashboard />} />
                  <Route path="recruteur" element={<RecruiterDashboard />} />
                  <Route path="admin" element={<AdminDashboard />} />
                </Route>
                
                <Route path="/recruteur" element={<ProtectedRoute requiredUserType="recruteur" />}>
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
            <LiveChatWidget />
          </Router>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
