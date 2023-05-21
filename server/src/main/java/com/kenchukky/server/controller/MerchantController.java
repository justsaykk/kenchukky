package com.kenchukky.server.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.kenchukky.server.model.Merchant;
import com.kenchukky.server.service.MerchantService;

import jakarta.json.Json;

/*
 
 
When customer submits an order, merchant receives a notification of the order data to verify
 
- GET order data 
 
 
{
    orderId: string,
    customerId: string,
    customerName: string,
    timeOfOrder: datetime in string format (DD-MM-YYYY HH:mm),
    qty: number,
    uom: string
}
 
e.g. {
    orderId: '123',
    customerId: '123',
    customerName: 'ken',
    timeOfOrder: '20-05-2023 14:23'
    qty: 2,
    uom: 'container'
}
 
 
Merchant confirms or cancels customer's order after verifying customer brought the stated quantity of personal takeaway containers
- POST order 
 
orderStatus: {
    orderId: string,
    orderConfirmed: boolean
}
 
e.g. {
    orderId: '123',
    orderConfirmed: true
}
 
 
Merchant can see 10 most recent orders 
- GET orders
 
 
e.g. orders = [
    {
        orderId: '124',
        customerId: '123',
        customerName: 'ken',
        timeOfOrder: '21-05-2023 20:12'
        qty: 1,
        uom: 'container'
    },
    {
        orderId: '123',
        customerId: '123',
        customerName: 'kenny',
        timeOfOrder: '20-05-2023 14:23'
        qty: 2,
        uom: 'container'
    }
]
 */

@RestController
@RequestMapping("/api/merchant")
@CrossOrigin()
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    /*
     * GET /api/merchant
     * header - "merchantId"
     */
    @GetMapping
    @ResponseBody
    public ResponseEntity<String> getMerchantData(@RequestHeader("merchantId") String merchantId) {
        
        Optional<Merchant> mOpt = merchantService.getMerchantData(merchantId);

        if (mOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Json.createObjectBuilder()
                    .add("message", "Merchant Not Found")
                    .build().toString());
        }

        return ResponseEntity.ok().body(Json.createObjectBuilder()
                                    .add("merchantId", mOpt.get().getMerchantId())
                                    .add("merchantName", mOpt.get().getMerchantName())
                                    .build().toString());
    }

}
