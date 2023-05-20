package com.kenchukky.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    @Value("${REDISHOST}")
    private String host;

    @Value("${REDISPORT}")
    private Integer port;

    @Value("${REDISDATABASE}")
    private Integer database;

    @Value("${REDISUSER}")
    private String user;

    @Value("${REDISPASSWORD}")
    private String password;

    @Bean("kenchukky")
    @Scope("singleton")
    public RedisTemplate<String, String> createRedisTemplate() {

        final RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName(host);
        config.setPort(port);
        config.setDatabase(database);
        config.setUsername(user);
        config.setPassword(password);

        final JedisClientConfiguration client = JedisClientConfiguration.builder().build();
        final JedisConnectionFactory factory = new JedisConnectionFactory(config, client);
        factory.afterPropertiesSet();

        final RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());

        return template;
    }
}
