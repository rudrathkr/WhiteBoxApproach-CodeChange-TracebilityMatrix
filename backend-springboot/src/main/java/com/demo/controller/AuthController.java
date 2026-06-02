package com.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/api/login")
    public String login() {
        return "SUCCESS";
    }
}
