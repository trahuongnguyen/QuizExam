package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Integer> {
}