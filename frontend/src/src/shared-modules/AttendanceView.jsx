import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import DataTable from '../components/common/DataTable';
import { useAuth } from '../context/AuthContext';
import { 
  FiCheckSquare, 
  FiUserCheck, 
  FiUserX, 
  FiPercent, 
  FiFilter 
} from 'react-icons/fi';

const AttendanceView = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  // --- Student State & Mock Data ---
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedMonth, setSelectedMonth] = useState('May 2026');

  const studentStats = [
    { title: 'TOTAL CLASSES', value: '72', color: 'primary', icon: FiCheckSquare },
    { title: 'PRESENT', value: '61', color: 'success', icon: FiUserCheck },
    { title: 'ABSENT', value: '8', color: 'danger', icon: FiUserX },
    { title: 'ATTENDANCE', value: '84.72%', color: 'info', icon: FiPercent }
  ];

  const studentAttendanceData = [
    { subject: 'Data Structures', total: 18, present: 15, absent: 3, percentage: '83.33%' },
    { subject: 'Database Management Systems', total: 18, present: 16, absent: 2, percentage: '88.89%' },
    { subject: 'Operating Systems', total: 18, present: 15, absent: 3, percentage: '83.33%' },
    { subject: 'Web Development', total: 18, present: 15, absent: 3, percentage: '83.33%' }
  ];

  // --- Faculty State & Mock Data ---
  const [facultyClass, setFacultyClass] = useState('BE Computer - Div A');
  const [facultySubject, setFacultySubject] = useState('Data Structures');
  const [facultyDate, setFacultyDate] = useState('2026-05-20');

  const [studentList, setStudentList] = useState([
    { rollNo: '22CS1001', name: 'Aaditya Patil', status: 'Present' },
    { rollNo: '22CS1002', name: 'Anjali Deshmukh', status: 'Present' },
    { rollNo: '22CS1003', name: 'Arjun Mehta', status: 'Absent' },
    { rollNo: '22CS1004', name: 'Bhavnesh Singh', status: 'Present' },
    { rollNo: '22CS1005', name: 'Charu Sharma', status: 'Present' },
    { rollNo: '22CS1006', name: 'Devansh Rai', status: 'Present' }
  ]);

  const toggleAttendanceStatus = (index) => {
    setStudentList((prev) =>
      prev.map((student, i) =>
        i === index
          ? { ...student, status: student.status === 'Present' ? 'Absent' : 'Present' }
          : student
      )
    );
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Attendance Container */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* Header & Controls */}
          <div className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bold text-dark mb-1">Attendance</h4>
              <p className="text-muted small mb-0">
                {role === 'STUDENT'
                  ? 'Track your course attendance metrics and record history.'
                  : 'Manage and record class attendance logs.'}
              </p>
            </div>

            {/* Student Filter Controls */}
            {role === 'STUDENT' && (
              <div className="d-flex align-items-center gap-2">
                <select
                  className="form-select form-select-sm bg-white shadow-none text-xs border-light"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="All Subjects">All Subjects</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Database Management Systems">Database Management</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Web Development">Web Development</option>
                </select>

                <select
                  className="form-select form-select-sm bg-white shadow-none text-xs border-light"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="May 2026">May 2026</option>
                  <option value="April 2026">April 2026</option>
                </select>
              </div>
            )}
          </div>

          {/* ==================== STUDENT VIEW ==================== */}
          {role === 'STUDENT' && (
            <>
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

              {/* Attendance Breakdown Table */}
              <DataTable
                headers={['Subject', 'Total Classes', 'Present', 'Absent', 'Percentage']}
                data={studentAttendanceData}
                searchPlaceholder="Search subject attendance..."
                renderRow={(item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 fw-semibold text-dark">{item.subject}</td>
                    <td className="px-4 py-3 text-muted">{item.total}</td>
                    <td className="px-4 py-3 text-success fw-semibold">{item.present}</td>
                    <td className="px-4 py-3 text-danger fw-semibold">{item.absent}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1">
                        {item.percentage}
                      </span>
                    </td>
                  </tr>
                )}
              />
            </>
          )}

          {/* ==================== FACULTY VIEW ==================== */}
          {role === 'FACULTY' && (
            <>
              {/* Faculty Filter Bar */}
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label text-muted text-xs fw-semibold">Select Class</label>
                    <select
                      className="form-select form-select-sm shadow-none"
                      value={facultyClass}
                      onChange={(e) => setFacultyClass(e.target.value)}
                    >
                      <option value="BE Computer - Div A">BE Computer - Div A</option>
                      <option value="BE Computer - Div B">BE Computer - Div B</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-muted text-xs fw-semibold">Select Subject</label>
                    <select
                      className="form-select form-select-sm shadow-none"
                      value={facultySubject}
                      onChange={(e) => setFacultySubject(e.target.value)}
                    >
                      <option value="Data Structures">Data Structures</option>
                      <option value="Database Management Systems">Database Management Systems</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-muted text-xs fw-semibold">Select Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm shadow-none"
                      value={facultyDate}
                      onChange={(e) => setFacultyDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Marking Table */}
              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold text-dark mb-0">
                    Mark Attendance — {facultyClass} ({facultySubject})
                  </h6>
                  <button
                    className="btn btn-primary btn-sm px-4 fw-semibold"
                    style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                  >
                    Save Attendance
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">Roll No.</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {studentList.map((student, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-monospace fw-semibold text-primary">{student.rollNo}</td>
                          <td className="px-4 py-3 fw-medium text-dark">{student.name}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => toggleAttendanceStatus(idx)}
                              className={`btn btn-sm px-3 fw-semibold ${
                                student.status === 'Present'
                                  ? 'btn-success bg-success bg-opacity-10 text-success border-success'
                                  : 'btn-danger bg-danger bg-opacity-10 text-danger border-danger'
                              }`}
                            >
                              {student.status}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== ADMINISTRATIVE VIEW (HOD/PRINCIPAL/ADMIN) ==================== */}
          {['HOD', 'PRINCIPAL', 'ADMIN', 'ACCOUNTS', 'LIBRARY'].includes(role) && (
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
              <h6 className="fw-bold text-dark mb-3">Institutional Attendance Overview</h6>
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center">
                    <span className="text-muted text-xs uppercase d-block fw-semibold mb-1">Average Attendance</span>
                    <h4 className="fw-bold text-success mb-0">88.41%</h4>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center">
                    <span className="text-muted text-xs uppercase d-block fw-semibold mb-1">Total Classes Conducted</span>
                    <h4 className="fw-bold text-primary mb-0">2,450</h4>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center">
                    <span className="text-muted text-xs uppercase d-block fw-semibold mb-1">Students Below 75%</span>
                    <h4 className="fw-bold text-danger mb-0">45</h4>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center">
                    <span className="text-muted text-xs uppercase d-block fw-semibold mb-1">Active Batches</span>
                    <h4 className="fw-bold text-dark mb-0">12</h4>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AttendanceView;