package com.example.demo.repository;

import java.lang.StackWalker.Option;
import java.util.Currency;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CurrencyRepository extends JpaRepository<Currency,Long>{
    Option<Currency>findByCode
    
}
