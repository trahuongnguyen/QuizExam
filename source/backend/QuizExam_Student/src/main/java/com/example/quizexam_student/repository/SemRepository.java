package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.Sem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemRepository extends JpaRepository<Sem, Integer> {
    Sem findByName(String name);
}
