--------------------------------------------------------
-- COLLEGE ERP SYSTEM - ORACLE SQL SEQUENCES
--------------------------------------------------------

-- 1. Sequence for Departments Table
CREATE SEQUENCE dept_seq 
    START WITH 10 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 2. Sequence for Role Activation Keys Table
CREATE SEQUENCE role_key_seq 
    START WITH 10 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 3. Sequence for Users Table (Starts at 1008 after seed users 1001-1007)
CREATE SEQUENCE user_seq 
    START WITH 1008 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 4. Sequence for Subjects Table
CREATE SEQUENCE subject_seq 
    START WITH 10 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 5. Sequence for Attendance Table
CREATE SEQUENCE att_seq 
    START WITH 1 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 6. Sequence for Assignments Table
CREATE SEQUENCE assignment_seq 
    START WITH 1 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 7. Sequence for Assignment Submissions Table
CREATE SEQUENCE submission_seq 
    START WITH 1 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 8. Sequence for Fees Table
CREATE SEQUENCE fee_seq 
    START WITH 10 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 9. Sequence for Payments History Table
CREATE SEQUENCE payment_seq 
    START WITH 100 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 10. Sequence for Library Books Table
CREATE SEQUENCE book_seq 
    START WITH 10 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 11. Sequence for Book Transactions Table
CREATE SEQUENCE book_trans_seq 
    START WITH 1 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 12. Sequence for Leave Requests Table
CREATE SEQUENCE leave_seq 
    START WITH 1 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;

-- 13. Sequence for Notices Table
CREATE SEQUENCE notice_seq 
    START WITH 10 
    INCREMENT BY 1 
    NOCACHE 
    NOCYCLE;