package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.demo.model.Currency;
@Repository
public interface CurrencyRepository extends JpaRepository{

    Optional<Currency>findByCode(String code);
    
}
