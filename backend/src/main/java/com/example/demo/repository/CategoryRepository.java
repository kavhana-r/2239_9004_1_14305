package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<CategoryRepository,Long> {
    List<Category>findByType(TransactionType)
    
}
