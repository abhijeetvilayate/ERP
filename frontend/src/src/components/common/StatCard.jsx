

/**
 * StatCard Component
 * 
 * Props:
 * - title: Label/heading for the statistic (e.g., "Attendance", "Total Students")
 * - value: Numerical or textual value (e.g., "85%", "₹12,500", "5")
 * - subtitle: Optional secondary description or context (e.g., "Fee Due", "Subjects")
 * - icon: React Icon component reference (e.g., FiCheckSquare, FiBookOpen)
 * - color: Color theme for the icon badge ('primary', 'success', 'warning', 'danger', 'info')
 */
const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary' 
}) => {
  
  // Mapping theme colors to soft Bootstrap background/text utilities
  const getColorClasses = (theme) => {
    switch (theme) {
      case 'success':
        return { bg: 'bg-success bg-opacity-10', text: 'text-success' };
      case 'warning':
        return { bg: 'bg-warning bg-opacity-10', text: 'text-warning' };
      case 'danger':
        return { bg: 'bg-danger bg-opacity-10', text: 'text-danger' };
      case 'info':
        return { bg: 'bg-info bg-opacity-10', text: 'text-info' };
      case 'primary':
      default:
        return { bg: 'bg-primary bg-opacity-10', text: 'text-primary' };
    }
  };

  const themeClasses = getColorClasses(color);

  return (
    <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
      <div className="card-body p-3 d-flex align-items-center justify-content-between">
        
        {/* Metric Information */}
        <div>
          <span className="text-muted text-uppercase fw-semibold tracking-wider" style={{ fontSize: '11px' }}>
            {title}
          </span>
          <div className="d-flex align-items-baseline gap-2 mt-1">
            <h3 className="fw-bold mb-0 text-dark">
              {value}
            </h3>
            {subtitle && (
              <span className="text-muted small fw-medium">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Circular Icon Badge */}
        {Icon && (
          <div 
            className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${themeClasses.bg} ${themeClasses.text}`}
            style={{ width: '48px', height: '48px' }}
          >
            <Icon size={22} />
          </div>
        )}

      </div>
    </div>
  );
};

export default StatCard;