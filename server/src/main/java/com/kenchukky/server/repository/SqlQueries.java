package com.kenchukky.server.repository;

public class SqlQueries {
    
    public static final String GET_USER_DETAILS = "select * from users where user_id = ? ";

    public static final String GET_USER_DISCOUNTS = "select * from user_discounts where user_id = ?";

    public static final String POST_USER_ORDER = "insert into order_data(order_id, user_id, username, time_of_order, quantity, uom, confirmed) value(?, ?, ?, ?, ?, ?, ?)";

    public static final String GET_USER_ORDER = "select * from order_data where order_id = ?";

    public static final String GET_USER_10_LATEST_ORDERS = "select * from user_orders order by time_of_order descending where user_id = ?";
    
}
