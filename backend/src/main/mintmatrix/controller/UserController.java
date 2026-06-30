
package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService ser;


    @PostMapping("/create")
    public User createUserDetails(@RequestBody User user) {
        return ser.createDetails(user);
    }

    @GetMapping("/fetch")
    public List<User> fetchDetails() {
        return ser.fetchDetail();
    }

    @GetMapping("/fetchid/{id}")
    public Optional<User> fetchById(@PathVariable Long id) {
        return ser.fetchDataById(id);
    }

   }
