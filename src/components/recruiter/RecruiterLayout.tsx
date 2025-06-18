import RecruiterSidebar from './RecruiterSidebar';

const RecruiterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <RecruiterSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default RecruiterLayout;
