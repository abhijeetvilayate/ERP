import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUsers, 
  FiUserCheck, 
  FiBookOpen, 
  FiCheckSquare, 
  FiPieChart, 
  FiCheckCircle, 
  FiFileText,
  FiAward
} from 'react-icons/fi';

// Comprehensive department profiles and metadata
const DEPARTMENT_CONFIGS = {
  'Chemical Engineering': {
    code: 'CHEM',
    stats: [
      { title: 'FACULTY', value: '12', color: 'primary', icon: FiUsers },
      { title: 'STUDENTS', value: '240', color: 'info', icon: FiUserCheck },
      { title: 'SUBJECTS', value: '6', color: 'warning', icon: FiBookOpen },
      { title: 'ATTENDANCE', value: '94%', color: 'success', icon: FiCheckSquare }
    ],
    faculty: [
      { name: 'Dr. Sandeep Kulkarni', role: 'HOD & Professor', percentage: '98%', subject: 'Chemical Process Principles' },
      { name: 'Prof. Rajesh Sharma', role: 'Associate Professor', percentage: '96%', subject: 'Mass Transfer Operations' },
      { name: 'Prof. Priya Patil', role: 'Assistant Professor', percentage: '95%', subject: 'Chemical Reaction Engineering' },
      { name: 'Prof. Arun Mehta', role: 'Assistant Professor', percentage: '92%', subject: 'Process Dynamics & Control' }
    ],
    pendingApprovals: [
      { title: 'Leave Requests (Chem)', count: 2, path: '/leave-request' },
      { title: 'Chemical Lab Equipment Requisition', count: 3, path: '/subjects' },
      { title: 'Industrial Safety Seminar Approvals', count: 1, path: '/attendance' }
    ]
  },
  'Computer Engineering': {
    code: 'COMP',
    stats: [
      { title: 'FACULTY', value: '18', color: 'primary', icon: FiUsers },
      { title: 'STUDENTS', value: '360', color: 'info', icon: FiUserCheck },
      { title: 'SUBJECTS', value: '8', color: 'warning', icon: FiBookOpen },
      { title: 'ATTENDANCE', value: '96%', color: 'success', icon: FiCheckSquare }
    ],
    faculty: [
      { name: 'Dr. Ananya Sharma', role: 'HOD & Professor', percentage: '99%', subject: 'Advanced Algorithms' },
      { name: 'Prof. Neha Joshi', role: 'Associate Professor', percentage: '97%', subject: 'Database Management Systems' },
      { name: 'Prof. Amit Kumar', role: 'Assistant Professor', percentage: '95%', subject: 'Computer Networks' },
      { name: 'Prof. Vikas Roy', role: 'Assistant Professor', percentage: '93%', subject: 'Operating Systems' }
    ],
    pendingApprovals: [
      { title: 'Leave Requests (Comp)', count: 3, path: '/leave-request' },
      { title: 'Computer Lab Timetable Allocation', count: 2, path: '/subjects' },
      { title: 'Hackathon Project Approvals', count: 4, path: '/attendance' }
    ]
  },
  'Mechanical Engineering': {
    code: 'MECH',
    stats: [
      { title: 'FACULTY', value: '14', color: 'primary', icon: FiUsers },
      { title: 'STUDENTS', value: '280', color: 'info', icon: FiUserCheck },
      { title: 'SUBJECTS', value: '7', color: 'warning', icon: FiBookOpen },
      { title: 'ATTENDANCE', value: '92%', color: 'success', icon: FiCheckSquare }
    ],
    faculty: [
      { name: 'Dr. Suresh Patil', role: 'HOD & Professor', percentage: '98%', subject: 'Thermodynamics' },
      { name: 'Prof. Ramesh Kadam', role: 'Associate Professor', percentage: '96%', subject: 'Fluid Mechanics' },
      { name: 'Prof. Nitin Shinde', role: 'Assistant Professor', percentage: '94%', subject: 'Machine Design' },
      { name: 'Prof. Pooja Mane', role: 'Assistant Professor', percentage: '91%', subject: 'Manufacturing Processes' }
    ],
    pendingApprovals: [
      { title: 'Leave Requests (Mech)', count: 2, path: '/leave-request' },
      { title: 'Workshop Schedule Allocation', count: 1, path: '/subjects' },
      { title: 'CAD Lab License Renewal', count: 2, path: '/attendance' }
    ]
  },
  'Civil Engineering': {
    code: 'CIVIL',
    stats: [
      { title: 'FACULTY', value: '11', color: 'primary', icon: FiUsers },
      { title: 'STUDENTS', value: '210', color: 'info', icon: FiUserCheck },
      { title: 'SUBJECTS', value: '6', color: 'warning', icon: FiBookOpen },
      { title: 'ATTENDANCE', value: '91%', color: 'success', icon: FiCheckSquare }
    ],
    faculty: [
      { name: 'Dr. Manoj Deshmukh', role: 'HOD & Professor', percentage: '97%', subject: 'Structural Analysis' },
      { name: 'Prof. Geeta Rao', role: 'Associate Professor', percentage: '95%', subject: 'Geotechnical Engineering' },
      { name: 'Prof. Santosh Kale', role: 'Assistant Professor', percentage: '93%', subject: 'Surveying & Levelling' },
      { name: 'Prof. Anita Kulkarni', role: 'Assistant Professor', percentage: '90%', subject: 'Environmental Engg' }
    ],
    pendingApprovals: [
      { title: 'Leave Requests (Civil)', count: 1, path: '/leave-request' },
      { title: 'Survey Camp Field Trip', count: 1, path: '/subjects' },
      { title: 'Site Inspection Approvals', count: 3, path: '/attendance' }
    ]
  },
  'Electrical Engineering': {
    code: 'ELEC',
    stats: [
      { title: 'FACULTY', value: '13', color: 'primary', icon: FiUsers },
      { title: 'STUDENTS', value: '260', color: 'info', icon: FiUserCheck },
      { title: 'SUBJECTS', value: '7', color: 'warning', icon: FiBookOpen },
      { title: 'ATTENDANCE', value: '93%', color: 'success', icon: FiCheckSquare }
    ],
    faculty: [
      { name: 'Dr. Vivek Joshi', role: 'HOD & Professor', percentage: '98%', subject: 'Power Systems' },
      { name: 'Prof. Sunita Rao', role: 'Associate Professor', percentage: '95%', subject: 'Control Systems' },
      { name: 'Prof. Kiran More', role: 'Assistant Professor', percentage: '94%', subject: 'Electrical Machines' },
      { name: 'Prof. Sachin Jadhav', role: 'Assistant Professor', percentage: '91%', subject: 'Power Electronics' }
    ],
    pendingApprovals: [
      { title: 'Leave Requests (Elec)', count: 2, path: '/leave-request' },
      { title: 'High Voltage Lab Booking', count: 2, path: '/subjects' },
      { title: 'Circuit Simulation Tools', count: 1, path: '/attendance' }
    ]
  },
  'Information Technology': {
    code: 'IT',
    stats: [
      { title: 'FACULTY', value: '16', color: 'primary', icon: FiUsers },
      { title: 'STUDENTS', value: '320', color: 'info', icon: FiUserCheck },
      { title: 'SUBJECTS', value: '8', color: 'warning', icon: FiBookOpen },
      { title: 'ATTENDANCE', value: '95%', color: 'success', icon: FiCheckSquare }
    ],
    faculty: [
      { name: 'Dr. Priya Kulkarni', role: 'HOD & Professor', percentage: '98%', subject: 'Cybersecurity & Cryptography' },
      { name: 'Prof. Deepak Shinde', role: 'Associate Professor', percentage: '96%', subject: 'Cloud Infrastructure' },
      { name: 'Prof. Ritu Gupta', role: 'Assistant Professor', percentage: '94%', subject: 'Full Stack Development' },
      { name: 'Prof. Alok Verma', role: 'Assistant Professor', percentage: '92%', subject: 'Data Analytics' }
    ],
    pendingApprovals: [
      { title: 'Leave Requests (IT)', count: 3, path: '/leave-request' },
      { title: 'Cloud Server Credential Access', count: 2, path: '/subjects' },
      { title: 'Internship NOC Approvals', count: 4, path: '/attendance' }
    ]
  }
};

const resolveDepartmentConfig = (deptName) => {
  if (!deptName) return DEPARTMENT_CONFIGS['Computer Engineering'];
  const name = deptName.toLowerCase();
  if (name.includes('chem')) return DEPARTMENT_CONFIGS['Chemical Engineering'];
  if (name.includes('comp') || name.includes('cse') || name.includes('computer')) return DEPARTMENT_CONFIGS['Computer Engineering'];
  if (name.includes('mech')) return DEPARTMENT_CONFIGS['Mechanical Engineering'];
  if (name.includes('civil')) return DEPARTMENT_CONFIGS['Civil Engineering'];
  if (name.includes('elec')) return DEPARTMENT_CONFIGS['Electrical Engineering'];
  if (name.includes('it') || name.includes('information')) return DEPARTMENT_CONFIGS['Information Technology'];

  return {
    code: deptName.substring(0, 4).toUpperCase(),
    stats: [
      { title: 'FACULTY', value: '15', color: 'primary', icon: FiUsers },
      { title: 'STUDENTS', value: '300', color: 'info', icon: FiUserCheck },
      { title: 'SUBJECTS', value: '7', color: 'warning', icon: FiBookOpen },
      { title: 'ATTENDANCE', value: '95%', color: 'success', icon: FiCheckSquare }
    ],
    faculty: [
      { name: 'Prof. Senior Faculty A', role: 'Associate Professor', percentage: '97%', subject: 'Specialized Track I' },
      { name: 'Prof. Senior Faculty B', role: 'Associate Professor', percentage: '95%', subject: 'Specialized Track II' },
      { name: 'Prof. Assistant Faculty C', role: 'Assistant Professor', percentage: '93%', subject: 'Core Lab Systems' },
      { name: 'Prof. Assistant Faculty D', role: 'Assistant Professor', percentage: '91%', subject: 'Department Practicals' }
    ],
    pendingApprovals: [
      { title: 'Leave Request', count: 2, path: '/leave-request' },
      { title: 'Subject Allocation', count: 1, path: '/subjects' },
      { title: 'Attendance Approvals', count: 3, path: '/attendance' }
    ]
  };
};

const HodDashboard = () => {
  const { user } = useAuth();

  const departmentName = user?.departmentName || user?.department || 'Computer Engineering';
  const deptConfig = resolveDepartmentConfig(departmentName);

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
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
              <div>
                <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <span>HOD Dashboard</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fs-6 py-1 px-2.5 rounded-pill">
                    {deptConfig.code} Department
                  </span>
                </h4>
                <p className="text-muted small mb-0">
                  Welcome back, <span className="text-primary fw-semibold">{user?.fullName || user?.username || 'Head of Department'}</span>! Overview of academic operations for <strong className="text-dark">{departmentName}</strong>.
                </p>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Link to="/subjects" className="btn btn-outline-primary btn-sm fw-semibold rounded-2 px-3">
                  Department Subjects
                </Link>
                <Link to="/timetable" className="btn btn-primary btn-sm fw-semibold rounded-2 px-3" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                  View Timetable
                </Link>
              </div>
            </div>
          </div>

          {/* Top 4 Metric Cards */}
          <div className="row g-3 mb-4">
            {deptConfig.stats.map((stat, idx) => (
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

          {/* Middle Row Layout: Department Overview, Top Faculty Attendance, Pending Approvals */}
          <div className="row g-4">
            
            {/* Department Overview Chart Card */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FiPieChart className="text-primary" />
                    <span>{departmentName} Overview</span>
                  </h6>

                  {/* Circular CSS Donut Graphic */}
                  <div className="d-flex justify-content-center my-4">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center position-relative shadow-sm"
                      style={{
                        width: '150px',
                        height: '150px',
                        background: 'conic-gradient(#0052cc 0% 65%, #17a2b8 65% 85%, #dc3545 85% 92%, #6c757d 92% 100%)'
                      }}
                    >
                      <div className="rounded-circle bg-white d-flex flex-column align-items-center justify-content-center" style={{ width: '90px', height: '90px' }}>
                        <span className="fw-bold text-dark small text-uppercase">{deptConfig.code}</span>
                        <span className="text-muted" style={{ fontSize: '9px' }}>DEPT</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="row row-cols-2 g-2 text-xs">
                    <div className="col d-flex align-items-center gap-2">
                      <span className="p-1 rounded-circle bg-primary"></span>
                      <span className="text-muted">Attendance (95%)</span>
                    </div>
                    <div className="col d-flex align-items-center gap-2">
                      <span className="p-1 rounded-circle bg-info"></span>
                      <span className="text-muted">Curriculum (85%)</span>
                    </div>
                    <div className="col d-flex align-items-center gap-2">
                      <span className="p-1 rounded-circle bg-danger"></span>
                      <span className="text-muted">Leaves (7%)</span>
                    </div>
                    <div className="col d-flex align-items-center gap-2">
                      <span className="p-1 rounded-circle bg-secondary"></span>
                      <span className="text-muted">Research (8%)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Link to="/attendance" className="btn btn-outline-primary btn-sm w-100 fw-semibold">
                    View Attendance Analytics
                  </Link>
                </div>
              </div>
            </div>

            {/* Top Faculty Attendance */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center justify-content-between">
                    <span className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" />
                      <span>{deptConfig.code} Faculty Performance</span>
                    </span>
                    <span className="badge bg-success bg-opacity-10 text-success text-xs fw-semibold">
                      Active
                    </span>
                  </h6>

                  <div className="d-flex flex-column gap-2.5 my-2">
                    {deptConfig.faculty.map((item, idx) => (
                      <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light border border-light">
                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                          <div className="rounded-circle bg-white shadow-sm text-primary fw-bold text-xs flex-shrink-0" style={{ width: '34px', height: '34px', display: 'grid', placeItems: 'center' }}>
                            {item.name.split(' ').pop()?.charAt(0) || 'F'}
                          </div>
                          <div className="overflow-hidden">
                            <span className="small fw-semibold text-dark d-block text-truncate">{item.name}</span>
                            <span className="text-muted text-truncate d-block" style={{ fontSize: '11px' }}>{item.subject}</span>
                          </div>
                        </div>
                        <span className="badge bg-primary bg-opacity-10 text-primary fw-bold flex-shrink-0 ms-2">
                          {item.percentage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <Link to="/subjects" className="btn btn-primary btn-sm w-100 fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    Faculty Subject Allocation
                  </Link>
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 bg-white p-3 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FiFileText className="text-warning" />
                    <span>Department Approvals</span>
                  </h6>

                  <div className="d-flex flex-column gap-3 my-2">
                    {deptConfig.pendingApprovals.map((item, idx) => (
                      <Link 
                        key={idx} 
                        to={item.path}
                        className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between text-decoration-none hover-bg-white border transition-all"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span className="small fw-semibold text-dark">{item.title}</span>
                        </div>
                        <span className="badge bg-danger rounded-circle p-2 px-2.5 fs-6 shadow-sm">
                          {item.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <Link to="/leave-request" className="btn btn-primary btn-sm w-100 fw-semibold" style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}>
                    Review Leave Requests
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

export default HodDashboard;