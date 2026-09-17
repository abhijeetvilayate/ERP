import API from './api';

const FEE_URL = '/fees';

/**
 * Fee Service Module
 */
const feeService = {
  /**
   * Fetch fee status and itemized dues for a specific student (Student view)
   * @param {string} studentId 
   * @returns {Promise<Object>} Fee summary and breakdown list
   */
  getStudentFeeStatus: async (studentId) => {
    try {
      const response = await API.get(`${FEE_URL}/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Initiate online fee payment transaction
   * @param {Object} paymentData - { studentId, feeHeadId, amount, paymentMethod }
   * @returns {Promise<Object>} Transaction details / Payment gateway payload
   */
  payFee: async (paymentData) => {
    try {
      const response = await API.post(`${FEE_URL}/pay`, paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch fee collection summaries by department or course (Accounts / HOD / Principal view)
   * @param {Object} params - Optional filters e.g. { courseId, academicYear }
   * @returns {Promise<Array>} Course-wise expected vs collected fee stats
   */
  getFeeCollectionOverview: async (params = {}) => {
    try {
      const response = await API.get(`${FEE_URL}/overview`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch fee defaulters list
   * @param {Object} params - Optional filters e.g. { courseId, minPendingAmount }
   * @returns {Promise<Array>} List of students with pending fee dues
   */
  getDefaultersList: async (params = {}) => {
    try {
      const response = await API.get(`${FEE_URL}/defaulters`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send fee reminder notifications to students/parents (Accounts action)
   * @param {Object} payload - { studentIds: [], reminderType: 'SMS' | 'EMAIL' }
   * @returns {Promise<Object>} Status response
   */
  sendFeeReminders: async (payload) => {
    try {
      const response = await API.post(`${FEE_URL}/send-reminders`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download fee payment receipt PDF
   * @param {string} transactionId 
   * @returns {Promise<Blob>} Binary PDF file response
   */
  downloadReceipt: async (transactionId) => {
    try {
      const response = await API.get(`${FEE_URL}/receipt/${transactionId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default feeService;