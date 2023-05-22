package com.kenchukky.server.model;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class UserOrders {
    private String orderId;
    private String userId;
    private String merchantId;
    private String merchantName;
    private String timeOfOrder;
    private String transactionDate;
    private int pointsReceived;
    private int qty;
    private String uom;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public String getTimeOfOrder() {
        return timeOfOrder;
    }

    public void setTimeOfOrder(String timeOfOrder) {
        this.timeOfOrder = timeOfOrder;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public int getPointsReceived() {
        return pointsReceived;
    }

    public void setPointsReceived(int pointsReceived) {
        this.pointsReceived = pointsReceived;
    }

    public int getQty() {
        return qty;
    }

    public void setQty(int quantity) {
        this.qty = quantity;
    }

    public String getUom() {
        return uom;
    }

    public void setUom(String uom) {
        this.uom = uom;
    }

    public static UserOrders create(SqlRowSet rs) {
        UserOrders ut = new UserOrders();
        ut.setOrderId(rs.getString("order_id"));
        ut.setUserId(rs.getString("user_id"));
        ut.setMerchantId(rs.getString("merchant_id"));
        ut.setMerchantName(rs.getString("merchant_name"));
        ut.setTimeOfOrder(rs.getTimestamp("time_of_order").toString());
        ut.setTransactionDate(rs.getTimestamp("transaction_date").toString());
        ut.setPointsReceived(rs.getInt("points_received"));
        ut.setQty(rs.getInt("quantity"));
        ut.setUom(rs.getString("uom"));

        return ut;
    }

    public JsonObject toJSON() {
        return Json.createObjectBuilder()
                .add("orderId", getOrderId())
                .add("userId", getUserId())
                .add("merchantId", getMerchantId())
                .add("merchantName", getMerchantName())
                .add("timeOfOrder", getTimeOfOrder())
                .add("transactionDate", getTransactionDate())
                .add("pointsReceived", getPointsReceived())
                .add("quantity", getQty())
                .add("uom", getUom())
                .build();
    }

   
    
}
