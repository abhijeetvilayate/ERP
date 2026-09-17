import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import ApplyLeaveModal from '../components/modals/ApplyLeaveModal';
import { useAuth } from '../context/AuthContext';
import { 
  FiPlusCircle, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle, 
  FiUser, 
  FiShield, 
  FiCheck, 
  FiX, 
  FiSend,
  FiArrowRight
} from 'react-icons/fi';

const HIERARCHY = {
  STUDENT: {
    targetRole: 'FACULTY',
    targetTitle: 'Faculty / Class Advisor',
    canApprove: ['STUDENT']
  },
  FACULTY: {
    targetRole: 'HOD',
    targetTitle: 'Head of Department (HOD)',
    canApprove: ['STUDENT']
  },
  HOD: {
    targetRole: 'PRINCIPAL',
    targetTitle: 'Principal & Director',
    canApprove: ['FACULTY']
  },
  ACCOUNTS: {
    targetRole: 'PRINCIPAL',
    targetTitle: 'Principal & Director',
    canApprove: []
  },
  LIBRARY: {
    targetRole: 'PRINCIPAL',
    targetTitle: 'Principal & Director',
    canApprove: []
  },
  PRINCIPAL: {
    targetRole: 'DIRECTORATE',
    targetTitle: 'Institute Directorate',
    canApprove: ['HOD', 'ACCOUNTS', 'LIBRARY', 'FACULTY']
  },
  VICE_PRINCIPAL: {
    targetRole: 'DIRECTORATE',
    targetTitle: 'Institute Directorate',
    canApprove: ['HOD', 'ACCOUNTS', 'LIBRARY', 'FACULTY']
  },
  ADMIN: {
    targetRole: 'PRINCIPAL',
    targetTitle: 'Principal & Director',
    canApprove: ['HOD', 'ACCOUNTS', 'LIBRARY', 'FACULTY', 'STUDENT']
  },
  SYSTEM_ADMIN: {
    targetRole: 'PRINCIPAL',
    targetTitle: 'Principal & Director',
    canApprove: ['HOD', 'ACCOUNTS', 'LIBRARY', 'FACULTY', 'STUDENT']
  }
};

const DEFAULT_LEAVE_RECORDS = [
  {
    id: 1,
    applicantId: 1007,
    applicantName: 'Rohit Sharma',
    applicantRole: 'STUDENT',
    department: 'Computer Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2026-05-20',
    toDate: '2026-05-21',
    reason: 'Family Function in hometown',
    status: 'Pending',
    targetRole: 'FACULTY',
    targetTitle: 'Faculty / Class Advisor',
    appliedAt: '18 May 2026'
  },
  {
    id: 2,
    applicantId: 1004,
    applicantName: 'Prof. Neha Joshi',
    applicantRole: 'FACULTY',
    department: 'Computer Engineering',
    leaveType: 'Duty Leave',
    fromDate: '2026-05-25',
    toDate: '2026-05-27',
    reason: 'Attending IEEE International Conference',
    status: 'Pending',
    targetRole: 'HOD',
    targetTitle: 'Head of Department (HOD)',
    appliedAt: '19 May 2026'
  },
  {
    id: 3,
    applicantId: 1003,
    applicantName: 'Dr. Sandeep Kulkarni',
    applicantRole: 'HOD',
    department: 'Chemical Engineering',
    leaveType: 'Medical Leave',
    fromDate: '2026-06-01',
    toDate: '2026-06-03',
    reason: 'Annual Health Checkup',
    status: 'Pending',
    targetRole: 'PRINCIPAL',
    targetTitle: 'Principal & Director',
    appliedAt: '19 May 2026'
  },
  {
    id: 4,
    applicantId: 1005,
    applicantName: 'Mr. Amit Verma',
    applicantRole: 'ACCOUNTS',
    department: 'Administration Department',
    leaveType: 'Casual Leave',
    fromDate: '2026-05-28',
    toDate: '2026-05-29',
    reason: 'Personal Work',
    status: 'Pending',
    targetRole: 'PRINCIPAL',
    targetTitle: 'Principal & Director',
    appliedAt: '19 May 2026'
  },
  {
    id: 5,
    applicantId: 1006,
    applicantName: 'Ms. Priya Nair',
    applicantRole: 'LIBRARY',
    department: 'Library Department',
    leaveType: 'Casual Leave',
    fromDate: '2026-05-30',
    toDate: '2026-05-31',
    reason: 'Family Engagement',
    status: 'Approved',
    targetRole: 'PRINCIPAL',
    targetTitle: 'Principal & Director',
    approvedBy: 'Dr. Rajesh Deshmukh (Principal)',
    appliedAt: '15 May 2026'
  }
];

const LeaveRequestsView = () => {
  const { user } = useAuth();
  const currentRole = (user?.role || 'STUDENT').toUpperCase();
  const userConfig = HIERARCHY[currentRole] || HIERARCHY.STUDENT;
  const canReview = userConfig.canApprove && userConfig.canApprove.length > 0;

  // Dual-view mode: 'approvals' (Review incoming) vs 'my_leaves' (Submitted applications)
  const [viewSection, setViewSection] = useState(canReview ? 'approvals' : 'my_leaves');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load and persist leave records
  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const stored = localStorage.getItem('erp_leave_requests');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored leaves:', e);
    }
    return DEFAULT_LEAVE_RECORDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('erp_leave_requests', JSON.stringify(leaveRequests));
    } catch (e) {
      console.error('Failed to save leave records:', e);
    }
  }, [leaveRequests]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Submit a new leave request
  const handleApplyLeaveSubmit = (formData) => {
    const newRecord = {
      id: Date.now(),
      applicantId: user?.userId || Date.now(),
      applicantName: user?.fullName || user?.username || 'Current User',
      applicantRole: currentRole,
      department: user?.departmentName || user?.department || 'General Department',
      leaveType: formData.leaveType || 'Casual Leave',
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason,
      status: 'Pending',
      targetRole: userConfig.targetRole,
      targetTitle: userConfig.targetTitle,
      appliedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setLeaveRequests((prev) => [newRecord, ...prev]);
    setIsModalOpen(false);
    showToast(`Leave request submitted to ${userConfig.targetTitle} for review.`);
  };

  // Authority Approval / Rejection Action
  const handleReviewAction = (requestId, newStatus) => {
    let targetedApplicant = null;

    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          targetedApplicant = req;
          return {
            ...req,
            status: newStatus,
            reviewedBy: `${user?.fullName || user?.username} (${currentRole})`,
            reviewedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          };
        }
        return req;
      })
    );

    // Create & dispatch notification to the applicant
    if (targetedApplicant) {
      try {
        const storedNotifs = JSON.parse(localStorage.getItem('erp_user_notifications') || '[]');
        const newNotif = {
          id: Date.now(),
          recipientId: targetedApplicant.applicantId,
          recipientName: targetedApplicant.applicantName,
          recipientRole: targetedApplicant.applicantRole,
          title: `Leave Request ${newStatus}`,
          message: `Your ${targetedApplicant.leaveType} application (${targetedApplicant.fromDate} to ${targetedApplicant.toDate}) has been ${newStatus.toLowerCase()} by ${user?.fullName || user?.username} (${currentRole}).`,
          type: newStatus === 'Approved' ? 'success' : 'danger',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          link: '/leave-request'
        };
        const updated = [newNotif, ...storedNotifs];
        localStorage.setItem('erp_user_notifications', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('erp_new_notification', { detail: newNotif }));
      } catch (err) {
        console.error('Failed to create notification:', err);
      }
    }

    showToast(`Leave request #${requestId} has been marked as ${newStatus} and notification sent to ${targetedApplicant?.applicantName || 'applicant'}.`);
  };

  // Incoming Approvals dataset (Leaves sent to this authority)
  const incomingApprovals = leaveRequests.filter((item) => {
    if (!canReview) return false;
    return userConfig.canApprove.includes(item.applicantRole);
  });

  // Personal leaves dataset
  const myLeaves = leaveRequests.filter((item) => {
    if (user?.userId && item.applicantId === user.userId) return true;
    if (item.applicantName === user?.fullName || item.applicantName === user?.username) return true;
    return item.applicantRole === currentRole;
  });

  // Filter based on currently active section and status filter
  const currentDataset = viewSection === 'approvals' ? incomingApprovals : myLeaves;
  const filteredRecords = currentDataset.filter((item) => {
    if (statusFilter === 'All') return true;
    return item.status === statusFilter;
  });

  const pendingApprovalsCount = incomingApprovals.filter((r) => r.status === 'Pending').length;

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Leave Requests Main Container */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* Notification Toast */}
          {toastMessage && (
            <div className="alert alert-success border-0 shadow-sm d-flex align-items-center gap-2 mb-4 py-2.5 px-3 rounded-3 text-sm">
              <FiCheckCircle className="text-success" size={18} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Header & Apply Leave Button */}
          <div className="mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <span>Leave Management Portal</span>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fs-6 py-1 px-2.5 rounded-pill">
                  {currentRole}
                </span>
              </h4>
              <p className="text-muted small mb-0">
                Hierarchical leave request processing: Student → Faculty → HOD → Principal.
              </p>
            </div>

            {/* Apply Leave Action Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary btn-sm px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-2 rounded-2 shadow-sm"
              style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
            >
              <FiPlusCircle size={16} />
              <span>Apply for Leave</span>
            </button>
          </div>

          {/* Dual-View Switcher for Authorities */}
          {canReview && (
            <div className="d-flex align-items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setViewSection('approvals')}
                className={`btn btn-sm d-inline-flex align-items-center gap-2 px-3 py-2 rounded-2 fw-semibold border transition-all ${
                  viewSection === 'approvals'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-secondary hover-bg-light'
                }`}
                style={viewSection === 'approvals' ? { backgroundColor: '#0052cc', borderColor: '#0052cc' } : {}}
              >
                <FiShield size={15} />
                <span>
                  {currentRole === 'FACULTY' ? 'Student Leave Approvals' : currentRole === 'HOD' ? 'Faculty Leave Approvals' : 'Institutional Staff Approvals'}
                </span>
                {pendingApprovalsCount > 0 && (
                  <span className="badge bg-danger rounded-pill px-2" style={{ fontSize: '11px' }}>
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setViewSection('my_leaves')}
                className={`btn btn-sm d-inline-flex align-items-center gap-2 px-3 py-2 rounded-2 fw-semibold border transition-all ${
                  viewSection === 'my_leaves'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-secondary hover-bg-light'
                }`}
                style={viewSection === 'my_leaves' ? { backgroundColor: '#0052cc', borderColor: '#0052cc' } : {}}
              >
                <FiSend size={15} />
                <span>My Submitted Applications</span>
              </button>
            </div>
          )}

          {/* Filter Tabs & Content Card */}
          <div className="card border-0 shadow-sm rounded-3 bg-white">
            
            {/* Filter Navigation Tabs */}
            <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="btn-group btn-group-sm p-1 bg-light rounded-2 border border-light">
                {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => {
                  const count = currentDataset.filter((item) => (tab === 'All' ? true : item.status === tab)).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`btn text-xs fw-semibold rounded-2 px-3 d-inline-flex align-items-center gap-1.5 ${
                        statusFilter === tab ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
                      }`}
                      style={statusFilter === tab ? { backgroundColor: '#0052cc', borderColor: '#0052cc' } : {}}
                    >
                      <span>{tab}</span>
                      <span
                        className={`badge rounded-pill ${
                          statusFilter === tab ? 'bg-white text-primary' : 'bg-secondary bg-opacity-25 text-dark'
                        }`}
                        style={{ fontSize: '10px' }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-muted small">
                {viewSection === 'approvals' ? (
                  <span>Reviewing incoming requests requiring your approval</span>
                ) : (
                  <span>Applications routed to: <strong className="text-dark">{userConfig.targetTitle}</strong></span>
                )}
              </div>
            </div>

            {/* Table Area */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  <tr>
                    {viewSection === 'approvals' && <th className="px-4 py-3">Applicant</th>}
                    <th className="px-4 py-3">Leave Type</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Reason</th>
                    {viewSection === 'my_leaves' && <th className="px-4 py-3">Routed Authority</th>}
                    <th className="px-4 py-3 text-center">Status</th>
                    {viewSection === 'approvals' && <th className="px-4 py-3 text-end">Action</th>}
                  </tr>
                </thead>
                <tbody className="border-top-0 text-sm">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((item) => (
                      <tr key={item.id}>
                        
                        {/* Applicant details for authority view */}
                        {viewSection === 'approvals' && (
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle bg-light text-primary fw-bold p-2 text-xs flex-shrink-0" style={{ width: '32px', height: '32px', display: 'grid', placeItems: 'center' }}>
                                {item.applicantName.charAt(0)}
                              </div>
                              <div>
                                <span className="fw-semibold text-dark d-block">{item.applicantName}</span>
                                <span className="text-muted text-xs d-block">
                                  {item.applicantRole} • {item.department}
                                </span>
                              </div>
                            </div>
                          </td>
                        )}

                        <td className="px-4 py-3 fw-semibold text-dark">
                          {item.leaveType}
                        </td>

                        <td className="px-4 py-3 text-muted small">
                          <span className="fw-medium text-dark">{item.fromDate}</span> to <span className="fw-medium text-dark">{item.toDate}</span>
                        </td>

                        <td className="px-4 py-3 text-muted small" style={{ maxWidth: '280px' }}>
                          <span className="text-truncate d-block" title={item.reason}>
                            {item.reason}
                          </span>
                        </td>

                        {/* Routed Authority for personal leaves view */}
                        {viewSection === 'my_leaves' && (
                          <td className="px-4 py-3 text-muted small">
                            <span className="badge bg-light text-dark border fw-medium px-2 py-1">
                              {item.targetTitle || userConfig.targetTitle}
                            </span>
                            {item.reviewedBy && (
                              <span className="d-block text-xs text-success mt-0.5">
                                Reviewed by: {item.reviewedBy}
                              </span>
                            )}
                          </td>
                        )}

                        <td className="px-4 py-3 text-center">
                          <span className={`badge px-2.5 py-1 text-xs fw-semibold ${
                            item.status === 'Approved'
                              ? 'bg-success-subtle text-success border border-success-subtle'
                              : item.status === 'Pending'
                              ? 'bg-warning-subtle text-warning border border-warning-subtle'
                              : 'bg-danger-subtle text-danger border border-danger-subtle'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Actions for approvals */}
                        {viewSection === 'approvals' && (
                          <td className="px-4 py-3 text-end">
                            {item.status === 'Pending' ? (
                              <div className="d-inline-flex align-items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleReviewAction(item.id, 'Approved')}
                                  className="btn btn-sm btn-success d-inline-flex align-items-center gap-1 px-2.5 py-1 text-xs fw-semibold rounded-2 shadow-none"
                                  title="Approve Leave"
                                >
                                  <FiCheck size={14} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReviewAction(item.id, 'Rejected')}
                                  className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 px-2.5 py-1 text-xs fw-semibold rounded-2 shadow-none"
                                  title="Reject Leave"
                                >
                                  <FiX size={14} />
                                  <span>Reject</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted">
                                {item.status === 'Approved' ? '✓ Completed' : '✗ Declined'}
                              </span>
                            )}
                          </td>
                        )}

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={viewSection === 'approvals' ? 6 : 5} className="text-center py-4 text-muted small">
                        No leave records found for "{statusFilter}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Card Footer Info */}
            <div className="card-footer bg-light bg-opacity-50 border-top border-light py-2.5 px-4 d-flex align-items-center justify-content-between flex-wrap text-xs text-muted">
              <span>Showing {filteredRecords.length} records</span>
              <span className="d-flex align-items-center gap-1">
                <span>Approval Rule:</span>
                <strong>Student → Faculty → HOD → Principal</strong>
              </span>
            </div>

          </div>

        </main>
      </div>

      {/* Apply Leave Modal Component */}
      <ApplyLeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplyLeaveSubmit}
      />
    </div>
  );
};

export default LeaveRequestsView;