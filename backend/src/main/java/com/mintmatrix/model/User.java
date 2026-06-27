package com.mintmatrix.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(nullable = false,unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String preferredCurrency;

    private List<Transaction>transaction;
    private List<Budget> budgets;
    private List<Goal>goals;
    
   @OneToMany(
    mappedBy = "user"
   )

   @OneToMany(
    mappedBy="user"
   )
   @OneToMany(
    mappedBy="user"
   )

   
    
}
