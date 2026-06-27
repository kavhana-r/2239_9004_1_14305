package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Category;
import com.example.demo.model.Transaction;
@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
    List<Category>findByType(Transaction type);
    
}
