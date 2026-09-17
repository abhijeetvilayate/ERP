package com.collegeerp.dao;

import com.collegeerp.config.DBConnection;
import com.collegeerp.model.User;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.mindrot.jbcrypt.BCrypt;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class UserDAO {

    private MongoCollection<Document> getUserCollection() {
        return DBConnection.getCollection("users");
    }

    private MongoCollection<Document> getRoleKeysCollection() {
        return DBConnection.getCollection("role_activation_keys");
    }

    private MongoCollection<Document> getDeptCollection() {
        return DBConnection.getCollection("departments");
    }

    /**
     * Verifies the special role security key using MongoDB document lookup.
     */
    public boolean verifyRoleKey(String roleName, String providedKey) throws Exception {
        if ("STUDENT".equalsIgnoreCase(roleName)) {
            return true;
        }

        Document doc = getRoleKeysCollection().find(
            Filters.and(
                Filters.eq("role_name", roleName.toUpperCase()),
                Filters.eq("secret_key", providedKey),
                Filters.eq("is_active", 1)
            )
        ).first();

        return doc != null;
    }

    /**
     * Registers a new user in MongoDB.
     */
    public boolean registerUser(User user) throws Exception {
        int newUserId = getNextUserId();

        Document doc = new Document("user_id", newUserId)
                .append("username", user.getUsername())
                .append("password_hash", user.getPasswordHash())
                .append("full_name", user.getFullName())
                .append("email", user.getEmail())
                .append("phone_number", user.getPhoneNumber())
                .append("role", user.getRole())
                .append("department_id", user.getDepartmentId() > 0 ? user.getDepartmentId() : null)
                .append("created_at", new Date());

        getUserCollection().insertOne(doc);
        return true;
    }

    private int getNextUserId() {
        Document maxUser = getUserCollection().find().sort(Sorts.descending("user_id")).first();
        if (maxUser != null && maxUser.getInteger("user_id") != null) {
            return maxUser.getInteger("user_id") + 1;
        }
        return 1008;
    }

    /**
     * Authenticates a user by username and password.
     */
    public User authenticateUser(String username, String password) throws Exception {
        Document doc = getUserCollection().find(Filters.regex("username", "^" + username + "$", "i")).first();

        if (doc != null) {
            String storedHash = doc.getString("password_hash");
            if (passwordMatches(password, storedHash)) {
                return mapDocumentToUser(doc);
            }
        }
        return null;
    }

    private boolean passwordMatches(String password, String storedPassword) {
        if (storedPassword == null) {
            return false;
        }
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
            return BCrypt.checkpw(password, storedPassword);
        }
        return storedPassword.equals(password);
    }

    /**
     * Retrieves a single user profile by User ID.
     */
    public User getUserById(int userId) throws Exception {
        Document doc = getUserCollection().find(Filters.eq("user_id", userId)).first();
        if (doc != null) {
            return mapDocumentToUser(doc);
        }
        return null;
    }

    /**
     * Retrieves all users matching a specific role (e.g., STUDENT, FACULTY).
     */
    public List<User> getUsersByRole(String role) throws Exception {
        List<User> userList = new ArrayList<>();
        Bson filter = Filters.regex("role", "^" + role + "$", "i");
        for (Document doc : getUserCollection().find(filter).sort(Sorts.ascending("full_name"))) {
            userList.add(mapDocumentToUser(doc));
        }
        return userList;
    }

    /**
     * Deletes a user by User ID.
     */
    public boolean deleteUser(int userId) throws Exception {
        return getUserCollection().deleteOne(Filters.eq("user_id", userId)).getDeletedCount() > 0;
    }

    /**
     * Retrieves all registered users in the ERP system.
     */
    public List<User> getAllUsers() throws Exception {
        List<User> userList = new ArrayList<>();
        for (Document doc : getUserCollection().find().sort(Sorts.descending("user_id"))) {
            userList.add(mapDocumentToUser(doc));
        }
        return userList;
    }

    /**
     * Checks if a username or email is already registered.
     */
    public boolean isUserExists(String username, String email) throws Exception {
        Bson filter = Filters.or(
            Filters.eq("username", username),
            Filters.eq("email", email)
        );
        return getUserCollection().countDocuments(filter) > 0;
    }

    private User mapDocumentToUser(Document doc) {
        User user = new User();
        user.setUserId(doc.getInteger("user_id", 0));
        user.setUsername(doc.getString("username"));
        user.setPasswordHash(doc.getString("password_hash"));
        user.setFullName(doc.getString("full_name"));
        user.setEmail(doc.getString("email"));
        user.setPhoneNumber(doc.getString("phone_number"));
        user.setRole(doc.getString("role"));

        Integer deptId = doc.getInteger("department_id");
        if (deptId != null && deptId > 0) {
            user.setDepartmentId(deptId);
            Document deptDoc = getDeptCollection().find(Filters.eq("department_id", deptId)).first();
            if (deptDoc != null) {
                user.setDepartmentName(deptDoc.getString("department_name"));
            }
        }
        return user;
    }
}