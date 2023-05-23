package com.kenchukky.server.repository;

public class SqlQueries {
    
    public static final String GET_USER_DETAILS = "select * from users where user_id = ? ";

    public static final String CREATE_USER = "insert into users(user_id, username, first_name, last_name, total_points) value(?, ?, ?, ?, ?)";

    public static final String GET_USER_POINTS = "select points_received from user_orders where user_id = ?";

    public static final String GET_USER_DISCOUNTS = "select * from user_discounts where user_id = ?";

    public static final String POST_ORDER_DATA = "insert into order_data(user_id, username, time_of_order, quantity, uom, confirmed) value(?, ?, STR_TO_DATE(?, '%d-%m-%Y %H:%i:%s'), ?, ?, ?)";

    public static final String GET_USER_ORDER = "select * from order_data where order_id = ?";

    public static final String GET_USER_10_LATEST_ORDERS = "select * from user_orders where user_id = ? order by time_of_order desc";

    //

    public static final String GET_MERCHANT_DATA = "select * from merchants where merchant_id = ?";

    public static final String CONFIRM_OR_CANCEL_ORDER = "update order_data set confirmed = ? where order_id = ?";

    public static final String MERCHANT_UPDATE_USER_ORDERS = "insert into user_orders(order_id, user_id, merchant_id, merchant_name, time_of_order, transaction_date, " + 
                                                            "points_received, quantity, uom) value(?, ?, ?, ?, ?, ?, ?, ?, ?)";

    public static final String MERCHANT_UPDATE_MERCHANT_ORDERS = "insert into merchant_orders(order_id, customer_id, merchant_id, time_of_order, quantity, uom, confirmed) " +
                                                                    "value(?, ?, ?, ?, ?, ?, ?)";

    public static final String GET_MERCHANT_10_LATEST_ORDERS = "select * from merchant_orders where merchant_id = ? order by time_of_order desc";


}
