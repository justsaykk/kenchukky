package com.kenchukky.server.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/*
 * When merchant opens app, he sees his info displayed on the home page
 
- GET merchant data
 
 
{
    merchantId: string,
    merchantName: string,
}
 
e.g. {
    merchantId: 123,
    merchantName: 'kentucky fried chicken'
}
 
 
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
public class MerchantController {

   
}
