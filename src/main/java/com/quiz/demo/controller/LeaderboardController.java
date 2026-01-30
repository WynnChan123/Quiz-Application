package com.quiz.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quiz.demo.model.User;
import com.quiz.demo.service.UserService;

@RestController
@RequestMapping("leaderboard")
public class LeaderboardController{
  @Autowired
  UserService userService;
  @GetMapping("allUsers")
  public ResponseEntity<List<User>> getAllUsers(){
    return userService.getAllusers();
  }

  @PostMapping("createUser")
  public ResponseEntity<String> createUser(@RequestBody User user){
    return userService.createUser(user);
  }
}
