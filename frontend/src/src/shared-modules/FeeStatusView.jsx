import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import { 
  FiDollarSign, 
  FiCheckCircle, 
  FiClock, 
  FiCalendar, 
  FiPieChart, 
  FiCheckSquare, 
  FiBookOpen, 
  FiAlertCircle, 
  FiCreditCard,
  FiFileText
} from 'react-icons/fi';

const FeeStatusView = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  // --- Student Fee Metrics & Itemized Table ---
  const studentStats = [
    { title: 'TOTAL FEE', value: '₹ 85,000', color: 'primary', icon: FiDollarSign },
    { title: 'PAID FEE', value: '₹ 42,500', color: 'success', icon: FiCheckCircle },
    { title: 'PENDING FEE', value: '₹ 42,500', color: 'danger', icon: FiClock },
    { title: 'DUE DATE', value: '31 May 2026', color: 'warning', icon: FiCalendar }
  ];

  const studentFeeDetails = [
    { type: 'Tuition Fee', amount: '50,000', paid: '25,000', pending: '25,000', status: 'Partial', dueDate: '31 May 2026' },
    { type: 'Development Fee', amount: '15,000', paid: '7,500', pending: '7,500', status: 'Partial', dueDate: '31 May 2026' },
    { type: 'Exam Fee', amount: '10,000', paid: '10,000', pending: '0', status: 'Paid', dueDate: '31 May 2026' },
    { type: 'Library Fee', amount: '5,000', paid: '0', pending: '5,000', status: 'Pending', dueDate: '31 May 2026' },
    { type: 'Other Charges', amount: '5,000', paid: '0', pending: '5,000', status: 'Pending', dueDate: '31 May 2026' }
  ];

  // --- HOD Department Fee Metrics ---
  const hodStats = [
    { title: 'TOTAL EXPECTED', value: '₹ 12,75,000', color: 'primary', icon: FiDollarSign },
    { title: 'TOTAL COLLECTED', value: '₹ 8,25,000', color: 'success', icon: FiCheckCircle },
    { title: 'PENDING AMOUNT', value: '₹ 4,50,000', color: 'danger', icon: FiClock },
    { title: 'COLLECTION %', value: '64.71%', color: 'info', icon: FiPieChart }
  ];

  // --- Principal Institute Fee Metrics ---
  const principalStats = [
    { title: 'TOTAL EXPECTED', value: '₹ 2,45,000,00', color: 'primary', icon: FiDollarSign },
    { title: 'TOTAL COLLECTED', value: '₹ 1,68,20,000', color: 'success', icon: FiCheckCircle },
    { title: 'PENDING AMOUNT', value: '₹ 76,80,000', color: 'danger', icon: FiClock },
    { title: 'COLLECTION %', value: '68.65%', color: 'info', icon: FiPieChart }
  ];

  // --- Accounts Department Overview Table ---
  const accountsFeeOverview = [
    { course: 'B.E. Computer', students: 320, expected: '64,00,000', collected: '44,20,000', pending: '19,80,000', percentage: '69.06%' },
    { course: 'B.E. Mechanical', students: 280, expected: '56,00,000', collected: '36,80,000', pending: '19,20,000', percentage: '65.71%' },
    { course: 'B.E. Civil', students: 220, expected: '44,00,000', collected: '28,10,000', pending: '15,90,000', percentage: '63.86%' },
    { course: 'B.E. E&TC', students: 210, expected: '42,00,000', collected: '27,30,000', pending: '14,70,000', percentage: '65.00%' },
    { course: 'B.E. I.T.', students: 160, expected: '32,00,000', collected: '21,80,000', pending: '10,20,000', percentage: '68.13%' }
  ];

  // --- Library Fines & Status Overview ---
  const libraryStats = [
    { title: 'TOTAL ISSUED BOOKS', value: '850', color: 'primary', icon: FiBookOpen },
    { title: 'OVERDUE BOOKS', value: '120', color: 'warning', icon: FiAlertCircle },
    { title: 'TOTAL FINE COLLECTED', value: '₹ 18,750', color: 'success', icon: FiDollarSign },
    { title: 'PENDING FINE', value: '₹ 7,350', color: 'danger', icon: FiClock }
  ];

  const recentOverdueFines = [
    { studentName: 'Rahul Sharma', bookTitle: 'DBMS Concepts', dueDate: '10 May 2026', fine: '150', status: 'Pending' },
    { studentName: 'Anjali Patil', bookTitle: 'Operating Systems', dueDate: '08 May 2026', fine: '200', status: 'Pending' },
    { studentName: 'Vivek Singh', bookTitle: 'Computer Networks', dueDate: '09 May 2026', fine: '100', status: 'Pending' }
  ];

  // --- System Admin Fee System Overview ---
  const adminFeeStats = [
    { title: 'TOTAL FEE HEADS', value: '6', color: 'primary', icon: FiDollarSign },
    { title: 'TOTAL COURSES', value: '12', color: 'info', icon: FiBookOpen },
    { title: 'TOTAL STUDENTS', value: '1250', color: 'warning', icon: FiCheckSquare },
    { title: 'COLLECTED (ALL TIME)', value: '₹ 5,48,20,000', color: 'success', icon: FiPieChart }
  ];

  const recentFeeActivities = [
    { activity: 'Fee Head Added', description: 'Added "Lab Fee"', date: '17 May 2026', performedBy: 'Admin' },
    { activity: 'Fee Structure Updated', description: 'Updated B.E. Computer Fee', date: '16 May 2026', performedBy: 'Admin' },
    { activity: 'Discount Rule Added', description: 'Merit Scholarship Rule', date: '15 May 2026', performedBy: 'Admin' }
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Fee Status Main Container */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* ==================== STUDENT VIEW ==================== */}
          {role === 'STUDENT' && (
            <>
              <div className="mb-4 d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="fw-bold text-dark mb-1">Fee Status</h4>
                  <p className="text-muted small mb-0">Overview of academic fees, dues, and payment transaction history.</p>
                </div>
                <button className="btn btn-primary btn-sm px-3 fw-semibold d-inline-flex align-items-center gap-2" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                  <FiCreditCard size={15} />
                  <span>Pay Outstanding Fees</span>
                </button>
              </div>

              {/* Stat Metric Cards */}
              <div className="row g-3 mb-4">
                {studentStats.map((stat, idx) => (
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

              {/* Itemized Fee Table Card */}
              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3">
                  <h6 className="fw-bold text-dark mb-0">Fee Details</h6>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Fee Type</th>
                        <th className="px-4 py-3">Amount (₹)</th>
                        <th className="px-4 py-3">Paid (₹)</th>
                        <th className="px-4 py-3">Pending (₹)</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-end">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {studentFeeDetails.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.type}</td>
                          <td className="px-4 py-3 fw-bold text-dark">{item.amount}</td>
                          <td className="px-4 py-3 text-success fw-semibold">{item.paid}</td>
                          <td className="px-4 py-3 text-danger fw-semibold">{item.pending}</td>
                          <td className="px-4 py-3">
                            <span className={`badge px-2.5 py-1 text-xs fw-semibold ${
                              item.status === 'Paid'
                                ? 'bg-success-subtle text-success border border-success-subtle'
                                : item.status === 'Partial'
                                ? 'bg-warning-subtle text-warning border border-warning-subtle'
                                : 'bg-danger-subtle text-danger border border-danger-subtle'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-end text-muted small">{item.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== FACULTY VIEW ==================== */}
          {role === 'FACULTY' && (
            <div className="card border-0 shadow-sm rounded-3 bg-white p-5 text-center my-auto d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
              <div className="rounded-circle bg-success bg-opacity-10 text-success p-4 mb-3 d-inline-flex align-items-center justify-content-center">
                <FiCheckCircle size={48} />
              </div>
              <h5 className="fw-bold text-dark mb-2">Faculty - No Fee Applicable</h5>
              <p className="text-muted small max-w-md mx-auto mb-0">
                Faculty members are not required to pay academic or operational fees.
              </p>
            </div>
          )}

          {/* ==================== HOD VIEW ==================== */}
          {role === 'HOD' && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">Department Fee Summary</h4>
                <p className="text-muted small mb-0">Fee collection statistics across department students.</p>
              </div>

              {/* Metric Stat Cards */}
              <div className="row g-3 mb-4">
                {hodStats.map((stat, idx) => (
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
            </>
          )}

          {/* ==================== PRINCIPAL VIEW ==================== */}
          {role === 'PRINCIPAL' && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">Institute Fee Summary</h4>
                <p className="text-muted small mb-0">Campus-wide revenue and collection metrics.</p>
              </div>

              {/* Metric Stat Cards */}
              <div className="row g-3 mb-4">
                {principalStats.map((stat, idx) => (
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
            </>
          )}

          {/* ==================== ACCOUNTS VIEW ==================== */}
          {role === 'ACCOUNTS' && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">Fee Collection Overview</h4>
                <p className="text-muted small mb-0">Detailed breakdown of fee metrics across academic courses.</p>
              </div>

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3 text-center">Total Students</th>
                        <th className="px-4 py-3">Expected (₹)</th>
                        <th className="px-4 py-3 text-success">Collected (₹)</th>
                        <th className="px-4 py-3 text-danger">Pending (₹)</th>
                        <th className="px-4 py-3 text-end">Collection %</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {accountsFeeOverview.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.course}</td>
                          <td className="px-4 py-3 text-center text-muted">{item.students}</td>
                          <td className="px-4 py-3 fw-medium text-dark">{item.expected}</td>
                          <td className="px-4 py-3 fw-bold text-success">{item.collected}</td>
                          <td className="px-4 py-3 fw-bold text-danger">{item.pending}</td>
                          <td className="px-4 py-3 text-end fw-bold text-primary">{item.percentage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== LIBRARY VIEW ==================== */}
          {role === 'LIBRARY' && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">Library Fine / Fee Status</h4>
                <p className="text-muted small mb-0">Overdue book fines collection and pending member balances.</p>
              </div>

              {/* Metric Stat Cards */}
              <div className="row g-3 mb-4">
                {libraryStats.map((stat, idx) => (
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

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3">
                  <h6 className="fw-bold text-dark mb-0">Recent Overdue Fines</h6>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Book Title</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3 text-danger">Fine (₹)</th>
                        <th className="px-4 py-3 text-end">Status</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {recentOverdueFines.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.studentName}</td>
                          <td className="px-4 py-3 text-muted">{item.bookTitle}</td>
                          <td className="px-4 py-3 text-muted">{item.dueDate}</td>
                          <td className="px-4 py-3 fw-bold text-danger">{item.fine}</td>
                          <td className="px-4 py-3 text-end">
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1 text-xs fw-semibold">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== SYSTEM ADMIN VIEW ==================== */}
          {role === 'ADMIN' && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">Fee System Overview</h4>
                <p className="text-muted small mb-0">System configuration and general ledger revenue metrics.</p>
              </div>

              {/* Metric Stat Cards */}
              <div className="row g-3 mb-4">
                {adminFeeStats.map((stat, idx) => (
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

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3">
                  <h6 className="fw-bold text-dark mb-0">Recent Fee Activity Log</h6>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Activity</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-end">Performed By</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {recentFeeActivities.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.activity}</td>
                          <td className="px-4 py-3 text-muted">{item.description}</td>
                          <td className="px-4 py-3 text-muted">{item.date}</td>
                          <td className="px-4 py-3 text-end fw-semibold text-primary">{item.performedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default FeeStatusView;