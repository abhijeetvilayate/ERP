package com.collegeerp.controller;

import com.collegeerp.dao.FeeDAO;
import com.collegeerp.model.Fee;
import com.collegeerp.model.Payment;
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
import java.util.UUID;

public class FeeServlet extends HttpServlet {

    private FeeDAO feeDAO;

    @Override
    public void init() throws ServletException {
        feeDAO = new FeeDAO();
    }

    /**
     * POST /api/fees/pay
     * POST /api/fees/structure
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

            if ("/pay".equals(pathInfo)) {
                int feeId = requestBody.getInt("feeId");
                int studentId = requestBody.getInt("studentId");
                double amountPaid = requestBody.getDouble("amountPaid");
                String paymentMode = requestBody.optString("paymentMode", "ONLINE");

                // Generate unique receipt number
                String receiptNumber = "REC-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

                Payment payment = new Payment();
                payment.setFeeId(feeId);
                payment.setStudentId(studentId);
                payment.setAmountPaid(amountPaid);
                payment.setPaymentMode(paymentMode);
                payment.setReceiptNumber(receiptNumber);

                boolean processed = feeDAO.processPayment(payment);

                if (processed) {
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Payment processed successfully!");
                    jsonResponse.put("receiptNumber", receiptNumber);
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Payment transaction failed.");
                }

            } else if ("/structure".equals(pathInfo)) {
                Fee fee = new Fee();
                fee.setStudentId(requestBody.getInt("studentId"));
                fee.setTuitionFee(requestBody.optDouble("tuitionFee", 0.0));
                fee.setDevelopmentFee(requestBody.optDouble("developmentFee", 0.0));
                fee.setExamFee(requestBody.optDouble("examFee", 0.0));
                fee.setLibraryFee(requestBody.optDouble("libraryFee", 0.0));
                fee.setOtherCharges(requestBody.optDouble("otherCharges", 0.0));
                fee.setDueDate(requestBody.getString("dueDate"));

                boolean created = feeDAO.createOrUpdateFeeStructure(fee);

                if (created) {
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Fee structure created successfully!");
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Failed to create fee structure.");
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
     * GET /api/fees/student?studentId=101
     * GET /api/fees/history?studentId=101
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
                Fee fee = feeDAO.getFeeDetailsByStudent(studentId);

                if (fee != null) {
                    JSONObject feeObj = new JSONObject();
                    feeObj.put("feeId", fee.getFeeId());
                    feeObj.put("studentId", fee.getStudentId());
                    feeObj.put("studentName", fee.getStudentName());
                    feeObj.put("tuitionFee", fee.getTuitionFee());
                    feeObj.put("developmentFee", fee.getDevelopmentFee());
                    feeObj.put("examFee", fee.getExamFee());
                    feeObj.put("libraryFee", fee.getLibraryFee());
                    feeObj.put("otherCharges", fee.getOtherCharges());
                    feeObj.put("totalAmount", fee.getTotalAmount());
                    feeObj.put("paidAmount", fee.getPaidAmount());
                    feeObj.put("pendingAmount", fee.getPendingAmount());
                    feeObj.put("dueDate", fee.getDueDate());
                    feeObj.put("status", fee.getStatus());

                    jsonResponse.put("success", true);
                    jsonResponse.put("fee", feeObj);
                } else {
                    jsonResponse.put("success", true);
                    jsonResponse.put("fee", JSONObject.NULL);
                    jsonResponse.put("message", "No fee structure found for student ID: " + studentId);
                }

            } else if ("/history".equals(pathInfo)) {
                int studentId = Integer.parseInt(request.getParameter("studentId"));
                List<Payment> list = feeDAO.getPaymentHistoryByStudent(studentId);

                JSONArray array = new JSONArray();
                for (Payment pay : list) {
                    JSONObject obj = new JSONObject();
                    obj.put("paymentId", pay.getPaymentId());
                    obj.put("feeId", pay.getFeeId());
                    obj.put("amountPaid", pay.getAmountPaid());
                    obj.put("paymentMode", pay.getPaymentMode());
                    obj.put("receiptNumber", pay.getReceiptNumber());
                    obj.put("paymentDate", pay.getPaymentDate());
                    array.put(obj);
                }

                jsonResponse.put("success", true);
                jsonResponse.put("payments", array);

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