import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Suppress header and footer on Page 1 (Cover Page)
        if self._pageNumber > 1:
            # Top Header
            self.drawString(54, 750, "COLLEGE ERP SYSTEM — COMPLETE ARCHITECTURE, FILE REGISTRY & INTERVIEW GUIDE")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(54, 742, 558, 742)
            
            # Bottom Footer
            self.setFont("Helvetica", 8)
            self.drawString(54, 36, "College ERP System • Confidential Technical Documentation & Project Defense Guide")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(558, 36, page_text)
            self.line(54, 48, 558, 48)
            
        self.restoreState()

def create_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#0F172A")    # Dark slate
    c_secondary = colors.HexColor("#1D4ED8")  # Vibrant Navy/Blue
    c_accent = colors.HexColor("#0284C7")     # Sky Blue
    c_body = colors.HexColor("#334155")       # Slate body
    c_q_bg = colors.HexColor("#F0F9FF")       # Light blue callout bg
    c_q_border = colors.HexColor("#0284C7")   # Callout border
    
    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=c_primary,
        alignment=0,
        spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=c_secondary,
        alignment=0,
        spaceAfter=20
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_secondary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'SectionH3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_body,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_body,
        leftIndent=15,
        spaceAfter=4
    )

    q_style = ParagraphStyle(
        'QuestionStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1E3A8A"),
        spaceAfter=4
    )

    a_style = ParagraphStyle(
        'AnswerStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.2,
        leading=13.5,
        textColor=c_body,
        spaceAfter=6
    )

    tbl_header_style = ParagraphStyle(
        'TblHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    tbl_cell_style = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=c_body
    )

    tbl_code_style = ParagraphStyle(
        'TblCode',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0F172A")
    )

    story = []
    
    # ---------------------------------------------------------
    # COVER / HEADER
    # ---------------------------------------------------------
    story.append(Spacer(1, 15))
    story.append(Paragraph("COLLEGE ERP SYSTEM", title_style))
    story.append(Paragraph("Complete Project Overview, Comprehensive File-by-File Registry & Technical Interview Preparation Guide", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=3, color=c_secondary, spaceBefore=0, spaceAfter=15))
    
    metadata_text = """
    <b>Document Metadata & Project Scope:</b><br/>
    • <b>Application Type:</b> Full-Stack College Enterprise Resource Planning (ERP) System<br/>
    • <b>Architecture:</b> Decoupled Single Page Application (SPA) + RESTful Servlet Backend + Relational RDBMS<br/>
    • <b>Technology Stack:</b> React 18, Vite, Context API, Java Servlets (Jakarta EE), Maven, Oracle SQL & PL/SQL<br/>
    • <b>User Role Scope:</b> 7 Role-Based User Portals (Admin, Student, Faculty, HOD, Accounts, Library, Principal)<br/>
    • <b>Target Audience:</b> Software Engineers, System Architects, Technical Evaluators, Viva / Technical Interview Candidates
    """
    story.append(Paragraph(metadata_text, body_style))
    story.append(Spacer(1, 15))
    
    # ---------------------------------------------------------
    # SECTION 1: PROJECT OVERVIEW & SYSTEM ARCHITECTURAL DESIGN
    # ---------------------------------------------------------
    story.append(Paragraph("SECTION 1: Project Overview & System Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=2, spaceAfter=10))
    
    story.append(Paragraph("1.1 Executive System Overview", h2_style))
    p1 = """
    The <b>College ERP System</b> is a comprehensive, multi-tenant academic management platform designed to automate, streamline, and centralize administrative, academic, financial, and operational tasks for higher education institutions. The system bridges communication and workflow bottlenecks between administrators, department heads, faculty members, students, finance officers, librarians, and executive leadership.
    """
    story.append(Paragraph(p1, body_style))
    
    story.append(Paragraph("1.2 Core Architectural Principles & Tech Stack", h2_style))
    p2 = """
    The ERP is engineered using a clean, 3-tier decoupled architecture:
    """
    story.append(Paragraph(p2, body_style))
    
    tech_stack_data = [
        [Paragraph("Tier", tbl_header_style), Paragraph("Technology Stack", tbl_header_style), Paragraph("Key Responsibilities & Components", tbl_header_style)],
        [
            Paragraph("<b>Presentation Tier (Frontend)</b>", tbl_cell_style),
            Paragraph("React 18, Vite, Axios, React Router v6, Lucide React, Pure CSS3 Design System", tbl_cell_style),
            Paragraph("Single Page Application (SPA) delivering 7 role-based dynamic dashboards, client-side routing, state management via React Context API, token interception via Axios, and responsive modular components.", tbl_cell_style)
        ],
        [
            Paragraph("<b>Application Tier (Backend)</b>", tbl_cell_style),
            Paragraph("Java 17, Java Servlets (Jakarta EE), Apache Maven, jBCrypt, org.json, CORS Filter", tbl_cell_style),
            Paragraph("RESTful Web API powered by lightweight Java Servlets handling HTTP requests, BCrypt security hashing, session validation, request filtering (CORS), and business logic routing via DAO pattern.", tbl_cell_style)
        ],
        [
            Paragraph("<b>Data Tier (Database)</b>", tbl_cell_style),
            Paragraph("Oracle Database 19c/21c, Oracle JDBC (ojdbc8), PL/SQL Stored Procedures, Sequences", tbl_cell_style),
            Paragraph("Enterprise SQL database managing normalized relational tables (`USERS`, `STUDENTS`, `FEES`, etc.), Oracle sequences for auto-generating IDs, and PL/SQL procedures for complex atomic transactions.", tbl_cell_style)
        ]
    ]
    
    t_stack = Table(tech_stack_data, colWidths=[1.5*inch, 2.0*inch, 3.5*inch])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_stack)
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("1.3 Role-Based Access Control (RBAC) & 7 User Portals", h2_style))
    rbac_desc = """
    Security and privacy are enforced at both frontend (Route Guards) and backend (Servlet Filters & DAO checks) levels. The 7 roles and their responsibilities include:
    """
    story.append(Paragraph(rbac_desc, body_style))
    
    roles = [
        "<b>1. Administrator (Admin):</b> System-wide management, creating/editing user accounts, role assignments, system status monitoring, configuration.",
        "<b>2. Student:</b> Personal dashboard, tracking attendance percentages, viewing subject syllabus, downloading/submitting assignments, checking fee status, paying fees online, browsing library books, applying for leaves.",
        "<b>3. Faculty / Teacher:</b> Managing assigned courses, marking student attendance per subject session, creating assignments, evaluating and grading submissions, viewing class timetables.",
        "<b>4. Head of Department (HOD):</b> Overseeing department performance, monitoring faculty & student attendance, approving/rejecting leave applications, assigning subjects to faculty.",
        "<b>5. Accounts Officer:</b> Defining fee structures, recording offline & online payments, issuing payment receipts, tracking overdue fees, generating financial reports.",
        "<b>6. Librarian:</b> Managing book catalog (adding/editing books), processing book issuance and return transactions, calculating overdue fines, maintaining library logs.",
        "<b>7. Principal / Director:</b> Executive dashboard view with college-wide analytics, department performance comparison, broadcast announcements, institutional notices."
    ]
    for r in roles:
        story.append(Paragraph(f"• {r}", bullet_style))
    
    story.append(Spacer(1, 14))
    
    # ---------------------------------------------------------
    # SECTION 2: COMPLETE FILE-BY-FILE PROJECT REGISTRY
    # ---------------------------------------------------------
    story.append(PageBreak())
    story.append(Paragraph("SECTION 2: Complete Project File Registry", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=2, spaceAfter=10))
    
    story.append(Paragraph("Below is a detailed inventory and description of all <b>86 source files</b> across Database, Backend, and Frontend modules.", body_style))
    story.append(Spacer(1, 8))
    
    file_registry = [
        # Database Files
        ("database/schema.sql", "Database DDL script creating normalized Oracle DB tables (`USERS`, `ROLES`, `STUDENTS`, `FACULTY`, `COURSES`, `SUBJECTS`, `ATTENDANCE`, `ASSIGNMENTS`, `SUBMISSIONS`, `FEES`, `FEE_PAYMENTS`, `BOOKS`, `BOOK_TRANSACTIONS`, `LEAVE_REQUESTS`, `NOTICES`) with PK/FK constraints."),
        ("database/sequences.sql", "Database DDL script defining Oracle sequences (`user_seq`, `course_seq`, `assignment_seq`, etc.) to generate auto-incrementing primary key IDs."),
        ("database/procedures.sql", "PL/SQL stored procedures defining backend transaction logic (e.g. attendance percentage calculation, fee payment recording, book issuing validation)."),
        ("database/seed_data.sql", "Database DML script populating initial seed data, including default Admin/Faculty/Student accounts, standard course structures, and sample books."),
        
        # Backend Config & Util
        ("backend/pom.xml", "Apache Maven build configuration file defining Java 17 compatibility, WAR packaging, dependencies (`ojdbc8`, `json`, `jbcrypt`, `javax.servlet-api`)."),
        ("backend/package-lock.json", "Npm package lock file for backend auxiliary scripts/tooling."),
        ("backend/src/main/webapp/WEB-INF/web.xml", "Java EE Web Application Deployment Descriptor mapping Servlets, CORS filters, URL patterns, and session timeouts."),
        ("backend/src/main/webapp/index.jsp", "Root JavaServer Page serving as backend HTTP welcome landing test page."),
        ("backend/src/main/java/com/collegeerp/config/CORSFilter.java", "Servlet Filter implementation intercepting incoming HTTP requests to append CORS headers (`Access-Control-Allow-Origin`, `Methods`, `Headers`)."),
        ("backend/src/main/java/com/collegeerp/config/DBConnection.java", "Singleton JDBC Database Connection factory managing Oracle database connection strings, credentials, and connection instantiation."),
        ("backend/src/main/java/com/collegeerp/util/JSONResponse.java", "Utility class standardizing HTTP JSON response formatting, success/error payloads, and HTTP status code wrappers."),
        ("backend/src/main/java/com/collegeerp/util/PasswordUtil.java", "Security utility class wrapping `jbcrypt` for hashing plain-text passwords and verifying hashed credentials."),
        
        # Backend Models
        ("backend/src/main/java/com/collegeerp/model/User.java", "Java POJO domain model representing user entity (id, username, email, passwordHash, role, department, full name)."),
        ("backend/src/main/java/com/collegeerp/model/Assignment.java", "Java POJO domain model representing assignment metadata (id, subjectId, title, description, dueDate, createdBy)."),
        ("backend/src/main/java/com/collegeerp/model/Attendance.java", "Java POJO domain model representing attendance entries (id, studentId, subjectId, date, status, markedBy)."),
        ("backend/src/main/java/com/collegeerp/model/Book.java", "Java POJO domain model representing library books (id, title, author, isbn, category, copies count)."),
        ("backend/src/main/java/com/collegeerp/model/BookTransaction.java", "Java POJO domain model representing book issue/return activity, issue dates, due dates, fine amounts."),
        ("backend/src/main/java/com/collegeerp/model/Fee.java", "Java POJO domain model representing fee breakdown structures and student financial status."),
        ("backend/src/main/java/com/collegeerp/model/FeeRecord.java", "Java POJO domain model representing detailed fee billing entries and ledger lines."),
        ("backend/src/main/java/com/collegeerp/model/Payment.java", "Java POJO domain model representing individual payment transaction receipts and payment mode details."),
        
        # Backend DAOs
        ("backend/src/main/java/com/collegeerp/dao/UserDAO.java", "Data Access Object executing SQL for user authentication, registration, profile retrieval, user listing, and role updates."),
        ("backend/src/main/java/com/collegeerp/dao/AssignmentDAO.java", "Data Access Object executing SQL for creating, fetching, submitting, and grading student assignments."),
        ("backend/src/main/java/com/collegeerp/dao/AttendanceDAO.java", "Data Access Object executing SQL queries for marking student attendance, fetching student logs, and computing percentage stats."),
        ("backend/src/main/java/com/collegeerp/dao/FeeDAO.java", "Data Access Object executing SQL queries for retrieving fee balances, logging payment transactions, and generating receipts."),
        ("backend/src/main/java/com/collegeerp/dao/LibraryDAO.java", "Data Access Object executing SQL queries for catalog search, book issue/return status updates, and tracking fines."),
        
        # Backend Servlets
        ("backend/src/main/java/com/collegeerp/controller/AuthServlet.java", "Java Servlet controller handling `/api/auth/*` routes (login, register, session verification, logout)."),
        ("backend/src/main/java/com/collegeerp/controller/AssignmentServlet.java", "Java Servlet controller handling `/api/assignments/*` routes for assignment creation and student submission uploads."),
        ("backend/src/main/java/com/collegeerp/controller/AttendanceServlet.java", "Java Servlet controller handling `/api/attendance/*` routes for batch marking and fetching student attendance records."),
        ("backend/src/main/java/com/collegeerp/controller/FeeServlet.java", "Java Servlet controller handling `/api/fee/*` routes for fetching fee breakdowns, processing payments, fetching transaction receipts."),
        ("backend/src/main/java/com/collegeerp/controller/LibraryServlet.java", "Java Servlet controller handling `/api/library/*` routes for searching catalog, issuing books, returning books, computing fines."),
        
        # Frontend Config & Entry
        ("frontend/package.json", "Frontend npm project manifest defining dependencies (`react`, `react-router-dom`, `axios`, `lucide-react`) and build scripts."),
        ("frontend/package-lock.json", "Frontend npm lock file ensuring deterministic dependency tree resolution."),
        ("frontend/vite.config.js", "Vite build tool configuration, setting up React plugin, dev server port, proxy paths to Java backend."),
        ("frontend/eslint.config.js", "ESLint configuration file enforcing Javascript syntax rules and standard React lint rules."),
        ("frontend/index.html", "Main HTML template for React SPA containing HTML5 container, Google Fonts preconnect, `<div id='root'>`."),
        ("frontend/.gitignore", "Git configuration file specifying build artifacts (`dist`, `node_modules`) ignored from source control."),
        ("frontend/README.md", "Frontend documentation guide detailing setup, execution scripts, and directory layout."),
        ("frontend/src/main.jsx", "React SPA entry point rendering the root `<App />` component into DOM inside `React.StrictMode`."),
        ("frontend/src/App.jsx", "Main application wrapper configuring routing with `<AppRoutes />` inside global `<AuthProvider>`."),
        ("frontend/src/App.css", "Application-level stylesheet defining global layout rules, scrollbar styling, utility classes."),
        ("frontend/src/index.css", "Base global CSS stylesheet resetting default browser margins, typography settings, box-sizing."),
        ("frontend/src/src/assets/index.css", "Design system stylesheet specifying Tailwind/custom global CSS variables and base element styles."),
        ("frontend/src/src/assets/theme.css", "Theme stylesheet defining color palette tokens, dark mode variables, glassmorphism CSS helper classes."),
        
        # Frontend Context & Routes
        ("frontend/src/src/context/AuthContext.jsx", "React Context provider managing global authentication state (`user`, `token`, `role`), exposing `login()` & `logout()` helpers."),
        ("frontend/src/src/routes/AppRoutes.jsx", "Main application router mapping path URLs (`/`, `/login`, `/dashboard/*`) to respective view components."),
        ("frontend/src/src/routes/ProtectedRoute.jsx", "Route guard Higher-Order Component restricting route access based on user authentication status and allowed roles."),
        
        # Frontend Services
        ("frontend/src/src/services/api.js", "Centralized Axios client instance configured with base backend API URL, request authorization interceptor, and 401 error handler."),
        ("frontend/src/src/services/authService.js", "Frontend service module wrapping authentication API calls (`login`, `register`, `getCurrentUser`, `getUsers`)."),
        ("frontend/src/src/services/assignmentService.js", "Frontend service module handling assignment API calls (`getAssignments`, `createAssignment`, `submitAssignment`)."),
        ("frontend/src/src/services/attendanceService.js", "Frontend service module handling attendance API calls (`getAttendance`, `markAttendance`, `getStudentStats`)."),
        ("frontend/src/src/services/feeService.js", "Frontend service module handling fee API calls (`getFeeStatus`, `makePayment`, `getPaymentHistory`)."),
        
        # Frontend Common Components
        ("frontend/src/src/components/common/DataTable.jsx", "Reusable dynamic data table component supporting client-side searching, sorting, pagination, and custom column renderers."),
        ("frontend/src/src/components/common/Footer.jsx", "Global page footer component containing quick links, copyright notice, contact links, institutional branding."),
        ("frontend/src/src/components/common/Navbar.jsx", "Global header navigation bar rendering user avatar, role badge, quick notifications, mobile drawer toggle."),
        ("frontend/src/src/components/common/Sidebar.jsx", "Role-aware lateral navigation sidebar dynamically rendering navigation menu items tailored to user's assigned role."),
        ("frontend/src/src/components/common/StatCard.jsx", "Dashboard stat card widget displaying key performance indicators (KPIs), metrics, icons, and trend indicators."),
        
        # Frontend Modals
        ("frontend/src/src/components/modals/ApplyLeaveModal.jsx", "Interactive modal dialog allowing students/faculty to compose and submit leave requests with date range and reason."),
        ("frontend/src/src/components/modals/IssueBookModal.jsx", "Interactive modal dialog enabling librarians to search student accounts and issue cataloged books."),
        ("frontend/src/src/components/modals/LogoutModal.jsx", "Confirmation modal dialog prompting users to confirm sign-out before clearing session context."),
        
        # Frontend Public Views & Components
        ("frontend/src/src/components/public/ContactForm.jsx", "Public contact form component with client-side validation, submit handler, and success feedback message."),
        ("frontend/src/src/components/public/HeroSection.jsx", "Landing page hero banner component showcasing call-to-action buttons, tagline, and animated background elements."),
        ("frontend/src/src/components/public/ServicesGrid.jsx", "Landing page grid component highlighting key ERP features (Attendance, Fees, Library, Analytics)."),
        ("frontend/src/src/views/public/Home.jsx", "Public landing home page aggregating `HeroSection`, `ServicesGrid`, and `ContactForm` components."),
        ("frontend/src/src/views/public/About.jsx", "Public About Us view detailing college ERP background, mission statement, and platform benefits."),
        ("frontend/src/src/views/public/Contact.jsx", "Public Contact page rendering contact details, campus address, map view, and inquiry form."),
        ("frontend/src/src/views/public/Features.jsx", "Public Features showcase page giving prospective users an interactive breakdown of system capabilities."),
        ("frontend/src/src/views/auth/Login.jsx", "Authentication login view rendering credential form, role selection dropdown, error alert, and submit handlers."),
        ("frontend/src/src/views/auth/Register.jsx", "Registration view enabling new users to create accounts with input validation and role selection."),
        
        # Role Dashboards
        ("frontend/src/src/views/admin/AdminDashboard.jsx", "Central management dashboard for System Administrators with user stats, activity logs, quick action shortcuts."),
        ("frontend/src/src/views/admin/UserManagementView.jsx", "Admin module view for searching, creating, editing, role updating, and suspending system users."),
        ("frontend/src/src/views/student/StudentDashboard.jsx", "Student portal landing view displaying attendance overview, upcoming deadlines, recent grades, quick links."),
        ("frontend/src/src/views/faculty/FacultyDashboard.jsx", "Faculty portal landing view displaying assigned classes, pending assignment grading, today's lecture schedule."),
        ("frontend/src/src/views/hod/HodDashboard.jsx", "Head of Department dashboard displaying department-wide metrics, faculty status, pending leave approvals."),
        ("frontend/src/src/views/accounts/AccountsDashboard.jsx", "Accounts portal displaying overall fee collections, pending student dues, daily transaction logs."),
        ("frontend/src/src/views/library/LibraryDashboard.jsx", "Librarian dashboard displaying total books cataloged, active issued books, overdue books count, fines collected."),
        ("frontend/src/src/views/principal/PrincipalDashboard.jsx", "Executive Principal view featuring institutional high-level KPIs, department comparison graphs, notice board management."),
        
        # Shared Modules
        ("frontend/src/src/shared-modules/AssignmentsView.jsx", "Shared view module for browsing assignments, submitting coursework files, viewing evaluated marks and feedback."),
        ("frontend/src/src/shared-modules/AttendanceView.jsx", "Shared view module for inspecting detailed subject-wise attendance logs, monthly breakdown, percentage progress bars."),
        ("frontend/src/src/shared-modules/FeeStatusView.jsx", "Shared view module displaying tuition fee itemization, payment history table, and online payment button integration."),
        ("frontend/src/src/shared-modules/LeaveRequestsView.jsx", "Shared view module for submitting leave applications and viewing approval/rejection status from HOD/Admin."),
        ("frontend/src/src/shared-modules/LibraryView.jsx", "Shared view module for searching the library book catalog, checking book availability, viewing borrowed books history."),
        ("frontend/src/src/shared-modules/NoticesView.jsx", "Shared notice board view rendering institutional news, exam announcements, holiday circulars."),
        ("frontend/src/src/shared-modules/ProfileView.jsx", "Shared user profile view allowing users to view and update personal contact info, profile photo, and password."),
        ("frontend/src/src/shared-modules/SubjectsView.jsx", "Shared academic module displaying list of registered subjects, assigned course teachers, syllabus details."),
        ("frontend/src/src/shared-modules/TimetableView.jsx", "Shared timetable module visualizing weekly class schedules, lecture timings, classroom/lab room allocations."),
        
        # Root Config Files
        ("package-lock.json", "Root project lockfile ensuring consistent lock states across workspace root."),
        ("College_ERP_Project_Layout.pdf", "Existing reference PDF document outlining high-level layout of the ERP application.")
    ]
    
    reg_table_data = [[Paragraph("File Path", tbl_header_style), Paragraph("Description & Project Functionality", tbl_header_style)]]
    for path, desc in file_registry:
        reg_table_data.append([
            Paragraph(path, tbl_code_style),
            Paragraph(desc, tbl_cell_style)
        ])
    
    t_reg = Table(reg_table_data, colWidths=[2.6*inch, 4.4*inch])
    t_reg.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    
    story.append(t_reg)
    story.append(Spacer(1, 14))
    
    # ---------------------------------------------------------
    # SECTION 3: COMPREHENSIVE TECHNICAL INTERVIEW Q&A
    # ---------------------------------------------------------
    story.append(PageBreak())
    story.append(Paragraph("SECTION 3: Comprehensive Technical Interview Questions & Answers", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=2, spaceAfter=10))
    
    story.append(Paragraph("This section provides <b>40 in-depth technical interview questions and answers</b> tailored specifically to this College ERP project stack, architecture, database design, security implementation, and frontend engineering.", body_style))
    story.append(Spacer(1, 8))
    
    def add_qa_block(q_num, category, question, answer):
        q_text = f"Q{q_num} [{category}]: {question}"
        a_text = f"<b>Answer:</b> {answer}"
        
        block = [
            Paragraph(q_text, q_style),
            Paragraph(a_text, a_style),
            Spacer(1, 4)
        ]
        story.append(KeepTogether(block))

    # --- CATEGORY A: JAVA SERVLETS & BACKEND ARCHITECTURE ---
    story.append(Paragraph("3.1 Java Servlets, REST API & Backend Architecture", h2_style))
    
    add_qa_block(1, "Backend", 
        "Why did you choose lightweight Java Servlets instead of Spring Boot for this ERP backend?",
        "Choosing raw Java Servlets (Jakarta EE) provides explicit control over the HTTP request/response lifecycle without the implicit overhead, autoconfiguration magic, or heavy startup memory footprint of Spring Boot. It demonstrates a foundational understanding of core Java Enterprise concepts, low-level Servlet filters (`CORSFilter.java`), manual routing, raw JDBC connectivity, and lightweight WAR deployment targeting standard application servers like Apache Tomcat."
    )
    
    add_qa_block(2, "Backend", 
        "How does the Java Servlet lifecycle handle multi-threaded concurrent user requests in AuthServlet?",
        "When the Servlet container (e.g. Tomcat) starts or receives a request for `AuthServlet`, it instantiates a single instance of the Servlet and invokes its `init()` method. For each incoming client HTTP request, the container allocates a worker thread from its thread pool and calls `service()`, which delegates to `doGet()` or `doPost()`. Because a single Servlet instance handles concurrent threads, instance variables must be avoided to ensure thread safety. Shared resources like database connections are safely checked out per request using stateless DAO objects."
    )

    add_qa_block(3, "Backend", 
        "Explain how CORS (Cross-Origin Resource Sharing) is configured in CORSFilter.java.",
        "Since the React frontend runs on Vite (e.g. `http://localhost:5173`) and the Java backend runs on Tomcat (e.g. `http://localhost:8080`), browsers block cross-origin requests by default due to Same-Origin Policy (SOP). `CORSFilter.java` implements `javax.servlet.Filter` and intercepts every incoming request. It appends HTTP headers: `Access-Control-Allow-Origin: *` (or specific origin), `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`, and `Access-Control-Allow-Headers: Content-Type, Authorization`. It also handles pre-flight `OPTIONS` requests by returning an HTTP 200 OK immediately."
    )

    add_qa_block(4, "Backend", 
        "How is user password security implemented in PasswordUtil.java?",
        "Password security utilizes BCrypt hashing via `jBCrypt` library. When a user registers or an admin creates an account, `PasswordUtil.hashPassword(plainText)` generates a salted BCrypt hash with a configurable work factor (cost factor, typically 10-12 iterations). Plain-text passwords are never stored in the database. During login, `PasswordUtil.checkPassword(plainText, storedHash)` verifies the password securely against timing attacks."
    )

    add_qa_block(5, "Backend", 
        "What is the Data Access Object (DAO) pattern used in this project?",
        "The DAO pattern encapsulates and hides all database interaction details from the Servlet controller layer. For instance, `UserDAO.java` exposes clean Java methods like `authenticateUser(username, password)` and `getUserById(id)` without exposing SQL strings or JDBC `ResultSet` parsing to `AuthServlet.java`. This decouples business logic from persistence logic, making the code testable and maintainable."
    )

    add_qa_block(6, "Backend", 
        "How does DBConnection.java manage database connections, and how could connection pooling improve it?",
        "`DBConnection.java` provides a centralized factory method `getConnection()` using `DriverManager.getConnection()` with Oracle JDBC driver (`ojdbc8`). While functional, opening and closing physical database TCP connections per request introduces latency. Implementing a Connection Pool (such as HikariCP or Apache Commons DBCP) reuses pre-established database connections from a pool, significantly reducing connection overhead and boosting throughput under high concurrency."
    )

    add_qa_block(7, "Backend", 
        "How do you prevent SQL Injection vulnerabilities in your Java DAO classes?",
        "All database queries in DAO classes (`UserDAO`, `AttendanceDAO`, `FeeDAO`, etc.) strictly utilize `PreparedStatement` instead of string concatenation. Placeholders (`?`) are used for dynamic parameters, allowing the database driver to compile and sanitize inputs prior to execution, completely neutralizing SQL injection risks."
    )

    add_qa_block(8, "Backend", 
        "How does JSONResponse.java standardize API responses sent back to React?",
        "`JSONResponse.java` wraps the response writing logic using `org.json.JSONObject`. It sets `response.setContentType(\"application/json\")` and `response.setCharacterEncoding(\"UTF-8\")`. It formats standardized response objects containing `status` (success/error), `message`, and `data` payloads, ensuring the React frontend receives predictable, uniform JSON across all endpoints."
    )

    add_qa_block(9, "Backend", 
        "How are unhandled backend exceptions caught and returned to the client?",
        "Exceptions inside Servlet methods are wrapped in `try-catch` blocks. When a `SQLException` or `ClassNotFoundException` occurs, it is logged to standard server error logs, and `JSONResponse.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, \"Internal Server Error\")` is invoked. This prevents raw database stack traces from leaking to the frontend."
    )

    add_qa_block(10, "Backend", 
        "Explain session management and authentication verification between Servlets and React.",
        "Upon successful authentication in `AuthServlet`, a session token or authenticated user payload is generated and returned to the client. The frontend stores this token (in localStorage or state) and includes it in the `Authorization` HTTP header for subsequent requests. Servlets check the header or session attributes to grant or deny access to protected endpoints."
    )

    # --- CATEGORY B: ORACLE DATABASE, SQL & PL/SQL ---
    story.append(Spacer(1, 6))
    story.append(Paragraph("3.2 Oracle SQL, Database Schema & PL/SQL", h2_style))

    add_qa_block(11, "Database", 
        "Explain the Entity-Relationship (ER) structure and normalized table design of this ERP system.",
        "The schema in `schema.sql` is normalized up to 3NF. The central table `USERS` stores login credentials and role references. `STUDENTS` and `FACULTY` maintain 1-to-1 extension relationships with `USERS`. `COURSES` and `SUBJECTS` maintain 1-to-Many relationships with `STUDENTS` and `FACULTY`. Transactional tables like `ATTENDANCE`, `ASSIGNMENTS`, `FEE_PAYMENTS`, and `BOOK_TRANSACTIONS` reference student and faculty primary keys via Foreign Keys with referential integrity constraints."
    )

    add_qa_block(12, "Database", 
        "Why are Oracle Sequences used in sequences.sql instead of identity columns?",
        "In Oracle Database (especially prior to Oracle 12c or for explicit sequence control), Oracle Sequences like `user_seq` generate unique, non-colliding numeric IDs independently of table inserts. Sequences allow pre-fetching next values (`user_seq.NEXTVAL`) within stored procedures or Java code, facilitating complex multi-table inserts within a single transaction."
    )

    add_qa_block(13, "Database", 
        "What PL/SQL Stored Procedures are defined in procedures.sql and what are their advantages?",
        "`procedures.sql` contains compiled PL/SQL stored procedures for complex multi-step operations like attendance percentage compilation, fee receipt ledger updates, and book issuance checks. Executing logic inside Oracle PL/SQL reduces network roundtrips between Java and the Database, speeds up batch execution, and ensures atomic database-level transactions."
    )

    add_qa_block(14, "Database", 
        "How is attendance data stored and queried to compute student attendance percentages?",
        "Each attendance entry in `ATTENDANCE` records `student_id`, `subject_id`, `attendance_date`, and `status` ('PRESENT' or 'ABSENT'). To calculate a student's percentage for a subject, SQL queries aggregate count: `(COUNT(CASE WHEN status='PRESENT' THEN 1 END) * 100.0 / COUNT(*))`. Indexes on `(student_id, subject_id)` optimize calculation performance."
    )

    add_qa_block(15, "Database", 
        "How do you prevent race conditions when two students attempt to borrow the last remaining copy of a library book simultaneously?",
        "In `LibraryDAO.java` and PL/SQL procedures, book issuance uses explicit row locking: `SELECT available_copies FROM BOOKS WHERE book_id = ? FOR UPDATE;`. This locks the target book row until the transaction completes. If `available_copies > 0`, the copy count is decremented and transaction logged; otherwise, the transaction rolls back, preventing double-issuance."
    )

    add_qa_block(16, "Database", 
        "How are Foreign Key CASCADE constraints configured in schema.sql?",
        "Foreign key constraints enforce referential integrity. For instance, `CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE` ensures that if a user account is deleted, associated student profiles or logs are cleanly purged or restricted according to institutional compliance policies."
    )

    add_qa_block(17, "Database", 
        "How would you optimize database query execution if the ATTENDANCE table grows to millions of rows?",
        "Optimization techniques include: 1) Creating Composite B-Tree Indexes on `(student_id, subject_id, attendance_date)`, 2) Range Partitioning the `ATTENDANCE` table by academic year/semester, 3) Implementing Materialized Views to pre-calculate and cache daily/monthly attendance summary percentages."
    )

    add_qa_block(18, "Database", 
        "What is the distinction between DDL, DML, and DCL files in the /database folder?",
        "`schema.sql` & `sequences.sql` are Data Definition Language (DDL) scripts that define database structures (tables, constraints, sequences). `seed_data.sql` is Data Manipulation Language (DML) inserting seed records. `procedures.sql` contains Data Control and Procedural logic (PL/SQL) for database execution."
    )

    add_qa_block(19, "Database", 
        "How does online fee collection maintain ACID compliance during payment processing?",
        "Fee payments involve updating `FEES` (paid amount & status) and inserting a row into `FEE_PAYMENTS`. By wrapping both SQL queries within a single transaction (`connection.setAutoCommit(false)`), calling `connection.commit()` on success or `connection.rollback()` in `catch`, atomicity and consistency are guaranteed."
    )

    add_qa_block(20, "Database", 
        "What role does seed_data.sql play in development and automated testing?",
        "`seed_data.sql` populates standardized test data (default Admin credentials, sample Faculty, Students, Subjects, Courses). This enables developers and automated tests to spin up a fully functioning environment instantly without manual data entry."
    )

    # --- CATEGORY C: REACT FRONTEND & STATE MANAGEMENT ---
    story.append(Spacer(1, 6))
    story.append(Paragraph("3.3 React 18, State Management & Modern Frontend Architecture", h2_style))

    add_qa_block(21, "Frontend", 
        "How does AuthContext.jsx manage global authentication state and persistence across browser refreshes?",
        "`AuthContext.jsx` utilizes React's Context API to expose `user`, `token`, `role`, `login()`, and `logout()` globally. On initial load, an `useEffect` hook reads stored session tokens from `localStorage` or session cookies, validates the session via `authService.getCurrentUser()`, and initializes user state, preventing accidental sign-outs on page refresh."
    )

    add_qa_block(22, "Frontend", 
        "How does ProtectedRoute.jsx enforce Role-Based Access Control on the client side?",
        "`ProtectedRoute.jsx` wraps protected route components in `AppRoutes.jsx`. It evaluates the authenticated user's role from `AuthContext`. If the user is unauthenticated, it redirects to `/login`. If the user's role is not included in the `allowedRoles` array prop, it redirects to an Unauthorized view or their default dashboard."
    )

    add_qa_block(23, "Frontend", 
        "How is Axios configured in api.js to automatically handle authentication tokens and errors?",
        "`api.js` creates a centralized Axios instance with `baseURL`. It attaches a Request Interceptor that automatically injects `Authorization: Bearer <token>` into outgoing request headers. A Response Interceptor catches HTTP `401 Unauthorized` responses and triggers global sign-out and redirection to login."
    )

    add_qa_block(24, "Frontend", 
        "Describe the dashboard component layout hierarchy (Sidebar, Navbar, View components).",
        "Dashboards (e.g. `StudentDashboard.jsx`) follow a layout wrapper structure: A fixed left `Sidebar.jsx` (dynamically rendering links based on user role), a top `Navbar.jsx` (showing notifications, profile menu, dark mode toggle), and a dynamic main content area rendering specific shared views (`AttendanceView`, `AssignmentsView`)."
    )

    add_qa_block(25, "Frontend", 
        "How does DataTable.jsx achieve reusable client-side searching, sorting, and pagination?",
        "`DataTable.jsx` accepts `data` array and `columns` configuration props. It uses internal React state for search filter term, current page index, and sort order. A `useMemo` hook filters and sorts data efficiently without triggering unnecessary re-renders."
    )

    add_qa_block(26, "Frontend", 
        "Explain the directory separation between /views, /components, /services, and /shared-modules.",
        "`/views` contains page-level route targets (e.g. Dashboards, Login). `/components` contains UI widgets (`Navbar`, `DataTable`, Modals). `/services` abstracts API HTTP calls (`authService.js`). `/shared-modules` contains domain-specific feature views (`AttendanceView`, `LibraryView`) rendered across multiple role dashboards."
    )

    add_qa_block(27, "Frontend", 
        "What are the benefits of decoupling API logic into service files (e.g. assignmentService.js)?",
        "Decoupling API calls keeps React components pure and focused on UI rendering and local state management. If an API endpoint URL or payload structure changes, modifications are confined to the service file without touching component code."
    )

    add_qa_block(28, "Frontend", 
        "How does React Router v6 handle declarative client-side navigation in AppRoutes.jsx?",
        "`AppRoutes.jsx` uses `<BrowserRouter>`, `<Routes>`, and `<Route>` components. It defines public routes (`/`, `/about`, `/login`) and protected nested dashboard routes, delivering seamless SPA navigation without full page reloads."
    )

    add_qa_block(29, "Frontend", 
        "How does the frontend handle loading states and API error feedback?",
        "Components maintain `loading` (boolean) and `error` (string) state variables. During async service calls, spinners are displayed. If an API call fails, error messages are rendered in alert boxes or toast notifications."
    )

    add_qa_block(30, "Frontend", 
        "How is styling structured in theme.css and index.css?",
        "`theme.css` specifies CSS custom properties (variables) for primary colors, dark mode surfaces, text colors, and glassmorphic backdrop filters. `index.css` sets global font resets and layout utilities, delivering a cohesive visual theme."
    )

    # --- CATEGORY D: SYSTEM DESIGN, SECURITY & SCALABILITY ---
    story.append(Spacer(1, 6))
    story.append(Paragraph("3.4 System Design, Security, Scalability & Testing", h2_style))

    add_qa_block(31, "System Design", 
        "If 50,000 students log in simultaneously during exam result releases, how would you scale this ERP?",
        "Scaling strategy: 1) Deploy multiple Java Servlet instances behind a Load Balancer (Nginx / AWS ALB) with stateless sessions, 2) Introduce Redis Cache to serve static course catalog and student profile data, 3) Implement Oracle DB read-replicas for read-heavy queries, 4) Enable CDN caching for React static frontend assets."
    )

    add_qa_block(32, "System Design", 
        "How would you refactor this Java Servlets monolith into a Spring Boot Microservices architecture?",
        "Refactoring steps: 1) Decompose into microservices domain boundaries (Auth Service, Student Service, Attendance Service, Fee Service, Library Service), 2) Implement an API Gateway (Spring Cloud Gateway) for routing and authentication, 3) Use RabbitMQ / Kafka for asynchronous messaging (e.g. fee payment triggers notification service)."
    )

    add_qa_block(33, "Security", 
        "Compare Session-based authentication vs JWT (JSON Web Tokens) for this College ERP.",
        "Session-based auth stores session state on the server (requiring sticky sessions or distributed session store). JWT is stateless: the server signs a cryptographically secure token containing user ID and role, which the client sends in HTTP headers. JWT was chosen for stateless SPA scalability."
    )

    add_qa_block(34, "Security", 
        "How would you securely implement file upload functionality for student assignment submissions?",
        "Security measures: 1) Restrict allowed file MIME types (PDF, DOCX) and enforce max file size limits (10MB), 2) Sanitize file names to prevent directory traversal (`../`), 3) Store files outside the web root or in Cloud Object Storage (AWS S3) with generated UUIDs, 4) Perform virus scanning before saving."
    )

    add_qa_block(35, "Security", 
        "How is data privacy enforced so students cannot view other students' grades or fee statements?",
        "Backend Authorization: Servlet endpoints extract the user ID and role directly from the authenticated token/session, ignoring client-supplied student IDs in URL parameters unless the user holds Admin/Faculty privileges. Queries strictly append `WHERE student_id = :authenticated_user_id`."
    )

    add_qa_block(36, "System Design", 
        "What caching mechanism would you introduce to reduce database load for static notices?",
        "Implement Redis in-memory cache. When `NoticesView` requests active notices, the backend checks Redis (`notices:active`). If present (cache hit), it returns immediately. If missing (cache miss), it queries Oracle DB, writes result to Redis with a 15-minute TTL, and returns payload."
    )

    add_qa_block(37, "System Design", 
        "How would you implement real-time notifications for grade publications and announcements?",
        "Integrate WebSockets (using HTML5 WebSocket API on frontend and `@ServerEndpoint` / Spring WebSocket on backend). When a faculty publishes grades, the server pushes a real-time notification payload directly to the connected student's socket channel."
    )

    add_qa_block(38, "Operations", 
        "What database backup and disaster recovery strategies should be implemented for this ERP?",
        "Strategies: 1) Oracle RMAN (Recovery Manager) for daily automated full backups and incremental hourly archive log backups, 2) Multi-region Database Replication (Oracle Data Guard) for automated failover during cloud region outages."
    )

    add_qa_block(39, "Security", 
        "What audit logging mechanisms should be implemented for sensitive financial transactions?",
        "Maintain an immutable `AUDIT_LOGS` table recording `log_id`, `actor_id`, `action_type` ('FEE_WAIVER', 'USER_DELETE'), `target_id`, `timestamp`, `ip_address`, and `old_value/new_value` JSON diffs. Database triggers enforce that audit logs cannot be modified or deleted."
    )

    add_qa_block(40, "Testing", 
        "What automated testing strategy would you recommend for this full-stack project?",
        "Testing Strategy: 1) **Unit Testing:** JUnit 5 and Mockito for testing Java DAO and Servlet helper logic; Jest/React Testing Library for React components, 2) **Integration Testing:** Testcontainers to spin up temporary Oracle DB containers for DAO SQL verification, 3) **End-to-End (E2E) Testing:** Cypress or Playwright automating complete user workflows (Login -> Mark Attendance -> Pay Fee)."
    )

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=10, spaceAfter=10))
    story.append(Paragraph("<b>End of Document</b> — College ERP System Architectural Specification, File Registry & Technical Interview Guide.", ParagraphStyle('EndDoc', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=9, textColor=c_body, alignment=1)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {filename}")

if __name__ == '__main__':
    out_pdf = r"c:\Users\Snehal\Desktop\Abhi Notes\Computer\Projects\ERP\ERP Files\College_ERP_Complete_Project_Guide.pdf"
    create_pdf(out_pdf)
