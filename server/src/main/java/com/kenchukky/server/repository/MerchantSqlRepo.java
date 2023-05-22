package com.kenchukky.server.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import com.kenchukky.server.model.Merchant;
import com.kenchukky.server.model.MerchantOrders;
import com.kenchukky.server.model.OrderData;

import static com.kenchukky.server.repository.SqlQueries.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Repository
public class MerchantSqlRepo {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";

    public Optional<Merchant> getMerchantData(String merchantId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_MERCHANT_DATA, merchantId);

        if (!rs.next()) {
            return Optional.empty();
        }

        Merchant m = Merchant.create(rs);

        return Optional.of(m);
    } 

    public boolean confirmOrCancelOrder(String orderId, boolean isConfirmed) {
        return jdbcTemplate.update(CONFIRM_OR_CANCEL_ORDER, isConfirmed, orderId) > 0;
    }

    public boolean insertOrderIntoUserOrders(OrderData od, Merchant m) {
        SimpleDateFormat df = new SimpleDateFormat(DATE_PATTERN);
        String date = df.format(new Date());

        return jdbcTemplate.update(MERCHANT_UPDATE_USER_ORDERS, od.getOrderId(), od.getUserId(),
                    m.getMerchantId(), m.getMerchantName(), od.getTimeOfOrder(), date, 
                    1000*od.getQty(), od.getQty(), od.getUom()) > 0;
    }

    public boolean insertOrderIntoMerchantOrders(OrderData od, Merchant m) {
        
        return jdbcTemplate.update(MERCHANT_UPDATE_MERCHANT_ORDERS, od.getOrderId(), od.getUserId(), m.getMerchantId(),
                            od.getTimeOfOrder(), od.getQty(), od.getUom(), od.isOrderConfirmed()) > 0;
    }

    public Optional<List<MerchantOrders>> getMerchantRecentOrders(String merchantId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_MERCHANT_10_LATEST_ORDERS, merchantId);

        List<MerchantOrders> moList = new LinkedList<>();
        while (rs.next()) {
            MerchantOrders mo = MerchantOrders.create(rs);
            moList.add(mo);
        }

        if (moList.size() == 0) return Optional.empty();

        return Optional.of(moList);
    }
}
