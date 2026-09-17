import { FiLogOut } from 'react-icons/fi';

/**
 * LogoutModal Component
 * 
 * Props:
 * - isOpen: Boolean controlling modal visibility
 * - onClose: Function to handle canceling/closing the modal
 * - onConfirm: Function executed when user confirms session termination
 */
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

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
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 shadow-lg rounded-3 text-center p-4">
            
            {/* Exit Icon Container */}
            <div className="d-flex justify-content-center mb-3">
              <div 
                className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center"
                style={{ width: '64px', height: '64px' }}
              >
                <FiLogOut size={32} />
              </div>
            </div>

            {/* Confirmation Headings */}
            <h5 className="fw-bold text-dark mb-2">Logout</h5>
            <p className="text-muted small mb-4">
              Are you sure you want to logout?
            </p>

            {/* Action Buttons */}
            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-4 fw-medium flex-fill"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm px-4 fw-semibold flex-fill"
                onClick={onConfirm}
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;