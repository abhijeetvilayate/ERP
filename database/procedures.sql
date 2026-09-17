SET SERVEROUTPUT ON;

--------------------------------------------------------
-- 1. PROCEDURE: Verify Role Security Key for Registration
--------------------------------------------------------
CREATE OR REPLACE PROCEDURE verify_role_key (
    p_role_name   IN VARCHAR2,
    p_provided_key IN VARCHAR2,
    p_is_valid    OUT NUMBER
) AS
    v_count NUMBER := 0;
BEGIN
    -- Students do not require a secret key
    IF UPPER(p_role_name) = 'STUDENT' THEN
        p_is_valid := 1;
        RETURN;
    END IF;

    -- Check if provided key matches active role key in database
    SELECT COUNT(*) INTO v_count
    FROM role_activation_keys
    WHERE UPPER(role_name) = UPPER(p_role_name)
      AND secret_key = p_provided_key
      AND is_active = 1;

    IF v_count > 0 THEN
        p_is_valid := 1; -- Valid Key
    ELSE
        p_is_valid := 0; -- Invalid Key
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        p_is_valid := 0;
END verify_role_key;
/

--------------------------------------------------------
-- 2. PROCEDURE: Mark or Update Daily Student Attendance
--------------------------------------------------------
CREATE OR REPLACE PROCEDURE mark_student_attendance (
    p_student_id     IN NUMBER,
    p_faculty_id     IN NUMBER,
    p_dept_id        IN NUMBER,
    p_academic_year  IN VARCHAR2,
    p_division       IN VARCHAR2,
    p_subject_code   IN VARCHAR2,
    p_status         IN VARCHAR2,
    p_status_msg     OUT VARCHAR2
) AS
    v_count NUMBER;
BEGIN
    -- Check if attendance record already exists for today
    SELECT COUNT(*) INTO v_count
    FROM attendance
    WHERE student_id = p_student_id
      AND subject_code = p_subject_code
      AND TRUNC(attendance_date) = TRUNC(SYSDATE);

    IF v_count > 0 THEN
        -- Update existing record
        UPDATE attendance
        SET status = UPPER(p_status),
            faculty_id = p_faculty_id
        WHERE student_id = p_student_id
          AND subject_code = p_subject_code
          AND TRUNC(attendance_date) = TRUNC(SYSDATE);

        p_status_msg := 'UPDATED';
    ELSE
        -- Insert new attendance entry
        INSERT INTO attendance (
            student_id, faculty_id, department_id, 
            academic_year, division, subject_code, status
        ) VALUES (
            p_student_id, p_faculty_id, p_dept_id, 
            p_academic_year, p_division, p_subject_code, UPPER(p_status)
        );

        p_status_msg := 'INSERTED';
    END IF;

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_status_msg := 'ERROR: ' || SQLERRM;
END mark_student_attendance;
/

--------------------------------------------------------
-- 3. FUNCTION: Calculate Student Attendance Percentage
--------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_attendance_percentage (
    p_student_id   IN NUMBER,
    p_subject_code IN VARCHAR2 DEFAULT NULL
) RETURN NUMBER IS
    v_total_classes  NUMBER := 0;
    v_present_count  NUMBER := 0;
    v_percentage     NUMBER(5,2) := 0.00;
BEGIN
    IF p_subject_code IS NOT NULL THEN
        SELECT COUNT(*), 
               NVL(SUM(CASE WHEN UPPER(status) = 'PRESENT' THEN 1 ELSE 0 END), 0)
        INTO v_total_classes, v_present_count
        FROM attendance
        WHERE student_id = p_student_id
          AND subject_code = p_subject_code;
    ELSE
        SELECT COUNT(*), 
               NVL(SUM(CASE WHEN UPPER(status) = 'PRESENT' THEN 1 ELSE 0 END), 0)
        INTO v_total_classes, v_present_count
        FROM attendance
        WHERE student_id = p_student_id;
    END IF;

    IF v_total_classes > 0 THEN
        v_percentage := (v_present_count / v_total_classes) * 100;
    ELSE
        v_percentage := 0.00;
    END IF;

    RETURN v_percentage;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0.00;
END calculate_attendance_percentage;
/

--------------------------------------------------------
-- 4. PROCEDURE: Calculate Overdue Library Fines
--------------------------------------------------------
CREATE OR REPLACE PROCEDURE calculate_library_fine (
    p_transaction_id IN NUMBER,
    p_fine_amount    OUT NUMBER
) AS
    v_due_date    DATE;
    v_return_date DATE;
    v_days_late   NUMBER := 0;
    v_rate_per_day NUMBER := 10; -- Fine rate: ₹10 per day overdue
BEGIN
    SELECT due_date, NVL(return_date, SYSDATE)
    INTO v_due_date, v_return_date
    FROM book_transactions
    WHERE transaction_id = p_transaction_id;

    IF v_return_date > v_due_date THEN
        v_days_late := TRUNC(v_return_date) - TRUNC(v_due_date);
        p_fine_amount := v_days_late * v_rate_per_day;
    ELSE
        p_fine_amount := 0;
    END IF;

    -- Update calculated fine back to transaction record
    UPDATE book_transactions
    SET fine_amount = p_fine_amount
    WHERE transaction_id = p_transaction_id;

    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        p_fine_amount := 0;
    WHEN OTHERS THEN
        p_fine_amount := 0;
END calculate_library_fine;
/

--------------------------------------------------------
-- 5. TRIGGER: Update Library Book Stock on Issue/Return
--------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_update_book_status
AFTER INSERT OR UPDATE OF status ON book_transactions
FOR EACH ROW
BEGIN
    -- Book Issued
    IF UPPER(:NEW.status) = 'ISSUED' THEN
        UPDATE library_books
        SET available_copies = available_copies - 1
        WHERE book_id = :NEW.book_id AND available_copies > 0;
    
    -- Book Returned
    ELSIF UPPER(:NEW.status) = 'RETURNED' AND (:OLD.status IS NULL OR UPPER(:OLD.status) != 'RETURNED') THEN
        UPDATE library_books
        SET available_copies = available_copies + 1
        WHERE book_id = :NEW.book_id;
    END IF;
END;
/