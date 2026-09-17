import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUserCheck, FiZap, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (login) {
        const response = await login(username, password);
        if (response?.success && response.user) {
          const role = response.user.role.toLowerCase();
          navigate(`/${role}/dashboard`);
        } else {
          setError(response?.message || 'Invalid username or password.');
        }
      } else {
        // Fallback simulation if AuthContext isn't connected yet
        navigate('/student/dashboard');
      }
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : err?.message || 'Connection failed. Please check server connection.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between bg-light">
      <div className="container-fluid p-0 flex-grow-1 d-flex">
        <div className="row g-0 w-100">
          
          {/* Left Hero Image Column */}
          <div 
            className="col-lg-6 d-none d-lg-flex flex-column justify-content-center text-white p-5 position-relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(11, 25, 44, 0.88), rgba(11, 25, 44, 0.88)), url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="p-4 z-1 max-w-lg">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-primary bg-opacity-25 border border-primary border-opacity-50 text-light small mb-3">
                <FiShield className="text-info" />
                <span>Enterprise Academic Management</span>
              </div>
              <h1 className="display-4 fw-bold mb-3">Welcome Back!</h1>
              <h2 className="h3 fw-semibold text-white-50 mb-4">
                Sign in to continue to <br />
                <span className="text-white fw-bold">College ERP System</span>
              </h2>
              <p className="lead text-white-50 fs-6 mb-4">
                Manage academic schedules, attendance, fees, library, and administrative operations efficiently across 7 role workspaces.
              </p>

              {/* Feature Highlights */}
              <div className="row g-3 text-white-50 small mt-2">
                <div className="col-6 d-flex align-items-center gap-2">
                  <FiUserCheck className="text-success" />
                  <span>Role-Based Access Control</span>
                </div>
                <div className="col-6 d-flex align-items-center gap-2">
                  <FiZap className="text-warning" />
                  <span>Real-time Operations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-sm-5 bg-white">
            <div className="w-100" style={{ maxWidth: '440px' }}>
              
              {/* College ERP Logo Header */}
              <div className="text-center mb-4">
                <div className="text-primary mb-2 d-inline-block">
                  <svg width="42" height="42" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
                  </svg>
                </div>
                <h4 className="fw-bold text-uppercase tracking-wider text-dark mb-1">
                  COLLEGE ERP SYSTEM
                </h4>
                <p className="text-muted small mb-0">Login to your institutional account</p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger text-sm py-2 px-3 border-0 rounded-3 mb-3" role="alert">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Username Input */}
                <div className="mb-3">
                  <label className="form-label text-muted small fw-semibold">Username or Email</label>
                  <input
                    type="text"
                    className="form-control bg-light border-light text-sm p-2.5 shadow-none"
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input with Eye Toggle */}
                <div className="mb-3">
                  <label className="form-label text-muted small fw-semibold">Password</label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control bg-light border-light text-sm p-2.5 pe-5 shadow-none"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted pe-3 shadow-none border-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input shadow-none"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label text-muted small" htmlFor="rememberMe">
                      Remember Me
                    </label>
                  </div>
                  <a href="#forgot-password" className="text-primary small text-decoration-none fw-semibold">
                    Forgot Password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 fw-semibold shadow-sm text-sm"
                  style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              {/* Register Account Footer Link */}
              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-semibold text-decoration-none ms-1">
                    Sign Up
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Page Footer Copyright */}
      <footer className="text-center py-3 bg-white border-top border-light text-muted small">
        &copy; {new Date().getFullYear()} College ERP System. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;