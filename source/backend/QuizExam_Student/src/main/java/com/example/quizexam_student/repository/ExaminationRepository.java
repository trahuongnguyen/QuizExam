package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.Examination;
import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Integer> {
    //List<Examination> findAllBySubjectOrderByIdDesc(Subject subject);
    List<Examination> findAllByStatus(int status);
    boolean existsByCode(String code);
    List<Examination> findTop3BySubjectOrderByIdDesc(Subject subject);
    Examination findByMarksContainingAndStatus(Mark marks, int status);
}
