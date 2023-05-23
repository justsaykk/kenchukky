package com.kenchukky.server.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.kenchukky.server.model.NotificationToken;
import com.kenchukky.server.model.OrderData;
import com.kenchukky.server.model.User;
import com.kenchukky.server.model.UserDiscounts;
import com.kenchukky.server.model.UserOrders;
import com.kenchukky.server.repository.UserSqlRepo;
import com.kenchukky.server.service.NotificationService;
import com.kenchukky.server.service.UserService;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;

@RestController
@RequestMapping("/api/user")
@CrossOrigin()
public class UserController {

    // https://kenchukky-server.up.railway.app/

    @Autowired
    private UserSqlRepo userSqlRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationSvc;
    
    /*
     * GET /api/user
     * query - "userId"
     */
    @GetMapping(produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> getUserByUID(@RequestParam("userId") String userId) {

        // retrieve points from user_orders (TO DO: update user table)
        int points = userService.getUserPoints(userId);

        Optional<User> uOpt = userSqlRepo.getUserDetails(userId);

        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder()
                            .add("message", "User Not Found")
                            .build().toString());
        }

        User user = uOpt.get();
        user.setTotalPoints(points);

        return ResponseEntity.ok().body(user.toJSON().toString());
    }

    /*
     * POST /api/user
     * body - {
     *  userId: string,
     *  username: string,
     *  firstName: string,
     *  lastName: string,
     *  totalPoints: number
     * }
     * response - {
     *  userId: string,
     *  username: string,
     *  firstName: string,
     *  lastName: string,
     *  totalPoints: number
     * }
     */
    @PostMapping(consumes=MediaType.APPLICATION_JSON_VALUE, produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> createUser(@RequestBody User user) {
        boolean created = userService.createUser(user);

        if (!created) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder()
                            .add("message", "User Not Created")
                            .build().toString());
        }

        return ResponseEntity.ok().body(Json.createObjectBuilder()
                                    .add("userId", user.getUserId())
                                    .add("username", user.getUsername())
                                    .add("firstName", user.getFirstName())
                                    .add("lastName", user.getLastName())
                                    .add("totalPoints", user.getTotalPoints())
                                    .build().toString());

    }

    /*
     * GET /api/user/discounts
     * query - "userId"
     * response - {
     *  discountName: string,
        discountAmount: number,
        discountCreatedAt: datetime in string format (DD-MM-YYYY HH:mm:ss),
        discountIsRedeemed: boolean,
        discountRedeemedAt: date,
     * }
     */
    @GetMapping(path="/discounts", produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> getUserDiscountsByUID(@RequestParam("userId") String userId) {

        Optional<List<UserDiscounts>> udOpt = userService.getUserDiscounts(userId);

        if (udOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder()
                            .add("message", "User has no discounts available")
                            .build().toString());
        }

        JsonArrayBuilder jab = Json.createArrayBuilder();
        udOpt.get().stream().forEach(ud -> {
            jab.add(ud.toJSON());
        });

        return ResponseEntity.ok().body(jab.build().toString());
    }

    /*
     * POST /api/user/order
     * query - "merchantId"
     * body - {
     *  userId: string,
        username: string,
        timeOfOrder: datetime in string format (DD-MM-YYYY HH:mm:ss),
        qty: number,
        uom: string
     * }
     * response - {
     *  message: string,
     *  detailed_message?: string
     * }
     */
    @PostMapping(path="/order", consumes=MediaType.APPLICATION_JSON_VALUE, produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> postUserOrderData(@RequestParam("merchantId") String merchantId,
                                                @RequestBody OrderData order) {
        
        boolean orderCreated;
        try {
            // insert into order_data table - TRANSACTIONAL
            orderCreated = userService.postUserOrderData(order);
            String merchantToken = this.notificationSvc.getToken(merchantId);
            String senderToken = this.notificationSvc.getToken(order.getUserId());

            if (!orderCreated || merchantId == merchantToken) {
                // if inserting into order_data table fails
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder()
                            .add("message", "There was a problem creating the order")
                            .build().toString());

            }
            this.notificationSvc.sendNotificationToMerchant(merchantId, senderToken, order);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder()
                            .add("message", "There was a problem creating the order")
                            .add("detailed_message", e.getMessage())
                            .build().toString());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Json.createObjectBuilder()
                                .add("message", "Order created")
                                .build().toString());
    }

    /*
     * GET /api/user/order
     * query - "orderId"
     * response - {
     *  orderId: string,
        orderConfirmed: boolean
     * }
     */
    @GetMapping(path="/order", produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> getUserOrder(@RequestParam("orderId") String orderId) {

        Optional<OrderData> odOpt = userSqlRepo.getUserOrder(orderId);

        if (odOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder().add("message", "There was a problem retrieving order status")
                    .build().toString());
        }

        OrderData od = odOpt.get();

        return ResponseEntity.ok().body(Json.createObjectBuilder()
                                    .add("orderId", orderId)
                                    .add("orderConfirmed", od.isOrderConfirmed())
                                    .build().toString());
    }

    /*
     * GET /api/user/orders
     * query - "userId"
     * response - {
     *  orderId: '124',
        merchantId: '123',
        merchantName: 'kentucky fried chicken',
        timeOfOrder: '21-05-2023 20:12:00'
        transactionDate: datetime in string format (DD-MM-YYYY HH:mm:00),
        pointsRecevied: number,
        qty: 1,
        uom: 'container'
     * }
     */
    @GetMapping(path="/orders")
    @ResponseBody
    public ResponseEntity<String> getUserRecentOrders(@RequestParam("userId") String userId) {

        Optional<List<UserOrders>> odListOpt = userSqlRepo.getUserRecentOrders(userId);

        if (odListOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder()
                            .add("message", "There was a problem retrieving orders")
                            .build().toString());
        }

        JsonArrayBuilder jab = Json.createArrayBuilder();
        odListOpt.get().stream().forEach(od -> {
            jab.add(od.toJSON());
        });

        return ResponseEntity.ok().body(jab.build().toString());
    }

    @PostMapping(path = "/token")
    @ResponseBody
    public ResponseEntity<String> postToken(
        @RequestBody NotificationToken token
    ) {
        this.notificationSvc.saveToken(token);
        return new ResponseEntity<String>(HttpStatus.OK);
    }
}
