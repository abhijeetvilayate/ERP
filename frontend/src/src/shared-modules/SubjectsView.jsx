import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import { 
  FiBookOpen, 
  FiGrid, 
  FiUsers, 
  FiUserCheck, 
  FiDollarSign, 
  FiBook 
} from 'react-icons/fi';

const SubjectsView = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  // --- Student & Faculty Subjects Data ---
  const studentSubjects = [
    { code: 'CS201', name: 'Database Management Systems', faculty: 'Prof. Neha Joshi', credits: 4, semester: 'IV' },
    { code: 'CS202', name: 'Operating Systems', faculty: 'Prof. Sandeep Kulkarni', credits: 4, semester: 'IV' },
    { code: 'CS203', name: 'Web Development', faculty: 'Prof. Priya Mehta', credits: 3, semester: 'IV' },
    { code: 'CS204', name: 'Computer Networks', faculty: 'Prof. Amit Patil', credits: 3, semester: 'IV' },
    { code: 'CS205', name: 'Python Programming', faculty: 'Prof. Rahul Deshmukh', credits: 3, semester: 'IV' },
    { code: 'CS206', name: 'Data Structures', faculty: 'Prof. Kavita Raut', credits: 4, semester: 'IV' }
  ];

  // --- HOD Department Subjects Data ---
  const hodSubjects = [
    { code: 'CS201', name: 'Database Management Systems', faculty: 'Prof. Neha Joshi', semester: 'IV', students: 60 },
    { code: 'CS202', name: 'Operating Systems', faculty: 'Prof. Sandeep Kulkarni', semester: 'IV', students: 60 },
    { code: 'CS203', name: 'Web Development', faculty: 'Prof. Priya Mehta', semester: 'IV', students: 60 },
    { code: 'CS204', name: 'Computer Networks', faculty: 'Prof. Amit Patil', semester: 'IV', students: 60 },
    { code: 'CS205', name: 'Python Programming', faculty: 'Prof. Rahul Deshmukh', semester: 'IV', students: 60 }
  ];

  // --- Principal Overview Stats & Stream Summary ---
  const principalStats = [
    { title: 'TOTAL DEPARTMENTS', value: '6', color: 'primary', icon: FiGrid },
    { title: 'TOTAL SUBJECTS', value: '48', color: 'info', icon: FiBookOpen },
    { title: 'TOTAL FACULTY', value: '85', color: 'warning', icon: FiUserCheck },
    { title: 'TOTAL STUDENTS', value: '1250', color: 'success', icon: FiUsers }
  ];

  const subjectsByDepartment = [
    { department: 'Computer Engineering', totalSubjects: 12, faculty: 24, students: 320 },
    { department: 'Mechanical Engineering', totalSubjects: 10, faculty: 18, students: 280 },
    { department: 'Civil Engineering', totalSubjects: 8, faculty: 15, students: 220 },
    { department: 'Electronics Engineering', totalSubjects: 8, faculty: 14, students: 210 },
    { department: 'Information Technology', totalSubjects: 10, faculty: 12, students: 160 }
  ];

  // --- Accounts Fee Heads (Subjects) Data ---
  const accountsFeeHeads = [
    { head: 'Tuition Fee', applicableTo: 'All Courses', amount: '-' },
    { head: 'Lab Fee', applicableTo: 'Lab Subjects', amount: '-' },
    { head: 'Exam Fee', applicableTo: 'All Students', amount: '-' },
    { head: 'Library Fee', applicableTo: 'All Students', amount: '-' },
    { head: 'Development Fee', applicableTo: 'All Students', amount: '-' },
    { head: 'Other Charges', applicableTo: 'All Students', amount: '-' }
  ];

  // --- Library Subjects Data ---
  const librarySubjects = [
    { category: 'Computer Science', totalBooks: 1250, newArrivals: 45, grandTotal: 1295 },
    { category: 'Mechanical Engineering', totalBooks: 980, newArrivals: 30, grandTotal: 1010 },
    { category: 'Civil Engineering', totalBooks: 850, newArrivals: 25, grandTotal: 875 },
    { category: 'Electronics & Telecomm.', totalBooks: 760, newArrivals: 20, grandTotal: 780 },
    { category: 'General / Basic Science', totalBooks: 640, newArrivals: 18, grandTotal: 658 }
  ];

  // --- Admin All Subjects Overview Data ---
  const adminSubjectsOverview = [
    { code: 'CS201', name: 'Database Management Systems', department: 'Computer Engg.', faculty: 'Prof. Neha Joshi', students: 60 },
    { code: 'ME201', name: 'Thermodynamics', department: 'Mechanical Engg.', faculty: 'Prof. Raj Malhotra', students: 55 },
    { code: 'CE201', name: 'Structural Analysis', department: 'Civil Engg.', faculty: 'Prof. Amit Kale', students: 50 },
    { code: 'EE201', name: 'Circuit Theory', department: 'E&TC Engg.', faculty: 'Prof. Sunita Rao', students: 45 }
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Subjects Main Container */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* ==================== STUDENT / FACULTY VIEW ==================== */}
          {(role === 'STUDENT' || role === 'FACULTY') && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">My Subjects</h4>
                <p className="text-muted small mb-0">Overview of enrolled academic courses and assigned faculty.</p>
              </div>

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Subject Code</th>
                        <th className="px-4 py-3">Subject Name</th>
                        <th className="px-4 py-3">Faculty</th>
                        <th className="px-4 py-3">Credits</th>
                        <th className="px-4 py-3 text-center">Semester</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {studentSubjects.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 font-monospace fw-semibold text-primary">{item.code}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.name}</td>
                          <td className="px-4 py-3 text-dark">{item.faculty}</td>
                          <td className="px-4 py-3 text-muted">{item.credits}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="badge bg-light text-dark border px-2.5 py-1">{item.semester}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== HOD VIEW ==================== */}
          {role === 'HOD' && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">Department Subjects</h4>
                <p className="text-muted small mb-0">Manage subject allocations and student intake numbers.</p>
              </div>

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Subject Code</th>
                        <th className="px-4 py-3">Subject Name</th>
                        <th className="px-4 py-3">Faculty</th>
                        <th className="px-4 py-3">Semester</th>
                        <th className="px-4 py-3 text-end">Students</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {hodSubjects.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 font-monospace fw-semibold text-primary">{item.code}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.name}</td>
                          <td className="px-4 py-3 text-dark">{item.faculty}</td>
                          <td className="px-4 py-3 text-muted">{item.semester}</td>
                          <td className="px-4 py-3 text-end fw-bold text-dark">{item.students}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== PRINCIPAL VIEW ==================== */}
          {role === 'PRINCIPAL' && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">Institute Subjects Overview</h4>
                <p className="text-muted small mb-0">High-level distribution of subjects and faculty across departments.</p>
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

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3">
                  <h6 className="fw-bold text-dark mb-0">Subjects by Department</h6>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3 text-center">Total Subjects</th>
                        <th className="px-4 py-3 text-center">Faculty</th>
                        <th className="px-4 py-3 text-end">Students</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {subjectsByDepartment.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.department}</td>
                          <td className="px-4 py-3 text-center fw-semibold text-primary">{item.totalSubjects}</td>
                          <td className="px-4 py-3 text-center text-muted">{item.faculty}</td>
                          <td className="px-4 py-3 text-end fw-bold text-dark">{item.students}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== ACCOUNTS VIEW ==================== */}
          {role === 'ACCOUNTS' && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">Fee Heads (Subjects)</h4>
                <p className="text-muted small mb-0">Configure institutional fee heads and applicable categories.</p>
              </div>

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Fee Head</th>
                        <th className="px-4 py-3">Applicable To</th>
                        <th className="px-4 py-3 text-end">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {accountsFeeHeads.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.head}</td>
                          <td className="px-4 py-3 text-muted">{item.applicableTo}</td>
                          <td className="px-4 py-3 text-end fw-bold text-dark">{item.amount}</td>
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
                <h4 className="fw-bold text-dark mb-1">Library Subject Categories</h4>
                <p className="text-muted small mb-0">Book stock breakdown categorized by academic subjects.</p>
              </div>

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Subject Category</th>
                        <th className="px-4 py-3 text-center">No. of Books</th>
                        <th className="px-4 py-3 text-center">New Arrivals</th>
                        <th className="px-4 py-3 text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {librarySubjects.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.category}</td>
                          <td className="px-4 py-3 text-center text-muted">{item.totalBooks}</td>
                          <td className="px-4 py-3 text-center text-success fw-semibold">+{item.newArrivals}</td>
                          <td className="px-4 py-3 text-end fw-bold text-dark">{item.grandTotal}</td>
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
                <h4 className="fw-bold text-dark mb-1">System Subjects (All Departments)</h4>
                <p className="text-muted small mb-0">System-wide subject catalog registry across all faculties.</p>
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

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3">
                  <h6 className="fw-bold text-dark mb-0">All Subjects Overview</h6>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Subject Code</th>
                        <th className="px-4 py-3">Subject Name</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Faculty</th>
                        <th className="px-4 py-3 text-end">Students</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {adminSubjectsOverview.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 font-monospace fw-semibold text-primary">{item.code}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.name}</td>
                          <td className="px-4 py-3 text-muted">{item.department}</td>
                          <td className="px-4 py-3 text-dark">{item.faculty}</td>
                          <td className="px-4 py-3 text-end fw-bold text-dark">{item.students}</td>
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

export default SubjectsView;