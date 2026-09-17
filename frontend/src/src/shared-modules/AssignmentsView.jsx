import { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import assignmentService from '../services/assignmentService';
import { 
  FiFileText, 
  FiPlusCircle, 
  FiSearch, 
  FiCheckCircle, 
  FiClock, 
  FiSend, 
  FiAward,
  FiBell,
  FiList,
  FiUpload, 
  FiUploadCloud,
  FiDownload, 
  FiTrash2, 
  FiEye, 
  FiX, 
  FiCheck, 
  FiFolder, 
  FiAlertCircle, 
  FiPaperclip,
  FiEdit3
} from 'react-icons/fi';

const SUBJECT_OPTIONS = [
  { code: 'CS201', name: 'Database Management Systems', dept: 'Computer Engineering' },
  { code: 'CS202', name: 'Operating Systems', dept: 'Computer Engineering' },
  { code: 'CS301', name: 'Web Development', dept: 'Computer Engineering' },
  { code: 'CS204', name: 'Data Structures & Algorithms', dept: 'Computer Engineering' },
  { code: 'CS302', name: 'Computer Networks', dept: 'Computer Engineering' },
  { code: 'CH301', name: 'Chemical Reaction Engineering', dept: 'Chemical Engineering' },
  { code: 'CH302', name: 'Mass Transfer Operations', dept: 'Chemical Engineering' }
];

const AssignmentsView = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  // --- Core State ---
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // --- Modal States ---
  // 1. Faculty: Create Assignment Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    subjectCode: 'CS201',
    subject: 'Database Management Systems',
    dueDate: '',
    maxMarks: 25,
    description: '',
    attachmentName: ''
  });

  // 2. Student: Upload / Submit Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [studentNotes, setStudentNotes] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Faculty / Student: View Submission Details Modal
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [gradeInput, setGradeInput] = useState({});
  const [feedbackInput, setFeedbackInput] = useState({});

  // 4. Student: View My Submission Modal
  const [showMySubmissionModal, setShowMySubmissionModal] = useState(false);

  // Show Toast Helper
  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      if (role === 'FACULTY' || role === 'HOD' || role === 'PRINCIPAL') {
        const data = await assignmentService.getFacultyAssignments(user?.userId || 1004);
        setAssignments(data);
      } else {
        const data = await assignmentService.getStudentAssignments(user?.userId || 1007, user?.departmentId || 2);
        setAssignments(data);
      }
    } catch (err) {
      console.error('Error loading assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [role, user]);

  // --- Faculty Handlers ---
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!createFormData.title.trim() || !createFormData.dueDate) {
      showToast('Please enter title and due date.', 'danger');
      return;
    }

    try {
      const selectedSubj = SUBJECT_OPTIONS.find((s) => s.code === createFormData.subjectCode);
      const payload = {
        title: createFormData.title.trim(),
        subject: selectedSubj ? selectedSubj.name : createFormData.subject,
        subjectCode: createFormData.subjectCode,
        departmentId: user?.departmentId || 2,
        departmentName: selectedSubj ? selectedSubj.dept : 'Computer Engineering',
        facultyId: user?.userId || 1004,
        facultyName: user?.fullName || 'Faculty Member',
        dueDate: createFormData.dueDate,
        maxMarks: Number(createFormData.maxMarks) || 25,
        description: createFormData.description.trim(),
        attachmentName: createFormData.attachmentName || 'Assignment_Problem_Sheet.pdf'
      };

      const result = await assignmentService.createAssignment(payload);
      if (result.success) {
        showToast('Assignment created and published successfully!');
        setShowCreateModal(false);
        setCreateFormData({
          title: '',
          subjectCode: 'CS201',
          subject: 'Database Management Systems',
          dueDate: '',
          maxMarks: 25,
          description: '',
          attachmentName: ''
        });
        loadData();
      }
    } catch (error) {
      showToast('Failed to create assignment.', 'danger');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await assignmentService.deleteAssignment(assignmentId);
      showToast('Assignment deleted.');
      loadData();
    }
  };

  const handleOpenSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    const subs = await assignmentService.getSubmissionsForAssignment(assignment.id || assignment.assignmentId);
    setSubmissionsList(subs);
    // Preset grade/feedback inputs
    const gInputs = {};
    const fInputs = {};
    subs.forEach((s) => {
      gInputs[s.submissionId] = s.grade || '';
      fInputs[s.submissionId] = s.feedback || '';
    });
    setGradeInput(gInputs);
    setFeedbackInput(fInputs);
    setShowSubmissionsModal(true);
  };

  const handleSaveGrade = async (submissionId) => {
    const grade = gradeInput[submissionId];
    const feedback = feedbackInput[submissionId];
    if (!grade) {
      showToast('Please enter a grade or marks.', 'danger');
      return;
    }

    await assignmentService.gradeSubmission(submissionId, grade, feedback);
    showToast('Grade and feedback saved successfully!');
    // Refresh submissions
    if (selectedAssignment) {
      const subs = await assignmentService.getSubmissionsForAssignment(selectedAssignment.id || selectedAssignment.assignmentId);
      setSubmissionsList(subs);
    }
    loadData();
  };

  // --- Student Handlers ---
  const handleOpenUploadModal = (assignment) => {
    setSelectedAssignment(assignment);
    setUploadedFile(null);
    setStudentNotes(assignment.studentNotes || '');
    setUploadProgress(0);
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        raw: file
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        raw: file
      });
    }
  };

  const handleSubmitAssignment = async () => {
    if (!uploadedFile) {
      showToast('Please select or drop a file to upload.', 'danger');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(25);
    setTimeout(() => setUploadProgress(70), 300);

    setTimeout(async () => {
      setUploadProgress(100);
      try {
        const payload = {
          assignmentId: selectedAssignment.id || selectedAssignment.assignmentId,
          studentId: user?.userId || 1007,
          studentName: user?.fullName || 'Rohit Sharma',
          studentRoll: user?.rollNo || '22CS1017',
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          studentNotes: studentNotes.trim()
        };

        const res = await assignmentService.submitAssignment(payload);
        if (res.success) {
          showToast('Assignment submitted and uploaded successfully!');
          setShowUploadModal(false);
          loadData();
        }
      } catch (err) {
        showToast('Error uploading assignment.', 'danger');
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  const handleViewMySubmission = (assignment) => {
    setSelectedAssignment(assignment);
    setShowMySubmissionModal(true);
  };

  // --- Filtering ---
  const filteredAssignments = assignments.filter((item) => {
    const matchesTab = 
      activeTab === 'All' || 
      (role === 'STUDENT' && item.status === activeTab) ||
      (role !== 'STUDENT' && activeTab === 'All');
    
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title?.toLowerCase().includes(q) ||
      item.subject?.toLowerCase().includes(q) ||
      item.subjectCode?.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  // Student stats
  const pendingCount = assignments.filter((a) => a.status === 'Pending').length;
  const submittedCount = assignments.filter((a) => a.status === 'Submitted').length;
  const gradedCount = assignments.filter((a) => a.status === 'Graded').length;

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <Navbar />

        <main className="flex-grow-1 p-4 overflow-auto">
          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className={`alert alert-${toastMessage.type} alert-dismissible fade show d-flex align-items-center gap-2 py-2.5 px-3 rounded-3 shadow-sm mb-3`} role="alert">
              <FiCheckCircle />
              <span className="small fw-semibold">{toastMessage.text}</span>
              <button type="button" className="btn-close ms-auto p-2" onClick={() => setToastMessage(null)}></button>
            </div>
          )}

          {/* ==================== STUDENT VIEW ==================== */}
          {role === 'STUDENT' && (
            <>
              {/* Student Header */}
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">My Coursework & Assignments</h4>
                <p className="text-muted small mb-0">
                  Upload your solutions, track submission deadlines, and review faculty evaluations.
                </p>
              </div>

              {/* Student Metric Summary Cards */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                  <StatCard title="TOTAL ASSIGNMENTS" value={assignments.length} icon={FiFileText} color="primary" />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                  <StatCard title="PENDING SUBMISSIONS" value={pendingCount} icon={FiClock} color="warning" />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                  <StatCard title="SUBMITTED" value={submittedCount} icon={FiSend} color="info" />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                  <StatCard title="GRADED" value={gradedCount} icon={FiAward} color="success" />
                </div>
              </div>

              {/* Filter Tabs & Search Toolbar Card */}
              <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
                <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3">
                  {/* Aligned Category Tabs */}
                  <div className="d-flex flex-wrap align-items-center gap-1.5 p-1 bg-light rounded-3 border">
                    {[
                      { label: 'All', count: assignments.length },
                      { label: 'Pending', count: pendingCount },
                      { label: 'Submitted', count: submittedCount },
                      { label: 'Graded', count: gradedCount }
                    ].map((tab) => {
                      const isActive = activeTab === tab.label;
                      return (
                        <button
                          key={tab.label}
                          type="button"
                          onClick={() => setActiveTab(tab.label)}
                          className={`btn btn-sm d-inline-flex align-items-center justify-content-center gap-2 px-3 py-1.5 rounded-2 text-xs fw-semibold border-0 transition-all ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-transparent text-muted hover-bg-white hover-text-dark'
                          }`}
                          style={isActive ? { backgroundColor: '#0052cc' } : {}}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`badge rounded-pill ${
                              isActive ? 'bg-white text-primary fw-bold' : 'bg-secondary bg-opacity-25 text-dark'
                            }`}
                            style={{ fontSize: '11px', minWidth: '18px' }}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar */}
                  <div className="input-group input-group-sm" style={{ minWidth: '240px', maxWidth: '340px' }}>
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <FiSearch size={14} />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-start-0 shadow-none text-xs"
                      placeholder="Search assignments or subjects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        className="btn btn-light border-start-0 text-muted"
                        type="button"
                        onClick={() => setSearchQuery('')}
                      >
                        <FiX size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Assignments Table Card */}
              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Assignment Title</th>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Max Marks</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Grade</th>
                        <th className="px-4 py-3 text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="text-center py-5 text-muted">
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Loading assignments...
                          </td>
                        </tr>
                      ) : filteredAssignments.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-5 text-muted">
                            No assignments found matching your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredAssignments.map((item, index) => (
                          <tr key={item.id || item.assignmentId}>
                            <td className="px-4 py-3 text-muted">{index + 1}</td>
                            <td className="px-4 py-3">
                              <div className="fw-semibold text-dark">{item.title}</div>
                              {item.description && (
                                <div className="text-muted text-xs text-truncate" style={{ maxWidth: '280px' }}>
                                  {item.description}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="badge bg-primary bg-opacity-10 text-primary fw-medium px-2 py-1 text-xs me-1">
                                {item.subjectCode || 'CS'}
                              </span>
                              <span className="text-muted small">{item.subject}</span>
                            </td>
                            <td className="px-4 py-3 text-muted small">
                              <FiClock className="me-1 text-warning" size={13} />
                              {item.dueDate}
                            </td>
                            <td className="px-4 py-3 text-muted small">{item.maxMarks || 25} pts</td>
                            <td className="px-4 py-3">
                              <span className={`badge px-2.5 py-1 text-xs fw-semibold ${
                                item.status === 'Graded'
                                  ? 'bg-success-subtle text-success border border-success-subtle'
                                  : item.status === 'Submitted'
                                  ? 'bg-info-subtle text-info border border-info-subtle'
                                  : 'bg-warning-subtle text-warning border border-warning-subtle'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {item.grade ? (
                                <span className="badge bg-success bg-opacity-15 text-success fw-bold px-2 py-1 text-xs">
                                  {item.grade}
                                </span>
                              ) : (
                                <span className="text-muted text-xs">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-end">
                              {item.status === 'Pending' ? (
                                <button
                                  onClick={() => handleOpenUploadModal(item)}
                                  className="btn btn-primary btn-sm px-3 text-xs fw-semibold d-inline-flex align-items-center gap-1.5 shadow-sm"
                                  style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                                >
                                  <FiUpload size={13} />
                                  <span>Upload Assignment</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleViewMySubmission(item)}
                                  className="btn btn-outline-secondary btn-sm px-3 text-xs fw-semibold d-inline-flex align-items-center gap-1.5"
                                >
                                  <FiEye size={13} />
                                  <span>View Submission</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== FACULTY VIEW ==================== */}
          {role === 'FACULTY' && (
            <>
              {/* Faculty Header */}
              <div className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div>
                  <h4 className="fw-bold text-dark mb-1">Faculty Assignment Management</h4>
                  <p className="text-muted small mb-0">Create assignments, monitor student solution uploads, and evaluate submissions.</p>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 shadow-sm"
                    style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                  >
                    <FiPlusCircle size={15} />
                    <span>Add Assignment</span>
                  </button>
                </div>
              </div>

              {/* Faculty Assignment Table */}
              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Assignment Title</th>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Max Marks</th>
                        <th className="px-4 py-3">Submissions</th>
                        <th className="px-4 py-3 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted">
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Loading assignments...
                          </td>
                        </tr>
                      ) : assignments.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted">
                            No assignments created yet. Click "+ Add Assignment" to get started!
                          </td>
                        </tr>
                      ) : (
                        assignments.map((item, index) => (
                          <tr key={item.id || item.assignmentId}>
                            <td className="px-4 py-3 text-muted">{index + 1}</td>
                            <td className="px-4 py-3">
                              <div className="fw-semibold text-dark">{item.title}</div>
                              {item.description && (
                                <div className="text-muted text-xs text-truncate" style={{ maxWidth: '300px' }}>
                                  {item.description}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="badge bg-primary bg-opacity-10 text-primary fw-medium px-2 py-1 text-xs me-1">
                                {item.subjectCode || 'CS'}
                              </span>
                              <span className="text-muted small">{item.subject}</span>
                            </td>
                            <td className="px-4 py-3 text-muted small">{item.dueDate}</td>
                            <td className="px-4 py-3 text-muted small">{item.maxMarks || 25} pts</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleOpenSubmissions(item)}
                                className="btn btn-light btn-sm text-primary fw-bold text-xs px-2.5 py-1 rounded-pill border"
                              >
                                <FiList className="me-1" />
                                {item.submissionCount || '0/60'} Submissions
                              </button>
                            </td>
                            <td className="px-4 py-3 text-end">
                              <div className="d-inline-flex gap-2">
                                <button
                                  onClick={() => handleOpenSubmissions(item)}
                                  className="btn btn-outline-primary btn-sm px-2.5 text-xs fw-semibold"
                                  title="Review Submissions & Grade"
                                >
                                  Review
                                </button>
                                <button
                                  onClick={() => handleDeleteAssignment(item.id || item.assignmentId)}
                                  className="btn btn-outline-danger btn-sm px-2 text-xs"
                                  title="Delete Assignment"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== HOD / PRINCIPAL / ACCOUNTS / LIBRARY / ADMIN VIEWS ==================== */}
          {(role === 'HOD' || role === 'PRINCIPAL') && (
            <>
              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">
                  {role === 'HOD' ? 'Department Coursework & Assignment Oversight' : 'Campus-wide Assignment Analytics'}
                </h4>
                <p className="text-muted small mb-0">Overview of all active faculty assignments, submission rates, and grading statuses.</p>
              </div>

              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Assignment Title</th>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Faculty In Charge</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Submission Rate</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {assignments.map((item, index) => (
                        <tr key={item.id || item.assignmentId}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{item.title}</td>
                          <td className="px-4 py-3 text-muted">{item.subject}</td>
                          <td className="px-4 py-3 text-dark fw-medium">{item.facultyName || 'Prof. Neha Joshi'}</td>
                          <td className="px-4 py-3 text-muted">{item.dueDate}</td>
                          <td className="px-4 py-3">
                            <span className="badge bg-success bg-opacity-15 text-success fw-bold px-2.5 py-1 text-xs">
                              {item.submissionCount || '48/60'}
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

          {/* ==================== ACCOUNTS / LIBRARY / ADMIN DEFAULT TASK LISTS ==================== */}
          {(role === 'ACCOUNTS' || role === 'LIBRARY' || role === 'ADMIN') && (
            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
              <h5 className="fw-bold text-dark mb-2">Institutional Task & Assignment Portal</h5>
              <p className="text-muted small mb-4">Role-specific administrative workflows, tasks, and system schedule logs.</p>
              <div className="list-group list-group-flush border rounded-3">
                <div className="list-group-item p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1 text-dark fw-semibold">Academic Coursework Verification</h6>
                    <p className="mb-0 text-muted small">Verify department syllabus and assignment guidelines for active semester.</p>
                  </div>
                  <span className="badge bg-success-subtle text-success px-2.5 py-1">Active</span>
                </div>
                <div className="list-group-item p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1 text-dark fw-semibold">Term End Submission Audit</h6>
                    <p className="mb-0 text-muted small">Audit student submissions and verify against final evaluation marks.</p>
                  </div>
                  <span className="badge bg-warning-subtle text-warning px-2.5 py-1">Scheduled</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FACULTY - CREATE ASSIGNMENT MODAL                                */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white p-3">
                <h5 className="modal-title fw-bold fs-6 d-flex align-items-center gap-2">
                  <FiPlusCircle />
                  <span>Add New Assignment (Faculty)</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
              </div>

              <form onSubmit={handleCreateAssignment}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    
                    {/* Assignment Title */}
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Assignment Title *</label>
                      <input
                        type="text"
                        className="form-control text-sm shadow-none"
                        placeholder="e.g. Assignment 4: SQL Queries & Relational Algebra"
                        value={createFormData.title}
                        onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                        required
                      />
                    </div>

                    {/* Subject Selector */}
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Subject / Course *</label>
                      <select
                        className="form-select text-sm shadow-none"
                        value={createFormData.subjectCode}
                        onChange={(e) => {
                          const subj = SUBJECT_OPTIONS.find((s) => s.code === e.target.value);
                          setCreateFormData({
                            ...createFormData,
                            subjectCode: e.target.value,
                            subject: subj ? subj.name : ''
                          });
                        }}
                      >
                        {SUBJECT_OPTIONS.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.name} ({s.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Max Marks */}
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Total Points / Max Marks *</label>
                      <input
                        type="number"
                        className="form-control text-sm shadow-none"
                        placeholder="e.g. 25"
                        min="1"
                        max="100"
                        value={createFormData.maxMarks}
                        onChange={(e) => setCreateFormData({ ...createFormData, maxMarks: e.target.value })}
                        required
                      />
                    </div>

                    {/* Due Date */}
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Submission Deadline (Due Date) *</label>
                      <input
                        type="date"
                        className="form-control text-sm shadow-none"
                        value={createFormData.dueDate}
                        onChange={(e) => setCreateFormData({ ...createFormData, dueDate: e.target.value })}
                        required
                      />
                    </div>

                    {/* Optional Reference Attachment */}
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-semibold">Reference Document / Problem Sheet</label>
                      <input
                        type="text"
                        className="form-control text-sm shadow-none"
                        placeholder="e.g. Assignment_Questions_Sheet.pdf"
                        value={createFormData.attachmentName}
                        onChange={(e) => setCreateFormData({ ...createFormData, attachmentName: e.target.value })}
                      />
                    </div>

                    {/* Detailed Instructions */}
                    <div className="col-12">
                      <label className="form-label text-muted small fw-semibold">Description & Submission Guidelines</label>
                      <textarea
                        className="form-control text-sm shadow-none"
                        rows="4"
                        placeholder="Detail the problem statements, required file formats (.pdf / .zip / .py), and evaluation criteria..."
                        value={createFormData.description}
                        onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                      ></textarea>
                    </div>

                  </div>
                </div>

                <div className="modal-footer bg-light p-3 border-top">
                  <button type="button" className="btn btn-outline-secondary text-xs fw-semibold px-3" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-xs fw-semibold px-4 d-flex align-items-center gap-1.5"
                    style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                  >
                    <FiCheck />
                    <span>Publish Assignment</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: STUDENT - UPLOAD ASSIGNMENT MODAL                                 */}
      {/* ========================================================================= */}
      {showUploadModal && selectedAssignment && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white p-3">
                <h5 className="modal-title fw-bold fs-6 d-flex align-items-center gap-2">
                  <FiUploadCloud />
                  <span>Upload Assignment Solution</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowUploadModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                {/* Assignment Details Header */}
                <div className="bg-light p-3 rounded-3 mb-4 border border-light">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="badge bg-primary bg-opacity-15 text-primary fw-bold text-xs">
                      {selectedAssignment.subjectCode || 'CS'} - {selectedAssignment.subject}
                    </span>
                    <span className="text-muted small fw-medium">
                      <FiClock className="me-1 text-warning" />
                      Due: {selectedAssignment.dueDate}
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">{selectedAssignment.title}</h5>
                  {selectedAssignment.description && (
                    <p className="text-muted text-xs mb-2">{selectedAssignment.description}</p>
                  )}
                  <div className="d-flex align-items-center gap-3 text-xs text-secondary">
                    <span><strong>Max Marks:</strong> {selectedAssignment.maxMarks || 25} points</span>
                    <span><strong>Faculty:</strong> {selectedAssignment.facultyName || 'Faculty Member'}</span>
                  </div>
                </div>

                {/* Drag and Drop File Upload Box */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed rounded-3 p-4 text-center mb-3 transition-all"
                  style={{
                    borderColor: uploadedFile ? '#0052cc' : '#cbd5e1',
                    backgroundColor: uploadedFile ? '#f0f7ff' : '#fafafa'
                  }}
                >
                  <FiUploadCloud className="text-primary mb-2" size={38} />
                  <h6 className="fw-bold text-dark mb-1">
                    {uploadedFile ? uploadedFile.name : 'Choose a file or drag & drop here'}
                  </h6>
                  <p className="text-muted text-xs mb-3">
                    {uploadedFile ? `File size: ${uploadedFile.size}` : 'Supported formats: PDF, DOCX, ZIP, PY, SQL, CPP, PNG (Max 25MB)'}
                  </p>

                  <label className="btn btn-outline-primary btn-sm px-3 text-xs fw-semibold cursor-pointer">
                    <input type="file" className="d-none" onChange={handleFileChange} />
                    <span>{uploadedFile ? 'Change File' : 'Browse File from Computer'}</span>
                  </label>
                </div>

                {/* Upload Progress Bar */}
                {isSubmitting && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between text-xs text-muted mb-1">
                      <span>Uploading submission...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Optional Student Notes */}
                <div className="mb-2">
                  <label className="form-label text-muted small fw-semibold">Submission Notes / Comments (Optional)</label>
                  <textarea
                    className="form-control text-sm shadow-none"
                    rows="2"
                    placeholder="Add any notes for the faculty (e.g. Completed all questions with test case outputs)..."
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer bg-light p-3 border-top">
                <button type="button" className="btn btn-outline-secondary text-xs fw-semibold px-3" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAssignment}
                  disabled={!uploadedFile || isSubmitting}
                  className="btn btn-primary text-xs fw-semibold px-4 d-flex align-items-center gap-1.5 shadow-sm"
                  style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                >
                  {isSubmitting ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <FiSend />
                      <span>Confirm & Upload Assignment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: FACULTY - REVIEW SUBMISSIONS & GRADE MODAL                       */}
      {/* ========================================================================= */}
      {showSubmissionsModal && selectedAssignment && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white p-3">
                <div>
                  <h5 className="modal-title fw-bold fs-6 mb-0">Student Submissions & Evaluation</h5>
                  <small className="text-white-50">{selectedAssignment.title} ({selectedAssignment.subject})</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSubmissionsModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-3 py-2.5">Roll No</th>
                        <th className="px-3 py-2.5">Student Name</th>
                        <th className="px-3 py-2.5">Submitted File</th>
                        <th className="px-3 py-2.5">Submission Date</th>
                        <th className="px-3 py-2.5" style={{ width: '130px' }}>Grade / Marks</th>
                        <th className="px-3 py-2.5">Feedback / Comments</th>
                        <th className="px-3 py-2.5 text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0 text-sm">
                      {submissionsList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted">
                            No student submissions recorded for this assignment yet.
                          </td>
                        </tr>
                      ) : (
                        submissionsList.map((sub) => (
                          <tr key={sub.submissionId}>
                            <td className="px-3 py-2.5 fw-semibold text-primary">{sub.studentRoll || '22CS1001'}</td>
                            <td className="px-3 py-2.5 fw-semibold text-dark">{sub.studentName}</td>
                            <td className="px-3 py-2.5">
                              <span className="badge bg-light text-dark border px-2 py-1 text-xs d-inline-flex align-items-center gap-1">
                                <FiPaperclip className="text-primary" />
                                {sub.fileName} ({sub.fileSize || '1.2 MB'})
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-muted text-xs">{sub.submittedAt}</td>
                            <td className="px-3 py-2.5">
                              <input
                                type="text"
                                className="form-control form-control-sm text-xs shadow-none"
                                placeholder="e.g. 23/25"
                                value={gradeInput[sub.submissionId] || ''}
                                onChange={(e) => setGradeInput({ ...gradeInput, [sub.submissionId]: e.target.value })}
                              />
                            </td>
                            <td className="px-3 py-2.5">
                              <input
                                type="text"
                                className="form-control form-control-sm text-xs shadow-none"
                                placeholder="Add review feedback..."
                                value={feedbackInput[sub.submissionId] || ''}
                                onChange={(e) => setFeedbackInput({ ...feedbackInput, [sub.submissionId]: e.target.value })}
                              />
                            </td>
                            <td className="px-3 py-2.5 text-end">
                              <button
                                onClick={() => handleSaveGrade(sub.submissionId)}
                                className="btn btn-success btn-sm px-2.5 py-1 text-xs fw-semibold d-inline-flex align-items-center gap-1 shadow-sm"
                              >
                                <FiCheck size={12} />
                                <span>Save</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer bg-light p-3 border-top">
                <button type="button" className="btn btn-secondary text-xs fw-semibold px-4" onClick={() => setShowSubmissionsModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: STUDENT - VIEW MY SUBMISSION DETAILS MODAL                       */}
      {/* ========================================================================= */}
      {showMySubmissionModal && selectedAssignment && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white p-3">
                <h5 className="modal-title fw-bold fs-6">Submission Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMySubmissionModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <h6 className="fw-bold text-dark mb-1">{selectedAssignment.title}</h6>
                <p className="text-muted text-xs mb-3">{selectedAssignment.subject}</p>

                <div className="card bg-light border-0 p-3 rounded-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted text-xs">Submission Status:</span>
                    <span className="badge bg-success-subtle text-success px-2 py-1 text-xs fw-semibold">
                      {selectedAssignment.status}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted text-xs">Submitted File:</span>
                    <span className="fw-semibold text-dark text-xs d-flex align-items-center gap-1">
                      <FiPaperclip className="text-primary" />
                      {selectedAssignment.submittedFileName || 'Solution_Document.pdf'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted text-xs">Submitted At:</span>
                    <span className="text-muted text-xs">{selectedAssignment.submittedAt || 'May 2026'}</span>
                  </div>
                  {selectedAssignment.studentNotes && (
                    <div className="mt-2 pt-2 border-top text-xs text-secondary">
                      <strong>My Notes:</strong> {selectedAssignment.studentNotes}
                    </div>
                  )}
                </div>

                {/* Grade & Faculty Feedback Box */}
                {selectedAssignment.grade ? (
                  <div className="card bg-success bg-opacity-10 border border-success border-opacity-25 p-3 rounded-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-success text-xs">Faculty Evaluation</span>
                      <span className="badge bg-success text-white fw-bold px-2 py-1 text-xs">
                        Grade: {selectedAssignment.grade}
                      </span>
                    </div>
                    {selectedAssignment.feedback && (
                      <p className="text-dark small mb-0 mt-1">
                        <strong>Feedback:</strong> {selectedAssignment.feedback}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="alert alert-info text-xs py-2 px-3 mb-0 rounded-3">
                    Your solution has been received and is currently being evaluated by the course faculty.
                  </div>
                )}
              </div>

              <div className="modal-footer bg-light p-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-primary text-xs fw-semibold px-3"
                  onClick={() => {
                    setShowMySubmissionModal(false);
                    handleOpenUploadModal(selectedAssignment);
                  }}
                >
                  <FiUpload className="me-1" /> Re-upload Solution
                </button>
                <button type="button" className="btn btn-secondary text-xs fw-semibold px-3" onClick={() => setShowMySubmissionModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AssignmentsView;