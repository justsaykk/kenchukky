package com.kenchukky.server.model;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class UserDiscounts {
    private int id;
    private String userId;
    private String discountName;
    private float discountAmount;
    private String discountCreatedAt;
    private String discountRedeemedAt;
    private String discountExpiryDate;
    private boolean isRedeemed;
    private boolean isExpired;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getDiscountName() {
        return discountName;
    }
    public void setDiscountName(String discountName) {
        this.discountName = discountName;
    }
    public float getDiscountAmount() {
        return discountAmount;
    }
    public void setDiscountAmount(float discountAmount) {
        this.discountAmount = discountAmount;
    }
    public String getDiscountCreatedAt() {
        return discountCreatedAt;
    }
    public void setDiscountCreatedAt(String discountCreatedAt) {
        this.discountCreatedAt = discountCreatedAt;
    }
    public String getDiscountRedeemedAt() {
        return discountRedeemedAt;
    }
    public void setDiscountRedeemedAt(String discountRedeemedAt) {
        this.discountRedeemedAt = discountRedeemedAt;
    }
    public String getDiscountExpiryDate() {
        return discountExpiryDate;
    }
    public void setDiscountExpiryDate(String discountExpiryDate) {
        this.discountExpiryDate = discountExpiryDate;
    }
    public boolean isRedeemed() {
        return isRedeemed;
    }
    public void setRedeemed(boolean isRedeemed) {
        this.isRedeemed = isRedeemed;
    }
    public boolean isExpired() {
        return isExpired;
    }
    public void setExpired(boolean isExpired) {
        this.isExpired = isExpired;
    }

    public static UserDiscounts create(SqlRowSet rs) {
        UserDiscounts ud = new UserDiscounts();
        ud.setId(rs.getInt("id"));
        ud.setUserId(rs.getString("user_id"));
        ud.setDiscountName(rs.getString("discount_name"));
        ud.setDiscountAmount(rs.getFloat("discount_amount"));
        ud.setDiscountCreatedAt(rs.getTimestamp("discount_created_at").toString());
        ud.setDiscountRedeemedAt(rs.getTimestamp("discount_redeemed_at") == null ? "" : rs.getTimestamp("discount_redeemed_at").toString());
        ud.setDiscountExpiryDate(rs.getTimestamp("discount_expiry_date") == null ? "" : rs.getTimestamp("discount_expiry_date").toString());
        ud.setRedeemed(rs.getBoolean("is_redeemed"));
        ud.setExpired(rs.getBoolean("is_expired"));

        return ud;
    }

    public JsonObject toJSON() {
        return Json.createObjectBuilder()
                .add("id", getId())
                .add("userId", getUserId())
                .add("discountName", getDiscountName())
                .add("discountAmount", getDiscountAmount())
                .add("discountCreatedAt", getDiscountCreatedAt())
                .add("discountRedeemedAt", getDiscountRedeemedAt())
                .add("discountExpiryDate", getDiscountExpiryDate())
                .add("isRedeemed", isRedeemed())
                .add("isExpired", isExpired())
                .build();
    }

}
