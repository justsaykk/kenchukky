package com.kenchukky.server.repository;

import java.time.Duration;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import com.kenchukky.server.model.NotificationToken;

@Repository
public class RedisRepo {
    
    @Autowired
    @Qualifier("kenchukky")   // must match bean name in RedisConfig
    private RedisTemplate<String, String> redisTemplate;

    public void postToken(NotificationToken token) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        ops.set(token.getUserId(), token.getToken(), Duration.ofSeconds(1800));
    }

    public Optional<String> getToken(String userId) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();

        String value = ops.get(userId);
        if (null == value) return Optional.empty();

        return Optional.of(value);
    }
}
