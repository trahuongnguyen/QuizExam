package com.example.quizexam_student.controller;

import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.service.MarkService;
import com.example.quizexam_student.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mark")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class MarkController {
    private final MarkService markService;
    private final UserService userService;

    @GetMapping
    public List<Mark> getAllMarksByStudentDetailAndScoreNotNull(){
        String email = ((org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userService.findUserByEmail(email);
        return markService.getListScoredBySubject(user.getStudentDetail());
    }

    @GetMapping("/{examId}")
    public Mark getOneScoreByExam(@PathVariable int examId){
        String email = ((org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userService.findUserByEmail(email);
        return markService.getOneScoredByExam(user.getStudentDetail(), examId);
    }
}
