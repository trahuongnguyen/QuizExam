package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.ExaminationRequest;
import com.example.quizexam_student.bean.response.ExaminationResponse;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.Answer;
import com.example.quizexam_student.entity.Examination;
import com.example.quizexam_student.service.ExaminationService;
import com.example.quizexam_student.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exam")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
@PreAuthorize("permitAll()")
public class ExaminationController {

    private final ExaminationService examinationService;

    @GetMapping("/{examinationId}")
    public ExaminationResponse getDetailExamination(@PathVariable int examinationId) {
        return examinationService.getDetailExamination(examinationId);
    }

    @GetMapping("")
    public List<ExaminationResponse> getAllExamination() {
        return examinationService.getAllExaminations();
    }

    @PostMapping("")
    public Examination save(@RequestBody ExaminationRequest examinationRequest) {
        return examinationService.saveExamination(examinationRequest);
    }
}
