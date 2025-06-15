
import React from 'react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card p-8 md:p-12 rounded-2xl shadow-xl animate-fade-in border-t-8 border-eemploi-primary">
            <h1 className="text-3xl md:text-4xl font-extrabold text-eemploi-dark mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Dernière mise à jour : {lastUpdated}
            </p>
            <div className="legal-content space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPageLayout;
