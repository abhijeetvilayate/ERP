import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUsers, 
  FiUserCheck, 
  FiGrid, 
  FiCheckSquare, 
  FiBarChart2, 
  FiActivity, 
  FiBell 
} from 'react-icons/fi';

const PrincipalDashboard = () => {
  const { user } = useAuth();
  // Stat Card Overview Data
  const stats = [
    { title: 'TOTAL STUDENTS', value: '1250', color: 'primary', icon: FiUsers },
    { title: 'TOTAL FACULTY', value: '85', color: 'info', icon: FiUserCheck },
    { title: 'DEPARTMENTS', value: '12', color: 'warning', icon: FiGrid },
    { title: 'OVERALL ATTENDANCE', value: '96%', color: 'success', icon: FiCheckSquare }
  ];

  // College Overview Bar Chart Data Mock
  const chartData = [
    { month: 'Jan', height: '40%' },
    { month: 'Feb', height: '65%' },
    { month: 'Mar', height: '80%' },
    { month: 'Apr', height: '55%' },
    { month: 'May', height: '90%' },
    { month: 'Jun', height: '70%' }
  ];

  // Recent Campus Activities
  const recentActivities = [
    { title: 'New Faculty Added', count: '2' },
    { title: 'Student Admissions', count: '15' },
    { title: 'Fee Collections', count: '₹ 8,45,000' },
    { title: 'Events Conducted', count: '4' }
  ];

  // Important Institution Notices
  const importantNotices = [
    { title: 'Annual Day on 20th May', time: '2 days ago' },
    { title: 'Fee submission last date 10th May', time: '3 days ago' }
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
            <h4 className="fw-bold text-dark mb-1">Principal Dashboard</h4>
            <p className="text-muted small mb-0">
              Welcome back, <span className="text-primary fw-semibold">{user?.fullName || user?.username || 'Principal'}</span>!
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

          {/* Middle Row Layout: College Overview, Recent Activities, Important Notices */}
          <div className="row g-4">
            
            {/* College Overview Bar Chart */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FiBarChart2 className="text-primary" />
                    <span>College Overview</span>
                  </h6>

                  {/* Simulated Bar Chart Graphic */}
                  <div className="d-flex align-items-end justify-content-between px-3 pt-4 pb-2 my-3 bg-light rounded-3" style={{ height: '180px' }}>
                    {chartData.map((bar, index) => (
                      <div key={index} className="d-flex flex-column align-items-center flex-fill h-100 justify-content-end">
                        <div 
                          className="bg-primary rounded-top w-50 transition-all" 
                          style={{ height: bar.height, backgroundColor: '#0052cc' }}
                        ></div>
                        <span className="text-muted text-xs mt-2 fw-semibold">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <button className="btn btn-primary btn-sm w-100 fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    View All
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FiActivity className="text-info" />
                    <span>Recent Activities</span>
                  </h6>

                  <div className="d-flex flex-column gap-3 my-2">
                    {recentActivities.map((item, idx) => (
                      <div key={idx} className="d-flex align-items-center justify-content-between border-bottom border-light pb-2">
                        <span className="small text-muted fw-medium">{item.title}</span>
                        <span className="small fw-bold text-dark">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <Link to="/reports" className="btn btn-primary btn-sm w-100 fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    View All
                  </Link>
                </div>
              </div>
            </div>

            {/* Important Notices */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FiBell className="text-warning" />
                    <span>Important Notices</span>
                  </h6>

                  <div className="d-flex flex-column gap-3 my-2">
                    {importantNotices.map((item, idx) => (
                      <div key={idx} className="p-3 bg-light rounded-3 d-flex flex-column gap-1">
                        <span className="small fw-semibold text-dark">{item.title}</span>
                        <span className="text-muted text-xs">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <Link to="/notices" className="btn btn-primary btn-sm w-100 fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    View All
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default PrincipalDashboard;