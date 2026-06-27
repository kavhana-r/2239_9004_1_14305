package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Id;

public class Currency {
    @Id
    @(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable=false)
    private Double exchangeRate;

    
    
}
