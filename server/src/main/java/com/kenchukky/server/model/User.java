package com.kenchukky.server.model;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

enum Gender {
    MALE,
    FEMALE
}

public class User {
    private String userId;
    private String username;
    private String firstName;
    private String lastName;
    private int totalPoints;

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
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public int getTotalPoints() {
        return totalPoints;
    }
    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }

    public static User create(SqlRowSet rs) {
        User u = new User();
        u.setUserId(rs.getString("user_id"));
        u.setUsername(rs.getString("username"));
        u.setFirstName(rs.getString("first_name"));
        u.setLastName(rs.getString("last_name"));
        u.setTotalPoints(rs.getInt("total_points"));

        return u;
    }

    public JsonObject toJSON() {
        return Json.createObjectBuilder()
                .add("userId", getUserId())
                .add("username", getUsername())
                .add("firstName", getFirstName())
                .add("lastName", getLastName())
                .add("points", getTotalPoints())
                .build();
    }
}
