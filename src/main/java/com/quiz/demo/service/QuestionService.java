package com.quiz.demo.service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.quiz.demo.dao.QuestionDao;
import com.quiz.demo.dao.QuizDao;
import com.quiz.demo.model.Question;
import com.quiz.demo.model.QuestionWrapper;
import com.quiz.demo.model.Quiz;

@Service
public class QuestionService {
  @Autowired
  QuestionDao questionDao;
  @Autowired
  QuizDao quizDao;

  public ResponseEntity<List<Question>> getAllQuestions() {
    try{
      return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);
    }catch(Exception e){
      e.printStackTrace();
    }
    return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
  }

  public ResponseEntity<List<Question>> getQuestionsByCategory(String category){
    try{
      return new ResponseEntity<>(questionDao.findByCategoryIgnoreCase(category), HttpStatus.OK);
    }catch(Exception e){
      e.printStackTrace();
    }
    return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
  }

  public ResponseEntity<String> addQuestion(Question question) {
    questionDao.save(question);
    return new ResponseEntity<>("success", HttpStatus.CREATED);
  }

}
