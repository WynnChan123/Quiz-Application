package com.quiz.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.quiz.demo.dao.UserDao;
import com.quiz.demo.model.User;

@Service
public class UserService {
  @Autowired
  UserDao userDao;

  public ResponseEntity<List<User>> getAllusers(){

    try{
        List<User> users = userDao.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
     }catch(Exception e){
      e.printStackTrace();
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
     }
    
  }

  public ResponseEntity<String> createUser(User user){
    try{
      userDao.save(user);
      return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
    }catch(Exception e){
      e.printStackTrace();
      return new ResponseEntity<>("Error creating user", HttpStatus.BAD_REQUEST);
    }
  } 

}
