package com.example.demo.model;

import jakarta.persistence.Column;

public class Category {
    private Long id;

    @Column(nullable = false,unique = true)
    private String name;
    @Column(nullable = =)
    private TransactionType type;

    
}