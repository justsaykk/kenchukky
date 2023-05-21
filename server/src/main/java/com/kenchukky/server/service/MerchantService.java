package com.kenchukky.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kenchukky.server.exception.UserException;
import com.kenchukky.server.model.Merchant;
import com.kenchukky.server.model.MerchantOrders;
import com.kenchukky.server.model.OrderData;
import com.kenchukky.server.repository.MerchantSqlRepo;
import com.kenchukky.server.repository.UserSqlRepo;

@Service
public class MerchantService {
    
    @Autowired
    private MerchantSqlRepo merchantSqlRepo;

    @Autowired
    private UserSqlRepo userSqlRepo;

    public Optional<Merchant> getMerchantData(String merchantId) {
        return merchantSqlRepo.getMerchantData(merchantId);
    }

    public Optional<OrderData> getOrderData(String orderId) {
        return userSqlRepo.getUserOrder(orderId);
    }

    public boolean confirmOrCancelOrder(String orderId, boolean isConfirmed) {
        return merchantSqlRepo.confirmOrCancelOrder(orderId, isConfirmed);
    }

    @Transactional(rollbackFor=UserException.class)
    public boolean insertOrderIntoUserOrders(OrderData od, Merchant m) {
        return merchantSqlRepo.insertOrderIntoUserOrders(od, m);
    }

    @Transactional(rollbackFor=UserException.class)
    public boolean insertOrderIntoMerchantOrders(OrderData od, Merchant m) {
        return merchantSqlRepo.insertOrderIntoMerchantOrders(od, m);
    }

    public Optional<List<MerchantOrders>> getMerchantRecentOrders(String merchantId) {
        return merchantSqlRepo.getMerchantRecentOrders(merchantId);
    }
}
