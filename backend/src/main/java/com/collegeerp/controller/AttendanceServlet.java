package com.collegeerp.controller;

import com.collegeerp.dao.AttendanceDAO;
import com.collegeerp.model.Attendance;
import com.collegeerp.model.User;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

public class AttendanceServlet extends HttpServlet {

    private AttendanceDAO attendanceDAO;

    @Override
    public void init() throws ServletException {
        attendanceDAO = new AttendanceDAO();
    }

    /**
     * POST /api/attendance/mark
     * Accepts a JSON array of student attendance records for batch processing.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

        String pathInfo = request.getPathInfo();

        try {
            if ("/mark".equals(pathInfo)) {
                StringBuilder sb = new StringBuilder();
                BufferedReader reader = request.getReader();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }

                JSONObject requestBody = new JSONObject(sb.toString());
                JSONArray recordsArray = requestBody.getJSONArray("records");

                int facultyId = requestBody.optInt("facultyId");
                int departmentId = requestBody.optInt("departmentId");
                String academicYear = requestBody.optString("academicYear");
                String division = requestBody.optString("division");
                String subjectCode = requestBody.optString("subjectCode");

                List<Attendance> attendanceList = new ArrayList<>();

                for (int i = 0; i < recordsArray.length(); i++) {
                    JSONObject item = recordsArray.getJSONObject(i);
                    Attendance att = new Attendance();
                    att.setStudentId(item.getInt("studentId"));
                    att.setFacultyId(facultyId);
                    att.setDepartmentId(departmentId);
                    att.setAcademicYear(academicYear);
                    att.setDivision(division);
                    att.setSubjectCode(subjectCode);
                    att.setStatus(item.getString("status"));

                    attendanceList.add(att);
                }

                boolean success = attendanceDAO.markBatchAttendance(attendanceList);

                if (success) {
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Attendance recorded successfully for " + attendanceList.size() + " students.");
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Failed to record attendance.");
                }
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Endpoint not found.");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Server Error: " + e.getMessage());
        }

        out.print(jsonResponse.toString());
        out.flush();
    }

    /**
     * GET /api/attendance/student?studentId=101
     * GET /api/attendance/percentage?studentId=101&subjectCode=CS301
     * GET /api/attendance/class?departmentId=1&year=FE&division=A&subjectCode=CS301&date=2026-08-03
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

        String pathInfo = request.getPathInfo();

        try {
            if ("/student".equals(pathInfo)) {
                int studentId = Integer.parseInt(request.getParameter("studentId"));
                List<Attendance> list = attendanceDAO.getAttendanceByStudent(studentId);

                JSONArray array = new JSONArray();
                for (Attendance att : list) {
                    JSONObject obj = new JSONObject();
                    obj.put("attendanceId", att.getAttendanceId());
                    obj.put("studentId", att.getStudentId());
                    obj.put("facultyName", att.getFacultyName() != null ? att.getFacultyName() : "");
                    obj.put("subjectCode", att.getSubjectCode());
                    obj.put("academicYear", att.getAcademicYear());
                    obj.put("division", att.getDivision());
                    obj.put("attendanceDate", att.getAttendanceDate());
                    obj.put("status", att.getStatus());
                    array.put(obj);
                }

                jsonResponse.put("success", true);
                jsonResponse.put("attendance", array);

            } else if ("/percentage".equals(pathInfo)) {
                int studentId = Integer.parseInt(request.getParameter("studentId"));
                String subjectCode = request.getParameter("subjectCode");

                double percentage = attendanceDAO.getStudentAttendancePercentage(studentId, subjectCode);

                jsonResponse.put("success", true);
                jsonResponse.put("studentId", studentId);
                jsonResponse.put("percentage", percentage);

            } else if ("/class".equals(pathInfo)) {
                int departmentId = Integer.parseInt(request.getParameter("departmentId"));
                String year = request.getParameter("year");
                String division = request.getParameter("division");
                String subjectCode = request.getParameter("subjectCode");
                String date = request.getParameter("date");

                List<Attendance> list = attendanceDAO.getAttendanceByClassAndDate(departmentId, year, division, subjectCode, date);

                JSONArray array = new JSONArray();
                for (Attendance att : list) {
                    JSONObject obj = new JSONObject();
                    obj.put("attendanceId", att.getAttendanceId());
                    obj.put("studentId", att.getStudentId());
                    obj.put("studentName", att.getStudentName());
                    obj.put("status", att.getStatus());
                    array.put(obj);
                }

                jsonResponse.put("success", true);
                jsonResponse.put("records", array);

            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Endpoint not found.");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Server Error: " + e.getMessage());
        }

        out.print(jsonResponse.toString());
        out.flush();
    }
}