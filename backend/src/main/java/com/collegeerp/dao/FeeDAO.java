package com.collegeerp.dao;

import com.collegeerp.config.DBConnection;
import com.collegeerp.model.Fee;
import com.collegeerp.model.Payment;
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

public class FeeDAO {

    private MongoCollection<Document> getFeesCollection() {
        return DBConnection.getCollection("fees");
    }

    private MongoCollection<Document> getPaymentsCollection() {
        return DBConnection.getCollection("payments");
    }

    private MongoCollection<Document> getUserCollection() {
        return DBConnection.getCollection("users");
    }

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * Retrieves the fee structure and payment summary for a student.
     */
    public Fee getFeeDetailsByStudent(int studentId) throws Exception {
        Document doc = getFeesCollection().find(Filters.eq("student_id", studentId)).first();
        if (doc != null) {
            Fee fee = mapDocumentToFee(doc);
            Document studentDoc = getUserCollection().find(Filters.eq("user_id", studentId)).first();
            if (studentDoc != null) {
                fee.setStudentName(studentDoc.getString("full_name"));
            }
            return fee;
        }
        return null;
    }

    /**
     * Records a fee payment transaction and updates the student's pending balance.
     */
    public boolean processPayment(Payment payment) throws Exception {
        int payId = getNextPaymentId();

        Document payDoc = new Document("payment_id", payId)
                .append("fee_id", payment.getFeeId())
                .append("student_id", payment.getStudentId())
                .append("amount_paid", payment.getAmountPaid())
                .append("payment_mode", payment.getPaymentMode())
                .append("receipt_number", payment.getReceiptNumber())
                .append("payment_date", DATE_FORMAT.format(new Date()));

        getPaymentsCollection().insertOne(payDoc);

        // Update fee collection
        Document feeDoc = getFeesCollection().find(Filters.eq("fee_id", payment.getFeeId())).first();
        if (feeDoc != null) {
            double total = feeDoc.getDouble("total_amount");
            double currentPaid = feeDoc.getDouble("paid_amount");
            double newPaid = currentPaid + payment.getAmountPaid();
            double newPending = total - newPaid;
            String status = (newPending <= 0) ? "PAID" : "PARTIAL";

            Bson filter = Filters.eq("fee_id", payment.getFeeId());
            Bson update = Updates.combine(
                Updates.set("paid_amount", newPaid),
                Updates.set("pending_amount", Math.max(0, newPending)),
                Updates.set("status", status)
            );
            getFeesCollection().updateOne(filter, update);
        }

        return true;
    }

    private int getNextPaymentId() {
        Document maxDoc = getPaymentsCollection().find().sort(Sorts.descending("payment_id")).first();
        if (maxDoc != null && maxDoc.getInteger("payment_id") != null) {
            return maxDoc.getInteger("payment_id") + 1;
        }
        return 1;
    }

    /**
     * Fetches all past payment history receipts for a student.
     */
    public List<Payment> getPaymentHistoryByStudent(int studentId) throws Exception {
        List<Payment> list = new ArrayList<>();
        Bson filter = Filters.eq("student_id", studentId);

        for (Document doc : getPaymentsCollection().find(filter).sort(Sorts.descending("payment_date"))) {
            Payment pay = new Payment();
            pay.setPaymentId(doc.getInteger("payment_id", 0));
            pay.setFeeId(doc.getInteger("fee_id", 0));
            pay.setStudentId(doc.getInteger("student_id", 0));
            pay.setAmountPaid(doc.getDouble("amount_paid"));
            pay.setPaymentMode(doc.getString("payment_mode"));
            pay.setReceiptNumber(doc.getString("receipt_number"));
            pay.setPaymentDate(doc.getString("payment_date"));

            list.add(pay);
        }
        return list;
    }

    /**
     * Creates or updates a fee structure record for a student.
     */
    public boolean createOrUpdateFeeStructure(Fee fee) throws Exception {
        int feeId = getNextFeeId();
        double total = fee.getTuitionFee() + fee.getDevelopmentFee() + fee.getExamFee() + fee.getLibraryFee() + fee.getOtherCharges();

        Document doc = new Document("fee_id", feeId)
                .append("student_id", fee.getStudentId())
                .append("tuition_fee", fee.getTuitionFee())
                .append("development_fee", fee.getDevelopmentFee())
                .append("exam_fee", fee.getExamFee())
                .append("library_fee", fee.getLibraryFee())
                .append("other_charges", fee.getOtherCharges())
                .append("total_amount", total)
                .append("paid_amount", 0.0)
                .append("pending_amount", total)
                .append("due_date", fee.getDueDate())
                .append("status", "PENDING");

        getFeesCollection().insertOne(doc);
        return true;
    }

    private int getNextFeeId() {
        Document maxDoc = getFeesCollection().find().sort(Sorts.descending("fee_id")).first();
        if (maxDoc != null && maxDoc.getInteger("fee_id") != null) {
            return maxDoc.getInteger("fee_id") + 1;
        }
        return 1;
    }

    private Fee mapDocumentToFee(Document doc) {
        Fee fee = new Fee();
        fee.setFeeId(doc.getInteger("fee_id", 0));
        fee.setStudentId(doc.getInteger("student_id", 0));
        fee.setTuitionFee(doc.getDouble("tuition_fee"));
        fee.setDevelopmentFee(doc.getDouble("development_fee"));
        fee.setExamFee(doc.getDouble("exam_fee"));
        fee.setLibraryFee(doc.getDouble("library_fee"));
        fee.setOtherCharges(doc.getDouble("other_charges"));
        fee.setTotalAmount(doc.getDouble("total_amount"));
        fee.setPaidAmount(doc.getDouble("paid_amount"));
        fee.setPendingAmount(doc.getDouble("pending_amount"));
        fee.setDueDate(doc.getString("due_date"));
        fee.setStatus(doc.getString("status"));
        return fee;
    }
}