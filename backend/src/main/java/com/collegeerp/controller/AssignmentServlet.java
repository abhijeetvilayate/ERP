package com.collegeerp.controller;

import com.collegeerp.dao.AssignmentDAO;
import com.collegeerp.model.Assignment;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class AssignmentServlet extends HttpServlet {

    private AssignmentDAO assignmentDAO;

    @Override
    public void init() throws ServletException {
        assignmentDAO = new AssignmentDAO();
    }

    /**
     * POST /api/assignments/create
     * POST /api/assignments/submit
     * POST /api/assignments/grade
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
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            JSONObject requestBody = new JSONObject(sb.length() > 0 ? sb.toString() : "{}");

            if ("/create".equals(pathInfo)) {
                Assignment assignment = new Assignment();
                assignment.setTitle(requestBody.getString("title"));
                assignment.setDescription(requestBody.optString("description", ""));
                assignment.setSubjectCode(requestBody.getString("subjectCode"));
                assignment.setDepartmentId(requestBody.getInt("departmentId"));
                assignment.setFacultyId(requestBody.getInt("facultyId"));
                assignment.setDueDate(requestBody.getString("dueDate"));

                boolean created = assignmentDAO.createAssignment(assignment);

                if (created) {
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Assignment created successfully!");
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Failed to create assignment.");
                }

            } else if ("/submit".equals(pathInfo)) {
                int assignmentId = requestBody.getInt("assignmentId");
                int studentId = requestBody.getInt("studentId");

                boolean submitted = assignmentDAO.submitAssignment(assignmentId, studentId);

                if (submitted) {
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Assignment submitted successfully!");
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Submission failed.");
                }

            } else if ("/grade".equals(pathInfo)) {
                int submissionId = requestBody.getInt("submissionId");
                String grade = requestBody.getString("grade");

                boolean graded = assignmentDAO.gradeSubmission(submissionId, grade);

                if (graded) {
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Submission graded successfully!");
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Failed to record grade.");
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
     * GET /api/assignments/faculty?facultyId=201
     * GET /api/assignments/student?studentId=101&departmentId=1
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
            if ("/faculty".equals(pathInfo)) {
                int facultyId = Integer.parseInt(request.getParameter("facultyId"));
                List<Assignment> list = assignmentDAO.getAssignmentsByFaculty(facultyId);

                JSONArray array = new JSONArray();
                for (Assignment assign : list) {
                    JSONObject obj = new JSONObject();
                    obj.put("assignmentId", assign.getAssignmentId());
                    obj.put("title", assign.getTitle());
                    obj.put("description", assign.getDescription());
                    obj.put("subjectCode", assign.getSubjectCode());
                    obj.put("departmentId", assign.getDepartmentId());
                    obj.put("dueDate", assign.getDueDate());
                    obj.put("submissionCount", assign.getSubmissionCount());
                    array.put(obj);
                }

                jsonResponse.put("success", true);
                jsonResponse.put("assignments", array);

            } else if ("/student".equals(pathInfo)) {
                int studentId = Integer.parseInt(request.getParameter("studentId"));
                int departmentId = Integer.parseInt(request.getParameter("departmentId"));

                List<Assignment> list = assignmentDAO.getAssignmentsForStudent(studentId, departmentId);

                JSONArray array = new JSONArray();
                for (Assignment assign : list) {
                    JSONObject obj = new JSONObject();
                    obj.put("assignmentId", assign.getAssignmentId());
                    obj.put("title", assign.getTitle());
                    obj.put("description", assign.getDescription());
                    obj.put("subjectCode", assign.getSubjectCode());
                    obj.put("facultyName", assign.getFacultyName() != null ? assign.getFacultyName() : "");
                    obj.put("dueDate", assign.getDueDate());
                    obj.put("status", assign.getStatus());
                    obj.put("grade", assign.getGrade() != null ? assign.getGrade() : "N/A");
                    array.put(obj);
                }

                jsonResponse.put("success", true);
                jsonResponse.put("assignments", array);

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