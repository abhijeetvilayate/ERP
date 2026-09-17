// MongoDB Initialization Script for College ERP System

db = db.getSiblingDB("college_erp");

// Clear existing collections
db.departments.drop();
db.role_activation_keys.drop();
db.users.drop();
db.subjects.drop();
db.attendance.drop();
db.assignments.drop();
db.assignment_submissions.drop();
db.fees.drop();
db.payments.drop();
db.library_books.drop();
db.book_transactions.drop();
db.leave_requests.drop();
db.notices.drop();

// 1. DEPARTMENTS
db.departments.insertMany([
    { department_id: 1, department_name: "Chemical Engineering", created_at: new Date() },
    { department_id: 2, department_name: "Computer Engineering", created_at: new Date() },
    { department_id: 3, department_name: "Information Technology", created_at: new Date() },
    { department_id: 4, department_name: "Mechanical Engineering", created_at: new Date() },
    { department_id: 5, department_name: "Electronics & Telecommunication", created_at: new Date() }
]);

// 2. ROLE ACTIVATION KEYS
db.role_activation_keys.insertMany([
    { key_id: 1, role_name: "FACULTY", secret_key: "FAC2026@ERP", is_active: 1 },
    { key_id: 2, role_name: "HOD", secret_key: "HOD2026#KEY", is_active: 1 },
    { key_id: 3, role_name: "PRINCIPAL", secret_key: "PRIN$2026#SECRET", is_active: 1 },
    { key_id: 4, role_name: "VICE_PRINCIPAL", secret_key: "VICE$2026#KEY", is_active: 1 },
    { key_id: 5, role_name: "ACCOUNTS", secret_key: "ACCT@2026#PAY", is_active: 1 },
    { key_id: 6, role_name: "LIBRARY", secret_key: "LIB#2026KEY", is_active: 1 },
    { key_id: 7, role_name: "SYSTEM_ADMIN", secret_key: "ADMIN_SUPER_SECRET_2026", is_active: 1 }
]);

// 3. USERS
db.users.insertMany([
    { user_id: 1001, username: "admin", password_hash: "password123", full_name: "System Administrator", email: "admin@college.edu", phone_number: "9876543210", role: "SYSTEM_ADMIN", department_id: 2, created_at: new Date() },
    { user_id: 1002, username: "principal", password_hash: "password123", full_name: "Dr. Rajesh Deshmukh", email: "principal@college.edu", phone_number: "020-12345678", role: "PRINCIPAL", department_id: null, created_at: new Date() },
    { user_id: 1003, username: "hod_chem", password_hash: "password123", full_name: "Dr. Sandeep Kulkarni", email: "hod.chem@college.edu", phone_number: "9990123456", role: "HOD", department_id: 1, created_at: new Date() },
    { user_id: 1004, username: "prof_neha", password_hash: "password123", full_name: "Prof. Neha Joshi", email: "neha.joshi@college.edu", phone_number: "8765432109", role: "FACULTY", department_id: 2, created_at: new Date() },
    { user_id: 1005, username: "accounts_user", password_hash: "password123", full_name: "Mr. Amit Verma", email: "amit.verma@college.edu", phone_number: "9323344556", role: "ACCOUNTS", department_id: null, created_at: new Date() },
    { user_id: 1006, username: "librarian", password_hash: "password123", full_name: "Ms. Priya Nair", email: "priya.nair@college.edu", phone_number: "7860009001", role: "LIBRARY", department_id: null, created_at: new Date() },
    { user_id: 1007, username: "student_rohit", password_hash: "password123", full_name: "Rohit Sharma", email: "rohit.sharma@college.edu", phone_number: "9812345678", role: "STUDENT", department_id: 2, created_at: new Date() }
]);

// 4. SUBJECTS
db.subjects.insertMany([
    { subject_id: 1, subject_code: "CS201", subject_name: "Database Management Systems", department_id: 2, credits: 4, semester: 4 },
    { subject_id: 2, subject_code: "CS202", subject_name: "Operating Systems", department_id: 2, credits: 4, semester: 4 },
    { subject_id: 3, subject_code: "CH301", subject_name: "Chemical Reaction Engineering", department_id: 1, credits: 4, semester: 6 },
    { subject_id: 4, subject_code: "CH302", subject_name: "Mass Transfer Operations", department_id: 1, credits: 4, semester: 6 }
]);

// 5. LIBRARY BOOKS
db.library_books.insertMany([
    { book_id: 1, title: "Database System Concepts", author: "Abraham Silberschatz", isbn: "9780073523323", category: "Computer Science", total_copies: 10, available_copies: 8 },
    { book_id: 2, title: "Operating System Concepts", author: "Abraham Silberschatz", isbn: "9781118063330", category: "Computer Science", total_copies: 8, available_copies: 6 },
    { book_id: 3, title: "Chemical Reaction Engineering", author: "Octave Levenspiel", isbn: "9780471254240", category: "Chemical Engineering", total_copies: 5, available_copies: 5 }
]);

// 6. FEES & PAYMENTS
db.fees.insertMany([
    {
        fee_id: 1,
        student_id: 1007,
        tuition_fee: 50000.00,
        development_fee: 15000.00,
        exam_fee: 10000.00,
        library_fee: 5000.00,
        other_charges: 5000.00,
        total_amount: 85000.00,
        paid_amount: 42500.00,
        pending_amount: 42500.00,
        due_date: new Date("2026-05-31"),
        status: "PARTIAL"
    }
]);

// 7. NOTICES
db.notices.insertMany([
    { notice_id: 1, title: "Semester Exam Time Table Published", content: "The official examination timetable for the upcoming semester end exams has been uploaded to the portal.", target_role: "ALL", department_id: null, posted_by: 1002, posted_at: new Date() },
    { notice_id: 2, title: "Department Meeting on 21st May", content: "All chemical engineering department faculty members are requested to attend the monthly review meeting in Room 204.", target_role: "FACULTY", department_id: 1, posted_by: 1003, posted_at: new Date() }
]);

// Create unique indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ user_id: 1 }, { unique: true });
db.departments.createIndex({ department_id: 1 }, { unique: true });
db.role_activation_keys.createIndex({ role_name: 1 }, { unique: true });

print("MongoDB College ERP Database initialized successfully!");
