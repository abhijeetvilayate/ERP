import { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiCamera, FiEdit3, FiCheck, FiX, FiShield } from 'react-icons/fi';

// Role-specific profile configuration & metadata mapping
const ROLE_CONFIGS = {
  STUDENT: {
    title: 'Student Profile',
    designation: 'Student',
    idLabel: 'Roll No.',
    defaultId: '22CS1017',
    deptLabel: 'Program',
    defaultDept: 'B.Tech - Computer Science',
    secondaryLabel: 'Semester',
    defaultSecondary: 'VI Semester',
    badgeClass: 'bg-primary text-primary',
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    defaultName: 'Rohit Sharma',
    defaultEmail: 'rohit.sharma@college.edu.in',
    dateLabel: 'Date of Birth',
    defaultDate: '12 Mar 2004',
    locationLabel: 'Residential Address',
    defaultLocation: '12, Green Park, Pune, Maharashtra'
  },
  FACULTY: {
    title: 'Faculty Profile',
    designation: 'Assistant Professor',
    idLabel: 'Employee ID',
    defaultId: 'FAC-1025',
    deptLabel: 'Department',
    defaultDept: 'Computer Engineering',
    secondaryLabel: 'Designation',
    defaultSecondary: 'Assistant Professor',
    badgeClass: 'bg-success text-success',
    defaultAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    defaultName: 'Prof. Rajesh Sharma',
    defaultEmail: 'rajesh.sharma@college.edu.in',
    dateLabel: 'Date of Joining',
    defaultDate: '15 Jul 2019',
    locationLabel: 'Faculty Cabin',
    defaultLocation: 'Room 304, Tech Wing, Block A'
  },
  HOD: {
    title: 'Head of Department Profile',
    designation: 'Head of Department (HOD)',
    idLabel: 'Employee ID',
    defaultId: 'HOD-2001',
    deptLabel: 'Department',
    defaultDept: 'Computer Engineering',
    secondaryLabel: 'Designation',
    defaultSecondary: 'Head of Department (HOD)',
    badgeClass: 'bg-purple text-purple',
    defaultAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    defaultName: 'Dr. Arvind Verma',
    defaultEmail: 'arvind.verma@college.edu.in',
    dateLabel: 'Date of Joining',
    defaultDate: '01 Aug 2014',
    locationLabel: 'HOD Office',
    defaultLocation: 'Room 401, Department Building'
  },
  PRINCIPAL: {
    title: 'Principal & Director Profile',
    designation: 'Principal & Director',
    idLabel: 'Employee ID',
    defaultId: 'DIR-0001',
    deptLabel: 'Department',
    defaultDept: 'Institute Directorate',
    secondaryLabel: 'Designation',
    defaultSecondary: 'Principal & Director',
    badgeClass: 'bg-warning text-warning',
    defaultAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    defaultName: 'Dr. Rameshwar Patil',
    defaultEmail: 'principal@college.edu.in',
    dateLabel: 'Tenure Since',
    defaultDate: '10 Jan 2012',
    locationLabel: 'Directorate Office',
    defaultLocation: 'Executive Suite, Main Administrative Block'
  },
  VICE_PRINCIPAL: {
    title: 'Vice Principal Profile',
    designation: 'Vice Principal (Academics)',
    idLabel: 'Employee ID',
    defaultId: 'VP-0002',
    deptLabel: 'Department',
    defaultDept: 'Academic Affairs',
    secondaryLabel: 'Designation',
    defaultSecondary: 'Vice Principal (Academics)',
    badgeClass: 'bg-info text-info',
    defaultAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    defaultName: 'Dr. Sunita Deshmukh',
    defaultEmail: 'vp.academics@college.edu.in',
    dateLabel: 'Date of Joining',
    defaultDate: '20 Jun 2016',
    locationLabel: 'Office Location',
    defaultLocation: 'Room 205, Academic Block B'
  },
  ACCOUNTS: {
    title: 'Accounts Officer Profile',
    designation: 'Senior Accounts Officer',
    idLabel: 'Employee ID',
    defaultId: 'ACC-3042',
    deptLabel: 'Department',
    defaultDept: 'Finance & Accounts',
    secondaryLabel: 'Designation',
    defaultSecondary: 'Senior Accounts Officer',
    badgeClass: 'bg-info text-info',
    defaultAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
    defaultName: 'Suresh Nair',
    defaultEmail: 'accounts.officer@college.edu.in',
    dateLabel: 'Date of Joining',
    defaultDate: '18 Nov 2018',
    locationLabel: 'Office Location',
    defaultLocation: 'Finance Counter #3, Ground Floor'
  },
  LIBRARY: {
    title: 'Chief Librarian Profile',
    designation: 'Chief Librarian',
    idLabel: 'Employee ID',
    defaultId: 'LIB-4011',
    deptLabel: 'Department',
    defaultDept: 'Central Library',
    secondaryLabel: 'Designation',
    defaultSecondary: 'Chief Librarian',
    badgeClass: 'bg-danger text-danger',
    defaultAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    defaultName: 'Meenakshi Iyer',
    defaultEmail: 'library.head@college.edu.in',
    dateLabel: 'Date of Joining',
    defaultDate: '05 Mar 2017',
    locationLabel: 'Office Location',
    defaultLocation: 'Central Library, 1st Floor Desk'
  },
  ADMIN: {
    title: 'System Administrator Profile',
    designation: 'Lead System Administrator',
    idLabel: 'Employee ID',
    defaultId: 'SYS-9901',
    deptLabel: 'Department',
    defaultDept: 'IT Infrastructure & Administration',
    secondaryLabel: 'Designation',
    defaultSecondary: 'Lead System Administrator',
    badgeClass: 'bg-dark text-white',
    defaultAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    defaultName: 'System Administrator',
    defaultEmail: 'admin@college.edu.in',
    dateLabel: 'System Onboarding',
    defaultDate: '01 Jan 2020',
    locationLabel: 'Server Room',
    defaultLocation: 'Data Center, Tech Wing B2'
  },
  SYSTEM_ADMIN: {
    title: 'System Administrator Profile',
    designation: 'Lead System Administrator',
    idLabel: 'Employee ID',
    defaultId: 'SYS-9901',
    deptLabel: 'Department',
    defaultDept: 'IT Infrastructure & Administration',
    secondaryLabel: 'Designation',
    defaultSecondary: 'Lead System Administrator',
    badgeClass: 'bg-dark text-white',
    defaultAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    defaultName: 'System Administrator',
    defaultEmail: 'admin@college.edu.in',
    dateLabel: 'System Onboarding',
    defaultDate: '01 Jan 2020',
    locationLabel: 'Server Room',
    defaultLocation: 'Data Center, Tech Wing B2'
  }
};

const ProfileView = () => {
  const { user } = useAuth();

  const currentRole = (user?.role || 'STUDENT').toUpperCase();
  const roleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.STUDENT;
  const isStudent = currentRole === 'STUDENT';

  // Dynamic user details corresponding to the authenticated user and their active role
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || roleConfig.defaultName,
    idNumber: user?.rollNo || user?.employeeId || roleConfig.defaultId,
    department: user?.departmentName || user?.department || roleConfig.defaultDept,
    secondaryValue: user?.designation || user?.semester || roleConfig.defaultSecondary,
    designation: user?.designation || roleConfig.designation,
    email: user?.email || roleConfig.defaultEmail,
    phone: user?.phoneNumber || user?.phone || '9876543210',
    dateInfo: user?.dateOfBirth || roleConfig.defaultDate,
    address: user?.address || roleConfig.defaultLocation,
    avatarUrl: user?.avatarUrl || roleConfig.defaultAvatar
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profileData });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync profile data whenever user changes
  useEffect(() => {
    const config = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.STUDENT;
    const initialData = {
      fullName: user?.fullName || config.defaultName,
      idNumber: user?.rollNo || user?.employeeId || config.defaultId,
      department: user?.departmentName || user?.department || config.defaultDept,
      secondaryValue: user?.designation || user?.semester || config.defaultSecondary,
      designation: user?.designation || config.designation,
      email: user?.email || config.defaultEmail,
      phone: user?.phoneNumber || user?.phone || '9876543210',
      dateInfo: user?.dateOfBirth || config.defaultDate,
      address: user?.address || config.defaultLocation,
      avatarUrl: user?.avatarUrl || config.defaultAvatar
    };
    setProfileData(initialData);
    setEditForm(initialData);
  }, [user, currentRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileData({ ...editForm });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Profile Main Container */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* Section Header */}
          <div className="mb-4 d-flex align-items-center justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h4 className="fw-bold text-dark mb-0">My Profile</h4>
                <span className={`badge bg-opacity-15 px-2.5 py-1 text-xs fw-bold rounded-pill text-uppercase ${roleConfig.badgeClass}`}>
                  {currentRole}
                </span>
              </div>
              <p className="text-muted small mb-0">
                Institutional account information for {roleConfig.designation}.
              </p>
            </div>
            
            <div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 fw-semibold px-3 shadow-sm"
                >
                  <FiEdit3 size={14} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <button 
                    onClick={handleCancelEdit}
                    className="btn btn-light btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 border"
                  >
                    <FiX size={14} />
                    <span>Cancel</span>
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 shadow-sm"
                    style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                  >
                    <FiCheck size={14} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Success Alert */}
          {savedSuccess && (
            <div className="alert alert-success d-flex align-items-center gap-2 text-sm py-2 px-3 border-0 rounded-3 mb-3 shadow-sm">
              <FiCheck className="text-success" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Profile Card Container */}
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <div className="row g-4 align-items-center">
              
              {/* Left Column: Avatar & Change Photo */}
              <div className="col-lg-3 text-center border-end-lg border-light">
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src={profileData.avatarUrl}
                    alt={profileData.fullName}
                    className="rounded-circle img-thumbnail shadow-sm object-fit-cover"
                    style={{ width: '140px', height: '140px' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/140';
                    }}
                  />
                </div>
                <div>
                  <button 
                    type="button"
                    className="btn btn-primary btn-sm px-3 text-xs fw-semibold d-inline-flex align-items-center gap-1.5" 
                    style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                    onClick={() => {
                      const newUrl = prompt('Enter image URL for avatar:', profileData.avatarUrl);
                      if (newUrl) {
                        setProfileData(prev => ({ ...prev, avatarUrl: newUrl }));
                        setEditForm(prev => ({ ...prev, avatarUrl: newUrl }));
                      }
                    }}
                  >
                    <FiCamera size={13} />
                    <span>Change Photo</span>
                  </button>
                </div>
                <div className="mt-3">
                  <span className="badge bg-light text-secondary border px-2.5 py-1 text-xs d-inline-flex align-items-center gap-1">
                    <FiShield size={12} className="text-primary" />
                    <span>{roleConfig.designation}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: User Information Grid */}
              <div className="col-lg-9 ps-lg-4">
                {!isEditing ? (
                  /* Read-Only Mode */
                  <div className="row g-3">
                    
                    {/* Full Name */}
                    <div className="col-md-6 col-lg-4">
                      <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">Full Name</span>
                      <span className="fw-bold text-dark text-sm">{profileData.fullName}</span>
                    </div>

                    {/* Roll No or Employee ID */}
                    <div className="col-md-6 col-lg-4">
                      <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">
                        {roleConfig.idLabel}
                      </span>
                      <span className="fw-bold text-dark text-sm font-monospace">
                        {profileData.idNumber}
                      </span>
                    </div>

                    {/* Designation */}
                    <div className="col-md-6 col-lg-4">
                      <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">
                        Designation
                      </span>
                      <span className="fw-bold text-primary text-sm">
                        {roleConfig.designation}
                      </span>
                    </div>

                    {/* Program or Department */}
                    <div className="col-md-6 col-lg-4">
                      <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">
                        {roleConfig.deptLabel}
                      </span>
                      <span className="fw-bold text-dark text-sm">
                        {profileData.department}
                      </span>
                    </div>

                    {/* Semester or Academic Level */}
                    {isStudent && (
                      <div className="col-md-6 col-lg-4">
                        <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">
                          {roleConfig.secondaryLabel}
                        </span>
                        <span className="fw-bold text-dark text-sm">
                          {profileData.secondaryValue}
                        </span>
                      </div>
                    )}

                    {/* Role Access Level */}
                    <div className="col-md-6 col-lg-4">
                      <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">
                        System Role
                      </span>
                      <span className="badge bg-dark text-white px-2 py-1 text-xs fw-semibold">
                        {currentRole}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="col-md-6 col-lg-4">
                      <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">Email</span>
                      <span className="fw-semibold text-primary text-sm">{profileData.email}</span>
                    </div>

                    {/* Phone */}
                    <div className="col-md-6 col-lg-4">
                      <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">Phone</span>
                      <span className="fw-bold text-dark text-sm">{profileData.phone}</span>
                    </div>

                    {/* Date Information */}
                    <div className="col-md-6 col-lg-4">
                      <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">
                        {roleConfig.dateLabel}
                      </span>
                      <span className="fw-bold text-dark text-sm">{profileData.dateInfo}</span>
                    </div>

                    {/* Address or Office Location */}
                    <div className="col-md-12 col-lg-8">
                      <span className="text-muted text-xs uppercase tracking-wider d-block fw-semibold mb-1">
                        {roleConfig.locationLabel}
                      </span>
                      <span className="fw-semibold text-dark text-sm">{profileData.address}</span>
                    </div>

                  </div>
                ) : (
                  /* Edit Mode Form */
                  <form onSubmit={handleSaveProfile} className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-xs fw-semibold text-muted mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control form-control-sm"
                        value={editForm.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-xs fw-semibold text-muted mb-1">{roleConfig.idLabel}</label>
                      <input
                        type="text"
                        name="idNumber"
                        className="form-control form-control-sm"
                        value={editForm.idNumber}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-xs fw-semibold text-muted mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-sm"
                        value={editForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-xs fw-semibold text-muted mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control form-control-sm"
                        value={editForm.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-xs fw-semibold text-muted mb-1">{roleConfig.deptLabel}</label>
                      <input
                        type="text"
                        name="department"
                        className="form-control form-control-sm"
                        value={editForm.department}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-xs fw-semibold text-muted mb-1">{roleConfig.dateLabel}</label>
                      <input
                        type="text"
                        name="dateInfo"
                        className="form-control form-control-sm"
                        value={editForm.dateInfo}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-xs fw-semibold text-muted mb-1">{roleConfig.locationLabel}</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control form-control-sm"
                        value={editForm.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ProfileView;