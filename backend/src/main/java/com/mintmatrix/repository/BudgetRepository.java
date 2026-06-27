package com.mintmatrix.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mintmatrix.model.Budget;
import com.mintmatrix.model.User;
@Repository
public interface BudgetRepository extends JpaRepository<Budget,Long>{
    List<Budget>findByUser(User user);
    Optional<Budget>findByUserAndMonthAndYear(User user,Integer month,Integer year);

    
}
