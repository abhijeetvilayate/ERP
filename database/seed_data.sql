--------------------------------------------------------
-- COLLEGE ERP SYSTEM - INITIAL SEED DATA
--------------------------------------------------------

-- 1. SEED DEPARTMENTS
INSERT INTO departments (department_id, department_name) VALUES (1, 'Chemical Engineering');
INSERT INTO departments (department_id, department_name) VALUES (2, 'Computer Engineering');
INSERT INTO departments (department_id, department_name) VALUES (3, 'Information Technology');
INSERT INTO departments (department_id, department_name) VALUES (4, 'Mechanical Engineering');
INSERT INTO departments (department_id, department_name) VALUES (5, 'Electronics & Telecommunication');

-- 2. SEED ROLE ACTIVATION KEYS (Used for registration validation)
INSERT INTO role_activation_keys (key_id, role_name, secret_key, is_active) VALUES (1, 'FACULTY', 'FAC2026@ERP', 1);
INSERT INTO role_activation_keys (key_id, role_name, secret_key, is_active) VALUES (2, 'HOD', 'HOD2026#KEY', 1);
INSERT INTO role_activation_keys (key_id, role_name, secret_key, is_active) VALUES (3, 'PRINCIPAL', 'PRIN$2026#SECRET', 1);
INSERT INTO role_activation_keys (key_id, role_name, secret_key, is_active) VALUES (4, 'VICE_PRINCIPAL', 'VICE$2026#KEY', 1);
INSERT INTO role_activation_keys (key_id, role_name, secret_key, is_active) VALUES (5, 'ACCOUNTS', 'ACCT@2026#PAY', 1);
INSERT INTO role_activation_keys (key_id, role_name, secret_key, is_active) VALUES (6, 'LIBRARY', 'LIB#2026KEY', 1);
INSERT INTO role_activation_keys (key_id, role_name, secret_key, is_active) VALUES (7, 'SYSTEM_ADMIN', 'ADMIN_SUPER_SECRET_2026', 1);

-- 3. SEED CORE SYSTEM USERS
-- Password for all seed users is 'password123' (hash placeholder)
INSERT INTO users (user_id, username, password_hash, full_name, email, phone_number, role, department_id)
VALUES (1001, 'admin', 'password123', 'System Administrator', 'admin@college.edu', '9876543210', 'SYSTEM_ADMIN', 2);

INSERT INTO users (user_id, username, password_hash, full_name, email, phone_number, role, department_id)
VALUES (1002, 'principal', 'password123', 'Dr. Rajesh Deshmukh', 'principal@college.edu', '020-12345678', 'PRINCIPAL', NULL);

INSERT INTO users (user_id, username, password_hash, full_name, email, phone_number, role, department_id)
VALUES (1003, 'hod_chem', 'password123', 'Dr. Sandeep Kulkarni', 'hod.chem@college.edu', '9990123456', 'HOD', 1);

INSERT INTO users (user_id, username, password_hash, full_name, email, phone_number, role, department_id)
VALUES (1004, 'prof_neha', 'password123', 'Prof. Neha Joshi', 'neha.joshi@college.edu', '8765432109', 'FACULTY', 2);

INSERT INTO users (user_id, username, password_hash, full_name, email, phone_number, role, department_id)
VALUES (1005, 'accounts_user', 'password123', 'Mr. Amit Verma', 'amit.verma@college.edu', '9323344556', 'ACCOUNTS', NULL);

INSERT INTO users (user_id, username, password_hash, full_name, email, phone_number, role, department_id)
VALUES (1006, 'librarian', 'password123', 'Ms. Priya Nair', 'priya.nair@college.edu', '7860009001', 'LIBRARY', NULL);

INSERT INTO users (user_id, username, password_hash, full_name, email, phone_number, role, department_id)
VALUES (1007, 'student_rohit', 'password123', 'Rohit Sharma', 'rohit.sharma@college.edu', '9812345678', 'STUDENT', 2);

-- 4. SEED ACADEMIC SUBJECTS
INSERT INTO subjects (subject_id, subject_code, subject_name, department_id, credits, semester)
VALUES (1, 'CS201', 'Database Management Systems', 2, 4, 4);

INSERT INTO subjects (subject_id, subject_code, subject_name, department_id, credits, semester)
VALUES (2, 'CS202', 'Operating Systems', 2, 4, 4);

INSERT INTO subjects (subject_id, subject_code, subject_name, department_id, credits, semester)
VALUES (3, 'CH301', 'Chemical Reaction Engineering', 1, 4, 6);

INSERT INTO subjects (subject_id, subject_code, subject_name, department_id, credits, semester)
VALUES (4, 'CH302', 'Mass Transfer Operations', 1, 4, 6);

-- 5. SEED LIBRARY BOOKS
INSERT INTO library_books (book_id, title, author, isbn, category, total_copies, available_copies)
VALUES (1, 'Database System Concepts', 'Abraham Silberschatz', '9780073523323', 'Computer Science', 10, 8);

INSERT INTO library_books (book_id, title, author, isbn, category, total_copies, available_copies)
VALUES (2, 'Operating System Concepts', 'Abraham Silberschatz', '9781118063330', 'Computer Science', 8, 6);

INSERT INTO library_books (book_id, title, author, isbn, category, total_copies, available_copies)
VALUES (3, 'Chemical Reaction Engineering', 'Octave Levenspiel', '9780471254240', 'Chemical Engineering', 5, 5);

-- 6. SEED SAMPLE STUDENT FEE STRUCTURE
INSERT INTO fees (fee_id, student_id, tuition_fee, development_fee, exam_fee, library_fee, other_charges, total_amount, paid_amount, pending_amount, due_date, status)
VALUES (1, 1007, 50000.00, 15000.00, 10000.00, 5000.00, 5000.00, 85000.00, 42500.00, 42500.00, TO_DATE('2026-05-31', 'YYYY-MM-DD'), 'PARTIAL');

-- 7. SEED ANNOUNCEMENTS / NOTICES
INSERT INTO notices (notice_id, title, content, target_role, department_id, posted_by)
VALUES (1, 'Semester Exam Time Table Published', 'The official examination timetable for the upcoming semester end exams has been uploaded to the portal.', 'ALL', NULL, 1002);

INSERT INTO notices (notice_id, title, content, target_role, department_id, posted_by)
VALUES (2, 'Department Meeting on 21st May', 'All chemical engineering department faculty members are requested to attend the monthly review meeting in Room 204.', 'FACULTY', 1, 1003);

COMMIT;