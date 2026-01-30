package com.quiz.demo.dao;
import com.quiz.demo.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {
  @Query(value = "Select u from User u WHERE u.username = :username ORDER BY u.totalScore DESC", nativeQuery = true)
  List<User> findUserByUsernameOrderedByScore(@Param("username") String username);

}
