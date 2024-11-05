package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LevelRepository extends JpaRepository<Level, Integer> {
    List<Level> findAllByStatus(int status);
    Level findByIdAndStatus(int id, int status);
    Level findByName(String name);
}