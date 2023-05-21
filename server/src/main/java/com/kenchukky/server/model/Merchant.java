package com.kenchukky.server.model;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class Merchant {
    private String merchantId;
    private String merchantName;
    
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

    public static Merchant create(SqlRowSet rs) {
        Merchant m = new Merchant();
        m.setMerchantId(rs.getString("merchant_id"));
        m.setMerchantName(rs.getString("merchant_name"));

        return m;
    }

    public JsonObject toJSON() {
        return Json.createObjectBuilder()
                .add("merchantId", getMerchantId())
                .add("merchantName", getMerchantName())
                .build();
    }
}
