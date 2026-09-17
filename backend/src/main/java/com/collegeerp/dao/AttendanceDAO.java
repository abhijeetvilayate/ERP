package com.collegeerp.dao;

import com.collegeerp.config.DBConnection;
import com.collegeerp.model.Attendance;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AttendanceDAO {

    private MongoCollection<Document> getAttendanceCollection() {
        return DBConnection.getCollection("attendance");
    }

    private MongoCollection<Document> getUserCollection() {
        return DBConnection.getCollection("users");
    }

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    /**
     * Executes batch attendance recording in MongoDB. Upserts existing record for student + subject + date.
     */
    public boolean markBatchAttendance(List<Attendance> attendanceList) throws Exception {
        if (attendanceList == null || attendanceList.isEmpty()) {
            return true;
        }

        int maxId = getNextAttendanceId();
        String dateStr = DATE_FORMAT.format(new Date());

        for (Attendance att : attendanceList) {
            String recordDateStr = (att.getAttendanceDate() != null && !att.getAttendanceDate().trim().isEmpty())
                    ? att.getAttendanceDate() : dateStr;

            Bson filter = Filters.and(
                Filters.eq("student_id", att.getStudentId()),
                Filters.eq("subject_code", att.getSubjectCode()),
                Filters.eq("attendance_date", recordDateStr)
            );

            Document existing = getAttendanceCollection().find(filter).first();
            int attendanceId = (existing != null && existing.getInteger("attendance_id") != null) 
                    ? existing.getInteger("attendance_id") : ++maxId;

            Document doc = new Document("attendance_id", attendanceId)
                    .append("student_id", att.getStudentId())
                    .append("faculty_id", att.getFacultyId())
                    .append("department_id", att.getDepartmentId())
                    .append("academic_year", att.getAcademicYear())
                    .append("division", att.getDivision())
                    .append("subject_code", att.getSubjectCode())
                    .append("attendance_date", recordDateStr)
                    .append("status", att.getStatus().toUpperCase());

            getAttendanceCollection().replaceOne(filter, doc, new ReplaceOptions().upsert(true));
        }

        return true;
    }

    private int getNextAttendanceId() {
        Document maxDoc = getAttendanceCollection().find().sort(Sorts.descending("attendance_id")).first();
        if (maxDoc != null && maxDoc.getInteger("attendance_id") != null) {
            return maxDoc.getInteger("attendance_id");
        }
        return 0;
    }

    /**
     * Calculates overall or subject-specific attendance percentage for a student.
     */
    public double getStudentAttendancePercentage(int studentId, String subjectCode) throws Exception {
        List<Bson> filters = new ArrayList<>();
        filters.add(Filters.eq("student_id", studentId));

        if (subjectCode != null && !subjectCode.trim().isEmpty()) {
            filters.add(Filters.eq("subject_code", subjectCode));
        }

        Bson query = Filters.and(filters);
        long totalCount = getAttendanceCollection().countDocuments(query);
        if (totalCount == 0) {
            return 0.0;
        }

        filters.add(Filters.eq("status", "PRESENT"));
        long presentCount = getAttendanceCollection().countDocuments(Filters.and(filters));

        return Math.round(((double) presentCount / totalCount) * 100.0 * 100.0) / 100.0;
    }

    /**
     * Fetches attendance history records for a student across all subjects.
     */
    public List<Attendance> getAttendanceByStudent(int studentId) throws Exception {
        List<Attendance> list = new ArrayList<>();
        Bson filter = Filters.eq("student_id", studentId);

        for (Document doc : getAttendanceCollection().find(filter).sort(Sorts.descending("attendance_date"))) {
            Attendance att = mapDocumentToAttendance(doc);
            
            // Populate faculty name
            Document facultyDoc = getUserCollection().find(Filters.eq("user_id", att.getFacultyId())).first();
            if (facultyDoc != null) {
                att.setFacultyName(facultyDoc.getString("full_name"));
            }
            list.add(att);
        }
        return list;
    }

    /**
     * Retrieves attendance records for a specific class, subject, and date.
     */
    public List<Attendance> getAttendanceByClassAndDate(int departmentId, String year, String division, String subjectCode, String date) throws Exception {
        List<Attendance> list = new ArrayList<>();
        Bson filter = Filters.and(
            Filters.eq("department_id", departmentId),
            Filters.eq("academic_year", year),
            Filters.eq("division", division),
            Filters.eq("subject_code", subjectCode),
            Filters.eq("attendance_date", date)
        );

        for (Document doc : getAttendanceCollection().find(filter)) {
            Attendance att = mapDocumentToAttendance(doc);

            // Populate student name
            Document studentDoc = getUserCollection().find(Filters.eq("user_id", att.getStudentId())).first();
            if (studentDoc != null) {
                att.setStudentName(studentDoc.getString("full_name"));
            }
            list.add(att);
        }
        return list;
    }

    private Attendance mapDocumentToAttendance(Document doc) {
        Attendance att = new Attendance();
        att.setAttendanceId(doc.getInteger("attendance_id", 0));
        att.setStudentId(doc.getInteger("student_id", 0));
        att.setFacultyId(doc.getInteger("faculty_id", 0));
        att.setDepartmentId(doc.getInteger("department_id", 0));
        att.setAcademicYear(doc.getString("academic_year"));
        att.setDivision(doc.getString("division"));
        att.setSubjectCode(doc.getString("subject_code"));
        att.setAttendanceDate(doc.getString("attendance_date"));
        att.setStatus(doc.getString("status"));
        return att;
    }
}