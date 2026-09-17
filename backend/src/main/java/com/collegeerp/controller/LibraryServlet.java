package com.collegeerp.controller;

import com.collegeerp.dao.LibraryDAO;
import com.collegeerp.model.Book;
import com.collegeerp.model.BookTransaction;
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

public class LibraryServlet extends HttpServlet {

    private LibraryDAO libraryDAO;

    @Override
    public void init() throws ServletException {
        libraryDAO = new LibraryDAO();
    }

    /**
     * POST /api/library/add
     * POST /api/library/issue
     * POST /api/library/return
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

            if ("/add".equals(pathInfo)) {
                Book book = new Book();
                book.setTitle(requestBody.getString("title"));
                book.setAuthor(requestBody.getString("author"));
                book.setIsbn(requestBody.getString("isbn"));
                book.setCategory(requestBody.optString("category", "General"));
                book.setTotalCopies(requestBody.getInt("totalCopies"));

                boolean added = libraryDAO.addBook(book);

                if (added) {
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Book added to catalog successfully!");
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Failed to add book.");
                }

            } else if ("/issue".equals(pathInfo)) {
                int bookId = requestBody.getInt("bookId");
                int userId = requestBody.getInt("userId");
                String dueDate = requestBody.getString("dueDate");

                boolean issued = libraryDAO.issueBook(bookId, userId, dueDate);

                if (issued) {
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Book issued successfully!");
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.put("success", false);
                    jsonResponse.put("message", "Failed to issue book.");
                }

            } else if ("/return".equals(pathInfo)) {
                int transactionId = requestBody.getInt("transactionId");

                double fineAmount = libraryDAO.returnBook(transactionId);

                jsonResponse.put("success", true);
                jsonResponse.put("message", "Book returned successfully!");
                jsonResponse.put("fineAmount", fineAmount);

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
     * GET /api/library/books
     * GET /api/library/search?q=java
     * GET /api/library/user-history?userId=101
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
            if ("/books".equals(pathInfo)) {
                List<Book> list = libraryDAO.getAllBooks();
                jsonResponse.put("success", true);
                jsonResponse.put("books", booksToJsonArray(list));

            } else if ("/search".equals(pathInfo)) {
                String query = request.getParameter("q");
                if (query == null) query = "";

                List<Book> list = libraryDAO.searchBooks(query);
                jsonResponse.put("success", true);
                jsonResponse.put("books", booksToJsonArray(list));

            } else if ("/user-history".equals(pathInfo)) {
                int userId = Integer.parseInt(request.getParameter("userId"));
                List<BookTransaction> list = libraryDAO.getTransactionsByUser(userId);

                JSONArray array = new JSONArray();
                for (BookTransaction bt : list) {
                    JSONObject obj = new JSONObject();
                    obj.put("transactionId", bt.getTransactionId());
                    obj.put("bookId", bt.getBookId());
                    obj.put("bookTitle", bt.getBookTitle());
                    obj.put("bookAuthor", bt.getBookAuthor());
                    obj.put("issueDate", bt.getIssueDate());
                    obj.put("dueDate", bt.getDueDate());
                    obj.put("returnDate", bt.getReturnDate() != null ? bt.getReturnDate() : "");
                    obj.put("fineAmount", bt.getFineAmount());
                    obj.put("status", bt.getStatus());
                    array.put(obj);
                }

                jsonResponse.put("success", true);
                jsonResponse.put("transactions", array);

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

    private JSONArray booksToJsonArray(List<Book> books) {
        JSONArray array = new JSONArray();
        for (Book b : books) {
            JSONObject obj = new JSONObject();
            obj.put("bookId", b.getBookId());
            obj.put("title", b.getTitle());
            obj.put("author", b.getAuthor());
            obj.put("isbn", b.getIsbn());
            obj.put("category", b.getCategory());
            obj.put("totalCopies", b.getTotalCopies());
            obj.put("availableCopies", b.getAvailableCopies());
            array.put(obj);
        }
        return array;
    }
}