import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const About = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <main className="flex-grow-1">
        <section className="text-white py-5" style={{ backgroundColor: '#0b192c' }}>
          <div className="container py-lg-4">
            <h1 className="display-6 fw-bold text-uppercase mb-2">About Us</h1>
            <p className="text-white-50 mb-0">A connected digital platform for the college community.</p>
          </div>
        </section>
        <section className="py-5">
          <div className="container py-lg-3">
            <div className="row g-4 align-items-center">
              <div className="col-lg-7">
                <h2 className="fw-bold text-dark mb-3">One place for everyday campus operations</h2>
                <p className="text-muted mb-3">
                  College ERP System brings academic, administrative, and student services together in one clear workflow.
                </p>
                <p className="text-muted mb-0">
                  Students, faculty, departments, accounts teams, library staff, and administrators get role-based access to the information and tools they use most.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                  <h5 className="fw-bold text-dark mb-3">Built for collaboration</h5>
                  <ul className="text-muted mb-0 ps-3">
                    <li className="mb-2">Centralized academic records</li>
                    <li className="mb-2">Clear role-based workflows</li>
                    <li>Accessible campus information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
