import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiBell, FiBookmark, FiFileText, FiPlusCircle } from 'react-icons/fi';

const NoticesView = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const [categoryFilter, setCategoryFilter] = useState('All Notices');

  // Role-based Section Titles
  const getNoticeTitle = () => {
    switch (role) {
      case 'FACULTY':
      case 'HOD':
        return 'Department Notices';
      case 'PRINCIPAL':
        return 'Important Notices';
      case 'ACCOUNTS':
        return 'Accounts Notices';
      case 'LIBRARY':
        return 'Library Notices';
      case 'ADMIN':
        return 'System Announcements';
      default:
        return 'Notices';
    }
  };

  // Role-specific Notice Lists matching UI Mockups
  const noticeData = {
    STUDENT: [
      { id: 1, title: 'Semester Exam Time Table Published', date: '16 May 2026', pinned: true, category: 'Academic' },
      { id: 2, title: 'College Annual Fest - 2026', date: '15 May 2026', pinned: true, category: 'Event' },
      { id: 3, title: 'Library will remain closed on 18 May', date: '14 May 2026', pinned: true, category: 'General' },
      { id: 4, title: 'Project Submission Last Date Extended', date: '12 May 2026', pinned: true, category: 'Academic' }
    ],
    FACULTY: [
      { id: 1, title: 'Faculty Meeting on 20 May 2026', date: '16 May 2026', pinned: true, category: 'Meeting' },
      { id: 2, title: 'Submit Internal Marks by 25 May 2026', date: '15 May 2026', pinned: true, category: 'Academic' },
      { id: 3, title: 'Workshop on "AI in Education"', date: '14 May 2026', pinned: true, category: 'Event' },
      { id: 4, title: 'New Lab Manuals Available', date: '12 May 2026', pinned: true, category: 'General' }
    ],
    HOD: [
      { id: 1, title: 'Department Meeting on 21 May', date: '16 May 2026', pinned: true, category: 'Meeting' },
      { id: 2, title: 'Project Review on 24 May', date: '15 May 2026', pinned: true, category: 'Academic' },
      { id: 3, title: 'Lab Maintenance on 20 May', date: '14 May 2026', pinned: true, category: 'General' },
      { id: 4, title: 'NAAC Document Submission', date: '12 May 2026', pinned: true, category: 'Administrative' }
    ],
    PRINCIPAL: [
      { id: 1, title: 'University Circular: Examination Reforms', date: '16 May 2026', pinned: true, category: 'University' },
      { id: 2, title: 'Annual Day Celebration on 25 May 2026', date: '15 May 2026', pinned: true, category: 'Event' },
      { id: 3, title: 'IQAC Meeting on 22 May 2026', date: '14 May 2026', pinned: true, category: 'Meeting' },
      { id: 4, title: 'Admission Process Update', date: '13 May 2026', pinned: true, category: 'Administrative' }
    ],
    ACCOUNTS: [
      { id: 1, title: 'Fee Collection Last Date Extended', date: '16 May 2026', pinned: true, category: 'Fees' },
      { id: 2, title: 'Salary Slips for April Available', date: '15 May 2026', pinned: true, category: 'Payroll' },
      { id: 3, title: 'TDS Declaration Submission', date: '14 May 2026', pinned: true, category: 'Tax' },
      { id: 4, title: 'Meeting with Finance Committee', date: '13 May 2026', pinned: true, category: 'Meeting' }
    ],
    LIBRARY: [
      { id: 1, title: 'New Books Added in Inventory', date: '16 May 2026', pinned: true, category: 'Inventory' },
      { id: 2, title: 'Library Timing Change from 20 May', date: '15 May 2026', pinned: true, category: 'General' },
      { id: 3, title: 'Book Bank Facility for Students', date: '14 May 2026', pinned: true, category: 'Services' },
      { id: 4, title: 'Stock Verification on 22 May', date: '13 May 2026', pinned: true, category: 'Maintenance' }
    ],
    ADMIN: [
      { id: 1, title: 'System Maintenance on 25 May (10 PM - 2 AM)', date: '16 May 2026', pinned: true, category: 'Maintenance' },
      { id: 2, title: 'Database Backup Schedule', date: '15 May 2026', pinned: true, category: 'Backup' },
      { id: 3, title: 'New User Accounts Guidelines', date: '14 May 2026', pinned: true, category: 'Security' },
      { id: 4, title: 'Security Policy Update', date: '13 May 2026', pinned: true, category: 'Security' }
    ]
  };

  const currentNotices = noticeData[role] || noticeData.STUDENT;

  // Filter Notices by Selected Category
  const filteredNotices = currentNotices.filter((notice) => {
    if (categoryFilter === 'All Notices') return true;
    return notice.category === categoryFilter;
  });

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Notices Main Container */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* Header & Controls */}
          <div className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bold text-dark mb-1">{getNoticeTitle()}</h4>
              <p className="text-muted small mb-0">
                Institutional announcements, circulars, and departmental updates.
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Category Filter Dropdown */}
              <select
                className="form-select form-select-sm bg-white shadow-none text-xs border-light"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: '160px' }}
              >
                <option value="All Notices">All Notices</option>
                <option value="Academic">Academic</option>
                <option value="Event">Event</option>
                <option value="General">General</option>
                <option value="Administrative">Administrative</option>
              </select>

              {/* Publish Notice Action Button (Staff / Admin) */}
              {['FACULTY', 'HOD', 'PRINCIPAL', 'ADMIN'].includes(role) && (
                <button 
                  className="btn btn-primary btn-sm px-3 fw-semibold d-inline-flex align-items-center gap-1.5"
                  style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                >
                  <FiPlusCircle size={15} />
                  <span>Publish Notice</span>
                </button>
              )}
            </div>
          </div>

          {/* Notice List Card */}
          <div className="card border-0 shadow-sm rounded-3 bg-white">
            <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <FiBell className="text-primary" />
                <span>Active Circulars</span>
              </h6>
              <span className="text-muted text-xs">
                {filteredNotices.length} Notices Available
              </span>
            </div>

            <div className="list-group list-group-flush">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((item) => (
                  <div key={item.id} className="list-group-item p-3.5 border-bottom border-light d-flex align-items-center justify-content-between hover-bg-light">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2.5 rounded-circle bg-primary bg-opacity-10 text-primary">
                        <FiFileText size={18} />
                      </div>
                      <div>
                        <h6 className="fw-semibold text-dark mb-1 text-sm">{item.title}</h6>
                        <span className="badge bg-light text-muted border px-2 py-0.5 text-xs">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <span className="text-muted text-xs">{item.date}</span>
                      {item.pinned && (
                        <FiBookmark className="text-primary" size={16} title="Pinned Notice" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted small">
                  No notices available under "{categoryFilter}".
                </div>
              )}
            </div>

            {/* Bottom Footer Link */}
            <div className="card-footer bg-white border-0 text-center py-3">
              <button className="btn btn-link text-primary p-0 text-xs fw-semibold text-decoration-none">
                View All Notices
              </button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default NoticesView;