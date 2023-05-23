package com.kenchukky.server.controller;

import com.kenchukky.server.model.Merchant;
import com.kenchukky.server.model.MerchantOrders;
import com.kenchukky.server.model.OrderData;
import com.kenchukky.server.service.MerchantService;
import com.kenchukky.server.service.NotificationService;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import java.io.StringReader;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/merchant")
@CrossOrigin
public class MerchantController {

  // https://kenchukky-server.up.railway.app/

  @Autowired
  private MerchantService merchantService;

  @Autowired
  private NotificationService notificationService;

  /*
   * GET /api/merchant
   * query - "merchantId"
   * response - {
   *  merchantId: string,
   *  merchantName: string
   * }
   */
  @GetMapping
  @ResponseBody
  public ResponseEntity<String> getMerchantData(
    @RequestParam("merchantId") String merchantId
  ) {
    Optional<Merchant> mOpt = merchantService.getMerchantData(merchantId);

    if (mOpt.isEmpty()) {
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(
          Json
            .createObjectBuilder()
            .add("message", "Merchant Not Found")
            .build()
            .toString()
        );
    }

    return ResponseEntity
      .ok()
      .body(
        Json
          .createObjectBuilder()
          .add("merchantId", mOpt.get().getMerchantId())
          .add("merchantName", mOpt.get().getMerchantName())
          .build()
          .toString()
      );
  }

  /*
     * GET /api/merchant/order
     * query - "orderId"
     * response - {
     *  orderId: string,
        customerId: string,
        customerName: string,
        timeOfOrder: datetime in string format (DD-MM-YYYY HH:mm:ss),
        qty: number,
        uom: string
     * }
     */
  @GetMapping("/order")
  @ResponseBody
  public ResponseEntity<String> getOrderData(
    @RequestParam("orderId") String orderId
  ) {
    Optional<OrderData> odOpt = merchantService.getOrderData(orderId);

    if (odOpt.isEmpty()) {
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(
          Json
            .createObjectBuilder()
            .add("message", "There was a problem retrieving order")
            .build()
            .toString()
        );
    }

    OrderData od = odOpt.get();

    return ResponseEntity
      .ok()
      .body(
        Json
          .createObjectBuilder()
          .add("orderId", orderId)
          .add("customerId", od.getUserId())
          .add("timeOfOrder", od.getTimeOfOrder())
          .add("qty", od.getQty())
          .add("uom", od.getUom())
          .build()
          .toString()
      );
  }

  /*
   * POST - /api/merchant/order
   * body - {
   *  orderId: string
   *  merchantId: string
   *  isConfirmed: boolean
   * }
   * response - {
   *  orderId: string
   *  isConfirmed: boolean
   * }
   */
  @PostMapping("/order")
  @ResponseBody
  public ResponseEntity<String> confirmOrCancelOrder(@RequestBody String body) {
    JsonReader reader = Json.createReader(new StringReader(body));
    JsonObject json = reader.readObject();

    String orderId = json.getString("orderId");
    String merchantId = json.getString("merchantId");
    boolean isConfirmed = json.getBoolean("isConfirmed");

    // confirm order in order_data table
    boolean updated = merchantService.confirmOrCancelOrder(
      orderId,
      isConfirmed
    );

    if (!updated) {
      // if updating order_data table fails
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(
          Json
            .createObjectBuilder()
            .add("message", "There was a problem confirming order status")
            .build()
            .toString()
        );
    }

    if (!isConfirmed) {
      // do nothing until order is confirmed
      return ResponseEntity
        .ok()
        .body(
          Json
            .createObjectBuilder()
            .add("orderId", orderId)
            .add("isConfirmed", isConfirmed)
            .build()
            .toString()
        );
    }

    // insert into user_orders / merchant_orders table once confirmed
    OrderData od = merchantService.getOrderData(orderId).get();
    Merchant m = merchantService.getMerchantData(merchantId).get();

    try {
      // !! TRANSACTIONAL
      boolean userOrderInserted = merchantService.insertOrderIntoUserOrders(
        od,
        m
      );
      boolean merchantOrderInserted = merchantService.insertOrderIntoMerchantOrders(
        od,
        m
      );

      if (!userOrderInserted || !merchantOrderInserted) {
        return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
            Json
              .createObjectBuilder()
              .add("message", "There was a problem confirming order status")
              .build()
              .toString()
          );
      }
    } catch (Exception e) {
      // if transaction fails
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(
          Json
            .createObjectBuilder()
            .add(
              "message",
              "There was a problem creating the order after confirmation"
            )
            .add("detailed_message", e.getMessage())
            .build()
            .toString()
        );
    }
    String userToken = this.notificationService.getToken(od.getUserId());
    this.notificationService.sendNotificationToUser(userToken);
    return ResponseEntity
      .ok()
      .body(
        Json
          .createObjectBuilder()
          .add("orderId", orderId)
          .add("isConfirmed", isConfirmed)
          .build()
          .toString()
      );
  }

  /*
     * GET - /api/merchant/orders
     * query - "merchantId"
     * response - [
            {
                orderId: '124',
                customerId: '123',
                customerName: 'ken',
                timeOfOrder: '21-05-2023 20:12:00'
                qty: 1,
                uom: 'container'
            },
            {
                orderId: '123',
                customerId: '123',
                customerName: 'kenny',
                timeOfOrder: '20-05-2023 14:23:00'
                qty: 2,
                uom: 'container'
            }
        ]
     */
  @GetMapping("/orders")
  @ResponseBody
  public ResponseEntity<String> getMerchantRecentOrders(
    @RequestParam("merchantId") String merchantId
  ) {
    Optional<List<MerchantOrders>> moListOpt = merchantService.getMerchantRecentOrders(
      merchantId
    );

    if (moListOpt.isEmpty()) {
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(
          Json
            .createObjectBuilder()
            .add("message", "There was a problem retrieving orders")
            .build()
            .toString()
        );
    }

    JsonArrayBuilder jab = Json.createArrayBuilder();
    moListOpt
      .get()
      .stream()
      .forEach(mo -> {
        jab.add(mo.toJSON());
      });

    return ResponseEntity.ok().body(jab.build().toString());
  }
}
