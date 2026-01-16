package com.quiz.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import com.quiz.demo.model.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.quiz.demo.dao.QuestionDao;
import com.quiz.demo.dao.QuizDao;
import com.quiz.demo.model.Question;
import com.quiz.demo.model.QuestionWrapper;
import com.quiz.demo.model.Quiz;

@Service
public class QuizService {

  @Autowired
  QuizDao quizDao;
  @Autowired
  QuestionDao questionDao;

  public ResponseEntity<String> createQuiz(String category, int numQ, String title) {

    List<Question> questions = questionDao.findRandomQuestionsByCategory(category, numQ);
    Quiz quiz = new Quiz();
    quiz.setTitle(title);
    quiz.setQuestions(questions);
    quizDao.save(quiz);

    return new ResponseEntity<>("Success", HttpStatus.CREATED);

  }

  public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
    Optional<Quiz> quiz = quizDao.findById(id);
    if (quiz.isPresent()) {
      List<Question> questionsFromDB = quiz.get().getQuestions();
      List<QuestionWrapper> questionsForUser = new ArrayList<>();
      for (Question q : questionsFromDB) {
        questionsForUser.add(new QuestionWrapper(q.getId(), q.getQuestionTitle(), q.getOption1(), q.getOption2(), q.getOption3(), q.getOption4()));
      }
      return new ResponseEntity<>(questionsForUser, HttpStatus.OK);
    }
    return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
  }

  public ResponseEntity<Integer> calculateResult(Integer id, List<Response>responses){
    Quiz quiz = quizDao.findById(id).get();
    List<Question> questions = quiz.getQuestions();
    int right = 0;
    
    for(Response response: responses){
      for(Question question : questions){
        if(question.getId().equals(response.getId())){
          if(response.getResponse().equals(question.getRightAnswer())){
            right++;
          }
          break;
        }
      }
    }
    return new ResponseEntity<>(right, HttpStatus.OK);
  }

}
