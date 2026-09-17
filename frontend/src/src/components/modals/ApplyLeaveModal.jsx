import  { useState } from 'react';
import { FiX, FiCalendar, FiFileText } from 'react-icons/fi';

/**
 * ApplyLeaveModal Component
 * 
 * Props:
 * - isOpen: Boolean controlling modal visibility
 * - onClose: Function to handle closing the modal
 * - onSubmit: Callback function receiving leave request payload
 */
const ApplyLeaveModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      // Reset form on success
      setFormData({
        leaveType: 'Casual Leave',
        fromDate: '',
        toDate: '',
        reason: ''
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit leave request:', error);
    } finally {
      setLoading(false);
    }
  };

  const { user } = useAuth();
  const role = (user?.role || 'STUDENT').toUpperCase();

  const getTargetAuthority = () => {
    if (role === 'STUDENT') return 'Faculty / Class Advisor';
    if (role === 'FACULTY') return 'Head of Department (HOD)';
    return 'Principal & Director';
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ backgroundColor: 'rgba(11, 25, 44, 0.6)', zIndex: 1040 }}
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        role="dialog" 
        aria-hidden="false"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-3">
            
            {/* Modal Header */}
            <div className="modal-header border-bottom border-light px-4 py-3 bg-light rounded-top-3">
              <h5 className="modal-title fw-bold text-dark fs-6 mb-0 d-flex align-items-center gap-2">
                <FiCalendar className="text-primary" />
                <span>Apply for Leave</span>
              </h5>
              <button 
                type="button" 
                className="btn-close shadow-none" 
                aria-label="Close" 
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                
                {/* Routing Notice */}
                <div className="alert alert-primary bg-primary bg-opacity-10 border-0 rounded-3 py-2.5 px-3 mb-3 d-flex align-items-center gap-2 text-xs text-primary">
                  <FiFileText size={16} className="flex-shrink-0" />
                  <span>
                    This leave request will be routed directly to your <strong>{getTargetAuthority()}</strong> for review.
                  </span>
                </div>

                {/* Leave Type Select */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <select
                    name="leaveType"
                    className="form-select text-sm shadow-none"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Medical Leave">Medical Leave</option>
                    <option value="Duty Leave">Duty Leave</option>
                    <option value="Staff Leave">Staff Leave</option>
                    <option value="On Duty">On Duty</option>
                  </select>
                </div>

                {/* Date Range Inputs */}
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label text-secondary small fw-semibold">
                      From Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      name="fromDate"
                      className="form-control text-sm shadow-none"
                      value={formData.fromDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label text-secondary small fw-semibold">
                      To Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      name="toDate"
                      className="form-control text-sm shadow-none"
                      value={formData.toDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Reason Textarea */}
                <div className="mb-2">
                  <label className="form-label text-secondary small fw-semibold">
                    Reason for Leave <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="reason"
                    rows="3"
                    className="form-control text-sm shadow-none"
                    placeholder="Provide a short description (e.g. Family Function, Fever, Personal Work...)"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="modal-footer border-top border-light px-4 py-3 bg-light rounded-bottom-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary text-sm fw-medium px-4"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-sm fw-semibold px-4"
                  style={{ backgroundColor: '#0052cc', borderColor: '#0052cc' }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyLeaveModal;