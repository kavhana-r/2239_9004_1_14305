package com.example.mintmatrix.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

public class Currency {
    @Id
    @GeneratedValue(strategy = )
    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double exchangeRate;



    
}
