import  { useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * DataTable Component
 *
 * Props:
 * - headers: Array of column header strings (e.g., ['Subject Code', 'Date', 'Status', 'Actions'])
 * - data: Array of data objects
 * - renderRow: Function to render a single <tr> given an item and index
 * - searchPlaceholder: Optional placeholder text for search input
 * - rowsPerPage: Number of rows to show per page (default: 5)
 */
const DataTable = ({
  headers = [],
  data = [],
  renderRow,
  searchPlaceholder = 'Search records...',
  rowsPerPage = 5
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on global search across string values
  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="card border-0 shadow-sm rounded-3 bg-white">
      {/* Table Header Controls (Search Input) */}
      <div className="card-header bg-white border-bottom border-light p-3 d-flex align-items-center justify-content-between">
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text bg-light border-end-0 text-muted">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            className="form-control bg-light border-start-0 text-sm shadow-none"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <span className="text-muted small">
          Showing <strong>{filteredData.length}</strong> entries
        </span>
      </div>

      {/* Table Body */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light border-bottom text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
            <tr>
              {headers.map((head, idx) => (
                <th key={idx} scope="col" className="px-4 py-3 fw-bold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-top-0 text-sm">
            {currentRows.length > 0 ? (
              currentRows.map((item, index) => renderRow(item, index))
            ) : (
              <tr>
                <td colSpan={headers.length || 1} className="text-center py-5 text-muted">
                  <div className="py-3">
                    <p className="mb-0 fw-medium">No matching records found.</p>
                    <span className="small text-muted">Try adjusting your search criteria.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="card-footer bg-white border-top border-light p-3 d-flex align-items-center justify-content-between">
          <span className="text-muted small">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <FiChevronLeft />
              <span>Previous</span>
            </button>
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <span>Next</span>
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;