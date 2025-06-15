
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnimatedAssistant from '@/components/chat/AnimatedAssistant';

const Layout = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <AnimatedAssistant />
    </>
  );
};

export default Layout;
