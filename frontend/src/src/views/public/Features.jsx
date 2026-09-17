import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ServicesGrid from '../../components/public/ServicesGrid';

const Features = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <main className="flex-grow-1">
        <section className="text-white py-5" style={{ backgroundColor: '#0b192c' }}>
          <div className="container py-lg-4">
            <h1 className="display-6 fw-bold text-uppercase mb-2">Features</h1>
            <p className="text-white-50 mb-0">Tools designed for every role across campus.</p>
          </div>
        </section>
        <ServicesGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Features;
