package com.example.quizexam_student.service;

import com.example.quizexam_student.entity.Level;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface LevelService {
    List<Level> getAllLevels();
}
