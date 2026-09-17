
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { 
  FiDollarSign, 
  FiClock, 
  FiTrendingDown, 
  FiAward, 
  FiPieChart, 
  FiPlusCircle, 
  FiFileText, 
  FiUsers, 
  FiAlertCircle 
} from 'react-icons/fi';

const AccountsDashboard = () => {
  const { user } = useAuth();
  // Financial Overview Metrics Data
  const stats = [
    { title: 'TOTAL COLLECTIONS', value: '₹ 12,45,000', color: 'success', icon: FiDollarSign },
    { title: 'PENDING FEES', value: '₹ 3,25,000', color: 'warning', icon: FiClock },
    { title: 'EXPENSES', value: '₹ 8,75,000', color: 'danger', icon: FiTrendingDown },
    { title: 'SCHOLARSHIPS', value: '₹ 45,000', color: 'primary', icon: FiAward }
  ];

  // Recent Fee Transactions
  const recentTransactions = [
    { name: 'John Doe', amount: '₹ 15,000', status: 'Paid', statusClass: 'text-success bg-success-subtle' },
    { name: 'Jane Smith', amount: '₹ 20,000', status: 'Paid', statusClass: 'text-success bg-success-subtle' },
    { name: 'Robert Brown', amount: '₹ 12,500', status: 'Pending', statusClass: 'text-warning bg-warning-subtle' },
    { name: 'Emily Davis', amount: '₹ 18,000', status: 'Paid', statusClass: 'text-success bg-success-subtle' }
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
            <h4 className="fw-bold text-dark mb-1">Accounts & Finance Dashboard</h4>
            <p className="text-muted small mb-0">
              Welcome back, <span className="text-primary fw-semibold">{user?.fullName || user?.username || 'Accounts Officer'}</span>!
            </p>
          </div>

          {/* Top 4 Financial Metric Cards */}
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

          {/* Middle Row Layout: Fee Collection Donut, Recent Transactions, Quick Actions */}
          <div className="row g-4">
            
            {/* Fee Collection Donut Chart */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FiPieChart className="text-primary" />
                    <span>Fee Collection Overview</span>
                  </h6>

                  {/* Donut Chart Graphic */}
                  <div className="d-flex justify-content-center my-4">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center position-relative shadow-sm"
                      style={{
                        width: '150px',
                        height: '150px',
                        background: 'conic-gradient(#198754 0% 70%, #ffc107 70% 90%, #dc3545 90% 100%)'
                      }}
                    >
                      <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: '90px', height: '90px' }}>
                        <span className="fw-bold text-dark small">85% Paid</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="d-flex justify-content-center gap-3 text-xs">
                    <div className="d-flex align-items-center gap-1">
                      <span className="p-1 rounded-circle bg-success"></span>
                      <span className="text-muted">Paid</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="p-1 rounded-circle bg-warning"></span>
                      <span className="text-muted">Pending</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="p-1 rounded-circle bg-danger"></span>
                      <span className="text-muted">Partial</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="btn btn-primary btn-sm w-100 fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Transactions List */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FiDollarSign className="text-success" />
                    <span>Recent Transactions</span>
                  </h6>

                  <div className="d-flex flex-column gap-3 my-2">
                    {recentTransactions.map((tx, idx) => (
                      <div key={idx} className="d-flex align-items-center justify-content-between border-bottom border-light pb-2">
                        <div>
                          <span className="small fw-semibold text-dark d-block">{tx.name}</span>
                          <span className="text-muted text-xs">{tx.amount}</span>
                        </div>
                        <span className={`badge border px-2 py-1 text-xs ${tx.statusClass}`}>
                          {tx.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <Link to="/fees" className="btn btn-primary btn-sm w-100 fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    View All
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3">Quick Actions</h6>
                  
                  <div className="d-flex flex-column gap-2">
                    <Link 
                      to="/fees" 
                      className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                    >
                      <FiPlusCircle className="text-primary" size={16} />
                      <span>Add Transaction</span>
                    </Link>

                    <Link 
                      to="/reports" 
                      className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                    >
                      <FiFileText className="text-success" size={16} />
                      <span>Generate Report</span>
                    </Link>

                    <Link 
                      to="/students" 
                      className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                    >
                      <FiUsers className="text-info" size={16} />
                      <span>View Students</span>
                    </Link>

                    <Link 
                      to="/fees" 
                      className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                    >
                      <FiAlertCircle className="text-warning" size={16} />
                      <span>View Dues</span>
                    </Link>
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

export default AccountsDashboard;