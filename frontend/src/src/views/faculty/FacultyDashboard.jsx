import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { 
  FiBookOpen, 
  FiUsers, 
  FiCheckSquare, 
  FiClock, 
  FiBell, 
  FiUploadCloud, 
  FiTrendingUp,
  FiPlusCircle
} from 'react-icons/fi';

const FacultyDashboard = () => {
  const { user } = useAuth();
  // Stat Card Overview Data
  const stats = [
    { title: 'CLASSES ASSIGNED', value: '4', color: 'primary', icon: FiBookOpen },
    { title: 'TOTAL STUDENTS', value: '120', color: 'info', icon: FiUsers },
    { title: 'ATTENDANCE TODAY', value: '92%', color: 'success', icon: FiCheckSquare },
    { title: 'PENDING TASKS', value: '3', color: 'warning', icon: FiClock }
  ];

  // Today's Teaching Schedule
  const todaysClasses = [
    { time: '09:00 AM', subject: 'Data Structures', classCode: 'Sem VI - CSE A' },
    { time: '11:00 AM', subject: 'Database Management', classCode: 'Sem IV - CSE B' },
    { time: '02:00 PM', subject: 'Web Development', classCode: 'Sem VI - CSE A' }
  ];

  // Recent Notices
  const recentNotices = [
    { text: 'Class test on DBMS on 10th May', time: '1 day ago' },
    { text: 'Submit assignments on time', time: '3 days ago' }
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
            <h4 className="fw-bold text-dark mb-1">Faculty Dashboard</h4>
            <p className="text-muted small mb-0">
              Welcome back, <span className="text-primary fw-semibold">{user?.fullName || user?.username || 'Faculty Member'}</span>!
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

          {/* Middle Row: My Classes Today & Quick Actions / Recent Notices */}
          <div className="row g-4">
            
            {/* Left Column: My Classes Today */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <FiClock className="text-primary" />
                    <span>My Classes Today</span>
                  </h6>
                  <Link 
                    to="/timetable" 
                    className="btn btn-primary btn-sm px-3 text-xs fw-semibold" 
                    style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                  >
                    View Timetable
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {todaysClasses.map((item, index) => (
                      <div key={index} className="list-group-item p-3 d-flex align-items-center justify-content-between border-bottom border-light">
                        <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-2.5 py-1.5 text-xs">
                          {item.time}
                        </span>
                        <span className="fw-semibold text-dark small flex-grow-1 ms-3">
                          {item.subject}
                        </span>
                        <span className="text-muted small fw-medium">
                          {item.classCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions & Recent Notices */}
            <div className="col-lg-6 d-flex flex-column gap-4">
              
              {/* Quick Actions Panel */}
              <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
                <h6 className="fw-bold text-dark mb-3">Quick Actions</h6>
                <div className="row row-cols-2 g-2">
                  <div className="col">
                    <Link 
                      to="/attendance" 
                      className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                    >
                      <FiCheckSquare className="text-primary" size={16} />
                      <span>Take Attendance</span>
                    </Link>
                  </div>
                  <div className="col">
                    <Link 
                      to="/assignments" 
                      className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                    >
                      <FiUploadCloud className="text-danger" size={16} />
                      <span>Upload Notes</span>
                    </Link>
                  </div>
                  <div className="col">
                    <Link 
                      to="/assignments" 
                      className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                    >
                      <FiPlusCircle className="text-primary" size={16} />
                      <span>Create Assignment</span>
                    </Link>
                  </div>
                  <div className="col">
                    <Link 
                      to="/students" 
                      className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                    >
                      <FiTrendingUp className="text-warning" size={16} />
                      <span>Student Performance</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Notices Panel */}
              <div className="card border-0 shadow-sm rounded-3 bg-white flex-grow-1">
                <div className="card-header bg-white border-bottom border-light p-3">
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <FiBell className="text-warning" />
                    <span>Recent Notices</span>
                  </h6>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {recentNotices.map((notice, idx) => (
                      <div key={idx} className="list-group-item p-3 d-flex align-items-center justify-content-between border-bottom border-light">
                        <div className="d-flex align-items-center gap-2">
                          <span className="p-1 rounded-circle bg-primary"></span>
                          <span className="small text-dark fw-medium">{notice.text}</span>
                        </div>
                        <span className="text-muted text-xs ms-2 flex-shrink-0">{notice.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;