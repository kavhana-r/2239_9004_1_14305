package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CurrencyRepository extends JpaRepository{

    Optional<com.example.demo.model.Currency>findByCode(String code);
    
}
