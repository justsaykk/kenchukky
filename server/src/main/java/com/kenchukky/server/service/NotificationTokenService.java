package com.kenchukky.server.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kenchukky.server.model.NotificationToken;
import com.kenchukky.server.repository.RedisRepo;

@Service
public class NotificationTokenService {
    @Autowired
    private RedisRepo redisRepo;

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
}
