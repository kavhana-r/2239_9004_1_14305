package com.example.demo.repository;

import java.util.Currency;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CurrencyRepository extends JpaRepository<Currency,Long>{
    Optional<Currency>findByCode(String code);
    
}
