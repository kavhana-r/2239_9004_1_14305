package com.mintmatrix.model;

import jakarta.persistence.Id;

public class Currency {

    @Id
    private String code;
    private String name;
    private Double exchangeRate;
    
}
