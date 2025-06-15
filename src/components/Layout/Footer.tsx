
import FooterBrand from '@/components/footer/FooterBrand';
import FooterLinks from '@/components/footer/FooterLinks';
import Newsletter from '@/components/footer/Newsletter';
import FooterBottom from '@/components/footer/FooterBottom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-eemploi-primary/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-eemploi-secondary/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-eemploi-accent/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <FooterBrand />
          <FooterLinks />
        </div>

        <Newsletter />
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
