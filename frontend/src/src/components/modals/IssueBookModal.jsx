import React, { useState } from 'react';
import { FiBook, FiUser, FiCalendar, FiX } from 'react-icons/fi';

/**
 * IssueBookModal Component
 * 
 * Props:
 * - isOpen: Boolean controlling modal visibility
 * - onClose: Function to handle closing the modal
 * - onSubmit: Callback function receiving book issue transaction payload
 */
const IssueBookModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
    dueDate: ''
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
        await onSubmit({
          bookId: parseInt(formData.bookId, 10),
          userId: parseInt(formData.userId, 10),
          dueDate: formData.dueDate
        });
      }
      // Reset form state on success
      setFormData({
        bookId: '',
        userId: '',
        dueDate: ''
      });
      onClose();
    } catch (error) {
      console.error('Failed to issue book:', error);
    } finally {
      setLoading(false);
    }
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
                <FiBook className="text-primary" />
                <span>Issue Book to Member</span>
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
                
                {/* Book ID Input */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">
                    Book ID / Accession Number <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-secondary border-end-0">
                      <FiBook size={16} />
                    </span>
                    <input
                      type="number"
                      name="bookId"
                      className="form-control text-sm shadow-none border-start-0"
                      placeholder="Enter or scan Book ID"
                      value={formData.bookId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Student / Member ID Input */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">
                    Student / Faculty User ID <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-secondary border-end-0">
                      <FiUser size={16} />
                    </span>
                    <input
                      type="number"
                      name="userId"
                      className="form-control text-sm shadow-none border-start-0"
                      placeholder="Enter Member / PRN ID"
                      value={formData.userId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Due Date Input */}
                <div className="mb-2">
                  <label className="form-label text-secondary small fw-semibold">
                    Due Date for Return <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-secondary border-end-0">
                      <FiCalendar size={16} />
                    </span>
                    <input
                      type="date"
                      name="dueDate"
                      className="form-control text-sm shadow-none border-start-0"
                      value={formData.dueDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
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
                    'Confirm Issue'
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

export default IssueBookModal;