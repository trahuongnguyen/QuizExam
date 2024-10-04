package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.QuestionRequest;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.Answer;
import com.example.quizexam_student.entity.Question;
import com.example.quizexam_student.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.*;

@RestController
@RequestMapping("/api/question")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
@PreAuthorize("permitAll()")
public class QuestionController {
    private final QuestionService questionService;

    @Value("${uploads.dir}")
    private String uploadDir;

    @GetMapping("/{subjectId}")
    public List<QuestionResponse> getAllQuestionsBySubjectId(@PathVariable int subjectId) {
        return questionService.getAllQuestionsBySubjectId(subjectId);
    }

    @GetMapping("/detail/{id}")
    public QuestionResponse getQuestionById(@PathVariable int id) {
        return questionService.getQuestionById(id);
    }

    @PostMapping(consumes = {MULTIPART_FORM_DATA_VALUE, APPLICATION_JSON_VALUE})
    public List<Question> addQuestions(@RequestParam("files") MultipartFile[] files, @RequestPart("questions") @Valid List<QuestionRequest> questionRequests) throws IOException {
        if (files.length != questionRequests.size()) {
            throw new IllegalArgumentException("Số lượng file không khớp với số lượng câu hỏi.");
        }

        List<Question> savedQuestions = new ArrayList<>();
        for (int i = 0; i < questionRequests.size(); i++) {
            QuestionRequest questionRequest = questionRequests.get(i);
            if (files[i] != null && !files[i].isEmpty()) {
                LocalDate date = LocalDate.now();
                String fileName = UUID.randomUUID() + "_" + date + "_" + files[i].getOriginalFilename();
                Files.copy(files[i].getInputStream(), Paths.get(uploadDir).resolve(fileName));
                questionRequest.setImage(fileName);
            }
            savedQuestions.addAll(questionService.saveQuestions(List.of(questionRequest)));
        }
        return savedQuestions;
    }

    @PutMapping(consumes = {MULTIPART_FORM_DATA_VALUE, APPLICATION_JSON_VALUE}, path = "/{id}")
    public Question editQuestion(@RequestPart(value = "file", required = false) MultipartFile file, @RequestPart("question") @Valid QuestionRequest questionRequest, @PathVariable int id) throws IOException {
        if (file!=null) {
            LocalDate date = LocalDate.now();
            String fileName = UUID.randomUUID() + "_" + date + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), Paths.get(uploadDir).resolve(fileName));
            questionRequest.setImage(fileName);
        }
        return questionService.updateQuestion(id,questionRequest);
    }


}