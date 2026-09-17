
import { 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaUserTie, 
  FaUniversity, 
  FaRupeeSign, 
  FaBook, 
  FaCogs 
} from 'react-icons/fa';

const ServicesGrid = () => {
  // Portal service cards matching the homepage mockup UI
  const services = [
    {
      title: 'STUDENT',
      description: 'View attendance, timetable, assignments, fees and notifications.',
      icon: FaGraduationCap,
      color: '#0052cc'
    },
    {
      title: 'FACULTY',
      description: 'Take attendance, manage assignments, upload notes and track performance.',
      icon: FaChalkboardTeacher,
      color: '#28a745'
    },
    {
      title: 'HOD',
      description: 'Manage department, faculty, students and generate reports.',
      icon: FaUserTie,
      color: '#fd7e14'
    },
    {
      title: 'PRINCIPAL',
      description: 'View college analytics, reports, approvals and monitor activities.',
      icon: FaUniversity,
      color: '#6f42c1'
    },
    {
      title: 'ACCOUNTS',
      description: 'Manage fees, scholarships, salary, receipts and expenses.',
      icon: FaRupeeSign,
      color: '#d97706'
    },
    {
      title: 'LIBRARY',
      description: 'Manage books, issue/return, fines and maintain records.',
      icon: FaBook,
      color: '#dc3545'
    },
    {
      title: 'ADMIN',
      description: 'Manage users, roles, permissions and system settings.',
      icon: FaCogs,
      color: '#17a2b8'
    }
  ];

  return (
    <section className="py-5 bg-light" id="features">
      <div className="container py-lg-3">
        
        {/* Section Heading */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-uppercase tracking-wider text-dark mb-2">
            Our Services
          </h2>
          <div 
            className="mx-auto rounded" 
            style={{ width: '50px', height: '3px', backgroundColor: '#0052cc' }}
          ></div>
        </div>

        {/* Services Cards Grid */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-7 g-3 justify-content-center">
          {services.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="col d-flex">
                <div className="card border-0 shadow-sm rounded-3 w-100 text-center p-3 hover-shadow transition-all bg-white d-flex flex-column justify-content-between">
                  
                  <div>
                    {/* Icon Container */}
                    <div className="d-flex justify-content-center mb-3 mt-2">
                      <div className="p-2">
                        <IconComponent size={36} style={{ color: item.color }} />
                      </div>
                    </div>

                    {/* Service Role Title */}
                    <h6 className="fw-bold text-uppercase text-dark mb-2" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>
                      {item.title}
                    </h6>

                    {/* Role Description */}
                    <p className="text-muted mb-2" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                      {item.description}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ServicesGrid;