package com.example.quizexam_student.controller;

import com.example.quizexam_student.entity.Sem;
import com.example.quizexam_student.service.SemService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sem")
@RequiredArgsConstructor
@Validated
public class SemController {
    private final SemService semService;

    @GetMapping("")
    public List<Sem> getAllSemesters() {
        return semService.getAllSem();
    }
}