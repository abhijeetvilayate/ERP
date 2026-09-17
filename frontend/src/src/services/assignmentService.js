import API from './api';

const ASSIGNMENTS_URL = '/assignments';

// Initial pre-seeded assignment data
const DEFAULT_ASSIGNMENTS = [
  {
    id: 1,
    assignmentId: 1,
    title: 'Database Design & Normalization Project',
    subject: 'Database Management Systems',
    subjectCode: 'CS201',
    departmentId: 2,
    departmentName: 'Computer Engineering',
    facultyId: 1004,
    facultyName: 'Prof. Neha Joshi',
    dueDate: '2026-05-30',
    maxMarks: 25,
    description: 'Design 3NF relational schema for Hospital Management System with complete ER diagrams and DDL SQL scripts.',
    attachmentName: 'DBMS_Hospital_Project_Guidelines.pdf',
    totalStudents: 60,
    createdAt: '2026-05-10'
  },
  {
    id: 2,
    assignmentId: 2,
    title: 'ER Diagram Creation & Relational Schema',
    subject: 'Database Management Systems',
    subjectCode: 'CS201',
    departmentId: 2,
    departmentName: 'Computer Engineering',
    facultyId: 1004,
    facultyName: 'Prof. Neha Joshi',
    dueDate: '2026-05-18',
    maxMarks: 20,
    description: 'Construct full Entity-Relationship diagram for an Online Bookstore including weak entities, recursive relationships, and cardinality constraints.',
    attachmentName: 'Bookstore_ER_Problem_Set.pdf',
    totalStudents: 60,
    createdAt: '2026-05-02'
  },
  {
    id: 3,
    assignmentId: 3,
    title: 'OS Process Scheduling Algorithms',
    subject: 'Operating Systems',
    subjectCode: 'CS202',
    departmentId: 2,
    departmentName: 'Computer Engineering',
    facultyId: 1004,
    facultyName: 'Prof. Neha Joshi',
    dueDate: '2026-05-25',
    maxMarks: 30,
    description: 'Implement FCFS, SJF, and Round Robin scheduling in C/C++ and calculate average turnaround time and waiting time.',
    attachmentName: 'OS_Lab_Scheduling_Manual.pdf',
    totalStudents: 60,
    createdAt: '2026-05-12'
  },
  {
    id: 4,
    assignmentId: 4,
    title: 'Full Stack React & API Mini Project',
    subject: 'Web Development',
    subjectCode: 'CS301',
    departmentId: 2,
    departmentName: 'Computer Engineering',
    facultyId: 1004,
    facultyName: 'Prof. Neha Joshi',
    dueDate: '2026-06-05',
    maxMarks: 50,
    description: 'Build a responsive single-page web app with React, authentication, REST API connectivity, and modular styling.',
    attachmentName: 'WebDev_Mini_Project_Rubric.pdf',
    totalStudents: 60,
    createdAt: '2026-05-15'
  },
  {
    id: 5,
    assignmentId: 5,
    title: 'Chemical Reaction Kinetics Simulation',
    subject: 'Chemical Reaction Engineering',
    subjectCode: 'CH301',
    departmentId: 1,
    departmentName: 'Chemical Engineering',
    facultyId: 1003,
    facultyName: 'Dr. Sandeep Kulkarni',
    dueDate: '2026-05-28',
    maxMarks: 25,
    description: 'Calculate rate constants and activation energy from batch reactor concentration data using Arrhenius models.',
    attachmentName: 'Reaction_Kinetics_Problem.pdf',
    totalStudents: 50,
    createdAt: '2026-05-14'
  }
];

// Initial pre-seeded student submissions
const DEFAULT_SUBMISSIONS = [
  {
    submissionId: 101,
    assignmentId: 2,
    studentId: 1007,
    studentName: 'Rohit Sharma',
    studentRoll: '22CS1017',
    fileName: 'Rohit_Sharma_ER_Bookstore.pdf',
    fileSize: '1.4 MB',
    submittedAt: '2026-05-17 16:45',
    status: 'Graded',
    grade: '19/20',
    feedback: 'Excellent ER schema modeling with clear cardinality and entity attributes.',
    studentNotes: 'Completed all problems including the bonus relational mapping questions.'
  },
  {
    submissionId: 102,
    assignmentId: 2,
    studentId: 1008,
    studentName: 'Ananya Roy',
    studentRoll: '22CS1018',
    fileName: 'Ananya_ER_Diagram.pdf',
    fileSize: '2.1 MB',
    submittedAt: '2026-05-18 10:20',
    status: 'Graded',
    grade: '18/20',
    feedback: 'Well organized diagrams and proper foreign key definitions.',
    studentNotes: 'Attached schema diagrams in PDF.'
  },
  {
    submissionId: 103,
    assignmentId: 1,
    studentId: 1008,
    studentName: 'Ananya Roy',
    studentRoll: '22CS1018',
    fileName: 'Hospital_DB_Project_Ananya.zip',
    fileSize: '4.8 MB',
    submittedAt: '2026-05-20 11:15',
    status: 'Submitted',
    grade: null,
    feedback: '',
    studentNotes: 'Includes SQL DDL files and normalized schema document.'
  }
];

// Helper: load assignments from localStorage
const getLocalAssignments = () => {
  try {
    const data = localStorage.getItem('erp_assignments_data');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading assignments from localStorage:', e);
  }
  localStorage.setItem('erp_assignments_data', JSON.stringify(DEFAULT_ASSIGNMENTS));
  return DEFAULT_ASSIGNMENTS;
};

// Helper: save assignments to localStorage
const saveLocalAssignments = (assignments) => {
  try {
    localStorage.setItem('erp_assignments_data', JSON.stringify(assignments));
  } catch (e) {
    console.error('Error saving assignments to localStorage:', e);
  }
};

// Helper: load submissions from localStorage
const getLocalSubmissions = () => {
  try {
    const data = localStorage.getItem('erp_submissions_data');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading submissions from localStorage:', e);
  }
  localStorage.setItem('erp_submissions_data', JSON.stringify(DEFAULT_SUBMISSIONS));
  return DEFAULT_SUBMISSIONS;
};

// Helper: save submissions to localStorage
const saveLocalSubmissions = (submissions) => {
  try {
    localStorage.setItem('erp_submissions_data', JSON.stringify(submissions));
  } catch (e) {
    console.error('Error saving submissions to localStorage:', e);
  }
};

/**
 * Assignment Service Module
 */
const assignmentService = {
  /**
   * Fetch assignments for a faculty member
   * @param {number} facultyId 
   */
  getFacultyAssignments: async (facultyId) => {
    try {
      const response = await API.get(`${ASSIGNMENTS_URL}/faculty`, { params: { facultyId } });
      if (response.data?.success && response.data?.assignments?.length > 0) {
        return response.data.assignments;
      }
    } catch (e) {
      console.warn('Backend assignments API unavailable, using local store:', e);
    }

    const assignments = getLocalAssignments();
    const submissions = getLocalSubmissions();

    return assignments.map((a) => {
      const count = submissions.filter((s) => s.assignmentId === a.id || s.assignmentId === a.assignmentId).length;
      return {
        ...a,
        submissionCount: `${count}/${a.totalStudents || 60}`
      };
    });
  },

  /**
   * Fetch assignments for a student
   * @param {number} studentId 
   * @param {number} departmentId 
   */
  getStudentAssignments: async (studentId = 1007, departmentId = 2) => {
    try {
      const response = await API.get(`${ASSIGNMENTS_URL}/student`, { params: { studentId, departmentId } });
      if (response.data?.success && response.data?.assignments?.length > 0) {
        return response.data.assignments;
      }
    } catch (e) {
      console.warn('Backend student assignments API unavailable, using local store:', e);
    }

    const assignments = getLocalAssignments();
    const submissions = getLocalSubmissions();

    return assignments.map((a) => {
      const sub = submissions.find(
        (s) => (s.assignmentId === a.id || s.assignmentId === a.assignmentId) && s.studentId === studentId
      );

      return {
        ...a,
        status: sub ? sub.status : 'Pending',
        grade: sub ? (sub.grade || 'Under Evaluation') : null,
        feedback: sub ? sub.feedback : '',
        submittedAt: sub ? sub.submittedAt : null,
        submittedFileName: sub ? sub.fileName : null,
        submittedFileSize: sub ? sub.fileSize : null,
        studentNotes: sub ? sub.studentNotes : null,
        submissionId: sub ? sub.submissionId : null
      };
    });
  },

  /**
   * Create a new assignment (Faculty Action)
   * @param {Object} payload 
   */
  createAssignment: async (payload) => {
    try {
      const response = await API.post(`${ASSIGNMENTS_URL}/create`, payload);
      if (response.data?.success) {
        // Also update local cache
        const current = getLocalAssignments();
        current.unshift({
          ...payload,
          id: Date.now(),
          assignmentId: Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
          totalStudents: 60
        });
        saveLocalAssignments(current);
        return response.data;
      }
    } catch (e) {
      console.warn('Backend create assignment unavailable, persisting locally:', e);
    }

    const current = getLocalAssignments();
    const newAssignment = {
      ...payload,
      id: Date.now(),
      assignmentId: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      totalStudents: 60
    };
    current.unshift(newAssignment);
    saveLocalAssignments(current);

    return {
      success: true,
      message: 'Assignment created successfully!',
      assignment: newAssignment
    };
  },

  /**
   * Delete an assignment (Faculty Action)
   * @param {number} assignmentId 
   */
  deleteAssignment: async (assignmentId) => {
    const current = getLocalAssignments().filter((a) => a.id !== assignmentId && a.assignmentId !== assignmentId);
    saveLocalAssignments(current);
    return { success: true, message: 'Assignment removed successfully.' };
  },

  /**
   * Upload / Submit an assignment (Student Action)
   * @param {Object} payload - { assignmentId, studentId, studentName, studentRoll, fileName, fileSize, studentNotes }
   */
  submitAssignment: async (payload) => {
    try {
      const response = await API.post(`${ASSIGNMENTS_URL}/submit`, {
        assignmentId: payload.assignmentId,
        studentId: payload.studentId
      });
      if (response.data?.success) {
        // Update local submission cache
        const submissions = getLocalSubmissions();
        const existingIdx = submissions.findIndex(
          (s) => s.assignmentId === payload.assignmentId && s.studentId === payload.studentId
        );
        const submissionEntry = {
          submissionId: Date.now(),
          ...payload,
          submittedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: 'Submitted',
          grade: null,
          feedback: ''
        };
        if (existingIdx >= 0) {
          submissions[existingIdx] = submissionEntry;
        } else {
          submissions.unshift(submissionEntry);
        }
        saveLocalSubmissions(submissions);
        return response.data;
      }
    } catch (e) {
      console.warn('Backend submit assignment unavailable, storing locally:', e);
    }

    const submissions = getLocalSubmissions();
    const existingIdx = submissions.findIndex(
      (s) => s.assignmentId === payload.assignmentId && s.studentId === payload.studentId
    );
    const submissionEntry = {
      submissionId: Date.now(),
      ...payload,
      submittedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Submitted',
      grade: null,
      feedback: ''
    };

    if (existingIdx >= 0) {
      submissions[existingIdx] = submissionEntry;
    } else {
      submissions.unshift(submissionEntry);
    }
    saveLocalSubmissions(submissions);

    return {
      success: true,
      message: 'Assignment submitted and uploaded successfully!',
      submission: submissionEntry
    };
  },

  /**
   * Fetch submissions for an assignment (Faculty Action)
   * @param {number} assignmentId 
   */
  getSubmissionsForAssignment: async (assignmentId) => {
    const submissions = getLocalSubmissions();
    return submissions.filter((s) => s.assignmentId === assignmentId || s.assignmentId === Number(assignmentId));
  },

  /**
   * Grade a student submission (Faculty Action)
   * @param {number} submissionId 
   * @param {string} grade 
   * @param {string} feedback 
   */
  gradeSubmission: async (submissionId, grade, feedback = '') => {
    try {
      const response = await API.post(`${ASSIGNMENTS_URL}/grade`, { submissionId, grade });
      if (response.data?.success) {
        const submissions = getLocalSubmissions();
        const sub = submissions.find((s) => s.submissionId === submissionId);
        if (sub) {
          sub.grade = grade;
          sub.feedback = feedback;
          sub.status = 'Graded';
          saveLocalSubmissions(submissions);
        }
        return response.data;
      }
    } catch (e) {
      console.warn('Backend grade assignment unavailable, saving locally:', e);
    }

    const submissions = getLocalSubmissions();
    const sub = submissions.find((s) => s.submissionId === submissionId);
    if (sub) {
      sub.grade = grade;
      sub.feedback = feedback;
      sub.status = 'Graded';
      saveLocalSubmissions(submissions);
    }

    return {
      success: true,
      message: 'Submission graded successfully!'
    };
  }
};

export default assignmentService;
