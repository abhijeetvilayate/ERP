<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.Connection" %>
<%@ page import="com.collegeerp.config.DBConnection" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>College ERP - API Server Status</title>
    <style>
        * {
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
        }
        body {
            background-color: #f4f6f9;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .card {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            max-width: 650px;
            width: 100%;
            padding: 30px;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 15px;
            border-bottom: 2px solid #eef2f5;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 22px;
            color: #1a252f;
        }
        .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
        }
        .badge-success {
            background-color: #e6f4ea;
            color: #137333;
        }
        .badge-danger {
            background-color: #fce8e6;
            color: #c5221f;
        }
        .section-title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #6c757d;
            margin-bottom: 12px;
            font-weight: 700;
        }
        .endpoint-list {
            list-style: none;
            margin-bottom: 25px;
        }
        .endpoint-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #f8f9fa;
            padding: 10px 14px;
            border-radius: 6px;
            margin-bottom: 8px;
            border: 1px solid #e9ecef;
            font-family: monospace;
            font-size: 13px;
        }
        .method {
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
        }
        .method-post { background-color: #0d6efd; color: #fff; }
        .method-get { background-color: #198754; color: #fff; }
        .footer-note {
            font-size: 12px;
            color: #8c98a4;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <div class="card">
        <div class="header">
            <div>
                <h1>College ERP System</h1>
                <p style="font-size: 13px; color: #6c757d; margin-top: 4px;">Java Servlet & JDBC API Backend Container</p>
            </div>
        </div>

        <!-- Database Connection Diagnostics -->
        <div style="margin-bottom: 25px;">
            <div class="section-title">Database Status</div>
            <%
                String dbStatusMessage = "";
                boolean isConnected = false;
                try (Connection conn = DBConnection.getConnection()) {
                    if (conn != null && !conn.isClosed()) {
                        isConnected = true;
                        dbStatusMessage = "Connected successfully to Oracle Database!";
                    }
                } catch (Exception e) {
                    isConnected = false;
                    dbStatusMessage = "Database Connection Failed: " + e.getMessage();
                }
            %>

            <% if (isConnected) { %>
                <div class="badge badge-success">
                    ✓ <%= dbStatusMessage %>
                </div>
            <% } else { %>
                <div class="badge badge-danger">
                    ✕ <%= dbStatusMessage %>
                </div>
            <% } %>
        </div>

        <!-- Registered API Routes Directory -->
        <div>
            <div class="section-title">Registered REST Endpoints</div>
            <ul class="endpoint-list">
                <li class="endpoint-item">
                    <span>/api/auth/register</span>
                    <span class="method method-post">POST</span>
                </li>
                <li class="endpoint-item">
                    <span>/api/auth/login</span>
                    <span class="method method-post">POST</span>
                </li>
                <li class="endpoint-item">
                    <span>/api/attendance/mark</span>
                    <span class="method method-post">POST</span>
                </li>
                <li class="endpoint-item">
                    <span>/api/attendance/view</span>
                    <span class="method method-get">GET</span>
                </li>
                <li class="endpoint-item">
                    <span>/api/fees/status</span>
                    <span class="method method-get">GET</span>
                </li>
                <li class="endpoint-item">
                    <span>/api/library/books</span>
                    <span class="method method-get">GET</span>
                </li>
            </ul>
        </div>

        <div class="footer-note">
            Connect your React frontend application on <code>http://localhost:5173</code>
        </div>
    </div>

</body>
</html>