package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.Classes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassesRepository extends JpaRepository<Classes, Integer> {
    List<Classes> findByStatusOrderByIdDesc(int status);

    List<Classes> findByStatusNotOrderByIdDesc(int status);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, int id);
}