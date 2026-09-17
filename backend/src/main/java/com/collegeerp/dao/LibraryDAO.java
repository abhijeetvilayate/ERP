package com.collegeerp.dao;

import com.collegeerp.config.DBConnection;
import com.collegeerp.model.Book;
import com.collegeerp.model.BookTransaction;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class LibraryDAO {

    private MongoCollection<Document> getBooksCollection() {
        return DBConnection.getCollection("library_books");
    }

    private MongoCollection<Document> getTransactionsCollection() {
        return DBConnection.getCollection("book_transactions");
    }

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    /**
     * Adds a new book to the library catalog.
     */
    public boolean addBook(Book book) throws Exception {
        int newId = getNextBookId();

        Document doc = new Document("book_id", newId)
                .append("title", book.getTitle())
                .append("author", book.getAuthor())
                .append("isbn", book.getIsbn())
                .append("category", book.getCategory())
                .append("total_copies", book.getTotalCopies())
                .append("available_copies", book.getTotalCopies());

        getBooksCollection().insertOne(doc);
        return true;
    }

    private int getNextBookId() {
        Document maxDoc = getBooksCollection().find().sort(Sorts.descending("book_id")).first();
        if (maxDoc != null && maxDoc.getInteger("book_id") != null) {
            return maxDoc.getInteger("book_id") + 1;
        }
        return 1;
    }

    /**
     * Fetches all books from the library catalog.
     */
    public List<Book> getAllBooks() throws Exception {
        List<Book> list = new ArrayList<>();
        for (Document doc : getBooksCollection().find().sort(Sorts.ascending("title"))) {
            list.add(mapDocumentToBook(doc));
        }
        return list;
    }

    /**
     * Searches books by title, author, or ISBN.
     */
    public List<Book> searchBooks(String query) throws Exception {
        List<Book> list = new ArrayList<>();
        Bson filter = Filters.or(
            Filters.regex("title", query, "i"),
            Filters.regex("author", query, "i"),
            Filters.regex("isbn", query, "i")
        );

        for (Document doc : getBooksCollection().find(filter).sort(Sorts.ascending("title"))) {
            list.add(mapDocumentToBook(doc));
        }
        return list;
    }

    /**
     * Issues a book to a user and decrements available copies stock.
     */
    public boolean issueBook(int bookId, int userId, String dueDate) throws Exception {
        int transId = getNextTransactionId();
        String issueDateStr = DATE_FORMAT.format(new Date());

        Document doc = new Document("transaction_id", transId)
                .append("book_id", bookId)
                .append("user_id", userId)
                .append("issue_date", issueDateStr)
                .append("due_date", dueDate)
                .append("return_date", null)
                .append("fine_amount", 0.0)
                .append("status", "ISSUED");

        getTransactionsCollection().insertOne(doc);

        // Decrement stock
        getBooksCollection().updateOne(
            Filters.eq("book_id", bookId),
            Updates.inc("available_copies", -1)
        );

        return true;
    }

    private int getNextTransactionId() {
        Document maxDoc = getTransactionsCollection().find().sort(Sorts.descending("transaction_id")).first();
        if (maxDoc != null && maxDoc.getInteger("transaction_id") != null) {
            return maxDoc.getInteger("transaction_id") + 1;
        }
        return 1;
    }

    /**
     * Processes book return, calculates overdue fine, and increments available copies stock.
     */
    public double returnBook(int transactionId) throws Exception {
        Document transDoc = getTransactionsCollection().find(Filters.eq("transaction_id", transactionId)).first();
        if (transDoc == null) {
            return 0.0;
        }

        String returnDateStr = DATE_FORMAT.format(new Date());
        double fineAmount = 0.0;

        try {
            String dueDateStr = transDoc.getString("due_date");
            if (dueDateStr != null) {
                Date dueDate = DATE_FORMAT.parse(dueDateStr);
                Date returnDate = new Date();
                long diff = returnDate.getTime() - dueDate.getTime();
                long daysOverdue = diff / (1000 * 60 * 60 * 24);
                if (daysOverdue > 0) {
                    fineAmount = daysOverdue * 10.0; // ₹10 per day overdue fine
                }
            }
        } catch (Exception e) {
            fineAmount = 0.0;
        }

        Bson filter = Filters.eq("transaction_id", transactionId);
        Bson update = Updates.combine(
            Updates.set("return_date", returnDateStr),
            Updates.set("fine_amount", fineAmount),
            Updates.set("status", "RETURNED")
        );

        getTransactionsCollection().updateOne(filter, update);

        // Increment stock
        Integer bookId = transDoc.getInteger("book_id");
        if (bookId != null) {
            getBooksCollection().updateOne(
                Filters.eq("book_id", bookId),
                Updates.inc("available_copies", 1)
            );
        }

        return fineAmount;
    }

    /**
     * Fetches all active and past transactions for a specific user.
     */
    public List<BookTransaction> getTransactionsByUser(int userId) throws Exception {
        List<BookTransaction> list = new ArrayList<>();
        Bson filter = Filters.eq("user_id", userId);

        for (Document doc : getTransactionsCollection().find(filter).sort(Sorts.descending("issue_date"))) {
            BookTransaction bt = new BookTransaction();
            bt.setTransactionId(doc.getInteger("transaction_id", 0));
            bt.setBookId(doc.getInteger("book_id", 0));
            bt.setUserId(doc.getInteger("user_id", 0));
            bt.setIssueDate(doc.getString("issue_date"));
            bt.setDueDate(doc.getString("due_date"));
            bt.setReturnDate(doc.getString("return_date"));
            bt.setFineAmount(doc.getDouble("fine_amount") != null ? doc.getDouble("fine_amount") : 0.0);
            bt.setStatus(doc.getString("status"));

            // Populate book details
            Document bookDoc = getBooksCollection().find(Filters.eq("book_id", bt.getBookId())).first();
            if (bookDoc != null) {
                bt.setBookTitle(bookDoc.getString("title"));
                bt.setBookAuthor(bookDoc.getString("author"));
            }

            list.add(bt);
        }
        return list;
    }

    private Book mapDocumentToBook(Document doc) {
        Book book = new Book();
        book.setBookId(doc.getInteger("book_id", 0));
        book.setTitle(doc.getString("title"));
        book.setAuthor(doc.getString("author"));
        book.setIsbn(doc.getString("isbn"));
        book.setCategory(doc.getString("category"));
        book.setTotalCopies(doc.getInteger("total_copies", 0));
        book.setAvailableCopies(doc.getInteger("available_copies", 0));
        return book;
    }
}