package com.quiz.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.quiz.demo.model.Quiz;

public interface QuizDao extends JpaRepository<Quiz, Integer> {
    @Query(value = "Select q from Quiz q JOIN q.questions qu WHERE qu.id = :id")
    List<Quiz> findQuizzesByQuestionId(@Param("id")Integer id);
}
