
import React from 'react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card p-8 md:p-12 rounded-2xl shadow-xl animate-fade-in border-t-8 border-eemploi-primary">
            <h1 className="text-3xl md:text-4xl font-extrabold text-eemploi-dark mb-4 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-muted-foreground mb-8">
                {subtitle}
              </p>
            )}
            <div className="content-area space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
