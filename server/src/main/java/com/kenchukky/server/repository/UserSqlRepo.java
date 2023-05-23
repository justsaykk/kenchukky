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

    public boolean createUser(User user) {
        return jdbcTemplate.update(CREATE_USER, user.getUserId(), user.getUsername(),
                                            user.getFirstName(), user.getLastName(), user.getTotalPoints()) > 0;
        
    }

    public int getUserPoints(String userId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_USER_POINTS, userId);

        int total = 0;
        while (rs.next()) {
            total += rs.getInt("points_received");
        }

        return total;
    }

    public boolean updateUserPoints(String userId, int points) {
        return jdbcTemplate.update(UPDATE_USER_POINTS, points, userId) > 0;
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
        return jdbcTemplate.update(POST_ORDER_DATA,
                            order.getUserId(), order.getUsername(),
                            order.getTimeOfOrder(), order.getQty(),
                            order.getUom(), false) > 0;
    }

    public Optional<OrderData> getUserOrder(String orderId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_USER_ORDER, orderId);

        if (!rs.next()) {
            return Optional.empty();
        }

        OrderData od = OrderData.create(rs);

        return Optional.of(od);
    }

    public Optional<List<UserOrders>> getUserRecentOrders(String userId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_USER_10_LATEST_ORDERS, userId);

        List<UserOrders> uoList = new LinkedList<>();
        while (rs.next()) {
            UserOrders uo = UserOrders.create(rs);
            uoList.add(uo);
        }

        if (uoList.size() == 0) return Optional.empty();

        return Optional.of(uoList);
    }
}
