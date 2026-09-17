package com.collegeerp.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

/**
 * Singleton Connection Manager for MongoDB Database
 */
public class DBConnection {

    private static final String DEFAULT_URI = "mongodb://localhost:27017";
    private static final String DEFAULT_DB_NAME = "college_erp";

    private static MongoClient mongoClient = null;

    /**
     * Retrieves the singleton MongoClient instance.
     */
    public static synchronized MongoClient getClient() {
        if (mongoClient == null) {
            String uri = System.getenv("MONGODB_URI");
            if (uri == null || uri.trim().isEmpty()) {
                uri = DEFAULT_URI;
            }
            try {
                mongoClient = MongoClients.create(uri);
                System.out.println("INFO: Connected to MongoDB successfully using URI: " + (uri.contains("@") ? "MongoDB Atlas Cloud" : uri));
            } catch (Exception e) {
                System.err.println("CRITICAL ERROR: Failed to connect to MongoDB!");
                e.printStackTrace();
            }
        }
        return mongoClient;
    }

    /**
     * Retrieves the active MongoDatabase object.
     */
    public static MongoDatabase getDatabase() {
        String dbName = System.getenv("MONGODB_DB_NAME");
        if (dbName == null || dbName.trim().isEmpty()) {
            dbName = DEFAULT_DB_NAME;
        }
        return getClient().getDatabase(dbName);
    }

    /**
     * Helper method to quickly access a specific MongoDB Collection.
     */
    public static MongoCollection<Document> getCollection(String collectionName) {
        return getDatabase().getCollection(collectionName);
    }

    /**
     * Safely closes the MongoClient connection on server shutdown.
     */
    public static synchronized void closeClient() {
        if (mongoClient != null) {
            try {
                mongoClient.close();
                mongoClient = null;
                System.out.println("INFO: MongoDB client connection closed.");
            } catch (Exception e) {
                System.err.println("Error closing MongoDB client: " + e.getMessage());
            }
        }
    }
}