package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mintmatrix.model.Budget;
import com.mintmatrix.model.User;
@Repository
public interface BudgetRepository extends JpaRepository<Budget,Long>{
    List<com.example.demo.model.Budget>findByUser(User user);
    Optional<com.example.demo.model.Budget>findByUserAndMonthAndYear(User user,Integer month,Integer year);

    
}
