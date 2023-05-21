package com.kenchukky.server.model;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class MerchantOrders {
    private int orderId;
    private String customerId;
    private String timeOfOrder;
    private int qty;
    private String uom;
    private boolean isConfirmed;

    public int getOrderId() {
        return orderId;
    }
    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }
    public String getCustomerId() {
        return customerId;
    }
    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
    public String getTimeOfOrder() {
        return timeOfOrder;
    }
    public void setTimeOfOrder(String timeOfOrder) {
        this.timeOfOrder = timeOfOrder;
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
    public boolean isConfirmed() {
        return isConfirmed;
    }
    public void setConfirmed(boolean isConfirmed) {
        this.isConfirmed = isConfirmed;
    }

    public static MerchantOrders create(SqlRowSet rs) {
        MerchantOrders mo = new MerchantOrders();
        mo.setOrderId(rs.getInt("order_id"));
        mo.setCustomerId(rs.getString("customer_id"));
        mo.setTimeOfOrder(rs.getTimestamp("time_of_order").toString());
        mo.setQty(rs.getInt("quantity"));
        mo.setUom(rs.getString("uom"));
        mo.setConfirmed(rs.getBoolean("confirmed"));

        return mo;
    }

    public JsonObject toJSON() {
        return Json.createObjectBuilder()
                .add("orderId", getOrderId())
                .add("customerId", getCustomerId())
                .add("timeOfOrder", getTimeOfOrder())
                .add("qty", getQty())
                .add("uom", getUom())
                .add("isConfirmed", isConfirmed())
                .build();
    }
}
