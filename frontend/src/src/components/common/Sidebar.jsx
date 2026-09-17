import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiLayout,
  FiUser,
  FiCheckSquare,
  FiCalendar,
  FiFileText,
  FiBookOpen,
  FiDollarSign,
  FiBook,
  FiSend,
  FiBell,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiUserX
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SYSTEM_ADMIN');

  // Retrieve initial collapsed state from localStorage
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('erp_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const nextState = !prev;
      try {
        localStorage.setItem('erp_sidebar_collapsed', String(nextState));
      } catch (err) {
        console.error('Failed to save sidebar state:', err);
      }
      return nextState;
    });
  };

  // Listen for global toggle triggers (e.g. clicking the college logo symbol in the navbar)
  useEffect(() => {
    const handleGlobalToggle = () => {
      toggleCollapse();
    };
    window.addEventListener('erp_toggle_sidebar', handleGlobalToggle);
    return () => window.removeEventListener('erp_toggle_sidebar', handleGlobalToggle);
  }, []);

  // Role-based Nav Item Exclusions matching specification:
  // admin: Attendance, Timetable, Assignment, Subjects
  // accounts: Timetable, Assignments, Subjects
  // librarian: Attendance, Timetable
  // principal: Timetable, Assignments
  // faculty: Fee Status
  const ROLE_EXCLUSIONS = {
    ADMIN: ['Attendance', 'Timetable', 'Assignments', 'Subjects'],
    SYSTEM_ADMIN: ['Attendance', 'Timetable', 'Assignments', 'Subjects'],
    ACCOUNTS: ['Timetable', 'Assignments', 'Subjects'],
    LIBRARY: ['Attendance', 'Timetable'],
    LIBRARIAN: ['Attendance', 'Timetable'],
    PRINCIPAL: ['Timetable', 'Assignments'],
    VICE_PRINCIPAL: ['Timetable', 'Assignments'],
    FACULTY: ['Fee Status'],
    HOD: ['Fee Status'],
    STUDENT: []
  };

  // Base Navigation Items
  const allNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: FiLayout },
    ...(isAdmin ? [{ label: 'Delete User', path: '/admin/manage-users', icon: FiUserX, adminOnly: true }] : []),
    { label: 'Profile', path: '/profile', icon: FiUser },
    { label: 'Attendance', path: '/attendance', icon: FiCheckSquare },
    { label: 'Timetable', path: '/timetable', icon: FiCalendar },
    { label: 'Assignments', path: '/assignments', icon: FiFileText },
    { label: 'Subjects', path: '/subjects', icon: FiBookOpen },
    { label: 'Fee Status', path: '/fees', icon: FiDollarSign },
    { label: 'Library', path: '/library', icon: FiBook },
    { label: 'Leave Request', path: '/leave-request', icon: FiSend },
    { label: 'Notices', path: '/notices', icon: FiBell }
  ];

  const currentRole = (user?.role || 'STUDENT').toUpperCase();
  const excludedItems = ROLE_EXCLUSIONS[currentRole] || [];

  const navItems = allNavItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (excludedItems.includes(item.label)) return false;
    return true;
  });

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <aside 
      className="d-flex flex-column vh-100 flex-shrink-0 text-light border-end border-secondary border-opacity-25"
      style={{ 
        width: collapsed ? '72px' : '250px', 
        backgroundColor: '#0b192c',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1020
      }}
    >
      {/* Sidebar Header: College Symbol as Toggle Button (No Text) */}
      <div 
        className="d-flex align-items-center justify-content-center border-bottom border-secondary border-opacity-25 px-2"
        style={{ height: '64px', minHeight: '64px' }}
      >
        <button
          type="button"
          onClick={toggleCollapse}
          className="btn btn-link text-primary d-flex align-items-center justify-content-center p-2 rounded-3 border-0 shadow-none hover-bg-dark transition-all"
          title={collapsed ? "Expand Menu" : "Collapse Menu"}
          style={{ 
            backgroundColor: 'rgba(0, 82, 204, 0.12)', 
            cursor: 'pointer' 
          }}
        >
          <svg
            width="28"
            height="28"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
          </svg>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-grow-1 py-3 px-2 overflow-y-auto overflow-x-hidden">
        <ul className="nav nav-pills flex-column gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="nav-item">
                <NavLink
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center ${
                      collapsed ? 'justify-content-center px-0 py-2.5' : 'px-3 py-2'
                    } rounded text-decoration-none transition-all ${
                      isActive
                        ? 'active bg-primary text-white shadow-sm'
                        : 'text-light text-opacity-75 hover-bg-dark hover-text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? '#0052cc' : 'transparent',
                    whiteSpace: 'nowrap'
                  })}
                >
                  <Icon className={`${collapsed ? '' : 'me-3'} flex-shrink-0`} size={19} />
                  {!collapsed && (
                    <span className="small font-weight-medium text-truncate">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Action at Bottom */}
      <div className="p-2 border-top border-secondary border-opacity-25">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`btn btn-outline-danger w-100 d-flex align-items-center ${
            collapsed ? 'justify-content-center p-2' : 'justify-content-start px-3 py-2'
          } border-0 text-light text-opacity-75 rounded hover-danger`}
        >
          <FiLogOut className={`${collapsed ? '' : 'me-3'} flex-shrink-0 text-danger`} size={18} />
          {!collapsed && <span className="small">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;