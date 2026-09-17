import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiTrash2, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiRefreshCw, 
  FiUserX, 
  FiShield, 
  FiUserCheck,
  FiMail,
  FiPhone,
  FiX
} from 'react-icons/fi';

const UserManagementView = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusMessage, setStatusMessage] = useState(null);
  
  // Modal state for user deletion
  const [targetUser, setTargetUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const userList = await authService.getAllUsers();
      setUsers(userList || []);
    } catch (err) {
      console.error('Failed to load user directory:', err);
      setStatusMessage({ type: 'danger', text: 'Failed to load users from the server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!targetUser) return;
    setIsDeleting(true);
    try {
      const result = await authService.deleteUser(targetUser.userId);
      if (result?.success) {
        setStatusMessage({
          type: 'success',
          text: result.message || `User "${targetUser.fullName || targetUser.username}" was successfully deleted.`
        });
        // Remove user from local state
        setUsers((prev) => prev.filter((u) => u.userId !== targetUser.userId));
      } else {
        setStatusMessage({
          type: 'danger',
          text: result?.message || 'Failed to delete user.'
        });
      }
    } catch (err) {
      console.error('Error during deletion:', err);
      setStatusMessage({
        type: 'danger',
        text: err.message || 'An error occurred while attempting to delete the user.'
      });
    } finally {
      setIsDeleting(false);
      setTargetUser(null);
      // Auto-clear message after 5 seconds
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) ||
      (u.departmentName && u.departmentName.toLowerCase().includes(q)) ||
      (String(u.userId).includes(q));

    const matchesRole = 
      roleFilter === 'ALL' || 
      (u.role && u.role.toUpperCase() === roleFilter.toUpperCase()) ||
      (roleFilter === 'ADMIN' && (u.role === 'ADMIN' || u.role === 'SYSTEM_ADMIN'));

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role) => {
    const r = (role || '').toUpperCase();
    switch (r) {
      case 'ADMIN':
      case 'SYSTEM_ADMIN':
        return 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25';
      case 'PRINCIPAL':
      case 'VICE_PRINCIPAL':
        return 'bg-dark bg-opacity-10 text-dark border-dark border-opacity-25';
      case 'HOD':
        return 'bg-primary bg-opacity-10 text-primary border-primary border-opacity-25';
      case 'FACULTY':
        return 'bg-info bg-opacity-10 text-info border-info border-opacity-25';
      case 'ACCOUNTS':
        return 'bg-success bg-opacity-10 text-success border-success border-opacity-25';
      case 'LIBRARY':
        return 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-25';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25';
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Container */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* User Management Main Content */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* Header Banner */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <FiUserX className="text-danger" />
                <span>Delete & Manage Users</span>
              </h4>
              <p className="text-muted small mb-0">
                System Admin control panel: Search, inspect, and safely remove registered accounts from Oracle Database.
              </p>
            </div>
            
            <button
              onClick={loadUsers}
              disabled={loading}
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 shadow-none"
            >
              <FiRefreshCw className={loading ? 'spin' : ''} size={15} />
              <span>Refresh Directory</span>
            </button>
          </div>

          {/* Status Alert Message */}
          {statusMessage && (
            <div className={`alert alert-${statusMessage.type} alert-dismissible fade show d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm mb-4`} role="alert">
              <div className="d-flex align-items-center gap-2">
                {statusMessage.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertTriangle size={18} />}
                <span>{statusMessage.text}</span>
              </div>
              <button 
                type="button" 
                className="btn-close shadow-none" 
                onClick={() => setStatusMessage(null)}
              ></button>
            </div>
          )}

          {/* System Metrics Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                <span className="text-muted small fw-semibold text-uppercase">Total Users</span>
                <h3 className="fw-bold text-dark mb-0 mt-1">{users.length}</h3>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                <span className="text-muted small fw-semibold text-uppercase">Students</span>
                <h3 className="fw-bold text-primary mb-0 mt-1">
                  {users.filter(u => (u.role || '').toUpperCase() === 'STUDENT').length}
                </h3>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                <span className="text-muted small fw-semibold text-uppercase">Faculty / HOD</span>
                <h3 className="fw-bold text-info mb-0 mt-1">
                  {users.filter(u => ['FACULTY', 'HOD'].includes((u.role || '').toUpperCase())).length}
                </h3>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                <span className="text-muted small fw-semibold text-uppercase">Staff & Admins</span>
                <h3 className="fw-bold text-danger mb-0 mt-1">
                  {users.filter(u => ['ADMIN', 'SYSTEM_ADMIN', 'PRINCIPAL', 'ACCOUNTS', 'LIBRARY'].includes((u.role || '').toUpperCase())).length}
                </h3>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
            <div className="row g-3 align-items-center">
              {/* Search input */}
              <div className="col-md-7 col-lg-8">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <FiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 text-sm shadow-none"
                    placeholder="Search by name, username, email, ID, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="btn btn-light border-start-0 text-muted"
                      onClick={() => setSearchQuery('')}
                    >
                      <FiX size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Role filter dropdown */}
              <div className="col-md-5 col-lg-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <FiFilter />
                  </span>
                  <select
                    className="form-select bg-light border-start-0 text-sm shadow-none"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="ALL">All Roles ({users.length})</option>
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="HOD">Head of Department (HOD)</option>
                    <option value="PRINCIPAL">Principal / Management</option>
                    <option value="ACCOUNTS">Accounts & Finance</option>
                    <option value="LIBRARY">Library Staff</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* User Directory Table Card */}
          <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
            <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <FiUsers className="text-primary" />
                <span>User Accounts Directory ({filteredUsers.length})</span>
              </h6>
              {searchQuery && (
                <span className="badge bg-light text-secondary border">
                  Filtering for "{searchQuery}"
                </span>
              )}
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  <tr>
                    <th className="px-3 py-3">User Profile</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3">Department</th>
                    <th className="px-3 py-3">Contact</th>
                    <th className="px-3 py-3">User ID</th>
                    <th className="px-3 py-3 text-end">Action</th>
                  </tr>
                </thead>
                <tbody className="border-top-0 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                        <span>Loading user directory...</span>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <FiUserX size={36} className="text-muted mb-2 opacity-50" />
                        <p className="mb-0 fw-semibold">No users found</p>
                        <p className="text-xs text-muted">Try adjusting your search query or role filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((item) => {
                      const isSelf = currentUser && (
                        currentUser.userId === item.userId || 
                        currentUser.username === item.username
                      );

                      return (
                        <tr key={item.userId}>
                          {/* Profile */}
                          <td className="px-3 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div 
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                style={{ width: '38px', height: '38px', fontSize: '14px' }}
                              >
                                {(item.fullName || item.username || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-semibold text-dark leading-tight">
                                  {item.fullName || item.username}
                                  {isSelf && (
                                    <span className="badge bg-primary-subtle text-primary border ms-2" style={{ fontSize: '10px' }}>
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-muted text-xs">
                                  @{item.username}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-3 py-3">
                            <span className={`badge border px-2.5 py-1 text-uppercase fw-semibold ${getRoleBadgeClass(item.role)}`} style={{ fontSize: '11px' }}>
                              {item.role || 'STUDENT'}
                            </span>
                          </td>

                          {/* Department */}
                          <td className="px-3 py-3 text-muted small">
                            {item.departmentName || 'General / Not Assigned'}
                          </td>

                          {/* Contact */}
                          <td className="px-3 py-3">
                            <div className="text-xs text-muted d-flex flex-column gap-1">
                              <span className="d-flex align-items-center gap-1.5">
                                <FiMail size={12} className="text-secondary" />
                                {item.email || 'No email registered'}
                              </span>
                              {item.phoneNumber && (
                                <span className="d-flex align-items-center gap-1.5">
                                  <FiPhone size={12} className="text-secondary" />
                                  {item.phoneNumber}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* User ID */}
                          <td className="px-3 py-3 text-muted text-xs fw-mono">
                            #{item.userId}
                          </td>

                          {/* Action Button */}
                          <td className="px-3 py-3 text-end">
                            {isSelf ? (
                              <button
                                className="btn btn-light btn-sm text-muted text-xs px-2.5 py-1.5 border"
                                disabled
                                title="Active Admin account cannot self-delete"
                              >
                                Protected
                              </button>
                            ) : (
                              <button
                                onClick={() => setTargetUser(item)}
                                className="btn btn-outline-danger btn-sm text-xs px-2.5 py-1.5 d-inline-flex align-items-center gap-1.5 shadow-none hover-shadow"
                                title={`Delete ${item.fullName || item.username}`}
                              >
                                <FiTrash2 size={13} />
                                <span>Delete</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Delete User Confirmation Modal */}
      {targetUser && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(3px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Modal Header */}
              <div className="modal-header bg-danger text-white border-0 py-3 px-4">
                <h6 className="modal-title fw-bold d-flex align-items-center gap-2 mb-0">
                  <FiAlertTriangle size={20} />
                  <span>Confirm User Deletion</span>
                </h6>
                <button
                  type="button"
                  className="btn-close btn-close-white shadow-none"
                  disabled={isDeleting}
                  onClick={() => setTargetUser(null)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 text-dark">
                <p className="mb-3 text-sm">
                  Are you sure you want to permanently delete this user account?
                </p>

                {/* Target User Details Card */}
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div 
                      className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: '42px', height: '42px' }}
                    >
                      {(targetUser.fullName || targetUser.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{targetUser.fullName || targetUser.username}</h6>
                      <span className="text-muted text-xs">@{targetUser.username} &bull; ID #{targetUser.userId}</span>
                    </div>
                  </div>
                  <div className="small text-muted border-top pt-2 mt-2 d-flex justify-content-between">
                    <span>Role: <strong className="text-dark">{targetUser.role || 'STUDENT'}</strong></span>
                    <span>Dept: <strong className="text-dark">{targetUser.departmentName || 'General'}</strong></span>
                  </div>
                </div>

                {/* Warning note */}
                <div className="alert alert-warning text-xs mb-0 d-flex align-items-start gap-2 border-warning border-opacity-25">
                  <FiAlertTriangle className="flex-shrink-0 mt-0.5 text-warning" size={15} />
                  <div>
                    <strong>Warning:</strong> Deleting this account will permanently remove their credentials and cascade-remove associated academic data (attendance, fees, library borrows, assignments).
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-light border-0 py-3 px-4 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light btn-sm px-3 shadow-none fw-semibold"
                  disabled={isDeleting}
                  onClick={() => setTargetUser(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm px-4 d-flex align-items-center gap-2 shadow-none fw-semibold"
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                >
                  {isDeleting ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 size={15} />
                      <span>Permanently Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagementView;
