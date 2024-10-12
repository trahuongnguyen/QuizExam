package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.Classes;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<StudentDetail, Integer> {
    StudentDetail findStudentDetailByUser(User user);

    StudentDetail findByUser(User user);

    boolean existsByRollPortal(String rollPortal);

    boolean existsByRollNumber(String rollNumber);

    boolean existsByRollPortalAndUserNot(String rollPortal, User user);

    boolean existsByRollNumberAndUserNot(String rollNumber, User user);

    List<StudentDetail> findAllByUserIdIn(List<Integer> users);

    List<StudentDetail> findAllBy_classIn(List<Classes> classes);

}
