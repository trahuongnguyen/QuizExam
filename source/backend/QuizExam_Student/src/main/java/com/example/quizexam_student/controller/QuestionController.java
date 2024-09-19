package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.QuestionRequest;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.Question;
import com.example.quizexam_student.service.QuestionService;
import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/question")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping("/{subjectId}")
    public List<QuestionResponse> getAllQuestionsBySubjectId(@PathVariable int subjectId) {
        return questionService.getAllQuestionsBySubjectId(subjectId);
    }

    @PostMapping("")
    public Question addQuestion(@RequestBody @Valid QuestionRequest questionRequest) {
        return questionService.saveQuestion(questionRequest);
    }
}
