import { Link } from 'react-router-dom';
import { FiUser, FiUserPlus } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section 
      id="about"
      className="text-white position-relative overflow-hidden py-5"
      style={{ backgroundColor: '#0b192c', minHeight: '480px' }}
    >
      <div className="container py-lg-4">
        <div className="row align-items-center gy-4">
          
          {/* Left Text & Call to Action Column */}
          <div className="col-lg-6 z-1">
            <span 
              className="text-uppercase tracking-wider fw-bold text-primary mb-2 d-block small"
              style={{ color: '#0066ff' }}
            >
              Welcome To
            </span>
            
            <h1 className="display-5 fw-extrabold text-uppercase tracking-tight text-white mb-3">
              College ERP System
            </h1>
            
            <p className="lead text-white-50 fs-6 mb-4 pe-lg-4" style={{ lineHeight: '1.6' }}>
              A complete solution to manage students, faculty, attendance, fees, library, and much more – all in one place.
            </p>

            {/* Hero CTA Action Buttons */}
            <div className="d-flex align-items-center gap-3">
              <Link 
                to="/login" 
                className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2.5 fw-semibold rounded-2 shadow-sm"
                style={{ backgroundColor: '#2B7FFF', borderColor: '#2B7FFF' }}
              >
                <FiUser size={18} />
                <span>Login</span>
              </Link>
              
              <Link 
                to="/register" 
                className="btn btn-light d-inline-flex align-items-center gap-2 px-4 py-2.5 fw-semibold text-dark rounded-2 shadow-sm"
              >
                <FiUserPlus size={18} />
                <span>Register</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Image Column */}
          <div className="col-lg-6">
            <div className="position-relative rounded-3 overflow-hidden shadow-lg">
              <img 
                src="/assets/campus-hero.jpg" 
                alt="College Campus Students" 
                className="img-fluid w-100 object-fit-cover"
                style={{ maxHeight: '380px', filter: 'brightness(0.95)' }}
                onError={(e) => {
                  // Fallback image if local asset isn't present
                  e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop';
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;