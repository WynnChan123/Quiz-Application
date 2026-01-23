package com.quiz.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

  @GetMapping("/")
  public String home() {
    return "Quiz Application API is running! Endpoints: /question, /quiz, /health";
  }

  @GetMapping("/health")
  public String health() {
    return "UP";
  }
}
