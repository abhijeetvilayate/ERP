import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiX, 
  FiLayout, 
  FiCheckSquare, 
  FiCalendar, 
  FiFileText, 
  FiBookOpen, 
  FiDollarSign, 
  FiBook, 
  FiSend, 
  FiUserX,
  FiArrowRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const SEARCH_DIRECTORY = [
  {
    title: 'Dashboard Overview',
    description: 'System overview, quick stats, announcements, and recent activities',
    path: '/dashboard',
    category: 'General',
    icon: FiLayout,
    keywords: ['home', 'dashboard', 'overview', 'summary', 'stats', 'metrics']
  },
  {
    title: 'User Profile & Settings',
    description: 'Personal details, contact information, role credentials, and bio',
    path: '/profile',
    category: 'Account',
    icon: FiUser,
    keywords: ['profile', 'account', 'settings', 'email', 'phone', 'roll no', 'employee id', 'password']
  },
  {
    title: 'Attendance Records',
    description: 'Daily subject attendance logs, percentage tracker, and status reports',
    path: '/attendance',
    category: 'Academic',
    icon: FiCheckSquare,
    keywords: ['attendance', 'present', 'absent', 'percentage', 'classes', 'roll call']
  },
  {
    title: 'Weekly Timetable',
    description: 'Daily class schedule, lecture rooms, timing slots, and faculty allocation',
    path: '/timetable',
    category: 'Academic',
    icon: FiCalendar,
    keywords: ['timetable', 'schedule', 'routine', 'lecture', 'classes', 'timing', 'room']
  },
  {
    title: 'Assignments & Submissions',
    description: 'Coursework tasks, submission deadlines, uploads, and faculty grades',
    path: '/assignments',
    category: 'Academic',
    icon: FiFileText,
    keywords: ['assignments', 'homework', 'projects', 'submissions', 'grades', 'marks', 'tasks', 'deadline']
  },
  {
    title: 'Subjects & Curriculum',
    description: 'Enrolled courses, syllabus details, faculty teachers, and credits',
    path: '/subjects',
    category: 'Academic',
    icon: FiBookOpen,
    keywords: ['subjects', 'courses', 'syllabus', 'credits', 'curriculum', 'topics']
  },
  {
    title: 'Fee Status & Receipts',
    description: 'Tuition balance, paid receipts, installment breakdown, and dues',
    path: '/fees',
    category: 'Finance',
    icon: FiDollarSign,
    keywords: ['fees', 'dues', 'payments', 'receipts', 'finance', 'scholarship', 'balance', 'installments']
  },
  {
    title: 'Central Library & Books',
    description: 'Book catalog, issued books, return due dates, and digital resources',
    path: '/library',
    category: 'Library',
    icon: FiBook,
    keywords: ['library', 'books', 'borrow', 'issue', 'author', 'isbn', 'catalog', 'return']
  },
  {
    title: 'Leave Requests & Approvals',
    description: 'Apply for medical/personal leave, track approval status, and remarks',
    path: '/leave-request',
    category: 'Administration',
    icon: FiSend,
    keywords: ['leave', 'absence', 'apply leave', 'permission', 'medical leave', 'approval', 'sick']
  },
  {
    title: 'Notices & Circulars',
    description: 'Official college circulars, exam notifications, and campus news',
    path: '/notices',
    category: 'General',
    icon: FiBell,
    keywords: ['notices', 'announcements', 'circulars', 'news', 'events', 'exams', 'updates']
  },
  {
    title: 'Delete & Manage Users (Admin)',
    description: 'Search, view directory, and permanently delete user accounts from Oracle DB',
    path: '/admin/manage-users',
    category: 'Admin Control',
    icon: FiUserX,
    adminOnly: true,
    keywords: ['delete user', 'manage users', 'remove user', 'admin', 'user directory', 'accounts']
  }
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Notification state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifContainerRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  const isActive = (path) => location.pathname === path;
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SYSTEM_ADMIN');

  // Load notifications for current user
  const loadUserNotifications = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('erp_user_notifications') || '[]');
      if (user) {
        const userNotifs = stored.filter((n) => {
          if (!n.recipientRole && !n.recipientName && !n.recipientId) return true;
          return (
            n.recipientRole === user.role ||
            n.recipientName === user.fullName ||
            n.recipientName === user.username ||
            n.recipientId === user.userId
          );
        });
        setNotifications(userNotifs);
      } else {
        setNotifications([]);
      }
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    }
  };

  useEffect(() => {
    loadUserNotifications();
    const handleNewNotif = () => {
      loadUserNotifications();
    };
    window.addEventListener('erp_new_notification', handleNewNotif);
    return () => window.removeEventListener('erp_new_notification', handleNewNotif);
  }, [user]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('erp_user_notifications') || '[]');
      const updated = stored.map((n) => ({ ...n, read: true }));
      localStorage.setItem('erp_user_notifications', JSON.stringify(updated));
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error('Failed to mark read:', e);
    }
  };

  // Filter Search Results
  const matchingResults = SEARCH_DIRECTORY.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (!searchQuery.trim()) return false;

    const query = searchQuery.toLowerCase().trim();
    const matchTitle = item.title.toLowerCase().includes(query);
    const matchDesc = item.description.toLowerCase().includes(query);
    const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(query));

    return matchTitle || matchDesc || matchKeywords;
  });

  const handleSelectResult = (path) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && matchingResults.length > 0) {
      handleSelectResult(matchingResults[0].path);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark px-4 py-2 border-bottom border-secondary border-opacity-25 shadow-sm"
      style={{ backgroundColor: '#0b192c', position: 'relative', zIndex: 1030 }}
    >
      <div className="container-fluid px-0">
        {/* Brand Name */}
        <Link 
          to={user ? "/dashboard" : "/"} 
          className="navbar-brand text-white fw-bold me-4 text-decoration-none text-uppercase tracking-wider fs-6 mb-0"
          title={user ? "Go to Dashboard" : "College ERP Home"}
        >
          College ERP System
        </Link>

        {/* Navbar Toggle for Mobile */}
        <button 
          className="navbar-toggler shadow-none border-secondary" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {user ? (
            /* Dashboard Topbar View (When User is Logged In) */
            <div className="d-flex w-100 align-items-center justify-content-between">
              
              {/* Functional Search Bar with Dropdown Container */}
              <div 
                ref={searchContainerRef} 
                className="position-relative"
                style={{ width: '100%', maxWidth: '380px' }}
              >
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-50 text-light border-end-0">
                    <FiSearch className="text-primary" />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary border-opacity-50 border-start-0 border-end-0 text-sm shadow-none"
                    placeholder="Search modules, pages, subjects, fees..."
                    value={searchQuery}
                    onFocus={() => setIsSearchOpen(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="btn bg-dark border-secondary border-opacity-50 border-start-0 text-muted shadow-none"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown Overlay */}
                {isSearchOpen && searchQuery.trim().length > 0 && (
                  <div 
                    className="position-absolute top-100 start-0 w-100 mt-2 bg-white rounded-3 shadow-lg border border-light overflow-hidden"
                    style={{ maxHeight: '380px', overflowY: 'auto', zIndex: 1050 }}
                  >
                    <div className="p-2 bg-light border-bottom d-flex align-items-center justify-content-between">
                      <span className="text-xs fw-bold text-uppercase text-muted">
                        Search Results ({matchingResults.length})
                      </span>
                      <span className="text-xs text-muted">Press Enter to select</span>
                    </div>

                    {matchingResults.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <FiSearch size={24} className="mb-2 opacity-50" />
                        <p className="small mb-0 fw-semibold text-dark">No matching ERP pages found</p>
                        <p className="text-xs mb-0 text-muted">Try searching for attendance, timetable, fees, or assignments.</p>
                      </div>
                    ) : (
                      <div className="p-1">
                        {matchingResults.map((result) => {
                          const IconComponent = result.icon || FiLayout;
                          return (
                            <button
                              key={result.path}
                              type="button"
                              onClick={() => handleSelectResult(result.path)}
                              className="btn w-100 text-start d-flex align-items-start gap-3 p-2.5 rounded-2 border-0 hover-bg-light transition-all shadow-none mb-1"
                              style={{ backgroundColor: 'transparent' }}
                            >
                              <div className="p-2 rounded-2 bg-primary bg-opacity-10 text-primary flex-shrink-0 mt-0.5">
                                <IconComponent size={16} />
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <div className="d-flex align-items-center justify-content-between">
                                  <span className="fw-semibold text-dark text-sm">{result.title}</span>
                                  <span className="badge bg-secondary bg-opacity-10 text-secondary text-xs px-2">
                                    {result.category}
                                  </span>
                                </div>
                                <p className="text-muted text-xs mb-0 text-truncate">
                                  {result.description}
                                </p>
                              </div>
                              <FiArrowRight className="text-muted opacity-50 align-self-center flex-shrink-0" size={14} />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side Icons & Profile Info */}
              <div className="d-flex align-items-center gap-3">
                {/* Notification Bell with Interactive Dropdown */}
                <div className="position-relative" ref={notifContainerRef}>
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="btn btn-dark position-relative p-2 border-0 rounded-circle text-light shadow-none"
                    title="View Notifications & Notices"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  >
                    <FiBell size={18} />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '9px', padding: '3px 5px' }}>
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Panel */}
                  {isNotifOpen && (
                    <div 
                      className="card border-0 shadow-lg rounded-3 position-absolute end-0 mt-2 bg-white overflow-hidden text-start"
                      style={{ width: '360px', zIndex: 1060 }}
                    >
                      <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <FiBell className="text-primary" size={16} />
                          <span className="fw-bold text-dark text-sm mb-0">Notifications</span>
                          {notifications.filter((n) => !n.read).length > 0 && (
                            <span className="badge bg-danger text-white rounded-pill px-2" style={{ fontSize: '10px' }}>
                              {notifications.filter((n) => !n.read).length} new
                            </span>
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <button 
                            onClick={markAllRead}
                            className="btn btn-link text-primary p-0 text-xs fw-semibold text-decoration-none shadow-none"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="overflow-y-auto" style={{ maxHeight: '340px' }}>
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setIsNotifOpen(false);
                                if (notif.link) navigate(notif.link);
                              }}
                              className={`p-3 border-bottom border-light cursor-pointer hover-bg-light transition-all ${
                                !notif.read ? 'bg-primary bg-opacity-10' : 'bg-white'
                              }`}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                                <span className={`fw-semibold text-xs ${notif.type === 'danger' ? 'text-danger' : notif.type === 'success' ? 'text-success' : 'text-dark'}`}>
                                  {notif.title}
                                </span>
                                <span className="text-muted" style={{ fontSize: '10px' }}>
                                  {notif.createdAt || 'Today'}
                                </span>
                              </div>
                              <p className="text-muted small mb-0 lh-sm" style={{ fontSize: '12px' }}>
                                {notif.message}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-muted small">
                            <FiBell className="opacity-25 mb-2 d-block mx-auto" size={24} />
                            <span>No new notifications at this time.</span>
                          </div>
                        )}
                      </div>

                      <div className="card-footer bg-light p-2 text-center border-0">
                        <Link 
                          to="/notices" 
                          onClick={() => setIsNotifOpen(false)}
                          className="btn btn-link text-primary p-0 text-xs fw-semibold text-decoration-none shadow-none"
                        >
                          View All Institutional Notices →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Info & Role Badge */}
                <Link to="/profile" className="d-flex align-items-center gap-2 text-decoration-none" title="View Profile">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '13px' }}>
                    {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-start leading-tight">
                    <p className="mb-0 text-white fw-semibold small">{user.fullName || user.username || 'User Profile'}</p>
                    <span className="badge bg-primary bg-opacity-25 text-primary text-uppercase px-2" style={{ fontSize: '10px' }}>
                      {user.role || 'Student'}
                    </span>
                  </div>
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={logout} 
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 ms-2 shadow-none"
                  title="Sign out of ERP system"
                >
                  <FiLogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            /* Public Landing View (When Not Logged In) */
            <div className="d-flex w-100 justify-content-between align-items-center">
              <ul className="navbar-nav mx-auto gap-4">
                <li className="nav-item">
                  <Link
                    to="/"
                    className={`nav-link text-white ${isActive('/') ? 'border-bottom border-2 border-primary active' : 'text-white-50'}`}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className={`nav-link text-white ${isActive('/about') ? 'border-bottom border-2 border-primary active' : 'text-white-50'}`}>About</Link>
                </li>
                <li className="nav-item">
                  <Link to="/features" className={`nav-link text-white ${isActive('/features') ? 'border-bottom border-2 border-primary active' : 'text-white-50'}`}>Features</Link>
                </li>
                <li className="nav-item">
                  <Link to="/contact" className={`nav-link text-white ${isActive('/contact') ? 'border-bottom border-2 border-primary active' : 'text-white-50'}`}>Contact</Link>
                </li>
              </ul>

              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light px-4 py-1.5 text-sm fw-semibold shadow-none">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary px-4 py-1.5 text-sm fw-semibold shadow-none" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;