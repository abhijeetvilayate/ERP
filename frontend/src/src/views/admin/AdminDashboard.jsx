import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUsers, 
  FiActivity, 
  FiCpu, 
  FiHardDrive, 
  FiUserPlus, 
  FiDatabase, 
  FiSliders, 
  FiShield, 
  FiBell, 
  FiServer,
  FiUserX
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  // Stat Card Overview Data
  const stats = [
    { title: 'TOTAL USERS', value: '1,250', color: 'primary', icon: FiUsers },
    { title: 'ACTIVE SESSIONS', value: '230', color: 'success', icon: FiActivity },
    { title: 'SYSTEM LOAD', value: '18%', color: 'info', icon: FiCpu },
    { title: 'STORAGE USED', value: '45 GB', color: 'warning', icon: FiHardDrive }
  ];

  // System Activity Log
  const systemLogs = [
    { user: 'System Admin', action: 'System Backup Completed', date: '24 May 2026', time: '10:00 AM' },
    { user: 'System Admin', action: 'New Faculty Role Granted', date: '12 May 2026', time: '02:30 PM' },
    { user: 'System Admin', action: 'Security Policy Updated', date: '00 May 2026', time: '09:15 AM' }
  ];

  // System Announcements
  const systemAnnouncements = [
    { title: 'System Maintenance on 25 May (10 PM - 2 AM)', time: '10 mins ago' },
    { title: 'Database Backup Schedule Updated', time: '2 hours ago' },
    { title: 'New User Access Guidelines Published', time: '1 day ago' },
    { title: 'Low Disk Space Warning - Storage Tier 2', time: '2 days ago' }
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Dashboard Main Container */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* Welcome Header */}
          <div className="mb-4">
            <h4 className="fw-bold text-dark mb-1">System Administration Dashboard</h4>
            <p className="text-muted small mb-0">
              Welcome back, <span className="text-primary fw-semibold">{user?.fullName || user?.username || 'System Administrator'}</span>! Manage users, roles, system health, and configurations.
            </p>
          </div>

          {/* Top 4 System Metric Cards */}
          <div className="row g-3 mb-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                />
              </div>
            ))}
          </div>

          {/* Middle Row Layout: System Overview Log, System Announcements, Quick Actions */}
          <div className="row g-4">
            
            {/* System Overview Log Table */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <FiServer className="text-primary" />
                    <span>System Activity Log</span>
                  </h6>
                  <button className="btn btn-link text-primary p-0 text-xs fw-semibold text-decoration-none">
                    View Full Logs
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-3 py-2.5">User</th>
                        <th className="px-3 py-2.5">Action</th>
                        <th className="px-3 py-2.5">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {systemLogs.map((log, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2.5 fw-semibold text-dark">{log.user}</td>
                          <td className="px-3 py-2.5 text-muted small">{log.action}</td>
                          <td className="px-3 py-2.5 text-muted text-xs">
                            {log.date} <br />
                            <span className="text-muted">{log.time}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* System Announcements */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FiBell className="text-warning" />
                    <span>System Announcements</span>
                  </h6>

                  <div className="d-flex flex-column gap-2.5 my-2">
                    {systemAnnouncements.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-light rounded-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                          <span className="p-1 rounded-circle bg-primary flex-shrink-0"></span>
                          <span className="small text-dark fw-medium text-truncate">{item.title}</span>
                        </div>
                        <span className="text-muted text-xs flex-shrink-0">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <Link to="/notices" className="btn btn-primary btn-sm w-100 fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    View All Notices
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3">
                <h6 className="fw-bold text-dark mb-3">Quick Actions</h6>
                
                <div className="d-flex flex-column gap-2.5">
                  <Link 
                    to="/admin/manage-users"
                    className="btn btn-danger w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 text-xs fw-semibold rounded-2 text-decoration-none shadow-sm"
                    style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                  >
                    <FiUserX size={16} />
                    <span>Delete & Manage Users</span>
                  </Link>

                  <button 
                    className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                  >
                    <FiDatabase className="text-success" size={16} />
                    <span>Backup Database</span>
                  </button>

                  <button 
                    className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                  >
                    <FiSliders className="text-info" size={16} />
                    <span>System Configuration</span>
                  </button>

                  <button 
                    className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                  >
                    <FiShield className="text-danger" size={16} />
                    <span>Security & Roles</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;