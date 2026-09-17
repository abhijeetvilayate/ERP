package com.collegeerp.dao;

import com.collegeerp.config.DBConnection;
import com.collegeerp.model.Assignment;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AssignmentDAO {

    private MongoCollection<Document> getAssignmentCollection() {
        return DBConnection.getCollection("assignments");
    }

    private MongoCollection<Document> getSubmissionCollection() {
        return DBConnection.getCollection("assignment_submissions");
    }

    private MongoCollection<Document> getUserCollection() {
        return DBConnection.getCollection("users");
    }

    /**
     * Creates a new assignment document in MongoDB.
     */
    public boolean createAssignment(Assignment assignment) throws Exception {
        int newId = getNextAssignmentId();

        Document doc = new Document("assignment_id", newId)
                .append("title", assignment.getTitle())
                .append("description", assignment.getDescription())
                .append("subject_code", assignment.getSubjectCode())
                .append("department_id", assignment.getDepartmentId())
                .append("faculty_id", assignment.getFacultyId())
                .append("due_date", assignment.getDueDate())
                .append("created_at", new Date());

        getAssignmentCollection().insertOne(doc);
        return true;
    }

    private int getNextAssignmentId() {
        Document maxDoc = getAssignmentCollection().find().sort(Sorts.descending("assignment_id")).first();
        if (maxDoc != null && maxDoc.getInteger("assignment_id") != null) {
            return maxDoc.getInteger("assignment_id") + 1;
        }
        return 1;
    }

    /**
     * Retrieves all assignments created by a specific faculty member.
     */
    public List<Assignment> getAssignmentsByFaculty(int facultyId) throws Exception {
        List<Assignment> list = new ArrayList<>();
        Bson filter = Filters.eq("faculty_id", facultyId);

        for (Document doc : getAssignmentCollection().find(filter).sort(Sorts.descending("created_at"))) {
            Assignment item = mapDocumentToAssignment(doc);

            // Count total submissions
            long count = getSubmissionCollection().countDocuments(Filters.eq("assignment_id", item.getAssignmentId()));
            item.setSubmissionCount((int) count);

            list.add(item);
        }
        return list;
    }

    /**
     * Retrieves assignments for a student based on department ID.
     */
    public List<Assignment> getAssignmentsForStudent(int studentId, int departmentId) throws Exception {
        List<Assignment> list = new ArrayList<>();
        Bson filter = Filters.eq("department_id", departmentId);

        for (Document doc : getAssignmentCollection().find(filter).sort(Sorts.ascending("due_date"))) {
            Assignment item = mapDocumentToAssignment(doc);

            // Fetch faculty name
            Document facultyDoc = getUserCollection().find(Filters.eq("user_id", item.getFacultyId())).first();
            if (facultyDoc != null) {
                item.setFacultyName(facultyDoc.getString("full_name"));
            }

            // Fetch student submission status
            Bson subFilter = Filters.and(
                Filters.eq("assignment_id", item.getAssignmentId()),
                Filters.eq("student_id", studentId)
            );
            Document subDoc = getSubmissionCollection().find(subFilter).first();
            if (subDoc != null) {
                item.setStatus(subDoc.getString("status"));
                item.setGrade(subDoc.getString("grade"));
            } else {
                item.setStatus("PENDING");
            }

            list.add(item);
        }
        return list;
    }

    /**
     * Submits an assignment for a student.
     */
    public boolean submitAssignment(int assignmentId, int studentId) throws Exception {
        int subId = getNextSubmissionId();

        Bson filter = Filters.and(
            Filters.eq("assignment_id", assignmentId),
            Filters.eq("student_id", studentId)
        );

        Document existing = getSubmissionCollection().find(filter).first();
        if (existing != null) {
            getSubmissionCollection().updateOne(filter, Updates.set("status", "SUBMITTED"));
        } else {
            Document doc = new Document("submission_id", subId)
                    .append("assignment_id", assignmentId)
                    .append("student_id", studentId)
                    .append("submission_date", new Date())
                    .append("status", "SUBMITTED")
                    .append("grade", null);
            getSubmissionCollection().insertOne(doc);
        }
        return true;
    }

    private int getNextSubmissionId() {
        Document maxDoc = getSubmissionCollection().find().sort(Sorts.descending("submission_id")).first();
        if (maxDoc != null && maxDoc.getInteger("submission_id") != null) {
            return maxDoc.getInteger("submission_id") + 1;
        }
        return 1;
    }

    /**
     * Grades a submitted student assignment.
     */
    public boolean gradeSubmission(int submissionId, String grade) throws Exception {
        Bson filter = Filters.eq("submission_id", submissionId);
        Bson update = Updates.combine(
            Updates.set("grade", grade),
            Updates.set("status", "GRADED")
        );
        return getSubmissionCollection().updateOne(filter, update).getModifiedCount() > 0;
    }

    private Assignment mapDocumentToAssignment(Document doc) {
        Assignment item = new Assignment();
        item.setAssignmentId(doc.getInteger("assignment_id", 0));
        item.setTitle(doc.getString("title"));
        item.setDescription(doc.getString("description"));
        item.setSubjectCode(doc.getString("subject_code"));
        item.setDepartmentId(doc.getInteger("department_id", 0));
        item.setFacultyId(doc.getInteger("faculty_id", 0));
        item.setDueDate(doc.getString("due_date"));
        return item;
    }
}