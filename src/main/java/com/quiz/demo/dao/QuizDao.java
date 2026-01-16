package com.quiz.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.quiz.demo.model.Quiz;

public interface QuizDao extends JpaRepository<Quiz, Integer> {

}
