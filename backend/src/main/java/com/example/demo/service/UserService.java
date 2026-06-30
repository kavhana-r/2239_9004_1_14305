package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.UserRepository;

@Service
public class UserService {

  @Autowired
  UserRepository repo;

  public User createDetails(User user){
    return repo.save(user);
  }

  public List<User> fetchDetail(){
    return repo.findAll();
  }

  public Optional<User> fetchDataById(Long id){
    return repo.findById(id);
  }
}

