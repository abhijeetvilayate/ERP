import { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import IssueBookModal from '../../components/modals/IssueBookModal';
import { useAuth } from '../../context/AuthContext';
import { 
  FiBook, 
  FiBookOpen, 
  FiAlertCircle, 
  FiUsers, 
  FiPlusCircle, 
  FiCornerDownLeft, 
  FiSearch, 
  FiList 
} from 'react-icons/fi';

const LibraryDashboard = () => {
  const { user } = useAuth();
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Stat Card Overview Data
  const stats = [
    { title: 'TOTAL BOOKS', value: '12,450', color: 'primary', icon: FiBook },
    { title: 'ISSUED', value: '230', color: 'info', icon: FiBookOpen },
    { title: 'OVERDUE', value: '18', color: 'danger', icon: FiAlertCircle },
    { title: 'MEMBERS', value: '1,250', color: 'success', icon: FiUsers }
  ];

  // Recent Issued Books Transaction Log
  const recentIssued = [
    { title: 'Database System Concepts', author: 'Abraham Silberschatz', issueDate: '16 May 2026', dueDate: '30 May 2026', borrower: 'John Doe (Student)' },
    { title: 'Computer Networks', author: 'Andrew Tanenbaum', issueDate: '16 May 2026', dueDate: '30 May 2026', borrower: 'Prof. Smith (Faculty)' },
    { title: 'Operating System Principles', author: 'A. Silberschatz', issueDate: '16 May 2026', dueDate: '30 May 2026', borrower: 'Jane Smith (Student)' }
  ];

  const handleIssueBookSubmit = async (formData) => {
    console.log('Book Issued Successfully:', formData);
    // Add logic here to sync with API backend
  };

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
            <h4 className="fw-bold text-dark mb-1">Library Management Dashboard</h4>
            <p className="text-muted small mb-0">
              Welcome back, <span className="text-primary fw-semibold">{user?.fullName || user?.username || 'Librarian'}</span>! Manage books, issues, returns, and inventory records.
            </p>
          </div>

          {/* Top 4 Inventory Metric Cards */}
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

          {/* Middle Row: Recent Issued Books & Quick Library Actions */}
          <div className="row g-4">
            
            {/* Recent Issued Books Table */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <FiBookOpen className="text-primary" />
                    <span>Recent Issued Books</span>
                  </h6>
                  <button className="btn btn-link text-primary p-0 text-xs fw-semibold text-decoration-none">
                    View All Transactions
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-3 py-2.5">Book Title</th>
                        <th className="px-3 py-2.5">Author</th>
                        <th className="px-3 py-2.5">Issue Date</th>
                        <th className="px-3 py-2.5">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {recentIssued.map((book, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2.5">
                            <span className="fw-semibold text-dark d-block">{book.title}</span>
                            <span className="text-muted text-xs">{book.borrower}</span>
                          </td>
                          <td className="px-3 py-2.5 text-muted small">{book.author}</td>
                          <td className="px-3 py-2.5 text-muted small">{book.issueDate}</td>
                          <td className="px-3 py-2.5 text-muted small">{book.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3">
                <h6 className="fw-bold text-dark mb-3">Quick Actions</h6>
                
                <div className="d-flex flex-column gap-2.5">
                  <button 
                    onClick={() => setIsIssueModalOpen(true)}
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 text-xs fw-semibold rounded-2"
                    style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                  >
                    <FiBookOpen size={16} />
                    <span>Issue Book</span>
                  </button>

                  <button 
                    className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                  >
                    <FiCornerDownLeft className="text-success" size={16} />
                    <span>Return Book</span>
                  </button>

                  <button 
                    className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                  >
                    <FiPlusCircle className="text-info" size={16} />
                    <span>Add New Book</span>
                  </button>

                  <button 
                    className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                  >
                    <FiSearch className="text-warning" size={16} />
                    <span>Search Book Catalog</span>
                  </button>

                  <button 
                    className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-2.5 p-2.5 border text-dark text-xs fw-semibold rounded-2"
                  >
                    <FiList className="text-secondary" size={16} />
                    <span>View Overdue List</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Issue Book Action Modal */}
      <IssueBookModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSubmit={handleIssueBookSubmit}
      />
    </div>
  );
};

export default LibraryDashboard;