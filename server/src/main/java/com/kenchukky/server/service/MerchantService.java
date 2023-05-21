package com.kenchukky.server.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kenchukky.server.model.Merchant;
import com.kenchukky.server.repository.MerchantSqlRepo;

@Service
public class MerchantService {
    
    @Autowired
    private MerchantSqlRepo merchantSqlRepo;

    public Optional<Merchant> getMerchantData(String merchantId) {
        return merchantSqlRepo.getMerchantData(merchantId);
    }
}
