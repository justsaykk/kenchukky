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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.kenchukky.server.model.NotificationToken;
import com.kenchukky.server.model.OrderData;
import com.kenchukky.server.model.User;
import com.kenchukky.server.model.UserDiscounts;
import com.kenchukky.server.repository.UserSqlRepo;
import com.kenchukky.server.service.NotificationService;
import com.kenchukky.server.service.UserService;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;

@RestController
@RequestMapping("/api/user")
@CrossOrigin()
public class UserController {

    @Autowired
    private UserSqlRepo userSqlRepo;

    @Autowired
    private UserService orderSvc;

    @Autowired
    private NotificationService notificationSvc;
    
    /*
     * GET /api/user
     * header - "userId"
     */
    @GetMapping(produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> getUserByUID(@RequestHeader("userId") String userId) {

        Optional<User> uOpt = userSqlRepo.getUserDetails(userId);

        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder()
                            .add("message", "User Not Found")
                            .build().toString());
        }

        return ResponseEntity.ok().body(uOpt.get().toJSON().toString());
    }

    /*
     * GET /api/user/discounts
     * header - "userId"
     * response - {
     *  discountName: string,
        discountAmount: number,
        discountCreatedAt: datetime in string format (DD-MM-YYYY HH:mm),
        discountIsRedeemed: boolean,
        discountRedeemedAt: date,
     * }
     */
    @GetMapping(path="/discounts", produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> getUserDiscountsByUID(@RequestHeader("userId") String userId) {

        Optional<List<UserDiscounts>> udOpt = userSqlRepo.getUserDiscounts(userId);

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

    // to test
    /*
     * POST /api/user/order
     * header - "merchantId"
     * body - {
     *  orderId: string,
        userId: string,
        username: string,
        timeOfOrder: datetime in string format (DD-MM-YYYY HH:mm),
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
    public ResponseEntity<String> postUserOrder(@RequestHeader("merchantId") String merchantId,
                                                @RequestBody OrderData order) {
        
        boolean orderCreated;
        try {
            orderCreated = userSqlRepo.postUserOrderData(order);
            String merchantToken = this.notificationSvc.getToken(merchantId);

            // also update user_orders 
            // - use merchant id for merchant name + calculate num of points by retrieving points per uom

            if (!orderCreated || merchantId == merchantToken) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder()
                            .add("message", "There was a problem creating the order")
                            .build().toString());
            }
            
            this.notificationSvc.sendNotification(merchantToken);
            return ResponseEntity.status(HttpStatus.CREATED).body(Json.createObjectBuilder()
                                .add("message", "Order created")
                                .build().toString());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Json.createObjectBuilder()
                            .add("message", "There was a problem creating the order")
                            .add("detailed_message", e.getMessage())
                            .build().toString());
        }
    }

    // to test
    /*
     * GET /api/user/order
     * header - "orderId"
     * response - {
     *  orderId: string,
        orderConfirmed: boolean
     * }
     */
    @GetMapping(path="/order", produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> getUserOrder(@RequestHeader("orderId") String orderId) {

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

    // to test
    /*
     * GET /api/user/orders
     * header - "userId"
     * response - {
     *  orderId: '124',
        merchantId: '123',
        merchantName: 'kentucky fried chicken',
        timeOfOrder: '21-05-2023 20:12'
        transactionDate: datetime in string format (DD-MM-YYYY HH:mm),
        pointsRecevied: number,
        qty: 1,
        uom: 'container'
     * }
     */
    @GetMapping(path="/orders")
    @ResponseBody
    public ResponseEntity<String> getUserRecentOrders(@RequestHeader("userId") String userId) {

        Optional<List<OrderData>> odListOpt = userSqlRepo.getUserRecentOrders(userId);

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
