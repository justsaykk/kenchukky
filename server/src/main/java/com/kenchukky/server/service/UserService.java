package com.kenchukky.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kenchukky.server.exception.UserException;
import com.kenchukky.server.model.OrderData;
import com.kenchukky.server.model.User;
import com.kenchukky.server.model.UserDiscounts;
import com.kenchukky.server.repository.UserSqlRepo;

@Service
public class UserService {

    @Autowired
    private UserSqlRepo userSqlRepo;

    public Optional<User> getUserDetails(String userId) {
        return userSqlRepo.getUserDetails(userId);
    }

    public Optional<List<UserDiscounts>> getUserDiscounts(String userId) {
        return userSqlRepo.getUserDiscounts(userId);
    }

    @Transactional(rollbackFor=UserException.class)
    public boolean postUserOrderData(OrderData order) {
        return userSqlRepo.postUserOrderData(order);
    }
    
    // update user_orders
    public void postUserOrders() {

    }

    public void getOrCreateMerchant() {

    }

    public Optional<OrderData> getUserOrder(String orderId) {
        return userSqlRepo.getUserOrder(orderId);
    }

    public Optional<List<OrderData>> getUserRecentOrders(String userId) {
        return userSqlRepo.getUserRecentOrders(userId);
    }
}