package com.example.mintmatrix.model;

import jakarta.persistence.Column;
import jakarta.persistence.Id;

public class Currency {
    @Id
    @Column(nullable = false)
    private String code;

    @Colum
    private String name;
    private Double exchangeRate;



    
}
