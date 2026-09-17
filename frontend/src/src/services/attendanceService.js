import API from './api';

const ATTENDANCE_URL = '/attendance';

/**
 * Attendance Service Module
 */
const attendanceService = {
  /**
   * Fetch attendance record for a specific student
   * @param {string} studentId 
   * @param {Object} params - Optional filters e.g. { month, subjectId }
   * @returns {Promise<Object>} Student attendance statistics and history
   */
  getStudentAttendance: async (studentId, params = {}) => {
    try {
      const response = await API.get(`${ATTENDANCE_URL}/student/${studentId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch student list for a specific class section to mark attendance (Faculty view)
   * @param {Object} params - { classId, subjectId, date }
   * @returns {Promise<Array>} List of students with current attendance status
   */
  getClassAttendanceSheet: async (params) => {
    try {
      const response = await API.get(`${ATTENDANCE_URL}/class-sheet`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mark or update daily attendance for a class (Faculty action)
   * @param {Object} payload - { classId, subjectId, date, attendanceRecords: [{ studentId, status }] }
   * @returns {Promise<Object>} Save response
   */
  saveClassAttendance: async (payload) => {
    try {
      const response = await API.post(`${ATTENDANCE_URL}/mark`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch department or college-wide attendance overview (HOD / Principal view)
   * @param {Object} params - Optional filters e.g. { departmentId, semester, month }
   * @returns {Promise<Object>} Aggregated attendance metrics
   */
  getDepartmentAttendanceSummary: async (params = {}) => {
    try {
      const response = await API.get(`${ATTENDANCE_URL}/summary`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export attendance reports as Blob (PDF/Excel)
   * @param {Object} params - Filter criteria for report generation
   * @returns {Promise<Blob>} Binary file download data
   */
  exportAttendanceReport: async (params) => {
    try {
      const response = await API.get(`${ATTENDANCE_URL}/export`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default attendanceService;