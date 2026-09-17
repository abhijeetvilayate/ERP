package com.collegeerp.model;

import java.io.Serializable;

/**
 * FeeRecord POJO representing student fee structures, balances, and payment statuses.
 */
public class FeeRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    private int feeId;
    private int studentId;
    private String studentName;
    private double tuitionFee;
    private double developmentFee;
    private double examFee;
    private double libraryFee;
    private double otherCharges;
    private double totalAmount;
    private double paidAmount;
    private double pendingAmount;
    private String dueDate;
    private String status; // 'PAID', 'PARTIAL', 'PENDING'

    // Default Constructor
    public FeeRecord() {}

    // Parameterized Constructor
    public FeeRecord(int feeId, int studentId, double tuitionFee, double developmentFee, 
                     double examFee, double libraryFee, double otherCharges, 
                     double totalAmount, double paidAmount, double pendingAmount, 
                     String dueDate, String status) {
        this.feeId = feeId;
        this.studentId = studentId;
        this.tuitionFee = tuitionFee;
        this.developmentFee = developmentFee;
        this.examFee = examFee;
        this.libraryFee = libraryFee;
        this.otherCharges = otherCharges;
        this.totalAmount = totalAmount;
        this.paidAmount = paidAmount;
        this.pendingAmount = pendingAmount;
        this.dueDate = dueDate;
        this.status = status;
    }

    // Getters and Setters

    public int getFeeId() {
        return feeId;
    }

    public void setFeeId(int feeId) {
        this.feeId = feeId;
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

    public double getTuitionFee() {
        return tuitionFee;
    }

    public void setTuitionFee(double tuitionFee) {
        this.tuitionFee = tuitionFee;
    }

    public double getDevelopmentFee() {
        return developmentFee;
    }

    public void setDevelopmentFee(double developmentFee) {
        this.developmentFee = developmentFee;
    }

    public double getExamFee() {
        return examFee;
    }

    public void setExamFee(double examFee) {
        this.examFee = examFee;
    }

    public double getLibraryFee() {
        return libraryFee;
    }

    public void setLibraryFee(double libraryFee) {
        this.libraryFee = libraryFee;
    }

    public double getOtherCharges() {
        return otherCharges;
    }

    public void setOtherCharges(double otherCharges) {
        this.otherCharges = otherCharges;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public double getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(double paidAmount) {
        this.paidAmount = paidAmount;
    }

    public double getPendingAmount() {
        return pendingAmount;
    }

    public void setPendingAmount(double pendingAmount) {
        this.pendingAmount = pendingAmount;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "FeeRecord{" +
                "feeId=" + feeId +
                ", studentId=" + studentId +
                ", totalAmount=" + totalAmount +
                ", paidAmount=" + paidAmount +
                ", pendingAmount=" + pendingAmount +
                ", status='" + status + '\'' +
                '}';
    }
}