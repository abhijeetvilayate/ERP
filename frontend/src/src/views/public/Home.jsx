import Navbar from '../../components/common/Navbar';
import HeroSection from '../../components/public/HeroSection';
import ServicesGrid from '../../components/public/ServicesGrid';
import ContactForm from '../../components/public/ContactForm';
import Footer from '../../components/common/Footer';

const Home = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow-1">
        {/* Hero Section with College Graphic and Login/Register CTA */}
        <HeroSection />

        {/* Our Services Section displaying Role-based Portals */}
        <ServicesGrid />

        {/* Contact Form Section */}
        <ContactForm />
      </main>

      {/* Footer Section with Quick Links & Social Media Icons */}
      <Footer />
    </div>
  );
};

export default Home;