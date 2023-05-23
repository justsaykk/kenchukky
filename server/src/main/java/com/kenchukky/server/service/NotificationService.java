package com.kenchukky.server.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.kenchukky.server.model.NotificationToken;
import com.kenchukky.server.model.OrderData;
import com.kenchukky.server.repository.RedisRepo;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;

@Service
public class NotificationService {
    @Autowired
    private RedisRepo redisRepo;

    @Value("${GOOGLE_AUTH_KEY}")
    private String gAuthKey;

    public void saveToken(NotificationToken token) {
        this.redisRepo.postToken(token);
    }

    public String getToken(String userId) {
        Optional<String> tokenOptional = this.redisRepo.getToken(userId);
        if (tokenOptional.isEmpty()) {
            return userId;
        }
        return tokenOptional.get();
    }

    public void sendNotificationToMerchant(String receipientToken, String senderToken, OrderData order) {
        RestTemplate http = new RestTemplate();

        JsonObjectBuilder notificationBody = Json.createObjectBuilder()
            .add("title", "You have a new notification")
            .add("body", "You have a new notification");

        JsonObjectBuilder dataBody = Json.createObjectBuilder()
            .add("senderToken", senderToken)
            .add("orderId", order.getOrderId())
            .add("customerName", order.getUsername())
            .add("qty", order.getQty())
            .add("uom",order.getUom());
        
        JsonObject payload = Json.createObjectBuilder()
            .add("notification", notificationBody)
            .add("data", dataBody)
            .add("to", "%s".formatted(receipientToken))
            .build();

        HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", gAuthKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> postRequest = new HttpEntity<String>(payload.toString(), headers);

        try {
            http.postForEntity("https://fcm.googleapis.com/fcm/send", postRequest, String.class);
        } catch (Exception e) {
            System.err.printf("Error: %s\n", e.getMessage());
        }

    }

    public void sendNotificationToUser(String receipientToken) {
        RestTemplate http = new RestTemplate();

        JsonObjectBuilder notificationBody = Json.createObjectBuilder()
            .add("title", "You have a new notification")
            .add("body", "You have a new notification");
       
        JsonObject payload = Json.createObjectBuilder()
            .add("notification", notificationBody)
            .add("to", "%s".formatted(receipientToken))
            .build();

        HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", gAuthKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> postRequest = new HttpEntity<String>(payload.toString(), headers);

        try {
            http.postForEntity("https://fcm.googleapis.com/fcm/send", postRequest, String.class);
        } catch (Exception e) {
            System.err.printf("Error: %s\n", e.getMessage());
        }
    }
}
