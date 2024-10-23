package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.StudentAnswerRequest;
import com.example.quizexam_student.entity.StudentAnswer;
import com.example.quizexam_student.service.StudentAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student-answers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class StudentAnswerController {
    private final StudentAnswerService studentAnswerService;

    @PostMapping
    public StudentAnswerRequest submitAnswer(@RequestBody StudentAnswerRequest studentAnswerRequest) {
        return studentAnswerService.saveStudentAnswers(studentAnswerRequest);
    }
}