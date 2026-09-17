package com.collegeerp.util;

import org.json.JSONObject;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Utility helper to send structured JSON responses across Servlets.
 */
public class JSONResponse {

    /**
     * Sends a successful JSON response (HTTP 200 OK).
     */
    public static void sendSuccess(HttpServletResponse response, String message) throws IOException {
        sendSuccess(response, message, null);
    }

    /**
     * Sends a successful JSON response with a custom data object (HTTP 200 OK).
     */
    public static void sendSuccess(HttpServletResponse response, String message, Object data) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        JSONObject json = new JSONObject();
        json.put("success", true);
        json.put("message", message);
        if (data != null) {
            json.put("data", data);
        }

        try (PrintWriter out = response.getWriter()) {
            out.print(json.toString());
            out.flush();
        }
    }

    /**
     * Sends an error JSON response with a specific HTTP status code.
     */
    public static void sendError(HttpServletResponse response, int statusCode, String message) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(statusCode);

        JSONObject json = new JSONObject();
        json.put("success", false);
        json.put("message", message);

        try (PrintWriter out = response.getWriter()) {
            out.print(json.toString());
            out.flush();
        }
    }
}