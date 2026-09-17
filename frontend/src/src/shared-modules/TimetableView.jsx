import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiCalendar, FiFilter, FiDownload } from 'react-icons/fi';

const TimetableView = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  // State filters
  const [selectedSemester, setSelectedSemester] = useState('VI Semester');
  const [selectedSection, setSelectedSection] = useState('Div A');

  // Time Slots Column Definition
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:15 - 12:15',
    '01:00 - 02:00'
  ];

  // Weekly Timetable Grid Data for Student View
  const studentSchedule = {
    '09:00 - 10:00': [
      { subject: 'Data Structures', room: 'Room 201' },
      { subject: 'Database Mgmt.', room: 'Room 203' },
      { subject: 'Operating Systems', room: 'Room 204' },
      { subject: 'Web Development', room: 'Lab 3' },
      { subject: 'Computer Networks', room: 'Room 205' },
      { subject: '-' }
    ],
    '10:00 - 11:00': [
      { subject: 'Mathematics', room: 'Room 101' },
      { subject: 'Data Structures', room: 'Room 201' },
      { subject: 'Database Mgmt.', room: 'Room 203' },
      { subject: 'Operating Systems', room: 'Room 204' },
      { subject: 'Web Development', room: 'Lab 3' },
      { subject: '-' }
    ],
    '11:15 - 12:15': [
      { subject: 'Computer Networks', room: 'Room 205' },
      { subject: 'Mathematics', room: 'Room 101' },
      { subject: 'Web Development', room: 'Lab 3' },
      { subject: 'Database Mgmt.', room: 'Room 203' },
      { subject: 'Operating Systems', room: 'Room 204' },
      { subject: '-' }
    ],
    '01:00 - 02:00': [
      { subject: 'Elective - AI', room: 'Room 201' },
      { subject: 'Computer Networks', room: 'Room 205' },
      { subject: 'Mathematics', room: 'Room 101' },
      { subject: 'Elective - AI', room: 'Room 201' },
      { subject: 'Seminar', room: 'Auditorium' },
      { subject: '-' }
    ]
  };

  // Weekly Timetable Grid Data for Faculty View
  const facultySchedule = {
    '09:00 - 10:00': [
      { subject: 'BE Comp - Div A (Data Structures)', room: 'Room 201' },
      { subject: 'BE Comp - Div B (Data Structures)', room: 'Room 202' },
      { subject: 'BE Comp - Div A (Data Structures)', room: 'Room 204' },
      { subject: 'BE Comp - Div B (Data Structures)', room: 'Room 205' },
      { subject: '-' },
      { subject: '-' }
    ],
    '11:15 - 12:15': [
      { subject: 'BE Comp - Div A (Discrete Maths)', room: 'Room 101' },
      { subject: 'BE Comp - Div B (Discrete Maths)', room: 'Room 102' },
      { subject: 'BE Comp - Div A (Discrete Maths)', room: 'Room 103' },
      { subject: 'BE Comp - Div B (Discrete Maths)', room: 'Room 104' },
      { subject: '-' },
      { subject: '-' }
    ],
    '02:00 - 03:00': [
      { subject: 'BE Comp - Div A (DBMS)', room: 'Room 203' },
      { subject: 'BE Comp - Div B (DBMS)', room: 'Room 204' },
      { subject: 'BE Comp - Div A (DBMS)', room: 'Room 204' },
      { subject: 'BE Comp - Div B (DBMS)', room: 'Room 204' },
      { subject: 'Mentoring Session', room: 'Cabin' },
      { subject: '-' }
    ]
  };

  const currentSchedule = role === 'FACULTY' ? facultySchedule : studentSchedule;

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Timetable Main Container */}
        <main className="flex-grow-1 p-4 overflow-auto">
          
          {/* Header & Controls */}
          <div className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bold text-dark mb-1">My Timetable</h4>
              <p className="text-muted small mb-0">
                Weekly lecture, lab, and academic schedule overview.
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm bg-white shadow-none text-xs border-light"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="VI Semester">VI Semester</option>
                <option value="V Semester">V Semester</option>
                <option value="IV Semester">IV Semester</option>
              </select>

              <select
                className="form-select form-select-sm bg-white shadow-none text-xs border-light"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="Div A">Div A</option>
                <option value="Div B">Div B</option>
              </select>

              <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5 text-xs fw-semibold px-3">
                <FiDownload size={14} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Timetable Table Card */}
          <div className="card border-0 shadow-sm rounded-3 bg-white">
            <div className="table-responsive">
              <table className="table table-bordered align-middle mb-0 text-center">
                <thead className="table-light text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  <tr>
                    <th className="py-3 px-3" style={{ width: '130px' }}>
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <FiClock size={13} />
                        <span>Time</span>
                      </div>
                    </th>
                    <th className="py-3 px-3">Monday</th>
                    <th className="py-3 px-3">Tuesday</th>
                    <th className="py-3 px-3">Wednesday</th>
                    <th className="py-3 px-3">Thursday</th>
                    <th className="py-3 px-3">Friday</th>
                    <th className="py-3 px-3">Saturday</th>
                  </tr>
                </thead>
                <tbody className="border-top-0 text-sm">
                  {Object.keys(currentSchedule).map((slot, index) => (
                    <tr key={index}>
                      {/* Time Slot Header */}
                      <td className="fw-bold text-dark bg-light p-3 text-xs align-middle">
                        {slot}
                      </td>

                      {/* Days Column Cells */}
                      {currentSchedule[slot].map((item, dayIdx) => (
                        <td key={dayIdx} className="p-3 align-middle" style={{ minWidth: '130px' }}>
                          {item.subject !== '-' ? (
                            <div className="p-2 bg-primary bg-opacity-10 rounded-2 border border-primary border-opacity-25 h-100 d-flex flex-column justify-content-center">
                              <span className="fw-semibold text-primary d-block text-xs mb-1">
                                {item.subject}
                              </span>
                              <span className="text-muted text-xs">
                                {item.room}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted small">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default TimetableView;