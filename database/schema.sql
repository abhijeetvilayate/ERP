--------------------------------------------------------
-- COLLEGE ERP SYSTEM - ORACLE SQL SCHEMA
--------------------------------------------------------

-- 1. DEPARTMENTS TABLE
CREATE TABLE departments (
    department_id NUMBER PRIMARY KEY,
    department_name VARCHAR2(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ROLE ACTIVATION KEYS TABLE (Security Keys for non-Student registrations)
CREATE TABLE role_activation_keys (
    key_id NUMBER PRIMARY KEY,
    role_name VARCHAR2(30) NOT NULL UNIQUE,
    secret_key VARCHAR2(100) NOT NULL,
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1))
);

-- 3. USERS TABLE (Core Authentication & Profile Data)
CREATE TABLE users (
    user_id NUMBER PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    full_name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    phone_number VARCHAR2(20),
    role VARCHAR2(30) NOT NULL CHECK (role IN (
        'SYSTEM_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 
        'HOD', 'FACULTY', 'ACCOUNTS', 'LIBRARY', 'STUDENT'
    )),
    department_id NUMBER REFERENCES departments(department_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. COURSES / SUBJECTS TABLE
CREATE TABLE subjects (
    subject_id NUMBER PRIMARY KEY,
    subject_code VARCHAR2(20) NOT NULL UNIQUE,
    subject_name VARCHAR2(100) NOT NULL,
    department_id NUMBER REFERENCES departments(department_id) ON DELETE CASCADE,
    credits NUMBER DEFAULT 3,
    semester NUMBER CHECK (semester BETWEEN 1 AND 8)
);

-- 5. ATTENDANCE TABLE
CREATE TABLE attendance (
    attendance_id NUMBER PRIMARY KEY,
    student_id NUMBER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    faculty_id NUMBER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    department_id NUMBER REFERENCES departments(department_id) ON DELETE CASCADE,
    academic_year VARCHAR2(10) NOT NULL,
    division VARCHAR2(5) NOT NULL,
    subject_code VARCHAR2(20) NOT NULL,
    attendance_date DATE DEFAULT SYSDATE,
    status VARCHAR2(10) NOT NULL CHECK (UPPER(status) IN ('PRESENT', 'ABSENT')),
    CONSTRAINT unq_student_daily_att UNIQUE (student_id, subject_code, attendance_date)
);

-- 6. ASSIGNMENTS TABLE
CREATE TABLE assignments (
    assignment_id NUMBER PRIMARY KEY,
    title VARCHAR2(150) NOT NULL,
    description CLOB,
    subject_code VARCHAR2(20) NOT NULL,
    department_id NUMBER REFERENCES departments(department_id) ON DELETE CASCADE,
    faculty_id NUMBER REFERENCES users(user_id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ASSIGNMENT SUBMISSIONS TABLE
CREATE TABLE assignment_submissions (
    submission_id NUMBER PRIMARY KEY,
    assignment_id NUMBER REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    student_id NUMBER REFERENCES users(user_id) ON DELETE CASCADE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR2(20) DEFAULT 'SUBMITTED' CHECK (UPPER(status) IN ('PENDING', 'SUBMITTED', 'GRADED')),
    grade VARCHAR2(10)
);

-- 8. FEE STRUCTURE & RECORDS TABLE
CREATE TABLE fees (
    fee_id NUMBER PRIMARY KEY,
    student_id NUMBER REFERENCES users(user_id) ON DELETE CASCADE,
    tuition_fee NUMBER(10,2) DEFAULT 0.00,
    development_fee NUMBER(10,2) DEFAULT 0.00,
    exam_fee NUMBER(10,2) DEFAULT 0.00,
    library_fee NUMBER(10,2) DEFAULT 0.00,
    other_charges NUMBER(10,2) DEFAULT 0.00,
    total_amount NUMBER(10,2) NOT NULL,
    paid_amount NUMBER(10,2) DEFAULT 0.00,
    pending_amount NUMBER(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR2(20) DEFAULT 'PENDING' CHECK (UPPER(status) IN ('PAID', 'PARTIAL', 'PENDING'))
);

-- 9. FEE PAYMENTS HISTORY TABLE
CREATE TABLE payments (
    payment_id NUMBER PRIMARY KEY,
    fee_id NUMBER REFERENCES fees(fee_id) ON DELETE CASCADE,
    student_id NUMBER REFERENCES users(user_id) ON DELETE CASCADE,
    amount_paid NUMBER(10,2) NOT NULL,
    payment_mode VARCHAR2(30) DEFAULT 'ONLINE',
    receipt_number VARCHAR2(50) UNIQUE NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. LIBRARY BOOKS INVENTORY TABLE
CREATE TABLE library_books (
    book_id NUMBER PRIMARY KEY,
    title VARCHAR2(200) NOT NULL,
    author VARCHAR2(150) NOT NULL,
    isbn VARCHAR2(50) UNIQUE,
    category VARCHAR2(100),
    total_copies NUMBER DEFAULT 1,
    available_copies NUMBER DEFAULT 1
);

-- 11. BOOK TRANSACTIONS TABLE
CREATE TABLE book_transactions (
    transaction_id NUMBER PRIMARY KEY,
    book_id NUMBER REFERENCES library_books(book_id) ON DELETE CASCADE,
    user_id NUMBER REFERENCES users(user_id) ON DELETE CASCADE,
    issue_date DATE DEFAULT SYSDATE,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount NUMBER(8,2) DEFAULT 0.00,
    status VARCHAR2(20) DEFAULT 'ISSUED' CHECK (UPPER(status) IN ('ISSUED', 'RETURNED', 'OVERDUE'))
);

-- 12. LEAVE REQUESTS TABLE
CREATE TABLE leave_requests (
    leave_id NUMBER PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id) ON DELETE CASCADE,
    leave_type VARCHAR2(30) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason VARCHAR2(255) NOT NULL,
    status VARCHAR2(20) DEFAULT 'PENDING' CHECK (UPPER(status) IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by NUMBER REFERENCES users(user_id) ON DELETE SET NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. NOTICES & ANNOUNCEMENTS TABLE
CREATE TABLE notices (
    notice_id NUMBER PRIMARY KEY,
    title VARCHAR2(200) NOT NULL,
    content CLOB NOT NULL,
    target_role VARCHAR2(30) DEFAULT 'ALL',
    department_id NUMBER REFERENCES departments(department_id) ON DELETE CASCADE,
    posted_by NUMBER REFERENCES users(user_id) ON DELETE CASCADE,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);