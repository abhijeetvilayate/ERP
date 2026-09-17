package com.collegeerp.model;

import java.io.Serializable;

/**
 * Assignment POJO representing course assignments, submission tracking, and grades.
 */
public class Assignment implements Serializable {

    private static final long serialVersionUID = 1L;

    private int assignmentId;
    private String title;
    private String description;
    private String subjectCode;
    private int departmentId;
    private int facultyId;
    private String facultyName;
    private String dueDate;
    private String createdAt;
    
    // Additional fields for student submission tracking
    private String status; // 'PENDING', 'SUBMITTED', 'GRADED'
    private String grade;
    private int submissionCount;

    // Default Constructor
    public Assignment() {}

    // Parameterized Constructor
    public Assignment(int assignmentId, String title, String description, 
                      String subjectCode, int departmentId, int facultyId, String dueDate) {
        this.assignmentId = assignmentId;
        this.title = title;
        this.description = description;
        this.subjectCode = subjectCode;
        this.departmentId = departmentId;
        this.facultyId = facultyId;
        this.dueDate = dueDate;
    }

    // Getters and Setters

    public int getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(int assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
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

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public int getSubmissionCount() {
        return submissionCount;
    }

    public void setSubmissionCount(int submissionCount) {
        this.submissionCount = submissionCount;
    }

    @Override
    public String toString() {
        return "Assignment{" +
                "assignmentId=" + assignmentId +
                ", title='" + title + '\'' +
                ", subjectCode='" + subjectCode + '\'' +
                ", dueDate='" + dueDate + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}