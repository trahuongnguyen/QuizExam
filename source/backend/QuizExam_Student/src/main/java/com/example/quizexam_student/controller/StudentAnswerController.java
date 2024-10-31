package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.StudentAnswerRequest;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.service.StudentAnswerService;
import com.example.quizexam_student.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student-answers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class StudentAnswerController {
    private final StudentAnswerService studentAnswerService;

    private final UserService userService;

    @PostMapping
    public StudentAnswerRequest submitAnswer(@RequestBody StudentAnswerRequest studentAnswerRequest) {
        return studentAnswerService.saveStudentAnswers(studentAnswerRequest);
    }

    @GetMapping("/score-level/{examId}")
    public Map<String, Integer> scoreByLevel(@PathVariable int examId) {
        String email = ((org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userService.findUserByEmail(email);
        return studentAnswerService.scoreByLevel(user.getStudentDetail(), examId);
    }
}