package com.example.mintmatrix.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Currency;

public interface CurrencyRepository extends JpaRepository<Currency,Long>{
    Optional<Currency>findByCode(String code);
    
}
