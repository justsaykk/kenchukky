package com.kenchukky.server.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import com.kenchukky.server.model.OrderData;
import com.kenchukky.server.model.User;
import com.kenchukky.server.model.UserDiscounts;
import com.kenchukky.server.model.UserOrders;

import static com.kenchukky.server.repository.SqlQueries.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserSqlRepo {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<User> getUserDetails(String userId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_USER_DETAILS, userId);

        if (!rs.next()) {
            return Optional.empty();
        }

        User user = User.create(rs);

        return Optional.of(user);
    }

    public Optional<List<UserDiscounts>> getUserDiscounts(String userId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_USER_DISCOUNTS, userId);

        List<UserDiscounts> udList = new LinkedList<>();
        while (rs.next()) {
            udList.add(UserDiscounts.create(rs));
        }

        if (udList.size() == 0) return Optional.empty();

        return Optional.of(udList);
    }

    public boolean postUserOrderData(OrderData order) {
        return jdbcTemplate.update(POST_USER_ORDER, order.getOrderId(),
                            order.getUserId(), order.getUsername(),
                            order.getTimeOfOrder(), order.getQuantity(),
                            order.getUom(), true) > 0;
    }

    public void postUserOrders() {

    }

    public void getOrCreateMerchant() {

    }

    public Optional<OrderData> getUserOrder(String orderId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_USER_ORDER, orderId);

        if (!rs.next()) {
            return Optional.empty();
        }

        OrderData od = OrderData.create(rs);

        return Optional.of(od);
    }

    public Optional<List<OrderData>> getUserRecentOrders(String userId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_USER_10_LATEST_ORDERS, userId);

        List<OrderData> odList = new LinkedList<>();
        while (rs.next()) {
            OrderData od = OrderData.create(rs);
            odList.add(od);
        }

        if (odList.size() == 0) return Optional.empty();

        return Optional.of(odList);
    }
}
