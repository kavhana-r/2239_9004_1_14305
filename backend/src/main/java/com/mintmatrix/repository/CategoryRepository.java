package com.mintmatrix.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mintmatrix.enums.TransactionType;
import com.mintmatrix.model.Category;
@Repository
public interface CategoryRepository extends JpaRepository<Category,Long>{
List<Category>findByType(TransactionType type);
    
}
