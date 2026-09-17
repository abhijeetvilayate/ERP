import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    phoneNumber: '',
    role: '',
    department: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'role') {
      let autoDept = formData.department;
      if (value === 'PRINCIPAL' || value === 'ACCOUNTS') {
        autoDept = 'Administration Department';
      } else if (value === 'LIBRARY') {
        autoDept = 'Library Department';
      } else if (formData.department === 'Administration Department' || formData.department === 'Library Department') {
        autoDept = '';
      }

      setFormData((prev) => ({
        ...prev,
        role: value,
        department: autoDept
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const username = formData.username.trim();
    const phoneNumber = formData.phoneNumber.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const role = formData.role;
    const department = formData.department;

    // Required fields check
    if (!fullName || !email || !username || !phoneNumber || !role || !department || !password || !confirmPassword) {
      setError('Please fill in all required fields marked with *.');
      return;
    }

    // Full Name: 3 - 100 characters
    if (fullName.length < 3 || fullName.length > 100) {
      setError('Full Name must be between 3 and 100 characters.');
      return;
    }

    // Email validation: 5 - 100 characters & format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length < 5 || email.length > 100 || !emailRegex.test(email)) {
      setError('Please enter a valid email address (5 to 100 characters).');
      return;
    }

    // Username: 3 - 50 characters
    if (username.length < 3 || username.length > 50) {
      setError('Username must be between 3 and 50 characters.');
      return;
    }

    // Phone number: 10 - 15 digits
    const cleanedPhone = phoneNumber.replace(/[\s+-]/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 15 || !/^\d+$/.test(cleanedPhone)) {
      setError('Phone number must contain between 10 and 15 digits.');
      return;
    }

    // Password: 6 - 64 characters
    if (password.length < 6 || password.length > 64) {
      setError('Password must be between 6 and 64 characters.');
      return;
    }

    // Passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      if (register) {
        const response = await register({
          ...formData,
          fullName,
          email,
          username,
          phoneNumber
        });
        if (response?.success) {
          navigate('/login');
        } else {
          setError(response?.message || 'Registration failed. Please try again.');
        }
      } else {
        // Fallback simulation
        navigate('/login');
      }
    } catch (err) {
      setError('Connection error. Could not complete registration.');
    } finally {
      setLoading(false);
    }
  };

  const isAutoDeptRole = ['PRINCIPAL', 'ACCOUNTS', 'LIBRARY'].includes(formData.role);

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between bg-light py-4">
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card border-0 shadow-lg rounded-3 p-4 p-sm-5 bg-white w-100" style={{ maxWidth: '600px' }}>
          
          {/* Header & Logo */}
          <div className="text-center mb-4">
            <div className="text-primary mb-2 d-inline-block">
              <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <h4 className="fw-bold text-uppercase tracking-wider text-dark mb-1">
              COLLEGE ERP SYSTEM
            </h4>
            <p className="text-muted small mb-0">Create a new account</p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="alert alert-danger text-sm py-2 px-3 border-0 rounded-3 mb-3" role="alert">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            
            {/* Full Name & Email Row */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-muted small fw-semibold mb-0">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <span className="text-muted" style={{ fontSize: '11px' }}>3-100 chars</span>
                </div>
                <input
                  type="text"
                  name="fullName"
                  className="form-control bg-light border-light text-sm p-2.5 shadow-none"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-muted small fw-semibold mb-0">
                    Email <span className="text-danger">*</span>
                  </label>
                  <span className="text-muted" style={{ fontSize: '11px' }}>5-100 chars</span>
                </div>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-light border-light text-sm p-2.5 shadow-none"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  minLength={5}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Username & Phone Number Row */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-muted small fw-semibold mb-0">
                    Username <span className="text-danger">*</span>
                  </label>
                  <span className="text-muted" style={{ fontSize: '11px' }}>3-50 chars</span>
                </div>
                <input
                  type="text"
                  name="username"
                  className="form-control bg-light border-light text-sm p-2.5 shadow-none"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-muted small fw-semibold mb-0">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <span className="text-muted" style={{ fontSize: '11px' }}>10-15 digits</span>
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-control bg-light border-light text-sm p-2.5 shadow-none"
                  placeholder="e.g. 9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={15}
                  pattern="[0-9+\s-]{10,15}"
                  title="Phone number must be between 10 and 15 digits"
                />
              </div>
            </div>

            {/* Role & Department Row */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-muted small fw-semibold mb-0">
                    Role <span className="text-danger">*</span>
                  </label>
                </div>
                <select
                  name="role"
                  className="form-select bg-light border-light text-sm p-2.5 shadow-none"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="HOD">HOD (Head of Department)</option>
                  <option value="PRINCIPAL">Principal</option>
                  <option value="ACCOUNTS">Accounts</option>
                  <option value="LIBRARY">Library Staff</option>
                </select>
              </div>

              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-muted small fw-semibold mb-0">
                    Department <span className="text-danger">*</span>
                  </label>
                </div>
                {isAutoDeptRole ? (
                  <input
                    type="text"
                    name="department"
                    className="form-control bg-light border-light text-sm p-2.5 shadow-none fw-semibold text-primary"
                    value={formData.department}
                    readOnly
                    required
                  />
                ) : (
                  <select
                    name="department"
                    className="form-select bg-light border-light text-sm p-2.5 shadow-none"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="1">Chemical Engineering</option>
                    <option value="2">Computer Engineering</option>
                    <option value="3">Mechanical Engineering</option>
                    <option value="4">Civil Engineering</option>
                    <option value="5">Electrical Engineering</option>
                    <option value="6">Information Technology</option>
                  </select>
                )}
              </div>
            </div>

            {/* Password & Confirm Password Row */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-muted small fw-semibold mb-0">
                    Password <span className="text-danger">*</span>
                  </label>
                  <span className="text-muted" style={{ fontSize: '11px' }}>6-64 chars</span>
                </div>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-control bg-light border-light text-sm p-2.5 pe-5 shadow-none"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    maxLength={64}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted pe-3 shadow-none border-0"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-muted small fw-semibold mb-0">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <span className="text-muted" style={{ fontSize: '11px' }}>6-64 chars</span>
                </div>
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-control bg-light border-light text-sm p-2.5 pe-5 shadow-none"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    maxLength={64}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted pe-3 shadow-none border-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="form-check mb-4">
              <input
                type="checkbox"
                name="agreeTerms"
                className="form-check-input shadow-none"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <label className="form-check-label text-muted small" htmlFor="agreeTerms">
                I agree to the{' '}
                <a href="#terms" className="text-primary text-decoration-none fw-semibold">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-primary text-decoration-none fw-semibold">
                  Privacy Policy
                </a> <span className="text-danger">*</span>
              </label>
            </div>

            {/* Sign Up Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2.5 fw-semibold shadow-sm text-sm"
              style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Already Have an Account Link */}
          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none ms-1">
                Login
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 text-muted small">
        &copy; {new Date().getFullYear()} College ERP System. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;