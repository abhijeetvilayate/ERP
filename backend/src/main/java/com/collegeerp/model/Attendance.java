package com.collegeerp.model;

import java.io.Serializable;

/**
 * Attendance POJO representing daily class attendance records.
 */
public class Attendance implements Serializable {

    private static final long serialVersionUID = 1L;

    private int attendanceId;
    private int studentId;
    private String studentName;
    private int facultyId;
    private String facultyName;
    private int departmentId;
    private String academicYear;
    private String division;
    private String subjectCode;
    private String attendanceDate;
    private String status; // 'PRESENT' or 'ABSENT'

    // Default Constructor
    public Attendance() {}

    // Parameterized Constructor
    public Attendance(int attendanceId, int studentId, int facultyId, int departmentId, 
                      String academicYear, String division, String subjectCode, 
                      String attendanceDate, String status) {
        this.attendanceId = attendanceId;
        this.studentId = studentId;
        this.facultyId = facultyId;
        this.departmentId = departmentId;
        this.academicYear = academicYear;
        this.division = division;
        this.subjectCode = subjectCode;
        this.attendanceDate = attendanceDate;
        this.status = status;
    }

    // Getters and Setters

    public int getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(int attendanceId) {
        this.attendanceId = attendanceId;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public int getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(int facultyId) {
        this.facultyId = facultyId;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(String attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Attendance{" +
                "attendanceId=" + attendanceId +
                ", studentId=" + studentId +
                ", subjectCode='" + subjectCode + '\'' +
                ", attendanceDate='" + attendanceDate + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}