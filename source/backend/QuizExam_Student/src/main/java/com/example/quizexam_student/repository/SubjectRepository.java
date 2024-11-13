package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.Sem;
import com.example.quizexam_student.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    Subject findByName(String name);
    List<Subject> findByStatus(int status);

    List<Subject> findBySemAndStatus(Sem sem, int status);

    List<Subject> findAllBySemAndStatusOrderByIdDesc(Sem sem, int status);

    Subject findByIdAndStatus(int id, int status);
}
