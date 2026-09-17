import { useState } from 'react';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPaperPlane 
} from 'react-icons/fa';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    // Required fields check
    if (!name || !email || !subject || !message) {
      setError('Please fill in all required fields marked with *.');
      return;
    }

    // Name length check (3 - 100 chars)
    if (name.length < 3 || name.length > 100) {
      setError('Name must be between 3 and 100 characters.');
      return;
    }

    // Email format and length check (5 - 100 chars)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length < 5 || email.length > 100 || !emailRegex.test(email)) {
      setError('Please enter a valid email address (5 to 100 characters).');
      return;
    }

    // Subject length check (5 - 150 chars)
    if (subject.length < 5 || subject.length > 150) {
      setError('Subject must be between 5 and 150 characters.');
      return;
    }

    // Message length check (10 - 1000 chars)
    if (message.length < 10 || message.length > 1000) {
      setError('Message must be between 10 and 1000 characters.');
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setError('');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div id="contact" className="bg-light min-vh-100">
      {/* Top Hero Banner Section */}
      <section 
        className="text-white py-5 position-relative"
        style={{ backgroundColor: '#0b192c' }}
      >
        <div className="container py-lg-4">
          <h1 className="display-6 fw-extrabold text-uppercase tracking-tight mb-2">
            CONTACT US
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 text-white-50 small">
              <li className="breadcrumb-item text-white-50">Home</li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                Contact Us
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-5">
        <div className="container py-lg-3">
          <div className="row g-4">
            
            {/* Left Column: GET IN TOUCH */}
            <div className="col-lg-5">
              <h5 className="fw-bold text-uppercase tracking-wider text-dark mb-4">
                GET IN TOUCH
              </h5>

              <div className="d-flex flex-column gap-3">
                
                {/* Phone Card */}
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary flex-shrink-0"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <FaPhoneAlt size={16} />
                    </div>
                    <div>
                      <span className="text-muted d-block fw-semibold" style={{ fontSize: '11px' }}>
                        Phone
                      </span>
                      <span className="fw-bold text-dark small">
                        +91 1234567890
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary flex-shrink-0"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <FaEnvelope size={16} />
                    </div>
                    <div>
                      <span className="text-muted d-block fw-semibold" style={{ fontSize: '11px' }}>
                        Email
                      </span>
                      <span className="fw-bold text-dark small">
                        info@collegeerp.com
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary flex-shrink-0"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <FaMapMarkerAlt size={16} />
                    </div>
                    <div>
                      <span className="text-muted d-block fw-semibold" style={{ fontSize: '11px' }}>
                        Address
                      </span>
                      <span className="fw-bold text-dark small">
                        College Campus, India
                      </span>
                    </div>
                  </div>
                </div>

                {/* Working Hours Card */}
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary flex-shrink-0"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <FaClock size={16} />
                    </div>
                    <div>
                      <span className="text-muted d-block fw-semibold" style={{ fontSize: '11px' }}>
                        Working Hours
                      </span>
                      <span className="fw-bold text-dark small">
                        Mon - Sat: 9:00 AM - 6:00 PM
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: SEND US A MESSAGE */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
                <h5 className="fw-bold text-uppercase tracking-wider text-dark mb-4">
                  SEND US A MESSAGE
                </h5>

                {submitted ? (
                  <div className="alert alert-success border-0 text-center py-5 mb-0 my-auto" role="alert">
                    <h6 className="alert-heading fw-bold mb-2">Message Sent Successfully!</h6>
                    <p className="small text-muted mb-4">
                      Thank you for contacting us. Our campus administration team will respond to your query shortly.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)} 
                      className="btn btn-primary btn-sm px-4 fw-semibold"
                      style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="d-flex flex-column h-100">
                    
                    {/* Error Banner Alert */}
                    {error && (
                      <div className="alert alert-danger text-sm py-2 px-3 border-0 rounded-3 mb-3" role="alert">
                        {error}
                      </div>
                    )}

                    {/* Name & Email Row */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <label className="form-label text-muted small fw-semibold mb-0">
                            Your Name <span className="text-danger">*</span>
                          </label>
                          <span className="text-muted" style={{ fontSize: '11px' }}>3-100 chars</span>
                        </div>
                        <input
                          type="text"
                          name="name"
                          className="form-control bg-light border-light text-sm p-2.5 shadow-none"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          minLength={3}
                          maxLength={100}
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <label className="form-label text-muted small fw-semibold mb-0">
                            Email Address <span className="text-danger">*</span>
                          </label>
                          <span className="text-muted" style={{ fontSize: '11px' }}>5-100 chars</span>
                        </div>
                        <input
                          type="email"
                          name="email"
                          className="form-control bg-light border-light text-sm p-2.5 shadow-none"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          minLength={5}
                          maxLength={100}
                        />
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label text-muted small fw-semibold mb-0">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <span className="text-muted" style={{ fontSize: '11px' }}>5-150 chars</span>
                      </div>
                      <input
                        type="text"
                        name="subject"
                        className="form-control bg-light border-light text-sm p-2.5 shadow-none"
                        placeholder="Enter message subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        minLength={5}
                        maxLength={150}
                      />
                    </div>

                    {/* Message Textarea */}
                    <div className="mb-4 flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label text-muted small fw-semibold mb-0">
                          Message <span className="text-danger">*</span>
                        </label>
                        <span className="text-muted" style={{ fontSize: '11px' }}>
                          {formData.message.length} / 1000 chars (min 10)
                        </span>
                      </div>
                      <textarea
                        name="message"
                        rows="5"
                        className="form-control bg-light border-light text-sm p-2.5 shadow-none"
                        placeholder="Write your message here (10 to 1000 characters)..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        minLength={10}
                        maxLength={1000}
                        style={{ minHeight: '130px' }}
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-auto">
                      <button
                        type="submit"
                        className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2.5 text-sm fw-semibold shadow-sm"
                        style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <FaPaperPlane size={12} />
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactForm;