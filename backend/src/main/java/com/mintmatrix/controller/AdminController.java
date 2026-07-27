package com.mintmatrix.controller;

import com.mintmatrix.repository.TransactionRepository;
import com.mintmatrix.repository.UserRepository;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {


    private final UserRepository userRepository;

    private final TransactionRepository transactionRepository;


    public AdminController(
            UserRepository userRepository,
            TransactionRepository transactionRepository) {

        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }



    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {

        return ResponseEntity.ok(
                userRepository.findAll()
        );
    }





    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {


        userRepository.deleteById(id);


        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }





    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {


        Map<String, Object> stats = new HashMap<>();


        stats.put(
                "totalUsers",
                userRepository.count()
        );


        stats.put(
                "totalTransactions",
                transactionRepository.count()
        );


        return ResponseEntity.ok(stats);
    }
}