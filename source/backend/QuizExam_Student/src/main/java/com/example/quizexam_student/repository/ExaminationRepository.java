package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.Examination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Integer> {
    List<Examination> findAllByOrderByIdDesc();
    List<Examination> findAllByStatus(int status);
    boolean existsByCode(String code);
}
