package com.kenchukky.server.model;

public class NotificationToken {

    /* Incoming Object would look like this:
     * {userId: token}
     */

    private String userId;
    private String token;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
    
    
}
