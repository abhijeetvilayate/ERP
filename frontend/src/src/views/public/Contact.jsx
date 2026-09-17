import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ContactForm from '../../components/public/ContactForm';

const Contact = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <main className="flex-grow-1">
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
