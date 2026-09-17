package com.collegeerp.controller;

import com.collegeerp.dao.UserDAO;
import com.collegeerp.model.User;
import org.json.JSONObject;
import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

public class AuthServlet extends HttpServlet {

    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

        String pathInfo = request.getPathInfo();

        try {
            // Read JSON Payload
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            JSONObject requestBody = new JSONObject(sb.length() > 0 ? sb.toString() : "{}");

            if ("/register".equals(pathInfo)) {
                handleRegistration(requestBody, jsonResponse, response);
            } else if ("/login".equals(pathInfo)) {
                handleLogin(requestBody, request, jsonResponse, response);
            } else if ("/logout".equals(pathInfo)) {
                handleLogout(request, jsonResponse);
            } else if ("/delete-user".equals(pathInfo)) {
                handleDeleteUser(requestBody, jsonResponse, response);
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

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

        try {
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            JSONObject requestBody = new JSONObject(sb.length() > 0 ? sb.toString() : "{}");
            handleDeleteUser(requestBody, jsonResponse, response);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Server Error: " + e.getMessage());
        }

        out.print(jsonResponse.toString());
        out.flush();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

        String pathInfo = request.getPathInfo();

        try {
            if ("/me".equals(pathInfo)) {
                HttpSession session = request.getSession(false);
                if (session != null && session.getAttribute("user") != null) {
                    User user = (User) session.getAttribute("user");
                    jsonResponse.put("success", true);
                    jsonResponse.put("user", userToJson(user));
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Not authenticated");
                }
            } else if ("/users".equals(pathInfo) || "/all-users".equals(pathInfo)) {
                java.util.List<User> userList = userDAO.getAllUsers();
                org.json.JSONArray usersArray = new org.json.JSONArray();
                for (User u : userList) {
                    usersArray.put(userToJson(u));
                }
                jsonResponse.put("success", true);
                jsonResponse.put("users", usersArray);
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Endpoint not found.");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Database Error: " + e.getMessage());
        }

        out.print(jsonResponse.toString());
        out.flush();
    }

    private void handleDeleteUser(JSONObject body, JSONObject jsonResponse, HttpServletResponse response) throws Exception {
        int userId = body.optInt("userId", 0);
        if (userId <= 0) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Valid User ID is required for deletion.");
            return;
        }

        boolean isDeleted = userDAO.deleteUser(userId);
        if (isDeleted) {
            jsonResponse.put("success", true);
            jsonResponse.put("message", "User ID " + userId + " successfully deleted from the system.");
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "User not found or already deleted.");
        }
    }

    private void handleRegistration(JSONObject body, JSONObject jsonResponse, HttpServletResponse response) throws Exception {
        String username = body.optString("username").trim();
        String password = body.optString("password").trim();
        String fullName = body.optString("fullName").trim();
        String email = body.optString("email").trim();
        String phoneNumber = body.optString("phoneNumber").trim();
        String role = body.optString("role", "STUDENT").trim().toUpperCase();
        int departmentId = body.optInt("departmentId", 0);
        String roleKey = body.optString("roleKey", "").trim();

        if (username.isEmpty() || password.isEmpty() || email.isEmpty() || fullName.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Required fields are missing.");
            return;
        }

        // 1. Verify Role Security Key for Non-Students using Oracle Stored Procedure
        if (!"STUDENT".equalsIgnoreCase(role)) {
            boolean isKeyValid = userDAO.verifyRoleKey(role, roleKey);
            if (!isKeyValid) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Invalid activation key for role: " + role);
                return;
            }
        }

        // 2. Check Duplicate User
        if (userDAO.isUserExists(username, email)) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Username or Email already registered.");
            return;
        }

        // 3. Hash Password using BCrypt
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPasswordHash(hashedPassword);
        newUser.setFullName(fullName);
        newUser.setEmail(email);
        newUser.setPhoneNumber(phoneNumber);
        newUser.setRole(role);
        newUser.setDepartmentId(departmentId);

        boolean isRegistered = userDAO.registerUser(newUser);

        if (isRegistered) {
            jsonResponse.put("success", true);
            jsonResponse.put("message", "User registered successfully!");
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Registration failed.");
        }
    }

    private void handleLogin(JSONObject body, HttpServletRequest request, JSONObject jsonResponse, HttpServletResponse response) throws Exception {
        String username = body.optString("username").trim();
        String password = body.optString("password").trim();

        if (username.isEmpty() || password.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Username and password are required.");
            return;
        }

        User user = userDAO.authenticateUser(username, password);

        if (user != null) {
            HttpSession session = request.getSession(true);
            session.setAttribute("user", user);

            jsonResponse.put("success", true);
            jsonResponse.put("message", "Login successful!");
            jsonResponse.put("user", userToJson(user));
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Invalid username or password.");
        }
    }

    private void handleLogout(HttpServletRequest request, JSONObject jsonResponse) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        jsonResponse.put("success", true);
        jsonResponse.put("message", "Logged out successfully.");
    }

    private JSONObject userToJson(User user) {
        JSONObject obj = new JSONObject();
        obj.put("userId", user.getUserId());
        obj.put("username", user.getUsername());
        obj.put("fullName", user.getFullName());
        obj.put("email", user.getEmail());
        obj.put("phoneNumber", user.getPhoneNumber());
        obj.put("role", user.getRole());
        obj.put("departmentId", user.getDepartmentId());
        obj.put("departmentName", user.getDepartmentName() != null ? user.getDepartmentName() : "");
        return obj;
    }
}