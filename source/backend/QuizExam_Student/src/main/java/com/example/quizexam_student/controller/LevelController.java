package com.example.quizexam_student.controller;

import com.example.quizexam_student.entity.Level;
import com.example.quizexam_student.service.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/level")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class LevelController {
    private final LevelService levelService;
    @GetMapping
    public List<Level> getAllLevels() {
        return levelService.getAllLevels();
    }
}
