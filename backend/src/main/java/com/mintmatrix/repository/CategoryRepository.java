package com.mintmatrix.repository;

import com.mintmatrix.model.Category;
import com.mintmatrix.model.TransactionType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByType(TransactionType type);

    boolean existsByName(String name);

    Optional<Category> findByName(String name);
}