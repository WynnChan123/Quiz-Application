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

  public ResponseEntity<String> updateQuestion(Integer id, Question question) {
    try{
      //Find if question with the id exists
      Question existingQuestion = questionDao.findById(id).orElse(null);
      if(existingQuestion == null) {
        return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
      }

      //Update the existing question with new values
      existingQuestion.setQuestionTitle(question.getQuestionTitle());
      existingQuestion.setOption1(question.getOption1());
      existingQuestion.setOption2(question.getOption2());
      existingQuestion.setOption3(question.getOption3());
      existingQuestion.setOption4(question.getOption4());
      existingQuestion.setRightAnswer(question.getRightAnswer());
      questionDao.save(existingQuestion);
    }catch(Exception e){
      e.printStackTrace();
      return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return new ResponseEntity<>("Updated successfully", HttpStatus.OK);
  }

  public ResponseEntity<String> deleteQuestion(Integer id) {
    try{
      Question existingQuestion = questionDao.findById(id).orElse(null);
      if(existingQuestion == null) {
        return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
      }

      // Remove question from any quizzes that contain it
      List<Quiz> quizzes = quizDao.findQuizzesByQuestionId(id);
      for(Quiz quiz : quizzes) {
          quiz.getQuestions().remove(existingQuestion);
          quizDao.save(quiz);
      }

      questionDao.deleteById(id);
    }catch(Exception e){
      e.printStackTrace();
      return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);
  }

}
