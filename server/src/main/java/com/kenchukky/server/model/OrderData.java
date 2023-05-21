package com.kenchukky.server.model;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class OrderData {
    private String orderId;
    private String userId;
    private String username;
    private String timeOfOrder;
    private int quantity;
    private String uom;
    private boolean orderConfirmed;

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
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getTimeOfOrder() {
        return timeOfOrder;
    }
    public void setTimeOfOrder(String timeOfOrder) {
        this.timeOfOrder = timeOfOrder;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public String getUom() {
        return uom;
    }
    public void setUom(String uom) {
        this.uom = uom;
    }
    public boolean isOrderConfirmed() {
        return orderConfirmed;
    }
    public void setOrderConfirmed(boolean orderConfirmed) {
        this.orderConfirmed = orderConfirmed;
    }

    public static OrderData create(SqlRowSet rs) {
        OrderData od = new OrderData();
        od.setOrderId(rs.getString("order_id"));
        od.setUserId(rs.getString("user_id"));
        od.setUsername(rs.getString("username"));
        od.setTimeOfOrder(rs.getTimestamp("time_of_order").toString());
        od.setQuantity(rs.getInt("quantity"));
        od.setUom(rs.getString("uom"));
        od.setOrderConfirmed(rs.getBoolean("confirmed"));

        return od;
    }

    public JsonObject toJSON() {
        return Json.createObjectBuilder()
                .add("orderId", getOrderId())
                .add("userId", getUserId())
                .add("username", getUsername())
                .add("timeOfOrder", getTimeOfOrder())
                .add("qty", getQuantity())
                .add("uom", getUom())
                .add("orderConfirmed", isOrderConfirmed())
                .build();
    }
    

    
}
