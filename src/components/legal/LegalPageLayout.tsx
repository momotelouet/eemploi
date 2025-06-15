
import React from 'react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Dernière mise à jour : {lastUpdated}
            </p>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPageLayout;
