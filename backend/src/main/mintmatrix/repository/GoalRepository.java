package com.mintmatrix.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mintmatrix.model.Goal;
import com.mintmatrix.model.User;
@Repository
public interface GoalRepository extends JpaRepository<Goal,Long> {
    List<Goal>findByUser(User user);
    
}
