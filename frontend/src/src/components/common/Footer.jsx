
import { Link } from 'react-router-dom';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram 
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer 
      className="text-white pt-5 pb-3 border-top border-secondary border-opacity-25"
      style={{ backgroundColor: '#0b192c' }}
    >
      <div className="container">
        <div className="row gy-4 mb-4">
          
          {/* Column 1: Brand & Tagline */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center mb-2">
              <div className="text-primary me-2 d-flex align-items-center">
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
                </svg>
              </div>
              <span className="fw-bold text-uppercase tracking-wider fs-6">
                College ERP System
              </span>
            </div>
            <p className="text-white-50 small mb-0">
              Empowering Education with Technology
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3 tracking-wider text-light">
              Quick Links
            </h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-1 small">
              <li>
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-white-50 text-decoration-none hover-white">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="text-white-50 text-decoration-none hover-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white-50 text-decoration-none hover-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3 tracking-wider text-light">
              Contact Us
            </h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small text-white-50">
              <li className="d-flex align-items-center gap-2">
                <FaPhoneAlt size={12} className="text-white-50" />
                <span>+91 1234567890</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope size={12} className="text-white-50" />
                <span>info@collegeerp.com</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt size={12} className="text-white-50" />
                <span>College Campus, India</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3 tracking-wider text-light">
              Follow Us
            </h6>
            <div className="d-flex gap-2">
              <a
                href="#facebook"
                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{ width: '36px', height: '36px', backgroundColor: '#3b5998', borderColor: '#3b5998' }}
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="#twitter"
                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{ width: '36px', height: '36px', backgroundColor: '#1da1f2', borderColor: '#1da1f2' }}
              >
                <FaTwitter size={14} />
              </a>
              <a
                href="#linkedin"
                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{ width: '36px', height: '36px', backgroundColor: '#0077b5', borderColor: '#0077b5' }}
              >
                <FaLinkedinIn size={14} />
              </a>
              <a
                href="#instagram"
                className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{ width: '36px', height: '36px', backgroundColor: '#e1306c', borderColor: '#e1306c' }}
              >
                <FaInstagram size={14} />
              </a>
            </div>
          </div>

        </div>

        <hr className="border-secondary opacity-25 my-3" />

        {/* Copyright Note */}
        <div className="text-center text-white-50 small">
          &copy; {new Date().getFullYear()} College ERP System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;