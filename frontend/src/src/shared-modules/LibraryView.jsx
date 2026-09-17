import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import { 
  FiBook, 
  FiBookOpen, 
  FiAlertCircle, 
  FiClock, 
  FiDollarSign, 
  FiUsers, 
  FiSearch 
} from 'react-icons/fi';

const LibraryView = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const [searchQuery, setSearchQuery] = useState('');

  // --- Personal Library Data (Student, Faculty, HOD, Principal, Accounts) ---
  const personalStats = [
    { title: 'ISSUED BOOKS', value: '2', color: 'primary', icon: FiBookOpen },
    { title: 'OVERDUE', value: '0', color: 'danger', icon: FiAlertCircle },
    { title: 'RESERVED', value: '1', color: 'info', icon: FiClock },
    { title: 'FINE', value: '₹ 20', color: 'warning', icon: FiDollarSign }
  ];

  const personalIssuedBooks = [
    { title: 'Database System Concepts', author: 'Abraham Silberschatz', issueDate: '10 May 2026', dueDate: '24 May 2026', status: 'Issued' },
    { title: 'Operating System Principles', author: 'Abraham Silberschatz', issueDate: '12 May 2026', dueDate: '26 May 2026', status: 'Issued' }
  ];

  // --- Library Staff & Admin Data ---
  const staffStats = [
    { title: 'TOTAL BOOKS', value: '12,450', color: 'primary', icon: FiBook },
    { title: 'ISSUED', value: '230', color: 'info', icon: FiBookOpen },
    { title: 'OVERDUE', value: '18', color: 'danger', icon: FiAlertCircle },
    { title: 'MEMBERS', value: '1,250', color: 'success', icon: FiUsers }
  ];

  const staffRecentIssued = [
    { title: 'Database System Concepts', author: 'Abraham Silberschatz', issueDate: '16 May 2026', dueDate: '30 May 2026' },
    { title: 'Computer Networks', author: 'Andrew Tanenbaum', issueDate: '16 May 2026', dueDate: '30 May 2026' },
    { title: 'Operating System Principles', author: 'A. Silberschatz', issueDate: '16 May 2026', dueDate: '30 May 2026' }
  ];

  const isStaffView = ['LIBRARY', 'LIBRARIAN', 'ADMIN', 'SYSTEM_ADMIN'].includes((role || '').toUpperCase());

  // Filter Issued Books by Search Query
  const filteredPersonalBooks = personalIssuedBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Library Main Container */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* Header & Search Bar */}
          <div className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bold text-dark mb-1">
                {isStaffView ? 'Library Management' : 'My Library'}
              </h4>
              <p className="text-muted small mb-0">
                {isStaffView 
                  ? 'Manage institutional book records, active issues, and member accounts.'
                  : 'Track your borrowed books, due dates, fines, and reservations.'}
              </p>
            </div>

            {/* Search Input Box */}
            <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-white border-end-0 text-muted">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                className="form-control bg-white border-start-0 shadow-none text-xs"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="row g-3 mb-4">
            {(isStaffView ? staffStats : personalStats).map((stat, idx) => (
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

          {/* Main Content Table Card */}
          <div className="card border-0 shadow-sm rounded-3 bg-white">
            <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold text-dark mb-0">
                {isStaffView ? 'Recent Issued Books' : 'Issued Books'}
              </h6>
              {isStaffView && (
                <button className="btn btn-link text-primary p-0 text-xs fw-semibold text-decoration-none">
                  {role === 'ADMIN' ? 'View All Activities' : 'View All Transactions'}
                </button>
              )}
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  <tr>
                    <th className="px-4 py-3">Book Title</th>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3">Issue Date</th>
                    <th className="px-4 py-3">Due Date</th>
                    {!isStaffView && <th className="px-4 py-3 text-end">Status</th>}
                  </tr>
                </thead>
                <tbody className="border-top-0 text-sm">
                  {isStaffView ? (
                    staffRecentIssued.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 fw-semibold text-dark">{item.title}</td>
                        <td className="px-4 py-3 text-muted">{item.author}</td>
                        <td className="px-4 py-3 text-muted">{item.issueDate}</td>
                        <td className="px-4 py-3 text-muted">{item.dueDate}</td>
                      </tr>
                    ))
                  ) : (
                    filteredPersonalBooks.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 fw-semibold text-dark">{item.title}</td>
                        <td className="px-4 py-3 text-muted">{item.author}</td>
                        <td className="px-4 py-3 text-muted">{item.issueDate}</td>
                        <td className="px-4 py-3 text-muted">{item.dueDate}</td>
                        <td className="px-4 py-3 text-end">
                          <span className={`badge px-2.5 py-1 text-xs fw-semibold ${
                            item.status === 'Issued'
                              ? 'bg-success-subtle text-success border border-success-subtle'
                              : 'bg-danger-subtle text-danger border border-danger-subtle'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom View Link for Personal View */}
            {!isStaffView && (
              <div className="card-footer bg-white border-0 text-center py-3">
                <button className="btn btn-link text-primary p-0 text-xs fw-semibold text-decoration-none">
                  View All Books
                </button>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default LibraryView;