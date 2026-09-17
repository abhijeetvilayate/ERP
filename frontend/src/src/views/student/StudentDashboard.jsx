
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { 
  FiCheckSquare, 
  FiBookOpen, 
  FiFileText, 
  FiDollarSign, 
  FiClock, 
  FiBell, 
  FiBook, 
  FiSend 
} from 'react-icons/fi';

const StudentDashboard = () => {
  const { user } = useAuth();
  // Stat Card Overview Data
  const stats = [
    { title: 'ATTENDANCE', value: '85%', color: 'success', icon: FiCheckSquare },
    { title: 'SUBJECTS', value: '5', color: 'primary', icon: FiBookOpen },
    { title: 'ASSIGNMENTS PENDING', value: '3', color: 'warning', icon: FiFileText },
    { title: 'FEE DUE', value: '₹ 12,500', color: 'danger', icon: FiDollarSign }
  ];

  // Upcoming Classes Schedule
  const upcomingClasses = [
    { time: '09:00 AM', subject: 'Data Structures', room: 'Room 201' },
    { time: '11:00 AM', subject: 'Database Management', room: 'Room 203' },
    { time: '01:00 PM', subject: 'Web Development', room: 'Lab 3' },
    { time: '03:00 PM', subject: 'Operating Systems', room: 'Room 204' }
  ];

  // Recent Notifications (Dynamic from localStorage & system events)
  const getDynamicNotifications = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('erp_user_notifications') || '[]');
      const userNotifs = stored.filter(
        (n) =>
          !n.recipientRole ||
          n.recipientRole === 'STUDENT' ||
          n.recipientName === user?.fullName ||
          n.recipientName === user?.username ||
          n.recipientId === user?.userId
      );
      if (userNotifs.length > 0) {
        return userNotifs.slice(0, 4).map((n) => ({
          text: `${n.title}: ${n.message}`,
          time: n.createdAt || 'Recent',
          type: n.type
        }));
      }
    } catch (e) {
      console.warn('Failed to parse notifications:', e);
    }
    return [
      { text: 'Assignment on DBMS is due tomorrow', time: '2 hours ago' },
      { text: 'Internal test for Data Structures on Friday', time: '5 hours ago' },
      { text: 'College will remain closed on 15th Aug', time: '1 day ago' }
    ];
  };

  const notifications = getDynamicNotifications();

  // Quick Access Shortcuts
  const quickAccess = [
    { label: 'Attendance', path: '/attendance', icon: FiCheckSquare, color: 'text-success' },
    { label: 'Assignments', path: '/assignments', icon: FiFileText, color: 'text-warning' },
    { label: 'Fee Status', path: '/fees', icon: FiDollarSign, color: 'text-danger' },
    { label: 'Library', path: '/library', icon: FiBook, color: 'text-info' },
    { label: 'Leave Request', path: '/leave-request', icon: FiSend, color: 'text-primary' },
    { label: 'Notices', path: '/notices', icon: FiBell, color: 'text-secondary' }
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
            <h4 className="fw-bold text-dark mb-1">Student Dashboard</h4>
            <p className="text-muted small mb-0">
              Welcome back, <span className="text-primary fw-semibold">{user?.fullName || user?.username || 'Student'}</span>!
            </p>
          </div>

          {/* Top 4 Metric Cards */}
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

          {/* Middle Row: Upcoming Classes & Notifications */}
          <div className="row g-4 mb-4">
            
            {/* Upcoming Classes */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <FiClock className="text-primary" />
                    <span>Upcoming Classes</span>
                  </h6>
                  <Link to="/timetable" className="btn btn-primary btn-sm px-3 text-xs fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    View Timetable
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {upcomingClasses.map((item, index) => (
                      <div key={index} className="list-group-item p-3 d-flex align-items-center justify-content-between border-bottom border-light">
                        <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-2.5 py-1.5 text-xs">
                          {item.time}
                        </span>
                        <span className="fw-semibold text-dark small flex-grow-1 ms-3">
                          {item.subject}
                        </span>
                        <span className="text-muted small">
                          {item.room}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <FiBell className="text-warning" />
                    <span>Notifications</span>
                  </h6>
                  <Link to="/notifications" className="btn btn-primary btn-sm px-3 text-xs fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    View All
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {notifications.map((note, idx) => (
                      <div key={idx} className="list-group-item p-3 d-flex align-items-center justify-content-between border-bottom border-light">
                        <div className="d-flex align-items-center gap-2">
                          <span className="p-1 rounded-circle bg-primary"></span>
                          <span className="small text-dark fw-medium">{note.text}</span>
                        </div>
                        <span className="text-muted text-xs ms-2 flex-shrink-0">{note.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Quick Access */}
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <h6 className="fw-bold text-dark mb-3">Quick Access</h6>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-6 g-3 text-center">
              {quickAccess.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="col">
                    <Link 
                      to={item.path} 
                      className="card h-100 border-light bg-light p-3 text-decoration-none hover-shadow transition-all align-items-center justify-content-center"
                    >
                      <div className={`p-2 rounded-circle bg-white shadow-sm mb-2 ${item.color}`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-dark small fw-semibold">{item.label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;