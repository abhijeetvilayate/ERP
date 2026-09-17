package com.collegeerp.config;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet Filter to handle Cross-Origin Resource Sharing (CORS)
 * Enables React frontend (port 5173 / 3000) to make REST requests to Java Servlets (port 8080).
 */
public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization logic if required
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // Authorize origins (Allows local Vite / Create React App dev servers)
        String origin = request.getHeader("Origin");
        if (origin != null) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Default Vite React Port
        }

        // Allowed HTTP methods
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");

        // Allowed headers
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");

        // Allow credentials (cookies / session headers)
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // Max age for preflight caching (1 hour)
        response.setHeader("Access-Control-Max-Age", "3600");

        // Intercept OPTIONS preflight requests sent by browsers prior to POST/PUT calls
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Continue request chain
        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {
        // Cleanup logic if required
    }
}