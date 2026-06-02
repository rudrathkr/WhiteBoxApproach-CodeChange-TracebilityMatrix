package com.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class OrderController {

    @GetMapping("/api/orders")
    public String orders() {
        return "ORDERS";
    }
}
