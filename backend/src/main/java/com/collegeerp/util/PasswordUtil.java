package com.collegeerp.util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * Utility class for secure password hashing and verification using BCrypt.
 */
public class PasswordUtil {

    // Default Work Factor (log rounds) for BCrypt
    private static final int LOG_ROUNDS = 12;

    /**
     * Hashes a plain text password using BCrypt with a auto-generated salt.
     *
     * @param plainTextPassword Plain text password string
     * @return String BCrypt hashed password
     */
    public static String hashPassword(String plainTextPassword) {
        if (plainTextPassword == null || plainTextPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty or null.");
        }
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt(LOG_ROUNDS));
    }

    /**
     * Verifies a plain text password against an existing BCrypt hashed password.
     *
     * @param plainTextPassword Plain text password string to check
     * @param hashedPassword Encrypted BCrypt hash string from database
     * @return boolean true if password matches, false otherwise
     */
    public static boolean checkPassword(String plainTextPassword, String hashedPassword) {
        if (plainTextPassword == null || hashedPassword == null || hashedPassword.trim().isEmpty()) {
            return false;
        }
        try {
            return BCrypt.checkpw(plainTextPassword, hashedPassword);
        } catch (IllegalArgumentException e) {
            // Handles invalid hash formatting gracefully
            return false;
        }
    }
}