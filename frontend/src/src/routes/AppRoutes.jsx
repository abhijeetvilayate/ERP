import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Views
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import Home from '../views/public/Home';
import About from '../views/public/About';
import Features from '../views/public/Features';
import Contact from '../views/public/Contact';

// Dashboard Views
import StudentDashboard from '../views/student/StudentDashboard';
import FacultyDashboard from '../views/faculty/FacultyDashboard';
import HodDashboard from '../views/hod/HodDashboard';
import PrincipalDashboard from '../views/principal/PrincipalDashboard';
import AccountsDashboard from '../views/accounts/AccountsDashboard';
import LibraryDashboard from '../views/library/LibraryDashboard';
import AdminDashboard from '../views/admin/AdminDashboard';
import UserManagementView from '../views/admin/UserManagementView';

// Common ERP Shared Views
import ProfileView from '../shared-modules/ProfileView';
import AttendanceView from '../shared-modules/AttendanceView';
import TimetableView from '../shared-modules/TimetableView';
import AssignmentsView from '../shared-modules/AssignmentsView';
import SubjectsView from '../shared-modules/SubjectsView';
import FeeStatusView from '../shared-modules/FeeStatusView';
import LibraryView from '../shared-modules/LibraryView';
import LeaveRequestsView from '../shared-modules/LeaveRequestsView';
import NoticesView from '../shared-modules/NoticesView';

/**
 * Protected Route Wrapper Component
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const userRole = (user.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    const isAuthorized = 
      normalizedAllowed.includes(userRole) ||
      (normalizedAllowed.includes('LIBRARY') && userRole === 'LIBRARIAN') ||
      (normalizedAllowed.includes('LIBRARIAN') && userRole === 'LIBRARY') ||
      (normalizedAllowed.includes('ADMIN') && userRole === 'SYSTEM_ADMIN') ||
      (normalizedAllowed.includes('PRINCIPAL') && userRole === 'VICE_PRINCIPAL');

    if (!isAuthorized) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

/**
 * Main Dynamic Router Component
 */
const AppRoutes = () => {
  const { user } = useAuth();

  // Helper function to resolve default dashboard path based on role
  const getDefaultDashboard = () => {
    if (!user) return '/login';
    const r = (user.role || '').toUpperCase();
    if (r === 'LIBRARY' || r === 'LIBRARIAN') return '/library/dashboard';
    if (r === 'ADMIN' || r === 'SYSTEM_ADMIN') return '/admin/dashboard';
    if (r === 'PRINCIPAL' || r === 'VICE_PRINCIPAL') return '/principal/dashboard';
    if (r === 'HOD') return '/hod/dashboard';
    if (r === 'FACULTY') return '/faculty/dashboard';
    if (r === 'ACCOUNTS') return '/accounts/dashboard';
    return '/student/dashboard';
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to={getDefaultDashboard()} replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to={getDefaultDashboard()} replace /> : <Register />} 
      />

      {/* Public Home Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />

      {/* ==================== ROLE DASHBOARDS ==================== */}
      <Route
        path="/dashboard"
        element={<Navigate to={getDefaultDashboard()} replace />}
      />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRoles={['FACULTY']}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/dashboard"
        element={
          <ProtectedRoute allowedRoles={['HOD']}>
            <HodDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/principal/dashboard"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL', 'VICE_PRINCIPAL']}>
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/accounts/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ACCOUNTS']}>
            <AccountsDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/library/dashboard"
        element={
          <ProtectedRoute allowedRoles={['LIBRARY', 'LIBRARIAN']}>
            <LibraryDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/librarian/dashboard"
        element={
          <ProtectedRoute allowedRoles={['LIBRARY', 'LIBRARIAN']}>
            <LibraryDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SYSTEM_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SYSTEM_ADMIN']}>
            <UserManagementView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/delete-user"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SYSTEM_ADMIN']}>
            <UserManagementView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SYSTEM_ADMIN']}>
            <UserManagementView />
          </ProtectedRoute>
        }
      />

      {/* ==================== COMMON ERP MODULE ROUTES ==================== */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <AttendanceView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/timetable"
        element={
          <ProtectedRoute>
            <TimetableView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assignments"
        element={
          <ProtectedRoute>
            <AssignmentsView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <SubjectsView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fee-status"
        element={
          <ProtectedRoute>
            <FeeStatusView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fees"
        element={
          <ProtectedRoute>
            <FeeStatusView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <LibraryView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave-requests"
        element={
          <ProtectedRoute>
            <LeaveRequestsView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave-request"
        element={
          <ProtectedRoute>
            <LeaveRequestsView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notices"
        element={
          <ProtectedRoute>
            <NoticesView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NoticesView />
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 Route */}
      <Route path="*" element={<Navigate to={getDefaultDashboard()} replace />} />
    </Routes>
  );
};

export default AppRoutes;