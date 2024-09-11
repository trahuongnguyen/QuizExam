package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<StudentDetail, Integer> {
    StudentDetail findStudentDetailByUser(User user);
    StudentDetail findByUser(User user);
}
